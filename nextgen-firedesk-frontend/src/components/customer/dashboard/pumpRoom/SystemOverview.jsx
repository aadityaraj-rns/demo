import { useState, useEffect } from "react";
import {
  OctagonAlert,
  SquareKanban,
  MonitorDot,
  NotebookText,
  // Dot,
  // RefreshCw,
} from "lucide-react";
import PropTypes from "prop-types";
import { getPumpSystamOverview } from "../../../../api/organization/internal";
import { useSelector } from "react-redux";

const SystemOverview = ({ plantId, categoryId, timestamp }) => {
  const customizer = useSelector((state) => state.customizer);
  let dark = customizer.activeMode;

  useEffect(() => {
    const html = document.documentElement;
    if (dark === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [dark]);

  const [activeTab, setActiveTab] = useState("Day");
  const [systemOverViewData, setSystemOverViewData] = useState({});

  const colorMap = {
    Healthy: "#14B8A6",
    AttentionRequired: "#B91C1C",
    Critical: "#F97316",
    Unknown: "#9CA3AF",
  };

  const DonutChart = () => {
    const data = systemOverViewData?.healthStatusCounts || [];
    const total = data?.reduce((sum, item) => sum + item.count, 0);

    const [hoveredSegment, setHoveredSegment] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const radius = 90; // Increased from 70
    const strokeWidth = 20; // Increased from 20
    const circumference = 2 * Math.PI * radius;
    const paddingAngle = 20;

    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    if (total === 0) {
      return (
        <div className="relative w-full h-80">
          <svg className="h-60" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r={radius}
              strokeWidth={strokeWidth}
              fill="none"
              className="text-gray-200 stroke-current"
            />
          </svg>
          {/* <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-base text-gray-600 mb-2">Overall health</div>
            <div className="text-3xl font-bold text-gray-400">0%</div>
          </div> */}
        </div>
      );
    }

    // Prepare dynamic arcs
    let accumulatedAngle = 0;

    const segments = data?.map((item, index) => {
      const percentage = item.count / total;
      const arcAngle = percentage * (360 - paddingAngle * data?.length);
      const arcLength = (arcAngle / 360) * circumference;
      const dashOffset =
        -((accumulatedAngle + index * paddingAngle) / 360) * circumference;
      accumulatedAngle += arcAngle;

      const color = colorMap[item.healthStatus] || "#6B7280"; // fallback gray

      return {
        ...item,
        arcLength,
        dashOffset,
        color,
        percentage: percentage * 100,
      };
    });

    const primary =
      segments?.find((s) => s.healthStatus === "Healthy") || segments[0];
    const centerPercentage = ((primary.count / total) * 100).toFixed(0);

    return (
      <div className="flex flex-col lg:flex-row items-center justify-start gap-6">
        {/* Donut Chart */}
        <div className="relative w-60 h-60">
          {" "}
          {/* Increased from w-60 h-60 */}
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 200 200"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            {/* Dynamic segments */}
            {segments?.map((segment) => (
              <circle
                key={segment.healthStatus}
                cx="100"
                cy="100"
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${segment.arcLength} ${circumference}`}
                strokeDashoffset={segment.dashOffset}
                strokeLinecap="round"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                style={{ color: segment.color }}
                onMouseEnter={() => setHoveredSegment(segment)}
              />
            ))}
          </svg>
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div
              className={`${
                dark === "dark" ? "text-white" : "text-[#737373]"
              } text-lg mb-2`}
            >
              Overall health
            </div>
            <div className="text-5xl font-semibold text-[#14B8A6]">
              {" "}
              {/* Increased from text-4xl */}
              {centerPercentage}%
            </div>
          </div>
          {/* Tooltip */}
          {hoveredSegment && (
            <div
              className={` ${
                dark === "dark" ? "bg-black text-white" : "bg-white text-black"
              } absolute z-50 text-sm rounded-lg px-3 py-2 shadow-lg pointer-events-none whitespace-nowrap`}
              style={{
                left: mousePosition.x + 10,
                top: mousePosition.y - 50,
              }}
            >
              <div
                className="font-semibold"
                style={{ color: hoveredSegment.color }}
              >
                {hoveredSegment.healthStatus}
              </div>
              <div>Count: {hoveredSegment.count}</div>
              <div>Percentage: {hoveredSegment.percentage.toFixed(1)}%</div>
            </div>
          )}
        </div>

        {/* Legend on the Right */}
        <div className="flex flex-col gap-3">
          {segments?.map((segment) => (
            <div key={segment.healthStatus} className="flex items-center gap-1">
              <div
                className="w-6 h-2.5 rounded-full" /* Increased size */
                style={{ backgroundColor: segment.color }}
              ></div>
              <span
                className={` ${
                  dark === "dark" ? "text-white" : "text-[#727272]"
                } text-sm whitespace-nowrap`}
              >
                {segment.healthStatus == "Healthy"
                  ? "Healthy Assets"
                  : "Need Attention"}
              </span>
              <span className="text-sm">({segment.count})</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  DonutChart.propTypes = {
    percentage: PropTypes.any,
    healthy: PropTypes.any,
    needAttention: PropTypes.any,
  };
  const ProgressBar = ({ segments = [], total = 0, colorMap = {} }) => {
    if (total === 0) {
      return (
        <div className="space-y-2">
          <div className="w-full h-2 bg-gray-200 rounded-full" />
          <div
            className={`text-sm ${
              dark === "dark" ? "text-white" : "text-[#727272]"
            }`}
          >
            No data available
          </div>
        </div>
      );
    }

    const defaultColor = "#9CA3AF"; // fallback color (gray)
    const used = segments.reduce((sum, s) => sum + s.count, 0);
    const remaining = total - used;

    return (
      <div className="w-full space-y-4">
        {/* Progress Bar */}
        <div className="w-full h-2 flex gap-1 items-center">
          {segments.map((segment) => {
            const label = segment.completedStatus || segment.importance;
            const color = colorMap[label] || defaultColor;

            return (
              <div
                key={label}
                className="h-full rounded-full transition-all duration-500 ease-in-out"
                style={{
                  flexGrow: segment.count,
                  backgroundColor: color,
                }}
              />
            );
          })}
          {remaining > 0 && (
            <div
              className="bg-gray-200 h-full rounded-full transition-all duration-500 ease-in-out"
              style={{ flexGrow: remaining }}
            />
          )}
        </div>

        {/* Legend with Labels */}
        <div className="flex text-sm flex-wrap gap-2">
          {segments.map((segment) => {
            const label = segment.completedStatus || segment.importance;
            const color = colorMap[label] || defaultColor;

            return (
              <div
                key={label}
                className="flex items-center justify-start gap-1.5 mr-3"
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: color }}
                ></div>
                <span
                  className={`${
                    dark === "dark" ? "text-white" : "text-[#727272]"
                  }`}
                >
                  {label}
                </span>
                <span
                  className={`${
                    dark === "dark" ? "text-white" : "text-black"
                  } font-medium text-xs`}
                >
                  ({segment.count})
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  ProgressBar.propTypes = {
    colorMap: PropTypes.any,
    segments: PropTypes.any,
    total: PropTypes.any,
  };
  const tabs = ["Day", "Week", "Month"];

  useEffect(() => {
    const data = {
      interval: activeTab,
      plantId,
      categoryId,
    };
    const fetchData = async () => {
      const res = await getPumpSystamOverview(data);
      setSystemOverViewData(res.data);
      // console.log("res", res.data);
    };

    fetchData();
  }, [activeTab, plantId, categoryId]);
  return (
    <div
      className={`h-full p-3 font-[Figtree] border rounded-2xl ${
        dark === "dark" ? "bg-[#262626] text-white" : "bg-white text-black"
      }`}
    >
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between md:hidden mb-3 pl-2">
          <div className="text-[#727272] flex items-center justify-center">
            <SquareKanban strokeWidth={1.5} size={30} />
          </div>
          {/* <div className="flex items-center">
            <p className="text-[10px] leading-tight">
              Last Updated: {new Date(timestamp).toLocaleString()}
            </p>
            <span>
              <Dot />
            </span>
            <span>
              <RefreshCw className="w-3 h-3 stroke-1" />
            </span>
          </div> */}
        </div>
        <div className="flex flex-row justify-between items-center border-b mb-1 pb-4 border-[#E3E3E3] gap-4">
          <div className="flex items-center justify-start h-14 gap-2 md:gap-4 ml-1">
            <div className="flex items-center gap-4">
              <div className="text-[#727272] items-center justify-center hidden md:block">
                <SquareKanban strokeWidth={1.5} size={40} />
              </div>
            </div>
            <div className="md:border-l-1 lg:border-l-2 border-[#E3E3E3] md:pl-4">
              <p className="text-xs font-medium lg:text-xl text-left">
                System Overview
              </p>
              <p className="text-[10px] -mt-5 leading-tight text-[#A2A2A2] md:text-[12px]">
                Fix issues and take action on alerts to keep your operations
                running at peak performance.
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

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 pt-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1 rounded-5 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-[#FF6B2C] text-white"
                  : "bg-white text-black hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* System Overall Health */}
          <div
            className={`${
              dark === "dark"
                ? "bg-[#262626] text-white"
                : "bg-white text-black"
            } rounded-lg border border-gray-200 p-3.5`}
          >
            <div className="flex items-center gap-2 mb-4">
              <MonitorDot strokeWidth={1.5} className="w-6 h-6" />
              <p className="text-lg font-medium">System Overall Health</p>
            </div>

            <DonutChart />
          </div>

          {/* Right Side - Alerts and Service Summary */}
          <div className="space-y-6">
            {/* Critical Alerts */}
            <div
              className={`${
                dark === "dark"
                  ? "bg-[#262626] text-white"
                  : "bg-white text-black"
              } rounded-lg border border-gray-200 px-2.5 py-1.5 min-h-36`}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <OctagonAlert
                  strokeWidth={1.5}
                  className="text-[#B91C1C] w-8 h-8"
                />
                <p className="text-lg font-medium">Critical Alerts</p>
              </div>

              <div>
                <div className="text-2xl font-semibold mb-3">
                  {systemOverViewData?.notificationCounts?.reduce(
                    (sum, item) => sum + item.count,
                    0
                  )}
                  <span
                    className={`text-sm font-medium ${
                      dark === "dark" ? "text-white" : "text-[#737373]"
                    } ml-1`}
                  >
                    Total Alert
                  </span>
                </div>
                <ProgressBar
                  segments={systemOverViewData?.notificationCounts}
                  total={systemOverViewData?.notificationCounts?.reduce(
                    (sum, item) => sum + item.count,
                    0
                  )}
                  colorMap={{
                    Reminder: "#14B8A6",
                    Warning: "#F59E0B",
                    Critical: "#B91C1C",
                  }}
                />
              </div>
            </div>

            {/* Service Summary */}
            <div
              className={`${
                dark === "dark" ? "bg-[#262626] text-white" : "bg-white"
              } rounded-lg border border-gray-200 px-2.5 py-1.5 min-h-36`}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <NotebookText strokeWidth={1.5} className="w-6 h-6" />
                <p
                  className={`${
                    dark === "dark" ? "text-white" : "text-black"
                  } text-lg font-medium`}
                >
                  Service Summary
                </p>
              </div>

              <div>
                <div
                  className={`text-2xl font-semibold mb-3 ${
                    dark === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  {systemOverViewData?.serviceSummaryCount?.reduce(
                    (sum, item) => sum + item.count,
                    0
                  )}
                  <span
                    className={`text-sm font-medium ${
                      dark === "dark" ? "text-white" : "text-[#737373]"
                    } ml-1`}
                  >
                    Total
                  </span>
                </div>

                <ProgressBar
                  segments={systemOverViewData?.serviceSummaryCount}
                  total={systemOverViewData?.serviceSummaryCount?.reduce(
                    (sum, item) => sum + item.count,
                    0
                  )}
                  colorMap={{
                    Pending: "#F59E0B",
                    Due: "#F59E0B",
                    "Waiting for approval": "#F59E0B",
                    Rejected: "#B91C1C",
                    Completed: "#14B8A6",
                    Lapsed: "#F87171",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
SystemOverview.propTypes = {
  timestamp: PropTypes.string,
  categoryId: PropTypes.string,
  plantId: PropTypes.string,
};
export default SystemOverview;
