const Joi = require("joi");
const FormResponse = require("../../../models/technician/FormResponse/FormResponse");

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const reportsController = {
  async serviceReport(req, res, next) {
    const serviceReportSchema = Joi.object({
      startDate: Joi.string().isoDate().required(),
      endDate: Joi.string().isoDate().required(),
      plantsId: Joi.array()
        .items(Joi.string().pattern(mongodbIdPattern).required())
        .required(),
      serviceType: Joi.string()
        .valid("inspection", "testing", "maintenance")
        .required(),
    });

    const { error } = serviceReportSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { startDate, endDate, plantsId, serviceType } = req.body;

    try {
      const reports = await FormResponse.find({
        serviceType,
        technicianUserId: req.user._id,
        plantId: { $in: plantsId },
        updatedAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      })
        .populate({ path: "statusUpdatedBy", select: "name" })
        .populate({ path: "assetId", select: "assetId" })
        .populate({ path: "plantId", select: "plantName" })
        .select(
          "assetId managerRemark plantId serviceType status statusUpdatedAt statusUpdatedBy createdAt"
        );
      return res.json(reports);
    } catch (error) {
      return next(error);
    }
  },
};
module.exports = reportsController;
