/* ============================================================
   SECURELIFE INSURANCE PORTFOLIO - MAIN SCRIPT
   Modular vanilla JavaScript for all site functionality
   ============================================================ */

'use strict';

/* ============================================================
   1. STICKY NAVBAR + BACK TO TOP SHOW/HIDE
   ============================================================ */
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

function handleHeaderScroll() {
  if (navbar) {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  if (backToTop) {
    if (window.scrollY > 500) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  }
}

window.addEventListener('scroll', handleHeaderScroll);
handleHeaderScroll();

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   2. MOBILE HAMBURGER MENU
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

function closeMobileMenu() {
  if (!navMenu || !hamburger) return;
  navMenu.classList.remove('open');
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
}

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('click', (e) => {
    if (
      navMenu.classList.contains('open') &&
      !navMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });
}

/* ============================================================
   3. ACTIVE NAV LINK ON SCROLL (scroll spy)
   ============================================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveNav() {
  if (!sections.length || !navLinks.length) return;

  const scrollPos = window.scrollY + 120;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;

    if (scrollPos >= top && scrollPos < bottom) {
      const currentId = section.getAttribute('id');
      navLinks.forEach((link) => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === '#' + currentId
        );
      });
    }
  });
}

window.addEventListener('scroll', setActiveNav);
setActiveNav();

/* ============================================================
   4. FAQ ACCORDION
   ============================================================ */
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach((item) => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  if (!question || !answer) return;

  question.addEventListener('click', () => {
    const isActive = item.classList.contains('active');

    faqItems.forEach((otherItem) => {
      const otherQuestion = otherItem.querySelector('.faq-question');
      const otherAnswer = otherItem.querySelector('.faq-answer');

      if (!otherQuestion || !otherAnswer) return;

      otherItem.classList.remove('active');
      otherQuestion.setAttribute('aria-expanded', 'false');
      otherAnswer.style.maxHeight = null;
    });

    if (!isActive) {
      item.classList.add('active');
      question.setAttribute('aria-expanded', 'true');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

/* ============================================================
   5. SCROLL REVEAL ANIMATIONS
   ============================================================ */
const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && revealElements.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add('visible'));
}

/* ============================================================
   6. COUNTER ANIMATION (statistics)
   ============================================================ */
const counters = document.querySelectorAll('.counter');

function animateCounter(counter) {
  const target = parseInt(counter.getAttribute('data-target'), 10);
  if (Number.isNaN(target)) return;

  const duration = 1800;
  const startTime = performance.now();

  function updateCount(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.floor(eased * target).toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      counter.textContent = target.toLocaleString();
    }
  }

  requestAnimationFrame(updateCount);
}

if ('IntersectionObserver' in window && counters.length) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    if (!Number.isNaN(target)) {
      counter.textContent = target.toLocaleString();
    }
  });
}

/* ============================================================
   7. CONTACT FORM VALIDATION
   ============================================================ */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[+]?([\d\s-]){7,15}$/;

  function setError(input, message) {
    const group = input.closest('.form-group');
    if (!group) return;

    const errorMsg = group.querySelector('.error-msg');
    if (!errorMsg) return;

    input.classList.add('error');
    errorMsg.textContent = message;
    errorMsg.classList.add('visible');
  }

  function clearError(input) {
    const group = input.closest('.form-group');
    if (!group) return;

    const errorMsg = group.querySelector('.error-msg');
    if (!errorMsg) return;

    input.classList.remove('error');
    errorMsg.textContent = '';
    errorMsg.classList.remove('visible');
  }

  function validateField(input) {
    const value = input.value.trim();
    const fieldName = input.name;

    clearError(input);

    if (input.required && value === '') {
      setError(input, 'This field is required.');
      return false;
    }

    if (fieldName === 'name' && value !== '' && value.length < 2) {
      setError(input, 'Please enter a valid name.');
      return false;
    }

    if (fieldName === 'phone' && value !== '' && !phoneRegex.test(value)) {
      setError(input, 'Please enter a valid phone number.');
      return false;
    }

    if (fieldName === 'email' && value !== '' && !emailRegex.test(value)) {
      setError(input, 'Please enter a valid email address.');
      return false;
    }

    return true;
  }

  contactForm.querySelectorAll('input, select, textarea').forEach((input) => {
    input.addEventListener('blur', () => {
      validateField(input);
    });

    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        clearError(input);
      }
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const fields = contactForm.querySelectorAll('input, select, textarea');

    fields.forEach((field) => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    if (isValid) {
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      console.log('Form submitted:', data);

      if (formSuccess) {
        formSuccess.textContent =
          'Thank you! Your message has been received. I will get back to you shortly.';
        formSuccess.classList.remove('error');
      }

      contactForm.reset();
    } else if (formSuccess) {
      formSuccess.textContent = 'Please fix the errors above and try again.';
      formSuccess.classList.add('error');
    }

    setTimeout(() => {
      if (formSuccess) {
        formSuccess.textContent = '';
        formSuccess.classList.remove('error');
      }
    }, 6000);
  });
}

/* ============================================================
   8. DYNAMIC FOOTER YEAR
   ============================================================ */
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* ============================================================
   9. SMOOTH SCROLL FOR ANCHOR LINKS (enhancement)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      const top =
        targetEl.getBoundingClientRect().top +
        window.scrollY -
        (navbar ? navbar.offsetHeight : 0);
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
