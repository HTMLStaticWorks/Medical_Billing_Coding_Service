document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;
  const themeIcon = document.getElementById('theme-icon');

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    htmlElement.setAttribute('data-bs-theme', savedTheme);
    updateThemeIcon(savedTheme);
  } else if (systemPrefersDark) {
    htmlElement.setAttribute('data-bs-theme', 'dark');
    updateThemeIcon('dark');
  } else {
    htmlElement.setAttribute('data-bs-theme', 'light');
    updateThemeIcon('light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const currentTheme = htmlElement.getAttribute('data-bs-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlElement.setAttribute('data-bs-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  // RTL/LTR Toggle logic (navbar inline button)
  const dirToggle = document.getElementById('dir-toggle');
  if (dirToggle) {
    // Restore saved direction
    const savedDir = localStorage.getItem('medcode-rtl') === 'true' ? 'rtl' : 'ltr';
    htmlElement.setAttribute('dir', savedDir);
    dirToggle.textContent = savedDir === 'rtl' ? 'LTR' : 'RTL';

    dirToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isRTL = htmlElement.getAttribute('dir') === 'rtl';
      const newDir = isRTL ? 'ltr' : 'rtl';
      htmlElement.setAttribute('dir', newDir);
      localStorage.setItem('medcode-rtl', String(!isRTL));
      dirToggle.textContent = newDir === 'rtl' ? 'LTR' : 'RTL';
      // Also sync the fixed button if present
      const fixedBtn = document.getElementById('rtl-toggle-fixed');
      if (fixedBtn) {
        fixedBtn.textContent = newDir === 'rtl' ? 'LTR' : 'RTL';
        fixedBtn.classList.toggle('active', !isRTL);
      }
    });
  }

  function updateThemeIcon(theme) {
    if (themeIcon) {
      if (theme === 'dark') {
        themeIcon.classList.remove('bi-moon-fill');
        themeIcon.classList.add('bi-sun-fill');
      } else {
        themeIcon.classList.remove('bi-sun-fill');
        themeIcon.classList.add('bi-moon-fill');
      }
    }
  }

  // ── Collapse navbar on desktop resize (prevents ghost brand + X bug) ──
  const navbarCollapse = document.getElementById('navbarCollapse');
  if (navbarCollapse) {
    const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse, { toggle: false });
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 992) {
        // Force-hide the collapse and remove Bootstrap's lingering classes
        navbarCollapse.classList.remove('show');
        navbarCollapse.style.height = '';
        bsCollapse.hide();
      }
    });
  }

  // Back to Top Button
  const backToTopBtn = document.getElementById('back-to-top');
  
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.style.display = 'flex';
      } else {
        backToTopBtn.style.display = 'none';
      }
    });

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Mobile Menu Overlay Logic
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  
  if (navbarToggler && navbarCollapse) {
    // Create backdrop element
    const backdrop = document.createElement('div');
    backdrop.className = 'menu-backdrop';
    document.body.appendChild(backdrop);

    navbarToggler.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = navbarCollapse.classList.contains('show');
      if (!isOpen) {
        showMenu();
      } else {
        hideMenu();
      }
    });

    backdrop.addEventListener('click', hideMenu);

    // Close menu when clicking nav links
    const navLinks = navbarCollapse.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', hideMenu);
    });

    function showMenu() {
      // Inject Header if not exists
      if (!navbarCollapse.querySelector('.menu-header')) {
        const header = document.createElement('div');
        header.className = 'menu-header';
        header.innerHTML = `
          <a href="index.html" class="menu-brand">
            <i class="bi bi-file-medical text-primary-custom me-2"></i>MedCode
          </a>
          <button class="menu-close-btn" aria-label="Close Menu">
            <i class="bi bi-x-lg"></i>
          </button>
        `;
        navbarCollapse.prepend(header);
        header.querySelector('.menu-close-btn').addEventListener('click', hideMenu);
      }

      navbarCollapse.classList.add('show');
      backdrop.classList.add('show');
      document.body.classList.add('menu-open');
      navbarToggler.setAttribute('aria-expanded', 'true');
    }

    function hideMenu() {
      navbarCollapse.classList.remove('show');
      backdrop.classList.remove('show');
      document.body.classList.remove('menu-open');
      navbarToggler.setAttribute('aria-expanded', 'false');
    }
  }

  // ── Fixed RTL Toggle Button ──
  const rtlBtn = document.getElementById('rtl-toggle-fixed');

  function setRTL(isRTL) {
    if (isRTL) {
      htmlElement.setAttribute('dir', 'rtl');
      localStorage.setItem('medcode-rtl', 'true');
    } else {
      htmlElement.setAttribute('dir', 'ltr');
      localStorage.setItem('medcode-rtl', 'false');
    }
    if (rtlBtn) {
      rtlBtn.textContent = isRTL ? 'LTR' : 'RTL';
      rtlBtn.classList.toggle('active', isRTL);
    }
  }

  // Restore saved RTL preference
  const savedRTL = localStorage.getItem('medcode-rtl') === 'true';
  setRTL(savedRTL);

  if (rtlBtn) {
    rtlBtn.addEventListener('click', () => {
      const isRTL = htmlElement.getAttribute('dir') === 'rtl';
      setRTL(!isRTL);
    });
  }
});

