import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Box, Card, CardHeader } from "@mui/material";
import DashboardCard from "../DashboardCard";

export default function MultiBars({ title, countsByStatus }) {
  // Check if countsByStatus is empty or undefined
  const isEmpty = !countsByStatus || Object.keys(countsByStatus).length === 0;

  // Default values if countsByStatus is empty
  const typeNames = isEmpty ? [] : Object.keys(countsByStatus);
  const notWorkingCounts = isEmpty
    ? []
    : typeNames.map((type) => countsByStatus[type]?.NotWorking || 0);
  const attentionRequiredCounts = isEmpty
    ? []
    : typeNames.map((type) => countsByStatus[type]?.AttentionRequired || 0);
  const healthyCounts = isEmpty
    ? []
    : typeNames.map((type) => countsByStatus[type]?.Healthy || 0);

  return (
    <DashboardCard title={title}>
      {isEmpty ? (
        <Box sx={{ padding: 2, textAlign: "center", color: "#999" }}>
          No data available
        </Box>
      ) : (
        <BarChart
          xAxis={[{ scaleType: "band", data: typeNames }]}
          series={[
            { data: notWorkingCounts, label: "NotWorking" },
            { data: attentionRequiredCounts, label: "AttentionRequired" },
            { data: healthyCounts, label: "Healthy" },
          ]}
          width={500}
          height={300}
        />
      )}
    </DashboardCard>
  );
}
