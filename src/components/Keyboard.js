import React from "react";

function Keyboard({ handleKeyPress }) {
  const keys = [
    "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P",
    "A", "S", "D", "F", "G", "H", "J", "K", "L",
    "Z", "X", "C", "V", "B", "N", "M",
    "Enter", "Backspace"
  ];

  return (
    <div style={{ textAlign: "center" }}>
      {keys.map((key) => (
        <button
          key={key}
          onClick={() => handleKeyPress(key)}
          style={{
            margin: "4px",
            padding: "8px",
            fontSize: "14px",
            backgroundColor: "#ddd",
          }}
        >
          {key}
        </button>
      ))}
    </div>
  );
}

export default Keyboard;
