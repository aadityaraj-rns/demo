import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Sample Arrow Components
function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "black",
        backgroundColor: "rgba(0,0,0,0.5)",
        borderRadius: "50%",
      }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "black",
        backgroundColor: "rgba(0,0,0,0.5)",
        borderRadius: "50%",
      }}
      onClick={onClick}
    />
  );
}

// CustomSlider Component
const CustomSlider = ({
  children,
  dots = true,
  infinite = true,
  speed = 500,
  slidesToShow = 1,
  slidesToScroll = 1,
  nextArrow,
  prevArrow,
}) => {
  const settings = {
    dots,
    infinite,
    speed,
    slidesToShow,
    slidesToScroll,
    nextArrow: nextArrow || <SampleNextArrow />,
    prevArrow: prevArrow || <SamplePrevArrow />,
  };

  return <Slider {...settings}>{children}</Slider>;
};

export default CustomSlider;
