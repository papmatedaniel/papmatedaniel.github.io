

// Initialize the game based on mode
function initGame(mode, canvas1Id, canvas2Id = null) {
    let game;

    switch (mode) {
        case 'basic':
            game = new BasicGame(canvas1Id);
            break;
        case 'powerup':
                game = new PowerUpGame(canvas1Id);
                break;
        case 'twoplayer':
            game = new TwoPlayerGame(canvas1Id, canvas2Id);
            break;
        // Ha a jövőben bővítenéd további játékmódokkal:
        // case 'advanced':
        //     game = new AdvancedGame(canvas1Id);
        //     break;

        default:
            throw new Error('Invalid game mode');
    }

    // Létrehozunk egy játékciklust a példányra, hogy egyedi időzítőt tudjunk kezelni
    game.gameLoop = setInterval(() => {
        game.update();
        game.draw();
    }, GAME_SPEED);

    return game;
}
