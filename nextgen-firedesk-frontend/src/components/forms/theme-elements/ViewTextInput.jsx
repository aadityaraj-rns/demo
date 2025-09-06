import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

const ViewTextInput = ({ label, value }) => {
  const inputBoxStyles = {
    padding: "8px 8px",
    borderRadius: "4px",
    backgroundColor: "#f5f5f5", // Slightly lighter background for better contrast
    // border: "1px solid #dddddd4c", // Adding a subtle border for input-like appearance
    width: "100%",
    // boxSizing: "border-box",
    // display: "inline-block",
  };

  return (
    <Box display="flex" alignItems="center">
      <Typography
        variant="h6"
        fontSize={"12px"}
        gutterBottom
        sx={{
          width: "150px",
          textAlign: "left",
          color: "#6C7184",
        }}
      >
        {label.toUpperCase()}
      </Typography>
      <Box sx={{ ml: 1, ...inputBoxStyles }}>
        <Typography
          variant="body2" // Slightly smaller font variant
          sx={{ fontSize: "12px", color: "text.primary" }} // Using primary text color for better readability
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
};
ViewTextInput.propTypes = {
  label: PropTypes.any,
  value: PropTypes.any,
};
export default ViewTextInput;
