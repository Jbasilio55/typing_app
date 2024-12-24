async function getWords() {
  try {
    let words = [];
    const res = await fetch(
      "https://random-word-api.herokuapp.com/word?number=300"
    );

    if (!res.ok) {
      throw new Error("Could not fetch resource");
    }

    const data = await res.json();
    words = shuffleArray(data).join(" ");
    initializeApp(words);
  } catch (error) {
    console.log(error);
  }
}

// Shuffle words in array
function shuffleArray(array) {
  // Starting at the last element, iterate down to 1
  for (let i = array.length - 1; i > 0; i--) {
    // Pick random index in array
    const j = Math.floor(Math.random() * (i + 1));
    // Shuffle array by swapping i and j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function initializeApp(words) {
  const textContainer = document.getElementById("text-container");
  const timer = document.getElementById("timer");
  const tryAgainBtn = document.getElementById("try-again");
  const finalScore = document.getElementById("final-score");
  textContainer.textContent = words;
}

getWords();
