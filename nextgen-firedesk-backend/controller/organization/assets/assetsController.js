const Joi = require("joi");
const uploadOnClodinary = require("../../../utils/cloudinary");
const fs = require("fs");
const Asset = require("../../../models/organization/asset/Asset");
const AssetDTO = require("../../../dto/asset");
const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;
const { generateQRCode } = require("../../../services/QrCodeService");
const path = require("path");
const uploadOnCloudinary = require("../../../utils/cloudinary");
const Product = require("../../../models/admin/product");
const {
  calculateNextServiceDate,
} = require("../../../services/calculateNextServiceDate");
const Client = require("../../../models/admin/client/Client");
const Plant = require("../../../models/organization/plant/Plant");
const Manager = require("../../../models/organization/manager/Manager");
const FormResponse = require("../../../models/technician/FormResponse/FormResponse");
const notification = require("../../../models/Notification");
const pushNotification = require("../../firebasePushNotification/pushNotificationControlleer");
const Technician = require("../../../models/organization/technician/Technician");
const ServiceTickets = require("../../../models/organization/service/ServiceTickets");

const assetController = {
  async create(req, res, next) {
    const createAssetSchema = Joi.object({
      plantId: Joi.string().pattern(mongodbIdPattern).required(),
      building: Joi.string().required(),
      productCategoryId: Joi.string().pattern(mongodbIdPattern).required(),
      productId: Joi.string().pattern(mongodbIdPattern).required(),
      type: Joi.string().required(),
      subType: Joi.string().optional(),
      location: Joi.string().required(),
      capacity: Joi.number().required(),
      capacityUnit: Joi.string().optional(),
      model: Joi.string().allow("").optional(),
      slNo: Joi.string().allow("").optional(),
      pressureRating: Joi.number().allow("").optional(),
      pressureUnit: Joi.string()
        .valid("Kg/Cm2", "PSI", "MWC", "Bar")
        .allow("")
        .optional(),
      moc: Joi.string().allow("").optional(),
      approval: Joi.string().allow("").optional(),
      fireClass: Joi.string().optional().allow(""),
      manufacturingDate: Joi.date().iso().required(),
      installDate: Joi.date().iso().required(),
      suctionSize: Joi.string().optional().allow(""),
      head: Joi.string().optional().allow(""),
      rpm: Joi.string().optional().allow(""),
      mocOfImpeller: Joi.string().optional().allow(""),
      fuelCapacity: Joi.string().optional().allow(""),
      flowInLpm: Joi.string().optional().allow(""),
      housePower: Joi.string().optional().allow(""),
      healthStatus: Joi.string()
        .valid("NotWorking", "AttentionRequired", "Healthy")
        .default("Healthy"),
      tag: Joi.string().optional().allow(""),
      status: Joi.string()
        .valid("Warranty", "AMC", "In-House", "Deactive")
        .required(),
      manufacturerName: Joi.string().allow("").optional(),
    });

    const { error } = createAssetSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const {
      plantId,
      building,
      productCategoryId,
      productId,
      type,
      subType,
      location,
      capacity,
      capacityUnit,
      model,
      slNo,
      pressureRating,
      pressureUnit,
      moc,
      approval,
      fireClass,
      manufacturingDate,
      installDate,
      suctionSize,
      head,
      rpm,
      mocOfImpeller,
      fuelCapacity,
      flowInLpm,
      housePower,
      healthStatus,
      tag,
      status,
      manufacturerName,
    } = req.body;

    try {
      const files = req.files;

      let orgUserId = req.user._id;
      let orgName = req.user.name;

      if (req.user.userType === "manager") {
        const org = await Manager.findOne({ userId: req.user._id })
          .populate({
            path: "orgUserId",
            select: "userType name phone email loginID",
          })
          .select("orgUserId");

        orgUserId = org.orgUserId._id;
        orgName = org.orgUserId.name;
      }

      let newAsset;
      const productData = await Product.findById(productId)
        .populate({ path: "categoryId", select: "_id categoryName" })
        .select("testFrequency categoryId");

      let nextHpTestDue;

      if (productData.categoryId.categoryName == "Fire Extinguishers") {
        nextHpTestDue = manufacturingDate
          ? new Date(
              new Date(manufacturingDate).getTime() +
                (productData.testFrequency === "One Year"
                  ? 365 * 24 * 60 * 60 * 1000
                  : productData.testFrequency === "Two Years"
                  ? 2 * 365 * 24 * 60 * 60 * 1000
                  : productData.testFrequency === "Three Years"
                  ? 3 * 365 * 24 * 60 * 60 * 1000
                  : productData.testFrequency === "Five Years"
                  ? 5 * 365 * 24 * 60 * 60 * 1000
                  : productData.testFrequency === "Ten Years"
                  ? 10 * 365 * 24 * 60 * 60 * 1000
                  : 0)
            ).toISOString()
          : null;
      }

      const client = await Client.findOne({
        userId: orgUserId,
        "categories.categoryId": productData.categoryId._id,
      }).lean();

      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      const orgNameSlice = orgName.toString().slice(0, 2).toUpperCase();

      const categoryName = productData.categoryId.categoryName.toString();

      let categoryNameSlice = "";
      if (categoryName.startsWith("Fire")) {
        const words = categoryName.split(" ");
        if (words.length > 1) {
          categoryNameSlice = words[1].slice(0, 3).toUpperCase();
        } else {
          categoryNameSlice = categoryName.slice(0, 3).toUpperCase();
        }
      } else {
        categoryNameSlice = categoryName.slice(0, 3).toUpperCase();
      }

      //search for the technician
      const technicians = await Technician.find({
        plantId,
        categoryId: productCategoryId,
      }).select("userId");
      const totalAssets = await Asset.countDocuments({ orgUserId });
      newAsset = new Asset({
        assetId: `${orgNameSlice}-${categoryNameSlice}-${(totalAssets + 1)
          .toString()
          .padStart(4, "0")}`,
        orgUserId,
        technicianUserId: technicians.map((t) => t.userId),
        plantId,
        building,
        productCategoryId,
        productId,
        type,
        subType,
        location,
        capacity,
        capacityUnit,
        model,
        slNo,
        pressureRating,
        pressureUnit,
        moc,
        approval,
        fireClass,
        manufacturingDate,
        installDate,
        suctionSize,
        head,
        rpm,
        mocOfImpeller,
        fuelCapacity,
        flowInLpm,
        housePower,
        healthStatus,
        tag,
        status,
        manufacturerName,
        ...(productData.categoryId.categoryName == "Fire Extinguishers" && {
          refilledOn: manufacturingDate,
          hpTestOn: manufacturingDate,
          nextHpTestDue,
        }),
      });

      const document1 =
        files.find((file) => file.fieldname === "document1") || null;
      const document2 =
        files.find((file) => file.fieldname === "document2") || null;

      if (document1) {
        const document1Upload = await uploadOnCloudinary(document1.path);
        newAsset.document1 = document1Upload.url;
      }
      if (document2) {
        const document2Upload = await uploadOnCloudinary(document2.path);
        newAsset.document2 = document2Upload.url;
      }

      await newAsset.save();

      const category = client.categories.find(
        (cat) =>
          cat.categoryId.toString() === productData.categoryId._id.toString()
      );
      const { startDate, endDate } = category.serviceDetails || {};
      if (
        startDate &&
        endDate &&
        String(startDate).trim() !== "" &&
        String(endDate).trim() !== ""
      ) {
        const startDate = category.serviceDetails.startDate;
        const endDate = category.serviceDetails.endDate;
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
        await createTickets(
          newAsset,
          "Inspection",
          category.serviceDetails.serviceFrequency.inspection
        );
        await createTickets(
          newAsset,
          "Testing",
          category.serviceDetails.serviceFrequency.testing
        );
        await createTickets(
          newAsset,
          "Maintenance",
          category.serviceDetails.serviceFrequency.maintenance
        );
      }
      const populatedAsset = await Asset.findById(newAsset._id)
        .lean()
        .populate("productId")
        .populate("plantId");

      const qrUrl = await generateQRCode(
        populatedAsset._id,
        populatedAsset.plantId.plantName,
        populatedAsset.building
      );
      const qrCodeBuffer = Buffer.from(qrUrl.split(",")[1], "base64");
      const qrCodeFilePath = path.join(
        "public/asset-qr",
        `${populatedAsset._id}.png`
      );
      fs.writeFileSync(qrCodeFilePath, qrCodeBuffer);
      const uploadResponse = await uploadOnCloudinary(qrCodeFilePath);
      if (!uploadResponse) {
        throw new Error("Failed to upload QR code to Cloudinary");
      }

      const updatedAsset = await Asset.findByIdAndUpdate(
        populatedAsset._id,
        { qrCodeUrl: uploadResponse.secure_url },
        { new: true }
      ).lean();
      return res.json({ asset: updatedAsset });
    } catch (error) {
      return next(error);
    }
  },
  async edit(req, res, next) {
    const editAssetSchema = Joi.object({
      _id: Joi.string().pattern(mongodbIdPattern).required(),
      plantId: Joi.string().pattern(mongodbIdPattern).required(),
      building: Joi.string().required(),
      productCategoryId: Joi.string().pattern(mongodbIdPattern).required(),
      productId: Joi.string().pattern(mongodbIdPattern).required(),
      type: Joi.string().required(),
      subType: Joi.string().optional(),
      location: Joi.string().required(),
      capacity: Joi.number().required(),
      capacityUnit: Joi.string().optional(),
      model: Joi.string().allow("").optional(),
      slNo: Joi.string().allow("").optional(),
      pressureRating: Joi.string().allow("").optional(),
      pressureUnit: Joi.string()
        .valid("Kg/Cm2", "PSI", "MWC", "Bar")
        .allow("")
        .optional(),
      moc: Joi.string().allow("").optional(),
      approval: Joi.string().allow("").optional(),
      fireClass: Joi.string().optional().allow(""),
      manufacturingDate: Joi.date().iso().required(),
      installDate: Joi.date().iso().required(),
      suctionSize: Joi.string().optional().allow(""),
      head: Joi.string().optional().allow(""),
      rpm: Joi.string().optional().allow(""),
      mocOfImpeller: Joi.string().optional().allow(""),
      fuelCapacity: Joi.string().optional().allow(""),
      flowInLpm: Joi.string().optional().allow(""),
      housePower: Joi.string().optional().allow(""),
      healthStatus: Joi.string()
        .valid("NotWorking", "AttentionRequired", "Healthy")
        .default("Healthy"),
      tag: Joi.string().allow("").optional(),
      status: Joi.string()
        .valid("Warranty", "AMC", "In-House", "Deactive")
        .required(),
      manufacturerName: Joi.string().allow("").optional(),
    });

    const { error } = editAssetSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const {
      _id,
      plantId,
      building,
      productCategoryId,
      productId,
      type,
      subType,
      location,
      capacity,
      capacityUnit,
      model,
      slNo,
      pressureRating,
      pressureUnit,
      moc,
      approval,
      fireClass,
      manufacturingDate,
      installDate,
      suctionSize,
      head,
      rpm,
      mocOfImpeller,
      fuelCapacity,
      flowInLpm,
      housePower,
      healthStatus,
      tag,
      status,
      manufacturerName,
    } = req.body;

    try {
      let orgUserId = req.user._id;

      if (req.user.userType === "manager") {
        const org = await Manager.findOne({ userId: req.user._id })
          .populate({
            path: "orgUserId",
            select: "userType name phone email loginID",
          })
          .select("orgUserId");
        orgUserId = org.orgUserId._id;
      }

      const client = await Client.findOne({
        userId: orgUserId,
        "categories.categoryId": productCategoryId,
      }).lean();

      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      const assetBeforeUpdate = await Asset.findById(_id).select(
        "status groupId"
      );
      if (assetBeforeUpdate.status !== status && status == "Deactive") {
        await ServiceTickets.deleteMany({
          individualService: true,
          assetsId: _id,
          categoryId: productCategoryId,
          completedStatus: "Pending",
        });
      }

      const files = req.files;
      //search for the technician
      const technicians = await Technician.find({
        plantId,
        categoryId: productCategoryId,
      }).select("userId");
      const updatedFields = {
        plantId,
        building,
        productId,
        type,
        subType,
        location,
        technicianUserId: technicians.map((t) => t.userId),
        capacity,
        capacityUnit,
        model,
        slNo,
        pressureRating,
        pressureUnit,
        moc,
        approval,
        fireClass,
        manufacturingDate,
        installDate,
        suctionSize,
        head,
        rpm,
        mocOfImpeller,
        fuelCapacity,
        flowInLpm,
        housePower,
        healthStatus,
        tag,
        status,
        manufacturerName,
      };

      if (files) {
        const document1 =
          files.find((file) => file.fieldname === "document1") || null;
        const document2 =
          files.find((file) => file.fieldname === "document2") || null;

        if (document1) {
          const document1Upload = await uploadOnClodinary(document1.path);
          updatedFields.document1 = document1Upload.url;
        }
        if (document2) {
          const document2Upload = await uploadOnClodinary(document2.path);
          updatedFields.document2 = document2Upload.url;
        }
      }

      const updatedAsset = await Asset.findOneAndUpdate(
        { _id },
        updatedFields,
        { new: true }
      ).populate([{ path: "plantId", select: "plantName" }]);

      if (!updatedAsset) {
        return res.status(404).json({ message: "Asset not found" });
      }
      if (
        assetBeforeUpdate.status == "Deactive" &&
        status !== "Deactive" &&
        !assetBeforeUpdate.groupId
      ) {
        const category = client.categories.find(
          (cat) => cat.categoryId.toString() === productCategoryId.toString()
        );
        if (
          category.serviceDetails.startDate &&
          category.serviceDetails.endDate
        ) {
          const startDate = category.serviceDetails.startDate;
          const endDate = category.serviceDetails.endDate;
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
          const serviceStart =
            parsedStartDate > today ? parsedStartDate : today;

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
          await createTickets(
            updatedAsset,
            "Inspection",
            category.serviceDetails.serviceFrequency.inspection
          );
          await createTickets(
            updatedAsset,
            "Testing",
            category.serviceDetails.serviceFrequency.testing
          );
          await createTickets(
            updatedAsset,
            "Maintenance",
            category.serviceDetails.serviceFrequency.maintenance
          );
        }
      }

      return res.json({ updatedAsset });
    } catch (error) {
      return next(error);
    }
  },
  async getAll(req, res, next) {
    try {
      let assetQuery = { orgUserId: req.user._id };
      if (req.user.userType === "manager") {
        const org = await Manager.findOne({ userId: req.user._id })
          .populate({
            path: "orgUserId",
            select: "userType name phone email loginID",
          })
          .select("orgUserId");
        const plants = await Plant.find({ managerId: org._id }).select("_id");
        assetQuery = {
          orgUserId: org.orgUserId._id,
          plantId: { $in: plants.map((plant) => plant._id) },
        };
      }
      const assets = await Asset.find(assetQuery)
        .sort({ createdAt: -1 })
        .populate("plantId")
        .populate([
          {
            path: "productId",
            populate: { path: "categoryId", select: "categoryName" },
          },
          {
            path: "technicianUserId",
            select: "name phone emailstatus",
          },
        ])
        .exec();

      return res.json({ assets });
    } catch (error) {
      return next(error);
    }
  },
  async getAllAssetNamesByCategoryPlantId(req, res, next) {
    const getAllAssetNamesByCategoryPlantId = Joi.object({
      categoryId: Joi.string().pattern(mongodbIdPattern).required(),
      plantId: Joi.string().pattern(mongodbIdPattern).required(),
    });

    const { error } = getAllAssetNamesByCategoryPlantId.validate(req.params);

    if (error) {
      return next(error);
    }

    const { categoryId, plantId } = req.params;

    try {
      let assetQuery = {
        orgUserId: req.user._id,
        plantId,
        status: { $ne: "Deactive" },
      };

      if (req.user.userType === "manager") {
        const org = await Manager.findOne({ userId: req.user._id })
          .populate({
            path: "orgUserId",
            select: "_id",
          })
          .select("orgUserId");

        assetQuery = {
          orgUserId: org.orgUserId._id,
          status: { $ne: "Deactive" },
          plantId,
        };
      }

      const assets = await Asset.find(assetQuery)
        .populate({
          path: "productId",
          match: { categoryId: categoryId },
          select: "productName",
        })
        .populate({ path: "technicianUserId", select: "name" })
        .select("_id productId assetId technicianUserId")
        .exec();
      const filteredAssets = assets.filter((asset) => asset.productId !== null);
      return res.json({ assets: filteredAssets });
    } catch (error) {
      return next(error);
    }
  },
  async getById(req, res, next) {
    const assetId = req.params.id;
    try {
      const asset = await Asset.findById(assetId)
        .populate({
          path: "plantId",
          select: "plantName",
        })
        .populate([
          {
            path: "productId",
            populate: { path: "categoryId", select: "categoryName" },
          },
          {
            path: "oldlatlongs.plantId",
            select: "plantName",
          },
        ])
        .populate("technicianUserId")
        .exec();
      if (!asset) {
        return res.status(404).json({ error: "Asset not found" });
      }
      return res.json({ asset });
    } catch (error) {
      return next(error);
    }
  },
  async getAssetServiceDetails(req, res, next) {
    const assetId = req.params.id;
    if (!assetId) {
      const error = {
        message: "assetId is required",
        status: "400",
      };
      return next(error);
    }
    try {
      const serviceDetails = await ServiceTickets.find({
        assetsId: assetId,
        completedStatus: { $ne: "Pending" },
      })
        .sort({
          createdAt: -1,
        })
        .populate({ path: "serviceDoneBy", select: "name" })
        .select(
          "date serviceDoneBy serviceType serviceFrequency completedStatus"
        );
      const assetDetails = await Asset.findOne({ _id: assetId })
        .populate({
          path: "productId",
          populate: { path: "categoryId", select: "categoryName" },
          select: "categoryId image2 productName",
        })
        .select("healthStatus assetId refilledOn hpTestOn nextHpTestDue");
      const lastInspection = await ServiceTickets.findOne({
        assetsId: assetId,
        completedStatus: "Completed",
        serviceType: "Inspection",
      })
        .sort({ date: -1 })
        .select("date");
      const lastTesting = await ServiceTickets.findOne({
        assetsId: assetId,
        completedStatus: "Completed",
        serviceType: "Testing",
      })
        .sort({ date: -1 })
        .select("date");
      const lastMaintenence = await ServiceTickets.findOne({
        assetsId: assetId,
        completedStatus: "Completed",
        serviceType: "Maintenence",
      })
        .sort({ date: -1 })
        .select("date");
      const nextInspection = await ServiceTickets.findOne({
        assetsId: assetId,
        completedStatus: "Pending",
        serviceType: "Inspection",
      }).select("date");
      const nextTesting = await ServiceTickets.findOne({
        assetsId: assetId,
        completedStatus: "Pending",
        serviceType: "Testing",
      }).select("date");
      const nextMaintenence = await ServiceTickets.findOne({
        assetsId: assetId,
        completedStatus: "Pending",
        serviceType: "Maintenence",
      }).select("date");

      const lastServiceDates = {
        inspection: lastInspection?.date || null,
        testing: lastTesting?.date || null,
        maintenence: lastMaintenence?.date || null,
      };
      const nextServiceDates = {
        inspection: nextInspection?.date || null,
        testing: nextTesting?.date || null,
        maintenence: nextMaintenence?.date || null,
      };

      if (
        assetDetails?.productId?.categoryId?.categoryName ===
        "Fire Extinguishers"
      ) {
        const healthGraphDetails = await FormResponse.find({ assetId })
          .sort({ createdAt: -1 })
          .populate({ path: "questions.questionId", select: "question" })
          .select("questions createdAt")
          .lean();

        const filteredDetails = healthGraphDetails.map((doc) => {
          return {
            createdAt: doc.createdAt,
            questions: [
              doc.questions[0],
              doc.questions[1],
              doc.questions[4],
            ].filter((q) => q !== undefined),
          };
        });
        return res.json({
          serviceDetails,
          assetDetails,
          healthGraph: filteredDetails,
          lastServiceDates,
          nextServiceDates,
        });
      }
      return res.json({
        serviceDetails,
        assetDetails,
        lastServiceDates,
        nextServiceDates,
      });
    } catch (error) {
      return next(error);
    }
  },
  async refillAndHpTestDates(req, res, next) {
    const refillHpTestSchema = Joi.object({
      _id: Joi.string().pattern(mongodbIdPattern).required(),
      refilledOn: Joi.string().required(),
      hpTestOn: Joi.string().required(),
    });

    // Validate request body
    const { error } = refillHpTestSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { _id, refilledOn, hpTestOn } = req.body;

    try {
      // Use await to resolve the Promise
      const assetDataForTestFrequency = await Asset.findById(_id)
        .populate({
          path: "productId",
          select: "testFrequency",
        })
        .select("productId");

      const nextHpTestDue = hpTestOn
        ? new Date(
            new Date(hpTestOn).getTime() +
              (assetDataForTestFrequency.productId.testFrequency === "One Year"
                ? 365 * 24 * 60 * 60 * 1000
                : assetDataForTestFrequency.productId.testFrequency ===
                  "Two Years"
                ? 2 * 365 * 24 * 60 * 60 * 1000
                : assetDataForTestFrequency.productId.testFrequency ===
                  "Three Years"
                ? 3 * 365 * 24 * 60 * 60 * 1000
                : assetDataForTestFrequency.productId.testFrequency ===
                  "Five Years"
                ? 5 * 365 * 24 * 60 * 60 * 1000
                : assetDataForTestFrequency.productId.testFrequency ===
                  "Ten Years"
                ? 10 * 365 * 24 * 60 * 60 * 1000
                : 0)
          )
        : null;
      const updated = await Asset.findOneAndUpdate(
        { _id },
        {
          refilledOn,
          hpTestOn,
          nextHpTestDue,
        }
      );

      if (!updated) {
        return res.status(400).json({ message: "Asset not found" });
      }

      return res.json(updated);
    } catch (error) {
      return next(error);
    }
  },
  async assetLatLongRemark(req, res, next) {
    const createAssetRemarkSchema = Joi.object({
      _id: Joi.string().pattern(mongodbIdPattern).required(),
      plantId: Joi.string().pattern(mongodbIdPattern).required(),
      location: Joi.string().required(),
      building: Joi.string().required(),
      latLongRemark: Joi.string().required(),
    });

    const { error } = createAssetRemarkSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { _id, latLongRemark, location, plantId, building } = req.body;
    try {
      const asset = await Asset.findById(_id);

      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }
      asset.oldlatlongs.push({
        lat: asset.lat,
        long: asset.long,
        plantId: plantId,
        building: building,
        location: asset.location,
      });

      asset.lat = "";
      asset.long = "";
      asset.location = location;
      asset.latLongRemark = latLongRemark;
      asset.plantId = plantId;
      asset.building = building;

      const updatedAsset = await asset.save();
      await updatedAsset.populate([
        { path: "plantId", select: "plantName" },
        { path: "technicianUserId", select: "_id deviceToken" },
      ]);

      const message = `For Asset ${updatedAsset.assetId}, the manager has requested an update to the location: ${location}, plant: ${updatedAsset.plantId.plantName}, and building: ${building}.`;
      const newNotification = new notification({
        userId: updatedAsset.technicianUserId._id,
        title: "Request to Change Asset Location",
        message,
      });
      await newNotification.save();
      pushNotification.sendNotificationDirectly(
        updatedAsset.technicianUserId.deviceToken,
        {
          title: "Request to Change Asset Location",
          body: message,
        }
      );
      return res.json({ message: "updated successfully", updatedAsset });
    } catch (error) {
      return next(error);
    }
  },
  async uniqueTagNames(req, res, next) {
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
      const uniqueTags = await Asset.aggregate([
        { $match: { orgUserId } },
        { $group: { _id: "$tag" } },
        { $project: { tagName: "$_id", _id: 0 } },
      ]);
      return res.json(uniqueTags);
    } catch (error) {
      return next(error);
    }
  },
  async getFilteredAssetsByMultiCategorySinglePlant(req, res, next) {
    try {
      const schema = Joi.object({
        categoryIds: Joi.array()
          .items(Joi.string().pattern(mongodbIdPattern))
          .optional(),
        plantId: Joi.string().pattern(mongodbIdPattern).required(),
      });

      const { error } = schema.validate(req.body);
      if (error) return next(error);

      const { categoryIds, plantId } = req.body;
      const assetQuery = {
        status: { $ne: "Deactive" },
      };

      if (req.user.userType === "organization") {
        assetQuery.orgUserId = req.user._id;
      } else if (req.user.userType === "manager") {
        const org = await Manager.findOne({ userId: req.user._id })
          .populate({
            path: "orgUserId",
            select: "_id",
          })
          .select("orgUserId");

        if (!org || !org.orgUserId) {
          return res
            .status(404)
            .json({ message: "Manager organization not found" });
        }

        assetQuery.orgUserId = org.orgUserId._id;
      }

      // Apply filters if provided
      if (categoryIds?.length) {
        assetQuery.productCategoryId = { $in: categoryIds };
      }

      assetQuery.plantId = plantId;

      const assets = await Asset.find(assetQuery).select("assetId");

      return res.json({ assets });
    } catch (err) {
      return next(err);
    }
  },
  async getDetailsForAddServices(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "asset id is required" });
      }
      const asset = await Asset.findById(id)
        .populate({ path: "technicianUserId", select: "name" })
        .select("assetId technicianUserId");
      return res.json(asset);
    } catch (error) {
      return next(error);
    }
  },
  
};

module.exports = assetController;
