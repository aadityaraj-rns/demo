import React from "react";
import "./VerticalProgressBar.css";

const VerticalProgressBar = ({ month, percentage, color }) => {
  const filledHeight = `${percentage}%`;

  return (
    <div className="bar-container">
      <div className="progress-bar">
        <div
          className="filled-section"
          style={{
            height: filledHeight,
            backgroundColor: color,
          }}
        >
          <span className="percentage-text">{percentage}%</span>
        </div>
        <div
          className="unfilled-section"
          style={{
            height: `${100 - percentage}%`,
            backgroundColor: "#e0f7fa",
          }}
        ></div>
      </div>
      <span className="month-label">{month}</span>
    </div>
  );
};

export default VerticalProgressBar;
