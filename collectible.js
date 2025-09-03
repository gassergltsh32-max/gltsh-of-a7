class Collectible {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.collected = false;
        
        // Animation
        this.animTimer = 0;
        this.bobOffset = 0;
        
        // Create green collectible sprite
        this.createSprite();
    }
    
    createSprite() {
        this.sprite = document.createElement('canvas');
        this.sprite.width = 20;
        this.sprite.height = 20;
        const ctx = this.sprite.getContext('2d');
        
        ctx.imageSmoothingEnabled = false;
        
        // Draw green gem/coin
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(4, 4, 12, 12);
        
        // Add shine effect
        ctx.fillStyle = '#90EE90';
        ctx.fillRect(6, 6, 4, 4);
        
        // Border
        ctx.strokeStyle = '#006400';
        ctx.lineWidth = 1;
        ctx.strokeRect(4, 4, 12, 12);
    }
    
    update() {
        // Bobbing animation
        this.animTimer += 0.1;
        this.bobOffset = Math.sin(this.animTimer) * 3;
    }
    
    render(ctx) {
        if (this.collected) return;
        
        ctx.drawImage(this.sprite, this.x, this.y + this.bobOffset);
        
        // Debug hitbox
        if (false) {
            ctx.strokeStyle = 'green';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}

class Door {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 60;
        this.isOpen = false;
        
        this.createSprite();
    }
    
    createSprite() {
        this.closedSprite = document.createElement('canvas');
        this.closedSprite.width = 40;
        this.closedSprite.height = 60;
        let ctx = this.closedSprite.getContext('2d');
        
        // Closed door (brown)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, 0, 40, 60);
        ctx.fillStyle = '#654321';
        ctx.fillRect(2, 2, 36, 56);
        
        // Door handle
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(32, 30, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Open door (flag)
        this.openSprite = document.createElement('canvas');
        this.openSprite.width = 40;
        this.openSprite.height = 60;
        ctx = this.openSprite.getContext('2d');
        
        // Flag pole
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(2, 0, 4, 60);
        
        // Flag
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(6, 5, 30, 20);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(6, 15, 30, 10);
    }
    
    open() {
        this.isOpen = true;
    }
    
    render(ctx) {
        const sprite = this.isOpen ? this.openSprite : this.closedSprite;
        ctx.drawImage(sprite, this.x, this.y);
        
        if (false) {
            ctx.strokeStyle = 'blue';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}
