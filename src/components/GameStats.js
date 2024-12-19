import React, { useState, useEffect } from "react";
import styles from "../styles/global-styles";

// Function to retrieve stats from localStorage
const getStatsFromStorage = () => {
  return JSON.parse(localStorage.getItem("wordleStats")) || {
    wins: [],
    losses: []
  };
};

// Function to get the current stats (simplifies access to stats)
export const getStats = () => {
  return getStatsFromStorage();
};

// Function to save stats (win or loss), updating the state and localStorage
export const saveStats = ({ won, stats, setStats, word, points , guesses}) => {
  const updatedStats = { ...stats };

  // Calculate points for the current game
  if (won) {
    updatedStats.wins.unshift({ word, points , guesses});
  } else {
    updatedStats.losses.unshift({ word, points , guesses});
  }

  // Save the updated stats to localStorage and update React state
  setStats(updatedStats);
  localStorage.setItem("wordleStats", JSON.stringify(updatedStats));
};

// Custom hook to manage game stats (loading from localStorage)
export const useStats = () => {
  const [stats, setStats] = useState(getStatsFromStorage());

  useEffect(() => {
    setStats(getStatsFromStorage());
  }, []);

  return { stats, setStats };
};

// Component to display game stats (wins and losses with points)
export const GameStatsDisplay = ({ stats }) => {
  const totalWinsPoints = stats?.wins.reduce((total, game) => total + game.points, 0);
  const totalLossesPoints = stats?.losses.reduce((total, game) => total + game.points, 0);

  return (
    <div style={styles.scoreStatsContainer}>
      <div style={styles.scoreStats}>
        <h3 style={styles.heading}>Game Stats</h3>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Wins:</span>
          <span style={styles.statValue}>{stats?.wins.length}</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Losses:</span>
          <span style={styles.statValue}>{stats?.losses.length}</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Total Points from Wins:</span>
          <span style={styles.statValue}>{totalWinsPoints || 0}</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Total Points from Losses:</span>
          <span style={styles.statValue}>{totalLossesPoints || 0}</span>
        </div>
      </div>
    </div>
  );
};
