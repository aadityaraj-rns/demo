import React from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts";
import { Box } from "@mui/material";

const PieChartGraph = ({ level }) => {
  const data = [
    { value: 100 - level, label: "To Fill", color: "red" },
    { value: level, label: "Availability", color: "green" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "120px",
      }}
    >
      <PieChart
        series={[
          {
            innerRadius: "25%",
            outerRadius: "100%",
            arcLabel: (item) => `${item.value}%`,
            arcLabelMinAngle: 35,
            arcLabelRadius: "60%",
            data,
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fontWeight: "bold",
          },
          width: "80%",
          height: "80%",
        }}
      />
    </Box>
  );
};

export default PieChartGraph;
