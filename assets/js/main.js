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
});
