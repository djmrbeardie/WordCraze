import React, { useEffect, useState } from "react";

function Grid({ guesses, currentGuess , shakeRowIndex, cellIndex, animateCells, animationTime}) {
    const [flippingIndexes, setFlippingIndexes] = useState([]); // Track indices to animate
    
    useEffect(() => {
        if (animateCells) {
          const latestGuessIndex = guesses.length - 1; // Only animate the last guess row's cells
          if (latestGuessIndex >= 0) {
            const delays = [];
            guesses[latestGuessIndex].guess.split("").forEach((_, index) => {
              delays.push(
                setTimeout(() => {
                  setFlippingIndexes((prev) => [...prev, index]);
                }, index * (animationTime/5))
              );
            });

            return () => {
                delays.forEach(clearTimeout); // Cleanup all timeouts on re-render
                setFlippingIndexes([]); // Clear out flipping indexes for the next animation
              };
          }
        }
      }, [animateCells, guesses, animationTime]);
    
  return (
    <div style={{ marginBottom: "20px" }}>
      {Array.from({ length: 6 }).map((_, rowIndex) => {
        const guessToShow = guesses[rowIndex]?.guess || (rowIndex === guesses.length ? currentGuess : "");
        const isShaking = shakeRowIndex === rowIndex; // Determine if this row should shake
        const isCurrentRow = rowIndex === guesses.length; // Identify the current input row
        const rowToAnimate = rowIndex === guesses.length - 1;
        
        return (
          <div
            key={rowIndex}
            className={isShaking ? "shake" : ""} // Apply shake class if this row should shake
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
                    borderRadius: "5px",
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
                    borderStyle: isCurrentRow && colIndex === cellIndex ? "dashed" : "solid", // Apply dashed except for excluded cell
                    // transform: rowToAnimate ? "rotateX(360deg)" : "rotateX(0)",
                    // transition: "transform 0.3s ease-in",  
                    transform: rowToAnimate && flippingIndexes.includes(colIndex) ? "rotateX(-90deg)" : "rotateX(0)",
                    transition: "transform 0.4s ease-in",
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
