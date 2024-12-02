class BasicGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.snake = new Snake(5, 5);
        this.food = this.generateFood();
        this.score = 0;
        this.gameOver = false;
        
        this.setupEventListeners();
    }

    generateFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE),
                color: '#FF0000'
            };
        } while (this.snake.body.some(segment => segment.x === food.x && segment.y === food.y));
        return food;
    }

    setupEventListeners() {
        if (this.keydownHandler) {
            document.removeEventListener('keydown', this.keydownHandler);
        }
        this.keydownHandler = (e) => {
            switch(e.key) {
                case 'ArrowUp':
                    if (this.snake.direction !== 'down') this.snake.direction = 'up';
                    break;
                case 'ArrowDown':
                    if (this.snake.direction !== 'up') this.snake.direction = 'down';
                    break;
                case 'ArrowLeft':
                    if (this.snake.direction !== 'right') this.snake.direction = 'left';
                    break;
                case 'ArrowRight':
                    if (this.snake.direction !== 'left') this.snake.direction = 'right';
                    break;
            }
        };
        document.addEventListener('keydown', this.keydownHandler);
    }


    update() {
        if (this.gameOver) return;

        this.snake.move();

        // Check collisions
        if (this.snake.checkCollision(GRID_SIZE)) {
            this.gameOver = true;
            return;
        }

        // Check food collision
        const head = this.snake.body[0];
        if (head.x === this.food.x && head.y === this.food.y) {
            this.snake.growing = true;
            this.score += 10;
            this.food = this.generateFood();
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake
        this.snake.body.forEach(segment => {
            this.ctx.fillStyle = this.snake.color;
            this.ctx.fillRect(
                segment.x * CELL_SIZE,
                segment.y * CELL_SIZE,
                CELL_SIZE - 1,
                CELL_SIZE - 1
            );
        });

        // Draw food
        this.ctx.fillStyle = this.food.color;
        this.ctx.fillRect(
            this.food.x * CELL_SIZE,
            this.food.y * CELL_SIZE,
            CELL_SIZE - 1,
            CELL_SIZE - 1
        );

        // Draw score
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Pontszám: ${this.score}`, 10, 30);

        if (this.gameOver) {
            this.ctx.fillStyle = '#ff0000';
            this.ctx.font = '40px Arial';
            this.ctx.fillText('Game Over!', this.canvas.width / 2 - 100, this.canvas.height / 2);
        }
    }

    reset() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.snake = new Snake(5, 5);
        this.food = this.generateFood();
        this.score = 0;
        this.gameOver = false;
    }

    
    removeEventListeners() {
    document.removeEventListener('keydown', this.keydownHandler);
  }

}
