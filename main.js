let currentGame = null;
let currentMode = 'basic';
let highScore = 0;

// DOM elements
const modeButtons = document.querySelectorAll('.mode-btn');
const singlePlayerDiv = document.getElementById('single-player');
const twoPlayerDiv = document.getElementById('two-player');
const powerUpLegend = document.getElementById('powerUpLegend');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const highScoreElement = document.getElementById('high-score');

// Mode selection
modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        modeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Update mode
        currentMode = button.dataset.mode;

        // Show/hide relevant elements
        if (currentMode === 'twoplayer') {
            singlePlayerDiv.classList.remove('active');
            twoPlayerDiv.classList.add('active');
            powerUpLegend.classList.remove('active');
        } else {
            singlePlayerDiv.classList.add('active');
            twoPlayerDiv.classList.remove('active');
            powerUpLegend.classList.toggle('active', currentMode === 'powerup');
        }

        // Reset game if one is in progress
        if (currentGame) {
            stopGame();
        }
    });
});

// Start game
startBtn.addEventListener('click', () => {
    startBtn.classList.add('hidden');
    restartBtn.classList.remove('hidden');
    
    if (currentMode === 'twoplayer') {
        currentGame = initGame('twoplayer', 'player1Canvas', 'player2Canvas');
    } else {
        currentGame = initGame(currentMode, 'gameCanvas');
    }

    // Update high score for single player modes
    if (currentMode !== 'twoplayer') {
        const scoreCheck = setInterval(() => {
            if (currentGame.score > highScore) {
                highScore = currentGame.score;
                highScoreElement.textContent = highScore;
            }
            if (currentGame.gameOver) {
                clearInterval(scoreCheck);
            }
        }, 100);
    }
});

// Restart game
restartBtn.addEventListener('click', () => {
    stopGame();
    startBtn.click(); // Reuse start game logic
});

function stopGame() {
    if (currentGame) {
        // Töröld az időzítőt
        if (currentGame.gameLoop) {
            clearInterval(currentGame.gameLoop);
        }
        // Reset állapot
        currentGame.reset();
    }
}
