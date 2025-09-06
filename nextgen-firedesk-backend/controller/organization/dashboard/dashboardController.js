const mongoose = require("mongoose");
const moment = require("moment");
const Asset = require("../../../models/organization/asset/Asset");
const Joi = require("joi");
const FormResponse = require("../../../models/technician/FormResponse/FormResponse");
const category = require("../../../models/admin/masterData/category");
const Manager = require("../../../models/organization/manager/Manager");
const Client = require("../../../models/admin/client/Client");
const Ticket = require("../../../models/organization/ticket/Ticket");
const Plant = require("../../../models/organization/plant/Plant");
const PumpIOTLiveData = require("../../../models/PumpIOTLiveData");
const Notification = require("../../../models/Notification");
const ServiceTickets = require("../../../models/organization/service/ServiceTickets");

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const dashboardController = {
  async getDashboardData(req, res, next) {
    const dashboardSchema = Joi.object({
      categoryName: Joi.string().required(),
      plantId: Joi.string().pattern(mongodbIdPattern).required(),
    });

    const { error } = dashboardSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { categoryName, plantId } = req.body;

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

      if (categoryName === "Pump Room") {
        let assets;
        assets = await Asset.find({
          orgUserId,
          plantId,
        })
          .populate([
            {
              path: "productId",
              populate: { path: "categoryId", match: { categoryName } },
              select: "categoryId productName type image1 ",
            },
          ])
          .select("_id assetId healthStatus serviceDates installDate");
        const plantData = await Plant.findById(plantId).select(
          "headerPressure mainWaterStorage primeWaterTankStorage dieselStorage pressureUnit"
        );
        assets = assets.filter((asset) => asset.productId.categoryId != null);

        const assetsWithPumpStatus = await Promise.all(
          assets.map(async (asset) => {
            const formResponse = await FormResponse.findOne({
              assetId: asset._id,
            })
              .sort({ createdAt: -1 })
              .select("pumpDetails.pumpStatus");
            const pumpStatus = formResponse?.pumpDetails?.pumpStatus || "";

            return {
              ...asset.toObject(),
              pumpStatus,
            };
          })
        );

        const categoryId = await category
          .findOne({ categoryName })
          .select("_id");
        if (!categoryId) {
          return res.status(400).json({ message: "category not found" });
        }
        const client = await Client.findOne({ userId: orgUserId }).select(
          "categories"
        );

        if (!client) {
          throw new Error("Client not found");
        }
        const categoryDetails = client.categories.find(
          (cat) => cat.categoryId.toString() === categoryId._id.toString()
        );

        if (!categoryDetails) {
          throw new Error("Category not associated with the client");
        }

        const inspectionFrequency =
          categoryDetails?.serviceDetails?.serviceFrequency?.inspection;

        const totalAssets = assets.length;
        const healthyAssets = assets.filter(
          (asset) => asset.healthStatus === "Healthy"
        ).length;
        const healthStatusPercentage = (healthyAssets / totalAssets) * 100;

        let totalDates = 0;
        let passedDates = 0;
        let totalInspectionDates = 0;

        assets.forEach((asset) => {
          const { nextServiceDates } = asset.serviceDates || {};

          if (nextServiceDates) {
            totalInspectionDates += nextServiceDates.inspection ? 1 : 0;
            totalDates += nextServiceDates.inspection ? 1 : 0;
            totalDates += nextServiceDates.testing ? 1 : 0;
            totalDates += nextServiceDates.maintenance ? 1 : 0;

            if (
              nextServiceDates.inspection &&
              new Date(nextServiceDates.inspection) < new Date()
            ) {
              passedDates += 1;
            }
            if (
              nextServiceDates.testing &&
              new Date(nextServiceDates.testing) < new Date()
            ) {
              passedDates += 1;
            }
            if (
              nextServiceDates.maintenance &&
              new Date(nextServiceDates.maintenance) < new Date()
            ) {
              passedDates += 1;
            }
          }
        });

        const serviceCompletedPercentage =
          totalDates > 0 ? (passedDates / totalDates) * 100 : 0;

        const formResponses1 = await FormResponse.find({
          assetId: { $in: assets.map((asset) => asset._id) },
        })
          // .populate({ path: "assetId", select: "assetId" })
          .select({
            "pumpDetails?.pumpStatus": 1,
            "pumpDetails?.pressureSwitchCondition": 1,
            "pumpDetails?.dieselLevel": 1,
            "pumpDetails?.waterStorageLevel": 1,
            "pumpDetails?.batteryStatusReading": 1,
            "pumpDetails?.dischargePressureGaugeReading": 1,
            updatedAt: 1,
            serviceType: 1,
          });
        const inspectionTrend = formResponses1.filter(
          (formResponse) => formResponse.serviceType === "inspection"
        );
        let totalInspectionDone = 0;
        const inspectionCountByMonth = inspectionTrend.reduce(
          (acc, formResponse) => {
            const date = new Date(formResponse.updatedAt);
            const yearMonth = `${date.getFullYear()}-${String(
              date.getMonth() + 1
            ).padStart(2, "0")}`;

            const existingMonth = acc.find((item) => item.month === yearMonth);

            if (existingMonth) {
              existingMonth.count++;
            } else {
              acc.push({ month: yearMonth, count: 1 });
            }
            totalInspectionDone++;
            return acc;
          },
          []
        );
        const inspectionserviceCompletedPercentage =
          totalInspectionDates > 0
            ? (totalInspectionDone / totalInspectionDates) * 100
            : 0;

        inspectionCountByMonth.sort(
          (a, b) => new Date(a.month) - new Date(b.month)
        );
        const allWaterStorageLevels = formResponses1
          .map((response) => ({
            waterStorageLevel: response.pumpDetails?.waterStorageLevel,
            dieselLevel: response.pumpDetails?.dieselLevel,
            serviceType: response.serviceType,
            updatedAt: response.updatedAt,
          }))
          .filter(
            (item) =>
              item.waterStorageLevel !== undefined &&
              item.dieselLevel !== undefined &&
              item.serviceType !== undefined
          );

        const lastTwelveRecords = allWaterStorageLevels
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 12);

        const formResponses = Object.values(
          formResponses1.reduce((acc, response) => {
            acc[response.assetId] = response;
            return acc;
          }, {})
        );

        if (formResponses.length > 0) {
          const lastResponse = formResponses[formResponses.length - 1];
          const lastWaterStorageLevel =
            lastResponse.pumpDetails?.waterStorageLevel;
          const lastBatteryStatusReading =
            lastResponse.pumpDetails?.batteryStatusReading;
          const lastDieselLevel = lastResponse.pumpDetails?.dieselLevel;
          const lastDischargePressureGaugeReading =
            lastResponse.pumpDetails?.dischargePressureGaugeReading;

          return res.json({
            plantData,
            inspectionserviceCompletedPercentage,
            inspectionCountByMonth,
            inspectionFrequency,
            assets: assetsWithPumpStatus,
            serviceCompletedPercentage,
            healthStatusPercentage,
            lastWaterStorageLevel,
            lastBatteryStatusReading,
            lastDieselLevel,
            lastDischargePressureGaugeReading,
            lastTwelveRecords,
          });
        } else {
          return res.json({
            plantData,
            inspectionserviceCompletedPercentage,
            inspectionCountByMonth,
            inspectionFrequency,
            assets: assetsWithPumpStatus,
            serviceCompletedPercentage,
            healthStatusPercentage,
            lastWaterStorageLevel: 0,
            lastBatteryStatusReading: 0,
            lastDieselLevel: 0,
            lastDischargePressureGaugeReading: 0,
            lastTwelveRecords,
          });
        }
      } else {
        let assets;
        assets = await Asset.find({ orgUserId, plantId })
          .populate({
            path: "productId",
            populate: {
              path: "categoryId",
              select: "categoryName",
              match: { categoryName },
            },
            select: "categoryId type",
          })
          .select(
            "productId assetId healthStatus building status serviceDates"
          );

        assets = assets.filter((asset) => asset.productId?.categoryId !== null);
        const healthStatusCounts = assets.reduce(
          (acc, asset) => {
            if (asset.healthStatus === "NotWorking") {
              acc.totalNotWorkingAssets += 1;
            } else if (asset.healthStatus === "AttentionRequired") {
              acc.totalAttentionRequiredAssets += 1;
            } else if (asset.healthStatus === "Healthy") {
              acc.totalHealthyRequiredAssets += 1;
            }
            return acc;
          },
          {
            totalNotWorkingAssets: 0,
            totalAttentionRequiredAssets: 0,
            totalHealthyRequiredAssets: 0,
          }
        );
        const overalHealthStatus = {
          totalNotWorkingAssets: healthStatusCounts.totalNotWorkingAssets,
          totalAttentionRequiredAssets:
            healthStatusCounts.totalAttentionRequiredAssets,
          totalHealthyRequiredAssets:
            healthStatusCounts.totalHealthyRequiredAssets,
        };
        const statusCounts = assets.reduce(
          (acc, asset) => {
            if (asset.status === "Warranty") {
              acc.totalWarrantyAssets += 1;
            } else if (asset.status === "AMC") {
              acc.totalAMCAssets += 1;
            } else if (asset.status === "In-House") {
              acc.totalInHouseAssets += 1;
            } else if (asset.status === "Deactive") {
              acc.totalDeactiveAssets += 1;
            }
            return acc;
          },
          {
            totalWarrantyAssets: 0,
            totalAMCAssets: 0,
            totalInHouseAssets: 0,
            totalDeactiveAssets: 0,
          }
        );
        const overalStatusCounts = {
          totalWarrantyAssets: statusCounts.totalWarrantyAssets,
          totalAMCAssets: statusCounts.totalAMCAssets,
          totalInHouseAssets: statusCounts.totalInHouseAssets,
          totalDeactiveAssets: statusCounts.totalDeactiveAssets,
        };
        const buildingCounts = assets.reduce((acc, asset) => {
          const building = asset.building;

          if (building) {
            acc[building] = (acc[building] || 0) + 1;
          }

          return acc;
        }, {});
        const typeCounts = assets.reduce((acc, asset) => {
          const building = asset.productId.type;

          if (building) {
            acc[building] = (acc[building] || 0) + 1;
          }

          return acc;
        }, {});

        const typeCountsByHealthStatus = assets.reduce((acc, asset) => {
          const status = asset.healthStatus;
          const type = asset.productId?.type;

          if (
            ["NotWorking", "AttentionRequired", "Healthy"].includes(status) &&
            type
          ) {
            if (!acc[type]) {
              acc[type] = {
                NotWorking: 0,
                AttentionRequired: 0,
                Healthy: 0,
              };
            }

            acc[type][status] = (acc[type][status] || 0) + 1;
          }

          return acc;
        }, {});
        const buildingCountsByHealthStatus = assets.reduce((acc, asset) => {
          const status = asset.healthStatus;
          const building = asset.building;

          if (
            ["NotWorking", "AttentionRequired", "Healthy"].includes(status) &&
            building
          ) {
            if (!acc[building]) {
              acc[building] = {
                NotWorking: 0,
                AttentionRequired: 0,
                Healthy: 0,
              };
            }
            acc[building][status] = (acc[building][status] || 0) + 1;
          }

          return acc;
        }, {});

        //service activity
        let passedDates = 0;
        let totalInspectionDates = 0;
        assets.forEach((asset) => {
          const { nextServiceDates } = asset.serviceDates || {};

          if (nextServiceDates) {
            totalInspectionDates += nextServiceDates.inspection ? 1 : 0;

            if (
              nextServiceDates.inspection &&
              new Date(nextServiceDates.inspection) < new Date()
            ) {
              passedDates += 1;
            }
          }
        });
        const servicePendingPercentage =
          (passedDates / totalInspectionDates) * 100 || 0;

        const currentMonth = new Date(); // Get the current date
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(currentMonth.getMonth() - 5); // Subtract 5 months

        const formResponseCounts = await FormResponse.aggregate([
          {
            $match: {
              assetId: { $in: assets.map((asset) => asset._id) },
              createdAt: { $gte: sixMonthsAgo },
            },
          },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          {
            $sort: { "_id.year": 1, "_id.month": 1 },
          },
          {
            $project: {
              month: "$_id.month",
              year: "$_id.year",
              count: 1,
              _id: 0,
            },
          },
        ]);
        const lastSixMonths = [];
        for (let i = 5; i >= 0; i--) {
          const date = new Date();
          date.setMonth(currentMonth.getMonth() - i);
          lastSixMonths.push({
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            count: 0,
          });
        }
        const lastSixMonthsServiceCounts = lastSixMonths.map((month) => {
          const match = formResponseCounts.find(
            (item) => item.year === month.year && item.month === month.month
          );
          return {
            ...month,
            count: match ? match.count : 0,
          };
        });

        // ticket activity
        const totalTicketsCreate = await Ticket.countDocuments({
          assetsId: { $in: assets.map((asset) => asset._id) },
        });
        const totalCompletedTickets = await Ticket.countDocuments({
          assetsId: {
            $in: assets.map((asset) => asset._id),
          },
          completedStatus: "Completed",
        });
        const ticketCompletePercentage =
          (totalCompletedTickets / totalTicketsCreate) * 100 || 0;

        const ticketActivity = await Ticket.aggregate([
          {
            $match: {
              assetsId: { $in: assets.map((asset) => asset._id) },
              createdAt: { $gte: sixMonthsAgo },
            },
          },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          {
            $sort: { "_id.year": 1, "_id.month": 1 },
          },
          {
            $project: {
              month: "$_id.month",
              year: "$_id.year",
              count: 1,
              _id: 0,
            },
          },
        ]);

        const lastSixMonthsTicket = [];
        for (let i = 5; i >= 0; i--) {
          const date = new Date();
          date.setMonth(currentMonth.getMonth() - i);
          lastSixMonthsTicket.push({
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            count: 0,
          });
        }
        const lastSixMonthsTicketCounts = lastSixMonthsTicket.map((month) => {
          const match = ticketActivity.find(
            (item) => item.year === month.year && item.month === month.month
          );
          return {
            ...month,
            count: match ? match.count : 0,
          };
        });

        return res.json({
          lastSixMonthsTicketCounts,
          lastSixMonthsServiceCounts,
          ticketCompletePercentage,
          servicePendingPercentage,
          overalHealthStatus,
          overalStatusCounts,
          buildingCounts,
          typeCounts,
          typeCountsByHealthStatus,
          buildingCountsByHealthStatus,
        });
      }
    } catch (error) {
      return next(error);
    }
  },
  async getHpTestDates(req, res, next) {
    try {
      const { plantId } = req.params;
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

      const categoryData = await category
        .findOne({ categoryName: "Fire Extinguishers" })
        .select("_id");

      const assetDatas = await Asset.find({
        plantId,
        orgUserId,
        productCategoryId: categoryData._id,
      }).select("hpTestOn nextHpTestDue");

      // Function to group by month
      const groupByMonth = (data, field) => {
        return data.reduce((acc, asset) => {
          if (asset[field]) {
            const monthYear = moment(asset[field]).format("YYYY-MM");
            acc[monthYear] = (acc[monthYear] || 0) + 1;
          }
          return acc;
        }, {});
      };

      // Get counts by month
      const hpTestCounts = groupByMonth(assetDatas, "hpTestOn");
      const nextHpTestCounts = groupByMonth(assetDatas, "nextHpTestDue");

      // Combine results
      const allMonths = new Set([
        ...Object.keys(hpTestCounts),
        ...Object.keys(nextHpTestCounts),
      ]);

      const result = Array.from(allMonths).map((month) => ({
        month,
        hpTestCount: hpTestCounts[month] || 0,
        nextHpTestCount: nextHpTestCounts[month] || 0,
      }));

      // Sort by month (latest first)
      result.sort((a, b) => moment(a.month).diff(moment(b.month)));

      return res.json(result);
    } catch (error) {
      return next(error);
    }
  },
  async getRefillDates(req, res, next) {
    try {
      const { plantId } = req.params;
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

      const categoryData = await category
        .findOne({ categoryName: "Fire Extinguishers" })
        .select("_id");

      const assetDatas = await Asset.find({
        plantId,
        orgUserId,
        productCategoryId: categoryData._id,
      }).select("refilledOn");

      // Function to group by month
      const groupByMonth = (data, field) => {
        return data.reduce((acc, asset) => {
          if (asset[field]) {
            const monthYear = moment(asset[field]).format("YYYY-MM");
            acc[monthYear] = (acc[monthYear] || 0) + 1;
          }
          return acc;
        }, {});
      };

      // Get counts by month
      const refilledOnCounts = groupByMonth(assetDatas, "refilledOn");

      // Convert result into array format
      const result = Object.keys(refilledOnCounts).map((month) => ({
        month,
        refilledOnCount: refilledOnCounts[month] || 0,
      }));

      // Sort by month (latest first)
      result.sort((a, b) => moment(a.month).diff(moment(b.month)));

      return res.json(result);
    } catch (error) {
      return next(error);
    }
  },
  async getPumpDashboardData(req, res, next) {
    const dashboardSchema = Joi.object({
      plantId: Joi.string().pattern(mongodbIdPattern).required(),
    });

    const { error } = dashboardSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { plantId } = req.body;
    try {
      const plantData = await Plant.findById(plantId).select(
        "dieselStorage headerPressure mainWaterStorage pressureUnit"
      );
      const categoryData = await category
        .findOne({ categoryName: "Pump Room" })
        .select("_id");
      if (!categoryData) {
        const customError = { message: "Pump Room category not found" };
        return next(customError);
      }
      const totalPumpAssets = await Asset.countDocuments({
        status: { $ne: "Deactive" },
        plantId,
        productCategoryId: categoryData._id,
      });
      const totalPumpHealthyAssets = await Asset.countDocuments({
        status: { $ne: "Deactive" },
        plantId,
        productCategoryId: categoryData._id,
        healthStatus: "Healthy",
      });
      const assets = await Asset.find({
        status: { $ne: "Deactive" },
        plantId,
        productCategoryId: categoryData._id,
      })
        .populate({
          path: "productId",
          select: "productName variants",
        })
        .select("productId assetId building location healthStatus type");
      const lapsedServiceCount = await FormResponse.countDocuments({
        plantId,
        assetId: { $in: assets.map((asset) => asset._id) },
        status: "Lapsed",
      });

      const totalServiceCount = await FormResponse.countDocuments({
        plantId,
        assetId: { $in: assets.map((asset) => asset._id) },
      });

      return res.status(200).json({
        plantData,
        totalPumpAssets,
        totalPumpHealthyAssets,
        assets,
        lapsedServiceCount,
        totalServiceCount,
      });
    } catch (error) {
      return next(error);
    }
  },
  async getBuildingsByPlantAndCategory(req, res, next) {
    const { plantId, categoryId } = req.body;
    try {
      const assets = await Asset.find({
        plantId,
        productCategoryId: categoryId,
      }).select("building");
      const buildings = [...new Set(assets.map((a) => a.building))];
      return res.json(buildings);
    } catch (error) {
      return next(error);
    }
  },
  async getProductsByPlantAndCategory(req, res, next) {
    const { plantId, categoryId } = req.body;
    try {
      const assets = await Asset.find({
        plantId,
        productCategoryId: categoryId,
      })
        .populate({ path: "productId", select: "productName" })
        .select("productId");

      // Use a Map to ensure unique product names
      const productMap = new Map();

      assets.forEach((a) => {
        const product = a.productId;
        if (product && !productMap.has(product.productName)) {
          productMap.set(product.productName, {
            _id: product._id,
            productName: product.productName,
          });
        }
      });

      const products = Array.from(productMap.values());

      return res.json(products);
    } catch (error) {
      return next(error);
    }
  },
  async getTypesByPlantAndCategory(req, res, next) {
    const { plantId, categoryId } = req.body;
    try {
      const assets = await Asset.find({
        plantId,
        productCategoryId: categoryId,
      }).select("type");
      const types = [...new Set(assets.map((a) => a.type))];
      return res.json(types);
    } catch (error) {
      return next(error);
    }
  },
  async getCapacitysByPlantAndCategory(req, res, next) {
    const { plantId, categoryId } = req.body;
    try {
      const assets = await Asset.find({
        plantId,
        productCategoryId: categoryId,
      }).select("capacity");
      const capacitys = [...new Set(assets.map((a) => a.capacity))];
      return res.json(capacitys);
    } catch (error) {
      return next(error);
    }
  },
  async getHydrostaticTestOverview(req, res, next) {
    const { selectedBuilding, selectedDateRange, plantId, categoryId } =
      req.body;

    try {
      const [startDate, endDate] = selectedDateRange.map((d) => new Date(d));

      const assets = await Asset.find({
        building: selectedBuilding,
        plantId,
        productCategoryId: categoryId,
        $or: [
          { nextHpTestDue: { $gte: startDate, $lte: endDate } },
          { hpTestOn: { $gte: startDate, $lte: endDate } },
        ],
      }).select("type nextHpTestDue hpTestOn");
      const typeMap = {}; // e.g., { ABC: { scheduled: 0, completed: 0 } }

      for (const asset of assets) {
        const type = asset.type || "Unknown";

        if (!typeMap[type]) {
          typeMap[type] = { scheduled: 0, completed: 0 };
        }

        if (
          asset.nextHpTestDue >= startDate &&
          asset.nextHpTestDue <= endDate
        ) {
          typeMap[type].scheduled += 1;
        }

        if (asset.hpTestOn >= startDate && asset.hpTestOn <= endDate) {
          typeMap[type].completed += 1;
        }
      }

      const categories = Object.keys(typeMap);
      const scheduledData = categories.map((type) => typeMap[type].scheduled);
      const completedData = categories.map((type) => typeMap[type].completed);

      return res.json({
        categories,
        series: [
          { name: "Scheduled", data: scheduledData },
          { name: "Completed", data: completedData },
        ],
      });
    } catch (error) {
      return next(error);
    }
  },
  async getRefillTestOverview(req, res, next) {
    const { selectedBuilding, selectedDateRange, plantId, categoryId } =
      req.body;

    try {
      const [startDate, endDate] = selectedDateRange.map((d) => new Date(d));

      const assets = await Asset.find({
        building: selectedBuilding,
        plantId,
        productCategoryId: categoryId,
        refilledOn: { $gte: startDate, $lte: endDate },
      }).select("type refilledOn");
      const typeMap = {};

      for (const asset of assets) {
        const type = asset.type || "Unknown";

        if (!typeMap[type]) {
          typeMap[type] = { scheduled: 0 };
        }

        if (asset.refilledOn >= startDate && asset.refilledOn <= endDate) {
          typeMap[type].scheduled += 1;
        }
      }

      const categories = Object.keys(typeMap);
      const scheduledData = categories.map((type) => typeMap[type].scheduled);

      return res.json({
        categories,
        series: [{ name: "Scheduled", data: scheduledData }],
      });
    } catch (error) {
      return next(error);
    }
  },
  async getAssetDistributionOverview(req, res, next) {
    try {
      const match = {
        plantId: mongoose.Types.ObjectId.createFromHexString(req.body.plantId),
        productCategoryId: mongoose.Types.ObjectId.createFromHexString(
          req.body.categoryId
        ),
      };

      // Optional filters
      if (req.body.building) {
        match.building = req.body.building;
      }
      if (req.body.type) {
        match.type = req.body.type;
      }
      if (req.body.capacity) {
        match.capacity = req.body.capacity;
      }

      if (req.body.productId) {
        match.productId = mongoose.Types.ObjectId.createFromHexString(
          req.body.productId
        );
      }

      if (req.body.condition) {
        match.healthStatus = req.body.condition;
      }

      if (req.body.endDate && req.body.startDate) {
        const start = new Date(req.body.startDate);
        const end = new Date(req.body.endDate);

        // Optional: Ensure time covers full day for endDate
        end.setHours(23, 59, 59, 999);

        match.manufacturingDate = {
          $gte: start,
          $lte: end,
        };
      }

      const result = await Asset.aggregate([
        { $match: match },
        {
          $group: {
            _id: "$type", // Group by type
            count: { $sum: 1 }, // Count how many of each type
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const labels = result.map((item) => item._id);
      const data = result.map((item) => item.count);

      return res.status(200).json({ labels, data });
    } catch (error) {
      return next(error);
    }
  },
  async getPumpSystamOverview(req, res, next) {
    const { interval } = req.body;
    const plantId = mongoose.Types.ObjectId.createFromHexString(
      req.body.plantId
    );
    const categoryId = mongoose.Types.ObjectId.createFromHexString(
      req.body.categoryId
    );

    if (!categoryId || !plantId || !interval)
      return res.json({
        message: "category, plant and interval fields are required",
      });
    const orgUserId = req.user._id;

    let startDate = new Date();
    const endDate = new Date();
    switch (interval) {
      case "Day":
        startDate.setDate(startDate.getDate() - 1);
        break;
      case "Week":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "Month":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      default:
        return res.json({
          message: "Invalid interval. Use Day, Week, or Month.",
        });
    }
    // Set startDate to beginning of day (00:00:00.000)
    startDate.setHours(0, 0, 0, 0);

    // Set endDate to end of day (23:59:59.999)
    endDate.setHours(23, 59, 59, 999);
    try {
      const healthStatusCounts = await Asset.aggregate([
        {
          $match: {
            orgUserId,
            plantId: plantId,
            productCategoryId: categoryId,
          },
        },
        {
          $group: {
            _id: "$healthStatus",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            healthStatus: "$_id",
            count: 1,
          },
        },
        {
          $sort: { count: -1 },
        },
      ]);

      const notificationCounts = await Notification.aggregate([
        {
          $match: {
            userId: orgUserId,
            plantId: plantId,
            categoryId: categoryId,
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: { _id: "$importance", count: { $sum: 1 } },
        },
        { $project: { _id: 0, importance: "$_id", count: 1 } },
      ]);

      const serviceSummaryCount = await ServiceTickets.aggregate([
        {
          $match: {
            orgUserId,
            plantId: plantId,
            categoryId: categoryId,
            date: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: { _id: "$completedStatus", count: { $sum: 1 } },
        },
        { $project: { _id: 0, completedStatus: "$_id", count: 1 } },
      ]);

      return res.json({
        healthStatusCounts,
        notificationCounts,
        serviceSummaryCount,
      });
    } catch (error) {
      return next(error);
    }
  },
  async getWaterLevelTrend(req, res, next) {
    const { plantId, categoryId, timeframe } = req.body;
    if (!plantId || !categoryId || !timeframe)
      return res.status(400).json({
        message: "plantId, categoryId and timeframe is required",
      });
    let startDate = new Date();
    const endDate = new Date();
    switch (timeframe) {
      case "Day":
        startDate.setDate(startDate.getDate() - 1);
        break;
      case "Week":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "Last 30 Days":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      default:
        return res.json({
          message: "Invalid timeframe. Use Day, Week, or Month.",
        });
    }
    // Set startDate to beginning of day (00:00:00.000)
    startDate.setHours(0, 0, 0, 0);

    // Set endDate to end of day (23:59:59.999)
    endDate.setHours(23, 59, 59, 999);

    const plantData = await Plant.findById(plantId).select("pumpIotDeviceId");
    if (!plantData.pumpIotDeviceId) console.log("pumpIotDeviceNotFount");

    const waterTrend = await PumpIOTLiveData.aggregate([
      {
        $match: {
          device_id: plantData.pumpIotDeviceId,
        },
      },
      {
        $project: {
          WLSHistory: {
            $filter: {
              input: { $ifNull: ["$history.WLS", []] },
              as: "item",
              cond: {
                $and: [
                  { $gte: ["$$item.date", startDate] },
                  { $lte: ["$$item.date", endDate] },
                ],
              },
            },
          },
        },
      },
      {
        $addFields: {
          avgWLS: {
            $round: [
              {
                $avg: {
                  $map: {
                    input: "$WLSHistory",
                    as: "item",
                    in: { $toDouble: "$$item.data" },
                  },
                },
              },
              0, // 0 decimal places
            ],
          },
        },
      },
      {
        $addFields: {
          maxWLS: {
            $max: {
              $map: {
                input: "$WLSHistory",
                as: "item",
                in: { $toDouble: "$$item.data" },
              },
            },
          },
        },
      },
    ]);

    const { maxWLS, WLSHistory = [], avgWLS = 0 } = waterTrend[0] || {};

    return res.json({ WLSHistory, avgWLS, maxWLS, startDate, endDate });
  },
  async getDieselLevelTrend(req, res, next) {
    const { plantId, categoryId, timeframe } = req.body;
    if (!plantId || !categoryId || !timeframe)
      return res.status(400).json({
        message: "plantId, categoryId and timeframe is required",
      });
    let startDate = new Date();
    const endDate = new Date();
    switch (timeframe) {
      case "Day":
        startDate.setDate(startDate.getDate() - 1);
        break;
      case "Week":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "Last 30 Days":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      default:
        return res.json({
          message: "Invalid timeframe. Use Day, Week, or Month.",
        });
    }
    // Set startDate to beginning of day (00:00:00.000)
    startDate.setHours(0, 0, 0, 0);

    // Set endDate to end of day (23:59:59.999)
    endDate.setHours(23, 59, 59, 999);

    const plantData = await Plant.findById(plantId).select("pumpIotDeviceId");
    if (!plantData.pumpIotDeviceId) console.log("pumpIotDeviceNotFount");

    const waterTrend = await PumpIOTLiveData.aggregate([
      {
        $match: {
          device_id: plantData.pumpIotDeviceId,
        },
      },
      {
        $project: {
          DLSHistory: {
            $filter: {
              input: { $ifNull: ["$history.DLS", []] },
              as: "item",
              cond: {
                $and: [
                  { $gte: ["$$item.date", startDate] },
                  { $lte: ["$$item.date", endDate] },
                ],
              },
            },
          },
        },
      },
      {
        $addFields: {
          avgDLS: {
            $round: [
              {
                $avg: {
                  $map: {
                    input: "$DLSHistory",
                    as: "item",
                    in: { $toDouble: "$$item.data" },
                  },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $addFields: {
          maxDLS: {
            $max: {
              $map: {
                input: "$DLSHistory",
                as: "item",
                in: { $toDouble: "$$item.data" },
              },
            },
          },
        },
      },
    ]);

    const { maxDLS, DLSHistory = [], avgDLS = 0 } = waterTrend[0] || {};

    return res.json({ DLSHistory, avgDLS, maxDLS, startDate, endDate });
  },
  async getHeaderPressureTrend(req, res, next) {
    const { plantId, categoryId, timeframe } = req.body;
    if (!plantId || !categoryId || !timeframe)
      return res.status(400).json({
        message: "plantId, categoryId and timeframe is required",
      });
    let startDate = new Date();
    const endDate = new Date();
    switch (timeframe) {
      case "Day":
        startDate.setDate(startDate.getDate() - 1);
        break;
      case "Week":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "Last 30 Days":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      default:
        return res.json({
          message: "Invalid timeframe. Use Day, Week, or Month.",
        });
    }
    // Set startDate to beginning of day (00:00:00.000)
    startDate.setHours(0, 0, 0, 0);

    // Set endDate to end of day (23:59:59.999)
    endDate.setHours(23, 59, 59, 999);

    const plantData = await Plant.findById(plantId).select(
      "pumpIotDeviceId pressureUnit"
    );
    if (!plantData.pumpIotDeviceId) console.log("pumpIotDeviceNotFount");

    const waterTrend = await PumpIOTLiveData.aggregate([
      {
        $match: {
          device_id: plantData.pumpIotDeviceId,
        },
      },
      {
        $project: {
          PLSHistory: {
            $filter: {
              input: { $ifNull: ["$history.PLS", []] },
              as: "item",
              cond: {
                $and: [
                  { $gte: ["$$item.date", startDate] },
                  { $lte: ["$$item.date", endDate] },
                ],
              },
            },
          },
        },
      },
      {
        $addFields: {
          avgPLS: {
            $round: [
              {
                $avg: {
                  $map: {
                    input: "$PLSHistory",
                    as: "item",
                    in: { $toDouble: "$$item.data" },
                  },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $addFields: {
          maxPLS: {
            $max: {
              $map: {
                input: "$PLSHistory",
                as: "item",
                in: { $toDouble: "$$item.data" },
              },
            },
          },
        },
      },
    ]);

    const { maxPLS, PLSHistory = [], avgPLS = 0 } = waterTrend[0] || {};

    return res.json({
      PLSHistory,
      avgPLS,
      maxPLS,
      headerPressureUnit: plantData?.pressureUnit,
      startDate,
      endDate,
    });
  },
  async getPumpMaintenanceOverviewData(req, res, next) {
    const plantId = mongoose.Types.ObjectId.createFromHexString(
      req.body.plantId
    );
    const categoryId = mongoose.Types.ObjectId.createFromHexString(
      req.body.categoryId
    );
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      const results = await ServiceTickets.aggregate([
        {
          $match: {
            plantId,
            categoryId,
            date: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        {
          $facet: {
            // 1. Group by serviceType
            serviceTypeCounts: [
              {
                $group: {
                  _id: "$serviceType",
                  count: { $sum: 1 },
                },
              },
            ],

            // 2. Group by completedStatus
            statusCounts: [
              {
                $group: {
                  _id: "$completedStatus",
                  count: { $sum: 1 },
                },
              },
            ],

            // 3. Pending only: date bucket by range
            pendingByRange: [
              {
                $match: {
                  completedStatus: "Pending",
                },
              },
              {
                $addFields: {
                  daysFromToday: {
                    $dateDiff: {
                      startDate: today,
                      endDate: "$date",
                      unit: "day",
                    },
                  },
                },
              },
              {
                $addFields: {
                  dayRange: {
                    $switch: {
                      branches: [
                        {
                          case: { $lte: ["$daysFromToday", 3] },
                          then: "Next 3 Days",
                        },
                        {
                          case: {
                            $and: [
                              { $gt: ["$daysFromToday", 3] },
                              { $lte: ["$daysFromToday", 7] },
                            ],
                          },
                          then: "Next 4–7 Days",
                        },
                        {
                          case: { $gt: ["$daysFromToday", 7] },
                          then: "More Than 7 Days",
                        },
                      ],
                      default: "Invalid",
                    },
                  },
                },
              },
              {
                $group: {
                  _id: "$dayRange",
                  count: { $sum: 1 },
                },
              },
            ],

            // 4. Group by Technician and Completed Status
            technicianStatusCounts: [
              {
                $match: {
                  completedStatus: {
                    $in: ["Completed", "Rejected", "Waiting for approval"],
                  },
                  serviceDoneBy: { $ne: null },
                },
              },
              {
                $group: {
                  _id: {
                    technician: "$serviceDoneBy",
                    status: "$completedStatus",
                  },
                  count: { $sum: 1 },
                },
              },
              {
                $group: {
                  _id: "$_id.technician",
                  statuses: {
                    $push: {
                      status: "$_id.status",
                      count: "$count",
                    },
                  },
                },
              },
              {
                $lookup: {
                  from: "users", // collection name (lowercase plural of "User")
                  localField: "_id",
                  foreignField: "_id",
                  as: "technician",
                },
              },
              {
                $unwind: "$technician",
              },
              {
                $project: {
                  _id: 0,
                  technicianId: "$technician._id",
                  name: "$technician.name",
                  statuses: 1,
                },
              },
            ],
            recentActivities: [
              {
                $match: {
                  completedStatus: { $ne: "Pending" },
                },
              },
              {
                $sort: {
                  date: -1,
                },
              },
              {
                $limit: 5,
              },
              // Lookup serviceDoneBy (technician)
              {
                $lookup: {
                  from: "users",
                  localField: "serviceDoneBy",
                  foreignField: "_id",
                  as: "technician",
                },
              },
              {
                $unwind: {
                  path: "$technician",
                  preserveNullAndEmptyArrays: true,
                },
              },
              // Lookup assets (assetsId is array)
              {
                $lookup: {
                  from: "assets",
                  localField: "assetsId",
                  foreignField: "_id",
                  as: "assets",
                },
              },
              {
                $project: {
                  _id: 0,
                  completedStatus: 1,
                  date: 1,
                  serviceFrequency: 1,
                  serviceType: 1,
                  // Technician name if exists
                  serviceDoneBy: {
                    $cond: {
                      if: { $ifNull: ["$technician.name", false] },
                      then: "$technician.name",
                      else: null,
                    },
                  },
                  // Extract only assetId from populated assets
                  assets: {
                    $map: {
                      input: "$assets",
                      as: "asset",
                      in: "$$asset.assetId",
                    },
                  },
                },
              },
            ],
          },
        },
      ]);

      const {
        serviceTypeCounts,
        statusCounts,
        pendingByRange,
        technicianStatusCounts,
        recentActivities,
      } = results[0] || {};

      return res.json({
        serviceTypeCounts,
        statusCounts,
        pendingByRange,
        technicianStatusCounts,
        recentActivities,
      });
    } catch (error) {
      return next(error);
    }
  },
  async getPumpKnowMoreData(req, res, next) {
    const { assetId, iotNumber } = req.body;

    try {
      const iotKey = `PS${iotNumber}`;

      const assetData = await Asset.findById(assetId)
        .populate({ path: "plantId", select: "pumpIotDeviceId" })
        .select("installDate plantId");

      if (!assetData) {
        return res.status(404).json({ message: "Asset not found" });
      }

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const startOfNextMonth = new Date(startOfMonth);
      startOfNextMonth.setMonth(startOfMonth.getMonth() + 1);

      const [
        lastServiceActivity,
        lastFiveServiceActivity,
        serviceTypeCount,
        completedStatusCount,
        pendingByRange,
      ] = await Promise.all([
        ServiceTickets.findOne({
          completedStatus: "Completed",
          assetsId: assetId,
        })
          .populate([
            { path: "serviceDoneBy", select: "name" },
            { path: "submittedFormId", select: "technicianRemark" },
          ])
          .select("date serviceDoneBy submittedFormId")
          .sort({ date: -1 }),

        ServiceTickets.find({
          completedStatus: { $ne: "Pending" },
          assetsId: assetId,
        })
          .populate([
            { path: "assetsId", select: "assetId" },
            { path: "serviceDoneBy", select: "name" },
          ])
          .select("assetsId serviceDoneBy date completedStatus")
          .sort({ updatedAt: -1 })
          .limit(5),
        ServiceTickets.aggregate([
          {
            $match: {
              assetsId: new mongoose.Types.ObjectId(assetId),
              date: { $gte: startOfMonth, $lt: startOfNextMonth },
            },
          },
          {
            $group: {
              _id: "$serviceType",
              count: { $sum: 1 },
            },
          },
        ]),
        ServiceTickets.aggregate([
          {
            $match: {
              assetsId: new mongoose.Types.ObjectId(assetId),
              date: { $gte: startOfMonth, $lt: startOfNextMonth },
            },
          },
          {
            $group: {
              _id: "$completedStatus", // true or false
              count: { $sum: 1 },
            },
          },
        ]),
        ServiceTickets.aggregate([
          {
            $match: {
              assetsId: new mongoose.Types.ObjectId(assetId),
              completedStatus: "Pending", // or false, depending on your schema
              date: { $gte: startOfMonth, $lt: startOfNextMonth },
            },
          },
          {
            $addFields: {
              daysFromToday: {
                $dateDiff: {
                  startDate: new Date(), // today's date
                  endDate: "$date", // assumed due date field
                  unit: "day",
                },
              },
            },
          },
          {
            $addFields: {
              dayRange: {
                $switch: {
                  branches: [
                    {
                      case: { $lte: ["$daysFromToday", 3] },
                      then: "Next 3 Days",
                    },
                    {
                      case: {
                        $and: [
                          { $gt: ["$daysFromToday", 3] },
                          { $lte: ["$daysFromToday", 7] },
                        ],
                      },
                      then: "Next 4–7 Days",
                    },
                    {
                      case: { $gt: ["$daysFromToday", 7] },
                      then: "More Than 7 Days",
                    },
                  ],
                  default: "Invalid",
                },
              },
            },
          },
          {
            $group: {
              _id: "$dayRange",
              count: { $sum: 1 },
            },
          },
        ]),
      ]);

      // Calculate asset age
      const installDate = new Date(assetData.installDate);
      const today = new Date();

      const diffTime = Math.abs(today - installDate);
      const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const years = Math.floor(totalDays / 365);
      const months = Math.floor((totalDays % 365) / 30);
      const ageString = `${years} Year${
        years !== 1 ? "s" : ""
      } ${months} Month${months !== 1 ? "s" : ""} (${totalDays} Days)`;

      // Calculate total ON hours
      let hours = 0;
      let minutes = 0;

      if (assetData?.plantId?.pumpIotDeviceId) {
        const pumpData = await PumpIOTLiveData.findOne({
          device_id: assetData.plantId.pumpIotDeviceId,
        }).select({ [`history.${iotKey}`]: 1 });

        const history = pumpData?.history?.get(iotKey) || [];

        history.sort((a, b) => new Date(a.date) - new Date(b.date));

        let totalOnTimeMs = 0;
        let onStartTime = null;

        for (let i = 0; i < history.length; i++) {
          const { data, date } = history[i];

          if (data === 1 && !onStartTime) {
            onStartTime = new Date(date);
          }

          if ((data === 0 || i === history.length - 1) && onStartTime) {
            const endTime = new Date(date);
            totalOnTimeMs += endTime - onStartTime;
            onStartTime = null;
          }
        }

        const totalOnHours =
          Math.round((totalOnTimeMs / (1000 * 60 * 60)) * 100) / 100;

        hours = Math.floor(totalOnHours);
        minutes = Math.round((totalOnHours - hours) * 60);
      }

      return res.json({
        totalOnHours: `${hours} hours ${minutes} minutes`,
        ageString,
        lastServiceActivity,
        lastFiveServiceActivity,
        serviceTypeCount,
        completedStatusCount,
        pendingByRange,
      });
    } catch (error) {
      return next(error);
    }
  },
  async getPumpModeStatusTrend(req, res, next) {
    const { iotNumber, selectedAsset, modeTime } = req.body;

    if (!iotNumber || !selectedAsset || !modeTime) {
      return res.status(400).json({
        message: "iotNumber, selectedAsset and modeTime all are required",
      });
    }

    try {
      const assetData = await Asset.findById(selectedAsset)
        .populate({
          path: "plantId",
          select: "pumpIotDeviceId",
        })
        .select("plantId");

      if (!assetData?.plantId?.pumpIotDeviceId) {
        return res.json([]);
      }

      const iotKey = `AS${iotNumber}`;

      // Determine date range from modeTime
      const now = new Date();
      let startDate;

      switch (modeTime) {
        case "Day":
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 1);
          break;
        case "Week":
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          break;
        case "Month":
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
          break;
        default:
          return res.status(400).json({ message: "Invalid modeTime value" });
      }

      const result = await PumpIOTLiveData.aggregate([
        {
          $match: {
            device_id: assetData.plantId.pumpIotDeviceId,
          },
        },
        {
          $project: {
            filteredTrend: {
              $filter: {
                input: {
                  $getField: {
                    field: iotKey,
                    input: "$history",
                  },
                },
                as: "entry",
                cond: {
                  $gte: ["$$entry.date", startDate],
                },
              },
            },
          },
        },
      ]);

      const trend = result[0]?.filteredTrend || [];

      return res.json(trend);
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = dashboardController;
