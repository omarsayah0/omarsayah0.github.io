/* ============================================================
   PORTFOLIO — SCRIPT.JS
============================================================ */

'use strict';

/* ----------------------------------------------------------
   1. NAVBAR — scroll behaviour + mobile toggle
---------------------------------------------------------- */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const links    = document.querySelectorAll('.nav-link');

  // Scroll: add .scrolled after 10px
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
    updateActiveLink();
  }, { passive: true });

  // Mobile toggle
  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close on link click (mobile)
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
    });
  });

  // Active link on scroll
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY  = window.scrollY + 90;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = document.querySelector(`.nav-link[href="#${id}"]`);
      if (!link) return;
      if (scrollY >= top && scrollY < top + height) {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }
})();


/* ----------------------------------------------------------
   2. HERO — TYPEWRITER
---------------------------------------------------------- */
(function initTypewriter() {
  const el = document.querySelector('.typed-text');
  if (!el) return;

  // ── EDIT THESE TITLES ────────────────────────────────────
  const titles = [
    'AI Engineer',
    'Software Engineer',
    'Machine Learning Engineer',
    'Deep Learning Engineer',
    'Computer Vision Engineer',
  ];
  // ─────────────────────────────────────────────────────────

  let titleIdx = 0;
  let charIdx  = 0;
  let deleting = false;
  let pauseEnd = false;

  function type() {
    const current = titles[titleIdx];

    if (!deleting && !pauseEnd) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        pauseEnd = true;
        setTimeout(() => { pauseEnd = false; deleting = true; type(); }, 2200);
        return;
      }
    } else if (deleting) {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        titleIdx = (titleIdx + 1) % titles.length;
      }
    }
    setTimeout(type, deleting ? 45 : 90);
  }

  type();
})();


/* ----------------------------------------------------------
   3. PARTICLES CANVAS
---------------------------------------------------------- */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  let W, H, particles;

  const CONFIG = {
    count:         65,
    baseRadius:    1.2,
    speed:         0.28,
    connectionDist: 150,
    color:         '108, 99, 255',
    maxOpacity:    0.55,
  };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = Array.from({ length: CONFIG.count }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * CONFIG.speed * 2,
      vy: (Math.random() - 0.5) * CONFIG.speed * 2,
      r:  Math.random() * CONFIG.baseRadius + 0.6,
      o:  Math.random() * 0.5 + 0.2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update & draw dots
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CONFIG.color}, ${p.o})`;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.connectionDist) {
          const alpha = (1 - dist / CONFIG.connectionDist) * CONFIG.maxOpacity * 0.4;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${CONFIG.color}, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createParticles(); }, { passive: true });

  resize();
  createParticles();
  draw();
})();


/* ----------------------------------------------------------
   4. SCROLL REVEAL
---------------------------------------------------------- */
(function initReveal() {
  const targets = document.querySelectorAll(
    '.section-header, .about-image-wrapper, .about-content, ' +
    '.project-card, .skill-category, .timeline-item, ' +
    '.cv-card, .contact-info, .contact-form-wrapper'
  );

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach((el, i) => {
    // Stagger cards
    if (el.classList.contains('project-card') || el.classList.contains('skill-category')) {
      el.classList.add('reveal');
      el.style.transitionDelay = `${(i % 6) * 0.08}s`;
    } else if (el.classList.contains('about-image-wrapper')) {
      el.classList.add('reveal-left');
    } else if (el.classList.contains('about-content')) {
      el.classList.add('reveal-right');
    } else {
      el.classList.add('reveal');
    }
    observer.observe(el);
  });
})();


/* ----------------------------------------------------------
   5. PROJECT FILTER
---------------------------------------------------------- */
(function initProjectFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        if (match) {
          card.classList.remove('hidden');
          card.style.animation = 'none';
          void card.offsetWidth; // reflow
          card.style.animation = 'fadeInCard 0.35s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* Card appear animation */
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInCard {
    from { opacity: 0; transform: translateY(16px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
`;
document.head.appendChild(style);


/* ----------------------------------------------------------
   6. CONTACT FORM — basic client-side handler
      Replace the body of handleSubmit() with your own
      backend/service integration (EmailJS, Formspree, etc.)
---------------------------------------------------------- */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', handleSubmit);

  function handleSubmit(e) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    btn.disabled = true;

    // ── INTEGRATE YOUR FORM SERVICE HERE ─────────────────
    // Example: EmailJS.send(), fetch to Formspree, etc.
    // For now, simulates a 1.5s delay then shows success.
    setTimeout(() => {
      showToast('Message sent! I\'ll get back to you soon.', 'success');
      form.reset();
      btn.innerHTML = originalText;
      btn.disabled = false;
    }, 1500);
    // ─────────────────────────────────────────────────────
  }
})();


/* ----------------------------------------------------------
   7. TOAST NOTIFICATION
---------------------------------------------------------- */
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
    <span>${message}</span>
  `;

  const toastStyle = document.createElement('style');
  toastStyle.id = 'toast-styles';
  if (!document.getElementById('toast-styles')) {
    toastStyle.textContent = `
      .toast {
        position: fixed;
        bottom: 28px;
        right: 28px;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 14px 20px;
        background: #141420;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.6);
        font-size: 0.92rem;
        color: #f0f0ff;
        animation: toastIn 0.35s ease, toastOut 0.35s ease 3.8s forwards;
        max-width: 340px;
      }
      .toast-success { border-color: rgba(34,197,94,0.3); }
      .toast-success i { color: #22c55e; }
      .toast-error i { color: #ef4444; }
      @keyframes toastIn  { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      @keyframes toastOut { from { opacity: 1; } to { opacity: 0; transform: translateY(10px); } }
    `;
    document.head.appendChild(toastStyle);
  }

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4200);
}


/* ----------------------------------------------------------
   8. FOOTER — current year
---------------------------------------------------------- */
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ----------------------------------------------------------
   9. SMOOTH SCROLL for anchor links (fallback for older browsers)
---------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
