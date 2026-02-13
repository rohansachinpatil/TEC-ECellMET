// Scroll-based Image Sequence for Hero Section
// Vanilla JS implementation of the React useScrollImageSequence hook

class ScrollImageSequence {
    constructor(frameCount, framePrefix = 'ezgif-frame-', containerId = 'hero-canvas') {
        this.frameCount = frameCount;
        this.framePrefix = framePrefix;
        this.images = [];
        this.currentFrame = 0;
        this.isLoaded = false;
        this.canvas = document.getElementById(containerId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

        if (this.canvas) {
            this.init();
        }
    }

    init() {
        // Set canvas size
        this.updateCanvasSize();
        window.addEventListener('resize', () => this.updateCanvasSize());

        // Preload images
        this.preloadImages();
    }

    updateCanvasSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    preloadImages() {
        let loadedCount = 0;

        for (let i = 1; i <= this.frameCount; i++) {
            const img = new Image();
            const frameNumber = String(i).padStart(3, '0');
            img.src = `/frames/${this.framePrefix}${frameNumber}.jpg`;

            img.onload = () => {
                loadedCount++;
                if (loadedCount === this.frameCount) {
                    this.isLoaded = true;
                    this.setupScrollListener();
                    this.renderFrame(0); // Render first frame
                }
            };

            this.images.push(img);
        }
    }

    setupScrollListener() {
        const handleScroll = () => {
            const heroSection = document.getElementById('hero-section');
            if (!heroSection) return;

            const heroHeight = heroSection.offsetHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Only calculate frames within hero section
            if (scrollTop < heroHeight) {
                const scrollFraction = Math.min(scrollTop / heroHeight, 1);
                const frameIndex = Math.min(
                    Math.floor(scrollFraction * this.frameCount),
                    this.frameCount - 1
                );

                if (frameIndex !== this.currentFrame) {
                    this.currentFrame = frameIndex;
                    this.renderFrame(frameIndex);
                }

                // Update content visibility based on scroll
                this.updateContentVisibility(scrollFraction);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial call
    }

    renderFrame(index) {
        if (!this.ctx || !this.images[index] || !this.images[index].complete) return;

        const img = this.images[index];
        const canvasAspect = this.canvas.width / this.canvas.height;
        const imgAspect = img.width / img.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasAspect > imgAspect) {
            drawWidth = this.canvas.width;
            drawHeight = this.canvas.width / imgAspect;
            offsetX = 0;
            offsetY = (this.canvas.height - drawHeight) / 2;
        } else {
            drawHeight = this.canvas.height;
            drawWidth = this.canvas.height * imgAspect;
            offsetX = (this.canvas.width - drawWidth) / 2;
            offsetY = 0;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }

    updateContentVisibility(scrollProgress) {
        const content1 = document.getElementById('hero-content-1');
        const content2 = document.getElementById('hero-content-2');
        const content3 = document.getElementById('hero-content-3');

        // Content stages based on scroll progress
        if (scrollProgress < 0.3) {
            this.showContent(content1);
            this.hideContent(content2);
            this.hideContent(content3);
        } else if (scrollProgress < 0.6) {
            this.hideContent(content1);
            this.showContent(content2);
            this.hideContent(content3);
        } else {
            this.hideContent(content1);
            this.hideContent(content2);
            this.showContent(content3);
        }
    }

    showContent(element) {
        if (!element) return;
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        element.style.pointerEvents = 'auto';
    }

    hideContent(element) {
        if (!element) return;
        element.style.opacity = '0';
        element.style.transform = 'translateY(-50px)';
        element.style.pointerEvents = 'none';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    // Create scroll image sequence with 120 frames
    const heroSequence = new ScrollImageSequence(120, 'ezgif-frame-', 'hero-canvas');

    // Add loading indicator
    const loadingIndicator = document.getElementById('hero-loading');
    if (loadingIndicator && heroSequence) {
        const checkLoaded = setInterval(() => {
            if (heroSequence.isLoaded) {
                loadingIndicator.style.opacity = '0';
                setTimeout(() => {
                    loadingIndicator.style.display = 'none';
                }, 500);
                clearInterval(checkLoaded);
            }
        }, 100);
    }
});
