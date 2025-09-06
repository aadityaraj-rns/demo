import  { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { getHpTestDates } from "../../../../api/organization/internal";
import { Box } from "@mui/material";
import DashboardCard from "../DashboardCard";

const HpTestDatesChart = ({ plantId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getHpTestDates(plantId);
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

  return (
    <DashboardCard title="Fire Extinguisher Refill & HP Test Dates">
      <Box display="flex" justifyContent="center">
        <BarChart
          width={700}
          height={400}
          series={[
            { data: hpTestCounts, label: "HP Test Done", color: "#1e88e5" },
            {
              data: nextHpTestCounts,
              label: "HP Test Due",
              color: "#ff9800",
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

export default HpTestDatesChart;
