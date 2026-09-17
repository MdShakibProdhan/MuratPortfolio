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
});



