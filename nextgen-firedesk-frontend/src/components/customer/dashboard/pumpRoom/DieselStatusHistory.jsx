import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import DashboardCard from "../DashboardCard";
import { diesel } from "../../../../api/organization/nqtt";

const DieselStatusHistory = () => {
  const [dieselGraphData, setDieselGraphData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNqttDieselData();
  }, []);

  const fetchNqttDieselData = async () => {
    setLoading(true);
    try {
      const dieselResponse = await diesel();
      setDieselGraphData(dieselResponse.data);
    } catch (error) {
      console.log(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const intervals = dieselGraphData.map((item) => item.interval);
  const minData = dieselGraphData.map((item) => item.min);
  const maxData = dieselGraphData.map((item) => item.max);
  // const meanData = dieselGraphData.map((item) => item.mean);

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
        title="Diesel Status"
        dropDown={true}
        fetchData={fetchNqttDieselData}
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

export default DieselStatusHistory;
