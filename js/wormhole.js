/**
 * Wormhole Animation Manager
 * Handles the time travel tunnel effect
 */

// Configuration flags
const WORMHOLE_CONFIG = {
    showRings: false,        // Toggle tunnel rings on/off (false = disabled due to pixelization)
    showParticles: true,     // Toggle particle effects
    showCore: true,          // Toggle center core glow
    particlesPerSecond: 100, // Particle spawn rate
};

class WormholeManager {
    constructor() {
        this.container = document.getElementById('wormhole-container');
        this.wormhole = document.getElementById('wormhole');
        this.particlesContainer = document.getElementById('wormhole-particles');
        this.destinationYear = document.getElementById('destination-year');
        this.audioWormhole = document.getElementById('audio-wormhole');
        this.audioArrival = document.getElementById('audio-arrival');
        
        this.isActive = false;
        this.rotationInterval = null;
        this.particleInterval = null;
        this.currentRotation = 0;
        this.targetYear = null;
        this.synthWormhole = null; // For synth audio controller
        
        // Apply config on load
        this.applyConfig();
    }
    
    /**
     * Apply configuration flags
     */
    applyConfig() {
        // Hide rings if disabled
        if (!WORMHOLE_CONFIG.showRings) {
            const rings = document.querySelectorAll('.tunnel-ring');
            rings.forEach(ring => ring.style.display = 'none');
        }
        
        // Hide core if disabled
        if (!WORMHOLE_CONFIG.showCore) {
            const core = document.getElementById('wormhole-core');
            if (core) core.style.display = 'none';
        }
    }
    
    /**
     * Start the wormhole animation
     * @param {string} yearDisplay - The year to display as destination (e.g., "1969 CE")
     */
    start(yearDisplay) {
        if (this.isActive) return;
        
        this.isActive = true;
        this.targetYear = yearDisplay;
        this.destinationYear.textContent = yearDisplay;
        
        // Show wormhole
        this.container.classList.remove('hidden');
        
        // Start audio
        this.playWormholeSound();
        
        // Start random rotation changes
        this.startRandomRotation();
        
        // Start particle effects
        this.startParticles();
        
        // Update status
        const statusIndicator = document.getElementById('status-indicator');
        const statusText = document.getElementById('status-text');
        if (statusIndicator && statusText) {
            statusIndicator.classList.remove('status-online');
            statusIndicator.classList.add('status-traveling');
            statusText.textContent = 'TEMPORAL TRANSIT IN PROGRESS';
        }
    }
    
    /**
     * Stop the wormhole and arrive at destination
     * @returns {Promise} Resolves when arrival animation completes
     */
    async stop() {
        if (!this.isActive) return;
        
        // Stop effects
        this.stopRandomRotation();
        this.stopParticles();
        
        // Stop wormhole sound
        if (this.audioWormhole) {
            this.audioWormhole.pause();
            this.audioWormhole.currentTime = 0;
        }
        
        // Stop synth wormhole if active
        if (this.synthWormhole) {
            this.synthWormhole.stop();
            this.synthWormhole = null;
        }
        
        // Play arrival sound
        this.playArrivalSound();
        
        // Flash effect
        await this.arrivalFlash();
        
        // Hide wormhole
        this.container.classList.add('hidden');
        this.isActive = false;
        
        // Update status
        const statusIndicator = document.getElementById('status-indicator');
        const statusText = document.getElementById('status-text');
        if (statusIndicator && statusText) {
            statusIndicator.classList.remove('status-traveling');
            statusIndicator.classList.add('status-online');
            statusText.textContent = 'TEMPORAL COORDINATES LOCKED';
        }
        
        return this.targetYear;
    }
    
    /**
     * Play wormhole whoosh sound
     */
    playWormholeSound() {
        // Try HTML audio first
        if (this.audioWormhole && this.audioWormhole.src) {
            this.audioWormhole.currentTime = 0;
            this.audioWormhole.volume = 0.6;
            this.audioWormhole.play().catch(e => {
                console.log('Wormhole audio file failed, using synth');
                this.playSynthWormhole();
            });
        } else {
            this.playSynthWormhole();
        }
    }
    
    /**
     * Play synthesized wormhole sound
     */
    playSynthWormhole() {
        if (typeof audioSynth !== 'undefined') {
            this.synthWormhole = audioSynth.playWormhole();
        }
    }
    
    /**
     * Play arrival sound
     */
    playArrivalSound() {
        // Try HTML audio first
        if (this.audioArrival && this.audioArrival.src) {
            this.audioArrival.currentTime = 0;
            this.audioArrival.volume = 0.8;
            this.audioArrival.play().catch(e => {
                console.log('Arrival audio file failed, using synth');
                this.playSynthArrival();
            });
        } else {
            this.playSynthArrival();
        }
    }
    
    /**
     * Play synthesized arrival sound
     */
    playSynthArrival() {
        if (typeof audioSynth !== 'undefined') {
            audioSynth.playArrival();
        }
    }
    
    /**
     * Start random rotation changes
     */
    startRandomRotation() {
        const changeRotation = () => {
            // Random rotation between -30 and 30 degrees
            const newRotation = (Math.random() - 0.5) * 60;
            const duration = 1 + Math.random() * 2; // 1-3 seconds
            
            this.wormhole.style.transition = `transform ${duration}s ease-in-out`;
            this.wormhole.style.transform = `rotateZ(${newRotation}deg)`;
            
            this.currentRotation = newRotation;
        };
        
        // Initial rotation
        changeRotation();
        
        // Change rotation every 1.5-3 seconds
        this.rotationInterval = setInterval(() => {
            changeRotation();
        }, 1500 + Math.random() * 1500);
    }
    
    /**
     * Stop random rotation
     */
    stopRandomRotation() {
        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
            this.rotationInterval = null;
        }
        this.wormhole.style.transform = 'rotateZ(0deg)';
    }
    
    /**
     * Start particle effects - bright energy sparks flying OUTWARD from wormhole center
     * Particles originate from the wiggling #wormhole-center element
     */
    startParticles() {
        // Get reference to wormhole center (the element that wiggles)
        const wormholeCenter = document.getElementById('wormhole-center');
        
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'wormhole-particle';
            
            // Get current position of wormhole center (accounts for wiggle animation)
            let centerX, centerY;
            if (wormholeCenter) {
                const rect = wormholeCenter.getBoundingClientRect();
                centerX = rect.left + rect.width / 2;
                centerY = rect.top + rect.height / 2;
            } else {
                centerX = window.innerWidth / 2;
                centerY = window.innerHeight / 2;
            }
            
            // Start very close to center for that "emerging from core" feel
            const startOffset = 5 + Math.random() * 25; // Start 5-30px from center
            const angle = Math.random() * Math.PI * 2;
            const startX = centerX + Math.cos(angle) * startOffset;
            const startY = centerY + Math.sin(angle) * startOffset;
            
            // Calculate end position (fly outward past screen edge)
            const endDistance = Math.max(window.innerWidth, window.innerHeight) * 0.9;
            const endX = centerX + Math.cos(angle) * endDistance;
            const endY = centerY + Math.sin(angle) * endDistance;
            
            // Lightweight spark styling - small with single glow
            const size = 1.5 + Math.random() * 2.5;
            const rand = Math.random();
            let color;
            if (rand < 0.5) {
                color = 'rgba(200, 255, 255, 1)'; // Cyan/white
            } else if (rand < 0.8) {
                color = 'rgba(255, 255, 255, 1)'; // Pure white
            } else {
                color = 'rgba(255, 200, 255, 1)'; // Purple tint
            }
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                left: ${startX}px;
                top: ${startY}px;
                box-shadow: 0 0 4px ${color};
                pointer-events: none;
                z-index: 50;
                will-change: transform, opacity;
            `;
            
            this.particlesContainer.appendChild(particle);
            
            // Animate outward - slower for that dreamy hyperspace feel (60% speed)
            const duration = 1000 + Math.random() * 800;
            particle.animate([
                { 
                    transform: 'translate(0, 0) scale(0.3)',
                    opacity: 0.2
                },
                { 
                    transform: 'translate(0, 0) scale(1)',
                    opacity: 1,
                    offset: 0.08
                },
                { 
                    transform: `translate(${endX - startX}px, ${endY - startY}px) scale(1.2)`,
                    opacity: 0
                }
            ], {
                duration: duration,
                easing: 'ease-in'
            }).onfinish = () => {
                particle.remove();
            };
        };
        
        // Dense starfield - use config for spawn rate
        if (WORMHOLE_CONFIG.showParticles) {
            const interval = 1000 / WORMHOLE_CONFIG.particlesPerSecond;
            this.particleInterval = setInterval(() => {
                createParticle();
            }, interval);
        }
    }
    
    /**
     * Stop particle effects
     */
    stopParticles() {
        if (this.particleInterval) {
            clearInterval(this.particleInterval);
            this.particleInterval = null;
        }
        this.particlesContainer.innerHTML = '';
    }
    
    /**
     * Create arrival flash effect
     */
    arrivalFlash() {
        return new Promise(resolve => {
            const flash = document.createElement('div');
            flash.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: white;
                z-index: 200;
                opacity: 0;
                pointer-events: none;
            `;
            document.body.appendChild(flash);
            
            // Flash animation
            flash.animate([
                { opacity: 0 },
                { opacity: 1 },
                { opacity: 0 }
            ], {
                duration: 500,
                easing: 'ease-out'
            }).onfinish = () => {
                flash.remove();
                resolve();
            };
        });
    }
    
    /**
     * Check if wormhole is currently active
     */
    isRunning() {
        return this.isActive;
    }
}

// Global instance
const wormholeManager = new WormholeManager();
