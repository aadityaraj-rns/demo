import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  IconButton,
  styled,
} from "@mui/material";
import { IconEye } from "@tabler/icons";
import React, { useState } from "react";
import ViewTextInput from "../../../forms/theme-elements/ViewTextInput";
import CloseIcon from "@mui/icons-material/Close";
import userimg from "../../../../assets/images/profile/Profile.jpeg";

const ProfileImage = styled(Box)(() => ({
  backgroundImage: "linear-gradient(#50b2fc,#f44c66)",
  borderRadius: "50%",
  width: "110px",
  height: "110px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto",
}));

const ClientViewModal = ({ client, triggerComponent }) => {
  const [modal, setModal] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const handleImageClick = (image) => {
    setFullscreenImage(image);
  };

  const handleCloseFullscreen = () => {
    setFullscreenImage(null);
  };

  const toggle = () => {
    setModal(!modal);
  };

  return (
    <>
      {triggerComponent ? (
        <span onClick={toggle}>{triggerComponent}</span>
      ) : (
        <Fab
          size="small"
          color="primary"
          onClick={toggle}
          sx={{ marginRight: 2 }}
        >
          <IconEye size="16" />
        </Fab>
      )}
      <Dialog
        open={modal}
        onClose={toggle}
        maxWidth="md"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          color="primary"
          variant="h5"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {"View Client"}
          <IconButton
            aria-label="close"
            onClick={toggle}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={12}>
              <Box
                display="flex"
                alignItems="center"
                textAlign="center"
                justifyContent="center"
                sx={{
                  mt: "0px",
                  mb: "30px",
                }}
              >
                <ProfileImage>
                  <Avatar
                    onClick={() =>
                      handleImageClick(
                        client.profile ? client.profile : userimg
                      )
                    }
                    src={client.profile ? client.profile : userimg}
                    alt={userimg}
                    sx={{
                      borderRadius: "50%",
                      width: "100px",
                      height: "100px",
                      border: "4px solid #fff",
                    }}
                  />
                </ProfileImage>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <ViewTextInput label="Login ID" value={client.loginID} />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <ViewTextInput label="Client Type" value={client.clientType} />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <ViewTextInput label="Client Name" value={client.name} />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <ViewTextInput label="Category" value={client.categoryNames} />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <ViewTextInput
                label="Industry Name"
                value={client.industryName}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <ViewTextInput label="Contact No" value={client.contactNo} />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <ViewTextInput label="Email" value={client.email} />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <ViewTextInput label="GST" value={client.gst || "-"} />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <ViewTextInput label="City" value={client.cityName} />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <ViewTextInput label="State" value={client.stateName} />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <ViewTextInput label="Address" value={client.address || "-"} />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <ViewTextInput label="Pincode" value={client.pincode || "-"} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={toggle}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {fullscreenImage && (
        <Dialog
          open={!!fullscreenImage}
          onClose={handleCloseFullscreen}
          fullScreen
        >
          <DialogTitle>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleCloseFullscreen}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <img
              src={fullscreenImage}
              alt="Fullscreen Image"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ClientViewModal;
