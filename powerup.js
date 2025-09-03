class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 24;
        this.type = type; // 'speed', 'invincibility', 'jump', 'life'
        this.collected = false;
        
        // Animation
        this.animTimer = 0;
        this.bobOffset = 0;
        this.glowIntensity = 0;
        
        this.createSprite();
    }
    
    createSprite() {
        this.sprite = document.createElement('canvas');
        this.sprite.width = 24;
        this.sprite.height = 24;
        const ctx = this.sprite.getContext('2d');
        
        ctx.imageSmoothingEnabled = false;
        
        switch (this.type) {
            case 'speed':
                // Blue speed boost
                ctx.fillStyle = '#0080FF';
                ctx.fillRect(4, 4, 16, 16);
                ctx.fillStyle = '#87CEEB';
                ctx.fillRect(6, 6, 12, 12);
                // Lightning symbol
                ctx.fillStyle = '#FFFF00';
                ctx.fillRect(10, 8, 2, 8);
                ctx.fillRect(8, 10, 6, 2);
                break;
                
            case 'invincibility':
                // Golden star
                ctx.fillStyle = '#FFD700';
                this.drawStar(ctx, 12, 12, 8, 5);
                ctx.fillStyle = '#FFA500';
                this.drawStar(ctx, 12, 12, 6, 5);
                break;
                
            case 'jump':
                // Green jump boost
                ctx.fillStyle = '#32CD32';
                ctx.fillRect(4, 4, 16, 16);
                ctx.fillStyle = '#90EE90';
                ctx.fillRect(6, 6, 12, 12);
                // Up arrow
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(11, 8, 2, 8);
                ctx.fillRect(9, 8, 6, 2);
                ctx.fillRect(10, 6, 4, 2);
                break;
                
            case 'life':
                // Red heart
                ctx.fillStyle = '#FF0000';
                this.drawHeart(ctx, 12, 12);
                break;
        }
    }
    
    drawStar(ctx, x, y, radius, points) {
        const angle = Math.PI / points;
        ctx.beginPath();
        for (let i = 0; i < 2 * points; i++) {
            const r = i % 2 === 0 ? radius : radius / 2;
            const currX = x + Math.cos(i * angle) * r;
            const currY = y + Math.sin(i * angle) * r;
            if (i === 0) ctx.moveTo(currX, currY);
            else ctx.lineTo(currX, currY);
        }
        ctx.closePath();
        ctx.fill();
    }
    
    drawHeart(ctx, x, y) {
        ctx.beginPath();
        ctx.arc(x - 4, y - 2, 4, 0, Math.PI, true);
        ctx.arc(x + 4, y - 2, 4, 0, Math.PI, true);
        ctx.lineTo(x + 8, y + 2);
        ctx.lineTo(x, y + 10);
        ctx.lineTo(x - 8, y + 2);
        ctx.closePath();
        ctx.fill();
    }
    
    update() {
        // Bobbing animation
        this.animTimer += 0.15;
        this.bobOffset = Math.sin(this.animTimer) * 4;
        this.glowIntensity = (Math.sin(this.animTimer * 2) + 1) * 0.5;
    }
    
    applyEffect(player) {
        switch (this.type) {
            case 'speed':
                player.speedBoost = 300; // 5 seconds at 60fps
                player.speed = 8;
                break;
                
            case 'invincibility':
                player.makeInvulnerable();
                player.invulnerabilityTimer = 600; // 10 seconds
                player.starPower = true;
                break;
                
            case 'jump':
                player.jumpBoost = 300;
                player.jumpPower = 20;
                break;
                
            case 'life':
                player.game.lives = Math.min(player.game.lives + 1, 9);
                document.getElementById('lives').textContent = player.game.lives;
                break;
        }
    }
    
    render(ctx) {
        if (this.collected) return;
        
        ctx.save();
        
        // Glow effect
        ctx.shadowColor = this.getGlowColor();
        ctx.shadowBlur = 10 + this.glowIntensity * 10;
        
        ctx.drawImage(this.sprite, this.x, this.y + this.bobOffset);
        
        ctx.restore();
    }
    
    getGlowColor() {
        switch (this.type) {
            case 'speed': return '#0080FF';
            case 'invincibility': return '#FFD700';
            case 'jump': return '#32CD32';
            case 'life': return '#FF0000';
            default: return '#FFFFFF';
        }
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }
    
    addParticle(x, y, type, color = '#FFFFFF') {
        this.particles.push(new Particle(x, y, type, color));
    }
    
    addExplosion(x, y, count = 10, color = '#FFD700') {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 2 + Math.random() * 3;
            this.particles.push(new Particle(
                x, y, 'explosion', color, 
                Math.cos(angle) * speed, 
                Math.sin(angle) * speed
            ));
        }
    }
    
    update() {
        this.particles = this.particles.filter(particle => {
            particle.update();
            return particle.life > 0;
        });
    }
    
    render(ctx) {
        this.particles.forEach(particle => particle.render(ctx));
    }
}

class Particle {
    constructor(x, y, type, color, vx = 0, vy = 0) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.color = color;
        this.vx = vx || (Math.random() - 0.5) * 4;
        this.vy = vy || (Math.random() - 0.5) * 4;
        this.life = 60;
        this.maxLife = 60;
        this.size = 2 + Math.random() * 3;
        this.gravity = type === 'explosion' ? 0.1 : 0;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.life--;
        
        // Fade out
        if (this.type === 'explosion') {
            this.vx *= 0.98;
            this.vy *= 0.98;
        }
    }
    
    render(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
