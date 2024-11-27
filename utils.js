// utils.js - Shared utilities and constants
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const GAME_SPEED = 100;

class Snake {
    constructor(startX, startY, color = '#4CAF50') {
        this.body = [{x: startX, y: startY}];
        this.direction = 'right';
        this.color = color;
        this.growing = false;
        this.abilities = new Set();
    }

    move() {
        const head = {...this.body[0]};
        
        switch(this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        this.body.unshift(head);
        if (!this.growing) {
            this.body.pop();
        }
        this.growing = false;
    }

    checkCollision(gridSize) {
        const head = this.body[0];
        // Wall collision
        if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
            return true;
        }
        // Self collision
        return this.body.slice(1).some(segment => 
            segment.x === head.x && segment.y === head.y
        );
    }
}
