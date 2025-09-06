const Joi = require("joi");
const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const ClientDTO = require("../../dto/client");
const Client = require("../../models/admin/client/Client");
const Category = require("../../models/admin/masterData/category");
const sendSMS = require("../../utils/sendSMS");

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const clientController = {
  async create(req, res, next) {
    const createClientSchema = Joi.object({
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
      branchName: Joi.string().optional(),
      cityId: Joi.string().regex(mongodbIdPattern).required(),
      industryId: Joi.string().regex(mongodbIdPattern).required(),
      clientType: Joi.string().valid("organization").required(),
      categoryId: Joi.array()
        .items(Joi.string().pattern(mongodbIdPattern).required())
        .required(),
      //   password: Joi.string().required(),
      gst: Joi.string().allow("").optional(),
      address: Joi.string().optional(),
      pincode: Joi.string().optional(),
    });

    const { error } = createClientSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const {
      name,
      contactNo,
      email,
      branchName,
      cityId,
      industryId,
      clientType,
      categoryId,
      //   password,
      gst,
      pincode,
      address,
    } = req.body;

    const findClient = await User.findOne({
      userType: clientType,
      $or: [{ phone: contactNo }, { email: email }],
    });

    if (findClient) {
      const error = {
        status: 400,
        message: "Client with same email/contactNo is already available",
      };
      return next(error);
    }
    let createdByPartnerUserId = req.user._id;

    try {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let password = "";
      for (let i = 0; i < 8; i++) {
        password += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const totalUsers = await User.countDocuments({
        userType: clientType,
      });
      let loginPrefix;
      if (clientType === "organization") {
        loginPrefix = "ORG";
      }
      // else if (clientType === "partner") {
      //     loginPrefix = "FDPTNR";
      // }
      const newUser = new User({
        userType: clientType,
        name,
        phone: contactNo,
        email,
        password: hashedPassword,
        loginID: `${loginPrefix}${(totalUsers + 1)
          .toString()
          .padStart(4, "0")}`,
      });
      await newUser.save();

      sendSMS(
        contactNo,
        `Dear ${name}, your Firedesk account has been successfully created. Your User ID is ${newUser.loginID} and your Password is ${password}. Log in to manage your assets and services efficiently. For assistance, contact admin. - Team LEISTUNG TECHNOLOGIES`
      );

      const categories = categoryId.map((id) => ({
        categoryId: id,
      }));
      const newClient = new Client({
        userId: newUser._id,
        branchName,
        cityId,
        industryId,
        clientType,
        categories,
        gst,
        address,
        pincode,
        createdByPartnerUserId,
      });
      await newClient.save();

      await newClient.populate("userId");
      await newClient.populate({ path: "cityId", populate: "stateId" });
      await newClient.populate("industryId");
      await newClient.populate("categories.categoryId");

      const clientDTO = new ClientDTO(newClient);

      return res.json({ newClient: clientDTO });
    } catch (error) {
      return next(error);
    }
  },

  async getAll(req, res, next) {
    try {
      const clients = await Client.find({
        createdByPartnerUserId: req.user._id,
      })
        .sort({ createdAt: -1 })
        .populate("userId")
        .populate("industryId")
        .populate({ path: "cityId", populate: "stateId" })
        .populate("categories.categoryId")
        .exec();

      const clientsDto = clients.map((client) => new ClientDTO(client));
      return res.json({ clients: clientsDto });
    } catch (error) {
      console.error(error); // Log the error for better debugging
      return next(error);
    }
  },

  async editClient(req, res, next) {
    const editClientSchema = Joi.object({
      _id: Joi.string().regex(mongodbIdPattern).required(),
      name: Joi.string().required(),
      branchName: Joi.string().optional(),
      cityId: Joi.string().regex(mongodbIdPattern).required(),
      industryId: Joi.string().regex(mongodbIdPattern).required(),
      clientType: Joi.string().valid("partner", "organization").required(),
      categoryId: Joi.array().items(
        Joi.string().regex(mongodbIdPattern).required()
      ),
      status: Joi.string().required(),
      gst: Joi.string().allow("").optional(),
      address: Joi.string().optional(),
      pincode: Joi.string().optional(),
    });

    const { error } = editClientSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const {
      _id,
      name,
      branchName,
      cityId,
      industryId,
      categoryId,
      status,
      gst,
      address,
      pincode,
    } = req.body;

    try {
      const findClient = await Client.findOne({ _id });
      const categories = categoryId.map((id) => {
        const existingCategory = findClient.categories.find(
          (category) => category.categoryId.toString() === id.toString()
        );

        return {
          categoryId: id,
          ...(existingCategory && existingCategory.serviceDetails
            ? { serviceDetails: existingCategory.serviceDetails }
            : {}),
        };
      });

      if (!findClient) {
        return res.status(400).json({ msg: "client not found" });
      } else {
        const userId = findClient.userId;
        await Client.updateOne(
          { _id },
          {
            branchName,
            cityId,
            industryId,
            categories,
            gst,
            address,
            pincode,
          }
        );
        await User.updateOne({ _id: userId }, { status, name });

        return res.status(200).json({ msg: "Client updated" });
      }
    } catch (error) {
      return next(error);
    }
  },

  async getActiveCategoriesForPartner(req, res, next) {
    try {
      // Assuming partnerId is passed in req.params or req.user
      const partnerId = req.user._id;

      // Fetch the partner's data and populate the category details (categoryId and categoryName)
      const partner = await Client.findOne({ userId: partnerId })
        .populate({
          path: "categories.categoryId",
          select: "_id categoryName", // Select only _id and categoryName
          match: { status: "Active" }, // Filter only active categories
        })
        .select("categories");

      const filteredCategories = partner.categories.filter(
        (category) => category.categoryId !== null
      );
      return res.json({ allCategory: filteredCategories });
    } catch (error) {
      return next(error);
    }
  },

  async getPartnerProfile(req, res, next) {
    try {
      const partner = await Client.findOne({
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

      return res.json({ partner });
    } catch (error) {
      return next(error);
    }
  },

  async editPartnerProfile(req, res, next) {
    const editPartnerSchema = Joi.object({
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
      cityId: Joi.string().required(),
      currentPassword: Joi.string().optional(),
      newPassword: Joi.string().optional(),
      cNewPassword: Joi.string().optional(),
      gst: Joi.string().optional(),
      address: Joi.string().optional(),
      pincode: Joi.string().optional(),
    });

    const { error } = editPartnerSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const {
      userType,
      name,
      phone,
      email,
      // stateId,
      cityId,
      currentPassword,
      newPassword,
      cNewPassword,
      gst,
      address,
      pincode,
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

    const findPartner = await User.findOne({ userType, email });

    if (findPartner) {
      if (currentPassword && newPassword) {
        const match = await bcrypt.compare(
          currentPassword,
          findPartner.password
        );
        if (!match) {
          const error = {
            status: 400,
            message: "Invalid current password",
          };
          return next(error);
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        const partner = await User.findOneAndUpdate(
          { _id: findPartner._id },
          {
            name,
            phone,
            email,
            // stateId,
            cityId,
            gst,
            profile: profileUrl || findPartner.profile,
            password: hashedPassword,
          },
          { new: true, select: "-password" }
        );
        const client = await Client.findOneAndUpdate(
          {
            userId: req.user._id,
          },
          {
            // stateId,
            cityId,
            gst,
            address,
            pincode,
          }
        );
        return res.json({ partner, auth: true });
      } else {
        const partner = await User.findOneAndUpdate(
          { _id: findPartner._id },
          {
            name,
            email,
            profile: profileUrl || findPartner.profile,
            phone,
          },
          { new: true, select: "-password" }
        );
        const client = await Client.findOneAndUpdate(
          {
            userId: req.user._id,
          },
          {
            // stateId,
            cityId,
            gst,
            address,
            pincode,
          }
        );

        return res.json({ partner, auth: true });
      }
    } else {
      const error = {
        status: 400,
        message: "partner not found",
      };
      return next(error);
    }
  },
  async dashboardData(req, res, next) {
    try {
      const totalCustomer = await Client.countDocuments({
        createdByPartnerUserId: req.user._id,
      });
      return res.json({ totalCustomer });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = clientController;
