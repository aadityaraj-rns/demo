// import React from "react";
// import Chart from "react-apexcharts";
// import { useTheme } from "@mui/material/styles";
// import PageContainer from "../../../components/container/PageContainer";
// import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
// import ParentCard from "../../../components/shared/ParentCard";

// const LineChart = () => {
//   // chart color
//   const theme = useTheme();
//   const primary = theme.palette.primary.main;
//   const secondary = theme.palette.secondary.main;

//   const optionslinechart = {
//     chart: {
//       type: "line",
//       fontFamily: "'Plus Jakarta Sans', sans-serif",
//       foreColor: "#adb0bb",
//       zoom: {
//         type: "x",
//         enabled: true,
//       },
//       toolbar: {
//         show: false,
//       },
//       shadow: {
//         enabled: true,
//         color: "#000",
//         top: 18,
//         left: 7,
//         blur: 10,
//         opacity: 1,
//       },
//     },
//     xaxis: {
//       categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
//       title: {
//         text: "Month",
//       },
//     },
//     grid: {
//       show: false,
//     },
//     colors: [primary, secondary],
//     dataLabels: {
//       enabled: true,
//     },
//     stroke: {
//       curve: "straight",
//       width: "2",
//     },
//     legend: {
//       position: "top",
//       horizontalAlign: "right",
//       floating: true,
//       offsetY: -25,
//       offsetX: -5,
//     },
//     tooltip: {
//       theme: "dark",
//     },
//   };
//   const serieslinechart = [
//     {
//       name: "High - 2013",
//       data: [28, 29, 33, 36, 32, 32, 33],
//     },
//     {
//       name: "Low - 2013",
//       data: [12, 11, 14, 18, 17, 13, 13],
//     },
//   ];

//   return (
//     <Chart
//       options={optionslinechart}
//       series={serieslinechart}
//       type="line"
//       height="308px"
//       width={"90%"}
//     />
//   );
// };

// export default LineChart;



import React from "react";
import Chart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";

const LineChart = ({ healthGraph }) => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  // Process the healthGraph data
  const xAxisData = healthGraph.map((data) =>
    new Date(data.createdAt).toLocaleDateString()
  );

  const seriesData = {
    PLACEMENT: healthGraph.map((data) =>
      data.questions[0]?.answer === "Satisfactory" ? 1 : 0
    ),
    OBSTRUCTION: healthGraph.map((data) =>
      data.questions[1]?.answer === "Satisfactory" ? 1 : 0
    ),
    PRESSURE: healthGraph.map((data) =>
      data.questions[2]?.answer === "Satisfactory" ? 1 : 0
    ),
  };

  const optionslinechart = {
    chart: {
      type: "line",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: "#adb0bb",
      zoom: {
        type: "x",
        enabled: true,
      },
      toolbar: {
        show: false,
      },
      shadow: {
        enabled: true,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 1,
      },
    },
    xaxis: {
      categories: xAxisData, // Use processed dates as x-axis categories
      title: {
        text: "Date",
      },
    },
    grid: {
      show: false,
    },
    colors: [primary, secondary, "#12f321"],
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: "straight",
      width: "2",
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: -25,
      offsetX: -5,
    },
    tooltip: {
      theme: "dark",
    },
    yaxis: {
      title: {
        text: "Status",
      },
      min: 0, // Ensure y-axis starts at 0
      max: 1, // Ensure y-axis ends at 1
      tickAmount: 1, // Only display 0 and 1
      labels: {
        formatter: (value) => (value === 1 ? "Yes" : "No"), // Map 1/0 to Yes/No
      },
    },
  };

  const serieslinechart = [
    {
      name: "PLACEMENT",
      data: seriesData.PLACEMENT,
    },
    {
      name: "OBSTRUCTION",
      data: seriesData.OBSTRUCTION,
    },
    {
      name: "PRESSURE",
      data: seriesData.PRESSURE,
    },
  ];

  return (
    <Chart
      options={optionslinechart}
      series={serieslinechart}
      type="line"
      height="308px"
      width={"90%"}
    />
  );
};

export default LineChart;
