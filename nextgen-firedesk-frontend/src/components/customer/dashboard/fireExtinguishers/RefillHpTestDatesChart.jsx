import { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { getFireExtinguisherRefillHpTestDates } from "../../../../api/organization/internal";
import { Box } from "@mui/material";
import DashboardCard from "../DashboardCard";
import PropTypes from "prop-types";

const RefillHpTestDatesChart = ({ plantId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getFireExtinguisherRefillHpTestDates(plantId);
      if (response.status === 200) {
        setData(response.data);
      }
    };
    fetchData();
  }, [plantId]);

  // Process data for the chart
  const months = data.map((item) => item.month); // X-axis: months
  const hpTestCounts = data.map((item) => item.hpTestCount); // Y-axis: HP Test Count
  const nextHpTestCounts = data.map((item) => item.nextHpTestCount); // Y-axis: Next HP Test Count
  const refilledOnCounts = data.map((item) => item.refilledOnCount); // Y-axis: Refilled On Count

  return (
    <DashboardCard title="Fire Extinguisher Refill & HP Test Dates">
      <Box display="flex" justifyContent="center">
        <BarChart
          width={700}
          height={400}
          series={[
            { data: hpTestCounts, label: "HP Test Count", color: "#1e88e5" },
            {
              data: nextHpTestCounts,
              label: "Next HP Test Count",
              color: "#ff9800",
            },
            {
              data: refilledOnCounts,
              label: "Refilled Count",
              color: "#4caf50",
            },
          ]}
          xAxis={[
            {
              scaleType: "band",
              data: months,
              label: "Month",
            },
          ]}
          yAxis={[
            {
              label: "Count",
            },
          ]}
        />
      </Box>
    </DashboardCard>
  );
};
RefillHpTestDatesChart.propTypes = {
  plantId: PropTypes.any,
};
export default RefillHpTestDatesChart;
