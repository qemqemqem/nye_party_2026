/**
 * Hourly Chimes Manager
 * Plays church bell sounds on the hour
 */

class ChimesManager {
    constructor() {
        this.audioBell = document.getElementById('audio-bell');
        this.checkInterval = null;
        this.lastChimeHour = -1;
        this.isChiming = false;
        
        // Bell timing
        this.bellDelay = 1920; // ~1.9 seconds between bongs (1.3x faster)
    }
    
    /**
     * Start the hourly chime checker
     */
    start() {
        // Check immediately
        this.checkTime();
        
        // Check every 30 seconds
        this.checkInterval = setInterval(() => {
            this.checkTime();
        }, 30000);
        
        console.log('⏰ Chimes manager started');
    }
    
    /**
     * Stop the hourly chime checker
     */
    stop() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }
    
    /**
     * Check if it's time to chime
     */
    checkTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        
        // Only chime on the hour (within first minute)
        if (minutes === 0 && hours !== this.lastChimeHour && !this.isChiming) {
            this.lastChimeHour = hours;
            this.chime(this.getChimeCount(hours));
        }
    }
    
    /**
     * Get number of chimes for the hour (12-hour format)
     * @param {number} hour24 - Hour in 24-hour format
     * @returns {number} Number of chimes (1-12)
     */
    getChimeCount(hour24) {
        let hour12 = hour24 % 12;
        return hour12 === 0 ? 12 : hour12;
    }
    
    /**
     * Play the chimes
     * @param {number} count - Number of times to chime
     */
    async chime(count) {
        if (this.isChiming || !this.audioBell) return;
        
        this.isChiming = true;
        console.log(`🔔 Chiming ${count} times for ${new Date().toLocaleTimeString()}`);
        
        // Visual indicator
        this.showChimeIndicator(count);
        
        for (let i = 0; i < count; i++) {
            await this.playBell();
            
            // Wait between bongs (except after the last one)
            if (i < count - 1) {
                await this.wait(this.bellDelay);
            }
        }
        
        this.isChiming = false;
        this.hideChimeIndicator();
    }
    
    /**
     * Play a single bell sound
     */
    playBell() {
        return new Promise(resolve => {
            // Try HTML audio first, fall back to synth
            if (this.audioBell && this.audioBell.src && !this.audioBell.error) {
                this.audioBell.currentTime = 0;
                this.audioBell.volume = 1.0;
                
                this.audioBell.play()
                    .then(() => {
                        setTimeout(resolve, 1000);
                    })
                    .catch(err => {
                        console.log('Bell audio file failed, using synth');
                        this.playSynthBell();
                        setTimeout(resolve, 1000);
                    });
            } else {
                // Use synthesized bell
                this.playSynthBell();
                setTimeout(resolve, 1000);
            }
        });
    }
    
    /**
     * Play synthesized bell sound
     */
    playSynthBell() {
        if (typeof audioSynth !== 'undefined') {
            audioSynth.playBell();
        }
    }
    
    /**
     * Wait for specified milliseconds
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Show visual indicator during chimes
     */
    showChimeIndicator(count) {
        // Create or update chime overlay
        let indicator = document.getElementById('chime-indicator');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'chime-indicator';
            indicator.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-family: 'Orbitron', monospace;
                font-size: 4rem;
                font-weight: 900;
                color: #00ffff;
                text-align: center;
                white-space: nowrap;
                min-width: 600px;
                text-shadow: 
                    0 0 10px #00ffff,
                    0 0 20px #00ffff,
                    0 0 40px #0088ff,
                    0 0 80px #0088ff;
                background: linear-gradient(135deg, rgba(0, 20, 40, 0.95), rgba(0, 40, 80, 0.9));
                border: 3px solid #00ffff;
                border-radius: 12px;
                box-shadow: 
                    0 0 30px rgba(0, 255, 255, 0.5),
                    inset 0 0 60px rgba(0, 255, 255, 0.1);
                padding: 1.5rem 4rem;
                z-index: 1000;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.5s ease;
                animation: pulse-glow 0.5s ease-in-out infinite alternate;
                letter-spacing: 0.1em;
                text-transform: uppercase;
            `;
            
            // Add keyframe animation
            if (!document.getElementById('chime-indicator-styles')) {
                const style = document.createElement('style');
                style.id = 'chime-indicator-styles';
                style.textContent = `
                    @keyframes pulse-glow {
                        from {
                            box-shadow: 0 0 30px rgba(0, 255, 255, 0.5), inset 0 0 60px rgba(0, 255, 255, 0.1);
                            text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 40px #0088ff, 0 0 80px #0088ff;
                        }
                        to {
                            box-shadow: 0 0 50px rgba(0, 255, 255, 0.8), inset 0 0 80px rgba(0, 255, 255, 0.2);
                            text-shadow: 0 0 15px #00ffff, 0 0 30px #00ffff, 0 0 60px #0088ff, 0 0 100px #0088ff;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(indicator);
        }
        
        indicator.innerHTML = `🚨 TIME SLIDE INCOMING! 🚨`;
        indicator.style.opacity = '1';
    }
    
    /**
     * Hide chime indicator
     */
    hideChimeIndicator() {
        const indicator = document.getElementById('chime-indicator');
        if (indicator) {
            indicator.style.opacity = '0';
            setTimeout(() => indicator.remove(), 500);
        }
    }
    
    /**
     * Format hour for display
     */
    formatHour(hour) {
        const words = [
            'TWELVE', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE',
            'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE'
        ];
        return words[hour] || hour.toString();
    }
    
    /**
     * Manual trigger for testing
     * @param {number} count - Number of chimes
     */
    testChime(count = 3) {
        console.log(`🧪 Testing ${count} chimes...`);
        this.chime(count);
    }
}

// Global instance
const chimesManager = new ChimesManager();
