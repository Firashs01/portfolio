/**
 * FIRAS HASNI — PORTFOLIO MAIN JS
 * Interactive behavior, 3D tilt, theme toggle, project filter, copy utilities
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect
  const header = document.getElementById('header');
  const backToTop = document.getElementById('back-to-top');

  const onScroll = () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    if (scrollY > 400) {
      backToTop?.classList.add('visible');
    } else {
      backToTop?.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 2. Back to top button
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 3. Mobile Drawer Navigation
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileBackdrop = document.getElementById('mobile-nav-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav__link');

  const openMobileNav = () => {
    mobileNav?.classList.add('open');
    mobileBackdrop?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileNav = () => {
    mobileNav?.classList.remove('open');
    mobileBackdrop?.classList.remove('open');
    document.body.style.overflow = '';
  };

  navToggle?.addEventListener('click', openMobileNav);
  navClose?.addEventListener('click', closeMobileNav);
  mobileBackdrop?.addEventListener('click', closeMobileNav);
  mobileLinks.forEach(link => link.addEventListener('click', closeMobileNav));

  // 4. Dark / Light Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('fh_theme');

  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    updateThemeIcon(true);
  }

  themeToggle?.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-theme');
    localStorage.setItem('fh_theme', isLight ? 'light' : 'dark');
    updateThemeIcon(isLight);
  });

  function updateThemeIcon(isLight) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if (icon) {
      icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  // 5. 3D Tilt Effect on Hero Card
  const heroCard = document.getElementById('hero-3d-card');
  if (heroCard && window.matchMedia('(pointer: fine)').matches) {
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    heroCard.addEventListener('mouseleave', () => {
      heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // 6. Typing text animation in Hero
  const typingElement = document.getElementById('typing-text');
  const titles = [
    'Web Developer & Full-Stack Engineer',
    'AI Research Student (NLP & Deep Learning)',
    'AI Automation & LLM Pipeline Architect'
  ];
  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function typeEffect() {
    if (!typingElement) return;
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
      typingElement.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      typingElement.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 80;
    }

    if (!isDeleting && charIndex === currentTitle.length) {
      isDeleting = true;
      typeSpeed = 1600; // pause before deleting
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typeSpeed = 400; // pause before typing next
    }

    setTimeout(typeEffect, typeSpeed);
  }

  if (typingElement) {
    typeEffect();
  }

  // 7. Projects Filter
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter') || 'all';

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // 8. Clipboard Copy Functionality
  const copyButtons = document.querySelectorAll('.contact__copy-btn');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const icon = btn.querySelector('i');
        if (icon) {
          const originalClass = icon.className;
          icon.className = 'fas fa-check text-cyan';
          btn.style.borderColor = 'var(--accent-cyan)';
          setTimeout(() => {
            icon.className = originalClass;
            btn.style.borderColor = '';
          }, 2000);
        }
      });
    });
  });

  // 9. Contact Form Feedback
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
      submitBtn.disabled = true;
    }

    setTimeout(() => {
      contactForm.reset();
      if (formSuccess) {
        formSuccess.style.display = 'block';
        setTimeout(() => {
          formSuccess.style.display = 'none';
        }, 5000);
      }
      if (submitBtn) {
        submitBtn.innerHTML = '<span>Message envoyé !</span> <i class="fas fa-check"></i>';
        setTimeout(() => {
          submitBtn.innerHTML = '<span>Envoyer le message</span> <i class="fas fa-paper-plane"></i>';
          submitBtn.disabled = false;
        }, 3000);
      }
    }, 1000);
  });

  // 10. Active Nav Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const highlightNav = () => {
    const scrollY = window.pageYOffset;
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active-link');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active-link');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
});
