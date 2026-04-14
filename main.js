gsap.registerPlugin(ScrollTrigger);

// 1. Lenis Smooth Scroll Engine
const lenis = new Lenis({
    autoResize: true,
    duration: 1.2, 
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false 
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0, 0);

// 2. THE OPTIMIZATIONS: Image Tracker & Iframe Tracker
let refreshTimeout;
function requestScrollRefresh() {
    clearTimeout(refreshTimeout);
    refreshTimeout = setTimeout(() => { ScrollTrigger.refresh(); }, 150); 
}

// Track heavy photos
document.querySelectorAll('img').forEach(img => {
    if (!img.complete) {
        img.addEventListener('load', requestScrollRefresh);
        img.addEventListener('error', requestScrollRefresh); 
    }
});

// Track iframes (Fixes Poetry Page getting stuck)
document.querySelectorAll('iframe').forEach(iframe => {
    iframe.addEventListener('load', requestScrollRefresh);
});
let igCheckCount = 0;
const igInterval = setInterval(() => {
    requestScrollRefresh();
    igCheckCount++;
    if(igCheckCount > 10) clearInterval(igInterval); 
}, 500);

const layoutObserver = new ResizeObserver(() => requestScrollRefresh());
const grids = document.querySelectorAll('.mosaic-gallery, .collections-grid, .about-match-grid');
grids.forEach(grid => layoutObserver.observe(grid));
layoutObserver.observe(document.body);

// 3. AUTO-ACTIVE NAVBAR HIGHLIGHTER
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage) {
        link.classList.add('active-link');
    } else {
        link.classList.remove('active-link');
    }
});

// 4. Preloader Logic
window.addEventListener('DOMContentLoaded', () => {
    document.body.style.overflow = '';
    const preloader = document.querySelector('.preloader');
    
    if (!sessionStorage.getItem('rexmo_loaded')) {
        if (preloader) {
            document.body.style.overflow = 'hidden'; 
            const tl = gsap.timeline({
                onComplete: () => {
                    document.body.style.overflow = '';
                    preloader.style.display = 'none';
                    sessionStorage.setItem('rexmo_loaded', 'true');
                    initScrollAnimations();
                    requestScrollRefresh();
                }
            });
            tl.to('.preloader-logo', { autoAlpha: 1, duration: 1, ease: 'power3.out' })
              .to('.preloader-logo', { autoAlpha: 0, duration: 0.8, ease: 'power3.in', delay: 0.5 })
              .to('.preloader', { opacity: 0, duration: 0.8, ease: 'power2.inOut' }, "-=0.2");
        } else {
            initScrollAnimations();
        }
    } else {
        if (preloader) preloader.style.display = 'none';
        initScrollAnimations();
        requestScrollRefresh();
    }
    
    setTimeout(() => { 
        document.body.style.overflow = ''; 
        requestScrollRefresh();
    }, 2500);
});

// 5. HIGH-PERFORMANCE GSAP REVEALS
function initScrollAnimations() {
    gsap.fromTo('.page-header .title-large, .hero .title-large', 
        { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.2, ease: 'power3.out', delay: 0.1 }
    );
    gsap.fromTo('.hero p, .page-header p', 
        { y: 15, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.2, ease: 'power2.out', delay: 0.3 }
    );
    gsap.utils.toArray('.title-medium').forEach(title => {
        gsap.fromTo(title, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: title, start: "top 85%" } });
    });
    
    // Animate standard elements and the new Grey Boxes
    gsap.utils.toArray('.gs-up, .grey-text-box').forEach(elem => {
        if (elem.classList.contains('title-medium')) return; 
        gsap.fromTo(elem, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.2, ease: "power2.out", scrollTrigger: { trigger: elem, start: "top 85%" } });
    });
    
    if(document.querySelectorAll('.mosaic-item').length > 0) {
        gsap.fromTo('.mosaic-item', 
            { y: 30, autoAlpha: 0 }, 
            { y: 0, autoAlpha: 1, duration: 1, stagger: 0.05, ease: "power3.out", scrollTrigger: { trigger: ".mosaic-gallery", start: "top 80%" } }
        );
    }

    gsap.utils.toArray('.img-container, .shape-pill, .about-img-wrap').forEach(container => {
        gsap.fromTo(container, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: container, start: "top 85%" } });
    });

    if(document.querySelector('.hero-bg')) {
        gsap.to('.hero-bg', { yPercent: 15, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    }
}

// 6. Navbar & Mobile Menu Logic
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if(window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
});

const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');
let menuOpen = false;

if(mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        menuOpen = !menuOpen;
        const icon = mobileMenu.querySelector('i');
        
        if(menuOpen) {
            icon.classList.remove('fa-bars'); icon.classList.add('fa-times');
            document.body.style.overflow = 'hidden'; 
            navLinks.classList.add('active'); 
            
            gsap.fromTo(navLinks.querySelectorAll('a'), 
                { y: 20, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out', delay: 0.1 }
            );
        } else {
            icon.classList.remove('fa-times'); icon.classList.add('fa-bars');
            document.body.style.overflow = ''; 
            
            gsap.to(navLinks.querySelectorAll('a'), {
                y: -10, opacity: 0, duration: 0.3, ease: 'power2.in',
                onComplete: () => navLinks.classList.remove('active')
            });
        }
    });
}