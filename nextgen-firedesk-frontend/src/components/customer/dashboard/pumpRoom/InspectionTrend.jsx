import { Grid, Box, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import ApexCharts from "react-apexcharts";
import DashboardCard from "../DashboardCard";
import PropTypes from "prop-types";

const InspectionTrend = ({ datas, inspectionserviceCompletedPercentage }) => {
  // Helper function to generate a range of months
  const generateMonthRange = (start, end) => {
    const result = [];
    let current = new Date(start);
    const last = new Date(end);

    while (current <= last) {
      const yearMonth = `${current.getFullYear()}-${String(
        current.getMonth() + 1
      ).padStart(2, "0")}`;
      result.push(yearMonth);
      current.setMonth(current.getMonth() + 1); // Move to the next month
    }

    return result;
  };

  // Preprocess the data to fill missing months
  const preprocessData = (data) => {
    if (!data?.length) return [];
    const months = data?.map((item) => item.month);
    const startMonth = months[0];
    const endMonth = months[months.length - 1];

    const allMonths = generateMonthRange(startMonth, endMonth);

    return allMonths.map((month) => {
      const existing = data?.find((item) => item.month === month);
      return existing ? existing : { month, count: 0 };
    });
  };

  // Process the data
  const filledData = preprocessData(datas);

  // Prepare x-axis labels and counts
  const xLabels = filledData.map((data) => data?.month); // Months as x-axis labels
  const counts = filledData.map((data) => data?.count); // Counts as y-axis data

  // Data for the Doughnut Chart
  const doughnutChartOptions = {
    chart: {
      type: "donut",
    },
    labels: ["Completed", "Pending"],
    colors: ["#66bb6a", "#9ccc65"],
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: (value) => `${value}%`,
      },
    },
  };

  const doughnutChartData = [
    inspectionserviceCompletedPercentage,
    100 - inspectionserviceCompletedPercentage,
  ];

  return (
    <DashboardCard title={"Inspection Trend over Time"} dropDown={true}>
      <Grid container spacing={2} alignItems="center">
        {/* Line Chart Section */}
        <Grid
          item
          xs={12}
          md={8}
          display="flex"
          justifyContent="space-around"
          alignItems="center"
        >
          <Box>
            <LineChart
              width={500}
              height={300}
              series={[
                { data: counts, label: "Inspection Count", color: "#e65b24" },
              ]}
              xAxis={[
                {
                  scaleType: "point", // Treat x-axis as categorical
                  data: xLabels, // Provide month labels
                  label: "Months",
                },
              ]}
            />
            <Typography
              sx={{
                fontSize: "12px",
                marginTop: "8px",
                color: "#555",
                textAlign: "center",
              }}
            >
              Inspection Count by Month
            </Typography>
          </Box>
        </Grid>
        {/* Doughnut Chart Section */}
        <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
          <ApexCharts
            options={doughnutChartOptions}
            series={doughnutChartData}
            type="donut"
            height={250}
          />
          <Box sx={{ marginTop: "16px" }}>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#2e7d32",
                marginBottom: "8px",
              }}
            >
              {inspectionserviceCompletedPercentage}% Completed
            </Typography>
            <Typography
              sx={{ fontSize: "16px", fontWeight: "bold", color: "#2e7d32" }}
            >
              {100 - inspectionserviceCompletedPercentage}% Pending
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};
InspectionTrend.propTypes = {
  datas: PropTypes.array,
  inspectionserviceCompletedPercentage: PropTypes.any,
};

export default InspectionTrend;
