/**
 * StartupA2Z.org — Main JavaScript
 * Handles: navigation, mobile menu, animations, counters, RSVP modal
 */

(function () {
  'use strict';

  /* ── NAVIGATION ─────────────────────────── */
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ── MOBILE MENU ─────────────────────────── */
  const hamburger = document.querySelector('.nav__hamburger');
  const overlay   = document.querySelector('.nav-overlay');
  const overlayClose = document.querySelector('.nav-overlay__close');

  function openMenu() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', openMenu);
  overlayClose?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeMenu();
  });
  document.querySelectorAll('.nav-overlay__link').forEach(l => l.addEventListener('click', closeMenu));

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeMenu(); closeModal(); }
  });

  /* ── ACTIVE NAV LINK ─────────────────────── */
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .nav-overlay__link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentFile || (currentFile === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── INTERSECTION OBSERVER: REVEAL ─────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
    revealObserver.observe(el);
  });

  /* ── STATS COUNTER ANIMATION ─────────────── */
  function animateCounter(el) {
    const target   = parseInt(el.dataset.count, 10);
    const suffix   = el.dataset.suffix || '';
    const prefix   = el.dataset.prefix || '';
    const duration = 1300;
    const start    = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.round(eased * target).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => statObserver.observe(el));

  /* ── RSVP MODAL ─────────────────────────── */
  const modalOverlay = document.querySelector('.modal-overlay');

  function openModal(eventName) {
    if (!modalOverlay) return;
    const titleEl    = modalOverlay.querySelector('.modal__title');
    const subtitleEl = modalOverlay.querySelector('.modal__subtitle');
    if (titleEl)    titleEl.textContent    = 'Reserve Your Spot';
    if (subtitleEl) subtitleEl.textContent = eventName || 'Secure your place at the next meetup.';
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Reset form
    const form = modalOverlay.querySelector('.modal__form');
    if (form) form.reset();
    const submitBtn = modalOverlay.querySelector('.modal__submit');
    if (submitBtn) {
      submitBtn.textContent = 'Reserve My Spot';
      submitBtn.style.background = '';
    }
  }

  function closeModal() {
    modalOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Trigger RSVP buttons
  document.querySelectorAll('[data-rsvp]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(btn.dataset.rsvp);
    });
  });

  // Close actions
  document.querySelector('.modal-close')?.addEventListener('click', closeModal);
  document.querySelector('.modal__cancel')?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Form submit
  document.querySelector('.modal__form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('.modal__submit');
    if (!btn) return;
    btn.textContent = 'Reserving…';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = "You're in ✓";
      btn.style.background = 'linear-gradient(135deg, #00a855, #00cc66)';
      setTimeout(closeModal, 1800);
    }, 1000);
  });

  /* ── NEWSLETTER FORM ─────────────────────── */
  document.querySelectorAll('.footer__input-row').forEach(row => {
    const input  = row.querySelector('.footer__input');
    const submit = row.querySelector('.footer__submit');
    if (!input || !submit) return;

    submit.addEventListener('click', () => {
      const val = input.value.trim();
      if (val.includes('@') && val.includes('.')) {
        submit.textContent = '✓';
        input.value = '';
        input.placeholder = "You're on the list!";
        submit.disabled = true;
      } else {
        input.style.outline = '2px solid #ff4444';
        setTimeout(() => input.style.outline = '', 1200);
      }
    });
  });

  /* ── FILTER CHIPS ────────────────────────── */
  document.querySelectorAll('.filter-chips').forEach(chipGroup => {
    chipGroup.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        chipGroup.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const filter = chip.dataset.filter;
        // Filter event cards
        document.querySelectorAll('.event-card[data-city]').forEach(card => {
          const show = filter === 'all' || card.dataset.city === filter;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  });

  /* ── HERO WORD REVEAL ─────────────────────── */
  const heroTitle = document.querySelector('.hero__title');
  if (heroTitle) {
    // Subtle fade-in already handled by CSS animation class
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(20px)';
    setTimeout(() => {
      heroTitle.style.transition = 'opacity 0.8s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)';
      heroTitle.style.opacity = '1';
      heroTitle.style.transform = 'none';
    }, 120);
  }

  const heroContent = document.querySelector('.hero__content');
  if (heroContent) {
    const children = heroContent.children;
    Array.from(children).forEach((child, i) => {
      if (child.classList.contains('hero__title')) return; // handled above
      child.style.opacity = '0';
      child.style.transform = 'translateY(16px)';
      setTimeout(() => {
        child.style.transition = `opacity 0.7s cubic-bezier(0.25,0.46,0.45,0.94) ${i * 0.08 + 0.18}s, transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94) ${i * 0.08 + 0.18}s`;
        child.style.opacity = '1';
        child.style.transform = 'none';
      }, 50);
    });
  }

})();
