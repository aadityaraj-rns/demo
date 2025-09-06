import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { getRefillDates } from "../../../../api/organization/internal";
import { Box } from "@mui/material";
import DashboardCard from "../DashboardCard";

const RefillDatesChart = ({ plantId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getRefillDates(plantId);
      if (response.status === 200) {
        setData(response.data);
      }
    };
    fetchData();
  }, [plantId]);

  // Process data for the chart
  const months = data.map((item) => item.month); // X-axis: months
  const refilledOnCounts = data.map((item) => item.refilledOnCount); // Y-axis: Refilled On Count

  return (
    <DashboardCard title="Fire Extinguisher Refill & HP Test Dates">
      <Box display="flex" justifyContent="center">
        <BarChart
          width={700}
          height={400}
          series={[
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

export default RefillDatesChart;
