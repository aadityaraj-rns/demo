const Joi = require("joi");
const Audit = require("../../../models/organization/audit/Audit");
const uploadOnCloudinary = require("../../../utils/cloudinary");
const selfAudit = require("../../../models/admin/masterData/selfAudit");
const OrgSelfAuditForm = require("../../../models/organization/audit/OrgSelfAuditForm");
const Plant = require("../../../models/organization/plant/Plant");
const Manager = require("../../../models/organization/manager/Manager");

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const auditController = {
  async createAudit(req, res, next) {
    const auditSchema = Joi.object({
      nameOfAudit: Joi.string().required(),
      plantId: Joi.string().pattern(mongodbIdPattern).required(),
      description: Joi.string().required(),
      auditorName: Joi.string().required(),
      file: Joi.string().optional(),
    });

    const { error } = auditSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { nameOfAudit, plantId, description, auditorName, file } = req.body;

    const files = req.files;

    if (!files || !files.file || !files.file[0]) {
      return res.status(400).json({ error: "Audit Document is required" });
    }

    const filePath = files.file[0].path;

    try {
      const uploadedFile = await uploadOnCloudinary(filePath);
      let orgUserId = req.user._id;
      if (req.user.userType === "manager") {
        const org = await Manager.findOne({ userId: req.user._id })
          .populate({
            path: "orgUserId",
            select: "_id",
          })
          .select("orgUserId");

        orgUserId = org.orgUserId._id;
      }
      const newAudit = new Audit({
        orgUserId,
        nameOfAudit,
        plantId,
        auditorName,
        description,
        file: uploadedFile.secure_url,
      });
      await newAudit.save();
      return res.json({ newAudit });
    } catch (error) {
      return next(error);
    }
  },

  async getSelfAuditQuestions(req, res, next) {
    try {
      const selfAuditQuestions = await selfAudit.findOne({});
      // const selfAuditQuestions = await selfAudit.find({});
      return res.json({ selfAuditQuestions });
    } catch (error) {
      return next(error);
    }
  },

  async getAudits(req, res, next) {
    try {
      let auditQuery = { orgUserId: req.user._id };
      if (req.user.userType === "manager") {
        const org = await Manager.findOne({ userId: req.user._id })
          .populate({
            path: "orgUserId",
            select: "_id",
          })
          .select("orgUserId");
        const plants = await Plant.find({ managerId: org._id }).select("_id");

        auditQuery = {
          orgUserId: org.orgUserId._id,
          plantId: { $in: plants.map((plant) => plant._id) },
        };
      }
      const audits = await Audit.find(auditQuery).sort({
        createdAt: -1,
      });
      return res.json({ audits });
    } catch (error) {
      return next(error);
    }
  },

  async saveSelfAuditFormData(req, res, next) {
    const validationSchema = Joi.object({
      categories: Joi.array()
        .items(
          Joi.object({
            categoryName: Joi.string().required(),
            questions: Joi.array()
              .items(
                Joi.object({
                  questionText: Joi.string().required(),
                  ans: Joi.alternatives()
                    .try(Joi.number().valid(0, 1), Joi.string())
                    .required(),
                })
              )
              .required(),
          })
        )
        .required(),
      workPlace: Joi.string().required(),
      inspectorName: Joi.string().required(),
      additionalNotes: Joi.string().optional(),
    });

    const { error } = validationSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { categories, workPlace, inspectorName, additionalNotes } = req.body;

    let orgUserId = req.user._id;

    if (req.user.userType === "manager") {
      const org = await Manager.findOne({ userId: req.user._id })
        .populate({
          path: "orgUserId",
          select: "_id",
        })
        .select("orgUserId");

      orgUserId = org.orgUserId._id;
    }
    const orgSelfAuditForm = new OrgSelfAuditForm({
      orgUserId,
      categories,
      workPlace,
      inspectorName,
      additionalNotes,
    });
    const savedSelfAudit = await orgSelfAuditForm.save();
    return res.json(savedSelfAudit);

    // const { userId, answers, workPlace, inspectorName, additionalNotes } =
    //   req.body;

    // // Basic validation to ensure userId and answers are present
    // if (
    //   !inspectorName ||
    //   !workPlace ||
    //   !userId ||
    //   !Array.isArray(answers) ||
    //   answers.length === 0
    // ) {
    //   return res.status(400).send({ error: "Invalid submission data" });
    // }

    // const schema = Joi.array().items(
    //   Joi.object({
    //     categoryId: Joi.string().required(),
    //     questionId: Joi.string().required(),
    //     answer: Joi.alternatives()
    //       .try(Joi.number().valid(0, 1), Joi.string())
    //       .required(),
    //   })
    // );

    // const { error } = schema.validate(answers);

    // if (error) {
    //   return next(error);
    // }

    // try {
    //   // Save each audit record to the database
    //   // Create a new self-audit form document with userId and answers
    //   const selfAuditDocument = new OrgSelfAuditForm({
    //     userId, // Include userId once in the main document
    //     selfAuditForm: answers, // Array of answers
    //     inspectorName,
    //     workPlace,
    //     additionalNotes,
    //   });

    //   // Save the document to the database
    //   const newAudit = await selfAuditDocument.save();
    //   return res.json({ newAudit });
    // } catch (error) {
    //   return next(error);
    // }
  },

  async getSelfAuditResponses(req, res, next) {
    try {
      const audits = await OrgSelfAuditForm.find({
        orgUserId: req.user._id,
      }).sort({ createdAt: -1 });
      return res.json(audits);
    } catch (error) {
      return next(error);
    }
  },

  async getSelfAuditsById(req, res, next) {
    try {
      let orgUserId = req.user._id;
      if (req.user.userType === "manager") {
        const org = await Manager.findOne({ userId: req.user._id })
          .populate({
            path: "orgUserId",
            select: "_id",
          })
          .select("orgUserId");

        orgUserId = org.orgUserId._id;
      }

      const audits = await OrgSelfAuditForm.find({
        orgUserId,
      })
        .sort({ createdAt: -1 })
        .select("inspectorName workPlace categories createdAt");
      const auditsWithMarks = audits.map((audit) => {
        let marks = 0;
        let totalQuestions = 0;

        audit.categories.forEach((category) => {
          category.questions.forEach((question) => {
            if (question.ans === 1) {
              marks += 1;
            }
            if (question.ans === 1 || question.ans === 0) {
              totalQuestions += 1;
            }
          });
        });

        return {
          _id: audit._id,
          inspectorName: audit.inspectorName,
          workPlace: audit.workPlace,
          createdAt: audit.createdAt,
          marks: marks,
          totalQuestions: totalQuestions,
        };
      });

      return res.json(auditsWithMarks);
    } catch (error) {
      return next(error);
    }
  },

  async getSelfAuditDetail(req, res, next) {
    const auditId = req.params.auditId;
    try {
      const auditDetails = await OrgSelfAuditForm.findOne({ _id: auditId });
      return res.json(auditDetails);
    } catch (error) {
      return next(error);
    }
  },
};
module.exports = auditController;
