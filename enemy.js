class Enemy {
    constructor(x, y, type = 'goomba') {
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 24;
        this.type = type;
        
        // Movement
        this.vx = -1; // Start moving left
        this.vy = 0;
        this.speed = 1;
        this.direction = -1;
        this.gravity = 0.8;
        this.onGround = false;
        
        // AI
        this.patrolDistance = 100;
        this.startX = x;
        
        // Animation
        this.animFrame = 0;
        this.animTimer = 0;
        
        this.createSprite();
    }
    
    createSprite() {
        this.sprite = document.createElement('canvas');
        this.sprite.width = 24;
        this.sprite.height = 24;
        const ctx = this.sprite.getContext('2d');
        
        ctx.imageSmoothingEnabled = false;
        
        if (this.type === 'goomba') {
            // Brown enemy (Goomba-style)
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(4, 8, 16, 12);
            
            // Eyes
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(6, 10, 4, 4);
            ctx.fillRect(14, 10, 4, 4);
            
            ctx.fillStyle = '#000000';
            ctx.fillRect(7, 11, 2, 2);
            ctx.fillRect(15, 11, 2, 2);
            
            // Feet
            ctx.fillStyle = '#654321';
            ctx.fillRect(2, 20, 6, 4);
            ctx.fillRect(16, 20, 6, 4);
        } else if (this.type === 'koopa') {
            // Green shell enemy
            ctx.fillStyle = '#00AA00';
            ctx.fillRect(2, 6, 20, 14);
            
            // Shell pattern
            ctx.fillStyle = '#008800';
            ctx.fillRect(4, 8, 16, 2);
            ctx.fillRect(4, 12, 16, 2);
            ctx.fillRect(4, 16, 16, 2);
            
            // Head
            ctx.fillStyle = '#FFFF00';
            ctx.fillRect(8, 2, 8, 6);
            
            // Eyes
            ctx.fillStyle = '#000000';
            ctx.fillRect(9, 3, 2, 2);
            ctx.fillRect(13, 3, 2, 2);
        }
    }
    
    update() {
        this.move();
        this.applyPhysics();
        this.updateAnimation();
    }
    
    move() {
        // Simple AI: patrol back and forth
        this.vx = this.direction * this.speed;
        
        // Turn around at patrol boundaries
        if (this.x <= this.startX - this.patrolDistance || 
            this.x >= this.startX + this.patrolDistance) {
            this.direction *= -1;
        }
    }
    
    applyPhysics() {
        // Apply gravity
        this.vy += this.gravity;
        
        // Apply velocity
        this.x += this.vx;
        this.y += this.vy;
        
        // Simple ground collision
        if (this.y > 550 - this.height) {
            this.y = 550 - this.height;
            this.vy = 0;
            this.onGround = true;
        }
    }
    
    updateAnimation() {
        this.animTimer++;
        if (this.animTimer > 30) {
            this.animFrame = (this.animFrame + 1) % 2;
            this.animTimer = 0;
        }
    }
    
    render(ctx) {
        ctx.save();
        
        // Flip sprite based on direction
        if (this.direction === 1) {
            ctx.scale(-1, 1);
            ctx.drawImage(this.sprite, -this.x - this.width, this.y);
        } else {
            ctx.drawImage(this.sprite, this.x, this.y);
        }
        
        ctx.restore();
        
        // Debug hitbox
        if (false) {
            ctx.strokeStyle = 'red';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}

class Boss {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 64;
        this.height = 64;
        this.health = 5;
        this.maxHealth = 5;
        
        // Movement
        this.vx = 0;
        this.vy = 0;
        this.speed = 2;
        this.direction = -1;
        this.gravity = 0.8;
        this.onGround = false;
        
        // AI states
        this.state = 'patrol'; // patrol, charge, stunned
        this.stateTimer = 0;
        this.chargeSpeed = 4;
        
        // Animation
        this.animFrame = 0;
        this.animTimer = 0;
        
        this.createSprite();
    }
    
    createSprite() {
        this.sprite = document.createElement('canvas');
        this.sprite.width = 64;
        this.sprite.height = 64;
        const ctx = this.sprite.getContext('2d');
        
        ctx.imageSmoothingEnabled = false;
        
        // Large boss enemy (Bowser-style)
        // Body
        ctx.fillStyle = '#FF4500';
        ctx.fillRect(8, 16, 48, 32);
        
        // Shell
        ctx.fillStyle = '#228B22';
        ctx.fillRect(12, 20, 40, 24);
        
        // Spikes on shell
        ctx.fillStyle = '#FFFF00';
        for (let i = 0; i < 5; i++) {
            ctx.fillRect(14 + i * 8, 16, 4, 8);
        }
        
        // Head
        ctx.fillStyle = '#FF6347';
        ctx.fillRect(16, 4, 32, 20);
        
        // Eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(20, 8, 8, 6);
        ctx.fillRect(36, 8, 8, 6);
        
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(22, 10, 4, 2);
        ctx.fillRect(38, 10, 4, 2);
        
        // Horns
        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(18, 2, 4, 6);
        ctx.fillRect(42, 2, 4, 6);
        
        // Feet
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(4, 48, 12, 16);
        ctx.fillRect(48, 48, 12, 16);
    }
    
    update() {
        this.updateAI();
        this.applyPhysics();
        this.updateAnimation();
    }
    
    updateAI() {
        this.stateTimer++;
        
        switch (this.state) {
            case 'patrol':
                this.vx = this.direction * this.speed;
                if (this.stateTimer > 120) { // 2 seconds
                    this.state = 'charge';
                    this.stateTimer = 0;
                    this.chargeSpeed = 6;
                }
                break;
                
            case 'charge':
                this.vx = this.direction * this.chargeSpeed;
                if (this.stateTimer > 90) { // 1.5 seconds
                    this.state = 'patrol';
                    this.stateTimer = 0;
                    this.direction *= -1;
                }
                break;
                
            case 'stunned':
                this.vx = 0;
                if (this.stateTimer > 60) { // 1 second
                    this.state = 'patrol';
                    this.stateTimer = 0;
                }
                break;
        }
        
        // Turn around at boundaries
        if (this.x < 1200 || this.x > 1500) {
            this.direction *= -1;
        }
    }
    
    hit() {
        this.health--;
        this.state = 'stunned';
        this.stateTimer = 0;
        
        // Flash red when hit
        this.hitFlash = 30;
    }
    
    applyPhysics() {
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        
        // Ground collision
        if (this.y > 550 - this.height) {
            this.y = 550 - this.height;
            this.vy = 0;
            this.onGround = true;
        }
    }
    
    updateAnimation() {
        this.animTimer++;
        if (this.animTimer > 20) {
            this.animFrame = (this.animFrame + 1) % 2;
            this.animTimer = 0;
        }
        
        if (this.hitFlash > 0) {
            this.hitFlash--;
        }
    }
    
    render(ctx) {
        ctx.save();
        
        // Flash red when hit
        if (this.hitFlash > 0 && Math.floor(this.hitFlash / 5) % 2) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        
        // Flip sprite based on direction
        if (this.direction === 1) {
            ctx.scale(-1, 1);
            ctx.drawImage(this.sprite, -this.x - this.width, this.y);
        } else {
            ctx.drawImage(this.sprite, this.x, this.y);
        }
        
        ctx.restore();
        
        // Health bar
        const barWidth = 60;
        const barHeight = 6;
        const barX = this.x + (this.width - barWidth) / 2;
        const barY = this.y - 15;
        
        // Background
        ctx.fillStyle = 'red';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Health
        ctx.fillStyle = 'green';
        const healthWidth = (this.health / this.maxHealth) * barWidth;
        ctx.fillRect(barX, barY, healthWidth, barHeight);
        
        // Border
        ctx.strokeStyle = 'black';
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
}
