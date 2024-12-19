import React from "react";

const Keyboard = ({ handleKeyPress, guessedLetters }) => {
  const firstRow = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const secondRow = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const thirdRow = ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"];

  const determineKeyStyle = (key) => {
    // Dynamically style only letters
    if (key.length === 1) {
      const status = guessedLetters[key];
      if (status === "green") return styles.greenKey;
      if (status === "yellow") return styles.yellowKey;
      if (status === "gray") return styles.grayKey;
      return styles.defaultKey;
    }
    // Use fixed styles for Enter and Backspace
    if (key === "Enter") return styles.enterKey;
    if (key === "Backspace") return styles.backspaceKey;
    return styles.defaultKey;
  };

  return (
    <div style={styles.keyboardContainer}>
      {/* Render first row */}
      <div style={styles.row}>
        {firstRow.map((key) => (
          <button
            key={key}
            style={determineKeyStyle(key)}
            onClick={() => handleKeyPress(key)}
          >
            {key}
          </button>
        ))}
      </div>
      {/* Render second row */}
      <div style={styles.row}>
        {secondRow.map((key) => (
          <button
            key={key}
            style={determineKeyStyle(key)}
            onClick={() => handleKeyPress(key)}
          >
            {key}
          </button>
        ))}
      </div>
      {/* Render third row */}
      <div style={styles.row}>
        {thirdRow.map((key) => (
          <button
            key={key}
            style={determineKeyStyle(key)}
            onClick={() => handleKeyPress(key)}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  keyboardContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "0vw",
    // marginTop: "20px",
  },
  row: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "0.2vw",
    height: "2.9vw",
    // width: "2vw",
    // marginBottom: "5px",
  },
  defaultKey: {
    padding: "0.7vw 1.1vw",
    // padding: "10px 15px",
    margin: "0.15vw",
    // margin: "2px",
    borderRadius: "0.3vw",
    // borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#ddd",
  },
  greenKey: {
    padding: "0.7vw 1.1vw",
    // padding: "10px 15px",
    margin: "0.15vw",
    // margin: "2px",
    borderRadius: "0.3vw",
    // borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "green",
    color: "white",
  },
  yellowKey: {
    padding: "0.7vw 1.1vw",
    // padding: "10px 15px",
    margin: "0.15vw",
    // margin: "2px",
    borderRadius: "0.3vw",
    // borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "yellow",
    color: "black",
  },
  grayKey: {
    padding: "0.7vw 1.1vw",
    // padding: "10px 15px",
    margin: "0.15vw",
    // margin: "2px",
    borderRadius: "0.3vw",
    // borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "gray",
  },
  enterKey: {
    padding: "0.7vw 1.5vw",
    // padding: "10px 20px",
    margin: "0.15vw",
    // margin: "2px",
    borderRadius: "0.3vw",
    // borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#6fa3ef",
    color: "white",
  },
  backspaceKey: {
    padding: "0.7vw 1.5vw",
    // padding: "10px 20px",
    margin: "0.15vw",
    // margin: "2px",
    borderRadius: "0.3vw",
    // borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#e57373",
    color: "white",
  },
};

export default Keyboard;
