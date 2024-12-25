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

  let totalTyped = "";
  let currCharIndex = 0;
  let errors = 0;

  textContainer.textContent = words;

  //Handle typing over the displayed text and scrolling
  document.addEventListener("keydown", (e) => {
    if (e.key === "Backspace") {
      if (totalTyped.length > 0) {
        currCharIndex = Math.max(currCharIndex - 1, 0);
        totalTyped = totalTyped.slice(0, -1);
      }
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      totalTyped += e.key;
      currCharIndex++;
    }

    const textArray = words.split("");
    textContainer.innerText = "";
    errors = 0;

    for (let i = 0; i < textArray.length; i++) {
      const span = document.createElement("span");

      if (i < totalTyped.length) {
        if (totalTyped[i] === textArray[i]) {
          span.classList.add("correct");
        } else {
          span.classList.add("incorrect");
          errors++;
        }
      }

      span.textContent = textArray[i];
      textContainer.appendChild(span);
    }

    //Scroll the container after 20 char
    if (totalTyped.length >= 20) {
      const scrollAmount = (totalTyped.length - 20) * 14;
      textContainer.scrollLeft = scrollAmount;
    }
  });
}

getWords();
