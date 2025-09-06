const Joi = require("joi");
const Asset = require("../../models/organization/asset/Asset");
const AssetDTO = require("../../dto/asset");
const Technician = require("../../models/organization/technician/Technician");
const category = require("../../models/admin/masterData/category");
const ServiceTickets = require("../../models/organization/service/ServiceTickets");
const GroupService = require("../../models/organization/groupService/GroupService");

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const myAssetsController = {
  async getMyAssets(req, res, next) {
    const myAssetsSchema = Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).default(10),
      search: Joi.string().allow("").optional(),
    });

    const { error, value } = myAssetsSchema.validate({
      ...req.params,
      ...req.query,
    });

    if (error) {
      return next(error);
    }

    const { page, limit, search } = value;
    const technicianUserId = req.user._id;

    try {
      const query = { technicianUserId, status: { $ne: "Deactive" } };
      if (search) {
        query.$or = [
          { building: { $regex: search, $options: "i" } },
          { model: { $regex: search, $options: "i" } },
          { slNo: { $regex: search, $options: "i" } },
          { pressureRating: { $regex: search, $options: "i" } },
          { pressureUnit: { $regex: search, $options: "i" } },
          { moc: { $regex: search, $options: "i" } },
          { approval: { $regex: search, $options: "i" } },
          { fireClass: { $regex: search, $options: "i" } },
          { suctionSize: { $regex: search, $options: "i" } },
          { head: { $regex: search, $options: "i" } },
          { rpm: { $regex: search, $options: "i" } },
          { mocOfImpeller: { $regex: search, $options: "i" } },
          { fuelCapacity: { $regex: search, $options: "i" } },
          { flowInLpm: { $regex: search, $options: "i" } },
          { housePower: { $regex: search, $options: "i" } },
          { healthStatus: { $regex: search, $options: "i" } },
          { tag: { $regex: search, $options: "i" } },
          { status: { $regex: search, $options: "i" } },
          { assetId: { $regex: search, $options: "i" } },
          { groupName: { $regex: search, $options: "i" } },
          {
            "productId.productName": {
              $regex: search,
              $options: "i",
            },
          },
          { "plantId.plantName": { $regex: search, $options: "i" } },
        ];
      }

      const totalAssets = await Asset.countDocuments(query);

      const myAssets = await Asset.find(query)
        .populate([
          { path: "plantId", select: "-layouts" },
          { path: "productId" },
        ])
        .select("-serviceDates ")
        .skip((page - 1) * limit)
        .select("-technicianUserId")
        .limit(limit);
      const enrichedAssets = await Promise.all(
        myAssets.map(async (a) => {
          const nextInspection = await ServiceTickets.findOne({
            assetsId: a._id,
            completedStatus: "Pending",
            serviceType: "Inspection",
          }).select("date");

          const nextTesting = await ServiceTickets.findOne({
            assetsId: a._id,
            completedStatus: "Pending",
            serviceType: "Testing",
          }).select("date");

          const nextMaintenance = await ServiceTickets.findOne({
            assetsId: a._id,
            completedStatus: "Pending",
            serviceType: "Maintenance",
          }).select("date");
          const lastInspection = await ServiceTickets.findOne({
            assetsId: a._id,
            completedStatus: "Completed",
            serviceType: "Inspection",
          })
            .sort({ date: -1 })
            .select("date");
          const lastTesting = await ServiceTickets.findOne({
            assetsId: a._id,
            completedStatus: "Completed",
            serviceType: "Testing",
          })
            .sort({ date: -1 })
            .select("date");
          const lastMaintenance = await ServiceTickets.findOne({
            assetsId: a._id,
            completedStatus: "Completed",
            serviceType: "Maintenance",
          })
            .sort({ date: -1 })
            .select("date");

          return {
            ...a.toObject(),
            serviceDates: {
              nextServiceDates: {
                inspection: nextInspection?.date ?? null,
                testing: nextTesting?.date ?? null,
                maintenance: nextMaintenance?.date ?? null,
              },
              lastServiceDates: {
                inspection: lastInspection?.date ?? null,
                testing: lastTesting?.date ?? null,
                maintenance: lastMaintenance?.date ?? null,
              },
            },
          };
        })
      );

      // const assetDTOs = enrichedAssets.map((asset) => new AssetDTO(asset));

      return res.json({
        myAssets: enrichedAssets,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalAssets / limit),
          totalAssets,
        },
      });
    } catch (error) {
      return next(error);
    }
  },
  async getAssetById(req, res, next) {
    const myAssetsSchema = Joi.object({
      assetId: Joi.string().pattern(mongodbIdPattern).required(),
    });

    const { error } = myAssetsSchema.validate(req.params);

    if (error) {
      return next(error);
    }
    const { assetId } = req.params;
    // const { lat, long } = req.body;

    try {
      const technician = await Technician.findOne({
        userId: req.user._id,
      }).select("plantId");

      if (!technician) {
        return res.status(404).json({ error: "Technician not found" });
      }
      const asset = await Asset.findOne({
        _id: assetId,
        plantId: { $in: technician.plantId },
      })
        .populate("plantId")
        .populate({
          path: "productId",
          populate: { path: "categoryId", select: "categoryName" },
        })
        .select("-technicianUserId -serviceDates")
        .exec();

      if (!asset) {
        return res
          .status(404)
          .json({ error: "Asset not found or not in your plant" });
      }

      // Get service ticket dates
      const [nextInspection, nextTesting, nextMaintenance] = await Promise.all([
        ServiceTickets.findOne({
          groupServiceId: asset._id,
          completedStatus: "Pending",
          serviceType: "Inspection",
        }).select("date"),

        ServiceTickets.findOne({
          groupServiceId: asset._id,
          completedStatus: "Pending",
          serviceType: "Testing",
        }).select("date"),

        ServiceTickets.findOne({
          groupServiceId: asset._id,
          completedStatus: "Pending",
          serviceType: "Maintenance",
        }).select("date"),
      ]);

      const [lastInspection, lastTesting, lastMaintenance] = await Promise.all([
        ServiceTickets.findOne({
          groupServiceId: asset._id,
          completedStatus: "Completed",
          serviceType: "Inspection",
        })
          .sort({ date: -1 })
          .select("date"),

        ServiceTickets.findOne({
          groupServiceId: asset._id,
          completedStatus: "Completed",
          serviceType: "Testing",
        })
          .sort({ date: -1 })
          .select("date"),

        ServiceTickets.findOne({
          groupServiceId: asset._id,
          completedStatus: "Completed",
          serviceType: "Maintenance",
        })
          .sort({ date: -1 })
          .select("date"),
      ]);

      const enrichedAsset = {
        ...asset.toObject(),
        serviceDates: {
          nextServiceDates: {
            inspection: nextInspection?.date ?? null,
            testing: nextTesting?.date ?? null,
            maintenance: nextMaintenance?.date ?? null,
          },
          lastServiceDates: {
            inspection: lastInspection?.date ?? null,
            testing: lastTesting?.date ?? null,
            maintenance: lastMaintenance?.date ?? null,
          },
        },
      };

      const response = { asset: enrichedAsset };
      if (!enrichedAsset.groupId) {
        const categoryForm = await category
          .findById(enrichedAsset.productId.categoryId._id)
          .populate({
            path: "formId",
            select: "_id",
          })
          .select("formId");
        response.serviceFormId = categoryForm.formId._id;
      } else {
        const group = await GroupService.findById({
          _id: enrichedAsset.groupId,
        }).select("formId");
        response.serviceFormId = group.formId;
      }

      return res.json(response);
    } catch (error) {
      return next(error);
    }
  },
  async getServiceAssetById(req, res, next) {
    const myAssetsSchema = Joi.object({
      assetId: Joi.string().pattern(mongodbIdPattern).required(),
    });

    const { error } = myAssetsSchema.validate(req.params);

    if (error) {
      return next(error);
    }
    const { assetId } = req.params;

    try {
      const asset = await Asset.findById(assetId)
        .populate("plantId")
        .populate({
          path: "productId",
          populate: { path: "categoryId", select: "categoryName" },
        })
        .select("-technicianUserId -serviceDates")
        .exec();
      if (!asset) {
        return res.status(404).json({ error: "Asset not found" });
      }

      return res.json({ asset });
    } catch (error) {
      return next(error);
    }
  },
  async updateLocation(req, res, next) {
    const updateLocationSchema = Joi.object({
      assetId: Joi.string().pattern(mongodbIdPattern).required(),
      lat: Joi.string().required(),
      long: Joi.string().required(),
    });
    const { error } = updateLocationSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { assetId, lat, long } = req.body;

    try {
      const asset = await Asset.findById(assetId);
      if (asset.lat || asset.long) {
        return res.status(400).json({
          message: "manager not requested for the location update",
        });
      }
      asset.lat = lat;
      asset.long = long;
      await asset.save();
      return res.json({
        asset,
        message: "Asset location updated successfully.",
      });
    } catch (error) {
      return next(error);
    }
  },
  async getAssetsDetailsByScannerId(req, res, next) {
    const getAssetsDetailsByScannerIdSchema = Joi.object({
      id: Joi.string().pattern(mongodbIdPattern).required(),
    });

    const { error } = getAssetsDetailsByScannerIdSchema.validate(req.params);

    if (error) {
      return next(error);
    }
    const { id } = req.params;
    try {
      let data;
      let nextInspection;
      let nextTesting;
      let nextMaintenance;
      data = await GroupService.findById(id)
        .populate([
          { path: "assetsId", select: "assetId building lat long" },
          { path: "plantId", select: "plantName" },
          { path: "orgUserId", select: "name" },
        ])
        .select("-formId");
      if (data) {
        nextInspection = await ServiceTickets.findOne({
          assetsId: data.assetsId,
          completedStatus: "Pending",
          serviceType: "Inspection",
        }).select("date");
        nextTesting = await ServiceTickets.findOne({
          assetsId: data.assetsId,
          completedStatus: "Pending",
          serviceType: "Testing",
        }).select("date");
        nextMaintenance = await ServiceTickets.findOne({
          assetsId: data.assetsId,
          completedStatus: "Pending",
          serviceType: "Maintenance",
        }).select("date");
        return res.json({
          groupId: data._id,
          groupName: data.groupName,
          groupId: data.groupId,
          groupDescription: data.description,
          assets: data.assetsId,
          orgUserId: data.orgUserId,
          plantId: data.plantId,
          qrCodeUrl: data.qrCodeUrl,
          nextInspection,
          nextTesting,
          nextMaintenance,
        });
      } else {
        data = await Asset.findById(id)
          .populate([
            { path: "plantId", select: "plantName" },
            { path: "orgUserId", select: "name" },
          ])
          .select(
            "assetId building plantId orgUserId qrCodeUrl groupId lat long"
          );
        nextInspection = await ServiceTickets.findOne({
          assetsId: data._id,
          completedStatus: "Pending",
          serviceType: "Inspection",
        }).select("date");
        nextTesting = await ServiceTickets.findOne({
          assetsId: data._id,
          completedStatus: "Pending",
          serviceType: "Testing",
        }).select("date");
        nextMaintenance = await ServiceTickets.findOne({
          assetsId: data._id,
          completedStatus: "Pending",
          serviceType: "Maintenance",
        }).select("date");
        if (data.groupId) {
          data = await GroupService.findById(data.groupId)
            .populate([
              { path: "assetsId", select: "assetId building lat long" },
              { path: "plantId", select: "plantName" },
              { path: "orgUserId", select: "name" },
            ])
            .select("-formId");
          return res.json({
            groupId: data._id,
            groupName: data.groupName,
            groupId: data.groupId,
            groupDescription: data.description,
            assets: data.assetsId,
            orgUserId: data.orgUserId,
            plantId: data.plantId,
            qrCodeUrl: data.qrCodeUrl,
            nextInspection,
            nextTesting,
            nextMaintenance,
          });
        }
      }
      return res.json({
        groupId: null,
        groupName: null,
        groupId: null,
        groupDescription: null,
        assets: [data],
        orgUserId: data.orgUserId,
        plantId: data.plantId,
        qrCodeUrl: data.qrCodeUrl,
        nextInspection,
        nextTesting,
        nextMaintenance,
      });
    } catch (error) {
      return next(error);
    }
  },
};
module.exports = myAssetsController;
