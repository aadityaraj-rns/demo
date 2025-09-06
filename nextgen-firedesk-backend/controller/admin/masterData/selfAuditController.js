const Joi = require("joi");
const SelfAudit = require("../../../models/admin/masterData/selfAudit");
const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const selfAuditController = {
  async create(req, res, next) {
    const validationSchema = Joi.object({
      categories: Joi.array()
        .items(
          Joi.object({
            categoryName: Joi.string().required(),
            questions: Joi.array()
              .items(
                Joi.object({
                  questionText: Joi.string().required(),
                  questionType: Joi.string()
                    .valid("Yes/No", "Input")
                    .required(), // Validating question type
                })
              )
              .required(),
          })
        )
        .required(),
    });

    const { error } = validationSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { categories } = req.body;

    try {
      const existingSelfAudit = await SelfAudit.findOne();
      if (existingSelfAudit) {
        return res.status(400).json({ message: "SelfAudit already exists" });
      }

      const newSelfAudit = new SelfAudit({
        categories,
      });

      const savedSelfAudit = await newSelfAudit.save();
      return res.json({ savedSelfAudit });
    } catch (error) {
      console.error("Error creating SelfAudit:", error);
      throw error;
    }
  },
  async update(req, res, next) {
    const validationSchema = Joi.object({
      _id: Joi.string().pattern(mongodbIdPattern),
      categories: Joi.array()
        .items(
          Joi.object({
            categoryName: Joi.string().required(),
            questions: Joi.array()
              .items(
                Joi.object({
                  questionText: Joi.string().required(),
                  questionType: Joi.string()
                    .valid("Yes/No", "Input")
                    .required(), // Validating question type
                })
              )
              .required(),
          })
        )
        .required(),
    });

    const { error } = validationSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { categories } = req.body;
    const { _id } = req.params; // Assuming the ID is passed as a URL parameter

    try {
      const existingSelfAudit = await SelfAudit.findById(_id);
      if (!existingSelfAudit) {
        return res.status(404).json({ message: "SelfAudit not found" });
      }

      existingSelfAudit.categories = categories;

      const updatedSelfAudit = await existingSelfAudit.save();
      return res.json({ updatedSelfAudit });
    } catch (error) {
      console.error("Error updating SelfAudit:", error);
      return next(error);
    }
  },
  async getAll(req, res, next) {
    try {
      const selfAuditQuestions = await SelfAudit.findOne({});
      return res.json({ selfAuditQuestions });
    } catch (error) {
      return next(error);
    }
  },
  // async update(req, res, next) {
  //   const updateQuestionSchema = Joi.object({
  //     selfAuditId: Joi.string()
  //       .regex(mongodbIdPattern, "mongodbIdPattern")
  //       .required(),
  //     question: Joi.string().required(),
  //     questionType: Joi.string().required(),
  //     status: Joi.string().required(),
  //   });

  //   const { error } = updateQuestionSchema.validate(req.body);

  //   if (error) {
  //     return next(error);
  //   }

  //   const { selfAuditId, question, questionType, status } = req.body;

  //   try {
  //     const findQuestion = await SelfAudit.findOne({ _id: selfAuditId });

  //     if (!findQuestion) {
  //       const error = {
  //         status: 404,
  //         message: "Question not found",
  //       };
  //       return next(error);
  //     }
  //     await SelfAudit.updateOne(
  //       { _id: selfAuditId },
  //       {
  //         question,
  //         questionType,
  //         status,
  //       }
  //     );

  //     return res.json({ msg: "Question updated" });
  //   } catch (error) {
  //     return next(error);
  //   }
  // },
};
module.exports = selfAuditController;
