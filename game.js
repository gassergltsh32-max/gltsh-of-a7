class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Game state
        this.score = 0;
        this.lives = 3;
        this.currentLevel = 1;
        this.gameState = 'playing'; // playing, gameOver, victory
        this.collectiblesNeeded = 5;
        this.collectiblesCollected = 0;
        
        // Game objects
        this.player = null;
        this.enemies = [];
        this.collectibles = [];
        this.platforms = [];
        this.powerUps = [];
        this.door = null;
        this.boss = null;
        this.particleSystem = new ParticleSystem();
        
        // Input handling
        this.keys = {};
        this.setupInput();
        
        // Camera
        this.camera = { x: 0, y: 0 };
        
        // Initialize game
        this.init();
    }
    
    init() {
        this.player = new Player(100, 400, this);
        this.levelManager = new LevelManager(this);
        this.audioManager = new AudioManager();
        this.loadLevel(this.currentLevel);
        this.gameLoop();
    }
    
    setupInput() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            // Prevent default for game keys
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }
    
    loadLevel(levelNumber) {
        // Clear existing objects
        this.enemies = [];
        this.collectibles = [];
        this.platforms = [];
        this.powerUps = [];
        this.door = null;
        this.boss = null;
        this.collectiblesCollected = 0;
        
        // Reset player position
        this.player.x = 100;
        this.player.y = 400;
        this.player.vx = 0;
        this.player.vy = 0;
        
        // Load level data
        this.levelManager.loadLevel(levelNumber);
        
        // Update UI
        document.getElementById('level').textContent = levelNumber;
    }
    
    update() {
        if (this.gameState !== 'playing' && this.gameState !== 'levelComplete') return;
        
        // Update player
        this.player.update();
        
        // Update enemies
        this.enemies.forEach(enemy => enemy.update());
        
        // Update collectibles
        this.collectibles.forEach(collectible => collectible.update());
        
        // Update power-ups
        this.powerUps.forEach(powerUp => powerUp.update());
        
        // Update particle system
        this.particleSystem.update();
        
        // Update boss if exists
        if (this.boss) {
            this.boss.update();
        }
        
        // Check collisions
        this.checkCollisions();
        
        // Update camera to follow player
        this.updateCamera();
        
        // Check level completion
        this.checkLevelCompletion();
    }
    
    checkCollisions() {
        // Player vs Collectibles
        this.collectibles = this.collectibles.filter(collectible => {
            if (this.player.collidesWith(collectible)) {
                this.collectItem();
                this.audioManager.playCollectSound();
                this.particleSystem.addExplosion(collectible.x + 10, collectible.y + 10, 5, '#00FF00');
                return false;
            }
            return true;
        });
        
        // Player vs Power-ups
        this.powerUps = this.powerUps.filter(powerUp => {
            if (this.player.collidesWith(powerUp)) {
                powerUp.applyEffect(this.player);
                this.audioManager.playCollectSound();
                this.particleSystem.addExplosion(powerUp.x + 12, powerUp.y + 12, 8, powerUp.getGlowColor());
                return false;
            }
            return true;
        });
        
        // Player vs Enemies
        this.enemies.forEach(enemy => {
            if (this.player.collidesWith(enemy) && !this.player.invulnerable) {
                this.playerHit();
            }
        });
        
        // Player vs Platforms
        this.platforms.forEach(platform => {
            if (this.player.collidesWith(platform)) {
                this.player.handlePlatformCollision(platform);
            }
        });
        
        // Player vs Door
        if (this.door && this.door.isOpen && this.player.collidesWith(this.door)) {
            this.nextLevel();
        }
        
        // Player vs Boss (if exists)
        if (this.boss && this.player.collidesWith(this.boss) && !this.player.invulnerable) {
            if (this.player.y < this.boss.y - 20 && this.player.vy > 0) {
                // Player jumped on boss
                this.boss.hit();
                this.player.vy = -15; // Bounce
                if (this.boss.health <= 0) {
                    this.victory();
                }
            } else {
                this.playerHit();
            }
        }
    }
    
    collectItem() {
        this.score += 1;
        this.collectiblesCollected += 1;
        document.getElementById('score').textContent = this.score;
        
        // Open door if enough collectibles
        if (this.collectiblesCollected >= this.collectiblesNeeded && this.door) {
            this.door.open();
        }
    }
    
    playerHit() {
        this.lives -= 1;
        document.getElementById('lives').textContent = this.lives;
        this.player.makeInvulnerable();
        
        if (this.lives <= 0) {
            this.gameOver();
        }
    }
    
    nextLevel() {
        // Show level complete message
        this.showLevelComplete();
    }
    
    showLevelComplete() {
        this.gameState = 'levelComplete';
        document.getElementById('completedLevel').textContent = this.currentLevel;
        document.getElementById('levelScore').textContent = this.score;
        document.getElementById('levelComplete').style.display = 'block';
        
        // Play celebration sound
        this.audioManager.playVictorySound();
        
        // Add celebration particles
        this.particleSystem.addExplosion(this.width/2, this.height/2, 15, '#32CD32');
    }
    
    continueToNextLevel() {
        // Hide level complete screen
        document.getElementById('levelComplete').style.display = 'none';
        this.gameState = 'playing';
        
        this.currentLevel += 1;
        if (this.currentLevel > 100) {
            this.victory();
        } else {
            this.loadLevel(this.currentLevel);
        }
    }
    
    checkLevelCompletion() {
        // Check if player fell off the screen
        if (this.player.y > this.height + 100) {
            this.playerHit();
            // Reset player position
            this.player.x = 100;
            this.player.y = 400;
            this.player.vy = 0;
        }
    }
    
    updateCamera() {
        // Follow player with smooth camera
        const targetX = this.player.x - this.width / 2;
        const targetY = this.player.y - this.height / 2;
        
        this.camera.x += (targetX - this.camera.x) * 0.1;
        this.camera.y += (targetY - this.camera.y) * 0.1;
        
        // Clamp camera to level bounds
        this.camera.x = Math.max(0, Math.min(this.camera.x, 1600 - this.width));
        this.camera.y = Math.max(-200, Math.min(this.camera.y, 0));
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Save context for camera transform
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        // Render platforms
        this.platforms.forEach(platform => platform.render(this.ctx));
        
        // Render collectibles
        this.collectibles.forEach(collectible => collectible.render(this.ctx));
        
        // Render power-ups
        this.powerUps.forEach(powerUp => powerUp.render(this.ctx));
        
        // Render enemies
        this.enemies.forEach(enemy => enemy.render(this.ctx));
        
        // Render door
        if (this.door) {
            this.door.render(this.ctx);
        }
        
        // Render boss
        if (this.boss) {
            this.boss.render(this.ctx);
        }
        
        // Render player
        this.player.render(this.ctx);
        
        // Render particles
        this.particleSystem.render(this.ctx);
        
        // Restore context
        this.ctx.restore();
        
        // Render victory effects if needed
        if (this.gameState === 'victory') {
            this.renderVictoryEffects();
        }
        
        // Render level complete effects if needed
        if (this.gameState === 'levelComplete') {
            this.renderLevelCompleteEffects();
        }
    }
    
    renderVictoryEffects() {
        // Render fireworks and celebration effects
        const time = Date.now() * 0.005;
        for (let i = 0; i < 20; i++) {
            const x = (Math.sin(time + i) * 200) + this.width / 2;
            const y = (Math.cos(time + i * 0.5) * 100) + this.height / 2;
            
            this.ctx.fillStyle = `hsl(${(time * 50 + i * 30) % 360}, 70%, 60%)`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 5, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    renderLevelCompleteEffects() {
        // Render green celebration effects for level completion
        const time = Date.now() * 0.008;
        for (let i = 0; i < 10; i++) {
            const x = (Math.sin(time + i * 0.8) * 150) + this.width / 2;
            const y = (Math.cos(time + i * 0.6) * 80) + this.height / 2;
            
            this.ctx.fillStyle = `hsl(${120 + (time * 30 + i * 20) % 60}, 70%, 60%)`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').style.display = 'block';
    }
    
    victory() {
        this.gameState = 'victory';
        document.getElementById('victory').style.display = 'block';
        
        // Play victory message
        this.speakArabicVictory();
    }
    
    speakArabicVictory() {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance('شاطر يقلب الجسور');
            utterance.lang = 'ar-SA';
            utterance.rate = 0.8;
            utterance.pitch = 1.2;
            speechSynthesis.speak(utterance);
        }
    }
    
    restart() {
        this.score = 0;
        this.lives = 3;
        this.currentLevel = 1;
        this.gameState = 'playing';
        this.collectiblesCollected = 0;
        
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('gameOver').style.display = 'none';
        document.getElementById('victory').style.display = 'none';
        document.getElementById('levelComplete').style.display = 'none';
        
        this.loadLevel(this.currentLevel);
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}
