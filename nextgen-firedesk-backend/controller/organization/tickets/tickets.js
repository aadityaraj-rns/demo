const Joi = require("joi");
const Ticket = require("../../../models/organization/ticket/Ticket");
const OrgTicketsDTO = require("../../../dto/OrgTicketsDTO");
const Asset = require("../../../models/organization/asset/Asset");
const TicketResponse = require("../../../models/organization/ticket/TicketResponse");
const Manager = require("../../../models/organization/manager/Manager");
const Plant = require("../../../models/organization/plant/Plant");
const pushNotification = require("../../firebasePushNotification/pushNotificationControlleer");
const Notification = require("../../../models/Notification");

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const ticketsController = {
  async getMyAssetCategories(req, res, next) {
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

      const assets = await Asset.find({ orgUserId })
        .populate({
          path: "productId",
          populate: {
            path: "categoryId",
            select: "_id categoryName",
          },
          select: "categoryId",
        })
        .select("productId");

      const assetCategories = [
        ...new Map(
          assets.map((asset) => [
            asset.productId.categoryId._id.toString(),
            asset.productId.categoryId,
          ])
        ).values(),
      ];
      return res.json({ assetCategories });
    } catch (error) {
      return next(error);
    }
  },

  async createTicket(req, res, next) {
    const ticketCreateSchema = Joi.object({
      plantId: Joi.string().pattern(mongodbIdPattern).required(),
      assetsId: Joi.array()
        .items(Joi.string().pattern(mongodbIdPattern).required())
        .required(),
      taskNames: Joi.array()
        .items(Joi.string().allow("").optional())
        .optional(),
      taskDescription: Joi.string().allow("").optional(),
      targetDate: Joi.date().iso().required(),
    });

    const { error } = ticketCreateSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { plantId, assetsId, taskDescription, targetDate, taskNames } =
      req.body;

    try {
      let orgUserId = req.user._id;

      if (req.user.userType === "manager") {
        const org = await Manager.findOne({ userId: req.user._id })
          .populate({
            path: "orgUserId",
            select: "_id",
          })
          .select("orgUserId");

        if (!org || !org.orgUserId) {
          return res.status(404).json({ msg: "Organization not found" });
        }

        orgUserId = org?.orgUserId?._id;
      }

      const ticketType = assetsId.length > 1 ? "General" : "Asset Related";

      const ticketCount = await Ticket.countDocuments({
        orgUserId,
      });
      const newTicket = new Ticket({
        ticketId: `TKT-${String(ticketCount + 1).padStart(4, "0")}`,
        orgUserId,
        plantId,
        assetsId,
        taskDescription,
        taskNames,
        targetDate,
        ticketType,
      });
      await newTicket.save();
      await newTicket.populate({
        path: "assetsId",
        populate: { path: "technicianUserId", select: "deviceToken" },
        select: "technicianUserId assetId",
      });
      const uniqueTechnicianIds = [
        ...new Set(
          newTicket.assetsId
            .flatMap((a) =>
              (Array.isArray(a?.technicianUserId)
                ? a.technicianUserId
                : [a.technicianUserId]
              ).map((t) => t?._id?.toString())
            )
            .filter(Boolean)
        ),
      ];

      const notifications = uniqueTechnicianIds.map((id) => ({
        userId: id,
        title: "Ticket Created",
        message:
          `You have received a new Ticket (ID: ${newTicket.ticketId}) ` +
          `for Asset ID: ${newTicket.assetsId
            .map((a) => a.assetId)
            .join(", ")} ` +
          `with target date ${new Date(
            newTicket.targetDate
          ).toLocaleDateString()}`,
      }));

      await Notification.insertMany(notifications);

      return res.json({ newTicket });
    } catch (error) {
      return next(error);
    }
  },

  async getTicketDetails(req, res, next) {
    const ticketId = req.params.ticketId;
    try {
      const ticket = await Ticket.findOne({ _id: ticketId })
        .populate({ path: "plantId", select: "_id plantName" })
        .populate({
          path: "assetsId",
          populate: [
            {
              path: "productId",
              select: "_id categoryId productName",
              populate: {
                path: "categoryId",
                select: "_id categoryName",
              },
            },
            {
              path: "technicianUserId",
              select: "_id name phone",
            },
          ],
          select: "assetId building productId",
        })
        .select("-orgUserId")
        .lean();
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      const enhancedAssets = await Promise.all(
        ticket.assetsId.map(async (asset) => {
          // Find matching ticket response for the asset
          const ticketResponse = await TicketResponse.findOne({
            ticketId: ticket._id,
            assetsId: asset._id,
          }).select("_id status geoCheck");

          return {
            ...asset,
            ticketResponse,
          };
        })
      );

      ticket.assetsId = enhancedAssets;
      return res.json({ ticket });
    } catch (error) {
      return next(error);
    }
  },

  async getTickets(req, res, next) {
    try {
      let ticketQuery = { orgUserId: req.user._id };

      if (req.user.userType === "manager") {
        const org = await Manager.findOne({ userId: req.user._id })
          .populate({ path: "orgUserId", select: "_id" })
          .select("orgUserId")
          .lean();

        const plants = await Plant.find({ managerId: org._id })
          .select("_id")
          .lean();

        ticketQuery = {
          orgUserId: org.orgUserId._id,
          plantId: { $in: plants.map((plant) => plant._id) },
        };
      }

      // Fetch tickets with populated data
      const tickets = await Ticket.find(ticketQuery)
        .sort({ createdAt: -1 })
        .populate({ path: "plantId", select: "_id plantName" })
        .populate({
          path: "assetsId",
          populate: [
            { path: "productId", select: "_id categoryId productName" },
            { path: "technicianUserId", select: "_id name" },
          ],
          select: "_id productId technicianUserId taskNames building assetId",
        })
        .lean(); // Convert documents to plain JS objects

      // Fetch all required ticket responses in one go
      const ticketResponses = await TicketResponse.find({
        ticketId: { $in: tickets.map((ticket) => ticket._id) },
      })
        .select("ticketId assetId status")
        .lean();

      // Fetch all service groups in one go
      const productIds = tickets.flatMap((ticket) =>
        ticket.assetsId.map((asset) => asset.productId)
      );

      // Create a lookup for ticket responses
      const ticketResponseMap = new Map();
      ticketResponses.forEach((tr) => {
        ticketResponseMap.set(`${tr.ticketId}-${tr.assetId}`, tr.status);
      });

      // Process tickets and attach required data
      for (let ticket of tickets) {
        let allCompleted = true;

        for (let asset of ticket.assetsId) {
          const statusKey = `${ticket._id}-${asset._id}`;
          asset.status = ticketResponseMap.get(statusKey) || "pending";

          if (asset.status !== "Completed") {
            allCompleted = false;
          }
        }

        ticket.status = ticket.completedStatus;
      }

      return res.json({ tickets });
    } catch (error) {
      return next(error);
    }
  },
  async editTicket(req, res, next) {
    const ticketCreateSchema = Joi.object({
      _id: Joi.string().pattern(mongodbIdPattern).required(),
      plantId: Joi.string().pattern(mongodbIdPattern).required(),
      assetsId: Joi.array()
        .items(Joi.string().pattern(mongodbIdPattern).required())
        .required(),
      taskNames: Joi.array()
        .items(Joi.string().allow("").optional())
        .optional(),
      taskDescription: Joi.string().allow("").optional(),
      targetDate: Joi.date().iso().required(),
    });

    const { error } = ticketCreateSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { _id, plantId, assetsId, taskDescription, taskNames, targetDate } =
      req.body;

    try {
      const ticketType = assetsId.length > 1 ? "General" : "Asset Related";
      const updatedTIcket = await Ticket.findOneAndUpdate(
        { _id },
        {
          plantId,
          assetsId,
          taskNames,
          taskDescription,
          targetDate,
          ticketType,
        },
        { new: true }
      );

      // const assets = await Asset.find({ _id: { $in: assetsId } })
      //   .populate({ path: "technicianUserId", select: "_id deviceToken name" })
      //   .select("technicianUserId assetId");
      // const groupedByTechnician = assets.reduce((acc, asset) => {
      //   const technicianId = asset.technicianUserId._id.toString();

      //   if (!acc[technicianId]) {
      //     acc[technicianId] = {
      //       technician: asset.technicianUserId,
      //       assetIds: [],
      //     };
      //   }

      //   acc[technicianId].assetIds.push(asset.assetId);
      //   return acc;
      // }, {});

      // const result = Object.values(groupedByTechnician);
      // for (const technician of result) {
      //   const message = `Hello ${technician.technician.name}, ticket ${
      //     updatedTIcket.ticketId
      //   } has been updated for assets: ${technician.assetIds.join(
      //     ", "
      //   )}. Please check your tickets for details.`;

      //   const newNotification = new Notification({
      //     userId: technician.technician._id,
      //     title: "Ticket Update",
      //     message,
      //   });

      //   await newNotification.save();
      //   pushNotification.sendNotificationDirectly(
      //     technician.technician.deviceToken,
      //     {
      //       title: "Ticket Update",
      //       body: message,
      //     }
      //   );
      // }

      return res.json({ updatedTIcket });
    } catch (error) {
      console.log(error);
    }
  },

  async getTicketResponseById(req, res, next) {
    const responseId = req.params.responseId;
    try {
      const ticket = await TicketResponse.findOne({ _id: responseId })
        .populate([
          {
            path: "plantId",
            select: "_id plantName address",
          },
          { path: "ticketId", select: "ticketId" },
        ])
        .populate({
          path: "assetsId",
          select: "_id model assetId",
          populate: [
            {
              path: "productId",
              select: "_id description",
            },
          ],
        })
        .populate({
          path: "technicianId",
          select: "_id name",
        });

      // Check if ticket is found
      if (!ticket) {
        return res.status(404).json({ message: "Ticket Response not found." });
      }
      return res.json({ ticketResponse: ticket });
    } catch (error) {
      return next(error);
    }
  },
  async updateTicketResponseStatus(req, res, next) {
    const { id } = req.params;
    const user = req.user;
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
      const updateData = {
        status,
        managerRemark: remark,
        statusUpdatedBy: user._id,
      };
      const updatedServiceForm = await TicketResponse.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      if (!updatedServiceForm) {
        return res.status(404).json({ error: "Service form not found" });
      }
      const allCompleted = await TicketResponse.aggregate([
        { $match: { ticketId: updatedServiceForm.ticketId } },
        {
          $group: {
            _id: null,
            allCompleted: { $min: { $eq: ["$status", "Completed"] } },
          },
        },
      ]).then((result) => result.length > 0 && result[0].allCompleted);
      const allRejected = await TicketResponse.aggregate([
        { $match: { ticketId: updatedServiceForm.ticketId } },
        {
          $group: {
            _id: null,
            allRejected: { $min: { $eq: ["$status", "Rejected"] } },
          },
        },
      ]).then((result) => result.length > 0 && result[0].allRejected);
      if (allCompleted) {
        await Ticket.findByIdAndUpdate(updatedServiceForm.ticketId, {
          completedStatus: "Completed",
        });
      } else if (allRejected) {
        await Ticket.findByIdAndUpdate(updatedServiceForm.ticketId, {
          completedStatus: "Rejected",
        });
      }
      return res.status(200).json({
        message: "Status updated successfully",
        data: updatedServiceForm,
      });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = ticketsController;
