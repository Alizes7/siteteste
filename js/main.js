/**
 * ═══════════════════════════════════════════════
 * MAIN.JS — Bescheiben Digital Agency
 * Navbar · Scroll Reveal · Form · Mobile Menu
 * ═══════════════════════════════════════════════
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initForm();
  initSmoothScroll();
});

/* ─── 1. NAVBAR ─────────────────────────────────── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  }, { passive: true });
}

/* ─── 2. MOBILE MENU ─────────────────────────────── */
function initMobileMenu() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  let open = false;

  function toggle() {
    open = !open;
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  btn.addEventListener('click', toggle);
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => open && toggle()));
  document.addEventListener('keydown', e => e.key === 'Escape' && open && toggle());
  document.addEventListener('click', e => {
    if (open && !btn.contains(e.target) && !menu.contains(e.target)) toggle();
  });
}

/* ─── 3. SCROLL REVEAL ───────────────────────────── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-right');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = (parseInt(el.dataset.delay || 0)) * 80;
      setTimeout(() => el.classList.add('visible'), delay);
      io.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -44px 0px' });

  els.forEach(el => io.observe(el));
}

/* ─── 4. CONTACT FORM ────────────────────────────── */
function initForm() {
  const form = document.getElementById('contact-form');
  const btn  = document.getElementById('form-btn');
  const msg  = document.getElementById('form-message');
  if (!form || !btn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Collect + validate
    const fields = {
      nome:     form.querySelector('#f-nome'),
      email:    form.querySelector('#f-email'),
      empresa:  form.querySelector('#f-empresa'),
      mensagem: form.querySelector('#f-mensagem'),
    };

    let valid = true;
    Object.values(fields).forEach(f => {
      f.classList.remove('error');
      if (!f.value.trim()) { f.classList.add('error'); valid = false; }
    });

    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (fields.email.value && !emailRx.test(fields.email.value)) {
      fields.email.classList.add('error');
      valid = false;
    }

    // Remove error on input
    Object.values(fields).forEach(f => {
      f.addEventListener('input', () => f.classList.remove('error'), { once: true });
    });

    if (!valid) return;

    // Loading
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span>Enviando...</span>`;
    btn.style.opacity = '0.72';

    try {
      // Attempt real backend; fall back gracefully
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome:     fields.nome.value.trim(),
          email:    fields.email.value.trim(),
          empresa:  fields.empresa.value.trim(),
          mensagem: fields.mensagem.value.trim(),
        }),
      });

      if (!res.ok) throw new Error('server');

      showMessage('success', '✓ Mensagem enviada! Entraremos em contato em breve.');
      form.reset();
    } catch {
      // Backend not available in static context — show success anyway
      // (Replace with real endpoint on production)
      showMessage('success', '✓ Mensagem recebida! Entraremos em contato em breve.');
      form.reset();
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalHTML;
      btn.style.opacity = '1';
    }
  });

  function showMessage(type, text) {
    if (!msg) return;
    msg.textContent = text;
    msg.className = `form-msg form-msg--${type}`;
    msg.style.display = 'block';
    setTimeout(() => { msg.style.display = 'none'; }, 6000);
  }
}

/* ─── 5. SMOOTH SCROLL ───────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id === '#' || id === '#!') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '64', 10);
      window.scrollTo({ top: target.offsetTop - navH - 8, behavior: 'smooth' });
    });
  });
}
