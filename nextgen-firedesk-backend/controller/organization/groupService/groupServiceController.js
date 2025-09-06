const Joi = require("joi");
const GroupService = require("../../../models/organization/groupService/GroupService");
const Manager = require("../../../models/organization/manager/Manager");
const Plant = require("../../../models/organization/plant/Plant");
const uploadOnCloudinary = require("../../../utils/cloudinary");
const { generateQRCode } = require("../../../services/QrCodeService");
const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;
const path = require("path");
const fs = require("fs");
const Asset = require("../../../models/organization/asset/Asset");
const ServiceTickets = require("../../../models/organization/service/ServiceTickets");

const groupServiceController = {
  async createGroupService(req, res, next) {
    const createGroupServiceSchema = Joi.object({
      groupName: Joi.string().required(),
      formId: Joi.string().pattern(mongodbIdPattern).required(),
      plantId: Joi.string().pattern(mongodbIdPattern).required(),
      categoryIds: Joi.array()
        .items(Joi.string().pattern(mongodbIdPattern))
        .optional(),
      assetsId: Joi.array()
        .items(Joi.string().pattern(mongodbIdPattern))
        .optional(),
      startDate: Joi.date().iso().allow("").optional(),
      endDate: Joi.date().iso().allow("").optional(),
      inspection: Joi.string()
        .valid(
          "Weekly",
          "Fortnight",
          "Monthly",
          "Quarterly",
          "Half Year",
          "Yearly",
          ""
        )
        .required(),
      testing: Joi.string()
        .valid(
          "Weekly",
          "Fortnight",
          "Monthly",
          "Quarterly",
          "Half Year",
          "Yearly",
          ""
        )
        .required(),
      maintenance: Joi.string()
        .valid(
          "Weekly",
          "Fortnight",
          "Monthly",
          "Quarterly",
          "Half Year",
          "Yearly",
          ""
        )
        .required(),
      description: Joi.string().allow("").optional(),
    });

    const { error } = createGroupServiceSchema.validate(req.body);
    if (error) return next(error);

    const {
      groupName,
      formId,
      plantId,
      categoryIds,
      description,
      assetsId,
      startDate,
      endDate,
      inspection,
      testing,
      maintenance,
    } = req.body;
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

      const findAssetInGroup = await GroupService.find({
        orgUserId,
        assetsId: { $in: assetsId },
      }).countDocuments();
      if (findAssetInGroup > 0)
        return res.status(400).json({
          message:
            "One or more selected assets already belong to a group and cannot be reassigned.",
        });

      const groupCount = await GroupService.countDocuments({
        orgUserId,
      });
      const plantData = await Plant.findById(plantId).select("plantName");
      let groupService = new GroupService({
        groupId: `${plantData?.plantName
          ?.toString()
          ?.slice(0, 3)
          ?.toUpperCase()}-${groupName
          ?.toString()
          ?.slice(0, 3)
          ?.toUpperCase()}-${(groupCount + 1).toString().padStart(4, "0")}`,
        groupName,
        formId,
        description,
        assetsId,
        orgUserId,
        plantId,
        startDate,
        endDate,
        inspection,
        testing,
        maintenance,
      });
      await groupService.save();

      const qrUrl = await generateQRCode(groupService._id);
      const qrCodeBuffer = Buffer.from(qrUrl.split(",")[1], "base64");
      const qrDir = path.join("public", "group-qr");
      if (!fs.existsSync(qrDir)) {
        fs.mkdirSync(qrDir, { recursive: true });
      }
      const qrCodeFilePath = path.join(
        "public/group-qr",
        `${groupService._id}.png`
      );
      fs.writeFileSync(qrCodeFilePath, qrCodeBuffer);
      const uploadResponse = await uploadOnCloudinary(qrCodeFilePath);
      if (!uploadResponse) {
        throw new Error("Failed to upload QR code to Cloudinary");
      }
      groupService.qrCodeUrl = uploadResponse.secure_url;
      await groupService.save();
      await Asset.updateMany(
        { _id: { $in: assetsId } },
        { groupId: groupService._id }
      );
      if (startDate && endDate) {
        const frequencyMap = {
          Weekly: 7,
          Fortnight: 14,
          Monthly: 30,
          Quarterly: 91,
          "Half Year": 182,
          Yearly: 365,
        };

        const allTickets = [];
        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);

        const createTickets = (type, frequency) => {
          const interval = frequencyMap[frequency];
          let date = new Date(parsedStartDate);
          date.setDate(date.getDate() + interval);

          while (date <= parsedEndDate) {
            const expireDate = new Date(date);
            expireDate.setDate(expireDate.getDate() + interval);

            allTickets.push({
              serviceType: type,
              serviceFrequency: frequency,
              groupServiceId: groupService._id,
              orgUserId,
              plantId,
              assetsId,
              date: new Date(date),
              expireDate,
              completedStatus: "Pending",
            });

            date.setDate(date.getDate() + interval);
          }
        };

        if (inspection) createTickets("inspection", inspection);
        if (testing) createTickets("testing", testing);
        if (maintenance) createTickets("maintenance", maintenance);

        // Save all service tickets in bulk
        if (allTickets.length > 0) {
          await ServiceTickets.insertMany(allTickets);
        }
      }

      return res.json(groupService);
    } catch (error) {
      return next(error);
    }
  },
  async getGroupServices(req, res, next) {
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
      const groups = await GroupService.find({ orgUserId }).populate([
        {
          path: "assetsId",
          select: "assetId productCategoryId plantId",
        },
        {
          path: "formId",
          select: "serviceName",
        },
        {
          path: "plantId",
          select: "plantName",
        },
      ]);
      return res.json(groups);
    } catch (error) {
      return next(error);
    }
  },
  async getById(req, res, next) {
    try {
      const { _id } = req.params;
      const nextInspection = await ServiceTickets.findOne({
        groupServiceId: _id,
        completedStatus: { $eq: "Pending" },
        serviceType: "Inspection",
      }).select("date");
      const nextTesting = await ServiceTickets.findOne({
        groupServiceId: _id,
        completedStatus: { $eq: "Pending" },
        serviceType: "Testing",
      }).select("date");
      const nextMaintenence = await ServiceTickets.findOne({
        groupServiceId: _id,
        completedStatus: { $eq: "Pending" },
        serviceType: "Maintenence",
      }).select("date");
      const groupDetilas = await GroupService.findById(_id)
        .populate([
          {
            path: "assetsId",
            populate: { path: "productCategoryId", select: "categoryName" },
            select: "assetId productCategoryId building",
          },
          { path: "plantId", select: "plantName" },
        ]);
      const serviceDetails = await ServiceTickets.find({
        groupServiceId: _id,
        completedStatus: { $eq: "Completed" },
      })
        .sort({ date: 1 })
        .select("serviceType serviceFrequency date completedStatus");

      return res.json({
        serviceDetails,
        groupDetilas,
        nextInspection,
        nextTesting,
        nextMaintenence,
      });
    } catch (error) {
      return next(error);
    }
  },
  async editGroupService(req, res, next) {
    const createGroupServiceSchema = Joi.object({
      _id: Joi.string().pattern(mongodbIdPattern).required(),
      groupName: Joi.string().required(),
      formId: Joi.string().pattern(mongodbIdPattern).required(),
      plantId: Joi.string().pattern(mongodbIdPattern).required(),
      categoryIds: Joi.array()
        .items(Joi.string().pattern(mongodbIdPattern))
        .optional(),
      assetsId: Joi.array()
        .items(Joi.string().pattern(mongodbIdPattern))
        .optional(),
      startDate: Joi.date().iso().allow("").optional(),
      endDate: Joi.date().iso().allow("").optional(),
      inspection: Joi.string()
        .valid(
          "Weekly",
          "Fortnight",
          "Monthly",
          "Quarterly",
          "Half Year",
          "Yearly",
          ""
        )
        .required(),
      testing: Joi.string()
        .valid(
          "Weekly",
          "Fortnight",
          "Monthly",
          "Quarterly",
          "Half Year",
          "Yearly",
          ""
        )
        .required(),
      maintenance: Joi.string()
        .valid(
          "Weekly",
          "Fortnight",
          "Monthly",
          "Quarterly",
          "Half Year",
          "Yearly",
          ""
        )
        .required(),
      description: Joi.string().allow("").optional(),
    });

    const { error } = createGroupServiceSchema.validate(req.body);
    if (error) return next(error);

    const {
      _id,
      groupName,
      formId,
      plantId,
      categoryIds,
      description,
      assetsId,
      startDate,
      endDate,
      inspection,
      testing,
      maintenance,
    } = req.body;
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

      const findAssetInGroup = await GroupService.countDocuments({
        _id: { $ne: _id },
        orgUserId,
        assetsId: { $in: assetsId },
      });
      if (findAssetInGroup > 0)
        return res.status(400).json({
          message:
            "One or more selected assets already belong to a group and cannot be reassigned.",
        });

      // Get current group before updating
      const existingGroup = await GroupService.findById(_id).select("assetsId");
      if (!existingGroup) {
        return res.status(404).json({ message: "Group service not found" });
      }

      const oldAssetIds =
        existingGroup.assetsId?.map((id) => id.toString()) || [];
      const newAssetIds = assetsId.map((id) => id.toString());

      // Determine which assets were removed and which were added
      const removedAssetIds = oldAssetIds.filter(
        (id) => !newAssetIds.includes(id)
      );
      const addedAssetIds = newAssetIds.filter(
        (id) => !oldAssetIds.includes(id)
      );

      // Remove groupId from removed assets
      if (removedAssetIds.length > 0) {
        await Asset.updateMany(
          { _id: { $in: removedAssetIds }, groupId: _id },
          { $unset: { groupId: "" } }
        );
      }

      // Add groupId to added assets
      if (addedAssetIds.length > 0) {
        await Asset.updateMany(
          { _id: { $in: addedAssetIds } },
          { $set: { groupId: _id } }
        );
      }

      //Update the group
      await GroupService.findOneAndUpdate(
        { _id },
        {
          groupName,
          formId,
          plantId,
          description,
          assetsId,
          startDate,
          endDate,
          inspection,
          testing,
          maintenance,
        },
        { new: true }
      );

      const frequencyMap = {
        Weekly: 7,
        Fortnight: 14,
        Monthly: 30,
        Quarterly: 91,
        "Half Year": 182,
        Yearly: 365,
      };

      // Check if startDate, endDate, or any frequency changed
      const shouldRegenerateTickets =
        startDate !== existingGroup.startDate?.toISOString() ||
        endDate !== existingGroup.endDate?.toISOString() ||
        inspection !== existingGroup.inspection ||
        testing !== existingGroup.testing ||
        maintenance !== existingGroup.maintenance;

      if (shouldRegenerateTickets && startDate && endDate) {
        // Remove existing pending tickets for this group
        await ServiceTickets.deleteMany({
          groupServiceId: _id,
          completedStatus: "Pending",
        });

        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);
        const today = new Date();
        const serviceStart = parsedStartDate > today ? parsedStartDate : today;

        const createTickets = async (typeLabel, frequencyKey) => {
          if (!frequencyKey) return;

          const interval = frequencyMap[frequencyKey];
          let date = new Date(serviceStart);
          date.setDate(date.getDate() + interval);

          const ticketsToInsert = [];

          while (date <= parsedEndDate) {
            const expireDate = new Date(date);
            expireDate.setDate(expireDate.getDate() + interval);

            ticketsToInsert.push({
              groupServiceId: _id,
              orgUserId,
              plantId,
              assetsId,
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

        await createTickets("Inspection", inspection);
        await createTickets("Testing", testing);
        await createTickets("Maintenance", maintenance);
      } else {
        const abc = await ServiceTickets.findOneAndUpdate(
          { groupServiceId: _id },
          { plantId, assetsId }
        );
      }

      return res.json({
        message: "Successfully edited the group service data",
      });
    } catch (error) {
      return next(error);
    }
  },
};
module.exports = groupServiceController;
