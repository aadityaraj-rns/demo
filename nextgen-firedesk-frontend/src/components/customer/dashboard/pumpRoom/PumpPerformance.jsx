import { useState, useRef, useEffect } from "react";
import {
  Activity,
  Battery,
  ChartArea,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Gauge,
  MoveRight,
  OctagonAlert,
  Play,
  ThermometerSun,
  TriangleAlert,
  Wrench,
} from "lucide-react";
// import { RefreshCw, Dot } from "lucide-react";
import PropTypes from "prop-types";
import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PumpPerformance = ({ assets, pumpIotData, timestamp }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const scrollRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth < 768) {
        setCardsPerView(1); // Mobile: 1 card
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2); // Tablet: 2 cards
      } else {
        setCardsPerView(3); // Desktop: 3 cards
      }
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  const maxIndex = Math.max(0, assets.length - cardsPerView);

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

  // Touch handlers for swipe functionality
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <div className="bg-white p-6 font-[Figtree] border rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between md:hidden mb-3 pl-2">
        <div className="text-[#727272] flex items-center justify-center">
          <Activity strokeWidth={1.5} size={30} />
        </div>
        <div className="flex items-center">
          <p className="text-[10px] leading-tight">
            Last Updated: {new Date(timestamp).toLocaleString()}
          </p>
          {/* <span>
            <Dot />
          </span>
          <span>
            <RefreshCw className="w-3 h-3 stroke-1" />
          </span> */}
        </div>
      </div>
      <div className="flex flex-row justify-between items-center border-b mb-4 pb-4 border-[#E3E3E3] gap-4">
        <div className="flex items-center justify-start h-14 gap-2 md:gap-4 ml-1">
          <div className="flex items-center gap-4">
            <div className="text-[#727272] items-center justify-center hidden md:block">
              <Activity strokeWidth={1.5} size={40} />
            </div>
          </div>
          <div className="md:border-l-1 lg:border-l-2 border-[#E3E3E3] md:pl-4">
            <p className="text-xs font-medium lg:text-xl text-left">
              Pump Performance
            </p>
            <p className="text-[10px] -mt-5 leading-tight text-[#A2A2A2] md:text-[12px]">
              {`Monitor each pump's live condition, operational mode, and key
              maintenance insights at a glance.`}
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

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mt-6 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Showing {currentIndex + 1} -{" "}
            {Math.min(currentIndex + cardsPerView, assets.length)} of{" "}
            {assets.length} pumps
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`p-2 rounded-lg border transition-all duration-200 ${
              currentIndex === 0
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-500 px-2">
            {currentIndex + 1} / {maxIndex + 1}
          </span>
          <button
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className={`p-2 rounded-lg border transition-all duration-200 ${
              currentIndex >= maxIndex
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pump Cards Slider */}
      <div
        className="relative overflow-hidden mt-3"
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
          {assets.map((asset, index) => {
            const iotNumber =
              asset.productId.productName.toString().toUpperCase() ==
              "ELECTRICAL DRIVEN PUMP"
                ? 2
                : asset.productId.productName.toString().toUpperCase() ==
                  "JOCKEY PUMP"
                ? 1
                : asset.productId.productName.toString().toUpperCase() ==
                  "DIESEL ENGINE"
                ? 3
                : 1;
            let AS = "AS1";
            let TS = "TS1";
            let PS = "PS1";
            if (iotNumber == 2) {
              AS = "AS2";
              TS = "TS2";
              PS = "PS2";
            } else if (iotNumber == 3) {
              AS = "AS3";
              TS = "TS3";
              PS = "PS3";
            }
            const isDieselEngine =
              asset.productId.productName.toString().toUpperCase() ===
              "DIESEL ENGINE";
            const needAttention =
              pumpIotData[PS] == 1 ||
              pumpIotData[AS] == 0 ||
              pumpIotData[TS] == 0 ||
              (isDieselEngine &&
                (pumpIotData?.WTP == 0 ||
                  pumpIotData?.OPR == 0 ||
                  pumpIotData?.BCH == 0));
            const tooltipContent = (
              <div className="flex flex-col gap-1 text-sm">
                <p
                  className={
                    pumpIotData[PS] == 1 ? "text-red-500" : "text-gray-500"
                  }
                >
                  Condition:{" "}
                  {pumpIotData[PS] == 1
                    ? "ON"
                    : pumpIotData[PS] == 0
                    ? "OFF"
                    : "-"}
                </p>

                <p
                  className={
                    pumpIotData[AS] == 1 ? "text-gray-500" : "text-red-500"
                  }
                >
                  Status:{" "}
                  {pumpIotData[AS] == 1
                    ? "Auto"
                    : pumpIotData[AS] == 0
                    ? "Manual"
                    : "-"}
                </p>

                {!isDieselEngine && (
                  <p
                    className={
                      pumpIotData[TS] == 1 ? "text-gray-500" : "text-red-500"
                    }
                  >
                    Trip Status:{" "}
                    {pumpIotData[TS] == 1
                      ? "Auto"
                      : pumpIotData[TS] == 0
                      ? "Manual"
                      : "-"}
                  </p>
                )}

                {isDieselEngine && (
                  <>
                    <p
                      className={
                        pumpIotData?.BCH == 1 ? "text-gray-500" : "text-red-500"
                      }
                    >
                      Battery Charging:{" "}
                      {pumpIotData?.BCH == 1
                        ? "Normal"
                        : pumpIotData?.BCH == 0
                        ? "Fault"
                        : "-"}
                    </p>
                    <p
                      className={
                        pumpIotData?.WTP == 1 ? "text-gray-500" : "text-red-500"
                      }
                    >
                      Water Temp:{" "}
                      {pumpIotData?.WTP == 1
                        ? "Normal"
                        : pumpIotData?.WTP == 0
                        ? "Fault"
                        : "-"}
                    </p>
                    <p
                      className={
                        pumpIotData?.OPR == 1 ? "text-gray-500" : "text-red-500"
                      }
                    >
                      Eng. Oil Pressure:{" "}
                      {pumpIotData?.OPR == 1
                        ? "Normal"
                        : pumpIotData?.OPR == 0
                        ? "Fault"
                        : "-"}
                    </p>
                  </>
                )}
              </div>
            );
            return (
              <div
                key={index}
                className="flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-200 p-2.5 flex flex-col"
                style={{
                  width:
                    cardsPerView === 1
                      ? "calc(100% - 21px)"
                      : cardsPerView === 2
                      ? "calc(50% - 21px)"
                      : "calc(33.333% - 21px)",
                }}
              >
                <div className="flex items-start gap-2 md:gap-3 mb-4 md:mb-6 border-b-1 pb-4 border-[#E3E3E3]">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <img
                      src={
                        asset?.productId?.variants.find(
                          (p) => p?.type == asset?.type
                        )?.image
                      }
                      alt=""
                      className="w-8 h-8"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="mb-1 text-sm font-semibold">
                      {asset?.productId?.productName}
                    </p>
                    <div className="flex items-center gap-1 md:gap-2 text-sm text-[#727272]">
                      <span className="truncate pr-1">{asset?.assetId}</span>
                      <span className="truncate border-l-1 border-[#E3E3E3] pl-1">
                        {asset?.building?.toUpperCase()}-
                        {asset?.location?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Health Status</span>
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-5 ${
                        needAttention ? "bg-[#FFEBEB]" : "bg-[#ECFDF5]"
                      }`}
                    >
                      {!needAttention && (
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#047857]" />
                      )}
                      {needAttention && (
                        <Tooltip
                          title={tooltipContent}
                          arrow
                          enterTouchDelay={0}
                          componentsProps={{
                            tooltip: {
                              sx: {
                                bgcolor: "white",
                                color: "black",
                                boxShadow: 2,
                                fontSize: 13,
                                borderRadius: 1,
                                maxWidth: 300,
                              },
                              // For the arrow color
                              arrow: {
                                color: "white",
                              },
                            },
                          }}
                        >
                          <div className="cursor-pointer">
                            <TriangleAlert className="w-4 h-4 md:w-5 md:h-5 text-[#B91C1C]" />
                          </div>
                        </Tooltip>
                      )}
                      <span
                        className={`text-[10px] md:text-sm font-medium ${
                          needAttention ? "text-[#B91C1C]" : "text-[#047857]"
                        }`}
                      >
                        {needAttention ? "Needs Attention" : "Healthy"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Conditions</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-sm font-medium ${
                          pumpIotData[PS] == 1
                            ? "bg-[#B45309] text-white"
                            : pumpIotData[PS] == 0
                            ? "bg-[#047857] text-white"
                            : "bg-gray-100 text-black"
                        }`}
                      >
                        {pumpIotData[PS] == 1
                          ? "ON"
                          : pumpIotData[PS] == 0
                          ? "OFF"
                          : "-"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b-1 border-[#E3E3E3] pb-4">
                    <span className="text-sm font-semibold">Mode</span>
                    <div className="flex items-center gap-1 bg-[#F9F9F9] p-1 rounded-5">
                      {pumpIotData[AS] == 1 ? (
                        <Play className="h-4 w-4" strokeWidth={1.5} />
                      ) : pumpIotData[AS] == 0 ? (
                        <Wrench className="h-4 w-4" strokeWidth={1.5} />
                      ) : (
                        "-"
                      )}
                      <span
                        className={`text-xs md:text-sm text-black${
                          pumpIotData[AS] == 1 ? "" : ""
                        }`}
                      >
                        {pumpIotData[AS] == 1
                          ? "Auto"
                          : pumpIotData[AS] == 0
                          ? "Manual"
                          : "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Fixed height  */}
                <div className="mb-4 md:mb-6 flex-1">
                  <div className="space-y-2 md:space-y-3 min-h-[100px] md:min-h-[100px]">
                    {!isDieselEngine ? (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span>
                              <ChartArea className="w-5 h-5 text-[#727272]" />
                            </span>
                            <span className="text-sm text-[#727272]">
                              Trip Condition
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs md:text-sm font-medium ${
                                pumpIotData[TS] == 1
                                  ? "text-black"
                                  : "text-[#B91C1C]"
                              }`}
                            >
                              {pumpIotData[TS] == 1
                                ? "Normal"
                                : pumpIotData[TS] == 0
                                ? "Fault"
                                : "-"}
                            </span>
                            <span>
                              {pumpIotData?.[TS] == 0 ? (
                                <OctagonAlert
                                  className="w-5 h-5 text-[#B91C1C]"
                                  strokeWidth={1.5}
                                />
                              ) : (
                                ""
                              )}
                            </span>
                          </div>
                        </div>
                        {/* Empty placeholders to maintain consistent height */}
                        <div className="h-[6px] md:h-[6px]"></div>
                        <div className="h-[6px] md:h-[6px]"></div>
                        <div className="h-[6px] md:h-[6px]"></div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span>
                              <Battery className="w-5 h-5 text-[#727272]" />
                            </span>
                            <span className="text-sm text-[#727272]">
                              Battery Charger
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs md:text-sm font-medium ${
                                pumpIotData?.BCH == 1
                                  ? "text-black"
                                  : "text-[#B91C1C]"
                              }`}
                            >
                              {pumpIotData?.BCH == 1
                                ? "Normal"
                                : pumpIotData?.BCH == 0
                                ? "Fault"
                                : "-"}
                            </span>
                            <span>
                              {pumpIotData?.BCH == 0 ? (
                                <OctagonAlert
                                  className="w-5 h-5 text-[#B91C1C]"
                                  strokeWidth={1.5}
                                />
                              ) : (
                                ""
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span>
                              <ThermometerSun className="w-5 h-5 text-[#727272]" />
                            </span>
                            <span className="text-sm text-[#727272]">
                              Water Temperature
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs md:text-sm font-medium ${
                                pumpIotData?.WTP == 1
                                  ? "text-black"
                                  : "text-[#B91C1C]"
                              }`}
                            >
                              {pumpIotData?.WTP == 1
                                ? "Normal"
                                : pumpIotData?.WTP == 0
                                ? "Fault"
                                : "-"}
                            </span>
                            <span>
                              {pumpIotData?.WTP == 0 ? (
                                <OctagonAlert
                                  className="w-5 h-5 text-[#B91C1C]"
                                  strokeWidth={1.5}
                                />
                              ) : (
                                ""
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span>
                              <Gauge className="w-5 h-5 text-[#727272]" />
                            </span>
                            <span className="text-sm text-[#727272]">
                              Oil Pressure
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs md:text-sm font-medium ${
                                pumpIotData?.OPR == 1
                                  ? "text-black"
                                  : "text-[#B91C1C]"
                              }`}
                            >
                              {pumpIotData?.OPR == 1
                                ? "Normal"
                                : pumpIotData?.OPR == 0
                                ? "Fault"
                                : "-"}
                            </span>
                            <span>
                              {pumpIotData?.OPR == 0 ? (
                                <OctagonAlert
                                  className="w-5 h-5 text-[#B91C1C]"
                                  strokeWidth={1.5}
                                />
                              ) : (
                                ""
                              )}
                            </span>
                          </div>
                        </div>
                        {/* Empty placeholder to maintain consistent height with non-diesel pumps */}
                        <div className="h-[15px] md:h-[15px]"></div>
                      </>
                    )}
                  </div>
                </div>

                {/* Know More Section - now always at the bottom */}
                <div className="flex justify-center pt-3 md:pt-4 border-t border-gray-100 mt-auto">
                  <button
                    onClick={() =>
                      navigate(`/customer/pump-product-details/${asset._id}`, {
                        state: { assets, pumpIotData, timestamp },
                      })
                    }
                    className="flex items-center justify-center bg-[#FF6B2C] gap-1 w-8 h-8 px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm font-medium text-black border border-gray-300 rounded-5 hover:scale-120 hover:duration-300"
                  >
                    <MoveRight className="w-4 text-white hover:scale-150 hover:duration-300" />
                  </button>
                </div>
              </div>
            );
          })}
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

PumpPerformance.propTypes = {
  timestamp: PropTypes.any,
  assets: PropTypes.array,
  pumpIotData: PropTypes.object,
  datas: PropTypes.array,
};

export default PumpPerformance;
