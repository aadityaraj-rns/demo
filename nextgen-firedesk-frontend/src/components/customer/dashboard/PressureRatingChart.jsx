import React from "react";
import ReactApexChart from "react-apexcharts";

const PressureRatingChart = ({ pressureValue = 0, goodPressure = 0 }) => {
  const goodMin = goodPressure - 2;
  const goodMax = goodPressure + 2;

  const isGoodPressure = pressureValue >= goodMin && pressureValue <= goodMax;

  const chartOptions = {
    chart: {
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        track: {
          background: "#333",
          strokeWidth: "97%",
          margin: 5,
        },
        dataLabels: {
          name: {
            fontSize: "16px",
            color: isGoodPressure ? "#00E396" : "#FF4560", // Conditional color for label
            offsetY: 70,
            formatter: function () {
              return isGoodPressure ? "Good Pressure" : "Not Good Pressure"; // Conditional label text
            },
          },
          value: {
            fontSize: "30px",
            color: isGoodPressure ? "#00E396" : "#FF4560",
            offsetY: -10,
            formatter: function (val) {
              return val;
            },
          },
        },
      },
    },
    fill: {
      colors: isGoodPressure ? ["#00E396"] : ["#FF4560"],
    },
  };

  const chartSeries = [pressureValue];

  return (
    <div>
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="radialBar"
        height={350}
      />
    </div>
  );
};

export default PressureRatingChart;
