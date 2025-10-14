const Joi = require("joi");
const { Form } = require("../../../models/index");
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const formController = {
  // CREATE FORM
  async createForm(req, res, next) {
    const formSchema = Joi.object({
      serviceName: Joi.string().required(),
    });

    const { error } = formSchema.validate(req.body);
    if (error) return next(error);

    const { serviceName } = req.body;

    try {
      const existingForm = await Form.findOne({ where: { serviceName } });
      if (existingForm) {
        return next({ status: 400, message: "Service name already exists" });
      }

      const newForm = await Form.create({
        serviceName,
        createdBy: req.user.id
      });

      return res.status(201).json({ form: newForm });
    } catch (error) {
      return next(error);
    }
  },

  // GET ALL FORMS
  async getAll(req, res, next) {
    try {
      const forms = await Form.findAll({
        order: [['createdAt', 'DESC']]
      });
      return res.json({ allForm: forms });
    } catch (error) {
      return next(error);
    }
  },

  // GET ALL ACTIVE FORMS - ADD THIS MISSING METHOD
  async getAllActive(req, res, next) {
    try {
      const forms = await Form.findAll({
        where: { status: "Active" },
        order: [['createdAt', 'DESC']]
      });
      return res.json({ allForm: forms });
    } catch (error) {
      return next(error);
    }
  },

  // GET ALL SERVICE NAMES
  async getAllServiceNames(req, res, next) {
    try {
      const serviceNames = await Form.findAll({
        attributes: ['id', 'serviceName']
      });
      return res.json({ serviceNames });
    } catch (error) {
      return next(error);
    }
  },

  // GET FORM BY ID
  async getById(req, res, next) {
    const getByIdSchema = Joi.object({
      id: Joi.string().pattern(uuidPattern).required(),
    });

    const { error } = getByIdSchema.validate(req.params);
    if (error) return next(error);

    const { id } = req.params;

    try {
      const form = await Form.findByPk(id);
      if (!form) return next({ status: 404, message: "Form not found" });

      return res.json({ form });
    } catch (error) {
      return next(error);
    }
  },

  // UPDATE FORM
  async update(req, res, next) {
    const updateSchema = Joi.object({
      id: Joi.string().pattern(uuidPattern).required(),
      serviceName: Joi.string().required(),
      status: Joi.string().valid("Active", "Deactive").required(),
    });

    const { error } = updateSchema.validate(req.body);
    if (error) return next(error);

    const { id, serviceName, status } = req.body;

    try {
      const form = await Form.findByPk(id);
      if (!form) return next({ status: 404, message: "Form not found" });

      const existingForm = await Form.findOne({
        where: {
          serviceName,
          id: { [require("sequelize").Op.ne]: id }
        }
      });
      
      if (existingForm) {
        return next({ status: 400, message: "Service name already exists" });
      }

      await Form.update(
        { serviceName, status },
        { where: { id } }
      );

      const updatedForm = await Form.findByPk(id);
      return res.json({ form: updatedForm });
    } catch (error) {
      return next(error);
    }
  },

  // DELETE FORM
  async delete(req, res, next) {
    const deleteSchema = Joi.object({
      id: Joi.string().pattern(uuidPattern).required()
    });

    const { error } = deleteSchema.validate(req.params);
    if (error) return next(error);

    const { id } = req.params;

    try {
      const form = await Form.findByPk(id);
      if (!form) return next({ status: 404, message: "Form not found" });

      await Form.destroy({ where: { id } });
      return res.json({ message: "Form deleted successfully" });
    } catch (error) {
      return next(error);
    }
  }
};

module.exports = formController;