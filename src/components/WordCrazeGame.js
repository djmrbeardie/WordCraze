import React, { useState, useEffect } from "react";
import Grid from "./Grid";
import Keyboard from "./Keyboard";
import { checkGuess } from "../utils/logic";
import { checkWord } from "../utils/wordValidation";
import { GameStatsDisplay, useStats, saveStats } from "./GameStats";

function WordCrazeGame({ animationTime }) {
  const [guesses, setGuesses] = useState([]); // Array of attempted guesses
  const [currentGuess, setCurrentGuess] = useState("");
  const [solution, setSolution] = useState(""); // Solution word to guess
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(""); // State to handle toast popup messages
  const [guessedLetters, setGuessedLetters] = useState({});
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [shakeRowIndex, setShakeRowIndex] = useState(null);
  const [cellIndex, setCellIndex] = useState(null);
  const [animateCells, setAnimateCells] = useState(false);
  const [definitions, setDefinitions] = useState(null);
  const { stats, setStats } = useStats();
  // const [points, setPoints] = useState(0); // Initialize points state

  useEffect(() => {
    fetchNewWord();
  }, []);

  // Fetch word from API when the component is first rendered
  async function fetchNewWord() {
    try {
      const response = await fetch("https://random-word-api.vercel.app/api?words=1&length=5&type=uppercase");

      if (!response.ok) {
        throw new Error("Failed to fetch word");
      }

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const wordChecker = await checkWord(data[0]);

        if (wordChecker.isValid) {
          setSolution(data[0].toUpperCase());
        } else {
          fetchNewWord();
        }
      } else {
        throw new Error("No word returned from API");
      }
      setLoading(false);
      setCellIndex(0);
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
          const definitions = wordChecker.data[0]?.meanings?.[0]?.definitions;
          if (definitions) {
            setDefinitions(definitions);
          } else {
            setDefinitions([]);
          }

          setGuessedLetters(updatedGuessedLetters);
          setGuesses([...guesses, { guess: currentGuess, feedback: result }]);

          let currentPoints = 0;
          result.forEach((status, index) => {
            const letter = currentGuess[index];
            if (status === "correct") {
              updatedGuessedLetters[letter] = "green";
              currentPoints += 3;
            } else if (status === "present" && !updatedGuessedLetters[letter]) {
              updatedGuessedLetters[letter] = "yellow";
              currentPoints += 1;
            } else if (status === "absent" && !updatedGuessedLetters[letter]) {
              updatedGuessedLetters[letter] = "gray";
            }
          });

          if (result.every((status) => status === "correct")) {
            const previousPoints = calculatePoints();
            const remainingGuesses = 6 - (guesses.length + 1);
            const bonusPoints = remainingGuesses * 15;
            handleWin(previousPoints + currentPoints + bonusPoints);
          } else if (guesses.length + 1 >= 6) {
            const previousPoints = calculatePoints();
            handleLoss(previousPoints + currentPoints);
          }
          setCurrentGuess("");
          setCellIndex(0); // Prevent going below 0
          // showToast("Word: " + solution);
          setAnimateCells(true);
          setTimeout(() => {
            setAnimateCells(false);
          }, animationTime); // Wait for the animation
        } else {
          triggerShake();
          showToast("Invalid word!");
        }
      }
    } else if (key === "Enter" && gameOver) {
      restartGame();
    } else if (key === "Backspace") {
      setCurrentGuess(currentGuess.slice(0, -1));
      setCellIndex((prevIndex) => Math.max(0, prevIndex - 1)); // Prevent going below 0
    } else if (currentGuess.length < 5 && /^[a-zA-Z]$/.test(key)) {
      setCurrentGuess(currentGuess + key.toUpperCase());
      setCellIndex((prevIndex) => Math.min(4, prevIndex + 1)); // Prevent going above index 4
    }
  };

  const handleWin = (points) => {
    setGameOver(true);
    setWin(true);
    saveStats({ won: true, stats, setStats, word: solution, points, guesses: guesses.length + 1 }); // Use totalPoints directly
    setCurrentGuess("");
    showToast("Congratulations! 🎉 You Won! 🎉");
  };

  const handleLoss = (points) => {
    setGameOver(true);
    setWin(false);
    saveStats({ won: false, stats, setStats, word: solution, points, guesses: guesses.length + 1 }); // Save stats with points
    showToast("😔 You Lost! Word is " + solution);
  };

  const calculatePoints = () => {
    // Dynamically calculate total points after this guess and remaining guesses
    const totalPoints = guesses.reduce((total, guess) => {
      let pointsForEachGuess = 0;
      guess.feedback.forEach((status) => {
        if (status === "correct") pointsForEachGuess += 3;
        if (status === "present") pointsForEachGuess += 1;
      });
      return total + pointsForEachGuess;
    }, 0);
    return totalPoints;
  }

  const triggerShake = () => {
    setShakeRowIndex(guesses.length); // Trigger shake for the latest guess row
    setTimeout(() => setShakeRowIndex(null), 30000); // Clear shake after animation duration
  };

  const restartGame = async () => {
    setGameOver(false);
    setWin(false);
    setGuesses([]);
    setGuessedLetters({});
    setLoading(true);
    setDefinitions([]);
    // setPoints(0);
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

  return (
    <div style={styles.container}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={styles.toast}>
          {toastMessage}
        </div>
      )}

      <div style={styles.gameArea}>
        {loading && <p style={styles.modal}>Loading...</p>}
        {error && <p style={styles.modal}>Error: {error}</p>}
        <div style={styles.flexContainer}>
          {/* Most Recent Win Section */}
          {stats.wins.length > 0 && (
            <div style={styles.recentWinContainer}>
              <h3 style={styles.heading}>Most Recent Win</h3>
              <div style={styles.recentWinDetails}>
                <span style={styles.word}>Word: {stats.wins[0].word}</span>
                <span style={styles.points}>Points: {stats.wins[0].points}</span>
                <span style={styles.guesses}>Guesses: {stats.wins[0].guesses}</span>
              </div>
            </div>
          )}
          <div style={styles.gameContent}>
          <div style={styles.gridContainer}>
            {/* Grid and Keyboard in Flex Layout */}
            <div style={styles.gridContainer}>
              <Grid
                guesses={guesses}
                currentGuess={currentGuess}
                shakeRowIndex={shakeRowIndex}
                cellIndex={cellIndex}
                animateCells={animateCells}
                animationTime={animationTime}
              />
            </div>
          </div>
          <div style={styles.keyboardContainer}>
            <Keyboard handleKeyPress={handleKeyPress} guessedLetters={guessedLetters} />
          </div>
        </div>
      </div>
      </div>


      {/* Right Sidebar for Definitions */}
      <div style={styles.definitionArea}>
        <h3 style={styles.heading}>Word Definition: {guesses[guesses.length - 1]?.guess}</h3>
        <div style={styles.definitionBox}>
          {definitions && definitions.length > 0 ? (
            <ul style={styles.definitionList}>
              {definitions.slice(0, 5).map((def, index) => (
                <li key={index}>{def.definition}</li>
              ))}
            </ul>
          ) : (
            <p style={styles.definitionList}>No definition available.</p>
          )}
        </div>

        {/* Include Game Stats Display */}
        <GameStatsDisplay stats={stats} />
      </div>

      {gameOver && (
        <div style={styles.modal}>
          <p>
            {win ? (
              <>
                Congratulations! <br /> 🎉 You Won! 🎉
              </>
            ) : (
              <>
                😔 You Lost! 😔 <br /> Word is <span style={styles.word}> {solution} </span>
              </>
            )}
          </p>
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
    top: "45%",
    left: "55%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "2vw",
    // padding: "20px",
    boxShadow: "0vw 0.2vw 0.4vw rgba(0, 0, 0, 0.2)",
    // boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
    zIndex: 1000,
    textAlign: "center",
  },
  button: {
    marginTop: "0.7vw",
    // marginTop: "10px",
    padding: "0.8vw",
    // padding: "10px",
    backgroundColor: "#007BFF",
    border: "none",
    color: "white",
    borderRadius: "0.2vw",
    // borderRadius: "4px",
    cursor: "pointer",
  },
  toast: {
    position: "fixed",
    bottom: "0.2vw",
    // bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "0.7vw 1.5vw",
    // padding: "10px 20px",
    backgroundColor: "#f44336",
    color: "white",
    borderRadius: "0.2vw",
    // borderRadius: "4px",
    boxShadow: "0vw 0.2vw 0.4vw rgba(0, 0, 0, 0.2)",
    // boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
  },
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "1.3vw",
    // padding: "20px",
  },
  gameArea: {
    flex: 3.5,
    display: "flex",
    flexDirection: "column",
    gap: "2vw",
    // gap: "20px",
  },
  recentWinContainer: {
    backgroundColor: "#f8f9fa",
    padding: "1.2vw",
    // padding: "15px",
    borderRadius: "0.5vw",
    // borderRadius: "8px",
    boxShadow: "0vw 0.2vw 0.4vw rgba(0, 0, 0, 0.1)",
    // boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    // marginBottom: "20px", // Add some spacing from other elements
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  recentWinDetails: {
    display: "flex",
    flexDirection: "column", // Stack details vertically
    alignItems: "flex-start",
  },
  word: {
    fontSize: "1.1vw",
    // fontSize: "16px",
    fontWeight: "600", // Emphasize the word
    marginBottom: "0.3vw",
    // marginBottom: "5px",
    color: "#007BFF", // Blue color for the word
  },
  points: {
    fontSize: "1vw",
    // fontSize: "14px",
    marginBottom: "0.3vw",
    // marginBottom: "5px",
    color: "#28a745", // Green color for points
  },
  guesses: {
    fontSize: "1vw",
    // fontSize: "14px",
    color: "#6c757d", // Gray color for guesses
  },
  flexContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "2vw",
    // gap: "20px", // Space between grid and keyboard
  },
  gameContent: {
    display: "flex",
    flexDirection: "column",  // Stack Grid and Keyboard vertically
    flex: 1,                  // Allow it to take up remaining space
    gap: "1vw",
    // gap: "20px",              // Space between Grid and Keyboard
  },
  gridContainer: {
    flex: 1, // Take up more space
    minWidth: "20vw",
    // minWidth: "300px", // Minimum width to prevent too small
  },
  keyboardContainer: {
    flex: 0.1, // Take less space
    minWidth: "15vw",
    // minWidth: "200px",
  },
  definitionArea: {
    flex: 2,
    padding: "0.7vw",
    // padding: "10px",
    borderLeft: "0.1vw solid #000",
    // borderLeft: "1px solid #000",
    backgroundColor: "#f8f9fa",
    fontSize: "2vw",
    // fontSize: "16px",
  },
  heading: {
    fontSize: "1.3vw",
    // fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "0.5vw",
    // marginBottom: "10px",
    color: "#333",
  },
  definitionBox: {
    marginTop: "0.8vw",
    // marginTop: "10px",
    padding: "0.1vw",
    // padding: "10px",
    border: "0.1vw solid #333",
    // border: "1px solid #333",
    borderRadius: "0.3vw",
    // borderRadius: "5px",
    height: "auto",
    overflowY: "auto",
  },
  definitionList: {
    listStyleType: "bullet", // Use default bullet points | disc
    paddingLeft: "2vw",
    // paddingLeft: "20px",
    fontSize: "1.2vw",
    // fontSize: "16px",
  },
};

export default WordCrazeGame;
