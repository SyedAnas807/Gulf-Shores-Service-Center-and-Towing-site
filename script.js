/* ==========================================
   GULF SHORES SERVICE CENTER & TOWING
   Premium Website JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all functionality
    initStickyHeader();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initReviewsCarousel();
    initHistorySlider();
});

/* ==========================================
   1. STICKY HEADER
   ========================================== */
function initStickyHeader() {
    const header = document.getElementById('header');
    const scrollThreshold = 100;
    
    function handleScroll() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Initial check
    handleScroll();
    
    // Throttled scroll listener
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
}

/* ==========================================
   2. MOBILE MENU
   ========================================== */
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!navToggle || !navMenu) return;
    
    // Toggle menu
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ==========================================
   3. SMOOTH SCROLL
   ========================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    const headerOffset = 80;
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - headerOffset;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ==========================================
   4. SCROLL ANIMATIONS
   ========================================== */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

/* ==========================================
   5. REVIEWS CAROUSEL
   ========================================== */
function initReviewsCarousel() {
    const track = document.getElementById('carousel-track');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    
    if (!track || dots.length === 0) return;
    
    let currentIndex = 0;
    const totalSlides = dots.length;
    let autoplayInterval;
    
    // Go to specific slide
    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    
    // Next/Prev buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
            resetAutoplay();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
            resetAutoplay();
        });
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoplay();
        });
    });
    
    // Autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000);
    }
    
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }
    
    // Start autoplay
    startAutoplay();
    
    // Pause on hover
    track.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });
    
    track.addEventListener('mouseleave', () => {
        startAutoplay();
    });
    
    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(currentIndex - 1);
            }
            resetAutoplay();
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const carouselSection = document.getElementById('reviews');
        const rect = carouselSection?.getBoundingClientRect();
        
        if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
            if (e.key === 'ArrowLeft') {
                goToSlide(currentIndex - 1);
                resetAutoplay();
            } else if (e.key === 'ArrowRight') {
                goToSlide(currentIndex + 1);
                resetAutoplay();
            }
        }
    });
}

/* ==========================================
   6. HISTORY SLIDER (BEFORE/AFTER)
   ========================================== */
function initHistorySlider() {
    const handle = document.getElementById('slider-handle');
    const sliderNew = document.getElementById('slider-new');
    
    if (!handle || !sliderNew) return;
    
    const sliderFrame = handle.parentElement;
    let isDragging = false;
    
    function updateSlider(x) {
        const rect = sliderFrame.getBoundingClientRect();
        let percentage = ((x - rect.left) / rect.width) * 100;
        
        // Clamp between 5% and 95%
        percentage = Math.max(5, Math.min(95, percentage));
        
        handle.style.left = `${percentage}%`;
        sliderNew.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
    }
    
    // Mouse events
    handle.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            updateSlider(e.clientX);
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // Touch events
    handle.addEventListener('touchstart', (e) => {
        isDragging = true;
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        if (isDragging) {
            updateSlider(e.touches[0].clientX);
        }
    }, { passive: true });
    
    document.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    // Click on slider frame to jump
    sliderFrame.addEventListener('click', (e) => {
        if (e.target !== handle && !handle.contains(e.target)) {
            updateSlider(e.clientX);
        }
    });
}

/* ==========================================
   7. UTILITY FUNCTIONS
   ========================================== */

// Debounce function for performance
function debounce(func, wait = 100) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit = 100) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ==========================================
   8. PERFORMANCE OPTIMIZATIONS
   ========================================== */

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.scrollBehavior = 'auto';
}
