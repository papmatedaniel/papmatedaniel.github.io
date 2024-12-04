class PowerUpGame extends BasicGame {
    constructor(canvasId) {
        super(canvasId);
        this.powerUps = [];
        this.activeTimeouts = []; // Aktív időzítők listája
        this.powerUpTypes = {
            speed: { 
                color: '#FFD700', 
                duration: 5000, 
                effect: () => this.setGameSpeed(50) 
            },
            ghost: { 
                color: '#87CEEB', 
                duration: 3000, 
                effect: () => this.snake.abilities.add('ghost') 
            },
            slow: { 
                color: '#8A2BE2', 
                duration: 5000, 
                effect: () => this.setGameSpeed(200) 
            },
            wallPass: { 
                color: '#00FA9A', 
                duration: 5000, 
                effect: () => this.snake.abilities.add('wallPass') 
            },
            freeze: { 
                color: '#DC143C', 
                duration: 3000, 
                effect: () => this.freezeGame() 
            }
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

        const timeoutId = setTimeout(() => {
            clearInterval(this.gameLoop);
            this.gameLoop = setInterval(() => {
                this.update();
                this.draw();
            }, GAME_SPEED);
        }, this.powerUpTypes.speed.duration);

        this.activeTimeouts.push(timeoutId); // Időzítő mentése
    }

    freezeGame() {
        clearInterval(this.gameLoop);
        const timeoutId = setTimeout(() => {
            this.gameLoop = setInterval(() => {
                this.update();
                this.draw();
            }, GAME_SPEED);
        }, 3000);

        this.activeTimeouts.push(timeoutId); // Időzítő mentése
    }

    clearActiveTimeouts() {
        this.activeTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
        this.activeTimeouts = [];
    }

    resetGame() {
        this.clearActiveTimeouts(); // Minden aktív időzítő törlése
        this.powerUps = [];
        if (this.snake) {
            this.snake.abilities.clear();
        }

        clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => {
            this.update();
            this.draw();
        }, GAME_SPEED);

        this.snake = new Snake();
        this.food = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };

        for (let i = 0; i < 3; i++) {
            this.powerUps.push(this.generatePowerUp());
        }

        this.gameOver = false;
        this.score = 0;
    }

    update() {
        super.update();
        if (this.gameOver) return;

        // Power-up generálása gyakrabban
        if (Math.random() < 0.05 && this.powerUps.length < 3) {
            this.powerUps.push(this.generatePowerUp());
        }

        const head = this.snake.body[0];
        this.powerUps = this.powerUps.filter(powerUp => {
            if (head.x === powerUp.x && head.y === powerUp.y) {
                const type = this.powerUpTypes[powerUp.type];
                type.effect();
                const timeoutId = setTimeout(() => {
                    this.snake.abilities.delete(powerUp.type);
                }, type.duration);

                this.activeTimeouts.push(timeoutId); // Időzítő mentése
                return false;
            }
            return true;
        });

        if (this.snake.abilities.has('wallPass')) {
            if (head.x < 0) head.x = GRID_SIZE - 1;
            else if (head.x >= GRID_SIZE) head.x = 0;
            if (head.y < 0) head.y = GRID_SIZE - 1;
            else if (head.y >= GRID_SIZE) head.y = 0;
        } else {
            if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
                this.gameOver = true;
            }
        }
    }

    draw() {
        super.draw();

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
