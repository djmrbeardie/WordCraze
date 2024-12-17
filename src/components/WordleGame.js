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


  useEffect(() => {
    // Fetch word from API when the component is first rendered
    async function fetchSolution() {
        try {
          const response = await fetch("https://random-word-api.herokuapp.com/word?length=5");
      
          if (!response.ok) {
            throw new Error("Failed to fetch word");
          }
      
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setSolution(data[0].toUpperCase());
          } else {
            throw new Error("No word returned from API");
          }
      
          setLoading(false);
        } catch (err) {
          console.error("Error fetching word:", err);
          setError(err.message);
        }
      }      

    fetchSolution();
  }, []);

  const handleKeyPress = async (key) => {
    if (key === "Enter") {
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
    </div>
  );
}

export default WordleGame;
