const Joi = require("joi");
const Technician = require("../../../models/organization/technician/Technician");
const User = require("../../../models/user");
const uploadOnCloudinary = require("../../../utils/cloudinary");

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const technicianProfile = {
  async myProfile(req, res, next) {
    const myProfileSchema = Joi.object({
      technicianUserId: Joi.string().pattern(mongodbIdPattern).required(),
    });

    const { error } = myProfileSchema.validate(req.params);

    if (error) {
      return next(error);
    }

    const { technicianUserId } = req.params;

    try {
      const technician = await Technician.findOne({
        userId: technicianUserId,
      }).populate({ path: "userId", select: "_id name phone email profile" });

      return res.json({ technician });
    } catch (error) {
      return next(error);
    }
  },
  async editProfile(req, res, next) {
    const technicianSchema = Joi.object({
      name: Joi.string().required(),
      phone: Joi.string()
        .pattern(/^\d{10}$/)
        .required()
        .messages({
          "string.pattern.base": "Contact number should be 10 digits",
        }),
      email: Joi.string()
        .email()
        .required()
        .messages({ "string.email": "Please enter a valid email address" }),
      technicianUserId: Joi.string().pattern(mongodbIdPattern).required(),
    });
    const { error, value } = technicianSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const { name, phone, email, technicianUserId } = value;
    const userId = technicianUserId;
    const technician = await User.findById(userId);
    
    if (!technician) {
      return next("technician not found.");
    }
    
    const files = req.files || {};
    try {
      const paths = {
        profilePath: files.profile ? files.profile[0].path : undefined,
      };

      let profileUrl;
      if (paths.profilePath) {
        const uploadResult = await uploadOnCloudinary(paths.profilePath);
        profileUrl = uploadResult?.secure_url;
      }
      const updateData = {
        name,
        phone,
        email,
        ...(profileUrl && { profile: profileUrl }), // Only add profile if the image was uploaded
      };
      const updatedTechnician = await User.findByIdAndUpdate(
        userId,
        updateData,
        {
          new: true,
        }
      );
      res.status(200).json({
        message: "Profile updated successfully.",
        technician: updatedTechnician,
      });
    } catch (error) {
      return next(new Error("Failed to update profile."));
    }
  },
};

module.exports = technicianProfile;
