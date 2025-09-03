class Player {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.game = game;
        
        // Physics
        this.vx = 0;
        this.vy = 0;
        this.speed = 5;
        this.jumpPower = 15;
        this.gravity = 0.8;
        this.friction = 0.85;
        this.onGround = false;
        
        // Animation
        this.facing = 1; // 1 for right, -1 for left
        this.animFrame = 0;
        this.animTimer = 0;
        this.animState = 'idle'; // idle, walking, jumping
        this.sprites = {};
        
        // State
        this.invulnerable = false;
        this.invulnerabilityTimer = 0;
        
        // Power-ups
        this.speedBoost = 0;
        this.jumpBoost = 0;
        this.starPower = false;
        
        // Create pixel art sprites
        this.createSprites();
    }
    
    createSprites() {
        // Create idle sprite
        this.sprites.idle = this.createSpriteFrame('idle');
        // Create walking sprites
        this.sprites.walk1 = this.createSpriteFrame('walk1');
        this.sprites.walk2 = this.createSpriteFrame('walk2');
        // Create jumping sprite
        this.sprites.jump = this.createSpriteFrame('jump');
    }
    
    createSpriteFrame(type) {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        
        // Base wizard sprite with high-quality details
        this.drawWizardBase(ctx, type);
        
        return canvas;
    }
    
    drawWizardBase(ctx, animType) {
        // Exact pixel-perfect replica of the wizard from user's image
        
        // Hat - darkest teal/navy (outline)
        ctx.fillStyle = '#1A3B3A';
        ctx.fillRect(7, 0, 18, 1);   // Hat top
        ctx.fillRect(5, 1, 22, 1);   // Hat upper
        ctx.fillRect(3, 2, 26, 1);   // Hat middle
        ctx.fillRect(1, 3, 30, 1);   // Hat lower
        ctx.fillRect(0, 4, 32, 1);   // Hat brim top
        ctx.fillRect(0, 5, 32, 1);   // Hat brim
        ctx.fillRect(0, 6, 32, 1);   // Hat brim bottom
        
        // Hat main body - medium dark teal
        ctx.fillStyle = '#2E5266';
        ctx.fillRect(8, 1, 16, 1);   // Hat top fill
        ctx.fillRect(6, 2, 20, 1);   // Hat upper fill
        ctx.fillRect(4, 3, 24, 1);   // Hat middle fill
        ctx.fillRect(2, 4, 28, 1);   // Hat lower fill
        ctx.fillRect(1, 5, 30, 1);   // Hat brim fill
        
        // Hat highlights - lighter teal
        ctx.fillStyle = '#4A8B8D';
        ctx.fillRect(9, 1, 14, 1);   // Hat top highlight
        ctx.fillRect(7, 2, 18, 1);   // Hat upper highlight
        ctx.fillRect(5, 3, 22, 1);   // Hat middle highlight
        
        // Hat band - brown/tan
        ctx.fillStyle = '#B8860B';
        ctx.fillRect(3, 4, 26, 1);   // Hat band
        
        // Hat shadow area
        ctx.fillStyle = '#0F2027';
        ctx.fillRect(2, 6, 28, 2);   // Deep shadow under brim
        
        // Face - light peach/cream
        ctx.fillStyle = '#F5DEB3';
        ctx.fillRect(10, 8, 12, 8);   // Main face
        
        // Face outline
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(9, 8, 1, 8);     // Left face outline
        ctx.fillRect(22, 8, 1, 8);    // Right face outline
        ctx.fillRect(10, 16, 12, 1);  // Bottom face outline
        
        // Eyes - black pixels
        ctx.fillStyle = '#000000';
        ctx.fillRect(12, 10, 2, 2);   // Left eye
        ctx.fillRect(18, 10, 2, 2);   // Right eye
        
        // Nose - small brown dot
        ctx.fillStyle = '#CD853F';
        ctx.fillRect(15, 13, 2, 1);   // Nose
        
        // Mouth area
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(14, 14, 4, 1);   // Mouth
        
        // Robe body - same dark teal as hat
        ctx.fillStyle = '#2E5266';
        ctx.fillRect(6, 16, 20, 12);  // Main robe
        
        // Robe highlights - lighter teal
        ctx.fillStyle = '#4A8B8D';
        ctx.fillRect(7, 17, 18, 1);   // Robe top highlight
        ctx.fillRect(8, 18, 16, 7);   // Robe main highlight
        
        // Robe outline - darkest
        ctx.fillStyle = '#1A3B3A';
        ctx.fillRect(5, 16, 1, 12);   // Left robe outline
        ctx.fillRect(26, 16, 1, 12);  // Right robe outline
        ctx.fillRect(6, 28, 20, 1);   // Bottom robe outline
        
        // Belt - bright orange
        ctx.fillStyle = '#FF8C00';
        ctx.fillRect(8, 21, 16, 2);   // Belt
        
        // Belt buckle - bright yellow
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(15, 21, 2, 2);   // Buckle
        
        // Arms - no animation offset for exact match
        ctx.fillStyle = '#4A8B8D';
        ctx.fillRect(2, 16, 4, 8);    // Left arm
        ctx.fillRect(26, 16, 4, 8);   // Right arm
        
        // Arm shadows
        ctx.fillStyle = '#2E5266';
        ctx.fillRect(2, 16, 1, 8);    // Left arm shadow
        ctx.fillRect(29, 16, 1, 8);   // Right arm shadow
        
        // Hands - same as face
        ctx.fillStyle = '#F5DEB3';
        ctx.fillRect(2, 22, 4, 2);    // Left hand
        ctx.fillRect(26, 22, 4, 2);   // Right hand
        
        // Hand outlines
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(2, 24, 4, 1);    // Left hand outline
        ctx.fillRect(26, 24, 4, 1);   // Right hand outline
        
        // Legs/boots - no animation offset for exact match
        ctx.fillStyle = '#1A3B3A';
        ctx.fillRect(10, 28, 4, 4);   // Left boot
        ctx.fillRect(18, 28, 4, 4);   // Right boot
        
        // Boot highlights
        ctx.fillStyle = '#2E5266';
        ctx.fillRect(11, 28, 2, 3);   // Left boot highlight
        ctx.fillRect(19, 28, 2, 3);   // Right boot highlight
        
        // Magic wand - exactly as in image
        ctx.fillStyle = '#4A8B8D';
        ctx.fillRect(30, 12, 2, 8);   // Wand handle
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(30, 10, 2, 2);   // Wand tip
        ctx.fillRect(29, 11, 4, 1);   // Wand cross
        ctx.fillRect(31, 9, 1, 4);    // Wand vertical
    }
    
    update() {
        this.handleInput();
        this.applyPhysics();
        this.updateAnimation();
        this.updateInvulnerability();
    }
    
    handleInput() {
        const keys = this.game.keys;
        
        // Horizontal movement
        if (keys['ArrowLeft'] || keys['KeyA']) {
            this.vx = -this.speed;
            this.facing = -1;
        } else if (keys['ArrowRight'] || keys['KeyD']) {
            this.vx = this.speed;
            this.facing = 1;
        } else {
            this.vx *= this.friction;
        }
        
        // Jumping
        if ((keys['ArrowUp'] || keys['Space'] || keys['KeyW']) && this.onGround) {
            this.vy = -this.jumpPower;
            this.onGround = false;
        }
    }
    
    applyPhysics() {
        // Apply gravity
        this.vy += this.gravity;
        
        // Apply velocity
        this.x += this.vx;
        this.y += this.vy;
        
        // Ground collision (simple)
        if (this.y > this.game.height - this.height - 50) {
            this.y = this.game.height - this.height - 50;
            this.vy = 0;
            this.onGround = true;
        }
        
        // Side boundaries
        if (this.x < 0) this.x = 0;
        if (this.x > 1600 - this.width) this.x = 1600 - this.width;
    }
    
    updateAnimation() {
        // Update animation state based on movement
        if (!this.onGround) {
            this.animState = 'jump';
        } else if (Math.abs(this.vx) > 0.5) {
            this.animState = 'walking';
        } else {
            this.animState = 'idle';
        }
        
        // Update animation frame for walking
        if (this.animState === 'walking') {
            this.animTimer++;
            if (this.animTimer > 8) {
                this.animFrame = (this.animFrame + 1) % 2;
                this.animTimer = 0;
            }
        } else {
            this.animFrame = 0;
            this.animTimer = 0;
        }
    }
    
    updateInvulnerability() {
        if (this.invulnerable) {
            this.invulnerabilityTimer--;
            if (this.invulnerabilityTimer <= 0) {
                this.invulnerable = false;
                this.starPower = false;
            }
        }
        
        // Update power-ups
        if (this.speedBoost > 0) {
            this.speedBoost--;
            if (this.speedBoost <= 0) {
                this.speed = 5; // Reset to normal speed
            }
        }
        
        if (this.jumpBoost > 0) {
            this.jumpBoost--;
            if (this.jumpBoost <= 0) {
                this.jumpPower = 15; // Reset to normal jump
            }
        }
    }
    
    makeInvulnerable() {
        this.invulnerable = true;
        this.invulnerabilityTimer = 120; // 2 seconds at 60fps
    }
    
    handlePlatformCollision(platform) {
        // Simple AABB collision resolution
        const playerRight = this.x + this.width;
        const playerBottom = this.y + this.height;
        const platformRight = platform.x + platform.width;
        const platformBottom = platform.y + platform.height;
        
        // Calculate overlap
        const overlapX = Math.min(playerRight - platform.x, platformRight - this.x);
        const overlapY = Math.min(playerBottom - platform.y, platformBottom - this.y);
        
        // Resolve collision based on smallest overlap
        if (overlapX < overlapY) {
            // Horizontal collision
            if (this.x < platform.x) {
                this.x = platform.x - this.width;
            } else {
                this.x = platformRight;
            }
            this.vx = 0;
        } else {
            // Vertical collision
            if (this.y < platform.y) {
                // Landing on top
                this.y = platform.y - this.height;
                this.vy = 0;
                this.onGround = true;
            } else {
                // Hitting from below
                this.y = platformBottom;
                this.vy = 0;
            }
        }
    }
    
    collidesWith(other) {
        return this.x < other.x + other.width &&
               this.x + this.width > other.x &&
               this.y < other.y + other.height &&
               this.y + this.height > other.y;
    }
    
    render(ctx) {
        ctx.save();
        
        // Star power glow effect
        if (this.starPower) {
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 15;
            const rainbow = `hsl(${Date.now() * 0.5 % 360}, 70%, 60%)`;
            ctx.shadowColor = rainbow;
        }
        
        // Flashing effect when invulnerable
        if (this.invulnerable && Math.floor(this.invulnerabilityTimer / 5) % 2) {
            ctx.globalAlpha = 0.5;
        }
        
        // Speed boost trail effect
        if (this.speedBoost > 0) {
            ctx.shadowColor = '#0080FF';
            ctx.shadowBlur = 8;
        }
        
        // Select appropriate sprite based on animation state
        let currentSprite = this.sprites.idle;
        if (this.animState === 'jump') {
            currentSprite = this.sprites.jump;
        } else if (this.animState === 'walking') {
            currentSprite = this.animFrame === 0 ? this.sprites.walk1 : this.sprites.walk2;
        }
        
        // Flip sprite based on facing direction
        if (this.facing === -1) {
            ctx.scale(-1, 1);
            ctx.drawImage(currentSprite, -this.x - this.width, this.y);
        } else {
            ctx.drawImage(currentSprite, this.x, this.y);
        }
        
        ctx.restore();
        
        // Power-up indicators
        this.renderPowerUpIndicators(ctx);
    }
    
    renderPowerUpIndicators(ctx) {
        let indicatorY = this.y - 10;
        
        if (this.speedBoost > 0) {
            ctx.fillStyle = '#0080FF';
            ctx.fillRect(this.x, indicatorY, (this.speedBoost / 300) * this.width, 3);
            indicatorY -= 5;
        }
        
        if (this.jumpBoost > 0) {
            ctx.fillStyle = '#32CD32';
            ctx.fillRect(this.x, indicatorY, (this.jumpBoost / 300) * this.width, 3);
            indicatorY -= 5;
        }
    }
}
