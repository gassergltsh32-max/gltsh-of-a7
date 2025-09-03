class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.musicPlaying = false;
        this.masterVolume = 0.3;
        
        this.initAudio();
        this.createSounds();
    }
    
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }
    
    createSounds() {
        // Create 8-bit style sound effects using Web Audio API
        this.sounds = {
            collect: this.createCollectSound(),
            jump: this.createJumpSound(),
            hit: this.createHitSound(),
            victory: this.createVictorySound()
        };
        
        // Start background music
        this.startBackgroundMusic();
    }
    
    createCollectSound() {
        return () => {
            if (!this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Coin collect sound (ascending notes)
            oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2); // G5
            
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.3);
        };
    }
    
    createJumpSound() {
        return () => {
            if (!this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Jump sound (quick ascending sweep)
            oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
            
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(this.masterVolume * 0.2, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        };
    }
    
    createHitSound() {
        return () => {
            if (!this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Hit sound (descending harsh tone)
            oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.3);
            
            oscillator.type = 'sawtooth';
            
            gainNode.gain.setValueAtTime(this.masterVolume * 0.4, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.3);
        };
    }
    
    createVictorySound() {
        return () => {
            if (!this.audioContext) return;
            
            // Victory fanfare
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            
            notes.forEach((freq, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime + index * 0.2);
                oscillator.type = 'square';
                
                gainNode.gain.setValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime + index * 0.2);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + index * 0.2 + 0.4);
                
                oscillator.start(this.audioContext.currentTime + index * 0.2);
                oscillator.stop(this.audioContext.currentTime + index * 0.2 + 0.4);
            });
        };
    }
    
    startBackgroundMusic() {
        if (!this.audioContext || this.musicPlaying) return;
        
        this.musicPlaying = true;
        this.playBackgroundLoop();
    }
    
    playBackgroundLoop() {
        if (!this.audioContext || !this.musicPlaying) return;
        
        // Simple 8-bit style melody
        const melody = [
            { freq: 261.63, duration: 0.3 }, // C4
            { freq: 293.66, duration: 0.3 }, // D4
            { freq: 329.63, duration: 0.3 }, // E4
            { freq: 293.66, duration: 0.3 }, // D4
            { freq: 261.63, duration: 0.6 }, // C4
            { freq: 329.63, duration: 0.3 }, // E4
            { freq: 392.00, duration: 0.3 }, // G4
            { freq: 329.63, duration: 0.6 }, // E4
        ];
        
        let currentTime = this.audioContext.currentTime;
        
        melody.forEach((note, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(note.freq, currentTime);
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(this.masterVolume * 0.1, currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);
            
            oscillator.start(currentTime);
            oscillator.stop(currentTime + note.duration);
            
            currentTime += note.duration;
        });
        
        // Schedule next loop
        setTimeout(() => {
            if (this.musicPlaying) {
                this.playBackgroundLoop();
            }
        }, melody.reduce((sum, note) => sum + note.duration, 0) * 1000 + 1000);
    }
    
    playCollectSound() {
        if (this.sounds.collect) {
            this.sounds.collect();
        }
    }
    
    playJumpSound() {
        if (this.sounds.jump) {
            this.sounds.jump();
        }
    }
    
    playHitSound() {
        if (this.sounds.hit) {
            this.sounds.hit();
        }
    }
    
    playVictorySound() {
        if (this.sounds.victory) {
            this.sounds.victory();
        }
    }
    
    stopMusic() {
        this.musicPlaying = false;
    }
    
    setVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }
}
