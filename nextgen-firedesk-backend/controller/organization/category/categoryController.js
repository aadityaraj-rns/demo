const Joi = require("joi");
const Client = require("../../../models/admin/client/Client");
const Manager = require("../../../models/organization/manager/Manager");
const {
  calculateNextServiceDate,
} = require("../../../services/calculateNextServiceDate");
const Asset = require("../../../models/organization/asset/Asset");
const ServiceTickets = require("../../../models/organization/service/ServiceTickets");
const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const categoryController = {
  async getMyCategories(req, res, next) {
    try {
      let userId = req.user._id;
      if (req.user.userType === "manager") {
        const org = await Manager.findOne({ userId: req.user._id })
          .populate({
            path: "orgUserId",
            select: "userType name phone email loginID",
          })
          .select("orgUserId");
        userId = org.orgUserId._id;
      }

      const categories = await Client.findOne({ userId })
        .populate({
          path: "categories.categoryId",
          select: "categoryName",
        })
        .populate({
          path: "categories.categoryHistory.editedBy",
          select: "name",
        })
        .select("categories");
      return res.json({ categories });
    } catch (error) {
      return next(error);
    }
  },
  async getMyCategorieNames(req, res, next) {
    try {
      let userId = req.user._id;
      if (req.user.userType === "manager") {
        const org = await Manager.findOne({ userId: req.user._id })
          .populate({
            path: "orgUserId",
            select: "userType name phone email loginID",
          })
          .select("orgUserId");
        userId = org.orgUserId._id;
      }
      const categories = await Client.findOne({ userId })
        .populate({
          path: "categories.categoryId",
          select: "categoryName categoryId",
        })
        .select("categories.categoryId");
      return res.json({ categories });
    } catch (error) {
      return next(error);
    }
  },
  async editCategories(req, res, next) {
    try {
      const editCategorySchema = Joi.object({
        categoryId: Joi.string().pattern(mongodbIdPattern).required(),
        startDate: Joi.date().iso().allow("").optional(),
        endDate: Joi.date().iso().allow("").optional(),
        inspection: Joi.string()
          .valid(
            "Weekly",
            "Fortnight",
            "Monthly",
            "Quarterly",
            "Half Year",
            "Yearly"
          )
          .required(),
        testing: Joi.string()
          .valid(
            "Weekly",
            "Fortnight",
            "Monthly",
            "Quarterly",
            "Half Year",
            "Yearly"
          )
          .required(),
        maintenance: Joi.string()
          .valid(
            "Weekly",
            "Fortnight",
            "Monthly",
            "Quarterly",
            "Half Year",
            "Yearly"
          )
          .required(),
      });
      const { error, value } = editCategorySchema.validate(req.body);

      if (error) {
        return next(error);
      }

      const {
        categoryId,
        startDate,
        endDate,
        inspection,
        testing,
        maintenance,
      } = value;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let userId = req.user._id;
      if (req.user.userType === "manager") {
        const org = await Manager.findOne({ userId: req.user._id })
          .populate({
            path: "orgUserId",
            select: "userType name phone email loginID",
          })
          .select("orgUserId");
        userId = org.orgUserId._id;
      }

      const clientDoc = await Client.findOne({ userId }).populate({
        path: "categories.categoryId",
        select: "categoryName",
      });

      if (!clientDoc) {
        return res.status(404).json({ message: "Client not found" });
      }
      if (!clientDoc.categories || !Array.isArray(clientDoc.categories)) {
        return res
          .status(404)
          .json({ message: "Categories not found in client document" });
      }

      const categoryToUpdate = clientDoc.categories.find(
        (cat) => cat.categoryId._id == categoryId
      );

      // Check if startDate, endDate, or any frequency changed
      const shouldRegenerateTickets =
        startDate !==
          categoryToUpdate?.serviceDetails?.startDate?.toISOString() ||
        endDate !== categoryToUpdate?.serviceDetails.endDate?.toISOString() ||
        inspection !== categoryToUpdate?.serviceFrequency?.inspection ||
        testing !== categoryToUpdate?.serviceFrequency?.testing ||
        maintenance !== categoryToUpdate?.serviceFrequency?.maintenance;
      if (shouldRegenerateTickets && startDate && endDate) {
        await ServiceTickets.deleteMany({
          individualService: true,
          categoryId,
          completedStatus: "Pending",
        });

        const frequencyMap = {
          Weekly: 7,
          Fortnight: 14,
          Monthly: 30,
          Quarterly: 91,
          "Half Year": 182,
          Yearly: 365,
        };

        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);
        const today = new Date();
        const serviceStart = parsedStartDate > today ? parsedStartDate : today;

        const createTickets = async (asset, typeLabel, frequencyKey) => {
          if (!frequencyKey) return;

          const interval = frequencyMap[frequencyKey];
          let date = new Date(serviceStart);
          date.setDate(date.getDate() + interval);

          const ticketsToInsert = [];

          while (date <= parsedEndDate) {
            const expireDate = new Date(date);
            expireDate.setDate(expireDate.getDate() + interval);

            ticketsToInsert.push({
              individualService: true,
              categoryId: asset.productCategoryId,
              orgUserId: asset.orgUserId,
              plantId: asset.plantId,
              assetsId: [asset._id],
              serviceType: typeLabel,
              serviceFrequency: frequencyKey,
              date: new Date(date),
              expireDate,
              completedStatus: "Pending",
            });

            date.setDate(date.getDate() + interval);
          }

          if (ticketsToInsert.length) {
            await ServiceTickets.insertMany(ticketsToInsert);
          }
        };

        const assets = await Asset.find({
          orgUserId: userId,
          status: { $ne: "Deactive" },
          productCategoryId: categoryId,
          $or: [{ groupId: { $exists: false } }, { groupId: null }],
        }).select("productCategoryId orgUserId plantId");

        for (const asset of assets) {
          await createTickets(asset, "Inspection", inspection);
          await createTickets(asset, "Testing", testing);
          await createTickets(asset, "Maintenance", maintenance);
        }
      }

      if (
        startDate &&
        categoryToUpdate?.serviceDetails?.startDate?.toISOString() !==
          new Date(startDate).toISOString()
      ) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (start < today) {
          return res.status(400).json({
            message: "Start Date should be today or a future date",
          });
        }
      }

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end <= start) {
          return res.status(400).json({
            message: "End Date should be after Start Date",
          });
        }
      }

      if (!categoryToUpdate) {
        return res.status(404).json({ message: "Category not found" });
      }

      const changes = [];

      if (
        categoryToUpdate?.serviceDetails &&
        categoryToUpdate?.serviceDetails?.startDate?.toISOString() !==
          new Date(startDate).toISOString()
      ) {
        changes.push(
          `Start Date changed from ${categoryToUpdate?.serviceDetails?.startDate?.toDateString()} to ${new Date(
            startDate
          ).toDateString()}`
        );
      }

      if (
        categoryToUpdate?.serviceDetails &&
        categoryToUpdate?.serviceDetails?.endDate?.toISOString() !==
          new Date(endDate).toISOString()
      ) {
        changes.push(
          `End Date changed from ${categoryToUpdate.serviceDetails.endDate?.toDateString()} to ${new Date(
            endDate
          ).toDateString()}`
        );
      }

      if (
        categoryToUpdate?.serviceDetails &&
        categoryToUpdate?.serviceDetails?.serviceFrequency?.inspection !==
          inspection
      ) {
        changes.push(
          `Inspection Frequency changed from ${categoryToUpdate.serviceDetails.serviceFrequency.inspection} to ${inspection}`
        );
      }

      if (
        categoryToUpdate?.serviceDetails &&
        categoryToUpdate?.serviceDetails?.serviceFrequency?.testing !== testing
      ) {
        changes.push(
          `Testing Frequency changed from ${categoryToUpdate.serviceDetails.serviceFrequency.testing} to ${testing}`
        );
      }

      if (
        categoryToUpdate?.serviceDetails &&
        categoryToUpdate?.serviceDetails?.serviceFrequency?.maintenance !==
        maintenance
      ) {
        changes.push(
          `Maintenance Frequency changed from ${categoryToUpdate.serviceDetails.serviceFrequency.maintenance} to ${maintenance}`
        );
      }

      if (changes.length > 0) {
        await Client.updateOne(
          { userId },
          {
            $push: {
              "categories.$[elem].categoryHistory": {
                editedBy: req.user._id,
                changes: changes.join("; "),
                editedAt: new Date(),
              },
            },
          },
          {
            arrayFilters: [{ "elem._id": categoryId }],
          }
        );
      }

      const client = await Client.findOneAndUpdate(
        { userId, "categories.categoryId": categoryId },
        {
          $set: {
            "categories.$.serviceDetails.startDate": startDate,
            "categories.$.serviceDetails.endDate": endDate,
            "categories.$.serviceDetails.serviceFrequency.inspection":
              inspection,
            "categories.$.serviceDetails.serviceFrequency.testing": testing,
            "categories.$.serviceDetails.serviceFrequency.maintenance":
              maintenance,
          },
        },
        { new: true }
      );

      return res
        .status(200)
        .json({ message: "Category updated successfully", client });
    } catch (error) {
      next(error);
    }
  },

  // if (!client) {
  //   return res
  //     .status(404)
  //     .json({ message: "Client or category not found" });
  // }

  // const category = client.categories.find(
  //   (c) => c._id.toString() === categoryId.toString()
  // );
  // if (startDate && endDate) {
  //   if (
  //     categoryToUpdate.serviceDetails?.startDate != startDate ||
  //     categoryToUpdate.serviceDetails?.endDate != endDate
  //   ) {
  //     const assets = await Asset.find({
  //       orgUserId: userId,
  //     }).populate({
  //       path: "productId",
  //       select: "categoryId",
  //       match: { categoryId: categoryToUpdate.categoryId },
  //     });

  //     const filteredAssets = assets.filter(
  //       (asset) => asset.productId !== null
  //     );

  //     for (const asset of filteredAssets) {
  //       const serviceDetails = category?.serviceDetails?.serviceFrequency;

  //       const serviceStartDate =
  //         asset.installDate < startDate ? startDate : asset.installDate;

  //       const nextServiceDates = {
  //         inspection: calculateNextServiceDate(
  //           serviceStartDate,
  //           serviceDetails?.inspection
  //         ),
  //         testing: calculateNextServiceDate(
  //           serviceStartDate,
  //           serviceDetails?.testing
  //         ),
  //         maintenance: calculateNextServiceDate(
  //           serviceStartDate,
  //           serviceDetails?.maintenance
  //         ),
  //       };

  //       const nextServiceExpireDates = {
  //         inspection: calculateNextServiceDate(
  //           nextServiceDates?.inspection,
  //           serviceDetails?.inspection
  //         ),
  //         testing: calculateNextServiceDate(
  //           nextServiceDates?.testing,
  //           serviceDetails?.testing
  //         ),
  //         maintenance: calculateNextServiceDate(
  //           nextServiceDates?.maintenance,
  //           serviceDetails?.maintenance
  //         ),
  //       };
  //       await asset.updateOne({
  //         $set: {
  //           "serviceDates.nextServiceDates": nextServiceDates,
  //           "serviceDates.nextServiceExpireDates": nextServiceExpireDates,
  //         },
  //       });
  //     }
  //   }
  // }
};

module.exports = categoryController;
