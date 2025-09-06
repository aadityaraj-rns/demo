import { Target } from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";
import {
  getAssetDistributionOverview,
  getBuildingsByPlantAndCategory,
  getCapacitysByPlantAndCategory,
  getProductsByPlantAndCategory,
  getTypesByPlantAndCategory,
} from "../../../../api/organization/internal";
import { Autocomplete, Box, TextField } from "@mui/material";
import { subYears } from "date-fns";

const AssetDistributionOverview = ({ plantId, categoryId }) => {
  const [chartData, setChartData] = useState({ labels: [], data: [] });
  const [buildings, setBuildings] = useState([]);
  const [types, setTypes] = useState([]);
  const [capacitys, setCapacitys] = useState([]);
  const [products, setProducts] = useState([]);
  const conditions = ["NotWorking", "AttentionRequired", "Healthy"];
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState([]);
  const [selectedYearRange, setSelectedYearRange] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCapacity, setSelectedCapacity] = useState(null);

  const yearRanges = [
    { label: "0 - 1 year", start: 0, end: 1 },
    { label: "1 - 2 years", start: 1, end: 2 },
    { label: "2 - 3 years", start: 2, end: 3 },
    { label: "3 - 5 years", start: 3, end: 5 },
    { label: "5+ years", start: 5, end: null }, // null = no upper limit
  ];

  useEffect(() => {
    const fetchBuildings = async () => {
      const response = await getBuildingsByPlantAndCategory({
        plantId,
        categoryId,
      });
      if (response.status === 200 && response.data.length > 0) {
        setBuildings(response.data);
      }
    };
    const fetchProducts = async () => {
      const response = await getProductsByPlantAndCategory({
        plantId,
        categoryId,
      });
      if (response.status === 200 && response.data.length > 0) {
        setProducts(response.data);
      }
    };
    const fetchTypes = async () => {
      const response = await getTypesByPlantAndCategory({
        plantId,
        categoryId,
      });
      if (response.status === 200 && response.data.length > 0) {
        setTypes(response.data);
      }
    };
    const fetchCapacitys = async () => {
      const response = await getCapacitysByPlantAndCategory({
        plantId,
        categoryId,
      });
      if (response.status === 200 && response.data.length > 0) {
        setCapacitys(response.data);
      }
    };
    fetchProducts();
    fetchBuildings();
    fetchTypes();
    fetchCapacitys();
  }, [plantId, categoryId]);

  useEffect(() => {
    const fetchData = async () => {
      const payload = {
        plantId,
        categoryId,
      };

      if (selectedBuilding) {
        payload.building = selectedBuilding._id || selectedBuilding;
      }
      if (selectedType) {
        payload.type = selectedType._id || selectedType;
      }
      if (selectedCapacity) {
        payload.capacity = selectedCapacity._id || selectedCapacity;
      }
      if (selectedProduct) {
        payload.productId = selectedProduct._id || selectedProduct;
      }
      if (selectedCondition) {
        payload.condition = selectedCondition;
      }
      if (selectedDateRange?.[0] && selectedDateRange?.[1]) {
        payload.startDate = selectedDateRange[0];
        payload.endDate = selectedDateRange[1];
      }

      const response = await getAssetDistributionOverview(payload);

      if (response.status === 200) {
        setChartData(response.data);
      }
    };
    fetchData();
  }, [
    plantId,
    categoryId,
    selectedBuilding,
    selectedProduct,
    selectedCondition,
    selectedDateRange,
    selectedType,
    selectedCapacity,
  ]);

  const customizer = useSelector((state) => state.customizer);
  const isDark = customizer.activeMode === "dark";
  const isRtl = customizer.activeDir === "rtl";
  const uniqueVisitorSeries = {
    series: [
      {
        name: "Assets",
        data: chartData.data,
      },
    ],
    options: {
      chart: {
        height: 360,
        type: "bar",
        fontFamily: "Nunito, sans-serif",
        toolbar: { show: false },
      },
      dataLabels: { enabled: false },
      stroke: { width: 2, colors: ["transparent"] },
      colors: ["#0059ff"],
      dropShadow: {
        enabled: true,
        blur: 3,
        color: "#515365",
        opacity: 0.4,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "30%",
          borderRadius: 8,
          borderRadiusApplication: "end",
        },
      },
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        fontSize: "14px",
        itemMargin: { horizontal: 8, vertical: 8 },
      },
      grid: {
        borderColor: isDark ? "#191e3a" : "#e0e6ed",
        padding: { left: 20, right: 20 },
        xaxis: { lines: { show: false } },
      },
      xaxis: {
        categories: chartData.labels, // <-- dynamic labels here
        axisBorder: {
          show: true,
          color: isDark ? "#3b3f5c" : "#e0e6ed",
        },
      },
      yaxis: {
        tickAmount: 6,
        opposite: isRtl,
        labels: { offsetX: isRtl ? -10 : 0 },
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
        style: { fontSize: "13px", fontFamily: "Nunito, sans-serif" },
        marker: { show: true },
      },
    },
  };

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
              <Target strokeWidth={1.5} size={40} />
            </div>
          </div>
          <div className="md:border-l-1 lg:border-l-2 border-[#E3E3E3] md:pl-4">
            <p className="text-xs font-medium lg:text-xl text-left">
              Asset Distribution Overview
            </p>
            <p className="text-[10px] -mt-5 leading-tight text-[#A2A2A2] md:text-[12px]">
              {`Get a clear snapshot of where your assets are located, their types, conditions, and ages — all at a glance.`}
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
        <Autocomplete
          size="small"
          options={products}
          value={selectedProduct}
          onChange={(_, newValue) => setSelectedProduct(newValue)}
          getOptionLabel={(option) => option?.productName || ""}
          renderInput={(params) => <TextField {...params} label="Product" />}
          sx={{ width: 300 }}
          isOptionEqualToValue={(option, value) => option._id === value._id}
        />
        <Autocomplete
          size="small"
          options={types}
          value={selectedType}
          onChange={(_, newValue) => setSelectedType(newValue)}
          renderInput={(params) => <TextField {...params} label="Type" />}
          sx={{ width: 300 }}
          isOptionEqualToValue={(option, value) => option === value}
        />
        <Autocomplete
          size="small"
          options={conditions}
          value={selectedCondition}
          onChange={(_, newValue) => setSelectedCondition(newValue)}
          renderInput={(params) => <TextField {...params} label="Condition" />}
          sx={{ width: 300 }}
          isOptionEqualToValue={(option, value) => option === value}
        />
        <Autocomplete
          size="small"
          options={capacitys}
          value={selectedCapacity}
          onChange={(_, newValue) => setSelectedCapacity(newValue)}
          renderInput={(params) => <TextField {...params} label="Capacity" />}
          sx={{ width: 300 }}
          isOptionEqualToValue={(option, value) => option === value}
        />
        <Autocomplete
          size="small"
          options={yearRanges}
          value={selectedYearRange}
          onChange={(_, newValue) => {
            setSelectedYearRange(newValue);

            if (newValue) {
              const today = new Date();

              let startDate = subYears(today, newValue.end ?? 100); // For "5+ years"
              let endDate = subYears(today, newValue.start);

              // Ensure start date is before end date
              if (startDate > endDate) {
                [startDate, endDate] = [endDate, startDate];
              }

              setSelectedDateRange([startDate, endDate]);
            } else {
              setSelectedDateRange([]);
            }
          }}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField {...params} label="Select Age Range" />
          )}
          sx={{ width: 300 }}
          isOptionEqualToValue={(option, value) => option.label === value.label}
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
AssetDistributionOverview.propTypes = {
  plantId: PropTypes.any,
  categoryId: PropTypes.any,
};
export default AssetDistributionOverview;
