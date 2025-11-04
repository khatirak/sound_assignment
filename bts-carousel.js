// Carousel functionality for BTS page

let currentSlide = 0;
let slides = [];
let indicators = [];
let autoPlayInterval = null;

// Initialize carousel when page loads
document.addEventListener('DOMContentLoaded', function() {
    slides = document.querySelectorAll('.carousel-slide');
    indicators = document.querySelectorAll('.carousel-indicator');
    
    // Set initial active slide
    updateCarousel();
    
    // Optional: Auto-play functionality (uncomment if desired)
    // startAutoPlay();
    
    // Pause video when switching slides
    setupVideoHandling();
});

// Change slide by direction (-1 for previous, 1 for next)
function changeSlide(direction) {
    const totalSlides = slides.length;
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    updateCarousel();
    resetAutoPlay();
}

// Go to specific slide
function goToSlide(index) {
    if (index >= 0 && index < slides.length) {
        currentSlide = index;
        updateCarousel();
        resetAutoPlay();
    }
}

// Update carousel display
function updateCarousel() {
    // Update slides
    slides.forEach((slide, index) => {
        if (index === currentSlide) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
            // Pause video if not active
            const video = slide.querySelector('video');
            if (video) {
                video.pause();
            }
        }
    });
    
    // Update indicators
    indicators.forEach((indicator, index) => {
        if (index === currentSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// Setup video handling - pause videos when not active
function setupVideoHandling() {
    slides.forEach((slide, index) => {
        const video = slide.querySelector('video');
        if (video) {
            // When video starts playing, pause other videos
            video.addEventListener('play', function() {
                slides.forEach((otherSlide, otherIndex) => {
                    if (otherIndex !== index) {
                        const otherVideo = otherSlide.querySelector('video');
                        if (otherVideo) {
                            otherVideo.pause();
                        }
                    }
                });
            });
            
            // Reset video when slide becomes inactive
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        if (!slide.classList.contains('active')) {
                            video.pause();
                            video.currentTime = 0;
                        }
                    }
                });
            });
            
            observer.observe(slide, {
                attributes: true,
                attributeFilter: ['class']
            });
        }
    });
}

// Optional: Auto-play functionality
function startAutoPlay() {
    autoPlayInterval = setInterval(function() {
        changeSlide(1);
    }, 5000); // Change slide every 5 seconds
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

function resetAutoPlay() {
    stopAutoPlay();
    // Uncomment if you want auto-play
    // startAutoPlay();
}

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    // Only handle keyboard events if we're on the BTS page
    if (document.querySelector('.carousel-wrapper')) {
        if (event.key === 'ArrowLeft') {
            changeSlide(-1);
        } else if (event.key === 'ArrowRight') {
            changeSlide(1);
        }
    }
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

const carouselContainer = document.querySelector('.carousel-container');
if (carouselContainer) {
    carouselContainer.addEventListener('touchstart', function(event) {
        touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });
    
    carouselContainer.addEventListener('touchend', function(event) {
        touchEndX = event.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    const swipeThreshold = 50; // Minimum swipe distance
    
    if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left - next slide
        changeSlide(1);
    } else if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right - previous slide
        changeSlide(-1);
    }
}

