const canvas1 = document.getElementById('player1');
const canvas2 = document.getElementById('player2');
const ctx1 = canvas1.getContext('2d');
const ctx2 = canvas2.getContext('2d');
const player1WinsElement = document.getElementById('player1Wins');
const player2WinsElement = document.getElementById('player2Wins');

const GRID_SIZE = 20;
const CELL_SIZE = 20;

let snake1, snake2, direction1, direction2, apple1, apple2, gameOver;
let player1Wins = 0;
let player2Wins = 0;

// Az állapotok inicializálása
function initializeGame() {
    snake1 = [{ x: 2, y: 2 }];
    snake2 = [{ x: 12, y: 12 }];
    direction1 = { x: 0, y: 1 }; // Player 1 iránya (lefele)
    direction2 = { x: 0, y: -1 }; // Player 2 iránya (felfele)
    apple1 = generateApple(snake1);
    apple2 = generateApple(snake2);
    gameOver = false;

    // Vásznak törlése
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
}

// Alma generálása
function generateApple(snake) {
    let apple;
    do {
        apple = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
    } while (snake.some(segment => segment.x === apple.x && segment.y === apple.y));
    return apple;
}

// Kígyó frissítése
function updateSnake(snake, direction, apple) {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    if (head.x < 0 || head.y < 0 || head.x >= GRID_SIZE || head.y >= GRID_SIZE || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        return false; // Kígyó meghal
    }
    snake.unshift(head);
    if (head.x === apple.x && head.y === apple.y) {
        return true; // Alma megevése
    }
    snake.pop(); // Mozgás előre
    return null; // Semmi különös
}

// Vászon kirajzolása
function draw(ctx, snake, apple) {
    ctx.clearRect(0, 0, canvas1.width, canvas1.height);
    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x * CELL_SIZE, apple.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    ctx.fillStyle = 'green';
    for (const segment of snake) {
        ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
    
}

// Játék fő ciklusa
function gameLoop() {
    if (gameOver) return;

    const result1 = updateSnake(snake1, direction1, apple1);
    const result2 = updateSnake(snake2, direction2, apple2);

    if (result1 === false || result2 === false) {
        gameOver = true;
        if (result1 === false) {
            player2Wins++;
            player2WinsElement.textContent = player2Wins;
        } else {
            player1Wins++;
            player1WinsElement.textContent = player1Wins;
        }
        return;
    }

    if (result1 === true) apple1 = generateApple(snake1);
    if (result2 === true) apple2 = generateApple(snake2);

    draw(ctx1, snake1, apple1);
    draw(ctx2, snake2, apple2);

    setTimeout(gameLoop, 150);
}

// Billentyűzetes vezérlés
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        // Player 1 (WASD)
        case 'w': if (direction1.y === 0) direction1 = { x: 0, y: -1 }; break;
        case 's': if (direction1.y === 0) direction1 = { x: 0, y: 1 }; break;
        case 'a': if (direction1.x === 0) direction1 = { x: -1, y: 0 }; break;
        case 'd': if (direction1.x === 0) direction1 = { x: 1, y: 0 }; break;
        // Player 2 (Arrow keys)
        case 'ArrowUp': if (direction2.y === 0) direction2 = { x: 0, y: -1 }; break;
        case 'ArrowDown': if (direction2.y === 0) direction2 = { x: 0, y: 1 }; break;
        case 'ArrowLeft': if (direction2.x === 0) direction2 = { x: -1, y: 0 }; break;
        case 'ArrowRight': if (direction2.x === 0) direction2 = { x: 1, y: 0 }; break;
    }
});

// Gomb eseménykezelő
document.getElementById('startBtn').addEventListener('click', () => {
    initializeGame();
    gameLoop();
});

// Kezdeti inicializálás
initializeGame();
