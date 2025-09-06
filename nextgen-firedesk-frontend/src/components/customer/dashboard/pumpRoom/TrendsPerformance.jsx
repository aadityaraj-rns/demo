import { useState, useRef, useEffect } from "react";
import {
  Droplets,
  Fuel,
  Gauge,
  ChartNoAxesCombined,
  RefreshCw,
  Dot,
} from "lucide-react";
import PropTypes from "prop-types";
import {
  getDieselLevelTrend,
  getHeaderPressureTrend,
  getWaterLevelTrend,
} from "../../../../api/organization/internal";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import TrendCard from "./TendCard";

const TrendsPerformance = ({
  timestamp,
  plantId,
  categoryId,
  lastWaterLevel,
  lastDieselLevel,
  lastHeaderPressureLevel,
}) => {
  const [activeTab, setActiveTab] = useState({
    waterLevel: "Day",
    dieselLevel: "Day",
    headerPressure: "Day",
  });
  const [headerPressureTrend, setHeaderPressureTrend] = useState({});
  const [dieselLevelTrend, setDieselLevelTrend] = useState({});
  const [waterLevelTrend, setWaterLevelTrend] = useState({});

  // Slider state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const touchStart = useRef(0);
  const touchEnd = useRef(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth < 768) {
        setCardsPerView(1); // Mobile: 1 card
      } else if (window.innerWidth < 1024) {
        setCardsPerView(1); // Tablet: 2 cards
      } else {
        setCardsPerView(1); // Desktop: 3 cards
      }
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  useEffect(() => {
    callWaterLevelTrendApi();
  }, [activeTab.waterLevel , plantId, categoryId]);

  useEffect(() => {
    callDeiselLevelTrendApi();
  }, [activeTab.dieselLevel, plantId, categoryId]);

  useEffect(() => {
    callHeaderPresureTrendApi();
  }, [activeTab.headerPressure, plantId, categoryId]);

  useEffect(() => {
    callWaterLevelTrendApi();
    callDeiselLevelTrendApi();
    callHeaderPresureTrendApi();
  },[plantId, categoryId])

  const callWaterLevelTrendApi  = async () => {
const data = {
        plantId,
        categoryId,
        timeframe: activeTab.waterLevel,
      };
      const response = await getWaterLevelTrend(data);
      setWaterLevelTrend(response.data);
  }

  const callDeiselLevelTrendApi  = async () => {
    const data = {
        plantId,
        categoryId,
        timeframe: activeTab.dieselLevel,
      };
      const response = await getDieselLevelTrend(data);
      setDieselLevelTrend(response.data);
  } 

  const callHeaderPresureTrendApi  = async () => {
const data = {
        plantId,
        categoryId,
        timeframe: activeTab.headerPressure,
      };
      const response = await getHeaderPressureTrend(data);
      setHeaderPressureTrend(response.data);
  }

  const maxIndex = Math.max(0, 3 - cardsPerView);

  const handleTabChange = (trendType, tab) => {
    setActiveTab((prev) => ({
      ...prev,
      [trendType]: tab,
    }));
  };

  // const TrendCard = ({
  //   title,
  //   icon: Icon,
  //   iconImage,
  //   avgValue,
  //   trend,
  //   trendType,
  //   lastRecorded,
  // }) => {
  //   const chartData = trend?.map((item) => ({
  //     time: new Date(item.date).toLocaleTimeString([], {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     }),
  //     value: Number(item.data),
  //   }));
  //   return (
  //     <div className="bg-white rounded-xl border border-gray-200 p-2.5 font-[Figtree] shadow-sm">
  //       {/* Header */}
  //       <div className="flex items-center gap-3 mb-3 border-b-1 border-[#E3E3E3] pb-3">
  //         <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
  //           {iconImage ? (
  //             <img
  //               src={iconImage}
  //               alt={`${title} icon`}
  //               className="w-8 h-8 object-contain"
  //             />
  //           ) : (
  //             <Icon className="w-7 h-7 text-gray-600" />
  //           )}
  //         </div>
  //         <div>
  //           <p className="mb-1 text-sm font-semibold">{title}</p>
  //         </div>
  //       </div>

  //       {/* Average Value */}
  //       <div className="mb-4">
  //         <div className="text-sm text-[#727272] mb-1">
  //           Avg this week:{" "}
  //           <span className="text-base text-black"> {avgValue} </span>
  //         </div>
  //       </div>

  //       {/* Tabs */}
  //       <div className="flex gap-2 mb-4">
  //         {["Day", "Week", "Last 30 Days"].map((tab) => (
  //           <button
  //             key={tab}
  //             onClick={() => handleTabChange(trendType, tab)}
  //             className={`px-2 py-1 md:px-3 md:py-1 text-sm font-medium rounded-4 md:rounded-5 transition-colors ${
  //               activeTab[trendType] === tab
  //                 ? "bg-[#FF6B2C] text-white"
  //                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
  //             }`}
  //           >
  //             {tab}
  //           </button>
  //         ))}
  //       </div>

  //       {/* Chart */}
  //       <div className="h-[220px] w-full">
  //         <div className="h-[220px] w-full">
  //           <ResponsiveContainer width="100%" height="100%">
  //             <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
  //               <CartesianGrid vertical={false} />
  //               <XAxis
  //                 dataKey="time"
  //                 tickLine={false}
  //                 axisLine={false}
  //                 tickMargin={8}
  //               />
  //               <YAxis
  //                 tickLine={false}
  //                 axisLine={false}
  //                 tickMargin={8}
  //                 allowDecimals={false}
  //               />
  //               <Tooltip
  //                 contentStyle={{
  //                   borderRadius: "8px",
  //                   background: "white",
  //                   border: "1px solid #ddd",
  //                   fontSize: "12px",
  //                 }}
  //                 labelStyle={{ fontWeight: 500, color: "#444" }}
  //               />
  //               <Area
  //                 dataKey="value"
  //                 type="monotone"
  //                 stroke="#3B82F6"
  //                 fill="#3B82F6"
  //                 fillOpacity={0.3}
  //               />
  //             </AreaChart>
  //           </ResponsiveContainer>
  //         </div>
  //       </div>

  //       {/* Last Recorded */}
  //       <div className="text-xs text-gray-500 md:mt-4">
  //         Last recorded:{" "}
  //         <span className="font-medium text-gray-700">{lastRecorded}</span>
  //       </div>
  //     </div>
  //   );
  // };
  // TrendCard.propTypes = {
  //   title: PropTypes.any,
  //   icon: PropTypes.any,
  //   iconImage: PropTypes.any,
  //   avgValue: PropTypes.any,
  //   trend: PropTypes.any,
  //   trendType: PropTypes.any,
  //   chartColor: PropTypes.any,
  //   gradientId: PropTypes.any,
  //   minLine: PropTypes.any,
  //   lastRecorded: PropTypes.any,
  //   chartType: PropTypes.any,
  // };

  const scrollToIndex = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    const newIndex = Math.min(currentIndex + 1, maxIndex);
    scrollToIndex(newIndex);
  };

  const prevSlide = () => {
    const newIndex = Math.max(currentIndex - 1, 0);
    scrollToIndex(newIndex);
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    touchStart.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;

    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    // Reset values
    touchStart.current = 0;
    touchEnd.current = 0;
  };

  return (
    <div className="bg-white p-6 font-[Figtree] border rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between md:hidden mb-3 pl-2">
        <div className="text-[#727272] flex items-center justify-center">
          <ChartNoAxesCombined strokeWidth={1.5} size={30} />
        </div>
        <div className="flex items-center">
          <p className="text-[10px] leading-tight">
            Last Updated: {new Date(timestamp).toLocaleString()}
          </p>
          <span>
            <Dot />
          </span>
          <span>
            <RefreshCw className="w-3 h-3 stroke-1" />
          </span>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center border-b mb-4 pb-4 border-[#E3E3E3] gap-4">
        <div className="flex items-center justify-start h-14 gap-2 md:gap-4 ml-1">
          <div className="flex items-center gap-4">
            <div className="text-[#727272] items-center justify-center hidden md:block">
              <ChartNoAxesCombined strokeWidth={1.5} size={40} />
            </div>
          </div>
          <div className="md:border-l-1 lg:border-l-2 border-[#E3E3E3] md:pl-4">
            <p className="text-xs font-medium lg:text-xl text-left">
              Trends & Performance
            </p>
            <p className="text-[10px] -mt-5 leading-tight text-[#A2A2A2] md:text-[12px]">
              Get real-time and historical insights into fluid levels and system
              pressure.
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <p className="text-[12px] leading-tight hidden md:block">
            Last Updated: {new Date(timestamp).toLocaleString()}
          </p>
          {/* <Dot className="hidden md:block" />
          <span>
            <RefreshCw className="w-4 h-4 lg:w-5 lg:h-5 stroke-1 hidden md:block" />
          </span> */}
        </div>
      </div>

      {/* Cards Slider */}
      <div
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
          }}
        >
          <div
            key={8}
            className="flex-shrink-0"
            style={{
              width:
                cardsPerView === 1
                  ? "calc(100% - 21px)"
                  : cardsPerView === 2
                  ? "calc(50% - 21px)"
                  : "calc(100% - 21px)",
            }}
          >
            <TrendCard
              yLable="Water Level"
              title={"Water Level Trend"}
              icon={Droplets}
              iconImage={"/waterleveltrend.png"}
              avgValue={
                waterLevelTrend?.avgWLS != null
                  ? `${waterLevelTrend.avgWLS} Liters`
                  : "--"
              }
              trend={waterLevelTrend?.WLSHistory}
              trendType={"waterLevel"}
              chartColor={"red"}
              gradientId={1}
              minLine={1}
              lastRecorded={`${lastWaterLevel} Liters`}
              chartType={"trend.chartType"}
              activeTab={activeTab}
              handleTabChange={(trendType,tab) => handleTabChange(trendType,tab)}
            />
          </div>

          <div
            key={7}
            className="flex-shrink-0"
            style={{
              width:
                cardsPerView === 1
                  ? "calc(100% - 21px)"
                  : cardsPerView === 2
                  ? "calc(50% - 21px)"
                  : "calc(100% - 21px)",
            }}
          >
            <TrendCard
              yLable="Diesel Level"
              title={"Diesel Level Trends"}
              icon={Fuel}
              iconImage={"/dieselleveltrends.png"}
              avgValue={
                dieselLevelTrend?.avgDLS
                  ? `${dieselLevelTrend?.avgDLS} Liters`
                  : "--"
              }
              trend={dieselLevelTrend?.DLSHistory}
              lastRecorded={`${lastDieselLevel} Liters`}
              trendType={"dieselLevel"}
              chartColor={"red"}
              gradientId={1}
              minLine={1}
              chartType={"trend.chartType"}
              activeTab={activeTab}
              handleTabChange={(trendType,tab) => handleTabChange(trendType,tab)}
            />
          </div>
          <div
            key={9}
            className="flex-shrink-0"
            style={{
              width:
                cardsPerView === 1
                  ? "calc(100% - 21px)"
                  : cardsPerView === 2
                  ? "calc(50% - 21px)"
                  : "calc(100% - 21px)",
            }}
          >
            <TrendCard
              yLable="Header Pressure"
              title={"Header Pressure Trends"}
              icon={Gauge}
              iconImage={"/headerpressuretrends.png"}
              avgValue={
                headerPressureTrend?.avgPLS
                  ? headerPressureTrend?.avgPLS +
                    " " +
                    headerPressureTrend?.headerPressureUnit
                  : "--"
              }
              lastRecorded={lastHeaderPressureLevel}
              trend={headerPressureTrend?.PLSHistory}
              trendType={"headerPressure"}
              chartColor={"blue"}
              gradientId={1}
              minLine={1}
              chartType={"trend.chartType"}
              activeTab={activeTab}
              handleTabChange={(trendType,tab) => handleTabChange(trendType,tab)}
            />
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: maxIndex + 1 }, (_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`w-2 h-2 rounded transition-all duration-200 ${
              index === currentIndex
                ? "bg-[#FD9134] w-6"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
TrendsPerformance.propTypes = {
  timestamp: PropTypes.any,
  plantId: PropTypes.any,
  categoryId: PropTypes.any,
  lastWaterLevel: PropTypes.any,
  lastDieselLevel: PropTypes.any,
  lastHeaderPressureLevel: PropTypes.any,
};

export default TrendsPerformance;
