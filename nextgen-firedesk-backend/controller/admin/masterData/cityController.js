const Joi = require("joi");
const { Op } = require("sequelize");
const { City, State } = require("../../../models/index");
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const cityController = {
  async create(req, res, next) {
    const schema = Joi.object({
      cityName: Joi.string().required(),
      stateId: Joi.string().pattern(uuidPattern).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) return next(error);

    const { cityName, stateId } = req.body;
    try {
      const state = await State.findByPk(stateId);
      if (!state) return next({ status: 400, message: "State not found" });

      const findCity = await City.findOne({ where: { cityName, stateId } });
      if (findCity) return next({ status: 400, message: "City name already exists for this state" });

      const newCity = await City.create({ cityName, stateId, createdBy: req.user?.id || null });
      return res.json({ newCity });
    } catch (error) {
      return next(error);
    }
  },

  async getAll(req, res, next) {
    try {
      const allCity = await City.findAll({
        include: [{ model: State, attributes: ["id", "stateName"] }],
        order: [["createdAt", "DESC"]],
      });
      return res.json({ allCity });
    } catch (error) {
      return next(error);
    }
  },

  async update(req, res, next) {
    const schema = Joi.object({
      id: Joi.string().pattern(uuidPattern).required(),
      cityName: Joi.string().required(),
      stateId: Joi.string().pattern(uuidPattern).required(),
      status: Joi.string().valid("Active", "Deactive").required(),
    });
    const { error } = schema.validate(req.body);
    if (error) return next(error);

    const { id, cityName, stateId, status } = req.body;

    try {
      const state = await State.findByPk(stateId);
      if (!state) return next({ status: 400, message: "State not found" });

      const duplicateCity = await City.findOne({
        where: { cityName, stateId, id: { [Op.ne]: id } },
      });
      if (duplicateCity) return next({ status: 400, message: "City name already exists for this state" });

      const [rowsUpdated] = await City.update(
        { cityName, stateId, status },
        { where: { id } }
      );

      if (rowsUpdated === 0) return next({ status: 404, message: "City not found or no changes applied" });

      const updatedCity = await City.findOne({
        where: { id },
        include: [{ model: State, attributes: ["id", "stateName"] }],
      });

      return res.json({ updatedCity });
    } catch (err) {
      return next(err);
    }
  },

  async delete(req, res, next) {
    const schema = Joi.object({ id: Joi.string().pattern(uuidPattern).required() });
    const { error } = schema.validate(req.params);
    if (error) return next(error);

    const { id } = req.params;

    try {
      const destroyed = await City.destroy({ where: { id } });
      if (!destroyed) return next({ status: 404, message: "City not found" });

      return res.json({ msg: "City deleted successfully" });
    } catch (err) {
      return next(err);
    }
  },

  async getByStateName(req, res, next) {
    const schema = Joi.object({ stateName: Joi.string().required() });
    const { error } = schema.validate(req.params);
    if (error) return next(error);

    const { stateName } = req.params;
    try {
      const state = await State.findOne({ where: { stateName } });
      if (!state) return next({ status: 404, message: "State not found" });

      const cities = await City.findAll({
        where: { stateId: state.id },
        include: [{ model: State, attributes: ["id", "stateName"] }],
        order: [["createdAt", "DESC"]],
      });

      return res.json({ cities });
    } catch (err) {
      return next(err);
    }
  },

  async activeCities(req, res, next) {
    try {
      const cities = await City.findAll({
        where: { status: "Active" },
        include: [{ model: State, attributes: ["id", "stateName"] }],
        order: [["createdAt", "DESC"]],
      });
      return res.json({ cities });
    } catch (err) {
      return next(err);
    }
  },

  async getActiveCitiesByStateName(req, res, next) {
    const schema = Joi.object({ stateName: Joi.string().required() });
    const { error } = schema.validate(req.params);
    if (error) return next(error);

    const { stateName } = req.params;
    try {
      const state = await State.findOne({ where: { stateName } });
      if (!state) return next({ status: 404, message: "State not found" });

      const cities = await City.findAll({
        where: { stateId: state.id, status: "Active" },
        include: [{ model: State, attributes: ["id", "stateName"] }],
        order: [["createdAt", "DESC"]],
      });

      return res.json({ cities });
    } catch (err) {
      return next(err);
    }
  },

  async getByStateId(req, res, next) {
    const schema = Joi.object({ stateId: Joi.string().pattern(uuidPattern).required() });
    const { error } = schema.validate(req.params);
    if (error) return next(error);

    const { stateId } = req.params;
    try {
      const state = await State.findByPk(stateId);
      if (!state) return next({ status: 404, message: "State not found" });

      const cities = await City.findAll({
        where: { stateId },
        include: [{ model: State, attributes: ["id", "stateName"] }],
        order: [["createdAt", "DESC"]],
      });

      return res.json({ cities });
    } catch (err) {
      return next(err);
    }
  },

  async getActiveCitiesByStateId(req, res, next) {
    const schema = Joi.object({ stateId: Joi.string().pattern(uuidPattern).required() });
    const { error } = schema.validate(req.params);
    if (error) return next(error);

    const { stateId } = req.params;
    try {
      const state = await State.findByPk(stateId);
      if (!state) return next({ status: 404, message: "State not found" });

      const cities = await City.findAll({
        where: { stateId, status: "Active" },
        include: [{ model: State, attributes: ["id", "stateName"] }],
        order: [["createdAt", "DESC"]],
      });

      return res.json({ cities });
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = cityController;
