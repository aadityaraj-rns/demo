import { CloseFullscreen } from "@mui/icons-material";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import { ExpandIcon } from "lucide-react";
import PropTypes from "prop-types";
import React, { useMemo, useState } from "react";
import moment from "moment";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { isArray } from "lodash";


const TrendCard = (
    {
        title,
    icon: Icon,
    iconImage,
    avgValue,
    trend,
    trendType,
    lastRecorded,
    handleTabChange,
    activeTab,
    minLine
    }
) => {

     
  

  const [expanded,setExpanded] = useState(false);

  const chartData = useMemo(() => getChartData(activeTab,trendType,trend,expanded),[expanded,trend,trendType,activeTab]);
    // const chartData = data;
  const chartWidth = chartData.length * 80;

  const chartHeight = expanded?550:350;

  
  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "1rem",
      }}
    >

      <Modal open={expanded} onClose={() => setExpanded(false)}>
  <Box
    sx={{
      position: "absolute",
      top: "10%",
      left: "10%",
      // transform: "translate(-50%, -50%)",
      width: "80%",
      height:"80%",
      bgcolor: "background.paper",
      boxShadow: 24,
      p: 3,
      borderRadius: 2,
      overflow: "auto",
    }}
  >
    <IconButton
      onClick={() => setExpanded(false)}
      sx={{ position: "absolute", top: 8, right: 8 }}
    >
      <CloseFullscreen />
    </IconButton>

    <Typography variant="h6" mb={2}>
      {title} - Detailed View
    </Typography>

    <div style={{ display: "flex", height: chartHeight }}>
      <div style={{ width: 50, position: "sticky", left: 0, background: "#fff", zIndex: 10 }}>
        <AreaChart width={50} height={chartHeight} data={chartData}>
          <YAxis domain={[0, 600]} tickFormatter={(v) => `${v}L`} width={40} />
        </AreaChart>
      </div>

      <div style={{ overflowX: "auto" }}>
        <div style={{ width: chartWidth }}>
          <AreaChart width={chartWidth} height={chartHeight} data={chartData}>
            <defs>
              <linearGradient id="modalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <Tooltip formatter={(value) => `${value} L`} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <ReferenceLine
              y={minLine}
              stroke="red"
              strokeDasharray="4 4"
              label={{
                value: "Minimum Water level",
                position: "insideBottomLeft",
                fill: "red",
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#modalGradient)"
              dot={{ r: 4, fill: "white", stroke: "#3b82f6", strokeWidth: 2 }}
            />
          </AreaChart>
        </div>
      </div>
    </div>
  </Box>
</Modal>

      <div className="flex items-center gap-3 mb-3 border-b-1 border-[#E3E3E3] pb-3">
          <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
            {iconImage ? (
              <img
                src={iconImage}
                alt={`${title} icon`}
                className="w-8 h-8 object-contain"
              />
            ) 
            : (
              <Icon className="w-7 h-7 text-gray-600" />
            )}
          </div>
          <div className="flex-1">
            <p className="mb-1 text-sm font-semibold">{title}</p>
          </div>
          <button onClick={() => {setExpanded(true)}}><ExpandIcon /></button>
        </div>


        {/* Average Value */}
        <div className="mb-4">
          <div className="text-sm text-[#727272] mb-1">
            {/* Avg this week:{" "}
            <span className="text-base text-black"> {avgValue} </span> */}
          </div>
        </div>

      {/* Buttons */}
      {/* <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button style={{ backgroundColor: "#f97316", color: "white", borderRadius: "20px", padding: "0.25rem 1rem" }}>Day</button>
        <button style={{ backgroundColor: "#e5e7eb", borderRadius: "20px", padding: "0.25rem 1rem" }}>Week</button>
        <button style={{ backgroundColor: "#e5e7eb", borderRadius: "20px", padding: "0.25rem 1rem" }}>Last 30 Days</button>
      </div> */}

            <div className="flex gap-2 mb-4">
          {["Day", "Week", "Last 30 Days"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(trendType, tab)}
              className={`px-2 py-1 md:px-3 md:py-1 text-sm font-medium rounded-4 md:rounded-5 transition-colors ${
                activeTab[trendType] === tab
                  ? "bg-[#FF6B2C] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>


      {/* Chart Wrapper */}
      {
        chartData.length==0?<div className="justify-content-center align-items-center d-flex" style={{height:chartHeight}}>No Data Found</div>:<div style={{ display: "flex", height: chartHeight, position: "relative" }}>
        {/* Fixed Y-Axis */}
        <div style={{ width: 50, position: "sticky", left: 0, background: "#fff", zIndex: 10 }}>
          <AreaChart width={50} height={chartHeight} data={chartData}>
            <YAxis
              domain={[0, 600]}
              tickFormatter={(v) => `${v}L`}
              width={40}
            />
          </AreaChart>
        </div>

        {/* Scrollable Chart */}
        <div style={{ overflowX: "auto" }}>
          <div style={{ width: chartWidth }}>
            <AreaChart width={chartWidth} height={chartHeight} data={chartData}>
              <defs>
                <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <Tooltip formatter={(value) => `${value} L`} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <ReferenceLine
                y={minLine}
                stroke="red"
                strokeDasharray="4 4"
                label={{
                  // value: "Minimum Water level",
                  position: "insideBottomLeft",
                  fill: "red",
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#waterGradient)"
                dot={{ r: 4, fill: "white", stroke: "#3b82f6", strokeWidth: 2 }}
              />
            </AreaChart>
          </div>
        </div>
      </div>
      }
      

      {/* Footer */}
      <div style={{ marginTop: "1rem", fontSize: "14px", color: "#4b5563" }}>
        Last recorded: <strong>{lastRecorded}</strong> 
      </div>
    </div>
  );
};

const getChartData = (activeTab,trendType,trend,isExpanded) =>{
  console.log(activeTab[trendType],"trendi s this.......")
const trendData =  (trend || [])?.map(  (item) => ({
      date: new Date(item.date),
      value: Number(item.data),
    }))
    if(isExpanded) {
      return trendData.map(item => {
        item.date = moment(item.date).format("MMM DD, hh:mm");
        return item;
      } );
    } else {
      if(activeTab[trendType]=="Week") {
      return getDayAverages(trendData)
    } else  if(activeTab[trendType]=="Last 30 Days") {
      return getLast30DaysAverageList(trendData)
    } else {
      return trendData;
    }

    }
    
    
}
function getDayAverages(dataArray = []) {
  const weekMap = ["Sun","Mon","Tue","Wed","Thur","Fri","Sat"];
  let weekObj = {};
  dataArray.forEach(data => {
    const day = moment(data.date).day();
    // console.log(weekObj[day],data,"weekObj[day]")
    if(isArray(weekObj[day])) {
      weekObj[day].push(data.value)
    } else {
      weekObj[day] = []
    }
  })
  const result = weekMap.map((item, index) => {
    if(weekObj[index]) {
      const total = weekObj[index]?.reduce((acc,curItem)=> {
        acc = acc+curItem;
        return acc;
      },0);
    return {
      date:weekMap[index],
      value:total/ weekObj[index].length
    }
    } else {
     return {
      date:weekMap[index],
      value:0
    } 
    }
    
  })
  // const result=dataArray;
  return result;
}


function getLast30DaysAverageList(dataArray = []) {
  let weekObj = {};
  let last30DaysArr=[] ;
   for (let i = 0; i < 30; i++) {
    last30DaysArr.push({
      date:moment().subtract(29 - i, 'days').format('MMM-DD'),
      value: 0
    });
  }
  console.log(last30DaysArr,"last30DaysArr")
  dataArray.forEach(data => {
    const day = moment(data.date).format("MMM-DD")
    // console.log(weekObj[day],data,"Last 30 days")
    if(isArray(weekObj[day])) {
      weekObj[day].push(data.value)
    } else {
      weekObj[day] = []
    }
  })
  // console.log(weekObj,"weekObj in last 30 days")
  // weekObjKeyList

  const result = last30DaysArr.map((item,index) => {
    if(weekObj[item.date]) {
      const total = weekObj[item.date].reduce((acc,curVal)=>{
        acc=acc + curVal;
        return acc;
      },0);
      item.value = total/weekObj[item.date].length;
      
    }
    return item;
  })
  console.log(result,"Result is this");
  // const result=dataArray;
  return result;
}


export default TrendCard;

  TrendCard.propTypes = {
    title: PropTypes.any,
    icon: PropTypes.any,
    iconImage: PropTypes.any,
    avgValue: PropTypes.any,
    trend: PropTypes.any,
    trendType: PropTypes.any,
    chartColor: PropTypes.any,
    gradientId: PropTypes.any,
    minLine: PropTypes.any,
    lastRecorded: PropTypes.any,
    chartType: PropTypes.any,
    handleTabChange: PropTypes.any,
    activeTab: PropTypes.any
  };
