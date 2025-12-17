// DOM Elements
const display = document.getElementById('display');
const startPauseBtn = document.getElementById('startPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapList = document.getElementById('lapList');

// State Variables
let isRunning = false;
let startTime = 0;
let elapsedTime = 0;
let lapStartTime = 0;
let intervalId = null;
let lapCount = 0;

// Format time as HH:MM:SS:MS
function formatTime(ms) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10); // Two digits
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;
}

// Update display
function updateDisplay() {
    display.textContent = formatTime(elapsedTime);
}

// Start/Pause logic
startPauseBtn.addEventListener('click', function() {
    if (isRunning) {
        // Pause
        clearInterval(intervalId);
        isRunning = false;
        startPauseBtn.textContent = 'Start';
        startPauseBtn.classList.remove('running');
    } else {
        // Start
        startTime = Date.now() - elapsedTime; // Adjust for paused time
        lapStartTime = Date.now() - (elapsedTime - (lapStartTime ? lapStartTime : 0)); // For lap tracking
        intervalId = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            updateDisplay();
        }, 10); // Update every 10ms for smoothness
        isRunning = true;
        startPauseBtn.textContent = 'Pause';
        startPauseBtn.classList.add('running');
    }
});

// Reset logic
resetBtn.addEventListener('click', function() {
    clearInterval(intervalId);
    isRunning = false;
    elapsedTime = 0;
    lapStartTime = 0;
    lapCount = 0;
    updateDisplay();
    startPauseBtn.textContent = 'Start';
    startPauseBtn.classList.remove('running');
    lapList.innerHTML = ''; // Clear lap history
});

// Lap logic
lapBtn.addEventListener('click', function() {
    if (isRunning) {
        lapCount++;
        const currentTime = Date.now();
        const lapTime = currentTime - lapStartTime;
        lapStartTime = currentTime; // Reset for next lap
        const lapItem = document.createElement('li');
        lapItem.innerHTML = `<span>Lap ${lapCount}</span><span>${formatTime(lapTime)}</span>`;
        lapList.appendChild(lapItem);
    }
});