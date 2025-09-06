import { useState } from "react";
import userimg from "../../../assets/images/profile/Profile.jpeg";
import CloseIcon from "@mui/icons-material/Close";

import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  styled,
  Typography,
} from "@mui/material";
import ViewTextInput from "../../forms/theme-elements/ViewTextInput";
import { dialogTitleStyles } from "../../../utils/helpers/customDialogTitleStyle";
import PropTypes from "prop-types";

const TechnicianDetails = ({ technician, triggerComponent }) => {
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
          {"View Technician"}
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
                  handleImageClick(
                    technician.userId?.profile
                      ? technician.userId?.profile
                      : userimg
                  )
                }
                src={
                  technician.userId.profile
                    ? technician.userId?.profile
                    : userimg
                }
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
                <ViewTextInput label="Name" value={technician.userId?.name} />
              </Grid>
              <Grid item xs={11}>
                <ViewTextInput
                  label="Contact No"
                  value={technician.userId?.phone}
                />
              </Grid>
              <Grid item xs={11}>
                <ViewTextInput label="Email" value={technician.userId?.email} />
              </Grid>
              <Grid item xs={11}>
                <ViewTextInput
                  label="Plant's"
                  value={technician.plantId.map((p) => p.plantName).join(", ")}
                />
              </Grid>
              <Grid item xs={11}>
                <ViewTextInput
                  label="Category"
                  value={technician.categoryId
                    .map((c) => c.categoryName)
                    .join(", ")}
                />
              </Grid>
              <Grid item xs={11}>
                <ViewTextInput label="Type" value={technician.technicianType} />
              </Grid>
              {technician.technicianType === "Third Party" && (
                <>
                  <Grid item xs={11}>
                    <ViewTextInput
                      label="Vender Name"
                      value={technician.venderName}
                    />
                  </Grid>
                  <Grid item xs={11}>
                    <ViewTextInput
                      label="Vender Address"
                      value={technician.venderAddress}
                    />
                  </Grid>
                </>
              )}
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

TechnicianDetails.propTypes = {
  technician: PropTypes.object,
  triggerComponent: PropTypes.any,
};

export default TechnicianDetails;
