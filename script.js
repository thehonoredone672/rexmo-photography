// Preloader
window.addEventListener('load', () => {
    setTimeout(() => { document.getElementById('preloader').classList.add('loaded'); }, 500); 
});

// Custom Cursor (Lerp)
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
let outlineX = mouseX, outlineY = mouseY;

if(window.innerWidth > 900) {
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    function animateCursor() {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
}

// Magnetic Buttons
document.querySelectorAll('.magnetic-wrap').forEach(wrap => {
    const btn = wrap.querySelector('.magnetic-btn');
    const strength = wrap.getAttribute('data-strength') || 40;

    wrap.addEventListener('mousemove', (e) => {
        const rect = wrap.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / wrap.offsetWidth - 0.5) * strength;
        const y = ((e.clientY - rect.top) / wrap.offsetHeight - 0.5) * strength;
        btn.style.transform = `translate(${x}px, ${y}px)`;
        if(cursorOutline) cursorOutline.classList.add('hovered');
        if(cursorDot) cursorDot.style.opacity = '0';
    });

    wrap.addEventListener('mouseleave', () => {
        btn.style.transform = `translate(0px, 0px)`;
        if(cursorOutline) cursorOutline.classList.remove('hovered');
        if(cursorDot) cursorDot.style.opacity = '1';
    });
});

// Universal Hover
document.querySelectorAll('.hover-target:not(.magnetic-wrap)').forEach(el => {
    el.addEventListener('mouseenter', () => { if(cursorOutline) cursorOutline.classList.add('hovered'); if(cursorDot) cursorDot.style.opacity = '0'; });
    el.addEventListener('mouseleave', () => { if(cursorOutline) cursorOutline.classList.remove('hovered'); if(cursorDot) cursorDot.style.opacity = '1'; });
});

// Scroll Reveal
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
}, { threshold: 0.15 });

document.querySelectorAll('.scroll-trigger').forEach(el => revealObserver.observe(el));