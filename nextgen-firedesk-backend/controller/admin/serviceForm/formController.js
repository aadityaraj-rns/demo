const Joi = require("joi");
const Form = require("../../../models/admin/serviceForms/Form");
const Question = require("../../../models/admin/serviceForms/Question");
const Client = require("../../../models/admin/client/Client");
const Manager = require("../../../models/organization/manager/Manager");

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const formController = {
  async createForm(req, res, next) {
    const sectionSchema = Joi.object({
      name: Joi.string().required(),
      testFrequency: Joi.string().optional(),
      serviceType: Joi.string().required(),
      questions: Joi.array().items(Joi.string().required()).required(),
    });

    const formSchema = Joi.object({
      serviceName: Joi.string().required(),
      sections: Joi.array().items(sectionSchema).required(),
    });

    // Validate the input data using Joi
    const { error, value } = formSchema.validate(req.body);
    if (error) {
      console.error("Validation error:", error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    const { serviceName, sections } = value;

    try {
      const form = new Form({ serviceName, sectionName: [] });

      // Iterate through each section
      for (const section of sections) {
        const sectionData = {
          name: section.name,
          testFrequency: section.testFrequency,
          serviceType: section.serviceType,
          questions: [],
        };

        // Create questions and add their IDs to the section
        for (const questionText of section.questions) {
          const newQuestion = new Question({ question: questionText });
          const savedQuestion = await newQuestion.save();
          sectionData.questions.push(savedQuestion._id);
        }

        form.sectionName.push(sectionData);
      }

      // Save the form with all sections and questions
      const savedForm = await form.save();
      const populatedForm = await Form.findById(savedForm._id).populate(
        "sectionName.questions"
      );

      return res.status(201).json(populatedForm);
    } catch (error) {
      console.error("Error creating form:", error);
      return next(error);
    }
  },
  async addQuestionsToSection(req, res, next) {
    const addQuestionsSchema = Joi.object({
      formId: Joi.string().pattern(mongodbIdPattern).required(),
      sectionName: Joi.string().required(),
      questions: Joi.array().items(Joi.string().required()).required(),
    });

    // Validate the input data using Joi
    const { error, value } = addQuestionsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { formId, sectionName, questions } = value;

    try {
      const form = await Form.findById(formId).populate(
        "sectionName.questions"
      );
      if (!form) {
        return res.status(404).json({ error: "Form not found" });
      }

      const existingSection = form.sectionName.find(
        (sec) => sec.name === sectionName
      );
      if (!existingSection) {
        return res.status(404).json({ error: "Section not found" });
      }

      // Add new questions to the existing section
      for (const questionText of questions) {
        const newQuestion = new Question({ question: questionText });
        const savedQuestion = await newQuestion.save();
        existingSection.questions.push(savedQuestion._id);
      }

      // Save the updated form
      const updatedForm = await form.save();
      const populatedForm = await Form.findById(updatedForm._id).populate(
        "sectionName.questions"
      );

      return res.status(200).json(populatedForm);
    } catch (error) {
      return next(error);
    }
  },
  async removeQuestionsFromSection(req, res, next) {
    const removeQuestionsSchema = Joi.object({
      formId: Joi.string().pattern(mongodbIdPattern).required(),
      sectionName: Joi.string().required(),
      questionIds: Joi.array()
        .items(Joi.string().pattern(mongodbIdPattern))
        .required(),
    });

    // Validate the input data using Joi
    const { error, value } = removeQuestionsSchema.validate(req.body);
    if (error) {
      console.error("Validation error:", error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    const { formId, sectionName, questionIds } = value;

    try {
      const form = await Form.findById(formId).populate(
        "sectionName.questions"
      );
      if (!form) {
        return res.status(404).json({ error: "Form not found" });
      }

      const existingSection = form.sectionName.find(
        (sec) => sec.name === sectionName
      );
      if (!existingSection) {
        return res.status(404).json({ error: "Section not found" });
      }

      // Remove questions from the section
      existingSection.questions = existingSection.questions.filter(
        (qId) => !questionIds.includes(qId.toString())
      );

      // Delete the questions from the database
      await Question.deleteMany({ _id: { $in: questionIds } });

      // Save the updated form
      const updatedForm = await form.save();
      const populatedForm = await Form.findById(updatedForm._id).populate(
        "sectionName.questions"
      );

      return res.status(200).json(populatedForm);
    } catch (error) {
      console.error("Error removing questions from section:", error);
      return next(error);
    }
  },
  async getAll(req, res, next) {
    try {
      const forms = await Form.find({}).select("-sectionName");
      return res.json(forms);
    } catch (error) {
      return next(error);
    }
  },
  async getAllServiceNames(req, res, next) {
    try {
      const serviceNames = await Form.find({}, "_id serviceName");
      return res.json({ serviceNames });
    } catch (error) {
      return next(error);
    }
  },
  async getById(req, res, next) {
    getByIdSchema = Joi.object({
      _id: Joi.string().pattern(mongodbIdPattern).required(),
    });

    const { error } = getByIdSchema.validate(req.params);
    const { _id } = req.params;

    try {
      const service = await Form.findOne({ _id }).populate(
        "sectionName.questions"
      );
      const organization = await Client.findOne({
        userId: req.user._id,
      }).select("headerImage footerImage");

      return res.json({ service, organization });
    } catch (error) {
      return next(error);
    }
  },
  async getFormIds(req, res, next) {
    const forms = await Form.find().select("serviceName");
    return res.json(forms);
  },
};

module.exports = formController;
