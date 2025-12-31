/**
 * Synthesized Audio Generator
 * Fallback audio using Web Audio API when files aren't available
 */

class AudioSynth {
    constructor() {
        this.audioContext = null;
        this.isInitialized = false;
    }
    
    /**
     * Initialize audio context (must be called after user interaction)
     */
    init() {
        if (this.isInitialized) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.isInitialized = true;
            console.log('🔊 Audio synthesizer initialized');
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }
    }
    
    /**
     * Ensure audio context is running (call after user gesture)
     */
    async resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }
    
    /**
     * Play a church bell sound
     */
    playBell() {
        if (!this.audioContext) this.init();
        if (!this.audioContext) return;
        
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        // Bell fundamental frequency
        const fundamental = 220; // A3
        
        // Create multiple oscillators for rich bell sound
        const frequencies = [
            fundamental,
            fundamental * 2,      // Octave
            fundamental * 2.4,    // Minor third above octave
            fundamental * 3,      // Fifth above octave
            fundamental * 4.2,    // Shimmer
        ];
        
        const gainNode = ctx.createGain();
        gainNode.connect(ctx.destination);
        gainNode.gain.setValueAtTime(0.7, now);
        gainNode.gain.exponentialDecayTo = 0.001;
        gainNode.gain.setTargetAtTime(0.001, now + 0.1, 1.5);
        
        frequencies.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const oscGain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            
            // Higher partials decay faster
            const decayTime = 2.5 - (i * 0.3);
            oscGain.gain.setValueAtTime(0.5 / (i + 1), now);
            oscGain.gain.exponentialDecayTo = 0.001;
            oscGain.gain.setTargetAtTime(0.001, now + 0.05, decayTime / 3);
            
            osc.connect(oscGain);
            oscGain.connect(gainNode);
            
            osc.start(now);
            osc.stop(now + decayTime + 1);
        });
        
        // Add some noise for the strike
        const bufferSize = ctx.sampleRate * 0.1;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const noiseData = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            noiseData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
        }
        
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.value = fundamental * 2;
        noiseFilter.Q.value = 2;
        
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.25, now);
        noiseGain.gain.exponentialDecayTo = 0.001;
        noiseGain.gain.setTargetAtTime(0.001, now, 0.1);
        
        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        
        noiseSource.start(now);
    }
    
    /**
     * Play wormhole whoosh sound (continuous)
     * @returns {Object} Controller with stop() method
     */
    playWormhole() {
        if (!this.audioContext) this.init();
        if (!this.audioContext) return { stop: () => {} };
        
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        // Create noise source for whoosh
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const noiseData = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            noiseData[i] = Math.random() * 2 - 1;
        }
        
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        noiseSource.loop = true;
        
        // Sweeping filter for motion effect
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.value = 5;
        
        // LFO for filter sweep
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.5;
        lfoGain.gain.value = 800;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        filter.frequency.value = 1000;
        
        // Tremolo for pulsing
        const tremolo = ctx.createOscillator();
        const tremoloGain = ctx.createGain();
        tremolo.frequency.value = 8;
        tremoloGain.gain.value = 0.3;
        
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0;
        masterGain.gain.linearRampToValueAtTime(0.25, now + 0.5);
        
        tremolo.connect(tremoloGain);
        tremoloGain.connect(masterGain.gain);
        
        noiseSource.connect(filter);
        filter.connect(masterGain);
        masterGain.connect(ctx.destination);
        
        // Add a low drone
        const drone = ctx.createOscillator();
        drone.type = 'sawtooth';
        drone.frequency.value = 60;
        
        const droneGain = ctx.createGain();
        droneGain.gain.value = 0;
        droneGain.gain.linearRampToValueAtTime(0.08, now + 0.3);
        
        const droneFilter = ctx.createBiquadFilter();
        droneFilter.type = 'lowpass';
        droneFilter.frequency.value = 200;
        
        drone.connect(droneFilter);
        droneFilter.connect(droneGain);
        droneGain.connect(ctx.destination);
        
        // Start all
        noiseSource.start(now);
        lfo.start(now);
        tremolo.start(now);
        drone.start(now);
        
        // Return controller
        return {
            stop: () => {
                const stopTime = ctx.currentTime;
                masterGain.gain.linearRampToValueAtTime(0, stopTime + 0.3);
                droneGain.gain.linearRampToValueAtTime(0, stopTime + 0.3);
                
                setTimeout(() => {
                    try {
                        noiseSource.stop();
                        lfo.stop();
                        tremolo.stop();
                        drone.stop();
                    } catch (e) {}
                }, 400);
            }
        };
    }
    
    /**
     * Play arrival sound
     */
    playArrival() {
        if (!this.audioContext) this.init();
        if (!this.audioContext) return;
        
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        // Reverse cymbal / whoosh down effect
        const bufferSize = ctx.sampleRate * 0.8;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const noiseData = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            // Reverse envelope
            const env = Math.pow(i / bufferSize, 2);
            noiseData[i] = (Math.random() * 2 - 1) * env;
        }
        
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(100, now);
        filter.frequency.exponentialRampToValueAtTime(4000, now + 0.4);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.8);
        
        noiseSource.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        noiseSource.start(now);
        
        // Add a "thud" impact
        const thud = ctx.createOscillator();
        thud.type = 'sine';
        thud.frequency.setValueAtTime(100, now + 0.35);
        thud.frequency.exponentialRampToValueAtTime(30, now + 0.6);
        
        const thudGain = ctx.createGain();
        thudGain.gain.setValueAtTime(0, now);
        thudGain.gain.setValueAtTime(0.5, now + 0.35);
        thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        
        thud.connect(thudGain);
        thudGain.connect(ctx.destination);
        
        thud.start(now + 0.35);
        thud.stop(now + 1);
    }
}

// Global instance
const audioSynth = new AudioSynth();

// Initialize on first user interaction
document.addEventListener('click', () => audioSynth.init(), { once: true });
document.addEventListener('keydown', () => audioSynth.init(), { once: true });
