

// powerUpMode.js - Game mode with special abilities
class PowerUpGame extends BasicGame {
    constructor(canvasId) {
        super(canvasId);
        this.powerUps = [];
        this.powerUpTypes = {
            speed: { color: '#FFD700', duration: 5000, effect: () => this.setGameSpeed(50) },
            ghost: { color: '#87CEEB', duration: 3000, effect: () => this.snake.abilities.add('ghost') },
            double: { color: '#FF69B4', duration: 4000, effect: () => this.snake.growing = true }
        };
    }

    generatePowerUp() {
        const types = Object.keys(this.powerUpTypes);
        const type = types[Math.floor(Math.random() * types.length)];
        return {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
            type: type,
            color: this.powerUpTypes[type].color
        };
    }

    setGameSpeed(speed) {
        clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => {
            this.update();
            this.draw();
        }, speed);
        
        setTimeout(() => {
            clearInterval(this.gameLoop);
            this.gameLoop = setInterval(() => {
                this.update();
                this.draw();
            }, GAME_SPEED);
        }, this.powerUpTypes.speed.duration);
    }

    update() {
        super.update();
        if (this.gameOver) return;

        // Generate power-up occasionally
        if (Math.random() < 0.01 && this.powerUps.length < 3) {
            this.powerUps.push(this.generatePowerUp());
        }

        // Check power-up collisions
        const head = this.snake.body[0];
        this.powerUps = this.powerUps.filter(powerUp => {
            if (head.x === powerUp.x && head.y === powerUp.y) {
                const type = this.powerUpTypes[powerUp.type];
                type.effect();
                setTimeout(() => {
                    this.snake.abilities.delete(powerUp.type);
                }, type.duration);
                return false;
            }
            return true;
        });
    }

    draw() {
        super.draw();
        
        // Draw power-ups
        this.powerUps.forEach(powerUp => {
            this.ctx.fillStyle = powerUp.color;
            this.ctx.fillRect(
                powerUp.x * CELL_SIZE,
                powerUp.y * CELL_SIZE,
                CELL_SIZE - 1,
                CELL_SIZE - 1
            );
        });
    }
}
