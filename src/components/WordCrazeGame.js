import React, { useState, useEffect } from "react";
import Grid from "./Grid";
import Keyboard from "./Keyboard";
import { checkGuess } from "../utils/logic";
import { checkWord } from "../utils/wordValidation";
import { GameStatsDisplay, useStats, saveStats } from "./GameStats";


function WordCrazeGame({animationTime}) {
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
  const [definitions, setDefinitions] = useState(null)
  const {stats, setStats } = useStats();


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
                setCurrentGuess("");    
                setCellIndex(0); // Prevent going below 0
                showToast("Word: " + solution);
                setAnimateCells(true);
                setTimeout(() => {
                    setAnimateCells(false);
                  }, animationTime); // Wait for the animation
            }
            else{
                triggerShake();
                showToast("Invalid word!");
            }
      }
    }
    else if(key === "Enter" && gameOver){
      restartGame();
    }
    else if (key === "Backspace") {
      setCurrentGuess(currentGuess.slice(0, -1));    
      setCellIndex(prevIndex => Math.max(0, prevIndex - 1)); // Prevent going below 0
    } else if (currentGuess.length < 5 && /^[a-zA-Z]$/.test(key)) {
        setCurrentGuess(currentGuess + key.toUpperCase());
        setCellIndex(prevIndex => Math.min(4, prevIndex + 1)); // Prevent going above index 4
    }
  };

  const handleWin = () => {
    setGameOver(true);
    setWin(true);
    setCurrentGuess("");
    saveStats({ won: true, stats, setStats });
    showToast("Congratulations! 🎉 You Won! 🎉");
  };

  const handleLoss = () => {
    setGameOver(true);
    setWin(false);
    saveStats({ won: false, stats, setStats });
    showToast("😔 You Lost!");
  };

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

    // alert(message); // Replace this with better toast handling later if needed
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
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        <Grid guesses={guesses} currentGuess={currentGuess} shakeRowIndex={shakeRowIndex} cellIndex={cellIndex} animateCells={animateCells} animationTime={animationTime} />
        <Keyboard handleKeyPress={handleKeyPress} guessedLetters={guessedLetters} />
      </div>

       {/* Right Sidebar for Definitions */}
      <div style={styles.definitionArea}>
        <h3>Word Definition: {guesses[guesses.length - 1]?.guess}</h3>
        <div style={styles.definitionBox}>
          {definitions && definitions.length > 0 ? (
            <ul style={styles.definitionList}>
              {definitions.slice(0, 5).map((def, index) => (
                <li key={index}>{def.definition}</li>
              ))}
            </ul>
          ) : (
            <p>No definition available.</p>
          )}
        </div>
      
      {/* Include Game Stats Display */}
      <GameStatsDisplay stats={stats}/>
      
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
                😔 You Lost! 😔
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
    toast: {
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
    },
    container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      padding: "20px",
    },
    gameArea: {
      flex: 3.5,
      display: "flex",
      flexDirection: "column",
      // gap: "20px",
    },
    definitionArea: {
      flex: 2,
      padding: "10px",
      borderLeft: "1px solid #000",
      backgroundColor: "#f8f9fa",
      fontSize: "16px",
    },
    definitionBox: {
      marginTop: "10px",
      padding: "10px",
      border: "1px solid #333",
      borderRadius: "5px",
      height: "250px",
      overflowY: "auto",
    },
    definitionList: {
      listStyleType: "bullet", // Use default bullet points | disc
      paddingLeft: "20px",
      fontSize: "16px",
    },
};

export default WordCrazeGame;
