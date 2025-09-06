import Stack from "@mui/material/Stack";
import { LineChart } from "@mui/x-charts/LineChart";

export default function LineChartGraph({ lebel, lastSixMonthData }) {
  const data = lastSixMonthData?.map((data) => data?.count);
  const xData = lastSixMonthData?.map((data) => data?.year + "-" + data?.month);
  return (
    <Stack sx={{ width: "100%" }}>
      <LineChart
        xAxis={[{ data: xData, scaleType: "point" }]}
        series={[{ data, connectNulls: true, label: lebel }]}
        height={200}
        margin={{ top: 10, bottom: 20 }}
      />
    </Stack>
  );
}
