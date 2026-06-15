/* ================================================
   CafeConnects — Shared JavaScript
   Navbar, Footer, Animations, Utilities
   ================================================ */

// ── Navbar ────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// ── Mobile Menu ───────────────────────────────
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  const close = () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (mobileClose) mobileClose.addEventListener('click', close);

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', close);
  });
}

// ── Scroll Reveal ─────────────────────────────
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => observer.observe(el));
}

// ── Counter Animation ─────────────────────────
function animateCounter(el, target, duration = 2000, suffix = '') {
  const start = 0;
  const startTime = performance.now();
  const isFloat = String(target).includes('.');

  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = start + (target - start) * eased;

    el.textContent = (isFloat ? current.toFixed(1) : Math.round(current)).toLocaleString() + suffix;

    if (progress < 1) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, 2200, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

// ── FAQ Accordion ─────────────────────────────
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

      // Toggle current
      if (!isOpen) item.classList.add('open');
    });
  });
}

// ── Parallax ──────────────────────────────────
function initParallax() {
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (!parallaxEls.length) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  });
}

// ── Tabs ──────────────────────────────────────
function initTabs() {
  document.querySelectorAll('.tab-group').forEach(group => {
    const tabs = group.querySelectorAll('.tab-btn');
    const panels = group.querySelectorAll('.tab-panel');

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        if (panels[i]) panels[i].classList.add('active');
      });
    });
  });
}

// ── Smooth Anchor Scroll ──────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 88;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ── Toast ─────────────────────────────────────
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed; bottom: 32px; right: 32px; z-index: 9999;
    background: ${type === 'success' ? '#3E2723' : '#B71C1C'};
    color: #fff; padding: 16px 24px; border-radius: 12px;
    font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 500;
    box-shadow: 0 16px 48px rgba(0,0,0,0.25);
    transform: translateY(20px); opacity: 0;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    display: flex; align-items: center; gap: 10px;
    max-width: 380px;
  `;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : '✕'}</span> ${message}`;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  });

  setTimeout(() => {
    toast.style.transform = 'translateY(20px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ── Form Handling ─────────────────────────────
function initForms() {
  document.querySelectorAll('form[data-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const original = btn.textContent;

      btn.textContent = 'Sending…';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = '✓ Sent!';
        showToast('Thank you! We\'ll be in touch soon.');
        setTimeout(() => {
          btn.textContent = original;
          btn.disabled = false;
          form.reset();
        }, 3000);
      }, 1500);
    });
  });
}

// ── Active Nav Link ───────────────────────────
function setActiveNavLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-menu .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ── Navbar HTML ───────────────────────────────
function renderNavbar(activePage) {
  const links = [
    { href: 'index.html',           label: 'Home' },
    { href: 'product.html',         label: 'Product' },
    { href: 'for-cafes.html',       label: 'For Cafes' },
    { href: 'blog.html',            label: 'Blog' },
    { href: 'bangalore-cafes.html', label: 'Bangalore Cafes' },
    { href: 'careers.html',         label: 'Careers' },
    { href: 'collaborations.html',  label: 'Collaborations' },
    { href: 'safety.html',          label: 'Safety' },
  ];

  const moreLinks = [
    { href: 'privacy-policy.html',  label: 'Privacy Policy' },
    { href: 'terms.html',           label: 'Terms of Service' },
    { href: 'refund-policy.html',   label: 'Refund Policy' },
    { href: '#contact',             label: 'Contact' },
  ];

  const mainLinks = links.map(l =>
    `<a href="${l.href}" class="nav-link${activePage === l.href ? ' active' : ''}">${l.label}</a>`
  ).join('');

  return `
<nav class="navbar" id="navbar">
  <div class="navbar-inner">
    <a href="index.html" class="logo">
      <div class="logo-icon"></div>
      CafeConnects
    </a>
    <div class="nav-links">
      <a href="index.html" class="nav-link${activePage==='index.html'?' active':''}">Home</a>
      <a href="product.html" class="nav-link${activePage==='product.html'?' active':''}">Product</a>
      <a href="for-cafes.html" class="nav-link${activePage==='for-cafes.html'?' active':''}">For Cafes</a>
      <a href="blog.html" class="nav-link${activePage==='blog.html'?' active':''}">Blog</a>
      <a href="bangalore-cafes.html" class="nav-link${activePage==='bangalore-cafes.html'?' active':''}">Bangalore Cafes</a>
      <div class="nav-dropdown">
        <a href="#" class="nav-link">More ▾</a>
        <div class="nav-dropdown-menu">
          <a href="careers.html" class="nav-dropdown-item">Careers</a>
          <a href="collaborations.html" class="nav-dropdown-item">Collaborations</a>
          <a href="safety.html" class="nav-dropdown-item">Safety</a>
          <a href="privacy-policy.html" class="nav-dropdown-item">Privacy Policy</a>
          <a href="terms.html" class="nav-dropdown-item">Terms of Service</a>
          <a href="refund-policy.html" class="nav-dropdown-item">Refund Policy</a>
          <a href="#contact" class="nav-dropdown-item">Contact</a>
        </div>
      </div>
    </div>
    <div class="nav-cta">
      <a href="for-cafes.html" class="btn-nav">Partner With Us</a>
      <button class="hamburger" id="hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</nav>

<div class="mobile-menu" id="mobile-menu">
  <button class="mobile-close" id="mobile-close">✕</button>
  <a href="index.html" class="nav-link">Home</a>
  <a href="product.html" class="nav-link">Product</a>
  <a href="for-cafes.html" class="nav-link">For Cafes</a>
  <a href="blog.html" class="nav-link">Blog</a>
  <a href="bangalore-cafes.html" class="nav-link">Bangalore Cafes</a>
  <a href="careers.html" class="nav-link">Careers</a>
  <a href="collaborations.html" class="nav-link">Collaborations</a>
  <a href="safety.html" class="nav-link">Safety</a>
  <a href="privacy-policy.html" class="nav-link">Privacy Policy</a>
  <a href="contact.html" class="nav-link">Contact</a>
  <a href="for-cafes.html" class="btn btn-primary mt-24">Partner With Us</a>
</div>`;
}

// ── Footer HTML ───────────────────────────────
function renderFooter() {
  return `
<footer class="footer" id="contact">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="index.html" class="logo">
          <div class="logo-icon"></div>
          CafeConnects
        </a>
        <p class="footer-desc mt-16">
          Building meaningful human connections over great coffee.
          Real people. Real cafés. Real conversations.
          Bangalore's first café-based social discovery platform.
        </p>
        <p class="footer-desc" style="margin-bottom:0">
          📧 <a href="mailto:hello@cafeconnects.in" style="color:rgba(255,255,255,0.55)">hello@cafeconnects.in</a>
        </p>
        <div class="footer-social mt-24">
          <a href="#" class="social-icon" aria-label="Instagram">📸</a>
          <a href="#" class="social-icon" aria-label="Twitter">🐦</a>
          <a href="#" class="social-icon" aria-label="LinkedIn">💼</a>
          <a href="#" class="social-icon" aria-label="YouTube">▶️</a>
        </div>
      </div>

      <div class="footer-col">
        <h4>Product</h4>
        <ul class="footer-links">
          <li><a href="product.html" class="footer-link">How It Works</a></li>
          <li><a href="product.html#features" class="footer-link">Features</a></li>
          <li><a href="safety.html" class="footer-link">Safety</a></li>
          <li><a href="index.html#download" class="footer-link">Download App</a></li>
          <li><a href="index.html#faq" class="footer-link">FAQ</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Company</h4>
        <ul class="footer-links">
          <li><a href="blog.html" class="footer-link">Blog</a></li>
          <li><a href="careers.html" class="footer-link">Careers</a></li>
          <li><a href="collaborations.html" class="footer-link">Collaborations</a></li>
          <li><a href="for-cafes.html" class="footer-link">For Cafes</a></li>
          <li><a href="#contact" class="footer-link">Contact</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Resources</h4>
        <ul class="footer-links">
          <li><a href="bangalore-cafes.html" class="footer-link">Bangalore Cafes</a></li>
          <li><a href="blog.html" class="footer-link">Stories</a></li>
          <li><a href="safety.html" class="footer-link">Safety Guide</a></li>
          <li><a href="for-cafes.html#partner" class="footer-link">Café Partners</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Legal</h4>
        <ul class="footer-links">
          <li><a href="privacy-policy.html" class="footer-link">Privacy Policy</a></li>
          <li><a href="terms.html" class="footer-link">Terms of Service</a></li>
          <li><a href="refund-policy.html" class="footer-link">Refund Policy</a></li>
        </ul>
        <div style="margin-top:32px">
          <div class="badge badge-green">🇮🇳 Made in Bangalore</div>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p class="footer-copyright">© 2026 CafeConnects. All rights reserved. Built with ☕ in Bangalore.</p>
      <div class="footer-legal">
        <a href="privacy-policy.html">Privacy</a>
        <a href="terms.html">Terms</a>
        <a href="refund-policy.html">Refunds</a>
      </div>
    </div>
  </div>
</footer>`;
}

// ── Init All ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initFAQ();
  initParallax();
  initTabs();
  initSmoothScroll();
  initForms();
  setActiveNavLink();
});
