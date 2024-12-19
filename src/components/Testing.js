import React from "react";

function Testing() {
  const styles = {
    gridContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "20px",
    },
    nestedGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "10px",
    },
    gridItem: {
      backgroundColor: "#FFC107",
      color: "#000",
      textAlign: "center",
      padding: "20px",
      borderRadius: "5px",
    },
    nestedItem: {
      backgroundColor: "#FFC107",
      color: "#000",
      textAlign: "center",
      padding: "20px",
      borderRadius: "5px",
    },

    flexContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "20px",
    },
    flexItem: {
      flex: "1 1 calc(33.33% - 20px)", // Flex-basis for 3 items per row with gap
      backgroundColor: "#FFC107",
      color: "#000",
      textAlign: "center",
      padding: "20px",
      borderRadius: "5px",
      boxSizing: "border-box",
    },
    nestedContainer: {
      display: "flex",
      gap: "10px",
    },
    nestedItem: {
      flex: "1",
      backgroundColor: "#FFC107",
      color: "#000",
      textAlign: "center",
      padding: "20px",
      borderRadius: "5px",
    },
  };

  return (
    <div> 
    Using display: Grid
    <div style={styles.gridContainer}>
      <div style={styles.gridItem}>1</div>
      <div style={styles.gridItem}>2</div>
      <div style={styles.gridItem}>
        <div style={styles.nestedGrid}>
          <div style={styles.nestedItem}>A</div>
          <div style={styles.nestedItem}>B</div>
        </div>
      </div>
      <div style={styles.gridItem}>4</div>
    </div>
    <br/>
    Using display: Flex / FlexBox
    <div style={styles.flexContainer}>
    <div style={styles.flexItem}>1</div>
    <div style={styles.flexItem}>2</div>
    <div style={styles.flexItem}>
      <div style={styles.nestedContainer}>
        <div style={styles.nestedItem}>A</div>
        <div style={styles.nestedItem}>B</div>
      </div>
    </div>
    <div style={styles.flexItem}>4</div>
    </div>    
    </div>
  );
}

export default Testing;
