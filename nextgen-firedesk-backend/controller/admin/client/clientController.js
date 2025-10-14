const bcrypt = require("bcryptjs");
const Joi = require("joi");
const { Op } = require("sequelize");
const User = require("../../../models/user");
const Client = require("../../../models/admin/client/Client");
const ClientDTO = require("../../../dto/client");
const Technician = require("../../../models/organization/technician/Technician");
const Asset = require("../../../models/organization/asset/Asset");
const Ticket = require("../../../models/organization/ticket/Ticket");
const Plant = require("../../../models/organization/plant/Plant");
const sendSMS = require("../../../utils/sendSMS");

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
    const schema = Joi.object({
      name: Joi.string().required(),
      contactNo: Joi.string()
        .pattern(/^\d{10}$/)
        .required(),
      email: Joi.string().email().required(),
      branchName: Joi.string().allow("").optional(),
      cityId: Joi.string().required(),
      clientType: Joi.string().valid("partner", "organization").required(),
      categoryId: Joi.array().items(Joi.string().required()).required(),
      gst: Joi.string().allow("").optional(),
      industryId: Joi.string().allow(null).optional(),
      address: Joi.string().allow("").optional(),
      pincode: Joi.string().allow("").optional(),
    });

    const { error } = schema.validate(req.body);
    if (error) return next(error);

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
      address,
      pincode,
    } = req.body;

    try {
      // Check existing user
      const existingUser = await User.findOne({
        where: {
          userType: clientType,
          [Op.or]: [{ phone: contactNo }, { email }],
        },
      });
      if (existingUser)
        return next({
          status: 400,
          message: "Client with same email/contactNo is already available",
        });

      // Generate password
      const password = await clientController.generateRandomPassword();
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate loginID
      const totalUsers = await User.count({ where: { userType: clientType } });
      const loginPrefix = clientType === "organization" ? "ORG" : "FDPTNR";
      const loginID = `${loginPrefix}${(totalUsers + 1).toString().padStart(4, "0")}`;

      // Create User
      const newUser = await User.create({
        userType: clientType,
        name,
        phone: contactNo,
        email,
        password: hashedPassword,
        loginID,
      });

      // Send SMS
      sendSMS(
        contactNo,
        `Dear ${name}, your Firedesk account has been successfully created. Your User ID is ${loginID} and your Password is ${password}.`
      );

      // Create Client
      const newClient = await Client.create({
        userId: newUser.id,
        branchName,
        cityId,
        industryId,
        clientType,
        gst,
        address,
        pincode,
      });

      // Handle categories (assumes ClientCategory is a join table in Sequelize)
      if (categoryId && categoryId.length) {
        await newClient.setCategories(categoryId); // Sequelize many-to-many
      }

      // Fetch full client with related data
      const fullClient = await Client.findByPk(newClient.id, {
        include: [
          { model: User },
          { model: require("../../../models/admin/masterData/City"), include: ["stateId"] },
          { model: require("../../../models/admin/masterData/Industry") },
          { model: require("../../../models/admin/masterData/Category"), through: "ClientCategory" },
        ],
      });

      return res.json({ newClient: new ClientDTO(fullClient) });
    } catch (err) {
      return next(err);
    }
  },

  async getAll(req, res, next) {
    try {
      const clients = await Client.findAll({
        order: [["createdAt", "DESC"]],
        include: [
          { model: User },
          { model: require("../../../models/admin/masterData/City"), include: ["stateId"] },
          { model: require("../../../models/admin/masterData/Industry") },
          { model: require("../../../models/admin/masterData/Category"), through: "ClientCategory" },
          { model: User, as: "createdByPartnerUser", attributes: ["loginID"] },
        ],
      });

      const clientsDto = clients.map((c) => new ClientDTO(c));
      return res.json({ clients: clientsDto });
    } catch (err) {
      return next(err);
    }
  },

  async editClient(req, res, next) {
    try {
      const { _id, name, branchName, cityId, industryId, clientType, categoryId, status, gst, address, pincode } =
        req.body;

      const client = await Client.findByPk(_id, { include: [User] });
      if (!client) return res.status(400).json({ msg: "client not found" });

      await client.update({ branchName, cityId, industryId, gst, address, pincode });
      if (categoryId && categoryId.length) await client.setCategories(categoryId);

      // Update User info
      await client.user.update({ name, status });

      return res.status(200).json({ msg: "Client updated" });
    } catch (err) {
      return next(err);
    }
  },

  async orgProfile(req, res, next) {
    try {
      const { orgUserId } = req.params;
      const organization = await Client.findOne({
        where: { userId: orgUserId },
        include: [
          { model: User, attributes: ["userType", "name", "phone", "email", "loginID", "profile"] },
          { model: require("../../../models/admin/masterData/City"), attributes: ["cityName"] },
        ],
      });

      return res.json({ organization });
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = clientController;
 