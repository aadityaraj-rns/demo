// controller/admin/masterData/selfAuditController.js
const Joi = require("joi");
const { sequelize } = require("../../../database/index");
const SelfAudit = require("../../../models/admin/masterData/selfAudit");
const SelfAuditCategory = require("../../../models/admin/masterData/selfAuditCategory");
const SelfAuditQuestion = require("../../../models/admin/masterData/selfAuditQuestion");

const schemaCreate = Joi.object({
  name: Joi.string().required(),
  categories: Joi.array().items(
    Joi.object({
      categoryName: Joi.string().required(),
      questions: Joi.array().items(
        Joi.object({
          questionText: Joi.string().required(),
          questionType: Joi.string().valid("Yes/No", "Input").required()
        })
      ).required()
    })
  ).required()
});

const selfAuditController = {
  // create an audit with categories & questions
  async create(req, res, next) {
    try {
      const { error, value } = schemaCreate.validate(req.body);
      if (error) return next(error);

      const { name, categories } = value;
      const t = await sequelize.transaction();

      try {
        const audit = await SelfAudit.create({ name }, { transaction: t });

        for (const cat of categories) {
          const createdCat = await SelfAuditCategory.create({
            selfAuditId: audit.selfAuditId,
            categoryName: cat.categoryName
          }, { transaction: t });

          if (Array.isArray(cat.questions)) {
            for (const q of cat.questions) {
              await SelfAuditQuestion.create({
                selfAuditCategoryId: createdCat.selfAuditCategoryId,
                questionText: q.questionText,
                questionType: q.questionType
              }, { transaction: t });
            }
          }
        }

        await t.commit();

        const full = await SelfAudit.findByPk(audit.selfAuditId, {
          include: [
            { model: SelfAuditCategory, as: "categories", include: [{ model: SelfAuditQuestion, as: "questions" }] }
          ]
        });

        return res.status(201).json({ selfAudit: full });
      } catch (err) {
        await t.rollback();
        throw err;
      }
    } catch (err) {
      return next(err);
    }
  },

  // get all audits with nested categories & questions
  async getAll(req, res, next) {
    try {
      const audits = await SelfAudit.findAll({
        include: [
          { model: SelfAuditCategory, as: "categories", include: [{ model: SelfAuditQuestion, as: "questions" }] }
        ],
        order: [
          ["created_at", "DESC"],
          [{ model: SelfAuditCategory, as: "categories" }, "self_audit_category_id", "ASC"],
          [{ model: SelfAuditCategory, as: "categories" }, { model: SelfAuditQuestion, as: "questions" }, "self_audit_question_id", "ASC"]
        ]
      });
      return res.json({ audits });
    } catch (err) {
      return next(err);
    }
  },

  // get single audit by id (id is numeric selfAuditId)
  async getById(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (!id) return next({ status: 400, message: "Invalid id" });

      const audit = await SelfAudit.findByPk(id, {
        include: [
          { model: SelfAuditCategory, as: "categories", include: [{ model: SelfAuditQuestion, as: "questions" }] }
        ]
      });
      if (!audit) return next({ status: 404, message: "SelfAudit not found" });
      return res.json({ selfAudit: audit });
    } catch (err) {
      return next(err);
    }
  },

  // update: replace categories & questions (simple reliable approach)
  async update(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (!id) return next({ status: 400, message: "Invalid id" });

      const { error, value } = schemaCreate.validate(req.body); // same schema (requires name+categories)
      if (error) return next(error);

      const { name, categories } = value;

      const t = await sequelize.transaction();
      try {
        const audit = await SelfAudit.findByPk(id, { transaction: t });
        if (!audit) {
          await t.rollback();
          return next({ status: 404, message: "SelfAudit not found" });
        }

        // update audit name
        audit.name = name;
        await audit.save({ transaction: t });

        // remove existing questions and categories for this audit
        const existingCats = await SelfAuditCategory.findAll({ where: { selfAuditId: id }, transaction: t });
        const catIds = existingCats.map(c => c.selfAuditCategoryId);
        if (catIds.length) {
          await SelfAuditQuestion.destroy({ where: { selfAuditCategoryId: catIds }, transaction: t });
        }
        await SelfAuditCategory.destroy({ where: { selfAuditId: id }, transaction: t });

        // recreate categories and questions
        for (const cat of categories) {
          const createdCat = await SelfAuditCategory.create({
            selfAuditId: id,
            categoryName: cat.categoryName
          }, { transaction: t });

          if (Array.isArray(cat.questions)) {
            for (const q of cat.questions) {
              await SelfAuditQuestion.create({
                selfAuditCategoryId: createdCat.selfAuditCategoryId,
                questionText: q.questionText,
                questionType: q.questionType
              }, { transaction: t });
            }
          }
        }

        await t.commit();

        const full = await SelfAudit.findByPk(id, {
          include: [
            { model: SelfAuditCategory, as: "categories", include: [{ model: SelfAuditQuestion, as: "questions" }] }
          ]
        });

        return res.json({ selfAudit: full });
      } catch (err) {
        await t.rollback();
        throw err;
      }
    } catch (err) {
      return next(err);
    }
  },

  // delete
  async delete(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (!id) return next({ status: 400, message: "Invalid id" });

      const t = await sequelize.transaction();
      try {
        const audit = await SelfAudit.findByPk(id, { transaction: t });
        if (!audit) {
          await t.rollback();
          return next({ status: 404, message: "SelfAudit not found" });
        }

        // delete questions => categories => audit
        const cats = await SelfAuditCategory.findAll({ where: { selfAuditId: id }, transaction: t });
        const catIds = cats.map(c => c.selfAuditCategoryId);
        if (catIds.length) {
          await SelfAuditQuestion.destroy({ where: { selfAuditCategoryId: catIds }, transaction: t });
        }
        await SelfAuditCategory.destroy({ where: { selfAuditId: id }, transaction: t });
        await audit.destroy({ transaction: t });

        await t.commit();
        return res.json({ message: "SelfAudit deleted" });
      } catch (err) {
        await t.rollback();
        throw err;
      }
    } catch (err) {
      return next(err);
    }
  }
};

module.exports = selfAuditController;
