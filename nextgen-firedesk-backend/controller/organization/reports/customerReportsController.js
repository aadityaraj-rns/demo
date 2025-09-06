const Joi = require("joi");
const FormResponse = require("../../../models/technician/FormResponse/FormResponse");
const Client = require("../../../models/admin/client/Client");
const Manager = require("../../../models/organization/manager/Manager");
const Asset = require("../../../models/organization/asset/Asset");
const category = require("../../../models/admin/masterData/category");
const ServiceTickets = require("../../../models/organization/service/ServiceTickets");
const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const customerReportsController = {
  async reports(req, res, next) {
    const reportsSchema = Joi.object({
      startDate: Joi.string().isoDate().required(),
      endDate: Joi.string().isoDate().required(),
      plantId: Joi.string().pattern(mongodbIdPattern).required(),
      serviceType: Joi.string()
        .valid(
          "Inspection",
          "Testing",
          "Maintenance",
          "Re-Filling Reports",
          "HP Test Reports"
        )
        .required(),
      categoryId: Joi.string().required(),
    });

    const { error } = reportsSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { startDate, endDate, plantId, serviceType, categoryId } = req.body;

    try {
      const serviceTickets = await ServiceTickets.find({
        categoryId,
        serviceType,
        plantId,
        completedStatus: { $ne: "Pending" },
        date: { $gte: startDate, $lte: endDate },
      }).populate([
        {
          path: "assetsId",
          populate: { path: "productId", select: "type" },
          select: "productId assetId capacity building location healthStatus",
        },
        { path: "plantId", select: "plantName" },
        { path: "orgUserId", select: "name" },
        { path: "serviceDoneBy", select: "name" },
        // { path: "submittedFormId", select: "-rejectedLogs -serviceTicketId" },
      ]);

      return res.json(serviceTickets);
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = customerReportsController;
