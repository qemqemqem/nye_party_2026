/**
 * Glitch Effects Manager
 * Temporal instability visual effects for the Time Machine
 * 
 * Effects fire randomly every 5-25 seconds to suggest
 * the time machine is experiencing interference.
 */

class GlitchManager {
    constructor() {
        this.minInterval = 1000;  // 1 second (dev mode)
        this.maxInterval = 12000;  // 3 seconds (dev mode)
        // Production values: 5000-25000
        
        this.isRunning = false;
        this.timeoutId = null;
        
        // Elements we'll glitch
        this.body = document.body;
        this.yearValue = document.getElementById('year-value');
        this.yearEra = document.getElementById('year-era');
        this.statusText = document.getElementById('status-text');
        
        // Glitch characters for text scramble
        this.glitchChars = '█▓▒░╔╗╚╝║═╬┼┤├┴┬│─@#$%&*!?<>[]{}';
        
        // Available effects (can be toggled)
        this.effects = {
            flicker: false,  // Disabled - too jarring
            rgbSplit: true,
            textScramble: true,
            logoShake: true
        };
        
        // Create indicator element
        this.indicator = null;
        this.createIndicator();
    }
    
    /**
     * Create the glitch indicator (red circle in bottom left)
     */
    createIndicator() {
        // Wait for DOM to be ready
        if (!document.body) {
            document.addEventListener('DOMContentLoaded', () => this.createIndicator());
            return;
        }
        
        this.indicator = document.createElement('div');
        this.indicator.id = 'glitch-indicator';
        this.indicator.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 20px;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #ff3333;
            box-shadow: 0 0 10px #ff3333, 0 0 20px #ff3333;
            opacity: 1;
            transition: opacity 0.15s ease-out;
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(this.indicator);
        console.log('🔴 Glitch indicator created');
    }
    
    /**
     * Flash the indicator briefly
     */
    flashIndicator() {
        if (!this.indicator) return;
        this.indicator.style.opacity = '1';
        setTimeout(() => {
            this.indicator.style.opacity = '0';
        }, 400);
    }
    
    /**
     * Start the glitch system
     */
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.scheduleNextGlitch();
        console.log('⚡ Glitch system activated');
    }
    
    /**
     * Stop the glitch system
     */
    stop() {
        this.isRunning = false;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        console.log('⚡ Glitch system deactivated');
    }
    
    /**
     * Schedule the next random glitch
     */
    scheduleNextGlitch() {
        if (!this.isRunning) return;
        
        const delay = this.randomRange(this.minInterval, this.maxInterval);
        
        this.timeoutId = setTimeout(() => {
            this.triggerRandomGlitch();
            this.scheduleNextGlitch();
        }, delay);
    }
    
    /**
     * Trigger a random enabled glitch effect
     */
    triggerRandomGlitch() {
        const enabledEffects = Object.entries(this.effects)
            .filter(([_, enabled]) => enabled)
            .map(([name, _]) => name);
        
        if (enabledEffects.length === 0) return;
        
        const effect = enabledEffects[Math.floor(Math.random() * enabledEffects.length)];
        
        // Flash the indicator
        this.flashIndicator();
        
        console.log(`⚡ Glitch: ${effect}`);
        
        switch (effect) {
            case 'flicker':
                this.doFlicker();
                break;
            case 'rgbSplit':
                this.doRgbSplit();
                break;
            case 'textScramble':
                this.doTextScramble();
                break;
            case 'logoShake':
                this.doLogoShake();
                break;
        }
    }
    
    /**
     * Screen flicker effect - multiple brightness/opacity pulses
     */
    doFlicker() {
        // Random number of flickers (4-12)
        const flickerCount = this.randomRange(4, 12);
        // Random period per flicker (200-500ms)
        const flickerPeriod = this.randomRange(200, 500);
        
        let count = 0;
        
        const flicker = () => {
            // Toggle the flicker class
            this.body.classList.toggle('glitch-flicker');
            count++;
            
            if (count < flickerCount * 2) {
                // Random variation in timing for organic feel
                const nextDelay = flickerPeriod / 2 + Math.random() * (flickerPeriod / 2);
                setTimeout(flicker, nextDelay);
            } else {
                // Ensure we end with flicker off
                this.body.classList.remove('glitch-flicker');
            }
        };
        
        flicker();
    }
    
    /**
     * RGB split / chromatic aberration effect
     */
    doRgbSplit() {
        // Random duration between 500-5000ms
        const duration = this.randomRange(500, 5000);
        
        // Set CSS variable for animation duration
        this.body.style.setProperty('--rgb-glitch-duration', `${duration}ms`);
        this.body.classList.add('glitch-rgb-split');
        
        setTimeout(() => {
            this.body.classList.remove('glitch-rgb-split');
        }, duration);
    }
    
    /**
     * Logo shake effect - UCO logo shakes/vibrates
     */
    doLogoShake() {
        const logo = document.querySelector('.watermark-logo');
        if (!logo) return;
        
        // Random duration between 500-1500ms
        const duration = this.randomRange(500, 1500);
        
        // Random intensity: 1 = subtle, 2 = medium, 3 = intense
        const intensity = this.randomRange(1, 3);
        
        // Random speed multiplier (faster = more frantic)
        const speed = this.randomRange(1, 3);
        
        // Set CSS variables
        logo.style.setProperty('--shake-duration', `${duration}ms`);
        logo.style.setProperty('--shake-intensity', intensity);
        logo.style.setProperty('--shake-speed', speed);
        logo.classList.add('glitch-shake');
        
        setTimeout(() => {
            logo.classList.remove('glitch-shake');
        }, duration);
    }
    
    /**
     * Text scramble effect - corrupts text briefly
     */
    doTextScramble() {
        // Pick ONE random element to scramble
        const watermarkEl = document.querySelector('.watermark-university');
        const deptEls = document.querySelectorAll('.watermark-dept');
        
        const targets = [
            { el: this.yearValue, key: 'year' },
            { el: this.statusText, key: 'status' },
            { el: watermarkEl, key: 'watermark' },
            { el: deptEls[0], key: 'dept1' },  // Center for Quantum Chronodynamics
            { el: deptEls[1], key: 'dept2' }   // Institute for Applied History
        ].filter(t => t.el);
        
        if (targets.length === 0) return;
        
        // Pick exactly one target randomly
        const target = targets[Math.floor(Math.random() * targets.length)];
        
        // Skip if this element is already being scrambled
        if (target.el.dataset.scrambling === 'true') return;
        
        // Scramble it
        this.scrambleElement(target.el);
    }
    
    /**
     * Scramble an element's text with multiple iterations
     */
    scrambleElement(element) {
        // Store original text if not already stored
        if (!element.dataset.originalText) {
            element.dataset.originalText = element.textContent;
        }
        
        const originalText = element.dataset.originalText;
        
        // Mark as scrambling
        element.dataset.scrambling = 'true';
        
        // Random duration between 700-3000ms
        const duration = this.randomRange(700, 3000);
        const intervalTime = 50;
        const iterations = Math.floor(duration / intervalTime);
        let count = 0;
        
        const interval = setInterval(() => {
            // Calculate progress (0 to 1)
            const progress = count / iterations;
            
            // Scramble some characters - more at start, less at end
            element.textContent = originalText
                .split('')
                .map((char, i) => {
                    // Scramble chance decreases as we progress
                    const scrambleChance = 0.5 * (1 - progress * 0.8);
                    if (char === ' ') return ' ';
                    if (Math.random() < scrambleChance) {
                        return this.glitchChars[Math.floor(Math.random() * this.glitchChars.length)];
                    }
                    return char;
                })
                .join('');
            
            count++;
            
            if (count >= iterations) {
                clearInterval(interval);
                // Restore original text
                element.textContent = originalText;
                // Clear scrambling flag
                element.dataset.scrambling = 'false';
            }
        }, intervalTime);
    }
    
    /**
     * Utility: random number in range
     */
    randomRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    /**
     * Utility: shuffle array
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    /**
     * Manually trigger a specific effect (for testing)
     */
    trigger(effectName) {
        switch (effectName) {
            case 'flicker':
                this.doFlicker();
                break;
            case 'rgbSplit':
                this.doRgbSplit();
                break;
            case 'textScramble':
                this.doTextScramble();
                break;
            case 'logoShake':
                this.doLogoShake();
                break;
            default:
                console.warn(`Unknown effect: ${effectName}`);
        }
    }
}

// Create global instance
const glitchManager = new GlitchManager();
