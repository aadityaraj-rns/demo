import { Autocomplete, Box, TextField } from "@mui/material";
import { Columns4 } from "lucide-react";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";
import { DateRangePicker } from "rsuite";
import subDays from "date-fns/subDays";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import addDays from "date-fns/addDays";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import addMonths from "date-fns/addMonths";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  getBuildingsByPlantAndCategory,
  getHydrostaticTestOverview,
} from "../../../../api/organization/internal";

const HydrostaticTestOverview = ({ plantId, categoryId }) => {
  const [data, setData] = useState({});
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState([
    startOfMonth(new Date()),
    endOfMonth(new Date()),
  ]);

  const customizer = useSelector((state) => state.customizer);
  const isDark = customizer.activeMode === "dark";
  const isRtl = customizer.activeDir === "rtl";
  const uniqueVisitorSeries = {
    series: data?.series || [],
    options: {
      chart: {
        height: 360,
        type: "bar",
        fontFamily: "Nunito, sans-serif",
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 2,
        colors: ["transparent"],
      },
      colors: ["#0059ff", "#2de671"],
      dropShadow: {
        enabled: true,
        blur: 3,
        color: "#515365",
        opacity: 0.4,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "35%",
          borderRadius: 8,
          borderRadiusApplication: "end",
        },
      },
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        fontSize: "14px",
        itemMargin: {
          horizontal: 8,
          vertical: 8,
        },
      },
      grid: {
        borderColor: isDark ? "#191e3a" : "#e0e6ed",
        padding: {
          left: 20,
          right: 20,
        },
        xaxis: {
          lines: {
            show: false,
          },
        },
      },
      xaxis: {
        categories: data?.categories || [],
        axisBorder: {
          show: true,
          color: isDark ? "#3b3f5c" : "#e0e6ed",
        },
      },
      yaxis: {
        tickAmount: 6,
        opposite: isRtl ? true : false,
        labels: {
          offsetX: isRtl ? -10 : 0,
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: isDark ? "dark" : "light",
          type: "vertical",
          shadeIntensity: 0.3,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 0.8,
          stops: [0, 100],
        },
      },
      tooltip: {
        theme: isDark ? "dark" : "light",
        style: {
          fontSize: "13px",
          fontFamily: "Nunito, sans-serif",
        },
        marker: {
          show: true,
        },
      },
    },
  };

  const predefinedRanges = [
    { label: "Today", value: [new Date(), new Date()], placement: "left" },
    {
      label: "Yesterday",
      value: [addDays(new Date(), -1), addDays(new Date(), -1)],
      placement: "left",
    },
    {
      label: "This week",
      value: [startOfWeek(new Date()), endOfWeek(new Date())],
      placement: "left",
    },
    {
      label: "Last 7 days",
      value: [subDays(new Date(), 6), new Date()],
      placement: "left",
    },
    {
      label: "Last 30 days",
      value: [subDays(new Date(), 29), new Date()],
      placement: "left",
    },
    {
      label: "This month",
      value: [startOfMonth(new Date()), new Date()],
      placement: "left",
    },
    {
      label: "Last month",
      value: [
        startOfMonth(addMonths(new Date(), -1)),
        endOfMonth(addMonths(new Date(), -1)),
      ],
      placement: "left",
    },
    {
      label: "This year",
      value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
      placement: "left",
    },
    {
      label: "Last year",
      value: [
        new Date(new Date().getFullYear() - 1, 0, 1),
        new Date(new Date().getFullYear(), 0, 0),
      ],
      placement: "left",
    },
  ];
  useEffect(() => {
    const fetchBuildings = async () => {
      const response = await getBuildingsByPlantAndCategory({
        plantId,
        categoryId,
      });
      if (response.status === 200 && response.data.length > 0) {
        setBuildings(response.data);
        setSelectedBuilding(response.data[0]); // sets a string like "building"
      }
    };
    fetchBuildings();
  }, [plantId, categoryId]);
  useEffect(() => {
    const fetchData = async () => {
      if (selectedDateRange && selectedBuilding) {
        const response = await getHydrostaticTestOverview({
          selectedBuilding,
          selectedDateRange,
          plantId,
          categoryId,
        });
        if (response.status == 200) {
          setData(response.data);
        }
      }
    };
    fetchData();
  }, [selectedBuilding, selectedDateRange, plantId, categoryId]);
  return (
    <div
      className={`${
        customizer.activeMode === "light"
          ? "bg-white text-black"
          : "bg-[#262626] text-white"
      } p-6 font-[Figtree] border rounded-2xl`}
    >
      <div className="flex flex-row justify-between items-center border-b mb-4 pb-4 border-[#E3E3E3] gap-4">
        <div className="flex items-center justify-start h-14 gap-2 md:gap-4 ml-1">
          <div className="flex items-center gap-4">
            <div className="text-[#727272] items-center justify-center hidden md:block">
              <Columns4 strokeWidth={1.5} size={40} />
            </div>
          </div>
          <div className="md:border-l-1 lg:border-l-2 border-[#E3E3E3] md:pl-4">
            <p className="text-xs font-medium lg:text-xl text-left">
              Hydrostatic Test Overview
            </p>
            <p className="text-[10px] -mt-5 leading-tight text-[#A2A2A2] md:text-[12px]">
              Track scheduled and completed HP tests with clear status insights.
            </p>
          </div>
        </div>
      </div>
      <Box display="flex" gap={2}>
        <Autocomplete
          size="small"
          options={buildings}
          value={selectedBuilding}
          onChange={(_, newValue) => setSelectedBuilding(newValue)}
          renderInput={(params) => <TextField {...params} label="Building" />}
          sx={{ width: 300 }}
          isOptionEqualToValue={(option, value) => option === value}
        />

        <DateRangePicker
          size="small"
          ranges={predefinedRanges}
          value={selectedDateRange}
          onChange={(range) => setSelectedDateRange(range || [null, null])}
          showOneCalendar
          placeholder="Select Date Range"
          style={{ width: 300 }}
          cleanable
        />
      </Box>

      <ReactApexChart
        options={uniqueVisitorSeries.options}
        series={uniqueVisitorSeries.series}
        type="bar"
        height={360}
        className="overflow-hidden"
      />
    </div>
  );
};
HydrostaticTestOverview.propTypes = {
  plantId: PropTypes.any,
  categoryId: PropTypes.any,
};

export default HydrostaticTestOverview;
