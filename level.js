class Platform {
    constructor(x, y, width, height, type = 'normal') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type; // normal, moving, breakable
        
        // Moving platform properties
        this.startX = x;
        this.startY = y;
        this.moveDistance = 100;
        this.moveSpeed = 1;
        this.moveDirection = 1;
        this.moveAxis = 'x'; // x or y
        
        this.createSprite();
    }
    
    createSprite() {
        this.sprite = document.createElement('canvas');
        this.sprite.width = this.width;
        this.sprite.height = this.height;
        const ctx = this.sprite.getContext('2d');
        
        ctx.imageSmoothingEnabled = false;
        
        if (this.type === 'moving') {
            // Blue moving platform
            ctx.fillStyle = '#4169E1';
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.fillStyle = '#6495ED';
            ctx.fillRect(2, 2, this.width - 4, this.height - 4);
        } else {
            // Brown normal platform
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.fillStyle = '#A0522D';
            ctx.fillRect(2, 2, this.width - 4, this.height - 4);
        }
        
        // Add texture lines
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 1;
        for (let i = 8; i < this.width; i += 16) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, this.height);
            ctx.stroke();
        }
    }
    
    update() {
        if (this.type === 'moving') {
            if (this.moveAxis === 'x') {
                this.x += this.moveDirection * this.moveSpeed;
                if (this.x <= this.startX - this.moveDistance || 
                    this.x >= this.startX + this.moveDistance) {
                    this.moveDirection *= -1;
                }
            } else {
                this.y += this.moveDirection * this.moveSpeed;
                if (this.y <= this.startY - this.moveDistance || 
                    this.y >= this.startY + this.moveDistance) {
                    this.moveDirection *= -1;
                }
            }
        }
    }
    
    render(ctx) {
        ctx.drawImage(this.sprite, this.x, this.y);
        
        if (false) {
            ctx.strokeStyle = 'yellow';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}

class LevelManager {
    constructor(game) {
        this.game = game;
        this.currentLevelData = null;
    }
    
    loadLevel(levelNumber) {
        this.currentLevelData = this.generateLevel(levelNumber);
        this.createLevelObjects();
    }
    
    generateLevel(levelNumber) {
        const level = {
            platforms: [],
            enemies: [],
            collectibles: [],
            door: null,
            boss: null
        };
        
        // Ground platforms
        level.platforms.push(new Platform(0, 550, 1600, 50));
        
        if (levelNumber <= 10) {
            // Easy levels (1-10)
            this.generateEasyLevel(level, levelNumber);
        } else if (levelNumber <= 50) {
            // Medium levels (11-50)
            this.generateMediumLevel(level, levelNumber);
        } else if (levelNumber <= 90) {
            // Hard levels (51-90)
            this.generateHardLevel(level, levelNumber);
        } else if (levelNumber <= 99) {
            // Very hard levels (91-99)
            this.generateVeryHardLevel(level, levelNumber);
        } else {
            // Boss level (100)
            this.generateBossLevel(level);
        }
        
        return level;
    }
    
    generateEasyLevel(level, levelNumber) {
        // Simple platforms
        level.platforms.push(new Platform(200, 450, 100, 20));
        level.platforms.push(new Platform(400, 350, 100, 20));
        level.platforms.push(new Platform(600, 450, 100, 20));
        level.platforms.push(new Platform(800, 350, 100, 20));
        
        // Few collectibles
        for (let i = 0; i < 12; i++) {
            const x = 150 + i * 120;
            const y = 300 + Math.sin(i) * 50;
            level.collectibles.push(new Collectible(x, y));
        }
        
        // Add some power-ups in easy levels
        if (levelNumber > 2) {
            level.powerUps = [];
            level.powerUps.push(new PowerUp(500, 300, 'speed'));
            if (levelNumber > 5) {
                level.powerUps.push(new PowerUp(900, 300, 'jump'));
            }
        }
        
        // One or two enemies
        if (levelNumber > 3) {
            level.enemies.push(new Enemy(300, 500));
            if (levelNumber > 6) {
                level.enemies.push(new Enemy(700, 500));
            }
        }
        
        // Door at the end
        level.door = new Door(1400, 490);
    }
    
    generateMediumLevel(level, levelNumber) {
        // More complex platforms
        level.platforms.push(new Platform(150, 450, 80, 20));
        level.platforms.push(new Platform(300, 380, 80, 20));
        level.platforms.push(new Platform(450, 320, 80, 20));
        level.platforms.push(new Platform(600, 380, 80, 20));
        level.platforms.push(new Platform(750, 450, 80, 20));
        level.platforms.push(new Platform(900, 350, 80, 20));
        level.platforms.push(new Platform(1050, 280, 80, 20));
        level.platforms.push(new Platform(1200, 380, 80, 20));
        
        // More collectibles
        for (let i = 0; i < 15; i++) {
            const x = 100 + i * 90;
            const y = 200 + Math.sin(i * 0.5) * 80;
            level.collectibles.push(new Collectible(x, y));
        }
        
        // More enemies
        level.enemies.push(new Enemy(200, 500));
        level.enemies.push(new Enemy(500, 500));
        level.enemies.push(new Enemy(800, 500));
        if (levelNumber > 30) {
            level.enemies.push(new Enemy(1100, 500, 'koopa'));
        }
        
        level.door = new Door(1450, 490);
    }
    
    generateHardLevel(level, levelNumber) {
        // Moving platforms
        level.platforms.push(new Platform(200, 400, 60, 15, 'moving'));
        level.platforms.push(new Platform(400, 300, 60, 15, 'moving'));
        level.platforms.push(new Platform(600, 450, 60, 15, 'moving'));
        level.platforms.push(new Platform(800, 250, 60, 15, 'moving'));
        level.platforms.push(new Platform(1000, 400, 60, 15, 'moving'));
        
        // Static platforms for safety
        level.platforms.push(new Platform(100, 500, 60, 15));
        level.platforms.push(new Platform(1300, 450, 100, 20));
        
        // Vertical moving platforms
        const movingPlatform = new Platform(500, 200, 80, 15, 'moving');
        movingPlatform.moveAxis = 'y';
        movingPlatform.moveDistance = 150;
        level.platforms.push(movingPlatform);
        
        // Scattered collectibles
        for (let i = 0; i < 18; i++) {
            const x = 80 + i * 80;
            const y = 150 + Math.sin(i * 0.3) * 100;
            level.collectibles.push(new Collectible(x, y));
        }
        
        // Many enemies
        level.enemies.push(new Enemy(150, 500));
        level.enemies.push(new Enemy(350, 500, 'koopa'));
        level.enemies.push(new Enemy(650, 500));
        level.enemies.push(new Enemy(950, 500, 'koopa'));
        level.enemies.push(new Enemy(1250, 500));
        
        level.door = new Door(1500, 490);
    }
    
    generateVeryHardLevel(level, levelNumber) {
        // Challenging platform layout
        for (let i = 0; i < 8; i++) {
            const platform = new Platform(100 + i * 180, 200 + Math.sin(i) * 150, 50, 15, 'moving');
            platform.moveSpeed = 1.5;
            platform.moveDistance = 80;
            if (i % 2 === 0) {
                platform.moveAxis = 'y';
            }
            level.platforms.push(platform);
        }
        
        // Traps (represented as small moving platforms)
        for (let i = 0; i < 5; i++) {
            const trap = new Platform(200 + i * 250, 480, 30, 10, 'moving');
            trap.moveSpeed = 3;
            trap.moveDistance = 60;
            level.platforms.push(trap);
        }
        
        // Many collectibles in dangerous positions
        for (let i = 0; i < 20; i++) {
            const x = 50 + i * 75;
            const y = 100 + Math.sin(i * 0.4) * 120;
            level.collectibles.push(new Collectible(x, y));
        }
        
        // Lots of enemies
        for (let i = 0; i < 6; i++) {
            const type = i % 2 === 0 ? 'goomba' : 'koopa';
            level.enemies.push(new Enemy(200 + i * 200, 500, type));
        }
        
        level.door = new Door(1550, 490);
    }
    
    generateBossLevel(level) {
        // Boss arena
        level.platforms.push(new Platform(1200, 500, 400, 20));
        level.platforms.push(new Platform(1100, 400, 100, 20));
        level.platforms.push(new Platform(1500, 400, 100, 20));
        level.platforms.push(new Platform(1300, 300, 100, 20));
        
        // Some collectibles for health/score
        for (let i = 0; i < 15; i++) {
            const x = 50 + i * 100;
            const y = 200 + Math.sin(i * 0.2) * 80;
            level.collectibles.push(new Collectible(x, y));
        }
        
        // Boss enemy
        level.boss = new Boss(1400, 436);
        
        // No door - victory happens when boss is defeated
    }
    
    createLevelObjects() {
        // Clear existing objects
        this.game.platforms = [];
        this.game.enemies = [];
        this.game.collectibles = [];
        this.game.powerUps = [];
        this.game.door = null;
        this.game.boss = null;
        
        // Add new objects
        this.game.platforms = [...this.currentLevelData.platforms];
        this.game.enemies = [...this.currentLevelData.enemies];
        this.game.collectibles = [...this.currentLevelData.collectibles];
        this.game.powerUps = [...(this.currentLevelData.powerUps || [])];
        this.game.door = this.currentLevelData.door;
        this.game.boss = this.currentLevelData.boss;
        
        // Update platforms
        this.game.platforms.forEach(platform => {
            if (platform.update) {
                // Add update method to game loop for moving platforms
                const originalUpdate = platform.update.bind(platform);
                platform.update = () => {
                    originalUpdate();
                };
            }
        });
    }
}
