// Initialize the game based on mode
function initGame(mode, canvas1Id, canvas2Id = null) {
    let game;
    switch(mode) {
        case 'basic':
            game = new BasicGame(canvas1Id);
            break;
        case 'powerup':
            game = new PowerUpGame(canvas1Id);
            break;
        case 'twoplayer':
            game = new TwoPlayerGame(canvas1Id, canvas2Id);
            break;
        default:
            throw new Error('Invalid game mode');
    }

    const gameLoop = setInterval(() => {
        game.update();
        game.draw();
    }, GAME_SPEED);

    return game;
}
