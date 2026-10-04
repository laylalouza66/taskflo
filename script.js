/* ===========================================================
   AURA VOYAGE — Luxury Travel Landing Page
   UI Interactions
   =========================================================== */

(function () {
  'use strict';

  /* -------------------------------------------------------
     1. Navigation — scroll state + mobile toggle
     ------------------------------------------------------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav__link, .nav__cta--mobile');

  function handleScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  function closeMobileMenu() {
    navMenu.classList.remove('nav__menu--open');
    navToggle.classList.remove('nav__toggle--open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', function () {
    const isOpen = navMenu.classList.toggle('nav__menu--open');
    navToggle.classList.toggle('nav__toggle--open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  /* Close menu on resize to desktop */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });

  /* -------------------------------------------------------
     2. Smooth scroll for in-page anchors
     ------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const offset = 70;
        const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* -------------------------------------------------------
     3. Modal — triggered by every CTA / interactive element
     ------------------------------------------------------- */
  const modal = document.getElementById('infoModal');
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalDismiss = modal.querySelector('.modal__dismiss');

  function openModal() {
    modal.classList.add('modal--open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('modal--open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* All elements marked with data-modal-trigger or .cta-trigger */
  const modalTriggers = document.querySelectorAll('[data-modal-trigger], .cta-trigger');

  modalTriggers.forEach(function (el) {
    el.addEventListener('click', function (e) {
      /* Allow anchor links that point to page sections to smooth-scroll
         first; only intercept links pointing to "#" or non-section hrefs */
      const href = el.getAttribute('href');
      if (href && href.startsWith('#') && href !== '#') {
        const target = document.querySelector(href);
        if (!target) {
          e.preventDefault();
          openModal();
        }
        /* if target exists, smooth-scroll handler above takes care of it */
      } else {
        e.preventDefault();
        openModal();
      }
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);
  modalDismiss.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('modal--open')) {
      closeModal();
    }
  });

  /* -------------------------------------------------------
     4. Scroll reveal — IntersectionObserver
     ------------------------------------------------------- */
  const revealEls = document.querySelectorAll(
    '.intro__item, .dest-card, .exp-item, .quote, .about__text, .about__visual, .concierge__content, .section-head, .contact__card'
  );

  revealEls.forEach(function (el, i) {
    el.classList.add('reveal');
    el.setAttribute('data-delay', String((i % 3)));
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('reveal--visible');
    });
  }

  /* -------------------------------------------------------
     5. Parallax — subtle hero background shift
     ------------------------------------------------------- */
  const heroBg = document.querySelector('.hero__bg');

  if (heroBg && window.matchMedia('(min-width: 769px)').matches) {
    window.addEventListener(
      'scroll',
      function () {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
          heroBg.style.transform = 'translateY(' + scrolled * 0.35 + 'px) scale(' + (1 + scrolled * 0.0003) + ')';
        }
      },
      { passive: true }
    );
  }

  /* -------------------------------------------------------
     6. Active nav link based on scroll position
     ------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav__link');

  function highlightNav() {
    const scrollPos = window.scrollY + 100;
    var currentId = '';

    sections.forEach(function (section) {
      if (scrollPos >= section.offsetTop) {
        currentId = section.getAttribute('id');
      }
    });

    navLinkEls.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === '#' + currentId) {
        link.classList.add('nav__link--active');
      } else {
        link.classList.remove('nav__link--active');
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

})();
