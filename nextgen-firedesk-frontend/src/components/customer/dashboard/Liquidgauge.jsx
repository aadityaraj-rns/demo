import { color } from "d3-color";

import LiquidFillGauge from "react-liquid-gauge";
import PropTypes from "prop-types";

function Liquidgauge({
  value,
  radius = "150",
  unit = "%",
  liquidcolor = "rgb(24, 144, 255)",
}) {
  return (
    <LiquidFillGauge
      width={radius * 2}
      height={radius * 2}
      value={value}
      percent={unit}
      textSize={1}
      textOffsetX={10}
      textOffsetY={30}
      riseAnimation
      waveAnimation
      waveFrequency={2}
      waveAmplitude={1}
      gradient
      outerRadius={0.94}
      circleStyle={{
        fill: liquidcolor,
      }}
      waveStyle={{
        fill: liquidcolor,
      }}
      textStyle={{
        fill: color("#444").toString(),
        fontFamily: "Arial",
      }}
      waveTextStyle={{
        fill: color("#fff").toString(),
        fontFamily: "Arial",
      }}
    />
  );
}
Liquidgauge.propTypes = {
  value: PropTypes.number.isRequired,
  radius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  unit: PropTypes.string,
  liquidcolor: PropTypes.string,
};

export default Liquidgauge;
