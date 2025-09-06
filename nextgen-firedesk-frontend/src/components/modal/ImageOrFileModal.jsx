import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Fab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IconFile } from "@tabler/icons";

const ImageOrFileModal = ({ product, id}) => {
  const [modal, setModal] = React.useState(false);
  const [isImageLoaded, setIsImageLoaded] = React.useState(true); // State to handle image load status

  const toggle = () => {
    setModal(!modal);
    setIsImageLoaded(true); // Reset the image load status when reopening the modal
  };

  const isImage = (file) => /\.(jpg|jpeg|png|gif)$/i.test(file);

  const isPDF = (file) => /\.pdf$/i.test(file);

  const isWordFile = (file) => /\.(doc|docx)$/i.test(file);

  return (
    <>
      <Fab size="small" color="secondary" onClick={toggle} id={id}>
        <IconFile size="16" />
      </Fab>
      <Dialog
        open={modal}
        onClose={toggle}
        maxWidth="xl"
        fullWidth
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" variant="h5">
          {"Product Images"}
          <IconButton
            aria-label="close"
            onClick={toggle}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            mt={3}
            display="flex"
            justifyContent="center" // Center content horizontally
            alignItems="center" // Center content vertically
            style={{ height: "80vh", textAlign: "center" }} // Adjust height to center vertically
          >
            {isImage(product.file) ? (
              isImageLoaded ? (
                <img
                  src={product.file}
                  alt="Product"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                  onError={() => setIsImageLoaded(false)}
                />
              ) : (
                <span>Image could not be loaded.</span>
              )
            ) : isPDF(product.file) ? (
              <embed
                src={product.file}
                type="application/pdf"
                style={{ width: "100%", height: "100%" }}
              />
            ) : isWordFile(product.file) ? (
              <iframe
                src={`https://docs.google.com/gview?url=${product.file}&embedded=true`}
                style={{ width: "100%", height: "100%" }}
                frameBorder="0"
              />
            ) : (
              <iframe
                src={product.file}
                style={{ width: "100%", height: "100%" }}
                frameBorder="0"
                title="File Viewer"
              />
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageOrFileModal;
