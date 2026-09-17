document.addEventListener('DOMContentLoaded', () => {
  // 1. Navbar scrolled state
  const navbar = document.querySelector('.navbar');
  const scrollThreshold = 40;

  function checkNavbarScroll() {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', checkNavbarScroll, { passive: true });
  checkNavbarScroll();

  // 2. Mobile Navbar Toggle & Hamburger Menu Handler
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.getElementById('navbarNav');

  if (navbarToggler && navbarCollapse) {
    navbarToggler.classList.add('collapsed');
    navbarToggler.setAttribute('aria-expanded', 'false');

    navbarToggler.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isExpanded = navbarCollapse.classList.contains('show');
      
      if (isExpanded) {
        navbarCollapse.classList.remove('show');
        navbarToggler.setAttribute('aria-expanded', 'false');
        navbarToggler.classList.add('collapsed');
      } else {
        navbarCollapse.classList.add('show');
        navbarToggler.setAttribute('aria-expanded', 'true');
        navbarToggler.classList.remove('collapsed');
      }
    });

    // Handle Dropdowns in mobile view
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        if (window.innerWidth < 992) {
          e.preventDefault();
          const parent = toggle.closest('.dropdown');
          if (parent) {
            const menu = parent.querySelector('.dropdown-menu');
            if (menu) {
              const isMenuShown = menu.classList.contains('show');
              // Close any other open dropdown menus in mobile navbar
              document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
              if (!isMenuShown) {
                menu.classList.add('show');
                toggle.setAttribute('aria-expanded', 'true');
              } else {
                toggle.setAttribute('aria-expanded', 'false');
              }
            }
          }
        }
      });
    });

    // Auto-close mobile collapse on nav-link or dropdown-item click
    const clickableLinks = navbarCollapse.querySelectorAll('a:not(.dropdown-toggle), .btn');
    clickableLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 992) {
          navbarCollapse.classList.remove('show');
          navbarToggler.setAttribute('aria-expanded', 'false');
          navbarToggler.classList.add('collapsed');
          document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
        }
      });
    });

    // Close when clicking outside of the navbar
    document.addEventListener('click', (e) => {
      if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
        if (!navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target)) {
          navbarCollapse.classList.remove('show');
          navbarToggler.setAttribute('aria-expanded', 'false');
          navbarToggler.classList.add('collapsed');
        }
      }
    });
  }

  // 3. Product Carousel Scroll Arrows
  const carousel = document.querySelector('.carousel-container');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');

  if (carousel && btnPrev && btnNext) {
    const getScrollAmount = () => {
      const card = carousel.querySelector('.service-card');
      return card ? card.offsetWidth + 24 : 320;
    };
    
    btnPrev.addEventListener('click', () => {
      carousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });
    
    btnNext.addEventListener('click', () => {
      carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });
  }

  // 4. Intersection Observer for fade-in elements
  const faders = document.querySelectorAll('.fade-in-section');
  const appearOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px"
  };

  const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });

  // 5. Scroll to Top Button Visibility & Click Handler
  const scrollToTopBtn = document.getElementById('scrollToTop');
  const heroSection = document.getElementById('hero');

  function checkScrollToTop() {
    if (!scrollToTopBtn) return;
    const heroHeight = heroSection ? heroSection.offsetHeight : 400;
    // Show button once user scrolls past the hero section (with 100px buffer)
    if (window.scrollY > (heroHeight - 100)) {
      scrollToTopBtn.classList.add('is-visible');
    } else {
      scrollToTopBtn.classList.remove('is-visible');
    }
  }

  if (scrollToTopBtn) {
    window.addEventListener('scroll', checkScrollToTop, { passive: true });
    checkScrollToTop();

    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 6. Posh Executive Language Switcher with Google Translate Integration
  const langItems = document.querySelectorAll('.lang-item');
  const activeLangTexts = document.querySelectorAll('.active-lang-text');
  const langBadges = document.querySelectorAll('.lang-badge');

  function triggerGoogleTranslate(langCode) {
    const isEnglish = (langCode === 'en' || !langCode);
    const host = window.location.hostname;
    const cookiePath = '/';

    if (isEnglish) {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath};`;
      if (host) {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath}; domain=${host};`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath}; domain=.${host};`;
      }

      const combo = document.querySelector('.goog-te-combo');
      if (combo) {
        combo.value = '';
        combo.dispatchEvent(new Event('change'));
      }

      setTimeout(() => {
        if (document.documentElement.classList.contains('translated-ltr') || document.querySelector('.translated-ltr')) {
          window.location.reload();
        }
      }, 300);
      return;
    }

    const transVal = `/en/${langCode}`;
    document.cookie = `googtrans=${transVal}; path=${cookiePath};`;
    if (host) {
      document.cookie = `googtrans=${transVal}; path=${cookiePath}; domain=${host};`;
      document.cookie = `googtrans=${transVal}; path=${cookiePath}; domain=.${host};`;
    }

    function applyToCombo() {
      const combo = document.querySelector('.goog-te-combo');
      if (combo) {
        combo.value = isEnglish ? '' : langCode;
        combo.dispatchEvent(new Event('change'));
        return true;
      }
      return false;
    }

    if (!applyToCombo()) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (applyToCombo() || attempts > 25) {
          clearInterval(interval);
        }
      }, 150);
    }
  }

  function setLanguage(langCode, langName, langBadge, triggerTranslate = true) {
    // Update active state in menus
    langItems.forEach(item => {
      if (item.getAttribute('data-lang') === langCode) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update button text and badge across desktop and mobile
    activeLangTexts.forEach(el => {
      el.textContent = langName;
    });

    langBadges.forEach(el => {
      el.textContent = langBadge;
    });

    try {
      localStorage.setItem('nexus_selected_lang', JSON.stringify({ code: langCode, name: langName, badge: langBadge }));
    } catch (e) {
      // Ignore localStorage errors
    }

    if (triggerTranslate) {
      triggerGoogleTranslate(langCode);
    }
  }

  langItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const code = item.getAttribute('data-lang');
      const name = item.getAttribute('data-name');
      const badge = item.getAttribute('data-code');
      setLanguage(code, name, badge, true);

      // Close bootstrap dropdown
      const parentDropdown = item.closest('.dropdown');
      if (parentDropdown) {
        const toggleBtn = parentDropdown.querySelector('[data-bs-toggle="dropdown"]');
        if (toggleBtn && typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
          const bsDropdown = bootstrap.Dropdown.getInstance(toggleBtn);
          if (bsDropdown) bsDropdown.hide();
        }
      }
    });
  });

  // Check cookie or localStorage on initial page load
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  try {
    const googTransCookie = getCookie('googtrans');
    let initialLang = null;

    if (googTransCookie) {
      const parts = googTransCookie.split('/');
      if (parts.length >= 3 && parts[2]) {
        initialLang = parts[2];
      }
    }

    if (!initialLang) {
      const saved = localStorage.getItem('nexus_selected_lang');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.code) {
          initialLang = parsed.code;
        }
      }
    }

    if (initialLang) {
      const matchingItem = document.querySelector(`.lang-item[data-lang="${initialLang}"]`);
      if (matchingItem) {
        const name = matchingItem.getAttribute('data-name');
        const badge = matchingItem.getAttribute('data-code');
        setLanguage(initialLang, name, badge, false);
      }
    }
  } catch (e) {
    // Ignore error
  }

  // 7. Contact Form Handler (Aceternity Luxury Contact Section)
  const contactForm = document.getElementById('contactForm');
  const contactSubmitBtn = document.getElementById('contactSubmitBtn');
  const contactFeedback = document.getElementById('contactFormFeedback');

  if (contactForm && contactSubmitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('contactFullName');
      const emailInput = document.getElementById('contactEmail');
      const msgInput = document.getElementById('contactMessage');

      if (!nameInput.value.trim() || !emailInput.value.trim() || !msgInput.value.trim()) {
        if (contactFeedback) {
          contactFeedback.className = 'contact-feedback error mt-3';
          contactFeedback.textContent = 'Please complete all required fields.';
          contactFeedback.classList.remove('d-none');
        }
        return;
      }

      // Simulate sending with loading state
      const originalText = contactSubmitBtn.innerHTML;
      contactSubmitBtn.innerHTML = '<span>Sending...</span>';
      contactSubmitBtn.disabled = true;

      setTimeout(() => {
        contactSubmitBtn.innerHTML = '<span>Message Sent!</span>';
        contactSubmitBtn.style.backgroundColor = '#2fbf9f';
        contactSubmitBtn.style.color = '#0b2b28';

        if (contactFeedback) {
          contactFeedback.className = 'contact-feedback success mt-3';
          contactFeedback.textContent = 'Thank you for reaching out. We will get back to you shortly.';
          contactFeedback.classList.remove('d-none');
        }

        contactForm.reset();

        setTimeout(() => {
          contactSubmitBtn.innerHTML = originalText;
          contactSubmitBtn.disabled = false;
          contactSubmitBtn.style.backgroundColor = '';
          contactSubmitBtn.style.color = '';
        }, 3500);
      }, 700);
    });
  }
});



