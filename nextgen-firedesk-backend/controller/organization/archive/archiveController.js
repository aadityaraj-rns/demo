const Joi = require("joi");
const uploadOnCloudinary = require("../../../utils/cloudinary");
const Archive = require("../../../models/organization/archive/Archive");
const Manager = require("../../../models/organization/manager/Manager");

const archiveController = {
  async create(req, res, next) {
    const archiveSchema = Joi.object({
      archiveDescription: Joi.string().allow("").optional(),
      archiveName: Joi.string().required(),
      file: Joi.string().optional(),
    });

    const { error } = archiveSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { archiveDescription, archiveName, file } = req.body;

    const files = req.files;

    if (!files || !files.file || !files.file[0]) {
      return res.status(400).json({ error: "Archive Document is required" });
    }

    const filePath = files.file[0].path;

    try {
      const uploadedFile = await uploadOnCloudinary(filePath);

      let organizationId = req.user._id;

      if (req.user.userType === "manager") {
        const org = await Manager.findOne({ userId: req.user._id })
          .populate({
            path: "orgUserId",
            select: "_id",
          })
          .select("orgUserId");

        organizationId = org.orgUserId._id;
      }

      const newArchive = new Archive({
        organizationId,
        archiveDescription,
        archiveName,
        file: uploadedFile.secure_url,
      });
      await newArchive.save();
      return res.json({ newArchive });
    } catch (error) {
      return next(error);
    }
  },

  async fetchByOrgUserId(req, res, next) {
    try {
      let organizationId = req.user._id;
      if (req.user.userType === "manager") {
        const org = await Manager.findOne({ userId: req.user._id })
          .populate({
            path: "orgUserId",
            select: "_id",
          })
          .select("orgUserId");

        organizationId = org.orgUserId._id;
      }
      const archives = await Archive.find({
        organizationId,
      }).sort({ createdAt: -1 });
      return res.json({ archives });
    } catch (error) {
      return next(error);
    }
  },
  async edit(req, res, next) {
    const archiveSchema = Joi.object({
      _id: Joi.string().required("Archive id is required"),
      archiveDescription: Joi.string().allow("").optional(),
      archiveName: Joi.string().required("Achive Name is required"),
      file: Joi.string().optional(),
    });

    const { error } = archiveSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { archiveDescription, archiveName, _id } = req.body;
    const files = req.files;

    let filePath, uploadedFile;

    if (files && files.file && files.file[0]) {
      filePath = files.file[0].path;

      try {
        uploadedFile = await uploadOnCloudinary(filePath);
      } catch (uploadError) {
        return next(uploadError);
      }
    }

    try {
      const updateData = {
        archiveDescription,
        archiveName,
      };

      if (uploadedFile) {
        updateData.file = uploadedFile.secure_url;
      }

      const updatedArchive = await Archive.findByIdAndUpdate(_id, updateData);

      if (!updatedArchive) {
        return res.status(404).json({ error: "Archive not found" });
      }

      return res.json({ success: true });
    } catch (error) {
      return next(error);
    }
  },
  async delete(req, res, next) {
    const { _id } = req.params;
    if (!_id) {
      return res.status(400).json({ message: "archive id is required" });
    }
    try {
      const deletedArchive = await Archive.findByIdAndDelete(_id);
      if (!deletedArchive) {
        return res.status(404).json({ error: "Archive not found" });
      }
      return res.json({ success: true });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = archiveController;
