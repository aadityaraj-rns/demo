import { Box } from "@mui/material";
import Chart from "react-apexcharts";

const StatusChart = ({ labels, colors, series }) => {
  const data = {
    series: series,
    options: {
      chart: {
        type: "pie",
      },
      labels: labels,
      colors: colors,
      legend: {
        position: "right",
        formatter: function (seriesName, opts) {
          return `${seriesName}: ${opts.w.globals.series[opts.seriesIndex]}`;
        },
        labels: {
          useSeriesColors: true,
        },
        itemMargin: {
          vertical: 9,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: "100%",
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  return (
    <Box>
      <Chart
        options={data?.options}
        series={data?.series}
        type="pie"
        width="100%"
        height="180vh"
      />
    </Box>
  );
};

export default StatusChart;
