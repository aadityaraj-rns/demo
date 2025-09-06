const Joi = require("joi");
const uploadOnClodinary = require("../../../utils/cloudinary");
const Plant = require("../../../models/organization/plant/Plant");
const PlantDTO = require("../../../dto/PlantDTO");
const getFormattedCategories = require("../helperfunctions/getFormattedCategories");
const Manager = require("../../../models/organization/manager/Manager");
const uploadOnCloudinary = require("../../../utils/cloudinary");
const city = require("../../../models/admin/masterData/city");

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const plantController = {
  async getAll(req, res, next) {
    try {
      let orgUserId = req.user._id;
      let plantQuery = { orgUserId };
      if (req.user.userType === "manager") {
        const org = await Manager.findOne({ userId: req.user._id })
          .populate({
            path: "orgUserId",
            select: "userType name phone email loginID",
          })
          .select("orgUserId");
        orgUserId = org.orgUserId._id;
        plantQuery = { managerId: org._id };
      }
      const allPlants = await Plant.find(plantQuery)
        .sort({ createdAt: -1 })
        .populate("cityId")
        .populate("orgUserId")
        .populate({
          path: "managerId",
          populate: "userId",
        });
      const categories = await getFormattedCategories(orgUserId);

      const plantDto = allPlants.map(
        (plant) => new PlantDTO(plant, categories)
      );

      return res.json({ allPlants: plantDto });
    } catch (error) {
      return next(error);
    }
  },
  async getAllPlantNames(req, res, next) {
    try {
      let plantQuery = {
        orgUserId: req.user._id,
        status: "Active",
      };
      if (req.user.userType === "manager") {
        const org = await Manager.findOne({ userId: req.user._id })
          .populate({
            path: "orgUserId",
            select: "userType name phone email loginID",
          })
          .select("orgUserId");
        plantQuery = {
          orgUserId: org.orgUserId._id,
          managerId: org._id,
          status: "Active",
        };
      }

      const allPlants = await Plant.find(plantQuery)
        .populate({
          path: "managerId",
          select: "userId",
          populate: { path: "userId", select: "name phone" },
        })
        .select("plantName plantId layouts plantImage");
      return res.json({ allPlants });
    } catch (error) {
      return next(error);
    }
  },
  async editPlantImage(req, res, next) {
    try {
      const { _id } = req.body;
      const plant = await Plant.findById(_id);
      if (!plant) {
        return res.status(404).json({ message: "Plant not found" });
      }
      const files = req.files || {};
      const baths = {
        plantImagePath: files.plantImage ? files.plantImage[0].path : undefined,
      };
      let imageUrl;
      if (baths.plantImagePath) {
        const uploadResult = await uploadOnCloudinary(baths.plantImagePath);
        imageUrl = uploadResult?.secure_url;
        plant.plantImage = imageUrl;
      }

      await plant.save();
      return res.json({ imageUrl: plant.plantImage });
    } catch (error) {
      return res.json(error);
    }
  },
  async addLayoutInplant(req, res, next) {
    try {
      const { _id, plantLayoutName, plantLayoutImage } = req.body;
      if ((!_id, !plantLayoutName)) {
        return res
          .status(400)
          .json({ message: "plantLayoutName and _id of plant is required" });
      }
      const plant = await Plant.findById(_id);
      if (!plant) {
        return res.status(404).json({ message: "Plant not found" });
      }
      // const files = req.files || {};
      // if (!files.plantLayoutImage) {
      //   return res
      //     .status(400)
      //     .json({ message: "plantLayoutImage is required" });
      // }
      // const baths = {
      //   plantLayoutImagePath: files.plantLayoutImage
      //     ? files.plantLayoutImage[0].path
      //     : undefined,
      // };
      // let plantLayoutImage;
      // if (baths.plantLayoutImagePath) {
      //   const uploadResult = await uploadOnCloudinary(
      //     baths.plantLayoutImagePath
      //   );
      //   plantLayoutImage = uploadResult?.secure_url;
      plant.layouts.push({
        layoutName: plantLayoutName,
        layoutImage: plantLayoutImage,
      });
      // }

      await plant.save();
      return res.json({ imageUrl: plant.layouts });
    } catch (error) {
      return next(error);
    }
  },
  async create(req, res, next) {
    try {
      const plantCreateSchema = Joi.object({
        pumpIotDeviceId: Joi.string().optional(),
        plantName: Joi.string().required(),
        address: Joi.string().required(),
        cityId: Joi.string().pattern(mongodbIdPattern).required(),
        managerId: Joi.string().pattern(mongodbIdPattern).optional(),
        headerPressure: Joi.string().optional(),
        pressureUnit: Joi.string()
          .valid("Kg/Cm2", "PSI", "MWC", "Bar")
          .allow("")
          .optional(),
        mainWaterStorage: Joi.string().optional(),
        primeWaterTankStorage: Joi.string().optional(),
        dieselStorage: Joi.string().optional(),
      });

      const { error } = plantCreateSchema.validate(req.body);
      if (error) {
        return next(error);
      }

      const {
        pumpIotDeviceId,
        plantName,
        address,
        cityId,
        managerId,
        headerPressure,
        mainWaterStorage,
        primeWaterTankStorage,
        dieselStorage,
        pressureUnit,
      } = req.body;
      const files = req.files || []; // Ensure files is always an array

      // 🌟 Handle optional plant image safely
      const plantImageFile = files.find(
        (file) => file.fieldname === "plantImage"
      );
      let plantImageUpload = null;

      if (plantImageFile) {
        plantImageUpload = await uploadOnClodinary(plantImageFile.path);
      }

      let orgUserId = req.user._id;
      let orgName = req.user.name;
      if (req.user.userType === "manager") {
        const org = await Manager.findOne({ userId: req.user._id })
          .populate({
            path: "orgUserId",
            select: "userType name phone email loginID",
          })
          .select("orgUserId");
        orgUserId = org?.orgUserId?._id;
        orgName = org?.orgUserId?.name;
      }

      const plantCount = await Plant.countDocuments({
        orgUserId,
      });
      const orgNameSlice = orgName.toString().slice(0, 2).toUpperCase();
      const cityData = await city.findById(cityId).select("cityName");
      const citySlice = cityData.cityName.toString().slice(0, 3).toUpperCase();

      // 🌟 Create new plant with optional plantImage & layouts
      const newPlant = new Plant({
        plantId: `${orgNameSlice}-${citySlice}-${(plantCount + 1)
          .toString()
          .padStart(4, "0")}`,
        orgUserId,
        pumpIotDeviceId,
        plantName,
        address,
        cityId,
        managerId,
        plantImage: plantImageUpload ? plantImageUpload.url : null,
        headerPressure,
        pressureUnit,
        mainWaterStorage,
        primeWaterTankStorage,
        dieselStorage,
      });

      await newPlant.save();

      return res.status(200).json({ message: "Plant created successfully" });
    } catch (error) {
      console.error(error);
      return next(new Error("Failed to create plant."));
    }
  },
  async editPlant(req, res, next) {
    try {
      const plantEditSchema = Joi.object({
        _id: Joi.string().pattern(mongodbIdPattern),
        pumpIotDeviceId: Joi.string().optional(),
        plantName: Joi.string(),
        address: Joi.string(),
        cityId: Joi.string().pattern(mongodbIdPattern),
        managerId: Joi.string().pattern(mongodbIdPattern).optional(),
        status: Joi.string(),
        headerPressure: Joi.string().optional(),
        pressureUnit: Joi.string()
          .valid("Kg/Cm2", "PSI", "MWC", "Bar")
          .allow("")
          .optional(),
        mainWaterStorage: Joi.string().optional(),
        primeWaterTankStorage: Joi.string().optional(),
        dieselStorage: Joi.string().optional(),
      });

      const { error, value } = plantEditSchema.validate(req.body);
      if (error) {
        return next(new Error(error.details[0].message));
      }

      const {
        pumpIotDeviceId,
        plantName,
        address,
        cityId,
        managerId,
        headerPressure,
        pressureUnit,
        mainWaterStorage,
        primeWaterTankStorage,
        dieselStorage,
      } = value;
      const files = req.files;

      const plant = await Plant.findById(req.params.id);
      if (!plant) {
        return res.status(404).json({ message: "Plant not found" });
      }

      const plantImage =
        files.find((file) => file.fieldname === "plantImage") || null;

      if (plantImage) {
        const plantImageUpload = await uploadOnClodinary(plantImage.path);
        plant.plantImage = plantImageUpload.url;
      }

      plant.pumpIotDeviceId = pumpIotDeviceId || plant.pumpIotDeviceId;
      plant.plantName = plantName || plant.plantName;
      plant.address = address || plant.address;
      plant.cityId = cityId || plant.cityId;
      plant.managerId = managerId || plant.managerId;
      plant.headerPressure = headerPressure || plant.headerPressure;
      plant.pressureUnit = pressureUnit || plant.pressureUnit;
      plant.mainWaterStorage = mainWaterStorage || plant.mainWaterStorage;
      plant.primeWaterTankStorage =
        primeWaterTankStorage || plant.primeWaterTankStorage;
      plant.dieselStorage = dieselStorage || plant.dieselStorage;

      const updatedPlant = await plant.save();

      return res.json({
        message: "Plant updated successfully",
        plant: updatedPlant,
      });
    } catch (error) {
      console.error("Error updating plant:", error);
      return next(new Error("Failed to update plant."));
    }
  },
  // this methods help to get layouts of the plant from the plant table
  async getLayoutsByPlant(req, res, next) {
    const { plantId } = req.params;
    try {
      const layouts = await Plant.findById(plantId).select(
        "layouts.layoutImage layouts.layoutName"
      );
      return res.json(layouts);
    } catch (error) {
      next(error);
    }
  },
  async getLayoutMarkers(req, res, next) {
    try {
      const { plantId, layoutName } = req.body;

      const plant = await Plant.findOne(
        {
          _id: plantId,
          "layouts.layoutName": layoutName,
        },
        { "layouts.$": 1 }
      ).populate({
        path: "layouts.markers.assetId",
        populate: [
          { path: "productCategoryId", select: "categoryName" },
          { path: "productId", select: "type" },
        ],
        select:
          "assetId productCategoryId productId location healthStatus createdAt",
      });

      const markers = plant.layouts[0].markers || [];

      // Include populated values for filtering on frontend
      const formattedMarkers = markers.map((marker) => ({
        _id: marker.assetId?._id,
        x: marker.x,
        y: marker.y,
        label: marker.assetId, // Full asset object
        categoryName: marker.assetId?.productCategoryId?.categoryName,
        type: marker.assetId?.productId?.type,
        location: marker.assetId?.location,
        healthStatus: marker.assetId?.healthStatus,
      }));

      return res.json({ markers: formattedMarkers });
    } catch (error) {
      return next(error);
    }
  },
  // update layout marker from the plant layout
  async updateLayoutMarker(req, res, next) {
    try {
      const { plantId, layoutName, markers } = req.body;

      if (!plantId || !layoutName || !markers) {
        return res
          .status(400)
          .json({ message: "plantId, layoutName, and markers are required." });
      }

      const plant = await Plant.findById(plantId).select("layouts");

      if (!plant) {
        return res.status(404).json({ message: "Plant not found." });
      }

      const layout = plant.layouts.find((l) => l.layoutName === layoutName);

      if (!layout) {
        return res.status(404).json({ message: "Layout not found." });
      }

      layout.markers = markers;

      await plant.save();

      const updated = await Plant.findOne(
        { _id: plantId, "layouts.layoutName": layoutName },
        { "layouts.$": 1 }
      ).populate("layouts.markers.assetId", "assetId");

      return res.status(200).json(updated.layouts[0].markers);
    } catch (error) {
      next(error);
    }
  },
  async getPumpIotDeviceIdByPlant(req, res, next) {
    const { id } = req.params;
    try {
      const plant = await Plant.findById(id).select("pumpIotDeviceId");
      return res.json(plant);
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = plantController;
