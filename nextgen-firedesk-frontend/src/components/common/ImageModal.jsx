import React from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ImageModal = ({ show, img, onClose }) => {
  return (
    <Dialog open={Boolean(show)} onClose={onClose} fullScreen>
      <DialogTitle>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <img
          src={img}
          alt="Fullscreen Image"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
