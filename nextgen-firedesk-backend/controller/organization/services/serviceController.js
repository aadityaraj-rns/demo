const FormResponse = require("../../../models/technician/FormResponse/FormResponse");
const Joi = require("joi");
const Client = require("../../../models/admin/client/Client");
const Category = require("../../../models/admin/masterData/category");
const Form = require("../../../models/admin/serviceForms/Form");
const Ticket = require("../../../models/organization/ticket/Ticket");
const Manager = require("../../../models/organization/manager/Manager");
const Plant = require("../../../models/organization/plant/Plant");
const notification = require("../../../models/Notification");
const pushNotification = require("../../firebasePushNotification/pushNotificationControlleer");
const ServiceTickets = require("../../../models/organization/service/ServiceTickets");
const Asset = require("../../../models/organization/asset/Asset");
const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const serviceController = {
  async getServiceDue(req, res, next) {
    try {
      let organizationId = req.user._id;
      if (req.user.userType === "manager") {
        const org = await Manager.findOne({ userId: req.user._id })
          .populate({
            path: "orgUserId",
            select: "_id",
          })
          .select("orgUserId");

        organizationId = org.orgUserId._id;
      }

      const plants = await Plant.find({ orgUserId: organizationId }).select(
        "_id"
      );

      const groupServiceDatas = await ServiceTickets.find({
        plantId: plants.map((p) => p._id),
        orgUserId: organizationId,
        completedStatus: "Pending",
      })
        .populate([
          { path: "groupServiceId", select: "groupName groupId" },
          { path: "plantId", select: "plantName" },
          {
            path: "assetsId",
            populate: [
              { path: "productId", select: "productName" },
              { path: "technicianUserId", select: "name" },
            ],
            select: "assetId building location productId technicianUserId",
          },
        ])
        .sort({ date: 1 })
        .lean();
      return res.json(groupServiceDatas);
    } catch (error) {
      console.log(error);
    }
  },
  async getServiceSchedules(req, res, next) {
    try {
      let organizationId = req.user._id;
      if (req.user.userType === "manager") {
        const org = await Manager.findOne({ userId: req.user._id })
          .populate({
            path: "orgUserId",
            select: "_id",
          })
          .select("orgUserId");

        organizationId = org.orgUserId._id;
      }
      const { month, year } = req.query;
      const client = await Client.findOne({ userId: organizationId }).lean();

      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      const tickets = await Ticket.find({
        orgUserId: organizationId,
        $expr: {
          $and: [
            { $eq: [{ $month: "$targetDate" }, month] },
            { $eq: [{ $year: "$targetDate" }, year] },
          ],
        },
      })
        .populate({
          path: "assetsId",
          populate: [
            {
              path: "technicianUserId",
              select: "name",
            },
            {
              path: "productId",
              select: "productName description image1 image2",
            },
          ],
          select: "assetId productId location building",
        })
        .sort({ targetDate: -1 });

      const serviceDatas = await ServiceTickets.find({
        orgUserId: client.userId,
        date: {
          $gte: new Date(year, month - 1, 1),
          $lt: new Date(year, month, 1),
        },
        completedStatus: "Pending",
      })
        .populate([
          { path: "groupServiceId", select: "groupName groupId" },
          { path: "plantId", select: "plantName" },
          { path: "assetsId", select: "assetId" },
        ])
        .sort({ date: -1 });

      const formatDate = (d) => d.toISOString().split("T")[0]; // "YYYY-MM-DD"

      const ticketsGrouped = {};
      for (const ticket of tickets) {
        const dateKey = formatDate(ticket.targetDate);
        if (!ticketsGrouped[dateKey]) ticketsGrouped[dateKey] = [];
        ticketsGrouped[dateKey].push(ticket);
      }

      const groupServicesGrouped = {};
      for (const gs of serviceDatas) {
        const dateKey = formatDate(gs.date);
        if (!groupServicesGrouped[dateKey]) groupServicesGrouped[dateKey] = [];
        groupServicesGrouped[dateKey].push(gs);
      }

      // Collect all unique dates
      const allDates = new Set([
        ...Object.keys(ticketsGrouped),
        ...Object.keys(groupServicesGrouped),
      ]);

      // Combine both datasets by date
      const combinedResult = [...allDates].map((date) => {
        const dailyTickets = ticketsGrouped[date] || [];
        const dailyGroupServices = groupServicesGrouped[date] || [];

        return {
          date,
          tickets: dailyTickets,
          serviceDatas: dailyGroupServices,
          title: dailyTickets.length + dailyGroupServices.length,
        };
      });

      // Optional: sort by date descending
      combinedResult.sort((a, b) => new Date(b.date) - new Date(a.date));

      return res.json(combinedResult);
    } catch (error) {
      return next(error);
    }
  },
  async getCompletedServices(req, res, next) {
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

      const plants = await Plant.find({ orgUserId }).select("_id");
      const groupServiceDatas = await ServiceTickets.find({
        plantId: plants.map((p) => p._id),
        orgUserId: orgUserId,
        completedStatus: { $nin: ["Pending", "Lapsed"] },
      })
        .populate([
          { path: "groupServiceId", select: "groupName groupId" },
          { path: "plantId", select: "plantName" },
          {
            path: "assetsId",
            populate: [{ path: "productId", select: "productName" }],
            select: "assetId building location productId",
          },
          { path: "serviceDoneBy", select: "name" },
          { path: "submittedFormId", select: "rejectedLogs geoCheck" },
        ])
        .sort({ updatedAt: -1 })
        .lean();
      return res.json(groupServiceDatas);
    } catch (error) {
      return next(error);
    }
  },
  async getLapsedServices(req, res, next) {
    try {
      let orgUserId = req.user._id;

      // If manager, fetch the organization user ID
      if (req.user.userType === "manager") {
        const org = await Manager.findOne({ userId: req.user._id })
          .populate({
            path: "orgUserId",
            select: "_id",
          })
          .select("orgUserId");

        if (org?.orgUserId?._id) {
          orgUserId = org.orgUserId._id;
        } else {
          return res
            .status(400)
            .json({ message: "Manager's organization not found" });
        }
      }

      // Lapsed Group Services
      const lapsedService = await ServiceTickets.find({
        orgUserId,
        completedStatus: "Lapsed",
      })
        .populate([
          { path: "groupServiceId", select: "groupName groupId" },
          { path: "plantId", select: "plantName" },
          {
            path: "assetsId",
            populate: [
              { path: "productId", select: "productName" },
              { path: "technicianUserId", select: "name" },
            ],
            select: "assetId building location productId technicianUserId",
          },
        ])
        .sort({ updatedAt: -1 });

      // Lapsed Individual Services
      // const lapsedIndividualService = await FormResponse.find({
      //   orgUserId,
      //   status: "Lapsed",
      // })
      //   .populate([
      //     { path: "plantId", select: "plantName" },
      //     {
      //       path: "assetId",
      //       populate: { path: "productId", select: "productName" },
      //       select: "assetId productId building location",
      //     },
      //     {
      //       path: "technicianUserId",
      //       select: "name phone",
      //     },
      //   ])
      //   .select(
      //     "technicianUserId plantId assetId serviceName serviceType status createdAt reportNo"
      //   );

      return res.json({ lapsedService });
    } catch (error) {
      return next(error);
    }
  },
  async getServiceResponseById(req, res, next) {
    const _id = req.params.id;
    try {
      const serviceTicket = await ServiceTickets.findById(_id).populate([
        { path: "categoryId", select: "categoryName" },
        { path: "orgUserId", select: "name" },
        {
          path: "plantId",
          populate: { path: "cityId", select: "cityName" },
          select: "cityId plantName address",
        },
        {
          path: "assetsId",
          populate: { path: "productId", select: "description" },
          select: "productId assetId location building",
        },
        { path: "serviceDoneBy", select: "name" },
        { path: "statusUpdatedBy", select: "name" },
        { path: "submittedFormId" },
      ]);
      return res.json(serviceTicket);
    } catch (error) {
      return next(error);
    }
  },
  async getRejectedServiceForms(req, res, next) {
    const responseId = req.params.id;
    if (!responseId) {
      const error = {
        message: "responseId is required",
        status: "400",
      };
      return next(error);
    }
    try {
      const service = await FormResponse.findById(responseId)
        .select("rejectedLogs serviceTicketId")
        .populate({
          path: "serviceTicketId",
          populate: [
            { path: "categoryId", select: "categoryName" },
            { path: "orgUserId", select: "name" },
            {
              path: "plantId",
              populate: { path: "cityId", select: "cityName" },
              select: "cityId plantName address",
            },
            {
              path: "assetsId",
              populate: { path: "productId", select: "description" },
              select: "productId assetId location building",
            },
            { path: "serviceDoneBy", select: "name" },
            { path: "statusUpdatedBy", select: "name" },
          ],
        })
        .exec();

      return res.json({ service });
    } catch (error) {
      return next(error);
    }
  },
  async updateServiceResponseStatus(req, res, next) {
    const { id } = req.params;
    const statusUpdatedBy = req.user._id;
    const createAssetSchema = Joi.object({
      status: Joi.string().valid("Completed", "Rejected").required(),
      remark: Joi.string().allow("").optional(),
    });

    const { error, value } = createAssetSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { status, remark } = value;

    try {
      const serviceTicket = await ServiceTickets.findOneAndUpdate(
        { _id: id },
        {
          statusUpdatedBy,
          completedStatus: status,
        },
        { new: true }
      )
        .populate([
          { path: "serviceDoneBy", select: "_id deviceToken" },
          { path: "assetsId", select: "assetId" },
        ])
        .select("submittedFormId assetsId serviceType serviceDoneBy");
      await FormResponse.findByIdAndUpdate(serviceTicket.submittedFormId, {
        status,
        managerRemark: remark,
      });
      const message = `Service status changed to ${status} for asset: ${serviceTicket.assetsId
        .map((a) => a.assetId)
        .join(", ")}, Type: ${serviceTicket.serviceFrequency} ${
        serviceTicket.serviceType
      }, manager remark: ${remark} `;
      const newNotification = new notification({
        userId: serviceTicket.serviceDoneBy._id,
        title: "Service Status Update",
        message,
      });
      await newNotification.save();
      pushNotification.sendNotificationDirectly(
        serviceTicket.serviceDoneBy.deviceToken,
        {
          title: "Service Status Update",
          body: message,
        }
      );
      return res.status(200).json({
        message: "Status updated successfully",
        data: serviceTicket,
      });
    } catch (error) {
      return next(error);
    }
  },
  async getMyCategories(req, res, next) {
    try {
      let userId = req.user._id;

      if (req.user.userType === "manager") {
        const org = await Manager.findOne({ userId: req.user._id })
          .populate({
            path: "orgUserId",
            select: "_id",
          })
          .select("orgUserId");

        userId = org.orgUserId._id;
      }

      const categories = await Client.findOne({ userId })
        .populate({
          path: "categories.categoryId",
          select: "categoryName",
        })
        .select("categories");
      return res.json(
        categories.categories.flatMap((category) => category.categoryId)
      );
    } catch (error) {
      return next(error);
    }
  },
  async getMyAllServiceNames(req, res, next) {
    try {
      let userId = req.user._id;

      if (req.user.userType === "manager") {
        const org = await Manager.findOne({ userId: req.user._id })
          .populate({
            path: "orgUserId",
            select: "_id",
          })
          .select("orgUserId");

        userId = org.orgUserId._id;
      }

      const categories = await Client.findOne({ userId })
        .populate({
          path: "categories.categoryId",
          select: "categoryName",
        })
        .select("categories");
      const myCategories = categories.categories.flatMap(
        (category) => category.categoryId._id
      );
      const forms = await Category.find(
        { _id: { $in: myCategories } },
        "formId"
      );
      const formIds = forms.flatMap((form) => form.formId);
      const serviceNames = await Form.find(
        { _id: { $in: formIds } },
        "_id serviceName"
      );
      return res.json({ serviceNames });
    } catch (error) {
      return next(error);
    }
  },
  async getServiceFormByAssetIdServiceTypeServiceFrequency(req, res, next) {
    try {
      const { assetId, serviceType, serviceFrequency } = req.params;
      if (!assetId || !serviceType || !serviceFrequency) {
        return res.status(400).json({
          message: "assetId, serviceType and serviceFrequency are required",
        });
      }
      const asset = await Asset.findById(assetId)
        .populate({
          path: "productCategoryId",
          select: "formId",
          populate: {
            path: "formId",
            populate: {
              path: "sectionName.questions", // this will only work if 'questions' is defined in Form schema as a ref
            },
          },
        })
        .select("productCategoryId");
      const data = asset?.productCategoryId?.formId?.sectionName?.find(
        (a) =>
          a?.serviceType == serviceType &&
          (a?.testFrequency === "" || a?.testFrequency === serviceFrequency)
      );
      return res.json(data);
    } catch (error) {
      return next(error);
    }
  },

  async createOldService(req, res, next) {
    /* ---------- 1. Validation ---------- */
    const createOldServiceSchema = Joi.object({
      date: Joi.date().required(),
      assetId: Joi.string().pattern(mongodbIdPattern).required(),
      status: Joi.string().required(),
      managerRemark: Joi.string().allow("").optional(),
      technicianRemark: Joi.string().allow("").optional(),
      serviceType: Joi.string().required(),
      serviceFrequency: Joi.string().required(),
      technician: Joi.string().required(),
      responses: Joi.array().items(
        Joi.object({
          question: Joi.string().required(),
          answer: Joi.string().required(),
          note: Joi.string().allow("").optional(),
        })
      ),
      sectionName: Joi.string().required(),
    });

    const { error, value } = createOldServiceSchema.validate(req.body);
    if (error) return next(error);

    /* ---------- 2. Destructure ---------- */
    const {
      date,
      assetId,
      status,
      managerRemark,
      technicianRemark,
      serviceType,
      serviceFrequency,
      technician,
      responses,
      sectionName, 
    } = value;

    try {
      /* ---------- 3. Lookup asset ---------- */
      const asset = await Asset.findById(assetId).select(
        "productCategoryId orgUserId plantId"
      );
      if (!asset) return next(ApiError.notFound("Asset not found")); // or any custom helper

      /* ---------- 4. Create service ticket ---------- */
      const service = await ServiceTickets.create({
        individualService: true,
        categoryId: asset.productCategoryId,
        orgUserId: asset.orgUserId,
        plantId: asset.plantId,
        assetsId: [asset._id],
        serviceType,
        serviceFrequency,
        date,
        expireDate: date, // or compute +X days if needed
        completedStatus: status,
        serviceDoneBy: technician,
      });

      /* ---------- 5. Create form response ---------- */
      const formCount = await ServiceTickets.countDocuments({
        completedStatus: { $nin: ["Pending", "Lapsed"] },
        assetsId: assetId,
      });

      const form = await FormResponse.create({
        serviceTicketId: service._id,
        reportNo: `SER-${String(formCount + 1).padStart(4, "0")}`,
        sectionName,
        questions: responses,
        status,
        statusUpdatedAt: date,
        managerRemark,
        technicianRemark,
      });

      /* ---------- 6. Link ticket ↔ form ---------- */
      service.submittedFormId = form._id;
      await service.save();

      /* ---------- 7. Return success ---------- */
      return res.status(200).json({
        message: "Old service recorded",
        serviceId: service._id,
        formId: form._id,
      });
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = serviceController;
