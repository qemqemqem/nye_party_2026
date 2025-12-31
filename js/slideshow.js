/**
 * Slideshow Manager
 * Handles image and video rotation with Ken Burns effect
 */

class SlideshowManager {
    constructor() {
        this.imageElement = document.getElementById('slideshow-image');
        this.videoElement = document.getElementById('slideshow-video');
        this.currentIndex = 0;
        this.mediaItems = [];
        this.intervalId = null;
        this.currentYear = null;
        this.isVideoPlaying = false;
        
        // Slideshow timing
        this.imageDisplayTime = 10000; // 10 seconds per image
        
        // Video end handler
        this.videoElement.addEventListener('ended', () => this.onVideoEnded());
    }
    
    /**
     * Load media for a specific year
     * @param {string} yearKey - The year folder key (e.g., "2025", "423bce")
     * @param {Array} manifest - Array of filenames for this year
     */
    async loadYear(yearKey, manifest) {
        this.stop();
        this.currentYear = yearKey;
        this.currentIndex = 0;
        this.mediaItems = [];
        
        // Build media items array
        for (const filename of manifest) {
            const extension = filename.split('.').pop().toLowerCase();
            const isVideo = ['mp4', 'webm', 'mov', 'ogg'].includes(extension);
            
            this.mediaItems.push({
                src: `images/${yearKey}/${filename}`,
                isVideo: isVideo,
                filename: filename
            });
        }
        
        // Shuffle for random playback order
        this.shuffleArray(this.mediaItems);
        
        // If no media, show placeholder
        if (this.mediaItems.length === 0) {
            this.showPlaceholder();
            return;
        }
        
        // Start slideshow
        this.showCurrent();
        this.startAutoAdvance();
    }
    
    /**
     * Show placeholder when no images are available
     */
    showPlaceholder() {
        this.imageElement.style.backgroundImage = 'none';
        this.imageElement.style.background = `
            linear-gradient(135deg, rgba(0, 240, 255, 0.1) 0%, rgba(157, 78, 221, 0.1) 100%)
        `;
        this.imageElement.classList.add('active');
        this.videoElement.classList.remove('active');
    }
    
    /**
     * Display current media item
     */
    showCurrent() {
        if (this.mediaItems.length === 0) return;
        
        const item = this.mediaItems[this.currentIndex];
        
        if (item.isVideo) {
            this.showVideo(item.src);
        } else {
            this.showImage(item.src);
        }
    }
    
    /**
     * Display an image
     */
    showImage(src) {
        this.isVideoPlaying = false;
        this.videoElement.classList.remove('active');
        this.videoElement.pause();
        
        // Preload image
        const img = new Image();
        img.onload = () => {
            this.imageElement.style.backgroundImage = `url('${src}')`;
            this.imageElement.classList.add('active');
        };
        img.onerror = () => {
            console.warn(`Failed to load image: ${src}`);
            this.advance();
        };
        img.src = src;
    }
    
    /**
     * Display and play a video
     */
    showVideo(src) {
        this.isVideoPlaying = true;
        this.imageElement.classList.remove('active');
        
        // Stop auto-advance during video
        this.stopAutoAdvance();
        
        this.videoElement.src = src;
        this.videoElement.classList.add('active');
        
        // Try to play with sound first, fall back to muted if needed
        this.videoElement.muted = false;
        this.videoElement.play().catch(() => {
            // Autoplay with sound blocked, try muted
            this.videoElement.muted = true;
            this.videoElement.play().catch(err => {
                console.warn(`Failed to play video: ${src}`, err);
                this.advance();
            });
        });
    }
    
    /**
     * Handle video end
     */
    onVideoEnded() {
        this.isVideoPlaying = false;
        this.advance();
        this.startAutoAdvance();
    }
    
    /**
     * Advance to next media item
     */
    advance() {
        if (this.mediaItems.length === 0) return;
        
        this.currentIndex = (this.currentIndex + 1) % this.mediaItems.length;
        this.showCurrent();
    }
    
    /**
     * Start auto-advance timer
     */
    startAutoAdvance() {
        this.stopAutoAdvance();
        
        this.intervalId = setInterval(() => {
            if (!this.isVideoPlaying) {
                this.advance();
            }
        }, this.imageDisplayTime);
    }
    
    /**
     * Stop auto-advance timer
     */
    stopAutoAdvance() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    
    /**
     * Stop slideshow completely
     */
    stop() {
        this.stopAutoAdvance();
        this.videoElement.pause();
        this.isVideoPlaying = false;
    }
    
    /**
     * Pause slideshow (for wormhole)
     */
    pause() {
        this.stopAutoAdvance();
        if (this.isVideoPlaying) {
            this.videoElement.pause();
        }
    }
    
    /**
     * Resume slideshow
     */
    resume() {
        if (this.isVideoPlaying) {
            this.videoElement.play();
        }
        this.startAutoAdvance();
    }
    
    /**
     * Shuffle array in place (Fisher-Yates)
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

// Global instance
const slideshow = new SlideshowManager();
