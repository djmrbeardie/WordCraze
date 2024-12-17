export async function checkWord(word) {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    //   const response = await fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(word)}`);

  
      if (!response.ok) {
        // If the response isn't OK, throw an error
        throw new Error("Word not found or invalid");
      }
  
      const data = await response.json();

      // Check if the response data is empty
      if (!Array.isArray(data) || data.length === 0 || data[0].word.toUpperCase() !== word) {
        throw new Error("Word not found or invalid");
    }
  
      return { isValid: true, data };
    } catch (err) {
      console.error("Error validating word:", err);
      return { isValid: false };
    }
  }
  