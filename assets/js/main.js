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

    // Handle Dropdowns in mobile view (<992px)
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        if (window.innerWidth < 992) {
          e.preventDefault();
          e.stopPropagation();
          const parent = toggle.closest('.dropdown, .nav-item.dropdown');
          if (parent) {
            const menu = parent.querySelector('.dropdown-menu');
            if (menu) {
              const isMenuShown = menu.classList.contains('show');
              // Close any other open dropdown menus in mobile navbar
              navbarCollapse.querySelectorAll('.dropdown-menu.show').forEach(m => {
                if (m !== menu) {
                  m.classList.remove('show');
                  const p = m.closest('.dropdown, .nav-item.dropdown');
                  if (p) {
                    p.classList.remove('show');
                    const t = p.querySelector('.dropdown-toggle');
                    if (t) t.setAttribute('aria-expanded', 'false');
                  }
                }
              });
              if (!isMenuShown) {
                menu.classList.add('show');
                parent.classList.add('show');
                toggle.setAttribute('aria-expanded', 'true');
              } else {
                menu.classList.remove('show');
                parent.classList.remove('show');
                toggle.setAttribute('aria-expanded', 'false');
              }
            }
          }
        }
      });
    });

    // Auto-close mobile collapse on navigational link clicks ONLY (exclude dropdown toggles, lang switcher buttons & items)
    const navCloseLinks = navbarCollapse.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle), .navbar-nav .dropdown-menu:not(.lang-menu) .dropdown-item, .mobile-nav-actions a.btn-primary-custom, .mobile-nav-actions a.link-arrow');
    navCloseLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 992) {
          navbarCollapse.classList.remove('show');
          navbarToggler.setAttribute('aria-expanded', 'false');
          navbarToggler.classList.add('collapsed');
          navbarCollapse.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
          navbarCollapse.querySelectorAll('.dropdown.show, .nav-item.dropdown.show').forEach(p => p.classList.remove('show'));
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
          navbarCollapse.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
          navbarCollapse.querySelectorAll('.dropdown.show, .nav-item.dropdown.show').forEach(p => p.classList.remove('show'));
        }
      }
    });
  }

  // 3. Product Carousel Scroll Arrows & Auto Slide
  const carousel = document.querySelector('.carousel-container');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');

  if (carousel) {
    const getScrollAmount = () => {
      const card = carousel.querySelector('.service-card');
      return card ? card.offsetWidth + 24 : 320;
    };

    const slideNext = () => {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      if (carousel.scrollLeft >= maxScroll - 15) {
        carousel.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
      }
    };

    const slidePrev = () => {
      if (carousel.scrollLeft <= 15) {
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        carousel.scrollTo({ left: maxScroll, behavior: 'smooth' });
      } else {
        carousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
      }
    };

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        slidePrev();
        resetAutoSlide();
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        slideNext();
        resetAutoSlide();
      });
    }

    // Auto Slide Controller
    let autoSlideInterval = null;
    const AUTO_SLIDE_DELAY = 3500; // 3.5 seconds per slide

    const startAutoSlide = () => {
      if (autoSlideInterval) clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(() => {
        slideNext();
      }, AUTO_SLIDE_DELAY);
    };

    const stopAutoSlide = () => {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
      }
    };

    const resetAutoSlide = () => {
      stopAutoSlide();
      startAutoSlide();
    };

    // Pause on Hover & Focus
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);
    carousel.addEventListener('focusin', stopAutoSlide);
    carousel.addEventListener('focusout', startAutoSlide);

    // Pause on Touch interactions (Mobile & Tablets)
    carousel.addEventListener('touchstart', stopAutoSlide, { passive: true });
    carousel.addEventListener('touchend', () => {
      setTimeout(startAutoSlide, 1500);
    }, { passive: true });

    // Page Visibility API pause
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoSlide();
      } else {
        startAutoSlide();
      }
    });

    // Pause when out of viewport to save performance
    const carouselObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startAutoSlide();
        } else {
          stopAutoSlide();
        }
      });
    }, { threshold: 0.15 });

    carouselObserver.observe(carousel);
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

  // 4b. Stats Counter Animation (VengeanceUI StatsCounter with Spring physics)
  const statsCounters = document.querySelectorAll('.stats-counter');
  if (statsCounters.length > 0) {
    const animateCounter = (el) => {
      const target = parseFloat(el.getAttribute('data-target') || '20');
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      const duration = (parseFloat(el.getAttribute('data-duration') || '1.5')) * 1000;
      
      let startTime = null;

      // Spring-like smooth ease-out curve (framer-motion spring with bounce: 0)
      const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

      const updateCounter = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentVal = easeOutQuart(progress) * target;

        el.textContent = `${prefix}${currentVal.toFixed(decimals)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
        }
      };

      requestAnimationFrame(updateCounter);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: "-20px" });

    statsCounters.forEach(counter => counterObserver.observe(counter));
  }

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
      e.stopPropagation();
      const code = item.getAttribute('data-lang');
      const name = item.getAttribute('data-name');
      const badge = item.getAttribute('data-code');
      setLanguage(code, name, badge, true);

      // Close dropdown menu across mobile and desktop
      const parentDropdown = item.closest('.dropdown, .nav-item.dropdown');
      if (parentDropdown) {
        parentDropdown.classList.remove('show');
        const menu = parentDropdown.querySelector('.dropdown-menu');
        if (menu) menu.classList.remove('show');
        const toggleBtn = parentDropdown.querySelector('.dropdown-toggle');
        if (toggleBtn) {
          toggleBtn.setAttribute('aria-expanded', 'false');
          if (typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
            const bsDropdown = bootstrap.Dropdown.getInstance(toggleBtn);
            if (bsDropdown) bsDropdown.hide();
          }
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

  // 8. Azuki Glassmorphic Music Player Controller
  const musicTracks = [
    {
      title: "Maker of this webpage",
      artist: "Md Shakib Prodhan",
      src: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3"
    },
    {
      title: "Maker of this webpage",
      artist: "Md Shakib Prodhan",
      src: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-amp-strings-10711.mp3"
    },
    {
      title: "Maker of this webpage",
      artist: "Md Shakib Prodhan",
      src: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=chill-abstract-intention-12099.mp3"
    }
  ];

  const musicPlayerCard = document.getElementById('musicPlayerCard');
  const musicAudio = document.getElementById('musicPlayerAudio');
  const musicToggleBtn = document.getElementById('musicPlayerToggle');
  const musicTrackTitle = document.getElementById('musicTrackTitle');
  const musicTrackArtist = document.getElementById('musicTrackArtist');
  const musicPlayBtn = document.getElementById('musicPlayBtn');
  const musicPrevBtn = document.getElementById('musicPrevBtn');
  const musicNextBtn = document.getElementById('musicNextBtn');
  const musicProgressWrap = document.getElementById('musicProgressWrap');
  const musicProgressFill = document.getElementById('musicProgressFill');

  if (musicPlayerCard && musicAudio) {
    let currentTrackIdx = 0;
    let isMusicPlaying = false;
    let isCollapsed = false;

    // Load track
    function loadTrack(index, shouldAutoPlay = false) {
      currentTrackIdx = (index + musicTracks.length) % musicTracks.length;
      const currentTrack = musicTracks[currentTrackIdx];
      
      // Permanently lock title & subtitle
      if (musicTrackTitle) musicTrackTitle.textContent = "Maker of this webpage";
      if (musicTrackArtist) musicTrackArtist.textContent = "Md Shakib Prodhan";

      musicAudio.src = currentTrack.src;
      musicAudio.load();
      if (musicProgressFill) musicProgressFill.style.width = '0%';

      if (shouldAutoPlay) {
        playMusic();
      }
    }

    function playMusic() {
      const playPromise = musicAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isMusicPlaying = true;
          musicPlayerCard.classList.add('is-playing');
          if (musicPlayBtn) {
            musicPlayBtn.querySelector('.icon-play')?.classList.add('d-none');
            musicPlayBtn.querySelector('.icon-pause')?.classList.remove('d-none');
          }
        }).catch(() => {
          // Autoplay or playback restriction handled
          isMusicPlaying = false;
          musicPlayerCard.classList.remove('is-playing');
        });
      }
    }

    function pauseMusic() {
      musicAudio.pause();
      isMusicPlaying = false;
      musicPlayerCard.classList.remove('is-playing');
      if (musicPlayBtn) {
        musicPlayBtn.querySelector('.icon-play')?.classList.remove('d-none');
        musicPlayBtn.querySelector('.icon-pause')?.classList.add('d-none');
      }
    }

    function togglePlay() {
      if (isMusicPlaying) {
        pauseMusic();
      } else {
        playMusic();
      }
    }

    // Play / Pause Click
    if (musicPlayBtn) {
      musicPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
      });
    }

    // Next Button Click — Skip Forward 5 Seconds
    if (musicNextBtn) {
      musicNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (musicAudio.duration) {
          musicAudio.currentTime = Math.min(musicAudio.duration, musicAudio.currentTime + 5);
          const progressPct = (musicAudio.currentTime / musicAudio.duration) * 100;
          if (musicProgressFill) musicProgressFill.style.width = `${progressPct}%`;
        }
      });
    }

    // Prev Button Click — Skip Backward 5 Seconds
    if (musicPrevBtn) {
      musicPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (musicAudio.duration) {
          musicAudio.currentTime = Math.max(0, musicAudio.currentTime - 5);
          const progressPct = (musicAudio.currentTime / musicAudio.duration) * 100;
          if (musicProgressFill) musicProgressFill.style.width = `${progressPct}%`;
        }
      });
    }

    // Toggle Collapse / Expand
    if (musicToggleBtn) {
      musicToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isCollapsed = !isCollapsed;
        if (isCollapsed) {
          musicPlayerCard.classList.add('is-collapsed');
          musicToggleBtn.setAttribute('aria-label', 'Expand player');
          musicToggleBtn.setAttribute('aria-expanded', 'false');
          musicToggleBtn.querySelector('.icon-minus')?.classList.add('d-none');
          musicToggleBtn.querySelector('.icon-plus')?.classList.remove('d-none');
        } else {
          musicPlayerCard.classList.remove('is-collapsed');
          musicToggleBtn.setAttribute('aria-label', 'Collapse player');
          musicToggleBtn.setAttribute('aria-expanded', 'true');
          musicToggleBtn.querySelector('.icon-minus')?.classList.remove('d-none');
          musicToggleBtn.querySelector('.icon-plus')?.classList.add('d-none');
        }
      });
    }

    // Time update for seek progress
    musicAudio.addEventListener('timeupdate', () => {
      if (musicAudio.duration) {
        const progressPct = (musicAudio.currentTime / musicAudio.duration) * 100;
        if (musicProgressFill) {
          musicProgressFill.style.width = `${progressPct}%`;
        }
        if (musicProgressWrap) {
          musicProgressWrap.setAttribute('aria-valuenow', Math.round(progressPct));
        }
      }
    });

    // Auto advance on track ended
    musicAudio.addEventListener('ended', () => {
      loadTrack(currentTrackIdx + 1, true);
    });

    // Audio state sync
    musicAudio.addEventListener('play', () => {
      isMusicPlaying = true;
      musicPlayerCard.classList.add('is-playing');
      musicPlayBtn?.querySelector('.icon-play')?.classList.add('d-none');
      musicPlayBtn?.querySelector('.icon-pause')?.classList.remove('d-none');
    });

    musicAudio.addEventListener('pause', () => {
      isMusicPlaying = false;
      musicPlayerCard.classList.remove('is-playing');
      musicPlayBtn?.querySelector('.icon-play')?.classList.remove('d-none');
      musicPlayBtn?.querySelector('.icon-pause')?.classList.add('d-none');
    });

    // Seek clicking
    if (musicProgressWrap) {
      musicProgressWrap.addEventListener('click', (e) => {
        if (!musicAudio.duration) return;
        const rect = musicProgressWrap.getBoundingClientRect();
        const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        musicAudio.currentTime = clickRatio * musicAudio.duration;
      });
    }

    // Avatar persistent hover & touch toggle handler
    const musicAvatarWrapper = document.getElementById('musicAvatarWrapper');
    if (musicAvatarWrapper) {
      let closeTimeout = null;

      // Keep open on mouseenter
      musicAvatarWrapper.addEventListener('mouseenter', () => {
        if (closeTimeout) {
          clearTimeout(closeTimeout);
          closeTimeout = null;
        }
        musicAvatarWrapper.classList.add('is-active');
      });

      // Linger for 1200ms before closing on mouseleave so users have plenty of time to click
      musicAvatarWrapper.addEventListener('mouseleave', () => {
        if (closeTimeout) clearTimeout(closeTimeout);
        closeTimeout = setTimeout(() => {
          musicAvatarWrapper.classList.remove('is-active');
        }, 1200);
      });

      // Toggle permanently on avatar click (touch / desktop)
      musicAvatarWrapper.addEventListener('click', (e) => {
        const link = e.target.closest('.avatar-popup-circle');
        if (link) {
          // If a link was clicked, allow standard navigation in new tab
          return;
        }
        if (closeTimeout) {
          clearTimeout(closeTimeout);
          closeTimeout = null;
        }
        musicAvatarWrapper.classList.toggle('is-active');
      });

      // Close if clicking anywhere outside
      document.addEventListener('click', (e) => {
        if (!musicAvatarWrapper.contains(e.target)) {
          if (closeTimeout) {
            clearTimeout(closeTimeout);
            closeTimeout = null;
          }
          musicAvatarWrapper.classList.remove('is-active');
        }
      });
    }

    // Initial track load
    loadTrack(0, false);
  }

  // 10. Expandable Bento Grid Handler (Track Record Section)
  const bentoCards = document.querySelectorAll('.bento-card[data-bento-id]');
  const bentoOverlay = document.getElementById('bentoModalOverlay');
  const bentoContent = document.getElementById('bentoModalContent');
  const bentoCloseBtn = document.getElementById('bentoModalClose');

  const bentoDetailsData = {
    'track-2025': {
      period: '2025 – Present',
      role: 'Founder & Managing Director / Senior Advisor',
      company: 'ULUPINAR Strategic',
      location: 'Tampere & Helsinki, Finland',
      badgeClass: 'bento-badge-active',
      overview: 'Spearheaded international business development, strategic partnerships, and cross-border commercial operations connecting Finnish, Nordic, European, and Turkish markets. Actively engaged with startup and scale-up ecosystems, fostering collaboration across regional innovation hubs, universities, and enterprise channels.',
      pillarsTitle: 'Key Leadership Pillars & Strategic Scope',
      pillars: [
        'Bilateral Finnish–Turkish Commercial & Strategic Advisory',
        'Startup & Scale-Up Innovation Ecosystem Orchestration',
        'Large-Scale Enterprise Distribution & Supplier Networks',
        'Alignment with Modern Digital Architecture & ESG Standards'
      ],
      tags: ['Cross-Border Advisory', 'Startup Ecosystems', 'Nordic–EU Hubs', 'Digital Architecture']
    },
    'track-2018': {
      period: '2018 – 2025',
      role: 'Commercial & Industrial International Trade Manager',
      company: 'Şekeroğlu & Polipa Enterprises',
      location: 'Turkey & International Corridors',
      badgeClass: '',
      overview: 'Governed core commercial operations, supply chain logistics, and industrial manufacturing workflows across multi-market corridors. Coordinated domestic and international distribution networks, strengthening regional market positioning and key stakeholder relations.',
      pillarsTitle: 'Core Responsibilities & Milestones',
      pillars: [
        'International Supply Chain & Manufacturing Logistics',
        'B2B Distribution Channel Expansion across EU and Middle East',
        'Key Account Management and Commercial Contract Alignment',
        'Operational Execution with Sustainable Margin Optimization'
      ],
      tags: ['Supply Chain Dynamics', 'Industrial Export', 'Operational Execution', 'Contract Governance']
    },
    'track-2012': {
      period: '2012 – 2018',
      role: 'Corporate Executive & International Trade Director',
      company: 'Ege Sahil Dağıtım Ltd. Şti. & Rositell / IDS Doors',
      location: 'Turkey & Russia',
      badgeClass: '',
      overview: 'Directed overall financial performance, administrative leadership, and international commercial sales strategies across EMEA and CIS corridors. Served as the primary communications coordinator for institutional partnerships, managing multi-channel commercial operations.',
      pillarsTitle: 'Strategic Directorship & Governance',
      pillars: [
        'Executive Financial Governance, Budgeting & P&L Oversight',
        'Multi-Territory Export Strategy & Brand Management',
        'Institutional Partnerships & High-Level Negotiation Coordination',
        'Complex Industrial, Commercial & Residential Project Governance'
      ],
      tags: ['Executive Governance', 'P&L Management', 'Cross-Border Trade', 'Project Leadership']
    },
    'track-summary': {
      period: '20+ Years Trajectory',
      role: '20+ Years Cross-Border Commercial Governance',
      company: 'Murat Ö. Ulupınar — Senior Advisor',
      location: 'Finland • Europe • Türkiye Corridor',
      badgeClass: 'bento-badge-highlight',
      overview: 'Combining structured executive governance, regional intelligence, and hands-on operational leadership to build reliable strategic roadmaps and lasting international partnerships across Northern Europe, the Mediterranean, and global trading hubs.',
      pillarsTitle: 'Core Value Proposition & Executive Focus',
      pillars: [
        'Bridging Cross-Border Complexity into Actionable Growth Models',
        'Decades of Bilateral Trade & Public-Private Innovation Experience',
        'Transparent Communication & High-Governance Operational Control',
        'Sustainable Roadmaps Built on Trust and Long-Term Partnership'
      ],
      tags: ['Nordic–Turkish Bridge', 'Bilateral Growth', 'Institutional Trust', '20+ Years Track Record']
    }
  };

  function openBentoModal(id) {
    const data = bentoDetailsData[id];
    if (!data || !bentoOverlay || !bentoContent) return;

    bentoContent.innerHTML = `
      <div class="bento-modal-header">
        <div class="d-flex align-items-center gap-2 mb-2">
          <span class="bento-badge ${data.badgeClass}">${data.period}</span>
          <span class="text-muted small">${data.location}</span>
        </div>
        <h3 class="fs-4 fw-bold text-dark mb-1">${data.role}</h3>
        <div class="text-accent fw-semibold small">${data.company}</div>
      </div>
      <div class="bento-modal-body">
        <p>${data.overview}</p>
        <div class="bento-modal-pillars">
          <h4>${data.pillarsTitle}</h4>
          <ul>
            ${data.pillars.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
        <div class="bento-tags mb-4">
          ${data.tags.map(tag => `<span class="bento-tag">${tag}</span>`).join('')}
        </div>
        <div class="bento-modal-actions">
          <a href="#contact" class="btn btn-primary-custom" onclick="closeBentoModal()">Connect with Murat <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ms-1"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
          <button type="button" class="btn btn-outline-secondary" onclick="closeBentoModal()">Close</button>
        </div>
      </div>
    `;

    bentoOverlay.classList.add('is-open');
    bentoOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeBentoModal() {
    if (!bentoOverlay) return;
    bentoOverlay.classList.remove('is-open');
    bentoOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  window.closeBentoModal = closeBentoModal;

  if (bentoCards && bentoOverlay) {
    bentoCards.forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-bento-id');
        openBentoModal(id);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const id = card.getAttribute('data-bento-id');
          openBentoModal(id);
        }
      });
    });

    if (bentoCloseBtn) {
      bentoCloseBtn.addEventListener('click', closeBentoModal);
    }

    bentoOverlay.addEventListener('click', (e) => {
      if (e.target === bentoOverlay) {
        closeBentoModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && bentoOverlay.classList.contains('is-open')) {
        closeBentoModal();
      }
    });
  }
});



