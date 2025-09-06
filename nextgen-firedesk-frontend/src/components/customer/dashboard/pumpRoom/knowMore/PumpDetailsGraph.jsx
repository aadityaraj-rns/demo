import { useState, useEffect } from "react";
import StatusChart from "./StatusChart";
import PropTypes from "prop-types";
// import { useState, useEffect } from "react";
import { getPumpModeStatusTrend } from "../../../../../api/organization/internal";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Tooltip } from "rsuite";

const PumpDetailsGraph = ({ iotNumber, selectedAsset }) => {
  const [conditionTime, setConditionTime] = useState("Day");
  const [conditionTrendData, setConditionTrendData] = useState([]);
  const [modeTime, setModeTime] = useState("Month");
  const [modeTrendData, setModeTrendData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPumpModeStatusTrend({
        iotNumber,
        selectedAsset,
        modeTime,
      });
      if (response.status == 200) {
        setModeTrendData(response.data);
      }
    };
    fetchData();
  }, [iotNumber, selectedAsset, modeTime]);

  const transformedData = modeTrendData.map((item) => {
    const date = new Date(item.date);
    let tickLabel = "";

    if (modeTime === "Day") {
      tickLabel = date.toLocaleString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else if (modeTime === "Week") {
      tickLabel = date.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "2-digit",
      });
    } else if (modeTime === "Month") {
      const week = Math.ceil(date.getDate() / 7);
      tickLabel = `Week ${week}`;
    }

    return {
      time: item.date, // keep raw timestamp here for tooltip linkage
      tickLabel, // used only for X-axis display
      value: Number(item.data),
    };
  });

  // Separate activeTab states for each card
  const [runTimeTab, setRunTimeTab] = useState("Day");
  const [conditionLogTab, setConditionLogTab] = useState("Day");

  const [runTimeData, setRunTimeData] = useState({
    Day: {
      labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
      data: [10, 12, 14, 16, 18, 20],
      average: "11.9v",
    },
    Week: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: [15, 18, 16, 19, 17, 20, 14],
      average: "17.1v",
    },
    Month: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      data: [16, 18, 17, 19],
      average: "17.5v",
    },
  });

  const [conditionLogData, setConditionLogData] = useState({
    Day: {
      labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
      ylabels: ["OFF", "ON"],

      on: [16, 18, 20, 19, 17, 21, 18],
      off: [6, 4, 3, 4, 5, 2, 4],
      trapped: [2, 2, 1, 1, 2, 1, 2],
    },
    Week: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      ylabels: ["OFF", "ON"],

      on: [140, 138, 142, 145],
      off: [20, 22, 18, 15],
      trapped: [8, 8, 8, 8],
    },
    Month: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      ylabels: ["OFF", "ON"],

      on: [580, 590, 585],
      off: [75, 70, 72],
      trapped: [32, 30, 31],
    },
  });

  useEffect(() => {
    // Fetch data dynamically here if needed
  }, []);

  const TabButton = ({ label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-sm font-medium rounded-5 transition-all duration-200 mt-1 ${
        isActive
          ? "bg-orange-500 text-white shadow-sm"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );

  const SVGChart = ({
    data,
    color,
    gradientId,
    type = "line",
    title,
    timeframe,
  }) => {
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const width = 300;
    const height = 300;
    const padding = 30;

    let points = [];
    let maxValue = 0;
    let minValue = 0;
    let yLabels = [];

    if (type === "line") {
      maxValue = Math.max(...data);
      minValue = Math.min(...data);
      const range = maxValue - minValue;

      points = data.map((value, index) => {
        const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
        const y =
          height -
          padding -
          ((value - minValue) / range) * (height - 2 * padding);
        return { x, y, value, index };
      });

      yLabels = [
        { value: maxValue, label: `${Math.round(maxValue)}` },
        { value: maxValue * 0.75, label: "" },
        { value: maxValue * 0.5, label: `${Math.round(maxValue * 0.5)}` },
        { value: maxValue * 0.25, label: "" },
        { value: minValue, label: `${Math.round(minValue)}` },
      ];
    } else if (type === "multiLine") {
      // For condition log
      const allValues = [...data.on, ...data.off, ...data.trapped];
      maxValue = Math.max(...allValues);
      minValue = 0;
      const range = maxValue - minValue;

      const onPoints = data.on.map((value, index) => {
        const x =
          padding + (index * (width - 2 * padding)) / (data.on.length - 1);
        const y =
          height -
          padding -
          ((value - minValue) / range) * (height - 2 * padding);
        return { x, y, value, index };
      });

      const offPoints = data.off.map((value, index) => {
        const x =
          padding + (index * (width - 2 * padding)) / (data.off.length - 1);
        const y =
          height -
          padding -
          ((value - minValue) / range) * (height - 2 * padding);
        return { x, y, value, index };
      });

      const trappedPoints = data.trapped.map((value, index) => {
        const x =
          padding + (index * (width - 2 * padding)) / (data.trapped.length - 1);
        const y =
          height -
          padding -
          ((value - minValue) / range) * (height - 2 * padding);
        return { x, y, value, index };
      });

      points = { on: onPoints, off: offPoints, trapped: trappedPoints };

      yLabels = [
        { value: maxValue, label: `${Math.round(maxValue)}` },
        { value: maxValue * 0.75, label: "" },
        { value: maxValue * 0.5, label: `${Math.round(maxValue * 0.5)}` },
        { value: maxValue * 0.25, label: "" },
        { value: 0, label: "0" },
      ];
    } else if (type === "stacked") {
      // For auto/manual stacked area chart
      const combinedData = data.auto.map(
        (auto, index) => auto + data.manual[index]
      );
      maxValue = Math.max(...combinedData);
      minValue = 0;
      const range = maxValue - minValue;

      const autoPoints = data.auto.map((value, index) => {
        const x =
          padding + (index * (width - 2 * padding)) / (data.auto.length - 1);
        const y =
          height -
          padding -
          ((value - minValue) / range) * (height - 2 * padding);
        return { x, y, value, index };
      });

      const stackedPoints = combinedData.map((value, index) => {
        const x =
          padding + (index * (width - 2 * padding)) / (combinedData.length - 1);
        const y =
          height -
          padding -
          ((value - minValue) / range) * (height - 2 * padding);
        return { x, y, value, index };
      });

      points = { auto: autoPoints, stacked: stackedPoints };

      yLabels = [
        { value: maxValue, label: `${Math.round(maxValue)}` },
        { value: maxValue * 0.25, label: "" },
        { value: 0, label: "0" },
      ];
    }

    // X-axis labels based on timeframe
    const getXLabels = () => {
      if (type === "line") {
        switch (timeframe) {
          case "Day":
            return ["00:00", "06:00", "12:00", "18:00", "24:00"];
          case "Week":
            return ["Mon", "Tue", "Wed", "Thu", "Fri"];
          case "Month":
            return ["Week 1", "Week 2", "Week 3", "Week 4"];
          default:
            return ["00:00", "06:00", "12:00", "18:00", "24:00"];
        }
      } else {
        return data.labels || ["A", "B", "C", "D", "E"];
      }
    };

    const xLabels = getXLabels();

    const pathData =
      type === "line"
        ? `M ${points.map((p) => `${p.x},${p.y}`).join(" L ")}`
        : "";

    return (
      <div className="relative">
        <svg width={width} height={height}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: color, stopOpacity: 0.4 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: color, stopOpacity: 0.1 }}
              />
            </linearGradient>
            <linearGradient id="onGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: "#10b981", stopOpacity: 0.4 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#10b981", stopOpacity: 0.1 }}
              />
            </linearGradient>
            <linearGradient id="offGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: "#f97316", stopOpacity: 0.4 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#f97316", stopOpacity: 0.1 }}
              />
            </linearGradient>
            <linearGradient
              id="trappedGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#ef4444", stopOpacity: 0.4 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#ef4444", stopOpacity: 0.1 }}
              />
            </linearGradient>
            <linearGradient id="autoGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: "#3b82f6", stopOpacity: 0.4 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#3b82f6", stopOpacity: 0.1 }}
              />
            </linearGradient>
            <linearGradient
              id="manualGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#10b981", stopOpacity: 0.4 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#10b981", stopOpacity: 0.1 }}
              />
            </linearGradient>
          </defs>

          {/* Y-axis line */}
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            stroke="#e5e7eb"
            strokeWidth="1"
          />

          {/* X-axis line */}
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#e5e7eb"
            strokeWidth="1"
          />

          {/* Y-axis labels */}
          {yLabels.map((label, index) => {
            const y =
              height -
              padding -
              ((label.value - minValue) / (maxValue - minValue)) *
                (height - 2 * padding);

            // Inject custom string-based y-axis labels if available
            let customLabel = label.label;
            if (data.ylabels && data.ylabels.length === 2) {
              if (index === 0) {
                customLabel = data.ylabels[0]; // Top
              } else if (index === yLabels.length - 1) {
                customLabel = data.ylabels[1]; // Bottom
              }
            }

            return (
              <g key={index}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#f3f4f6"
                  strokeWidth="1"
                />
                <text
                  x={padding - 7}
                  y={y + 3}
                  textAnchor="end"
                  className="text-xs fill-gray-500"
                >
                  {customLabel}
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {xLabels.map((label, index) => {
            const x =
              padding + (index * (width - 2 * padding)) / (xLabels.length - 1);
            return (
              <text
                key={index}
                x={x}
                y={height - padding + 15}
                textAnchor="middle"
                className="text-xs fill-gray-500"
              >
                {label}
              </text>
            );
          })}

          {/* Render based on chart type */}
          {type === "line" && (
            <>
              {/* Area fill */}
              <path
                d={`${pathData} L ${points[points.length - 1].x},${
                  height - padding
                } L ${padding},${height - padding} Z`}
                fill={`url(#${gradientId})`}
              />
              {/* Main line */}
              <path
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Current value point */}
              <circle
                cx={points[points.length - 1].x}
                cy={points[points.length - 1].y}
                r="4"
                fill={color}
                stroke="white"
                strokeWidth="2"
              />
            </>
          )}

          {type === "multiLine" && (
            <>
              {/* On line */}
              <path
                d={`M ${points.on.map((p) => `${p.x},${p.y}`).join(" L ")}`}
                fill="none"
                stroke="#047857"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Off line */}
              <path
                d={`M ${points.off.map((p) => `${p.x},${p.y}`).join(" L ")}`}
                fill="none"
                stroke="#f97316"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Current value points */}
              <circle
                cx={points.on[points.on.length - 1].x}
                cy={points.on[points.on.length - 1].y}
                r="4"
                fill="#10b981"
                stroke="white"
                strokeWidth="2"
              />
              <circle
                cx={points.off[points.off.length - 1].x}
                cy={points.off[points.off.length - 1].y}
                r="4"
                fill="#f97316"
                stroke="white"
                strokeWidth="2"
              />
            </>
          )}

          {type === "stacked" && (
            <>
              {/* Stacked area (total) */}
              <path
                d={`M ${points.stacked
                  .map((p) => `${p.x},${p.y}`)
                  .join(" L ")} L ${
                  points.stacked[points.stacked.length - 1].x
                },${height - padding} L ${padding},${height - padding} Z`}
                fill="url(#manualGradient)"
              />
              {/* Auto area */}
              <path
                d={`M ${points.auto
                  .map((p) => `${p.x},${p.y}`)
                  .join(" L ")} L ${points.auto[points.auto.length - 1].x},${
                  height - padding
                } L ${padding},${height - padding} Z`}
                fill="url(#autoGradient)"
              />
              {/* Stacked line */}
              <path
                d={`M ${points.stacked
                  .map((p) => `${p.x},${p.y}`)
                  .join(" L ")}`}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Auto line */}
              <path
                d={`M ${points.auto.map((p) => `${p.x},${p.y}`).join(" L ")}`}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Current value points */}
              <circle
                cx={points.auto[points.auto.length - 1].x}
                cy={points.auto[points.auto.length - 1].y}
                r="4"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="2"
              />
              <circle
                cx={points.stacked[points.stacked.length - 1].x}
                cy={points.stacked[points.stacked.length - 1].y}
                r="4"
                fill="#10b981"
                stroke="white"
                strokeWidth="2"
              />
            </>
          )}
        </svg>
      </div>
    );
  };

  // Bar Chart Component (For Run Time Analysis - keeping the original)
  const BarChart = ({ data }) => {
    const width = 300;
    const height = 270;
    const padding = 30;

    const maxValue = Math.max(...data.data);
    const minValue = 0;
    const range = maxValue - minValue;

    const barWidth = ((width - 2 * padding) / data.data.length) * 0.6;
    const barSpacing = (width - 2 * padding) / data.data.length;

    return (
      <div className="relative">
        <svg width={width} height={height}>
          <defs>
            <linearGradient
              id="barGradient"
              x1="0%"
              y1="100%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#0083FE", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#0083FE", stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>

          {/* Y-axis line */}
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            stroke="#e5e7eb"
            strokeWidth="1"
          />

          {/* X-axis line */}
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#e5e7eb"
            strokeWidth="1"
          />

          {/* Y-axis grid lines and labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const value = minValue + ratio * range;
            const y = height - padding - ratio * (height - 2 * padding);
            return (
              <g key={index}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#f3f4f6"
                  strokeWidth="1"
                />
                <text
                  x={padding - 5}
                  y={y + 3}
                  textAnchor="end"
                  className="text-xs fill-gray-500"
                >
                  {Math.round(value)}
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {data.labels.map((label, index) => {
            const x = padding + index * barSpacing + barSpacing / 2;
            return (
              <text
                key={index}
                x={x}
                y={height - padding + 15}
                textAnchor="middle"
                className="text-xs fill-gray-500"
              >
                {label}
              </text>
            );
          })}

          {/* Bars */}
          {data.data.map((value, index) => {
            const x =
              padding + index * barSpacing + (barSpacing - barWidth) / 2;
            const barHeight =
              ((value - minValue) / range) * (height - 2 * padding);
            const y = height - padding - barHeight;

            return (
              <rect
                key={index}
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="url(#barGradient)"
                rx="3"
                ry="3"
              />
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 font-[Figtree] mb-6">
      {/* Run Time Analysis */}
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
        <p className="text-lg font-medium mb-2">Run Time Analysis</p>

        <div className="flex gap-2 mb-4">
          {["Day", "Week", "Month"].map((tab) => (
            <TabButton
              key={tab}
              label={tab}
              isActive={runTimeTab === tab}
              onClick={() => setRunTimeTab(tab)}
            />
          ))}
        </div>

        <p className="text-2xl font-medium">
          {runTimeData[runTimeTab].average}
        </p>
        <p className="text-xs text-[#727272]">Average Run Time</p>
        <div className="h-64 flex justify-center items-center">
          <BarChart data={runTimeData[runTimeTab]} />
        </div>
      </div>

      {/* Condition Log Over Time */}
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
        <p className="text-lg font-medium mb-2">Condition Log Over Time</p>

        <div className="flex gap-2 mb-6">
          {["Day", "Week", "Month"].map((tab) => (
            <TabButton
              key={tab}
              label={tab}
              isActive={conditionLogTab === tab}
              onClick={() => setConditionLogTab(tab)}
            />
          ))}
        </div>

        <div className="h-64 flex justify-center items-center">
          {/* <SVGChart
            data={conditionLogData[conditionLogTab]}
            color="#10b981"
            gradientId="conditionGradient"
            type="multiLine"
            title="Condition Log"
            timeframe={conditionLogTab}
          /> */}

          <StatusChart />
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 bg-[#B45309] rounded-full"></div>
            <span className="text-sm text-gray-700">On</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 bg-[#047857] rounded-full"></div>
            <span className="text-sm text-gray-700">Off</span>
          </div>
        </div>
      </div>

      {/* Auto vs Manual & Status Trends */}
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
        <p className="text-lg font-medium mb-2">
          Auto vs Manual & Status Trends
        </p>

        <div className="flex gap-2 mb-6">
          {["Day", "Week", "Month"].map((tab) => (
            <TabButton
              key={tab}
              label={tab}
              isActive={modeTime === tab}
              onClick={() => setModeTime(tab)}
            />
          ))}
        </div>

        <div className="w-full overflow-x-auto">
          <div className="min-w-[800px] h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={transformedData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B2C" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FF6B2C" stopOpacity={0} />
                  </linearGradient>
                </defs>

                {/* Custom Y-Axis with label formatter */}
                <YAxis
                  dataKey="value"
                  domain={[0, 1]}
                  tickFormatter={(value) => (value === 1 ? "Auto" : "Manual")}
                  tick={{ fontSize: 12 }}
                />

                {/* X-Axis time and date */}
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 10 }}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  tickFormatter={(value, index) => {
                    const label = transformedData[index]?.tickLabel;
                    const prev = transformedData[index - 1]?.tickLabel;

                    if (modeTime === "Month" || modeTime === "Week") {
                      return prev === label ? "" : label;
                    }
                    return label;
                  }}
                />

                <Tooltip
                  formatter={(value) => (value === 1 ? "Auto" : "Manual")}
                  labelFormatter={(label) => `Time: ${label}`}
                />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#FF6B2C"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 bg-[#047857] rounded-full"></div>
            <span className="text-sm text-[#727272]">Auto</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 bg-[#B91C1C] rounded-full"></div>
            <span className="text-sm text-[#727272]">Manual</span>
          </div>
        </div>
      </div>
    </div>
  );
};

PumpDetailsGraph.propTypes = {
  iotNumber: PropTypes.any,
  selectedAsset: PropTypes.any,
};

export default PumpDetailsGraph;
