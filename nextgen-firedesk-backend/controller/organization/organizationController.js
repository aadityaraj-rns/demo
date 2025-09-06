const Joi = require("joi");
const User = require("../../models/user");
const RefreshToken = require("../../models/token");
const bcrypt = require("bcryptjs");
const UserDTO = require("../../dto/user");
const JWTService = require("../../services/JWTService");
const Manager = require("../../models/organization/manager/Manager");
const ManagerDTO = require("../../dto/ManagerDTO");
const Client = require("../../models/admin/client/Client");
const uploadOnCloudinary = require("../../utils/cloudinary");
const mongoose = require("mongoose");
const Plant = require("../../models/organization/plant/Plant");
const getFormattedCategories = require("./helperfunctions/getFormattedCategories");
const sendSMS = require("../../utils/sendSMS");
const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const organizationController = {
  async login(req, res, next) {
    const organizationLoginSchema = Joi.object({
      loginID: Joi.string().required(),
      password: Joi.string().required(),
    });
    const { error } = organizationLoginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { loginID, password } = req.body;

    let organization;
    try {
      organization = await User.findOne({
        $or: [{ email: loginID }, { loginID: loginID }],
        status: "Active",
      });
      if (!organization) {
        const error = {
          status: 400,
          message: "Invalid loginID try again!",
        };
        return next(error);
      }

      const match = await bcrypt.compare(password, organization.password);
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

    const accessToken = JWTService.signAccessToken(
      { _id: organization._id },
      "10d"
    );
    const refreshToken = JWTService.signRefreshToken(
      { _id: organization._id },
      "20d"
    );

    // update refresh token in database
    try {
      await RefreshToken.updateOne(
        {
          _id: organization._id,
        },
        { token: refreshToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    // send tokens in cookies
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

    const userDto = new UserDTO(organization);

    return res.json({ data: userDto, auth: true });
  },
  async forgotPassword(req, res, next) {
    const forgotPasswordSchema = Joi.object({
      loginID: Joi.string().required(),
    });
    const { error } = forgotPasswordSchema.validate(req.params);

    if (error) {
      return next(error);   
    }

    const { loginID } = req.params;

    try {
      const user = await User.findOne({
        $or: [{ loginID }, { email: loginID }],
        userType: { $in: ["organization", "manager", "admin", "partner"] },
      }).select("-password");
      if (!user) {
        const error = {
          message: "Invalid loginID",
          status: 404,
        };
        return next(error);
      } else {
        const otp = Math.floor(1000 + Math.random() * 9000);
        sendSMS(
          user.phone,
          `Your Firedesk password reset request has been received. Use the OTP ${otp} to reset your password. - Team LEISTUNG TECHNOLOGIES`
        );
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();
        return res.json({
          message: `Otp sent successfully`,
          phoneSlice: user.phone.slice(-4),
        });
      }
    } catch (error) {
      return next(error);
    }
  },
  async verifyOtp(req, res, next) {
    const verifyOtpSchema = Joi.object({
      loginID: Joi.string().required(),
      otp: Joi.number().integer().required(),
    });

    const { error } = verifyOtpSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { loginID, otp } = req.body;

    try {
      const user = await User.findOne({
        $or: [{ loginID }, { email: loginID }],
        userType: { $in: ["organization", "manager", "admin", "partner"] },
      });

      if (!user) {
        const error = {
          message: "Invalid loginID",
          status: 404,
        };
        return next(error);
      }

      const currentTime = Date.now();
      const otpExpiryTime = new Date(user.otpExpiry).getTime();

      if (user.otp !== otp) {
        const error = {
          message: "Invalid OTP",
          status: 400,
        };
        return next(error);
      }
      if (currentTime > otpExpiryTime) {
        const error = {
          message: "OTP expired try again",
          status: 400,
        };
        return next(error);
      }

      user.otp = null;
      user.otpExpiry = null;
      await user.save();

      return res.json({
        message: "OTP verified successfully",
        userType: user.userType,
        loginID: user.loginID || user.email,
      });
    } catch (error) {
      return next(error);
    }
  },
  async changePassword(req, res, next) {
    const changePasswordSchema = Joi.object({
      loginID: Joi.string().required(),
      newPassword: Joi.string().required(),
    });

    const { error } = changePasswordSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { loginID, newPassword } = req.body;

    try {
      const user = await User.findOne({
        $or: [{ loginID }, { email: loginID }],
        userType: { $in: ["organization", "manager", "admin", "partner"] },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isSamePassword = await bcrypt.compare(newPassword, user.password);

      if (isSamePassword) {
        return res.status(400).json({
          message: "New password must be different from the current password",
        });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      user.password = hashedPassword;
      await user.save();

      return res.json({
        user,
        message: "Password updated successfully",
      });
    } catch (error) {
      return next(error);
    }
  },
  async getOrganizationProfile(req, res, next) {
    try {
      let organization;
      if (req.user.userType == "organization") {
        organization = await Client.findOne({
          userId: req.user._id,
        })
          .populate({
            path: "userId",
            select:
              "userType name phone email loginID profile gst address pincode",
          })
          .populate({
            path: "cityId",
            select: "cityName stateId",
            populate: {
              path: "stateId",
              select: "stateName",
            },
          });
      } else if (req.user.userType == "manager") {
        organization = await Manager.findOne({ userId: req.user._id }).populate(
          [
            {
              path: "userId",
              select:
                "userType name phone email loginID profile gst address pincode",
            },
          ]
        );
      }
      return res.json({ organization });
    } catch (error) {
      return next(error);
    }
  },
  async editOrgProfile(req, res, next) {
    const editOrganizationSchema = Joi.object({
      _id: Joi.string().pattern(mongodbIdPattern).required(),
      userType: Joi.string().required(),
      name: Joi.string().required(),
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
      // stateId: Joi.string().required(),
      cityId: Joi.string().optional(),
      // currentPassword: Joi.string().optional(),
      // newPassword: Joi.string().optional(),
      // cNewPassword: Joi.string().optional(),
      gst: Joi.string().optional(),
      address: Joi.string().optional(),
      pincode: Joi.string().optional(),
    });

    const { error } = editOrganizationSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    console.log(req.body);

    const { userType, email, _id, name, phone, gst } = req.body;

    const files = req.files || {};
    const baths = {
      profilePath: files.profile ? files.profile[0].path : undefined,
    };

    let profileUrl;
    if (baths.profilePath) {
      const uploadResult = await uploadOnCloudinary(baths.profilePath);
      profileUrl = uploadResult?.secure_url;
    }

    const findOrganization = await User.findById(_id);

    if (!findOrganization) {
      const error = {
        status: 400,
        message: "Organization not found",
      };
      return next(error);
    }
    const organization = await User.findOneAndUpdate(
      { _id: findOrganization._id },
      {
        name,
        phone,
        email,
        profile: profileUrl || findOrganization.profile,
      },
      { new: true, select: "-password" }
    );
    const client = await Client.findOneAndUpdate(
      {
        userId: _id,
      },
      { gst }
    );

    return res.json({ organization, auth: true });
  },
  async addManager(req, res, next) {
    managerCreateSchema = Joi.object({
      name: Joi.string().required(),
      contactNo: Joi.string()
        .pattern(/^\d{10}$/)
        .required()
        .messages({
          "string.pattern.base": "Contact number should be 10 digits",
        }),
      email: Joi.string()
        .email()
        .required()
        .messages({ "string.email": "Please enter a valid email address" }),
      password: Joi.string().required(),
    });

    const { error } = managerCreateSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { name, contactNo, email, password } = req.body;

    try {
      const findUser = await User.findOne({
        userType: "manager",
        $or: [{ email: email }, { phone: contactNo }],
      });

      if (findUser) {
        const error = {
          message: "Email or contact no already register. Try again!",
        };
        return next(error);
      } else {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const totalManager = await Manager.countDocuments({
          orgUserId: req.user._id,
        });

        const orgNameSlice = req.user.name.toString().slice(0, 2).toUpperCase();
        const newUser = new User({
          userType: "manager",
          name,
          phone: contactNo,
          email,
          password: hashedPassword,
          loginID: `MNGR${(totalManager + 1).toString().padStart(4, "0")}`,
        });
        await newUser.save();

        const newManager = new Manager({
          managerId: `${orgNameSlice}-MGR-${(totalManager + 1)
            .toString()
            .padStart(4, "0")}`,
          userId: newUser._id,
          // cityId,
          orgUserId: req.user._id,
          // address,
        });
        await newManager.save();

        await newManager.populate("userId");
        // await newManager.populate("cityId");

        const managerDto = new ManagerDTO(newManager);

        return res.json({ newManager: managerDto });
      }
    } catch (error) {
      return next(error);
    }
  },
  async allManagers(req, res, next) {
    try {
      let orgUserId = req.user._id;
      if (req.user.userType === "manager") {
        const org = await Manager.findOne({ userId: req.user._id })
          .populate({
            path: "orgUserId",
            select: "userType name phone email loginID",
          })
          .select("orgUserId");
        orgUserId = org.orgUserId._id;
      }
      const managers = await Manager.find({ orgUserId })
        .sort({ createdAt: -1 })
        .populate("userId");

      const categories = await getFormattedCategories(orgUserId);

      const managerDto = await Promise.all(
        managers.map(async (manager) => {
          const plants = await Plant.find(
            { managerId: manager._id },
            "_id plantName"
          );
          return new ManagerDTO(manager, plants, categories);
        })
      );

      return res.json({ managers: managerDto });
    } catch (error) {
      return next(error);
    }
  },
  async allManagerNames(req, res, next) {
    try {
      let managerQuery = { orgUserId: req.user._id };
      if (req.user.userType === "manager") {
        const org = await Manager.findOne({ userId: req.user._id })
          .populate({
            path: "orgUserId",
            select: "userType name phone email loginID",
          })
          .select("orgUserId");
        managerQuery = { orgUserId: org.orgUserId._id, _id: org._id };
      }
      const managers = await Manager.find(managerQuery)
        .sort({ createdAt: -1 })
        .populate({
          path: "userId",
          select: "name status",
          match: { status: "Active" },
        })
        .select("userId");
      const activeManagers = managers.filter(
        (manager) => manager.userId !== null
      );
      const managerDto = await Promise.all(
        activeManagers.map(async (manager) => {
          return new ManagerDTO(manager);
        })
      );

      return res.json({ managers: managerDto });
    } catch (error) {
      return next(error);
    }
  },
  async editManager(req, res, next) {
    editManagerSchema = Joi.object({
      _id: Joi.string().pattern(mongodbIdPattern).required(),
      name: Joi.string().required(),
      // address: Joi.string().required(),
      // cityId: Joi.string().pattern(mongodbIdPattern).required(),
      status: Joi.string().valid("Active", "Deactive").required(),
    });

    const { error } = editManagerSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { _id, name, status } = req.body;

    try {
      const manager = await Manager.findOne({ _id });

      if (!manager) {
        return res.status(404).json({ error: "Manager not found" });
      }

      await User.findOneAndUpdate({ _id: manager.userId }, { name, status });

      const updatedManager = await Manager.findById(manager._id).populate(
        "userId"
      );

      const managerDto = new ManagerDTO(updatedManager);

      return res.json({ updatedManager: managerDto });
    } catch (error) {
      return next(error);
    }
  },
  async SaveHeaderFooterImage(req, res, next) {
    try {
      const files = req.files;
      const userId = req.user._id;
      // Find organization by userId instead of _id
      const organization = await Client.findOne({ userId: userId });
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }

      // Store default values from the database
      const defaultHeaderImage = organization.headerImage;
      const defaultFooterImage = organization.footerImage;

      // Extract header and footer images from uploaded files
      const headerImageFile = files.headerImage ? files.headerImage[0] : null; // Access headerImage if it exists
      const footerImageFile = files.footerImage ? files.footerImage[0] : null; // Access footerImage if it exists

      // Update header image if a new image is provided
      if (headerImageFile) {
        const headerImageUpload = await uploadOnCloudinary(
          headerImageFile.path
        );
        organization.headerImage = headerImageUpload.url; // Update with new URL
      } else {
        // Keep the default if no new file is provided
        organization.headerImage = defaultHeaderImage;
      }

      // Update footer image if a new image is provided
      if (footerImageFile) {
        const footerImageUpload = await uploadOnCloudinary(
          footerImageFile.path
        );
        organization.footerImage = footerImageUpload.url; // Update with new URL
      } else {
        // Keep the default if no new file is provided
        organization.footerImage = defaultFooterImage;
      }

      // Save updated organization to the database
      const updatedOrganization = await organization.save();

      return res.json({
        message: "Header and footer images updated successfully",
        organization: updatedOrganization,
      });
    } catch (error) {
      console.error("Error updating header and footer images:", error);
      return next(new Error("Failed to update header and footer images."));
    }
  },
};

module.exports = organizationController;
