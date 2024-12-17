import React, { useState, useEffect } from "react";
import Grid from "./Grid";
import Keyboard from "./Keyboard";
import { checkGuess } from "../utils/logic";
import { checkWord } from "../utils/wordValidation";


function WordleGame() {
  const [guesses, setGuesses] = useState([]); // Array of attempted guesses
  const [currentGuess, setCurrentGuess] = useState("");
  const [solution, setSolution] = useState(""); // Solution word to guess
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(""); // State to handle toast popup messages
  const [guessedLetters, setGuessedLetters] = useState({});
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  useEffect(() => {
    fetchNewWord();
  }, []);

  // Fetch word from API when the component is first rendered
  async function fetchNewWord() {
    try {
    //   const response = await fetch("https://random-word-api.herokuapp.com/word?length=5"); //This API may give incorrect words, hence below handled incorrect words.
      const response = await fetch("https://random-word-api.vercel.app/api?words=1&length=5&type=uppercase");
  
      if (!response.ok) {
        throw new Error("Failed to fetch word");
      }
  
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        showToast(data[0]);
        const wordChecker = await checkWord(data[0]); 

        if(wordChecker.isValid){
            setSolution(data[0].toUpperCase());
        }
        else{
            fetchNewWord();
        }
      } else {
        throw new Error("No word returned from API");
      }
  
      setLoading(false);
    } catch (err) {
      console.error("Error fetching word:", err);
      setError(err.message);
    }
  }      

  const handleKeyPress = async (key) => {
    if (key === "Enter" && !gameOver) {
        if (currentGuess.length === 5) {
            const wordChecker = await checkWord(currentGuess); 

            if (wordChecker.isValid) {
                const result = checkGuess(solution, currentGuess);
                const updatedGuessedLetters = { ...guessedLetters };

                result.forEach((status, index) => {
                    const letter = currentGuess[index];
                    if (status === "correct") updatedGuessedLetters[letter] = "green";
                    else if (status === "present" && !updatedGuessedLetters[letter]) updatedGuessedLetters[letter] = "yellow";
                    else if (status === "absent" && !updatedGuessedLetters[letter]) updatedGuessedLetters[letter] = "gray";
                    });

                setGuessedLetters(updatedGuessedLetters);
                setGuesses([...guesses, { guess: currentGuess, feedback: result }]);

                if (result.every(status => status === "correct")) {
                    handleWin();
                } else if (guesses.length + 1 >= 6) {
                    handleLoss();
                }
            }
            else{
                showToast("Invalid word!");
            }
        showToast("Word: " + solution);
        setCurrentGuess("");
      }
    } else if (key === "Backspace") {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (currentGuess.length < 5 && /^[a-zA-Z]$/.test(key)) {
      setCurrentGuess(currentGuess + key.toUpperCase());
    }
  };

  const handleWin = () => {
    setGameOver(true);
    setWin(true);
    saveStats({ won: true });
    showToast("🎉 You Won! 🎉");
  };

  const handleLoss = () => {
    setGameOver(true);
    setWin(false);
    saveStats({ won: false });
    showToast("😔 You Lost!");
  };

  const saveStats = ({ won }) => {
    const previousStats = JSON.parse(localStorage.getItem("wordleStats")) || { wins: 0, losses: 0 };
    const newStats = won
      ? { ...previousStats, wins: previousStats.wins + 1 }
      : { ...previousStats, losses: previousStats.losses + 1 };
    localStorage.setItem("wordleStats", JSON.stringify(newStats));
  };

  const restartGame = async () => {
    setGameOver(false);
    setWin(false);
    setGuesses([]);
    setGuessedLetters({});
    setLoading(true);

    fetchNewWord();
  };


  // Listen for keyboard events
  useEffect(() => {
    const handlePhysicalKeyPress = (event) => {
      handleKeyPress(event.key);
    };

    window.addEventListener("keydown", handlePhysicalKeyPress);

    // Cleanup listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handlePhysicalKeyPress);
    };
  }, [currentGuess]); // Include currentGuess to handle edge states properly


  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000); // Clear toast after 3 seconds
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Wordle Clone</h1>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "10px 20px",
            backgroundColor: "#f44336",
            color: "white",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
          }}
        >
          {toastMessage}
        </div>
      )}

      <Grid guesses={guesses} currentGuess={currentGuess} />
      <Keyboard handleKeyPress={handleKeyPress} guessedLetters={guessedLetters} />

      {gameOver && (
        <div style={styles.modal}>
          <p>{win ? "🎉 You Won! 🎉" : "😔 You Lost! 😔"}</p>
          <button onClick={restartGame} style={styles.button}>
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
    modal: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "white",
      padding: "20px",
      boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
      zIndex: 1000,
      textAlign: "center",
    },
    button: {
      marginTop: "10px",
      padding: "10px",
      backgroundColor: "#007BFF",
      border: "none",
      color: "white",
      borderRadius: "4px",
      cursor: "pointer",
    },
};

export default WordleGame;
