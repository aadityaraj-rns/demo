const Joi = require("joi");
const Asset = require("../../../models/organization/asset/Asset");
const FormResponse = require("../../../models/technician/FormResponse/FormResponse");
const uploadCloudinary = require("../../../utils/cloudinary");
const ServiceTickets = require("../../../models/organization/service/ServiceTickets");
const Form = require("../../../models/admin/serviceForms/Form");
const Technician = require("../../../models/organization/technician/Technician");
const Notification = require("../../../models/Notification");
const { default: mongoose } = require("mongoose");

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const technicianServiceController = {
  async getMyDueServiceTickets(req, res, next) {
    const getMyDueServiceTicketsSchema = Joi.object({
      plantId: Joi.string().pattern(mongodbIdPattern).required(),
    });
    const { error } = getMyDueServiceTicketsSchema.validate(req.params);

    if (error) {
      return next(error);
    }

    const { plantId } = req.params;
    const technicianUserId = req.user._id;
    try {
      const assets = await Asset.find({
        technicianUserId,
        plantId,
      }).select("_id");
      const serviceTickets = await ServiceTickets.find({
        assetsId: { $in: assets.map((a) => a._id) },
        completedStatus: "Pending",
      })
        .populate([
          { path: "categoryId", select: "categoryName" },
          { path: "groupServiceId", select: "groupId groupName" },
          {
            path: "assetsId",
            populate: { path: "productId", select: "productName" },
            select: "assetId productId building location type",
          },
        ])
        .select(
          "categoryId assetsId individualService serviceType serviceFrequency date expireDate groupServiceId"
        )
        .sort({ date: 1 });
      return res.json(serviceTickets);
    } catch (error) {
      return next(error);
    }
  },
  async getServiceDetailsByServiceId(req, res, next) {
    const getServiceDetailsByServiceIdSchema = Joi.object({
      serviceTicketId: Joi.string().pattern(mongodbIdPattern).required(),
    });

    const { error } = getServiceDetailsByServiceIdSchema.validate(req.params);

    if (error) {
      return next(error);
    }
    const { serviceTicketId } = req.params;

    try {
      const serviceDetails = await ServiceTickets.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(serviceTicketId) } },
        // Lookup for groupServiceId
        {
          $lookup: {
            from: "groupservices",
            localField: "groupServiceId",
            foreignField: "_id",
            as: "groupService",
          },
        },
        {
          $unwind: { path: "$groupService", preserveNullAndEmptyArrays: true },
        },
        {
          $addFields: {
            groupServiceId: {
              groupId: "$groupService.groupId",
              groupName: "$groupService.groupName",
            },
          },
        },
        { $project: { groupService: 0 } },

        // Lookup for assetsId array
        {
          $lookup: {
            from: "assets", // collection name, usually lowercase plural of model
            localField: "assetsId",
            foreignField: "_id",
            as: "assetsId",
          },
        },
        // Lookup products for each asset
        {
          $lookup: {
            from: "products",
            localField: "assetsId.productId",
            foreignField: "_id",
            as: "products",
          },
        },
        {
          $addFields: {
            assetsId: {
              $map: {
                input: "$assetsId",
                as: "asset",
                in: {
                  _id: "$$asset._id",
                  assetId: "$$asset.assetId",
                  building: "$$asset.building",
                  location: "$$asset.location",
                  productName: {
                    $let: {
                      vars: {
                        matchedProduct: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: "$products",
                                as: "prod",
                                cond: {
                                  $eq: ["$$prod._id", "$$asset.productId"],
                                },
                              },
                            },
                            0,
                          ],
                        },
                      },
                      in: "$$matchedProduct.productName",
                    },
                  },
                  type: "$$asset.type",
                  lat: { $ifNull: ["$$asset.lat", null] },
                  long: { $ifNull: ["$$asset.long", null] },
                },
              },
            },
          },
        },

        // Lookup for categoryId
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
        { $addFields: { categoryId: "$category.categoryName" } },
        { $project: { category: 0 } },

        // Lookup for plantId
        {
          $lookup: {
            from: "plants",
            localField: "plantId",
            foreignField: "_id",
            as: "plant",
          },
        },
        { $unwind: { path: "$plant", preserveNullAndEmptyArrays: true } },
        { $addFields: { plantId: "$plant.plantName" } },
        { $project: { plant: 0 } },
      ]);

      return res.json(serviceDetails[0]); // since you're matching by _id
    } catch (error) {
      return next(error);
    }
  },

  async getServiceForm(req, res, next) {
    const getServiceFormSchema = Joi.object({
      serviceTicketId: Joi.string().pattern(mongodbIdPattern).required(),
    });

    const { error } = getServiceFormSchema.validate(req.params);

    if (error) {
      return next(error);
    }

    const { serviceTicketId } = req.params;

    try {
      const serviceTicketInfo = await ServiceTickets.findOne({
        _id: serviceTicketId,
        completedStatus: { $in: ["Pending", "Rejected"] },
      })
        .populate([
          { path: "categoryId", select: "formId" },
          { path: "groupServiceId", select: "formId" },
        ])
        .select(
          "categoryId individualService serviceType serviceFrequency groupServiceId completedStatus"
        );
      if (!serviceTicketInfo) {
        return res
          .status(403)
          .json({ message: "This service ticket is not in due" });
      }

      if (serviceTicketInfo?.individualService) {
        const form = await Form.findById(
          serviceTicketInfo?.categoryId.formId
        ).populate({
          path: "sectionName.questions",
        });
        return res.json({
          form: form.sectionName.find(
            (section) =>
              (section?.testFrequency == "" ||
                section?.testFrequency.toLowerCase() ==
                  serviceTicketInfo?.serviceFrequency.toLowerCase()) &&
              section?.serviceType?.trim()?.toLowerCase() ==
                serviceTicketInfo?.serviceType?.trim()?.toLowerCase()
          ),
          serviceTicketId: serviceTicketInfo?._id,
        });
      } else {
        const form = await Form.findById(
          serviceTicketInfo?.groupServiceId.formId
        ).populate({
          path: "sectionName.questions",
        });
        return res.json({
          form: form.sectionName.find(
            (section) =>
              (section?.testFrequency == "" ||
                section?.testFrequency.toLowerCase() ==
                  serviceTicketInfo?.serviceFrequency.toLowerCase()) &&
              section?.serviceType?.trim()?.toLowerCase() ==
                serviceTicketInfo?.serviceType?.trim()?.toLowerCase()
          ),
          serviceTicketId: serviceTicketInfo?._id,
        });
      }
    } catch (error) {
      return next(error);
    }
  },

  async submitServiceForm(req, res, next) {
    const questionsSchema = Joi.object({
      question: Joi.string().required(),
      answer: Joi.string().required(),
      note: Joi.string().allow("").optional(),
    });

    const pumpDetailsSchema = Joi.object({
      pumpType: Joi.string()
        .valid(
          "ELECTRICAL DRIVEN",
          "DIESEL ENGINE",
          "JOCKEY",
          "BOOSTER",
          "BOOSTER PUMP",
          "TERRACE PUMP",
          "OTHER"
        )
        .required(),
      pumpStatus: Joi.string()
        .valid("AUTO", "MANUAL", "OFF CONDITION")
        .required(),
      pumpSequentialOperationTest: Joi.string()
        .valid("START", "CUTOFF")
        .allow("")
        .optional(),
      suctionPressure: Joi.number().required(),
      pressureSwitchCondition: Joi.string().valid("OPEN", "CLOSE").required(),
      dischargePressureGaugeReading: Joi.number().required(),
      dieselLevel: Joi.string()
        .valid("FULL", "HALF", "NEED RE-FUEL")
        .optional(),
      waterStorageLevel: Joi.string()
        .valid("FULL", "HALF", "NEED RE-FUEL")
        .required(),
      batteryStatusReading: Joi.number().optional(),
    });

    const submitServiceFormSchema = Joi.object({
      serviceTicketId: Joi.string().pattern(mongodbIdPattern).required(),
      serviceFormId: Joi.string().pattern(mongodbIdPattern).optional(),
      sectionName: Joi.string().required(),
      questions: Joi.array().items(questionsSchema).required(),
      pumpDetails: pumpDetailsSchema.optional(),
      geoCheck: Joi.string().required(),
    });

    const { error, value } = submitServiceFormSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { serviceTicketId, serviceFormId, geoCheck, ...formData } = value;
    const technicianUserId = req.user._id;

    try {
      const serviceTicket = await ServiceTickets.findById(serviceTicketId)
        .populate({ path: "assetsId", select: "assetId" })
        .select(
          "_id assetsId serviceType orgUserId serviceFrequency submittedFormId"
        );
      let formResponse;
      if (serviceTicket.submittedFormId) {
        formResponse = await FormResponse.findById(
          serviceTicket.submittedFormId
        );

        if (!formResponse) {
          return res.status(404).json({ message: "Service not found" });
        }

        if (formResponse.status == "Rejected") {
          formResponse.set({
            ...formData,
            serviceTicketId: serviceTicket._id,
            geoCheck,
            statusUpdatedBy: null,
            statusUpdatedAt: null,
            managerRemark: "",
            status: "Waiting for approval",
          });

          await formResponse.save();
        } else {
          return res
            .status(400)
            .json({ message: "Cannot update form in its current state" });
        }
      } else {
        const formCount = await ServiceTickets.countDocuments({
          completedStatus: { $nin: ["Pending", "Lapsed"] },
          assetsId: serviceTicket.assetsId,
        });

        formResponse = new FormResponse({
          ...formData,
          serviceTicketId: serviceTicket._id,
          geoCheck,
          reportNo: `SER-${(formCount + 1).toString().padStart(4, "0")}`,
        });
        await formResponse.save();
      }
      serviceTicket.completedStatus = "Waiting for approval";
      serviceTicket.serviceDoneBy = technicianUserId;
      serviceTicket.submittedFormId = formResponse._id;
      await serviceTicket.save();

      const technician = await Technician.findOne({
        userId: technicianUserId,
      })
        .populate({ path: "userId", select: "name" })
        .select("userId");

      const message = `The ${
        serviceTicket.serviceType
      } service for Asset ID: ${serviceTicket.assetsId.map(
        (a) => a.assetId
      )} has been successfully submitted by technician ${
        technician.userId.name
      }.`;
      const newNotification = new Notification({
        userId: serviceTicket.orgUserId,
        title: `${serviceTicket.serviceFrequency} ${serviceTicket.serviceType} Service Completed.`,
        message,
      });
      await newNotification.save();

      return res.status(200).json({
        message: "Form submitted successfully",
        data: formResponse._id,
      });
    } catch (err) {
      console.error(err);
      return next(err);
    }
  },

  async updateServiceFormImage(req, res, next) {
    const submitServiceFormSchema = Joi.object({
      formResponseId: Joi.string().pattern(mongodbIdPattern).required(),
      remark: Joi.string().optional(),
    });

    const { error, value } = submitServiceFormSchema.validate(req.body);
    const { formResponseId, remark } = value;

    if (error) {
      return next(error);
    }
    const files = req.files;

    if (!files.image1 && !files.image2 && !files.image3) {
      return next(new Error("At least one image is required."));
    }

    const paths = {
      image1Path: files.image1 ? files.image1[0].path : undefined,
      image2Path: files.image2 ? files.image2[0].path : undefined,
      image3Path: files.image3 ? files.image3[0].path : undefined,
    };

    const images1 = paths.image1Path
      ? await uploadCloudinary(paths.image1Path)
      : null;
    const images2 = paths.image2Path
      ? await uploadCloudinary(paths.image2Path)
      : null;
    const images3 = paths.image3Path
      ? await uploadCloudinary(paths.image3Path)
      : null;

    const imagesArray = [
      images1?.secure_url,
      images2?.secure_url,
      images3?.secure_url,
    ];

    try {
      // Update the existing record with the new image paths
      const updatedFormResponse = await FormResponse.findByIdAndUpdate(
        formResponseId,
        { images: imagesArray, technicianRemark: remark }
        // { new: true } // Returns the updated document
      );

      if (!updatedFormResponse) {
        return res.status(404).json({ error: "Form response not found." });
      }

      return res.status(200).json({
        message: "Images updated successfully",
        // data: updatedFormResponse,
      });
    } catch (err) {
      return next(err);
    }
  },

  async getServicesByStatus(req, res, next) {
    const getServiceSchema = Joi.object({
      status: Joi.string()
        .valid("Rejected", "Waiting for approval", "Completed", "Lapsed")
        .required(),
      plantId: Joi.string().pattern(mongodbIdPattern).required(),
    });

    const { error, value } = getServiceSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { plantId, status } = value;
    const technicianUserId = req.user._id;
    try {
      const services = await ServiceTickets.find({
        serviceDoneBy: technicianUserId,
        completedStatus: status,
        plantId,
      })
        .populate([
          { path: "categoryId", select: "categoryName" },
          { path: "groupServiceId", select: "groupId groupName" },
          {
            path: "assetsId",
            populate: { path: "productId", select: "productName" },
            select: "assetId productId building type location",
          },
          {
            path: "submittedFormId",
          },
        ])
        .select(
          "categoryId assetsId individualService serviceType serviceFrequency date expireDate groupServiceId"
        )
        .sort({ updatedAt: -1 });
      return res.status(200).json({ services });
    } catch (error) {
      return next(error);
    }
  },

  // async approvalPendingServiceTickets(req, res, next) {
  //   const approvalPendingServiceTicketsSchema = Joi.object({
  //     plantId: Joi.string().pattern(mongodbIdPattern).required(),
  //   });

  //   const { error } = approvalPendingServiceTicketsSchema.validate(req.params);

  //   if (error) {
  //     return next(error);
  //   }

  //   const { plantId } = req.params;
  //   const technicianUserId = req.user._id;

  //   try {
  //     const pendingForms = await FormResponse.find({
  //       technicianUserId,
  //       plantId,
  //       status: "Pending",
  //     })
  //       .populate("plantId")
  //       .populate("technicianUserId");

  //     return res.json(pendingForms);
  //   } catch (error) {
  //     return next(error);
  //   }
  // },

  // async approvalRejectedServiceTickets(req, res, next) {
  //   const approvalRejectedServiceTicketsSchema = Joi.object({
  //     plantId: Joi.string().pattern(mongodbIdPattern).required(),
  //   });

  //   const { error } = approvalRejectedServiceTicketsSchema.validate(req.params);

  //   if (error) {
  //     return next(error);
  //   }

  //   const { plantId } = req.params;
  //   const technicianUserId = req.user._id;

  //   try {
  //     const rejectedForms = await FormResponse.find({
  //       technicianUserId,
  //       plantId,
  //       status: "Rejected",
  //     })
  //       .populate("plantId")
  //       .populate("technicianUserId")
  //       .select("-rejectedLogs");

  //     return res.json(rejectedForms);
  //   } catch (error) {
  //     return next(error);
  //   }
  // },

  // async approvalApprovedServiceTickets(req, res, next) {
  //   const approvalApprovedServiceTicketsSchema = Joi.object({
  //     plantId: Joi.string().pattern(mongodbIdPattern).required(),
  //   });

  //   const { error } = approvalApprovedServiceTicketsSchema.validate(req.params);

  //   if (error) {
  //     return next(error);
  //   }

  //   const { plantId } = req.params;
  //   const technicianUserId = req.user._id;

  //   try {
  //     const approvedForms = await FormResponse.find({
  //       technicianUserId,
  //       plantId,
  //       status: "Approved",
  //     })
  //       .populate("plantId")
  //       .populate("technicianUserId");

  //     return res.json(approvedForms);
  //   } catch (error) {
  //     return next(error);
  //   }
  // },

  async myServiceForm(req, res, next) {
    const { _id } = req.params;
    if (!_id) {
      return res.json({ message: "service id is required" });
    }
    try {
      const myServiceForm = await FormResponse.findOne({
        _id,
      })
        .populate({
          path: "serviceTicketId",
          populat: [
            { path: "assetsId", select: "assetId" },
            { path: "plantId", select: "plantName" },
          ],
          select: "serviceType serviceFrequency plantId assetsId",
        })
        .select("-rejectedLogs");
      if (!myServiceForm) {
        return res.status(404).json({ message: "Serive Form not Found" });
      }
      return res.json(myServiceForm);
    } catch (error) {
      return next(error);
    }
  },
};

// function calculateNextServiceDate(
//   testFrequency,
//   actualNextServiceDate,
//   serviceEndDate
// ) {
//   // Map the frequency to the number of days to add
//   const frequencyDays = {
//     Weekly: 7,
//     Fortnight: 14,
//     Monthly: 30,
//     Quarterly: 90,
//     "Half Year": 182,
//     Yearly: 365,
//   };

//   // Ensure the testFrequency exists in the frequencyDays map
//   if (!frequencyDays[testFrequency]) {
//     throw new Error("Invalid test frequency");
//   }

//   // Parse the dates
//   const frequency = frequencyDays[testFrequency];

//   const startDate = new Date(actualNextServiceDate);
//   const endDate = new Date(serviceEndDate);
//   const today = new Date();

//   let calculatedDates = [];
//   let currentDate = new Date(startDate);

//   // Generate the dates
//   while (currentDate <= endDate) {
//     calculatedDates.push(new Date(currentDate)); // Add a copy of the date
//     currentDate.setDate(currentDate.getDate() + frequency); // Increment by frequency
//   }

//   // Find the first date greater than today
//   const nextServiceDate = calculatedDates.find((date) => date > today);

//   // return {
//   //   nextServiceCalculatDates: calculatedDates,
//   //   nextServiceDates: nextServiceDate || null,
//   // };
//   return nextServiceDate || null;
// }

module.exports = technicianServiceController;
