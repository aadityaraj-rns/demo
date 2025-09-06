import { Box, IconButton, CircularProgress } from "@mui/material";
import { Upload, Delete } from "@mui/icons-material";
import { uploadImageAndGetUrl } from "../../../utils/helpers/uploadImageAndGetUrl";
import { showAlert } from "../showAlert";
import PropTypes from "prop-types";

const ImageUploadBox = ({
  value,
  index,
  uploadingIndex,
  setUploadingIndex,
  onChange,
  error,
  helperText,
}) => {
  const inputId = `upload-image-${index}`;

  return (
    <Box
      mt={1}
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap={2}
      flexDirection="column"
    >
      {uploadingIndex === index ? (
        <CircularProgress size={24} />
      ) : value ? (
        // Image Preview + Delete
        <Box
          sx={{
            position: "relative",
            width: 100,
            height: 100,
            "&:hover .delete-btn": {
              opacity: 1,
            },
          }}
        >
          <img
            src={value}
            alt="Preview"
            width={100}
            height={100}
            style={{
              borderRadius: 4,
              objectFit: "cover",
            }}
          />
          <IconButton
            className="delete-btn"
            size="small"
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
              backgroundColor: "rgba(255,255,255,0.8)",
              opacity: 0,
              transition: "opacity 0.3s",
              "&:hover": {
                backgroundColor: "rgba(255,0,0,0.8)",
                color: "#fff",
              },
            }}
            onClick={() => onChange("")}
            title="Remove Image"
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        // Upload Icon Placeholder
        <Box
          sx={{
            width: 100,
            height: 100,
            border: "1px dashed #ccc",
            borderRadius: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            position: "relative",
          }}
          onClick={() => document.getElementById(inputId).click()}
        >
          <input
            type="file"
            id={inputId}
            style={{ display: "none" }}
            accept="image/png,image/jpeg,image/jpg"
            onChange={async (e) => {
              const file = e.currentTarget.files[0];
              if (!file) return;

              try {
                setUploadingIndex(index);
                const imageUrl = await uploadImageAndGetUrl(file); // External function
                onChange(imageUrl);
              } catch (err) {
                showAlert({ text: err.message, icon: "error" }); // External function
              } finally {
                setUploadingIndex(null);
              }
            }}
          />
          <Upload color="action" />
        </Box>
      )}

      {error && (
        <Box mt={0.5} color="error.main" fontSize="0.75rem" textAlign="center">
          {helperText}
        </Box>
      )}
    </Box>
  );
};
ImageUploadBox.propTypes = {
  value: PropTypes.any,
  index: PropTypes.any,
  uploadingIndex: PropTypes.any,
  setUploadingIndex: PropTypes.any,
  onChange: PropTypes.any,
  error: PropTypes.any,
  helperText: PropTypes.any,
};

export default ImageUploadBox;
