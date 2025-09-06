import * as React from "react";
import PropTypes from "prop-types";
import { Snackbar, Alert, AlertTitle } from "@mui/material";

const Toaster = ({ title, message, color = "info" }) => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (title && message) {
      setOpen(true);
    }
  }, [title, message]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={color}
        variant="filled"
        sx={{ width: "100%", color: "white" }}
      >
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Snackbar>
  );
};

Toaster.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  color: PropTypes.string,
};

export default Toaster;
