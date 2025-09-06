const Joi = require("joi");
const User = require("../../models/user");
const RefreshToken = require("../../models/token");
const bcrypt = require("bcryptjs");
const UserDTO = require("../../dto/user");
const JWTService = require("../../services/JWTService");
const uploadOnCloudinary = require("../../utils/cloudinary");
const product = require("../../models/admin/product");
const Client = require("../../models/admin/client/Client");
const city = require("../../models/admin/masterData/city");
const Industry = require("../../models/admin/masterData/Industry");

const adminController = {
  // for first time create admin
  async adminCreate(req, res, next) {
    const { name, phone, email, password } = req.body;
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = new User({
        userType: "admin",
        name,
        phone,
        email,
        password: hashedPassword,
      });
      await newUser.save();
      return res.json({ newUser });
    } catch (error) {
      return next(error);
    }
  },
  async login(req, res, next) {
    const adminLoginSchema = Joi.object({
      email: Joi.string()
        .email()
        .required()
        .messages({ "string.email": "Please enter a valid email address" }),
      password: Joi.string().required(),
    });
    const { error } = adminLoginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { email, password } = req.body;

    let admin;
    try {
      admin = await User.findOne({ email });
      if (!admin) {
        const error = {
          status: 400,
          message: "Invalid email try again!",
        };
        return next(error);
      }

      const match = await bcrypt.compare(password, admin.password);
      if (!match) {
        const error = {
          status: 400,
          message: "Invalid Password",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    const accessToken = JWTService.signAccessToken({ _id: admin._id }, "1d");
    const refreshToken = JWTService.signRefreshToken({ _id: admin._id }, "2d");

    // update refresh token in database
    try {
      await RefreshToken.updateOne(
        {
          _id: admin._id,
        },
        { token: refreshToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    // send tokens in cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    const userDto = new UserDTO(admin);

    return res.json({ admin: userDto, auth: true });
  },
  async logout(req, res, next) {
    // 1.delete refresh token from db
    const { refreshToken } = req.cookies;
    try {
      await RefreshToken.deleteOne({ token: refreshToken });
    } catch (error) {
      return next(error);
    }

    // delete cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    // 2.response
    res.status(200).json({ admin: null, auth: false });
  },
  async dashboard(req, res, next) {
    try {
      const totalProducts = await product.countDocuments(); // Total products count
      const totalClients = await Client.countDocuments();
      const totalCitys = await city.countDocuments();
      const totalIndustry = await Industry.countDocuments();
      // const activeProducts = await product.countDocuments({ status: "Active" }); // Active products count
      // const deactiveProducts = await product.countDocuments({
      //   status: "Deactive",
      // }); // Deactive products count

      return res.json({
        totalProducts,
        totalClients,
        totalCitys,
        totalIndustry,
      });
    } catch (error) {
      return next(error);
    }
  },
  async getAdminProfile(req, res, next) {
    try {
      const admin = await User.findOne({ userType: "admin" });
      return res.json({ admin });
    } catch (error) {
      return next(error);
    }
  },
  async editAdmin(req, res, next) {
    const editAdminSchema = Joi.object({
      userType: Joi.string().required(),
      name: Joi.string().required(),
      displayName: Joi.string().required(),
      phone: Joi.string()
        .pattern(/^\d{10}$/)
        .required()
        .messages({
          "string.pattern.base": "Contact number should be 10 digits",
        }),
      email: Joi.string()
        .email()
        .required()
        .messages({ "string.email": "Please enter a valid email address" }),
      currentPassword: Joi.string().optional(),
      newPassword: Joi.string().optional(),
      cNewPassword: Joi.string().optional(),
    });

    const { error } = editAdminSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const {
      userType,
      name,
      displayName,
      profile,
      phone,
      email,
      currentPassword,
      newPassword,
      cNewPassword,
    } = req.body;

    const files = req.files || {};
    const baths = {
      profilePath: files.profile ? files.profile[0].path : undefined,
    };

    let profileUrl;
    if (baths.profilePath) {
      const uploadResult = await uploadOnCloudinary(baths.profilePath);
      profileUrl = uploadResult?.secure_url;
    }

    const findAdmin = await User.findOne({ userType, email });
    if (findAdmin) {
      if (currentPassword && newPassword) {
        const match = await bcrypt.compare(currentPassword, findAdmin.password);
        if (!match) {
          const error = {
            status: 400,
            message: "Invalid current password",
          };
          return next(error);
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        const admin = await User.findOneAndUpdate(
          { _id: findAdmin._id },
          {
            name,
            phone,
            displayName,
            profile: profileUrl || findAdmin.profile,
            password: hashedPassword,
          },
          { new: true, select: "-password" }
        );

        return res.json({ admin, auth: true });
      } else {
        const admin = await User.findOneAndUpdate(
          { _id: findAdmin._id },
          {
            name,
            displayName,
            profile: profileUrl || findAdmin.profile,
            phone,
          },
          { new: true, select: "-password" }
        );

        return res.json({ admin, auth: true });
      }
    } else {
      const error = {
        status: 400,
        message: "Admin not found",
      };
      return next(error);
    }
  },
  async refresh(req, res, next) {
    // 1.get refreshToken from cookies
    // 2.verify refreshToken
    // 3.generate new tokens
    // update db, return response
    const originalRefreshToken = req.cookies.refreshToken;
    let id;
    try {
      id = JWTService.verifyRefreshToken(originalRefreshToken)._id;
    } catch (e) {
      const error = {
        status: 400,
        message: "Unauthorized",
      };
      return next(error);
    }
    try {
      const match = RefreshToken.findOne({
        _id: id,
        token: originalRefreshToken,
      });
      if (!match) {
        const error = {
          status: 400,
          message: "Unauthorized",
        };
        return next(error);
      }
    } catch (e) {
      return next(error);
    }
    try {
      const accessToken = JWTService.signAccessToken({ _id: id }, "10d");
      const refreshToken = JWTService.signRefreshToken({ _id: id }, "20d");

      await RefreshToken.updateOne({ _id: id }, { token: refreshToken });

      res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60 * 24 * 10,
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 20,
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
    } catch (e) {
      return next(e);
    }
    const user = await User.findOne({ _id: id });

    const userDto = new UserDTO(user);
    return res.status(200).json({ user: userDto, auth: true });
  },
};

module.exports = adminController;
