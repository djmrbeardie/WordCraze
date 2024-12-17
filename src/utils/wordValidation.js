export async function checkWord(word) {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
  
      if (!response.ok) {
        // If the response isn't OK, throw an error
        throw new Error("Word not found or invalid");
      }
  
      const data = await response.json();
      console.log(data); // Optional: Log the data for debugging
  
      return { isValid: true, data };
    } catch (err) {
      console.error("Error validating word:", err);
      return { isValid: false };
    }
  }
  