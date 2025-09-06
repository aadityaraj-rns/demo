import { BarChart } from "@mui/x-charts/BarChart";
import DashboardCard from "../DashboardCard";

export default function BasicBars({ title, counts = {} }) {
  const plantNames = Object?.keys(counts || {});
  const plantCounts = Object?.values(counts || {});

  return (
    <DashboardCard title={title}>
      <BarChart
        barLabel="value"
        xAxis={[
          {
            scaleType: "band",
            data: plantNames,
          },
        ]}
        series={[
          {
            data: plantCounts,
            label: "Assets Count",
          },
        ]}
        width={500}
        height={300}
      />
    </DashboardCard>
  );
}
