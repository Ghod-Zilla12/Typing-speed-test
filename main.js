let timer;
let timeLeft = 60;
let isPlaying = false;
let currentPassage = "";
let correctChars = 0;

// Gather structural DOM hooks
const display = document.getElementById('passage-container');
const inputField = document.getElementById('typing-input');
const wpmDisplay = document.getElementById('wpm-val');
const startBtn = document.getElementById('start-btn');
const passageWrapper = document.querySelector('.passage-wrapper');
const difficultySelect = document.getElementById('difficulty-select');

// Fetch logic configured from your repository setup
async function loadQuote(difficulty = 'hard') {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    const category = data[difficulty];
    const randomIndex = Math.floor(Math.random() * category.length);
    
    currentPassage = category[randomIndex].text;
    renderPassage(currentPassage);
  } catch (err) {
    console.error("Error loading passage data:", err);
    // Fallback text if the json file can't be read directly
    currentPassage = "The archaeological expedition unearthed artifacts that complicated prevailing theories.";
    renderPassage(currentPassage);
  }
}

function renderPassage(text) {
  display.innerHTML = '';
  text.split('').forEach(char => {
    const span = document.createElement('span');
    span.innerText = char;
    span.classList.add('char');
    display.appendChild(span);
  });
}

// Watch inputs entered by the user
inputField.addEventListener('input', () => {
  if (!isPlaying) startTimer();

  const arrayQuote = display.querySelectorAll('span');
  const arrayValue = inputField.value.split('');
  correctChars = 0;

  arrayQuote.forEach((span, index) => {
    const char = arrayValue[index];
    if (char == null) {
      span.className = 'char';
    } else if (char === span.innerText) {
      span.className = 'char correct';
      correctChars++;
    } else {
      span.className = 'char incorrect';
    }
  });

  if (arrayValue.length === arrayQuote.length) {
    gameOver();
  }
});

function startTimer() {
  isPlaying = true;
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      document.getElementById('timer-val').innerText = timeLeft;
      calculateWPM();
    } else {
      gameOver();
    }
  }, 1000);
}

function calculateWPM() {
  const timePassed = (60 - timeLeft) / 60;
  const wpm = Math.round((correctChars / 5) / timePassed);
  wpmDisplay.innerText = wpm > 0 ? wpm : 0;
}

function gameOver() {
  clearInterval(timer);
  isPlaying = false;
  inputField.disabled = true;
  alert("Test Complete! Your WPM: " + wpmDisplay.innerText);
}

function resetGame() {
  clearInterval(timer);
  timeLeft = 60;
  isPlaying = false;
  inputField.value = "";
  inputField.disabled = false;
  document.getElementById('timer-val').innerText = timeLeft;
  wpmDisplay.innerText = "0";
}

// Start Button UI Unlocking Trigger
startBtn.addEventListener('click', () => {
  passageWrapper.classList.remove('locked');
  inputField.focus();
});

// Dropdown Action Listener (Replaces the broken button mapping)
difficultySelect.addEventListener('change', (e) => {
  resetGame();
  passageWrapper.classList.add('locked'); // Relocks view on switch
  loadQuote(e.target.value);
});

// Initializing application instance
loadQuote('hard');
