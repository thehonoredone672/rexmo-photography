// ===============================
// 1. LENIS SMOOTH SCROLL SETUP
// ===============================
const lenis = new Lenis({
    smooth: true,
    lerp: 0.08, // 🔥 better performance than duration
    direction: 'vertical',
    gestureDirection: 'vertical',
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', () => {
    ScrollTrigger.update();
});

// Run Lenis on every frame
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

// Prevent frame drops freezing animations
gsap.ticker.lagSmoothing(1000, 16);


// ===============================
// 2. NAVBAR SCROLL EFFECT (FIXED)
// ===============================
const nav = document.querySelector('nav');

if (nav) {
    lenis.on('scroll', ({ scroll }) => {
        if (scroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}


// ===============================
// 3. MOBILE MENU TOGGLE (SAFE)
// ===============================
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        const icon = menuToggle.querySelector('i');
        if (icon) {
            if (navLinks.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        }
    });
}


// ===============================
// 4. GSAP SCROLL ANIMATIONS (OPTIMIZED)
// ===============================
gsap.set('.gs-up', {
    y: 40,
    opacity: 0
});

// Batch animations for performance
ScrollTrigger.batch('.gs-up', {
    start: 'top 85%',
    onEnter: (batch) => {
        gsap.to(batch, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.1
        });
    }
});


// ===============================
// 5. SCROLL PERFORMANCE HELPERS
// ===============================

// Disable iframe interaction while scrolling (prevents lag)
let scrollTimeout;

lenis.on('scroll', () => {
    document.body.classList.add('scrolling-active');

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        document.body.classList.remove('scrolling-active');
    }, 200);
});


// ===============================
// 6. REFRESH FIXES (IMPORTANT)
// ===============================

// After page load (for lazy images)
window.addEventListener('load', () => {
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 1000);
});

// On resize
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});


// ===============================
// 7. OPTIONAL: FORCE INITIAL REFRESH
// ===============================
setTimeout(() => {
    ScrollTrigger.refresh();
}, 500);
