/*
 * Script unique du site Moustache.
 * Servi depuis /public/scripts/site.js → respecte CSP `script-src 'self'`
 * (pas d'inline → aucune dérogation `unsafe-inline` nécessaire).
 *
 * Regroupe : nav mobile, accordéon FAQ, validation du formulaire de devis,
 * et le scroll-reveal des éléments `.fade-in`.
 */
(function () {
  'use strict';

  // ---------- Nav mobile ----------
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var setNavState = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      nav.dataset.open = String(open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', function () {
      setNavState(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setNavState(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setNavState(false);
        toggle.focus();
      }
    });
  }

  // ---------- FAQ accordéon ----------
  document.querySelectorAll('.faq-item__trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var isOpen = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // ---------- Validation formulaire de devis ----------
  var form = document.querySelector('form[data-form="devis"]');
  if (form) {
    var status = form.querySelector('.form-status');
    var setError = function (field, hasError) {
      field.setAttribute('aria-invalid', String(hasError));
    };
    var validateField = function (field) {
      if (!field.checkValidity()) { setError(field, true); return false; }
      setError(field, false); return true;
    };
    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
      field.addEventListener('input', function () {
        if (field.getAttribute('aria-invalid') === 'true') validateField(field);
      });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var honeypot = form.querySelector('input[name="bot-field"]');
      if (honeypot && honeypot.value) {
        if (status) {
          status.dataset.state = 'success';
          status.textContent = 'Merci, votre demande a bien été envoyée.';
        }
        return;
      }
      var allValid = true;
      var firstInvalid = null;
      form.querySelectorAll('input, select, textarea').forEach(function (field) {
        if (!validateField(field)) {
          allValid = false;
          if (!firstInvalid) firstInvalid = field;
        }
      });
      if (!allValid) {
        if (status) {
          status.dataset.state = 'error';
          status.textContent = "Merci de corriger les champs en rouge avant d'envoyer.";
        }
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      if (status) {
        status.dataset.state = 'success';
        status.textContent = 'Merci ! Votre demande a bien été enregistrée. Nous revenons vers vous sous 24 h.';
      }
      form.reset();
    });
  }

  // ---------- Scroll reveal ----------
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('.fade-in');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    targets.forEach(function (el) { observer.observe(el); });
  }
})();