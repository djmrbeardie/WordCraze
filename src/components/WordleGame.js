import React, { useState } from "react";
import Grid from "./Grid";
import Keyboard from "./Keyboard";
import { checkGuess } from "../utils/logic";

function WordleGame() {
  const [guesses, setGuesses] = useState([]); // Array of attempted guesses
  const [currentGuess, setCurrentGuess] = useState("");
  const [solution] = useState("REACT"); // Word to guess (can later randomize this)

  const handleKeyPress = (key) => {
    if (key === "Enter") {
      if (currentGuess.length === 5) {
        const result = checkGuess(solution, currentGuess);
        setGuesses([...guesses, { guess: currentGuess, feedback: result }]);
        setCurrentGuess("");
      }
    } else if (key === "Backspace") {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (currentGuess.length < 5 && /^[a-zA-Z]$/.test(key)) {
      setCurrentGuess(currentGuess + key.toUpperCase());
    }
  };

  return (
    <div>
      <h1>Wordle Clone</h1>
      <Grid guesses={guesses} currentGuess={currentGuess} />
      <Keyboard handleKeyPress={handleKeyPress} />
    </div>
  );
}

export default WordleGame;
