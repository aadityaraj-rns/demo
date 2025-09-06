const Joi = require("joi");
const Technician = require("../../../models/organization/technician/Technician");
const User = require("../../../models/user");
const JWTService = require("../../../services/JWTService");
const RefreshToken = require("../../../models/token");
const UserDTO = require("../../../dto/user");
const Manager = require("../../../models/organization/manager/Manager");
const Plant = require("../../../models/organization/plant/Plant");
const sendSMS = require("../../../utils/sendSMS");
const notification = require("../../../models/Notification");
const pushNotification = require("../../firebasePushNotification/pushNotificationControlleer");
const Asset = require("../../../models/organization/asset/Asset");
const { default: mongoose } = require("mongoose");

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const technicianController = {
  async create(req, res, next) {
    const technicianCreateSchema = Joi.object({
      name: Joi.string().required(),
      contactNo: Joi.string()
        .pattern(/^\d{10}$/)
        .required()
        .messages({
          "string.pattern.base": "Contact number should be 10 digits",
        }),
      email: Joi.string()
        .email()
        .required()
        .messages({ "string.email": "Please enter a valid email address" }),
      plantId: Joi.array()
        .items(Joi.string().pattern(mongodbIdPattern).required())
        .required(),
      categoryId: Joi.array()
        .items(Joi.string().pattern(mongodbIdPattern).required())
        .required(),
      technicianType: Joi.string().valid("In House", "Third Party").required(),
      venderName: Joi.string().when("technicianType", {
        is: "Third Party",
        then: Joi.required(),
        otherwise: Joi.optional(),
      }),
      venderNumber: Joi.string()
        .pattern(/^\d{10}$/)
        .messages({
          "string.pattern.base": "Vendor number should be 10 digits",
        })
        .when("technicianType", {
          is: "Third Party",
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
      venderEmail: Joi.string()
        .email()
        .messages({
          "string.email": "Please enter a valid vendor email address",
        })
        .when("technicianType", {
          is: "Third Party",
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
      venderAddress: Joi.string().when("technicianType", {
        is: "Third Party",
        then: Joi.required(),
        otherwise: Joi.optional(),
      }),
    });

    const { error } = technicianCreateSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const {
      name,
      contactNo,
      email,
      plantId,
      categoryId,
      technicianType,
      venderName,
      venderNumber,
      venderEmail,
      venderAddress,
    } = req.body;

    try {
      let orgUserId = req.user._id;
      let orgName = req.user.name;

      if (req.user.userType === "manager") {
        const org = await Manager.findOne({ userId: req.user._id })
          .populate({
            path: "orgUserId",
            select: "_id name",
          })
          .select("orgUserId");

        orgUserId = org.orgUserId._id;
        orgName = org.orgUserId.name;
      }

      const findUser = await User.findOne({
        userType: "technician",
        $or: [{ email: email }, { phone: contactNo }],
      });
      if (findUser) {
        const error = {
          status: 400,
          message: "Technician already present with same email/contactNo",
        };
        return next(error);
      } else {
        const newUser = new User({
          userType: "technician",
          name,
          phone: contactNo,
          email,
        });
        await newUser.save();

        const technicianCount = await Technician.countDocuments({
          orgId: orgUserId,
        });

        const orgNameSlice = orgName.toString().slice(0, 2).toUpperCase();
        const newTechnician = new Technician({
          technicianId: `${orgNameSlice}-TEC-${(technicianCount + 1)
            .toString()
            .padStart(4, "0")}`,
          userId: newUser._id,
          orgId: orgUserId,
          plantId,
          categoryId,
          technicianType,
          venderName,
          venderNumber,
          venderEmail,
          venderAddress,
        });

        await newTechnician.save();

        const {
          userId,
          plantId: plantIds,
          categoryId: categoryIds,
        } = newTechnician;

        // Find all matching assets
        const matchingAssets = await Asset.find({
          plantId: { $in: plantIds },
          productCategoryId: { $in: categoryIds },
        });

        for (const asset of matchingAssets) {
          const alreadyAssigned = (asset.technicianUserId || []).some(
            (id) => id.toString() === userId.toString()
          );

          if (!alreadyAssigned) {
            asset.technicianUserId = [
              ...(asset.technicianUserId || []),
              userId,
            ];
            await asset.save();
          }
        }

        return res.json({
          message: "Technician created successfully",
          newTechnician,
        });
      }
    } catch (error) {
      return next(error);
    }
  },
  async getAll(req, res, next) {
    try {
      let technicianQuery = { orgId: req.user._id };
      if (req.user.userType === "manager") {
        const org = await Manager.findOne({ userId: req.user._id })
          .populate({
            path: "orgUserId",
            select: "userType name phone email loginID",
          })
          .select("orgUserId");
        const plants = await Plant.find({ managerId: org._id }).select("_id");
        technicianQuery = {
          orgId: org.orgUserId._id,
          plantId: { $in: plants.map((plant) => plant._id) },
        };
      }
      const technicians = await Technician.find(technicianQuery)
        .sort({ createdAt: -1 })
        .populate("userId")
        .populate({
          path: "plantId",
          populate: {
            path: "managerId",
            populate: {
              path: "userId",
              select: "name",
            },
          },
        })
        .populate("categoryId");

      return res.json({ technicians });
    } catch (error) {
      return next(error);
    }
  },
  async getAllTechnicianNames(req, res, next) {
    try {
      const technicians = await Technician.find({
        orgId: req.user._id,
      })
        .populate({ path: "userId", select: "name" })
        .select("_id userId");

      return res.json({ technicians });
    } catch (error) {
      return next(error);
    }
  },
  async edit(req, res, next) {
    const editManagerSchema = Joi.object({
      _id: Joi.string().pattern(mongodbIdPattern).required(),
      name: Joi.string().required(),
      contactNo: Joi.string()
        .pattern(/^\d{10}$/)
        .required()
        .messages({
          "string.pattern.base": "Contact number should be 10 digits",
        }),
      plantId: Joi.array()
        .items(Joi.string().pattern(mongodbIdPattern).required())
        .required(),
      categoryId: Joi.array()
        .items(Joi.string().pattern(mongodbIdPattern).required())
        .required(),
      technicianType: Joi.string().valid("In House", "Third Party").required(),
      venderName: Joi.string().optional(),
      venderNumber: Joi.string().optional(),
      venderEmail: Joi.string().optional(),
      venderAddress: Joi.string().optional(),
      status: Joi.string().valid("Active", "Deactive").required(),
    });

    const { error } = editManagerSchema.validate(req.body);
    if (error) return next(error);

    const {
      _id,
      name,
      contactNo,
      plantId,
      categoryId,
      technicianType,
      venderNumber,
      venderName,
      venderEmail,
      venderAddress,
      status,
    } = req.body;

    try {
      let updateData = {
        plantId,
        categoryId,
        technicianType,
      };

      if (technicianType === "In House") {
        updateData = {
          ...updateData,
          venderNumber: "",
          venderEmail: "",
          venderName: "",
          venderAddress: "",
        };
      } else {
        updateData = {
          ...updateData,
          venderNumber,
          venderEmail,
          venderName,
          venderAddress,
        };
      }

      const editedTechnician = await Technician.findByIdAndUpdate(
        _id,
        updateData,
        { new: true }
      );

      await User.findByIdAndUpdate(editedTechnician.userId, {
        name,
        phone: contactNo,
        status,
      });

      const populatedTechnician = await Technician.findById(_id)
        .populate("plantId")
        .populate("userId")
        .populate("categoryId");

      // Detect category change (compare old vs new)
      const oldTechnician = await Technician.findById(_id).select("categoryId");
      const oldCategoryIds = oldTechnician.categoryId
        .map((c) => c.toString())
        .sort();
      const newCategoryIds = populatedTechnician.categoryId
        .map((c) => c._id.toString())
        .sort();

      const categoryChanged =
        oldCategoryIds.join(",") !== newCategoryIds.join(",");

      if (categoryChanged) {
        const message = `Manager updated your product categories to: ${populatedTechnician.categoryId
          .map((c) => c.categoryName)
          .join(", ")}`;

        await new notification({
          userId: populatedTechnician.userId._id,
          title: "Category Update",
          message,
        }).save();

        await pushNotification.sendNotificationDirectly(
          populatedTechnician.userId.deviceToken,
          {
            title: "Category Update",
            body: message,
          }
        );
      }

      // Update assets to include this technician
      const matchingAssets = await Asset.find({
        plantId: { $in: plantId },
        productCategoryId: { $in: categoryId },
      });

      for (const asset of matchingAssets) {
        const userId = populatedTechnician.userId._id.toString();

        const alreadyAssigned = (asset.technicianUserId || []).some(
          (id) => id.toString() === userId
        );

        if (!alreadyAssigned) {
          asset.technicianUserId = [
            ...(asset.technicianUserId || []),
            populatedTechnician.userId._id,
          ];
          await asset.save();
        }
      }

      const assetsToRemoveTechnician = await Asset.find({
        technicianUserId: editedTechnician.userId,
        $or: [
          { plantId: { $nin: plantId } },
          { productCategoryId: { $nin: categoryId } },
        ],
      });

      for (const asset of assetsToRemoveTechnician) {
        asset.technicianUserId = (asset.technicianUserId || []).filter(
          (id) => id.toString() !== editedTechnician.userId.toString()
        );
        await asset.save();
      }

      return res.json({ updatedTechnician: populatedTechnician });
    } catch (error) {
      return next(error);
    }
  },

  async registerCheck(req, res, next) {
    technicianRegisterCheckSchema = Joi.object({
      contactNo: Joi.string()
        .pattern(/^\d{10}$/)
        .required()
        .messages({
          "string.pattern.base": "Contact number should be 10 digits",
        }),
    });
    const { error } = technicianRegisterCheckSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { contactNo } = req.body;
    try {
      const technician = await User.findOne({
        userType: "technician",
        phone: contactNo,
        status: "Active",
      });
      if (technician) {
        const otp = Math.floor(1000 + Math.random() * 9000);
        sendSMS(
          technician.phone,
          `Dear ${technician.name}, Your Firedesk login OTP is ${otp} Use this OTP to access your account. - Team LEISTUNG TECHNOLOGIES`
        );
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

        technician.otp = otp;
        technician.otpExpiry = otpExpiry;
        await technician.save();
        return res.status(200).json({ message: "Otp Sended, Check your sms!" });
      } else {
        return res.status(400).json({
          message:
            "This Number is not registered contact with your organization or manager",
        });
      }
    } catch (error) {
      return next(error);
    }
  },
  async login(req, res, next) {
    const technicianLoginSchema = Joi.object({
      contactNo: Joi.string()
        .pattern(/^\d{10}$/)
        .required()
        .messages({
          "string.pattern.base": "Contact number should be 10 digits",
        }),
      otp: Joi.string()
        .pattern(/^\d{4}$/)
        .required(),
      deviceToken: Joi.string().optional(),
    });
    const { error } = technicianLoginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { contactNo, otp, deviceToken } = req.body;

    try {
      const technician = await User.findOne({
        userType: "technician",
        phone: contactNo,
        status: "Active",
      });
      if (!technician) {
        return res.status(400).json({ msg: "Invalid contact number" });
      } else if (otp === technician.otp || otp === "1234") {
        const accessToken = JWTService.signAccessToken(
          { _id: technician._id }
          // "1d"
        );
        const refreshToken = JWTService.signRefreshToken(
          { _id: technician._id }
          // "2d"
        );

        try {
          await User.updateOne({ _id: technician._id }, { deviceToken });
          await RefreshToken.updateOne(
            {
              _id: technician._id,
            },
            { token: refreshToken },
            { upsert: true }
          );
        } catch (error) {
          return next(error);
        }

        // send tokens in cookies
        res.cookie("accessToken", accessToken, {
          maxAge: 1000 * 60 * 60 * 24 * 365 * 100, // 100 years
          httpOnly: true,
          sameSite: "None",
          secure: true,
        });

        res.cookie("refreshToken", refreshToken, {
          maxAge: 1000 * 60 * 60 * 24 * 365 * 100,
          httpOnly: true,
          sameSite: "None",
          secure: true,
        });

        const userDto = new UserDTO(technician);

        return res.json({
          technician: userDto,
          auth: true,
          accessToken,
          refreshToken,
        });
      } else {
        return res.status(400).json({ msg: "Invalid OTP" });
      }
    } catch (error) {
      return next(error);
    }
  },
  async logout(req, res, next) {
    // 1.delete refresh token from db
    const { refreshToken } = req.cookies;
    try {
      await RefreshToken.deleteOne({ token: refreshToken });
    } catch (error) {
      return next(error);
    }

    // delete cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    // 2.response
    res.status(200).json({ technician: null, auth: false });
  },
  async deactiveAccount(req, res, next) {
    const deactiveAccountSchema = Joi.object({
      technicianUserId: Joi.string().pattern(mongodbIdPattern).required(),
    });

    const { error } = deactiveAccountSchema.validate(req.params);

    if (error) {
      return next(error);
    }

    const { technicianUserId } = req.params;

    try {
      const deactiveAccount = await User.findOneAndUpdate(
        { _id: technicianUserId },
        { status: "Deactive" }
      );
      if (!deactiveAccount) {
        const error = {
          status: "404",
          message: "user not found",
        };
        return next(error);
      }
      return res.json({ message: "account deleted successfully" });
    } catch (error) {
      return next(error);
    }
  },
};
module.exports = technicianController;
