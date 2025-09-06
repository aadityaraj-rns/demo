const Joi = require("joi");
const State = require("../../../models/admin/masterData/state");
const { response } = require("express");
const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const stateController = {
  async create(req, res, next) {
    createStateSchema = Joi.object({
      stateName: Joi.string().required(),
    });

    const { error } = createStateSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { stateName } = req.body;

    findState = await State.findOne({ stateName });
    if (findState) {
      const error = {
        status: 401,
        message: "State name already exist",
      };
      return next(error);
    }
    let newState;

    try {
      newState = new State({
        stateName,
      });
      await newState.save();
    } catch (error) {
      return next(error);
    }

    return res.json({ newState });
  },
  async getAll(req, res, next) {
    try {
      const allState = await State.find({});
      return res.json({ allState });
    } catch (error) {
      return next(error);
    }
  },
  async getAllActive(req, res, next) {
    try {
      const allState = await State.find({status:'Active'});
      return res.json({ allState });
    } catch (error) {
      return next(error);
    }
  },
  async update(req, res, next) {
    updateStateSchema = Joi.object({
      _id: Joi.string().pattern(mongodbIdPattern).required(),
      stateName: Joi.string().required(),
      status: Joi.string().required(),
    });

    const { error } = updateStateSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { stateName, _id, status } = req.body;

    try {
      await State.updateOne({ _id }, { stateName, status });
    } catch (error) {
      return next(error);
    }
    return res.json({ msg: "state updated successfully" });
  },
};
module.exports = stateController;
