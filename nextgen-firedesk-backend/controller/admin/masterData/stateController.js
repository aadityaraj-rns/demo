const Joi = require("joi");
const { State } = require("../../../models/index");
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const stateController = {
  // CREATE
  async create(req, res, next) {
    const schema = Joi.object({ stateName: Joi.string().required() });
    const { error } = schema.validate(req.body);
    if (error) return next(error);

    const { stateName } = req.body;
    try {
      const existing = await State.findOne({ where: { stateName } });
      if (existing) return next({ status: 400, message: "State name already exists" });

      const newState = await State.create({
        stateName,
        createdBy: req.user.id
      });

      return res.json({ newState });
    } catch (err) {
      return next(err);
    }
  },

  // GET ALL
  async getAll(req, res, next) {
    try {
      const allState = await State.findAll({ order: [["createdAt", "DESC"]] });
      return res.json({ allState });
    } catch (err) {
      return next(err);
    }
  },

  // GET ACTIVE
  async getAllActive(req, res, next) {
    try {
      const allState = await State.findAll({
        where: { status: "Active" },
        order: [["createdAt", "DESC"]]
      });
      return res.json({ allState });
    } catch (err) {
      return next(err);
    }
  },

  // UPDATE
  async update(req, res, next) {
    const schema = Joi.object({
      id: Joi.string().pattern(uuidPattern).required(),
      stateName: Joi.string().required(),
      status: Joi.string().valid("Active", "Deactive").required()
    });
    const { error } = schema.validate(req.body);
    if (error) return next(error);

    const { id, stateName, status } = req.body;
    console.log("Update ID:", id, "Name:", stateName, "Status:", status);

    try {
      // Check uniqueness of stateName for other records
      const duplicate = await State.findOne({ where: { stateName, id: { [require("sequelize").Op.ne]: id } } });
      if (duplicate) return next({ status: 400, message: "State name already exists" });

      const [updatedRows] = await State.update(
        { stateName, status },
        { where: { id } }
      );

      if (!updatedRows) return next({ status: 404, message: "State not found or no changes applied" });

      const updatedState = await State.findByPk(id);
      return res.json({ updatedState });
    } catch (err) {
      return next(err);
    }
  },

  // DELETE
  async delete(req, res, next) {
    const schema = Joi.object({ id: Joi.string().pattern(uuidPattern).required() });
    const { error } = schema.validate(req.params);
    if (error) return next(error);

    const { id } = req.params;
    console.log("Delete ID:", id);

    try {
      const destroyed = await State.destroy({ where: { id } });
      if (!destroyed) return next({ status: 404, message: "State not found" });

      return res.json({ msg: "State deleted successfully" });
    } catch (err) {
      return next(err);
    }
  }
};

module.exports = stateController;
