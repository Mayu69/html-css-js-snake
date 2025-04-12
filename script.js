// script.js - A Simple Snake Game

// --- Game Canvas and Context ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- Score Display ---
const scoreDisplay = document.getElementById('score');

// --- Game Constants ---
const gridSize = 20; // Size of each grid cell
let snake = [{ x: gridSize * 10, y: gridSize * 10 }]; // Initial snake position (head)
let food = generateFoodPosition();
let dx = gridSize; // Initial horizontal direction (moving right)
let dy = 0;      // Initial vertical direction
let score = 0;
let gameInterval;
const gameSpeed = 120; // Milliseconds per game update (lower is faster)

// --- Functions ---

function generateFoodPosition() {
    let newFood;
    while (!newFood || snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        newFood = {
            x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
            y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
        };
    }
    return newFood;
}

function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? 'lime' : 'green'; // Head color slightly different
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.strokeRect(segment.x, segment.y, gridSize, gridSize);
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.strokeRect(food.x, food.y, gridSize, gridSize);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head); // Add new head at the beginning

    const ateFood = head.x === food.x && head.y === food.y;
    if (ateFood) {
        score++;
        scoreDisplay.textContent = score;
        food = generateFoodPosition();
    } else {
        snake.pop(); // Remove the tail
    }
}

function checkCollision() {
    const head = snake[0];

    // Check for wall collision
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }

    // Check for self-collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

function changeDirection(newDirection) {
    // Prevent immediate 180-degree turns
    if (newDirection === 'up' && dy === gridSize) return;
    if (newDirection === 'down' && dy === -gridSize) return;
    if (newDirection === 'left' && dx === gridSize) return;
    if (newDirection === 'right' && dx === -gridSize) return;

    switch (newDirection) {
        case 'up':
            dx = 0;
            dy = -gridSize;
            break;
        case 'down':
            dx = 0;
            dy = gridSize;
            break;
        case 'left':
            dx = -gridSize;
            dy = 0;
            break;
        case 'right':
            dx = gridSize;
            dy = 0;
            break;
    }
}

function gameLoop() {
    if (checkCollision()) {
        clearInterval(gameInterval);
        alert(`Game Over! Your score: ${score}`);
        resetGame();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    moveSnake();
    drawSnake();
}

function resetGame() {
    snake = [{ x: gridSize * 10, y: gridSize * 10 }];
    food = generateFoodPosition();
    dx = gridSize;
    dy = 0;
    score = 0;
    scoreDisplay.textContent = score;
    clearInterval(gameInterval);
    startGame();
}

function startGame() {
    gameInterval = setInterval(gameLoop, gameSpeed);
}

// --- Event Listeners ---

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            changeDirection('up');
            break;
        case 'ArrowDown':
            changeDirection('down');
            break;
        case 'ArrowLeft':
            changeDirection('left');
            break;
        case 'ArrowRight':
            changeDirection('right');
            break;
    }
});

// --- Initialization ---
startGame();
