const uploadOnCloudinary = require("../utils/cloudinary");

const MAX_FILE_SIZE_MB = 1; // 2MB
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const fileUpload = {
  async upload(req, res, next) {
    try {
      if (!req.files || !req.files.file || !req.files.file.length) {
        return next(new Error("No file provided"));
      }

      const file = req.files.file[0];

      // ✅ File size validation
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return res.status(400).json({
          error: `File size should be less than ${MAX_FILE_SIZE_MB}MB.`,
        });
      }

      const localFilePath = file.path;

      const uploaded = await uploadOnCloudinary(localFilePath);

      if (!uploaded) {
        return next(new Error("File upload failed"));
      }

      return res.json({
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
        format: uploaded.format,
        bytes: uploaded.bytes,
      });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = fileUpload;
