import React, { useState } from "react";
import "./Battery.css"; // Import the CSS file

const Battery = ({ percentage }) => {
  // const [percentage, setPercentage] = useState(23); // Set default percentage

  // const handleInputChange = (e) => {
  //   const value = Math.min(100, Math.max(0, Number(e.target.value))); // Ensure the value is between 0 and 100
  //   setPercentage(value);
  // };

  return (
    <div className="battery-container">
      <div className="battery">
        <div
          className="battery-level"
          style={{
            width: `${percentage}%`, // Correct template literal usage
            backgroundColor: percentage > 20 ? "green" : "red", // Change color if low energy
          }}
        ></div>
      </div>
      <div className="percentage-text">{percentage}% ENERGY</div>
      {/* <input
        type="number"
        value={percentage}
        onChange={handleInputChange}
        placeholder="Enter percentage"
        className="input-box"
      /> */}
    </div>
  );
};

export default Battery;
