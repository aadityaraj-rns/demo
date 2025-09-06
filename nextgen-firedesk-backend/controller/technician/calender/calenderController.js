const Joi = require("joi");
const moment = require("moment");
const Asset = require("../../../models/organization/asset/Asset");
const Ticket = require("../../../models/organization/ticket/Ticket");
// const Client = require("../../../models/admin/client/Client");
// const Technician = require("../../../models/organization/technician/Technician");
const ServiceTickets = require("../../../models/organization/service/ServiceTickets");

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const calenderController = {
  async getServiceDates(req, res, next) {
    const serviceDateSchema = Joi.object({
      plantId: Joi.string().pattern(mongodbIdPattern).required(),
      month: Joi.number().min(1).max(12).required(),
      year: Joi.number().required(),
    });
    const { error } = serviceDateSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { plantId, month, year } = req.body;
    try {
      const assets = await Asset.find({
        technicianUserId: req.user._id,
        plantId,
      }).select("_id");
      const serviceDatas = await ServiceTickets.find({
        assetsId: { $in: assets.map((a) => a._id) },
        date: {
          $gte: new Date(year, month - 1, 1),
          $lt: new Date(year, month, 1),
        },
        completedStatus: "Pending",
      })
        .populate([
          { path: "groupServiceId", select: "groupName groupId" },
          { path: "plantId", select: "plantName" },
          {
            path: "assetsId",
            populate: {
              path: "productId",
              select: "productName description groupId",
            },
            select: "assetId productId building type location",
          },
        ])
        .sort({ date: -1 });

      const tickets = await Ticket.find({
        plantId,
        $expr: {
          $and: [
            { $eq: [{ $month: "$targetDate" }, month] },
            { $eq: [{ $year: "$targetDate" }, year] },
          ],
        },
      })
        .populate({
          path: "assetsId",
          select: "assetId location building groupId",
        })
        .sort({ targetDate: -1 });

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
  async getServiceAndTicketByDate(req, res, next) {
    const serviceDateSchema = Joi.object({
      plantId: Joi.string().pattern(mongodbIdPattern).required(),
      date: Joi.date().iso().required(),
    });
    const { error } = serviceDateSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { plantId, date } = req.body;

    try {
      const assets = await Asset.find({
        technicianUserId: req.user._id,
        plantId,
      }).select("_id");

      const rawDate = new Date(date); // assuming 'date' is a string like "2025-05-30"

      const startOfDay = new Date(rawDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(rawDate);
      endOfDay.setHours(23, 59, 59, 999);

      const services = await ServiceTickets.find({
        assetsId: { $in: assets.map((a) => a._id) },
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
        completedStatus: "Pending",
      })
        .populate([
          { path: "groupServiceId", select: "groupName groupId" },
          { path: "plantId", select: "plantName" },
          {
            path: "assetsId",
            populate: { path: "productId", select: "productName description" },
            select: "assetId building productId location type",
          },
        ])
        .sort({ date: -1 });

      const tickets = await Ticket.find({
        plantId,
        targetDate: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      }).populate({
        path: "assetsId",
        select: "_id assetId building productId location type",
      });
      return res.json({ services, tickets });
    } catch (error) {
      return next(error);
    }
  },

  // async getTicketsAndService(req, res, next) {
  //   const getTicketsAndServiceSchema = Joi.object({
  //     ticketsIds: Joi.array()
  //       .items(Joi.string().pattern(mongodbIdPattern))
  //       .required(),
  //     assetIds: Joi.array()
  //       .items(Joi.string().pattern(mongodbIdPattern))
  //       .required(),
  //     serviceDate: Joi.string().isoDate().required(),
  //   });

  //   const { error } = getTicketsAndServiceSchema.validate(req.body);

  //   if (error) {
  //     return next(error);
  //   }

  //   const { ticketsIds, assetIds, serviceDate } = req.body;
  //   const serviceDateMoment = moment(serviceDate, "YYYY-MM-DD");
  //   const month = serviceDateMoment.month() + 1;
  //   const year = serviceDateMoment.year();

  //   const user = req.user;
  //   try {
  //     const assets = await Asset.find({
  //       _id: { $in: assetIds },
  //     })
  //       .populate({
  //         path: "productId",
  //         select: "_id productName description image1 image2",
  //       })
  //       .select("assetId plantId serviceDates productCategoryId");

  //     const technician = await Technician.findOne({ userId: user._id });
  //     // Fetch client (organization) details by technician
  //     const client = await Client.findOne({ userId: technician.orgId });

  //     if (!client) {
  //       return res.status(404).json({ message: "Client not found" });
  //     }

  //     // Collect all the assets that have service dates within the month
  //     const monthlyAssets = [];

  //     assets.forEach((asset) => {
  //       const { serviceDates, productCategoryId } = asset;

  //       // Fetch the relevant category from the client details
  //       const category = client.categories.find(
  //         (cat) =>
  //           productCategoryId &&
  //           cat.categoryId.toString() === productCategoryId.toString()
  //       );

  //       if (!category) return; // Skip if the category is not found in the client

  //       const { serviceDetails } = category;
  //       const { startDate, endDate } = serviceDetails;

  //       // For each service type (inspection, testing, maintenance), calculate the service dates
  //       ["inspection", "testing", "maintenance"].forEach((serviceType) => {
  //         // Fetch the next service date for this service type
  //         let nextServiceDate = serviceDates.nextServiceDates?.[serviceType];

  //         if (!nextServiceDate) return; // Skip if no next service date available for this service type

  //         if (
  //           startDate &&
  //           endDate &&
  //           (nextServiceDate < startDate || nextServiceDate > endDate)
  //         ) {
  //           return;
  //         }
  //         let serviceFrequency = serviceDetails.serviceFrequency[serviceType];

  //         // Get service dates for the given month/year based on frequency and valid period
  //         const calculatedServiceDates = getServiceDatesForMonthAndYear(
  //           nextServiceDate,
  //           endDate,
  //           serviceFrequency,
  //           month,
  //           year
  //         );

  //         calculatedServiceDates.forEach((date) => {
  //           const calculatedDateMoment = moment(date, "YYYY-MM-DD");
  //           if (calculatedDateMoment.isSame(serviceDateMoment, "day")) {
  //             monthlyAssets.push({
  //               ...asset.toObject(),
  //               serviceDate: date,
  //               serviceType,
  //             });
  //           }
  //         });
  //       });
  //     });

  //     const assetTicketDetails = await Ticket.find({
  //       _id: { $in: ticketsIds },
  //     }).populate({
  //       path: "assetsId",
  //       select: "_id productId assetId",
  //       populate: {
  //         path: "productId",
  //         select: "_id productName description image1 image2",
  //       },
  //     });

  //     return res.json({
  //       assetTicketDetails,
  //       assetServiceDetails: monthlyAssets,
  //     });
  //   } catch (error) {
  //     return next(error);
  //   }
  // },
};

// const getServiceDatesForMonthAndYear = (
//   startDate,
//   endDate,
//   frequency,
//   month,
//   year
// ) => {
//   const serviceDates = [];

//   let currentDate = moment(startDate);
//   const validTill = moment(endDate);

//   while (currentDate.isBefore(validTill) || currentDate.isSame(validTill)) {
//     if (currentDate.month() + 1 === month && currentDate.year() === year) {
//       serviceDates.push(currentDate.format("YYYY-MM-DD"));
//     }
//     currentDate = addFrequency(currentDate, frequency);
//   }

//   return serviceDates;
// };

// const addFrequency = (date, frequency) => {
//   switch (frequency) {
//     case "Weekly":
//       return date.add(7, "days");
//     case "Fortnight":
//       return date.add(14, "days");
//     case "Monthly":
//       return date.add(1, "month");
//     case "Quarterly":
//       return date.add(3, "months");
//     case "Half Year":
//       return date.add(6, "months");
//     case "Yearly":
//       return date.add(12, "months");
//     default:
//       return date.add(1, "month");
//   }
// };

module.exports = calenderController;
