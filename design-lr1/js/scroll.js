// Задание 3. Анимации при скролле + параллакс
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. Появление блоков при попадании в viewport (Intersection Observer)
const targets = document.querySelectorAll('.section-title, .feature, .how__step, .review, .cta__inner');

if (!reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    targets.forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = (i % 4) * 100 + 'ms';
        observer.observe(el);
    });
}

// 2. Параллакс hero и 3. прогресс-бар прокрутки
const heroBg = document.querySelector('.hero__bg');
const bar = document.querySelector('.progress__bar');
let ticking = false;

function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (!reduceMotion) {
        heroBg.style.transform = `translateY(${y * 0.4}px)`;
    }
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
    }
}, { passive: true });

onScroll();
