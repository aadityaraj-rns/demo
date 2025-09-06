import React from "react";
import Chart from "react-apexcharts";

// Generic Tank/Battery Level Chart Component
const TankChart = ({ level, label, color }) => {
  const options = {
    chart: {
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "50%",
        },
        dataLabels: {
          name: {
            offsetY: -10,
            color: "#333",
            fontSize: "18px",
          },
          value: {
            fontSize: "24px",
            color: "#333",
            formatter: function (val) {
              return `${val}%`;
            },
          },
        },
      },
    },
    labels: [label || 'level'],
    fill: {
      colors: [color],
    },
  };

  const series = [level]; // Set the level percentage (0-100)

  return (
    <div>
      <Chart
        options={options}
        series={series}
        type="radialBar"
        //  height={350}
      />
    </div>
  );
};

// Specific Components for Each Type
export const WaterTankChart = ({ level }) => (
  <TankChart level={level} label="Water Level" color="#0077be" />
);

export const DieselTankChart = ({ level }) => (
  <TankChart level={level} label="Diesel Level" color="#ff5733" />
);

export const BatteryLevelChart = ({ level = 0 }) => (
  <TankChart level={level} label="Battery Level" color="#ffc107" />
);
