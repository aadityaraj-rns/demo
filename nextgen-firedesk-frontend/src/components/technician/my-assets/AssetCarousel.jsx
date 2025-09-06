import React, { useEffect, useRef, useState } from "react";
import { Box, CardMedia } from "@mui/material";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Carousel.css";

const AssetCarousel = ({ SliderData }) => {
  const [state, setState] = useState({ nav1: null, nav2: null });
  const slider1 = useRef();
  const slider2 = useRef();

  useEffect(() => {
    setState({
      nav1: slider1.current,
      nav2: slider2.current,
    });
  }, []);

  const { nav1, nav2 } = state;
  const settings = {
    focusOnSelect: true,
    infinite: true,
    slidesToShow: 5,
    arrows: false,
    swipeToSlide: true,
    slidesToScroll: 1,
    centerMode: true,
    className: 'centerThumb',
    speed: 500,
  };

  return (
    <Box>
      <Slider asNavFor={nav2} ref={(slider) => (slider1.current = slider)}>
        <Box>
          <CardMedia
            component="img"
            height="440"
            style={{ objectFit: "contain" }}
            image={SliderData[1]}
            alt="green iguana"
          />
        </Box>
        {SliderData.map((image, index) => (
          <Box key={index}>
            <CardMedia
              component="img"
              height="440"
              style={{ objectFit: "contain" }}
              image={image}
              alt="green iguana"
            />
          </Box>
        ))}
      </Slider>
      <Slider
        asNavFor={nav1}
        ref={(slider) => (slider2.current = slider)}
        {...settings}
      >
        <Box sx={{ p: 1, cursor: "pointer" }}>
          <CardMedia
            alt={`carousel-thumbnail`}
            component="img"
            height="80"
            style={{ objectFit: "contain" }}
            image={SliderData[1]}
          />
        </Box>
        {SliderData.map((image, index) => (
          <Box key={index} sx={{ p: 1, cursor: "pointer" }}>
            <CardMedia
              alt={`carousel-thumbnail-${index}`}
              component="img"
              height="80"
              style={{ objectFit: "contain" }}
              image={image}
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default AssetCarousel;
