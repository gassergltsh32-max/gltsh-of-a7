// Main game initialization
let game;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the game
    game = new Game();
    
    // Add click handler for audio context (required by browsers)
    document.addEventListener('click', () => {
        if (game.audioManager && game.audioManager.audioContext && 
            game.audioManager.audioContext.state === 'suspended') {
            game.audioManager.audioContext.resume();
        }
    }, { once: true });
    
    // Add keyboard instructions
    showInstructions();
});

function showInstructions() {
    // Create instructions overlay
    const instructions = document.createElement('div');
    instructions.id = 'instructions';
    instructions.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
        font-family: 'Courier New', monospace;
        z-index: 300;
        max-width: 400px;
    `;
    
    instructions.innerHTML = `
        <h2>🎮 GASSER GLTSH Platformer</h2>
        <div style="text-align: left; margin: 20px 0;">
            <p><strong>Controls:</strong></p>
            <p>← → Arrow Keys: Move</p>
            <p>↑ Arrow Key / Space: Jump</p>
            <p>WASD keys also work</p>
        </div>
        <div style="text-align: left; margin: 20px 0;">
            <p><strong>Objective:</strong></p>
            <p>🟢 Collect 5 green items to open the door</p>
            <p>🚪 Enter the door to advance levels</p>
            <p>❤️ Avoid enemies (you have 3 lives)</p>
            <p>👑 Defeat the boss on level 100!</p>
        </div>
        <button class="button" onclick="startGame()" style="font-size: 18px; padding: 15px 30px;">
            Start Game
        </button>
    `;
    
    document.getElementById('gameContainer').appendChild(instructions);
}

function startGame() {
    const instructions = document.getElementById('instructions');
    if (instructions) {
        instructions.remove();
    }
    
    // Resume audio context if needed
    if (game.audioManager && game.audioManager.audioContext) {
        game.audioManager.audioContext.resume();
    }
}

// Add some helper functions for debugging
window.debugGame = {
    nextLevel: () => game.nextLevel(),
    addLife: () => {
        game.lives++;
        document.getElementById('lives').textContent = game.lives;
    },
    skipToLevel: (level) => {
        game.currentLevel = level;
        game.loadLevel(level);
    },
    godMode: () => {
        game.player.invulnerable = true;
        game.player.invulnerabilityTimer = 999999;
    }
};

// Add volume control
document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyM') {
        // Toggle music
        if (game.audioManager) {
            if (game.audioManager.musicPlaying) {
                game.audioManager.stopMusic();
            } else {
                game.audioManager.startBackgroundMusic();
            }
        }
    }
});
