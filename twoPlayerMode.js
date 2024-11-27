
// twoPlayerMode.js - Two player split-screen mode
class TwoPlayerGame {
    constructor(canvas1Id, canvas2Id) {
        this.game1 = new BasicGame(canvas1Id);
        this.game2 = new BasicGame(canvas2Id);
        this.gameOver = false;
        
        this.setupTwoPlayerControls();
    }

    setupTwoPlayerControls() {
        document.addEventListener('keydown', (e) => {
            // Player 1 controls (WASD)
            switch(e.key.toLowerCase()) {
                case 'w':
                    if (this.game1.snake.direction !== 'down') this.game1.snake.direction = 'up';
                    break;
                case 's':
                    if (this.game1.snake.direction !== 'up') this.game1.snake.direction = 'down';
                    break;
                case 'a':
                    if (this.game1.snake.direction !== 'right') this.game1.snake.direction = 'left';
                    break;
                case 'd':
                    if (this.game1.snake.direction !== 'left') this.game1.snake.direction = 'right';
                    break;
            }
            
            // Player 2 controls (Arrow keys)
            switch(e.key) {
                case 'ArrowUp':
                    if (this.game2.snake.direction !== 'down') this.game2.snake.direction = 'up';
                    break;
                case 'ArrowDown':
                    if (this.game2.snake.direction !== 'up') this.game2.snake.direction = 'down';
                    break;
                case 'ArrowLeft':
                    if (this.game2.snake.direction !== 'right') this.game2.snake.direction = 'left';
                    break;
                case 'ArrowRight':
                    if (this.game2.snake.direction !== 'left') this.game2.snake.direction = 'right';
                    break;
            }
        });
    }

    update() {
        if (!this.gameOver) {
            this.game1.update();
            this.game2.update();
            
            if (this.game1.gameOver && this.game2.gameOver) {
                this.gameOver = true;
                this.determineWinner();
            }
        }
    }

    determineWinner() {
        if (this.game1.score > this.game2.score) {
            this.winner = 'Player 1';
        } else if (this.game2.score > this.game1.score) {
            this.winner = 'Player 2';
        } else {
            this.winner = 'Tie';
        }
    }

    draw() {
        this.game1.draw();
        this.game2.draw();
        
        if (this.gameOver) {
            // Draw winner announcement on both canvases
            [this.game1.ctx, this.game2.ctx].forEach(ctx => {
                ctx.fillStyle = '#ff0000';
                ctx.font = '30px Arial';
                ctx.fillText(`Winner: ${this.winner}!`, 
                    ctx.canvas.width/2 - 80, 
                    ctx.canvas.height/2 + 40
                );
            });
        }
    }
}
