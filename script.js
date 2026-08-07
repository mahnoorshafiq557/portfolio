/* ============================================================
   Portfolio — Main Script
   Sections: Utilities | DOM refs | Navigation | Scroll Effects |
   Scroll-Reveal Animations | Card Hover | Hero Typing Effect |
   Custom Cursor | GSAP Hero Intro | Project Filter | Image Modal |
   Load More | Page Load
   ============================================================ */

/* ---------- Utilities ---------- */

function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function (...args) {
        const context = this;
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/* ---------- DOM References ---------- */

const navbar = document.getElementById('navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const blobs = document.querySelectorAll('.blob');
const fadeElements = document.querySelectorAll('.fade-in-scroll');
const projectCards = document.querySelectorAll('.project-card');
const serviceCards = document.querySelectorAll('.service-card');
const filterButtons = document.querySelectorAll('.filter-btn');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeModal = document.querySelector('.close-modal');
const heroSubtitle = document.querySelector('.hero-subtitle');

/* ---------- Navigation ---------- */

// Smooth scroll for in-page anchor links + close mobile menu on navigate
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking outside it
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

/* ---------- Scroll Effects (navbar state, active link, blob parallax) ---------- */

function updateNavbarOnScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
}

function setActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
            });
        }
    });
}

function updateBlobParallax() {
    const scrolled = window.pageYOffset;
    blobs.forEach((blob, index) => {
        const speed = (index + 1) * 0.3;
        blob.style.transform = `translateY(${scrolled * speed}px)`;
    });
}

const debouncedSetActiveNav = debounce(setActiveNav);

window.addEventListener('scroll', () => {
    updateNavbarOnScroll();
    updateBlobParallax();
    debouncedSetActiveNav();
});

/* ---------- Scroll-Reveal Animations ---------- */

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('visible');

        // Animate skill bars once their section becomes visible
        const skillCards = entry.target.querySelectorAll('.skill-card');
        skillCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate');
                const progress = card.querySelector('.skill-progress');
                const percent = progress.getAttribute('data-progress');
                progress.style.setProperty('--progress-width', `${percent}%`);
                progress.style.width = `${percent}%`;
            }, index * 100);
        });
    });
}, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

fadeElements.forEach(el => revealObserver.observe(el));

/* ---------- Card Hover Effects ---------- */

function applyLiftHover(elements, { lift = -8, withGlow = false } = {}) {
    elements.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = '0.3s ease';
            card.style.transform = `translateY(${lift}px) scale(1)`;
            if (withGlow) card.style.boxShadow = '0 20px 40px rgba(8,255,244,0.15)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            if (withGlow) card.style.boxShadow = 'none';
        });
    });
}

applyLiftHover(projectCards, { lift: -12, withGlow: true });
applyLiftHover(serviceCards, { lift: -8 });

/* ---------- Hero Typing Effect ---------- */

function typeHeroSubtitle() {
    if (!heroSubtitle) return;

    const fullText = heroSubtitle.textContent;
    let i = 0;

    (function type() {
        heroSubtitle.innerHTML = fullText.slice(0, i);
        i++;
        if (i <= fullText.length) setTimeout(type, 80);
    })();
}

typeHeroSubtitle();

/* ---------- Custom Cursor ---------- */

const cursor = document.createElement('div');
cursor.style.cssText = `
    width:20px;height:20px;
    background:#08fff4;
    position:fixed;
    border-radius:50%;
    pointer-events:none;
    mix-blend-mode:screen;
    transform:translate(-50%,-50%);
    box-shadow:0 0 20px #08fff4;
    z-index:9999;
`;
document.body.appendChild(cursor);

window.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
});

/* ---------- GSAP Hero Intro Timeline ---------- */

gsap.registerPlugin(ScrollTrigger);

const heroTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: '.hero-content',
        start: 'top 80%'
    }
});

heroTimeline
    .from('.hero-intro', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power4.out'
    })
    .from('.hero-title .gradient-text', {
        y: 60,
        opacity: 0,
        duration: 1.25,
        ease: 'power4.out'
    }, '-=0.4')
    .from('.hero-title .white-text', {
        y: 60,
        opacity: 0,
        duration: 1.75,
        ease: 'power4.out'
    }, '-=0.5')
    .from('.hero-subtitle', {
        y: 40,
        opacity: 0,
        duration: 1.75,
        ease: 'power4.out'
    }, '-=0.5');

/* ---------- Project Filter ---------- */

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.dataset.filter;

        projectCards.forEach(card => {
            const category = card.dataset.category;
            const matches = filter === 'all' || (category && category.includes(filter));
            card.classList.toggle('show', matches);
            card.classList.toggle('hide', !matches);
        });
    });
});

/* ---------- Project Image Modal ---------- */

document.querySelectorAll('.project-image img').forEach(img => {
    img.addEventListener('click', () => {
        modal.classList.add('active');
        modalImg.src = img.src;
    });
});

closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
});

/* ---------- Load More Projects ---------- */

let visibleCount = 3;

projectCards.forEach((card, index) => {
    card.classList.toggle('hide', index >= visibleCount);
    card.classList.toggle('show', index < visibleCount);
});

loadMoreBtn.addEventListener('click', () => {
    visibleCount += 3;

    projectCards.forEach((card, index) => {
        if (index < visibleCount) {
            card.classList.remove('hide');
            card.classList.add('show');
        }
    });

    if (visibleCount >= projectCards.length) {
        loadMoreBtn.style.display = 'none';
    }
});

/* ---------- Page Load ---------- */

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
