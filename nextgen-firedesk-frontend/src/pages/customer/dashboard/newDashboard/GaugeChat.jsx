import React from "react";
import { Gauge, gaugeClasses } from "@mui/x-charts";
import { Box } from "@mui/material";

const GaugeChat = ({ percentage = 0 }) => {
  return (
    <Box sx={{ width: 120, height: 120 }}>
      <Gauge
        value={Math.round(percentage)}
        startAngle={0}
        endAngle={360}
        innerRadius="70%"
        outerRadius="100%"
        sx={{
          [`& .${gaugeClasses.valueText}`]: {
            fontSize: 20,
            transform: "translate(0px, 0px)",
          },
        }}
        text={({ value, valueMax }) => `${value}%`} // Adding percentage sign
        // ...
      />
    </Box>
  );
};

export default GaugeChat;
