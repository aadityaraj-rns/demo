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
  Typography,
} from "@mui/material";
import { IconEye } from "@tabler/icons";
import React, { useState } from "react";
import ViewTextInput from "../../forms/theme-elements/ViewTextInput";
import userimg from "../../../assets/images/profile/Profile.jpeg";
import CloseIcon from "@mui/icons-material/Close";
import { dialogTitleStyles } from "../../../utils/helpers/customDialogTitleStyle";

const ManagerDetails = ({ manager, triggerComponent }) => {
  const [modal, setModal] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const handleImageClick = (image) => {
    setFullscreenImage(image);
  };

  const handleCloseFullscreen = () => {
    setFullscreenImage(null);
  };

  const ProfileImage = styled(Box)(() => ({
    backgroundImage: "linear-gradient(#2a72a9,#b78e13)",
    borderRadius: "50%",
    width: "110px",
    height: "110px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
  }));

  const toggle = () => {
    setModal(!modal);
  };

  return (
    <>
      {triggerComponent ? (
        <span onClick={toggle}>{triggerComponent}</span>
      ) : (
        <Typography onClick={toggle}>View</Typography>
      )}
      <Dialog
        open={modal}
        onClose={toggle}
        maxWidth="xs"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          variant="h5"
          sx={dialogTitleStyles}
        >
          {"View Manager"}
          <IconButton aria-label="close" onClick={toggle}>
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#d8d8d871" }}>
          <Box
            sx={{
              mt: "5px",
              mb: "20px",
            }}
          >
            <ProfileImage>
              <Avatar
                onClick={() =>
                  handleImageClick(manager.profile ? manager.profile : userimg)
                }
                src={manager.profile ? manager.profile : userimg}
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
          <Box sx={{ marginBottom: "20px" }}>
            <Grid
              spacing={1}
              container
              alignItems="center"
              justifyContent="space-around"
            >
              <Grid item xs={11}>
                <ViewTextInput label="Login ID" value={manager.loginID} />
              </Grid>
              <Grid item xs={11}>
                <ViewTextInput label="Name" value={manager.name} />
              </Grid>
              <Grid item xs={11}>
                <ViewTextInput label="Email" value={manager.email} />
              </Grid>
              <Grid item xs={11}>
                <ViewTextInput label="Contact No" value={manager.contactNo} />
              </Grid>
              {/* <Grid item xs={11}>
                <ViewTextInput label="Address" value={manager.address} />
              </Grid> */}
              {/* <Grid item xs={11}>
                <ViewTextInput label="City" value={manager.cityName} />
              </Grid> */}
              <Grid item xs={11}>
                <ViewTextInput
                  label="Assigned Plants"
                  value={manager.plants.map(plant => plant.plantName).join(", ")}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
      {fullscreenImage && (
        <Dialog
          open={!!fullscreenImage}
          onClose={handleCloseFullscreen}
          fullScreen
        >
          <DialogTitle>
            <IconButton
              edge="end" color="inherit"
              onClick={handleCloseFullscreen}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <img src={fullscreenImage} alt="Fullscreen Image"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ManagerDetails;
