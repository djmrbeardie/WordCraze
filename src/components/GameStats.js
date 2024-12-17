import React, { useState, useEffect } from "react";
import styles from '../styles/global-styles'

const getStatsFromStorage = () => {
    return JSON.parse(localStorage.getItem("wordleStats")) || { wins: 0, losses: 0 };
  };
  
  export const getStats = () => {
    return getStatsFromStorage();
  };
  
  export const saveStats = ({ won, stats, setStats }) => {
    const updatedStats = won
      ? { ...stats, wins: stats.wins + 1 }
      : { ...stats, losses: stats.losses + 1 };
  
    setStats(updatedStats);
    localStorage.setItem("wordleStats", JSON.stringify(updatedStats));
  };
  
  export const useStats = () => {
    const [stats, setStats] = useState(getStatsFromStorage());
  
    useEffect(() => {
      setStats(getStatsFromStorage());
    }, []);
  
    return { stats, setStats };
  };
  
// Component to display the stats
export const GameStatsDisplay = ({ stats }) => {
    return (
      <div style={styles.scoreStatsContainer}>
        <div style={styles.scoreStats}>
          <h3 style={styles.heading}>Game Stats</h3>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Wins:</span>
            <span style={styles.statValue}>{stats?.wins}</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Losses:</span>
            <span style={styles.statValue}>{stats?.losses}</span>
          </div>
        </div>
      </div>
    );
  };