const xlsx = require("xlsx");
const Joi = require("joi");
const fs = require("fs");
const path = require("path");
const Client = require("../../../models/admin/client/Client");
const Asset = require("../../../models/organization/asset/Asset");
// const {
//   calculateNexsxtServiceDate,
// } = require("../../../services/calculateNextServiceDate");
const { generateQRCode } = require("../../../services/QrCodeService");
const uploadOnCloudinary = require("../../../utils/cloudinary");
const Manager = require("../../../models/organization/manager/Manager");
const product = require("../../../models/admin/product");
const Technician = require("../../../models/organization/technician/Technician");
const ServiceTickets = require("../../../models/organization/service/ServiceTickets");

const mongodbIdPattern = /^[a-f\d]{24}$/i;

const bulkUpload = {
  async upload(req, res, next) {
    const createAssetSchema = Joi.object({
      plantId: Joi.string().pattern(mongodbIdPattern).required(),
      building: Joi.string().required(),
      productCategoryId: Joi.string().pattern(mongodbIdPattern).required(),
      productId: Joi.string().pattern(mongodbIdPattern).required(),
      type: Joi.string().required(),
      subType: Joi.string().optional(),
      location: Joi.string().required(),
      capacity: Joi.number().required(),
      model: Joi.string().allow("").optional(),
      partNo: Joi.string().allow("").optional(),
      pressureRating: Joi.number().allow("").optional(),
      "pressureUnit(Kg/Cm2, PSI, MWC, Bar)": Joi.string()
        .valid("Kg/Cm2", "PSI", "MWC", "Bar")
        .allow("")
        .optional(),
      moc: Joi.string().allow("").optional(),
      approval: Joi.string().allow("").optional(),
      "fireClass(Only for Fire Extinguishers)": Joi.string()
        .optional()
        .allow(""),
      manufacturingDate: Joi.date().iso().required(),
      installDate: Joi.date().iso().required(),
      tag: Joi.string().optional().allow(""),
      "status(Warranty, AMC, Deactive)": Joi.string()
        .valid("Warranty", "AMC", "Deactive")
        .required(),
      manufacturerName: Joi.string().allow("").optional(),
      condition: Joi.string()
        .valid(
          "Ticket Due",
          "Service Due",
          "Refilling Required",
          "Due for HP Test",
          "Low Pressure",
          "Obstruction",
          "Displaced",
          "Damaged",
          "Under Weight",
          "Spare Required",
          "Tampered",
          "AMC Due",
          "Nearing End of Life",
          "Out-Of Warranty",
          "GEO Location : Outside",
          "GEO Location : Inside",
          ""
        )
        .optional(),
    });

    try {
      const workbook = xlsx.readFile(req.file.path);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const assetsData = xlsx.utils.sheet_to_json(worksheet);

      const results = [];
      const errors = [];
      function parseExcelDate(excelDate) {
        const excelEpoch = new Date(1899, 11, 30);
        const daysOffset = excelDate - 1;
        return new Date(
          excelEpoch.getTime() + daysOffset * 24 * 60 * 60 * 1000
        );
      }
      for (const [index, assetData] of assetsData.entries()) {
        Object.keys(assetData).forEach((key) => {
          if (key.startsWith("__EMPTY")) {
            delete assetData[key];
          }
        });

        assetData.plantId = req.body.plantId;
        assetData.productCategoryId = req.body.productCategoryId;
        assetData.productId = req.body.productId;

        if (typeof assetData.manufacturingDate === "number") {
          assetData.manufacturingDate = parseExcelDate(
            assetData.manufacturingDate
          );
        }
        if (typeof assetData.installDate === "number") {
          assetData.installDate = parseExcelDate(assetData.installDate);
        }
        if (typeof assetData.tag === "number") {
          assetData.tag = assetData.tag.toString();
        }
        if (typeof assetData.model === "number") {
          assetData.model = assetData.model.toString();
        }

        const { error } = createAssetSchema.validate(assetData);
        if (error) {
          errors.push({ line: index + 2, error: error.details });
          continue;
        }

        const {
          plantId,
          building,
          productCategoryId,
          productId,
          location,
          capacity,
          model,
          pressureRating,
          moc,
          approval,
          manufacturingDate,
          installDate,
          tag,
          manufacturerName,
          type,
          subType,
          condition,
        } = assetData;

        const slNo = assetData["partNo"];
        const fireClass = assetData["fireClass(Only for Fire Extinguishers)"];
        const status = assetData["status(Warranty, AMC, Deactive)"];
        const pressureUnit = assetData["pressureUnit(Kg/Cm2, PSI, MWC, Bar)"];

        const notWorkingConditions = [
          "Refilling Required",
          "Low Pressure",
          "Damaged",
          "Spare Required",
        ];

        const attentionRequiredConditions = [
          "Ticket Due",
          "Service Due",
          "Due for HP Test",
          "Obstruction",
          "Displaced",
          "Under Weight",
          "Tampered",
          "AMC Due",
          "Nearing End of Life",
          "Out-Of Warranty",
          "GEO Location : Outside",
          "GEO Location : Inside",
        ];

        const healthStatus =
          condition === "" || condition === undefined
            ? "Healthy"
            : notWorkingConditions.includes(condition)
            ? "NotWorking"
            : attentionRequiredConditions.includes(condition)
            ? "AttentionRequired"
            : "Healthy";

        try {
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

          const client = await Client.findOne({
            userId: orgUserId,
            "categories.categoryId": productCategoryId,
          }).lean();
          if (!client) {
            errors.push({ line: index + 2, error: "Client not found" });
            continue;
          }

          const productData = await product
            .findById(productId)
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

          const totalAssets = await Asset.countDocuments({ orgUserId });

          //search for the technician
          const technicians = await Technician.find({
            plantId,
            categoryId: productCategoryId,
          }).select("userId");
          const newAsset = new Asset({
            assetId: `${orgNameSlice}-${categoryNameSlice}-${(totalAssets + 1)
              .toString()
              .padStart(4, "0")}`,
            orgUserId,
            plantId,
            building,
            productCategoryId,
            productId,
            location,
            capacity,
            technicianUserId: technicians.map((t) => t.userId),
            model,
            slNo,
            pressureRating,
            pressureUnit,
            moc,
            approval,
            fireClass,
            manufacturingDate,
            installDate,
            tag,
            status,
            manufacturerName,
            type,
            subType,
            condition,
            healthStatus,
            ...(productData.categoryId.categoryName ===
              "Fire Extinguishers" && {
              refilledOn: manufacturingDate,
              hpTestOn: manufacturingDate,
              nextHpTestDue,
            }),
          });

          await newAsset.save();

          const category = client.categories.find(
            (cat) => cat.categoryId.toString() === productCategoryId.toString()
          );

          if (!category || !category.serviceDetails) {
            errors.push({
              line: index + 2,
              error: "Service details not found for this category",
            });
            continue;
          }

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
            .populate("plantId")
            .populate({
              path: "technicianUserId",
              match: { _id: { $ne: null } },
            });
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
          results.push({ asset: updatedAsset });
        } catch (error) {
          errors.push({ line: index + 2, error: error.message });
        }
      }

      await fs.promises.unlink(req.file.path);

      return res.json({
        success: results.length > 0,
        createdAssets: results,
        errors,
      });
    } catch (error) {
      next(error);
    }
  },
  async bulkAssetServiceUpload(req, res, next) {
    const createAssetSchema = Joi.object({
      assetId: Joi.string().pattern(mongodbIdPattern).required(),
      date: Joi.date().required(),
      status: Joi.string().valid("Completed", "Rejected").required(),
      technician: Joi.string().pattern(mongodbIdPattern).required(),
      technicianRemark: Joi.string().required(),
      managerRemark: Joi.string().required(),
      serviceType: Joi.string()
        .valid("Inspection", "Testing", "Maintenance")
        .required(),
      serviceFrequency: Joi.string()
        .valid("Weekly", "Monthly", "Quarterly", "Half Year", "Yearly")
        .required(),
    });

    try {
      const { assetId, technician } = req.body;

      // ✅ Validate assetId and technician from req.body first
      const headerSchema = Joi.object({
        assetId: Joi.string().pattern(mongodbIdPattern).required(),
        technician: Joi.string().pattern(mongodbIdPattern).required(),
      });

      const { error: headerError } = headerSchema.validate({
        assetId,
        technician,
      });
      if (headerError) {
        return res.status(400).json({
          msg: "Invalid assetId or technician",
          errors: headerError.details.map((e) => e.message),
        });
      }

      if (!req.file) {
        return res.status(400).json({ msg: "No file uploaded" });
      }

      // 📘 Read the uploaded Excel file
      const workbook = xlsx.readFile(req.file.path, { cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      const validRows = [];
      const invalidRows = [];

      for (let [index, row] of sheetData.entries()) {
        const fullRow = {
          ...row,
          assetId, // from req.body
          technician, // from req.body
        };

        const { error, value } = createAssetSchema.validate(fullRow, {
          abortEarly: false,
          convert: true,
        });

        if (error) {
          invalidRows.push({
            row: index + 2,
            errors: error.details.map((e) => e.message),
          });
        } else {
          validRows.push(value);
        }
      }
      // Fetch asset details once
      const asset = await Asset.findById(assetId).select("plantId orgUserId");
      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }

      // Append required fields to each valid row
      const transformedRows = validRows.map((row) => ({
        ...row,
        serviceDoneBy: row.technician,
        completedStatus: row.status,
        assetsId: row.assetId,
        plantId: asset.plantId,
        orgUserId: asset.orgUserId,
        expireDate: row.date,
      }));

      // Insert only if no invalid rows
      if (invalidRows.length === 0 && transformedRows.length > 0) {
        await ServiceTickets.insertMany(transformedRows);
      }

      return res.json({
        success: true,
        total: sheetData.length,
        validCount: validRows.length,
        invalidCount: invalidRows.length,
        invalidRows,
      });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = bulkUpload;
