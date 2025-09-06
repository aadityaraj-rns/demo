import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import React from "react";
import PropTypes from "prop-types";

const PlantView = ({ plant }) => {
  const imageStyle = {
    maxHeight: "300px",
    objectFit: "cover",
    width: "100%",
  };
  const [modal, setModal] = React.useState(false);

  const toggle = () => {
    setModal(!modal);
  };
  return (
    <>
      <Box>
        <Button variant="contained" onClick={toggle}>
          View
        </Button>
      </Box>
      <Dialog
        open={modal}
        onClose={toggle}
        maxWidth="sm"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" variant="h5">
          {"Plant View"}
        </DialogTitle>
        <DialogContent>
          <div className="carousel-container">
            <Carousel showArrows={true} showThumbs={false}>
              <div>
                <Typography>{plant.image1Name}</Typography>
                <img
                  src={plant.image1}
                  alt={plant.image1Name}
                  style={imageStyle}
                />
              </div>
              <div>
                <Typography>{plant.image2Name}</Typography>
                <img
                  src={plant.image2}
                  alt={plant.image2Name}
                  style={imageStyle}
                />
              </div>
              <div>
                <Typography>{plant.image3Name}</Typography>
                <img
                  src={plant.image3}
                  alt={plant.image3Name}
                  style={imageStyle}
                />
              </div>
              <div>
                <Typography>{plant.image4Name}</Typography>
                <img
                  src={plant.image4}
                  alt={plant.image4Name}
                  style={imageStyle}
                />
              </div>
              <div>
                <Typography>{plant.image5Name}</Typography>
                <img
                  src={plant.image5}
                  alt={plant.image5Name}
                  style={imageStyle}
                />
              </div>
              <div>
                <Typography>{plant.image6Name}</Typography>
                <img
                  src={plant.image6}
                  alt={plant.image6Name}
                  style={imageStyle}
                />
              </div>
              <div>
                <Typography>{plant.image7Name}</Typography>
                <img
                  src={plant.image7}
                  alt={plant.image7Name}
                  style={imageStyle}
                />
              </div>
              <div>
                <Typography>{plant.image8Name}</Typography>
                <img
                  src={plant.image8}
                  alt={plant.image8Name}
                  style={imageStyle}
                />
              </div>
              <div>
                <Typography>{plant.image9Name}</Typography>
                <img
                  src={plant.image9}
                  alt={plant.image9Name}
                  style={imageStyle}
                />
              </div>
              <div>
                <Typography>{plant.image10Name}</Typography>
                <img
                  src={plant.image10}
                  alt={plant.image10Name}
                  style={imageStyle}
                />
              </div>
            </Carousel>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
PlantView.propTypes = {
  plant: PropTypes.object,
};

export default PlantView;
