// utils/uploadImageAndGetUrl.ts
import { uploadFileInCloudinary } from "../../api/admin/internal";

/**
 * Validate the File, upload it to /upload-file, and return Cloudinary’s secure_url.
 * Throws on error so callers can decide what to do (show toast, etc.).
 */
export const uploadImageAndGetUrl = async (file) => {
  if (!file) throw new Error("No file selected");

  // 2 MB, jpeg/png/jpg – tweak if you like
  if (file.size > 2 * 1024 * 1024) {
    throw new Error("File too large (max 2 MB)");
  }
  if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
    throw new Error("Unsupported format");
  }

  const fd = new FormData();
  fd.append("file", file);

  /* Your /upload-file route returns:
     { url: secure_url, public_id, … } */
  const { data } = await uploadFileInCloudinary(fd);

  if (!data?.url) throw new Error("Upload failed");
  return data.url; // secure_url
};
