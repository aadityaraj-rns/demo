import { useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  Grid,
  CardMedia,
} from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CloseIcon from "@mui/icons-material/Close";
import { dialogTitleStyles } from "../../../utils/helpers/customDialogTitleStyle";
import PropTypes from "prop-types";

const PlantDetails = ({ plant, text }) => {
  const [modal, setModal] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const toggle = () => {
    setModal(!modal);
  };

  const handleImageClick = (image) => {
    setFullscreenImage(image);
  };

  const handleCloseFullscreen = () => {
    setFullscreenImage(null);
  };

  return (
    <>
      <Box onClick={toggle} sx={{ cursor: "pointer", color: "inherit" }}>
        {text}
      </Box>

      <Dialog
        open={modal}
        onClose={toggle}
        maxWidth="sm"
        fullWidth
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          variant="h5"
          sx={dialogTitleStyles}
        >
          <Typography variant="h5">Plant Details</Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={toggle}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ backgroundColor: "#d8d8d871" }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2">PLANT</Typography>
              <CardMedia
                component="img"
                style={{
                  maxHeight: "350px",
                  width: "100%",
                  objectFit: "contain",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
                alt={plant.plantName}
                src={plant.plantImage}
                onClick={() => handleImageClick(plant.plantImage)}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2"> LAYOUTS </Typography>
              <Carousel showArrows={true} showThumbs={false}>
                {plant.layouts?.map((layout) => (
                  <div
                    key={layout._id}
                    onClick={() => handleImageClick(layout.layoutImage)}
                  >
                    <img
                      src={layout.layoutImage}
                      alt={layout.layoutName}
                      style={{
                        maxHeight: "350px",
                        width: "100%",
                        objectFit: "contain",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        opacity: "0.9",
                      }}
                    />
                    <Box
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        background: "rgba(0, 0, 0, 0.5)",
                        color: "white",
                        padding: "8px",
                        textAlign: "center",
                        fontSize: "1rem",
                      }}
                    >
                      {layout.layoutName}
                    </Box>
                  </div>
                ))}
              </Carousel>
            </Grid>
            {[
              { label: "Name", value: plant.plantName },
              { label: "Address", value: plant.address },
              { label: "City", value: plant.cityName },
              { label: "Manager", value: plant.managerName },
              { label: "Header Pressure", value: plant.headerPressure },
              { label: "Pressure Unit", value: plant.pressureUnit },
              { label: "Main Water Storage", value: plant.mainWaterStorage },
              {
                label: "Prime Water Tank Storage",
                value: plant.primeWaterTankStorage,
              },
              { label: "Diesel Storage", value: plant.dieselStorage },
            ]
              .reduce((rows, item, index, arr) => {
                if (index % 2 === 0) rows.push(arr.slice(index, index + 2));
                return rows;
              }, [])
              .map((pair, rowIndex) => (
                <Grid container item xs={12} spacing={2} key={rowIndex}>
                  {pair.map((item, i) => (
                    <Grid item xs={6} key={i}>
                      <Grid container>
                        <Grid item xs={6}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {item.label}:
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">{item.value}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              ))}
          </Grid>
        </DialogContent>
      </Dialog>

      {fullscreenImage && (
        <Dialog
          open={Boolean(fullscreenImage)}
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
PlantDetails.propTypes = {
  plant: PropTypes.any,
  text: PropTypes.any,
};

export default PlantDetails;
