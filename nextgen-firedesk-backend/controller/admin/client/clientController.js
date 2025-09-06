const bcrypt = require("bcryptjs");
const Joi = require("joi");
const User = require("../../../models/user");
const Client = require("../../../models/admin/client/Client");
const ClientDTO = require("../../../dto/client");
const Technician = require("../../../models/organization/technician/Technician");
const Asset = require("../../../models/organization/asset/Asset");
const Ticket = require("../../../models/organization/ticket/Ticket");
const Plant = require("../../../models/organization/plant/Plant");
const sendSMS = require("../../../utils/sendSMS");

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const clientController = {
  async generateRandomPassword(length = 8) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return password;
  },
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
      branchName: Joi.string().allow("").optional(),
      cityId: Joi.string().regex(mongodbIdPattern).required(),
      clientType: Joi.string().valid("partner", "organization").required(),
      categoryId: Joi.array()
        .items(Joi.string().pattern(mongodbIdPattern).required())
        .required(),
      gst: Joi.string().allow("").optional(),
      industryId: Joi.string().regex(mongodbIdPattern).allow(null).optional(),
      address: Joi.string().allow("").optional(),
      pincode: Joi.string().allow("").optional(),
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
      } else if (clientType === "partner") {
        loginPrefix = "FDPTNR";
      }
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
      const clients = await Client.find({})
        .sort({ createdAt: -1 })
        .populate("userId")
        .populate("industryId")
        .populate({ path: "cityId", populate: "stateId" })
        .populate({ path: "createdByPartnerUserId", select: "loginID" })
        .populate("categories.categoryId")
        .exec();

      const clientsDto = clients.map((client) => new ClientDTO(client));
      return res.json({ clients: clientsDto });
    } catch (error) {
      return next(error);
    }
  },
  async editClient(req, res, next) {
    const editClientSchema = Joi.object({
      _id: Joi.string().regex(mongodbIdPattern).required(),
      name: Joi.string().required(),
      branchName: Joi.string().allow("").optional(),
      cityId: Joi.string().regex(mongodbIdPattern).required(),
      industryId: Joi.string().regex(mongodbIdPattern).allow(null).optional(),
      clientType: Joi.string().valid("partner", "organization").required(),
      categoryId: Joi.array().items(
        Joi.string().regex(mongodbIdPattern).required()
      ),
      status: Joi.string().required(),
      gst: Joi.string().allow("").optional(),
      address: Joi.string().allow("").optional(),
      pincode: Joi.string().allow("").optional(),
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
  async getTechnicians(req, res, next) {
    const getTechniciansSchema = Joi.object({
      orgUserId: Joi.string().pattern(mongodbIdPattern).required(),
    });

    const { error } = getTechniciansSchema.validate(req.params);

    if (error) {
      return next(error);
    }

    const { orgUserId } = req.params;
    try {
      const technicians = await Technician.find({ orgId: orgUserId }).populate(
        "userId"
      );
      return res.json({ technicians });
    } catch (error) {
      return next(error);
    }
  },
  async getAssets(req, res, next) {
    const getTechniciansSchema = Joi.object({
      orgUserId: Joi.string().pattern(mongodbIdPattern).required(),
    });

    const { error } = getTechniciansSchema.validate(req.params);

    if (error) {
      return next(error);
    }

    const { orgUserId } = req.params;

    try {
      const assets = await Asset.find({ orgUserId })
        .populate({ path: "productId", select: "productName testFrequency" })
        .populate({ path: "plantId", select: "plantName" });
      return res.json({ assets });
    } catch (error) {
      return next(error);
    }
  },
  async getTickets(req, res, next) {
    const getTechniciansSchema = Joi.object({
      orgUserId: Joi.string().pattern(mongodbIdPattern).required(),
    });

    const { error } = getTechniciansSchema.validate(req.params);

    if (error) {
      return next(error);
    }

    const { orgUserId } = req.params;

    try {
      const tickets = await Ticket.find({ orgUserId }).populate({
        path: "plantId",
        select: "plantName",
      });
      return res.json({ tickets });
    } catch (error) {
      return next(error);
    }
  },
  async getPlants(req, res, next) {
    const getTechniciansSchema = Joi.object({
      orgUserId: Joi.string().pattern(mongodbIdPattern).required(),
    });

    const { error } = getTechniciansSchema.validate(req.params);

    if (error) {
      return next(error);
    }

    const { orgUserId } = req.params;

    try {
      const plants = await Plant.find({ orgUserId })
        .populate({
          path: "cityId",
          select: "cityName",
        })
        .populate({
          path: "managerId",
          populate: { path: "userId", select: "name" },
          select: "userId",
        });
      return res.json({ plants });
    } catch (error) {
      return next(error);
    }
  },
  async orgProfile(req, res, next) {
    const getTechniciansSchema = Joi.object({
      orgUserId: Joi.string().pattern(mongodbIdPattern).required(),
    });

    const { error } = getTechniciansSchema.validate(req.params);

    if (error) {
      return next(error);
    }

    const { orgUserId } = req.params;
    try {
      const organization = await Client.findOne({
        userId: orgUserId,
      })
        .populate({
          path: "userId",
          select: "userType name phone email loginID profile",
        })
        .populate({ path: "cityId", select: "cityName" });

      return res.json({ organization });
    } catch (error) {
      return next(error);
    }
  },
};
module.exports = clientController;
