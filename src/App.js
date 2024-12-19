import logo from './logo.svg';
import './App.css';
import WordCrazeGame from "./components/WordCrazeGame";
import './styles/styles.css';
import { GameStatsDisplay, useStats, saveStats } from "./components/GameStats";
import React, { useState, useEffect } from "react";
import Testing from './components/Testing';


function App() {
  const [showStartButton, setShowStartButton] = useState(true);
  const [animationTime] = useState(1000)
  const {stats, setStats } = useStats();


  // Listen for keyboard events
  useEffect(() => {
    const handlePhysicalKeyPress = (event) => {
      if (event.key === "Enter" && showStartButton) {
        handleStartGame();
      }    
    };

    window.addEventListener("keydown", handlePhysicalKeyPress);

    // Cleanup listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handlePhysicalKeyPress);
    };
  }, [showStartButton]); 

  const handleStartGame = () => {
    setShowStartButton(false); // Switch to game UI
  };

  return (
    <div className="App">
      <div style={styles.welcomeContainer}>
        <h1 style={styles.title}>✨ WordCraze ✨</h1>
        <p style={styles.description}>
          A fun word-guessing game inspired by Wordle. Can you guess the word in 6 attempts or less?
        </p>
      </div>
      
      {/* Include Game Stats Display */}
      {/* <GameStatsDisplay stats={stats}/> */}

      {/* Testing  */}
      {/* <Testing /> */}

      {showStartButton ? (
          <button onClick={handleStartGame} style={styles.startButton}>
          Start Game
        </button>
      ) : (
        <WordCrazeGame animationTime={animationTime}/>
      )}
    </div>
  );

}

const styles = {
  welcomeContainer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#f4f4f9",
    borderBottom: "1px solid #ddd",
  },
  title: {
    fontSize: "36px",
    color: "#333",
    marginBottom: "5px",
  },
  description: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "15px",
    maxWidth: "500px",
    textAlign: "center",
  },
  startButton: {
    display: "block",
    margin: "30px auto",
    padding: "12px 30px",
    fontSize: "16px",
    backgroundColor: "#007BFF",
    border: "none",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease-in-out",
  },
};

export default App;
