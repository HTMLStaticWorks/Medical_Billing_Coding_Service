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

  // RTL Toggle
  const rtlToggles = document.querySelectorAll('#rtl-toggle, #sidebar-rtl-toggle');
  
  // Check saved RTL preference
  const savedRtl = localStorage.getItem('rtl') === 'true';
  if (savedRtl) {
    htmlElement.setAttribute('dir', 'rtl');
    rtlToggles.forEach(toggle => toggle.classList.add('active'));
  } else {
    htmlElement.setAttribute('dir', 'ltr');
    rtlToggles.forEach(toggle => toggle.classList.remove('active'));
  }

  rtlToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isRtl = htmlElement.getAttribute('dir') === 'rtl';
      const newRtl = !isRtl;
      
      if (newRtl) {
        htmlElement.setAttribute('dir', 'rtl');
        localStorage.setItem('rtl', 'true');
        rtlToggles.forEach(t => t.classList.add('active'));
      } else {
        htmlElement.setAttribute('dir', 'ltr');
        localStorage.setItem('rtl', 'false');
        rtlToggles.forEach(t => t.classList.remove('active'));
      }
    });
  });

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
  const navbarCollapseEl = document.getElementById('navbarCollapse');
  if (navbarCollapseEl) {
    const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapseEl, { toggle: false });
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 992) {
        navbarCollapseEl.classList.remove('show');
        navbarCollapseEl.style.height = '';
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile Menu Overlay Logic
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapseMenu = document.querySelector('.navbar-collapse');
  
  if (navbarToggler && navbarCollapseMenu) {
    const backdrop = document.createElement('div');
    backdrop.className = 'menu-backdrop';
    document.body.appendChild(backdrop);

    navbarToggler.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = navbarCollapseMenu.classList.contains('show');
      if (!isOpen) {
        showMenu();
      } else {
        hideMenu();
      }
    });

    backdrop.addEventListener('click', hideMenu);

    const navLinks = navbarCollapseMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', hideMenu);
    });

    function showMenu() {
      if (!navbarCollapseMenu.querySelector('.menu-header')) {
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
        navbarCollapseMenu.prepend(header);
        header.querySelector('.menu-close-btn').addEventListener('click', hideMenu);
      }

      navbarCollapseMenu.classList.add('show');
      backdrop.classList.add('show');
      document.body.classList.add('menu-open');
      navbarToggler.setAttribute('aria-expanded', 'true');
    }

    function hideMenu() {
      navbarCollapseMenu.classList.remove('show');
      backdrop.classList.remove('show');
      document.body.classList.remove('menu-open');
      navbarToggler.setAttribute('aria-expanded', 'false');
    }
  }
});
