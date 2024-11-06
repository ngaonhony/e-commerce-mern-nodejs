// Color.js

import React from "react";

const Color = ({ colorData, setColor, selectedColor }) => {
  return (
    <ul className="colors ps-0 d-flex gap-2">
      {colorData &&
        colorData.map((item) => (
          <li
            key={item._id}
            onClick={() => setColor(item._id)}
            style={{
              backgroundColor: item.title,
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              cursor: "pointer",
              border:
                selectedColor === item._id
                  ? "3px solid #000" // Thick black border for selected color
                  : "1px solid #ccc", // Standard border for unselected colors
            }}
            title={item.title} // Tooltip showing the color name
          ></li>
        ))}
    </ul>
  );
};

export default Color;
