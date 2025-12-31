/**
 * Time Machine - Main Application
 * University of California, Oakland
 * Center for Quantum Chronodynamics
 * Institute for Applied History
 */

class TimeMachine {
    constructor() {
        // Year configuration
        this.years = {
            1: { year: '2025', era: 'CE', folder: '2025', display: '2025 CE' },
            2: { year: '1969', era: 'CE', folder: '1969', display: '1969 CE' },
            3: { year: '1751', era: 'CE', folder: '1751', display: '1751 CE' },
            4: { year: '423', era: 'BCE', folder: '423bce', display: '423 BCE' },
            5: { year: '2026', era: 'CE', folder: '2026', display: '2026 CE' }
        };
        
        this.currentYearKey = 1; // Start at 2025
        this.manifest = {};
        this.facts = {};
        this.isInitialized = false;
        
        // Scheduled automatic time travel (hour -> yearKey)
        this.schedule = {
            20: 1,  // 8pm  → 2025
            21: 2,  // 9pm  → 1969
            22: 3,  // 10pm → 1751
            23: 4,  // 11pm → 423 BCE
            0:  5,  // Midnight → 2026
            12: 4   // Noon → 423 BCE (testing)
        };
        this.lastScheduledHour = null; // Track which hour we last triggered
        
        // DOM elements
        this.yearValue = document.getElementById('year-value');
        this.yearEra = document.getElementById('year-era');
        this.factsText = document.getElementById('facts-text');
        this.statusText = document.getElementById('status-text');
        this.clockContainer = document.getElementById('clock-container');
        this.clockTime = document.getElementById('clock-time');
    }
    
    /**
     * Initialize the time machine
     */
    async init() {
        console.log('🚀 Initializing Temporal Navigation System v2.1...');
        
        // Load manifest
        await this.loadManifest();
        
        // Load all facts
        await this.loadAllFacts();
        
        // Set up keyboard controls
        this.setupKeyboardControls();
        
        // Start chimes
        chimesManager.start();
        
        // Start glitch effects
        glitchManager.start();
        
        // Start clock
        this.startClock();
        
        // Load starting year (2025)
        await this.goToYear(1, false);
        
        this.isInitialized = true;
        console.log('✅ Temporal Navigation System online');
    }
    
    /**
     * Load image manifest
     */
    async loadManifest() {
        try {
            const response = await fetch('images/manifest.json');
            this.manifest = await response.json();
            console.log('📁 Manifest loaded:', this.manifest);
        } catch (e) {
            console.warn('⚠️ Could not load manifest, using empty:', e);
            this.manifest = {
                "2025": [],
                "1969": [],
                "1751": [],
                "423bce": [],
                "2026": []
            };
        }
    }
    
    /**
     * Load facts for all years
     */
    async loadAllFacts() {
        const folders = ['2025', '1969', '1751', '423bce', '2026'];
        
        for (const folder of folders) {
            try {
                const response = await fetch(`facts/${folder}.txt`);
                const text = await response.text();
                // Split by newlines, filter empty lines
                this.facts[folder] = text.split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0);
                console.log(`📜 Loaded ${this.facts[folder].length} facts for ${folder}`);
            } catch (e) {
                console.warn(`⚠️ Could not load facts for ${folder}:`, e);
                this.facts[folder] = ['Temporal data unavailable for this era.'];
            }
        }
    }
    
    /**
     * Set up keyboard event listeners
     */
    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            // Number keys 1-5 for year selection
            if (e.key >= '1' && e.key <= '5') {
                const yearKey = parseInt(e.key);
                if (this.years[yearKey] && yearKey !== this.currentYearKey) {
                    this.initiateTimeTravel(yearKey);
                }
            }
            
            // Spacebar to exit wormhole
            if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                if (wormholeManager.isRunning()) {
                    this.completeTimeTravel();
                }
            }
            
            // T for test chimes (hidden feature) - 3 bongs
            if (e.key === 't' || e.key === 'T') {
                chimesManager.testChime(3);
            }
            
            // B for bell test - simulates current hour
            if (e.key === 'b' || e.key === 'B') {
                const hour = new Date().getHours() % 12 || 12;
                chimesManager.testChime(hour);
            }
            
            // G for glitch test - triggers a random glitch
            if (e.key === 'g' || e.key === 'G') {
                glitchManager.triggerRandomGlitch();
            }
        });
        
        console.log('⌨️ Keyboard controls initialized');
    }
    
    /**
     * Start time travel to a new year
     */
    async initiateTimeTravel(yearKey) {
        if (wormholeManager.isRunning()) return;
        
        const destination = this.years[yearKey];
        console.log(`🌀 Initiating time travel to ${destination.display}`);
        
        // Pause slideshow
        slideshow.pause();
        
        // Store pending destination
        this.pendingYearKey = yearKey;
        
        // Start wormhole
        wormholeManager.start(destination.display);
    }
    
    /**
     * Complete time travel (on spacebar)
     */
    async completeTimeTravel() {
        if (!this.pendingYearKey) return;
        
        const yearKey = this.pendingYearKey;
        this.pendingYearKey = null;
        
        // Stop wormhole (plays arrival animation)
        await wormholeManager.stop();
        
        // Go to new year
        await this.goToYear(yearKey, true);
    }
    
    /**
     * Navigate to a specific year
     * @param {number} yearKey - The year key (1-5)
     * @param {boolean} animate - Whether to animate the transition
     */
    async goToYear(yearKey, animate = true) {
        const yearConfig = this.years[yearKey];
        if (!yearConfig) return;
        
        this.currentYearKey = yearKey;
        
        // Update year display
        if (animate) {
            this.yearValue.style.opacity = '0';
            this.yearEra.style.opacity = '0';
            await this.wait(200);
        }
        
        this.yearValue.textContent = yearConfig.year;
        this.yearEra.textContent = yearConfig.era;
        
        if (animate) {
            this.yearValue.style.opacity = '1';
            this.yearEra.style.opacity = '1';
        }
        
        // Update status based on current time
        this.updateStatusText(new Date().getMinutes());
        
        // Load slideshow for this year
        const mediaList = this.manifest[yearConfig.folder] || [];
        await slideshow.loadYear(yearConfig.folder, mediaList);
        
        // Start facts rotation for this year
        this.startFactsRotation(yearConfig.folder);
        
        console.log(`📍 Arrived at ${yearConfig.display}`);
    }
    
    /**
     * Start continuous facts ticker for current year
     */
    startFactsRotation(folder) {
        const facts = this.facts[folder] || ['No data available.'];
        const tickerContent = document.getElementById('ticker-content');
        
        // Shuffle facts for random order each time
        const shuffledFacts = [...facts];
        this.shuffleArray(shuffledFacts);
        
        // Build continuous ticker content: all facts with separators, duplicated for seamless loop
        const separator = ' ◆ ';
        const allFacts = shuffledFacts.join(separator) + separator;
        
        // Clear existing content and add two copies for seamless loop
        tickerContent.innerHTML = '';
        
        const span1 = document.createElement('span');
        span1.className = 'ticker-facts';
        span1.textContent = allFacts;
        
        const span2 = document.createElement('span');
        span2.className = 'ticker-facts';
        span2.textContent = allFacts;
        
        tickerContent.appendChild(span1);
        tickerContent.appendChild(span2);
        
        // Calculate animation duration based on content length
        // Fast enough to be dynamic, slow enough to read
        const charWidth = 10; // Approximate pixels per character at 1.4rem
        const contentWidth = allFacts.length * charWidth;
        const scrollSpeed = 150; // pixels per second - brisk news ticker pace
        const duration = contentWidth / scrollSpeed;
        
        // Reset and apply animation
        tickerContent.style.animation = 'none';
        tickerContent.offsetHeight; // Force reflow
        tickerContent.style.animation = `scroll-ticker-continuous ${duration}s linear infinite`;
        
        console.log(`📜 Ticker loaded with ${facts.length} facts, duration: ${duration.toFixed(1)}s`);
    }
    
    /**
     * Start the clock display
     */
    startClock() {
        // Update immediately
        this.updateClock();
        
        // Update every second
        setInterval(() => this.updateClock(), 1000);
        
        // Sync year display every 30 seconds (fixes glitch effect corruption)
        setInterval(() => this.syncYearDisplay(), 30000);
        
        console.log('🕐 Clock started');
    }
    
    /**
     * Sync year display to current state
     * Fixes display corruption from glitch text scramble effects
     */
    syncYearDisplay() {
        const yearConfig = this.years[this.currentYearKey];
        if (!yearConfig) return;
        
        // Update the display elements to match current state
        this.yearValue.textContent = yearConfig.year;
        this.yearEra.textContent = yearConfig.era;
        
        // Also update the stored original text so glitch effects use correct values
        this.yearValue.dataset.originalText = yearConfig.year;
        this.yearEra.dataset.originalText = yearConfig.era;
        
        console.log(`🔄 Year display synced: ${yearConfig.display}`);
    }
    
    /**
     * Update the clock display
     */
    updateClock() {
        const now = new Date();
        const currentMinutes = now.getMinutes();
        const currentSeconds = now.getSeconds();
        
        // Check if we're within 10 minutes of the hour (minutes 50-59)
        const isCountdownMode = currentMinutes >= 50;
        
        if (isCountdownMode) {
            // Show countdown to the hour
            const minutesRemaining = 59 - currentMinutes;
            const secondsRemaining = 60 - currentSeconds;
            
            // Handle the 60 seconds rollover
            const displayMinutes = secondsRemaining === 60 ? minutesRemaining + 1 : minutesRemaining;
            const displaySeconds = secondsRemaining === 60 ? 0 : secondsRemaining;
            
            this.clockTime.textContent = `00:${displayMinutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;
            this.clockContainer.classList.add('countdown-mode');
        } else {
            // Show current time
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = currentMinutes.toString().padStart(2, '0');
            const seconds = currentSeconds.toString().padStart(2, '0');
            
            this.clockTime.textContent = `${hours}:${minutes}:${seconds}`;
            this.clockContainer.classList.remove('countdown-mode');
        }
        
        // Update status text based on time of hour
        this.updateStatusText(currentMinutes);
        
        // Check for scheduled automatic time travel
        this.checkScheduledTravel(now.getHours());
    }
    
    /**
     * Check if we should trigger automatic time travel based on schedule
     */
    checkScheduledTravel(currentHour) {
        // Skip if wormhole is already active
        if (wormholeManager.isRunning()) return;
        
        // Check if this hour has a scheduled destination
        const scheduledYearKey = this.schedule[currentHour];
        if (scheduledYearKey === undefined) {
            // No schedule for this hour, reset tracker
            this.lastScheduledHour = null;
            return;
        }
        
        // Skip if we already triggered for this hour
        if (this.lastScheduledHour === currentHour) return;
        
        // Skip if we're already at the destination
        if (this.currentYearKey === scheduledYearKey) {
            this.lastScheduledHour = currentHour;
            return;
        }
        
        // Trigger automatic time travel!
        console.log(`🕐 Scheduled time travel triggered: hour ${currentHour} → year key ${scheduledYearKey}`);
        this.lastScheduledHour = currentHour;
        this.initiateAutomaticTimeTravel(scheduledYearKey);
    }
    
    /**
     * Initiate automatic time travel (no spacebar required)
     */
    async initiateAutomaticTimeTravel(yearKey) {
        const destination = this.years[yearKey];
        console.log(`🌀 AUTO: Initiating time travel to ${destination.display}`);
        
        // Pause slideshow
        slideshow.pause();
        
        // Start wormhole
        wormholeManager.start(destination.display);
        
        // Wait a dramatic moment (3-5 seconds of wormhole)
        await this.wait(4000);
        
        // Complete the travel automatically
        await wormholeManager.stop();
        
        // Go to new year
        await this.goToYear(yearKey, true);
    }
    
    /**
     * Update the status text based on time of hour
     */
    updateStatusText(currentMinutes) {
        // First 30 minutes of the hour: recharging
        // Last 30 minutes of the hour: locked
        const newStatus = currentMinutes < 30 
            ? 'TEMPORAL CORE RECHARGING' 
            : 'TEMPORAL COORDINATES LOCKED';
        
        // Only update if different (prevents constant DOM writes)
        if (this.statusText.textContent !== newStatus) {
            this.statusText.textContent = newStatus;
        }
    }
    
    /**
     * Utility: wait for milliseconds
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Utility: shuffle array in place (Fisher-Yates)
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.timeMachine = new TimeMachine();
    window.timeMachine.init();
});
