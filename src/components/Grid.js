import React from "react";

function Grid({ guesses, currentGuess }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      {Array.from({ length: 6 }).map((_, rowIndex) => {
        const guessToShow = guesses[rowIndex]?.guess || (rowIndex === guesses.length ? currentGuess : "");
        return (
          <div
            key={rowIndex}
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "8px",
            }}
          >
            {Array.from({ length: 5 }).map((_, colIndex) => {
              const letter = guessToShow[colIndex] || "";
              const feedback = guesses[rowIndex]?.feedback?.[colIndex] || "";
              return (
                <div
                  key={colIndex}
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "1px solid #000",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: "4px",
                    backgroundColor:
                      feedback === "correct"
                        ? "green"
                        : feedback === "present"
                        ? "yellow"
                        : feedback === "absent"
                        ? "lightgray"
                        : "white",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default Grid;
