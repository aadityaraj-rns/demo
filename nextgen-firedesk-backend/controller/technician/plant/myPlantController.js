const Joi = require("joi");
const Technician = require("../../../models/organization/technician/Technician");
const Plant = require("../../../models/organization/plant/Plant");
const Client = require("../../../models/admin/client/Client");
const Asset = require("../../../models/organization/asset/Asset");
const FormResponse = require("../../../models/technician/FormResponse/FormResponse");
const Ticket = require("../../../models/organization/ticket/Ticket");
const TicketResponse = require("../../../models/organization/ticket/TicketResponse");
const getFormattedCategories = require("../../organization/helperfunctions/getFormattedCategories");
const ServiceTickets = require("../../../models/organization/service/ServiceTickets");

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const myPlantController = {
  async getMyPlants(req, res, next) {
    try {
      const technicianPlants = await Technician.findOne({
        userId: req.user._id,
      })
        .populate({
          path: "plantId",
          match: { status: "Active" },
          populate: [
            {
              path: "cityId",
              populate: { path: "stateId", select: "stateName" },
              select: "stateId cityName",
            },
            { path: "orgUserId", select: "name" },
            {
              path: "managerId",
              populate: { path: "userId", select: "name phone email" },
              select: "userId",
            },
          ],
        })
        .populate({
          path: "categoryId",
          select: "categoryName",
        })
        .select("plantId categoryId");
      if (!technicianPlants.plantId) {
        return res
          .status(404)
          .json({ message: "No plants found for the technician." });
      }
      return res.status(200).json({
        plants: technicianPlants.plantId,
        category: technicianPlants.categoryId,
      });
    } catch (error) {
      return next(error);
    }
  },
  async getMyPlantNames(req, res, next) {
    try {
      const plants = await Technician.findOne({
        userId: req.user._id,
      }).populate({
        path: "plantId",
        match: { status: "Active" },
        select: "plantName",
      });
      return res.json(plants.plantId);
    } catch (error) {
      return next(error);
    }
  },
  async getPlantById(req, res, next) {
    const getMyPlantSchema = Joi.object({
      plantId: Joi.string().pattern(mongodbIdPattern).required(),
    });

    const { error, value } = getMyPlantSchema.validate(req.params);

    if (error) {
      return next(error);
    }

    const { plantId } = value;

    try {
      const plant = await Plant.findById(plantId)
        .populate({ path: "cityId", select: "cityName" })
        .populate({
          path: "managerId",
          select: "_id",
          populate: {
            path: "userId",
            select: "name email phone",
          },
        });

      const assets = await Asset.find({ plantId: plant._id })
        .populate({
          path: "productId",
          select: "categoryId",
          populate: { path: "categoryId", select: "categoryName" },
        })
        .select("healthStatus");

      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const completedServiceCount = await FormResponse.countDocuments({
        assetId: { $in: assets.map((asset) => asset._id) },
        status: "Approved",
        updatedAt: { $gte: oneMonthAgo },
      });

      const pendingServiceCount = await ServiceTickets.countDocuments({
        assetsId: { $in: assets.map((a) => a._id) },
        completedStatus: "Pending",
      });

      const tickets = await Ticket.find({ plantId });

      let completedTicketsCount = 0;
      let pendingTicketsCount = 0;

      for (const ticket of tickets) {
        for (const asset of ticket.assetsId) {
          const responses = await TicketResponse.find({
            ticketId: ticket._id,
            assetId: asset,
          });

          const isCompleted = responses.every(
            (response) => response.status === "Completed"
          );
          if (isCompleted) {
            completedTicketsCount += 1;
          } else {
            pendingTicketsCount += 1;
          }
        }
      }

      const categorys = {};
      assets.forEach((asset) => {
        const categoryName = asset.productId?.categoryId?.categoryName;
        const healthStatus = asset.healthStatus;

        if (categoryName) {
          if (!categorys[categoryName]) {
            categorys[categoryName] = {
              count: 0,
              healthStatusCounts: {
                Healthy: 0,
                AttentionRequired: 0,
                NotWorking: 0,
              },
            };
          }
          categorys[categoryName].count += 1;

          if (healthStatus in categorys[categoryName].healthStatusCounts) {
            categorys[categoryName].healthStatusCounts[healthStatus] += 1;
          }
        }
      });

      const formattedCategoryCounts = Object.entries(categorys).map(
        ([categoryName, data]) => ({
          categoryName,
          count: data.count,
          healthStatusCounts: data.healthStatusCounts,
        })
      );

      return res.json({
        plant,
        categorys: formattedCategoryCounts,
        completedServiceCount,
        pendingServiceCount,
        completedTicketsCount,
        pendingTicketsCount,
      });
    } catch (error) {
      return next(error);
    }
  },
  async getMyOrganization(req, res, next) {
    try {
      const userId = req.user._id;
      const technician = await Technician.findOne({
        userId,
      }).select("orgId");
      const organization = await Client.find({ userId: technician.orgId })
        .populate({
          path: "userId",
          select: "name email phone loginID profile",
        })
        .populate({ path: "cityId", select: "cityName" });
      return res.json({ organization });
    } catch (error) {
      return next(error);
    }
  },
};
module.exports = myPlantController;
