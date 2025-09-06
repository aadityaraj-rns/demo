// import { useTheme } from "@mui/material";
// import DashboardCard from "../../../../components/customer/dashboard/DashboardCard";
// import PropTypes from "prop-types";
// import ReactApexChart from "react-apexcharts";

// const PercentageGraph = ({ title, data = [], labels = [] }) => {
//   const theme = useTheme();
//   const primary = theme.palette.primary.main;
//   const areaChart = {
//     series: [
//       {
//         name: "Fillup in Ltrs",
//         data,
//       },
//     ],
//     options: {
//       chart: {
//         type: "area",
//         height: 300,
//         zoom: {
//           enabled: false,
//         },
//         toolbar: {
//           show: false,
//         },
//       },
//       colors: [primary],
//       dataLabels: {
//         enabled: false,
//       },
//       stroke: {
//         width: 2,
//         curve: "smooth",
//       },
//       xaxis: {
//         type: "category",
//         axisBorder: {
//           color: "#e0e6ed",
//         },
//         labels: {
//           formatter: function (val) {
//             const date = new Date(val);
//             const day = String(date.getDate()).padStart(2, "0");
//             const month = String(date.getMonth() + 1).padStart(2, "0");
//             return `${day}-${month}`;
//           },
//         },
//       },
//       yaxis: {
//         opposite: false,
//         labels: {
//           offsetX: 0,
//         },
//       },
//       labels,
//       legend: {
//         horizontalAlign: "left",
//       },
//       grid: {
//         borderColor: "#E0E6ED",
//         xaxis: {
//           lines: {
//             show: false,
//           },
//         },
//       },
//       tooltip: {
//         x: {
//           show: false,
//         },
//       },
//     },
//   };
//   return (
//     <DashboardCard title={title} dropDown={true}>
//       <ReactApexChart
//         series={areaChart.series}
//         options={areaChart.options}
//         className="rounded-lg bg-white dark:bg-black overflow-hidden"
//         type="area"
//         height={300}
//       />
//     </DashboardCard>
//   );
// };
// PercentageGraph.propTypes = {
//   title: PropTypes.string,
//   data: PropTypes.array,
//   labels: PropTypes.array,
// };
// export default PercentageGraph;
