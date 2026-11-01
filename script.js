// ===== КУРСОР =====
const cursor = document.querySelector('.cursor');
const cursorDot = document.querySelector('.cursor-dot');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorX = mouseX;
let cursorY = mouseY;

// Сразу ставим курсор в центр, чтобы он был виден до движения мыши
cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
});

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.2;
  cursorY += (mouseY - cursorY) * 0.2;
  cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

const interactive = document.querySelectorAll('a, button, .case-card, .service-card, input, .theme-toggle');
interactive.forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
});

document.addEventListener('mouseleave', () => {
  cursor.classList.remove('active');
  cursorDot.classList.remove('active');
});
document.addEventListener('mouseenter', () => {
  cursor.classList.add('active');
  cursorDot.classList.add('active');
});

// ===== СЧЁТЧИКИ =====
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach(counter => {
    const target = +counter.dataset.count;
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target) + (progress === 1 ? '+' : '');
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero-stats');
if (statsSection) statsObserver.observe(statsSection);

// ===== ПОЯВЛЕНИЕ КАРТОЧЕК =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .case-card').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
  revealObserver.observe(el);
});

// ===== ФОРМА =====
function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const success = document.getElementById('success');
  form.style.opacity = '0.5';
  form.style.pointerEvents = 'none';
  success.classList.add('show');
  setTimeout(() => {
    form.reset();
    form.style.opacity = '1';
    form.style.pointerEvents = 'auto';
    success.classList.remove('show');
  }, 4000);
  return false;
}

// ===== ПАРАЛЛАКС БЛОБОВ =====
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 40;
  const y = (e.clientY / window.innerHeight - 0.5) * 40;
  document.querySelectorAll('.blob').forEach((blob, i) => {
    blob.style.transform = `translate(${x * (i + 1) * 0.3}px, ${y * (i + 1) * 0.3}px)`;
  });
});

// ===== СМЕНА ТЕМЫ =====
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('theme-sun');
  themeToggle.textContent = document.body.classList.contains('theme-sun') ? '🌙' : '🎨';
  themeToggle.setAttribute(
    'aria-label',
    document.body.classList.contains('theme-sun') ? 'Вернуть красную тему' : 'Сменить на жёлто-фиолетовую тему'
  );
});