import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import DashboardCard from "../DashboardCard";
import { water } from "../../../../api/organization/nqtt";

const WaterStatusHistory = () => {
  const [waterGraphData, setWaterGraphData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNqttWaterData();
  }, []);

  const fetchNqttWaterData = async () => {
    setLoading(true);
    try {
      const waterResponse = await water();
      setWaterGraphData(waterResponse.data);
    } catch (error) {
      console.log(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const intervals = waterGraphData.map((item) => item.interval);
  const minData = waterGraphData.map((item) => item.min);
  const maxData = waterGraphData.map((item) => item.max);
  // const meanData = waterGraphData.map((ite7m) => item.mean);

  const chartConfig = {
    series: [
      {
        name: "Max",
        data: maxData,
      },
      // {
      //   name: "Mean",
      //   data: meanData,
      // },
      {
        name: "Min",
        data: minData,
      },
    ],
    options: {
      chart: {
        height: 325,
        type: "area",
        zoom: { enabled: false },
        toolbar: { show: false },
      },
      dataLabels: { enabled: false },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      colors: ["#00C49F", "#FF8042", "#8884d8"],
      xaxis: {
        categories: intervals,
        title: { text: "Date" },
        labels: {
          style: {
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        title: { text: "Value" },
        labels: {
          formatter: (value) => `${Math.round(value)}L`,
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.05,
          stops: [0, 90, 100],
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
      },
      grid: {
        borderColor: "#E0E6ED",
        strokeDashArray: 5,
      },
    },
  };

  return (
    <>
      <DashboardCard
        title="Water Status"
        dropDown={true}
        fetchData={fetchNqttWaterData}
      >
        {loading ? (
          <Skeleton variant="rectangular" height={325} animation="wave" />
        ) : (
          <ReactApexChart
            series={chartConfig.series}
            options={chartConfig.options}
            type="area"
            height={325}
          />
        )}
      </DashboardCard>
    </>
  );
};

export default WaterStatusHistory;
