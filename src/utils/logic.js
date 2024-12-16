export function checkGuess(solution, guess) {
    const feedback = Array(5).fill("absent");
  
    const solutionArr = solution.split("");
  
    // Check for correct positions
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === solutionArr[i]) {
        feedback[i] = "correct";
        solutionArr[i] = null; // Mark as checked
      }
    }
  
    // Check for correct letters in wrong positions
    for (let i = 0; i < guess.length; i++) {
      if (feedback[i] === "correct") continue;
      const index = solutionArr.indexOf(guess[i]);
      if (index !== -1) {
        feedback[i] = "present";
        solutionArr[index] = null; // Mark as checked
      }
    }
  
    return feedback;
  }
  