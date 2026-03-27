/* ============================================
   LOADER — Pantalla de carga
   ============================================ */
const loader = document.getElementById('loader');
if (loader) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }, 1800);
  });
}

/* ============================================
   TYPEWRITER — Hero title
   ============================================ */
const typewriterEl = document.getElementById('typewriterTarget');
if (typewriterEl) {
  const phrases = [
    'Fullstack Developer',
    'Laravel + React',
    'Solana Builder',
    'Freelance & Empleo',
  ];

  // Calcula el ancho dinámicamente según la frase más larga
  const longest = phrases.reduce((a, b) => a.length > b.length ? a : b);
  document.documentElement.style.setProperty('--typewriter-ch', longest.length);
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let paused = false;

  function typeStep() {
    const current = phrases[phraseIndex];

    if (paused) {
      paused = false;
      setTimeout(typeStep, 1400);
      return;
    }

    if (!deleting) {
      typewriterEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        paused = true;
        setTimeout(typeStep, 0);
        return;
      }
    } else {
      typewriterEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        typewriterEl.textContent = '\u00A0'; // espacio invisible — evita colapso del span
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(typeStep, 400);
        return;
      }
    }
    setTimeout(typeStep, deleting ? 40 : 70);
  }

  setTimeout(typeStep, 900);
}

/* ============================================
   THEME TOGGLE
   ============================================ */
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeToggle.style.transform = 'rotate(180deg) scale(1.1)';
  setTimeout(() => { themeToggle.style.transform = ''; }, 300);
});

/* ============================================
   MOBILE NAV
   ============================================ */
const navBurger = document.getElementById('navBurger');
const navMobile = document.getElementById('navMobile');

navBurger.addEventListener('click', () => {
  const isOpen = navMobile.classList.toggle('open');
  navBurger.classList.toggle('open', isOpen);
  navBurger.setAttribute('aria-expanded', isOpen);
});

navMobile.querySelectorAll('.nav__mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
    navBurger.classList.remove('open');
  });
});

/* ============================================
   NAV SCROLL EFFECT
   ============================================ */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ============================================
   ACTIVE NAV LINK (Intersection Observer)
   ============================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach(section => sectionObserver.observe(section));

/* ============================================
   SCROLL REVEAL — multi-direction stagger
   ============================================ */
function assignRevealDirections() {
  document.querySelectorAll('.skill-card').forEach((el, i) => {
    el.classList.add('reveal');
    el.classList.add(i % 2 === 0 ? 'from-left' : 'from-right');
    el.style.transitionDelay = `${(i % 3) * 80}ms`;
  });

  document.querySelectorAll('.cert-card').forEach((el, i) => {
    el.classList.add('reveal', 'scale');
    el.style.transitionDelay = `${i * 70}ms`;
  });

  document.querySelectorAll('.project-case').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 60}ms`;
  });

  document.querySelectorAll('.about__highlight').forEach((el, i) => {
    el.classList.add('reveal', 'from-left');
    el.style.transitionDelay = `${i * 100}ms`;
  });

  document.querySelectorAll('.about__card').forEach(el => {
    el.classList.add('reveal', 'from-right');
  });

  document.querySelectorAll('.section__header').forEach(el => {
    el.classList.add('reveal');
  });

  document.querySelectorAll('.contact__info, .contact__form').forEach((el, i) => {
    el.classList.add('reveal');
    el.classList.add(i === 0 ? 'from-left' : 'from-right');
  });
}

assignRevealDirections();

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -48px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================
   PROJECT BANNER — Clip-path curtain reveal
   ============================================ */
const bannerObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('banner-visible');
        bannerObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0, rootMargin: '0px 0px 0px 0px' }
);

document.querySelectorAll('.project-case__banner').forEach(el => {
  bannerObserver.observe(el);
  // Fallback: si ya está en el viewport al cargar, actívalo tras un frame
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight) {
    requestAnimationFrame(() => el.classList.add('banner-visible'));
  }
});

/* ============================================
   ANIMATED STAT COUNTERS
   ============================================ */
function animateCounter(el, target, suffix, duration = 1200) {
  const isDecimal = target % 1 !== 0;
  let start = null;

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = isDecimal
      ? (eased * target).toFixed(1)
      : Math.floor(eased * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const raw = el.dataset.count;
    const suffix = el.dataset.suffix || '';
    if (raw) animateCounter(el, parseFloat(raw), suffix);
    statsObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero__stat-number').forEach(el => {
  const text = el.textContent.trim();
  const num = parseFloat(text.replace(/[^0-9.]/g, ''));
  const suffix = text.replace(/[0-9.]/g, '');
  if (!isNaN(num)) {
    el.dataset.count = num;
    el.dataset.suffix = suffix;
    el.textContent = '0' + suffix;
    statsObserver.observe(el);
  }
});

/* ============================================
   RESULT BAR ANIMATION ON SCROLL
   ============================================ */
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.result-item__before, .result-item__after').forEach((bar, i) => {
      bar.style.animationDelay = `${i * 200}ms`;
      bar.style.animationPlayState = 'running';
    });
    barObserver.unobserve(entry.target);
  });
}, { threshold: 0.3 });

document.querySelectorAll('.project-case').forEach(el => barObserver.observe(el));

/* ============================================
   SKILL TAGS STAGGER ON REVEAL
   ============================================ */
const tagObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.tag').forEach((tag, i) => {
      tag.style.opacity = '0';
      tag.style.transform = 'scale(0.7) translateY(6px)';
      tag.style.transition = `opacity 0.3s ease ${i * 60}ms, transform 0.3s cubic-bezier(0.34,1.56,0.64,1) ${i * 60}ms`;
      requestAnimationFrame(() => {
        tag.style.opacity = '1';
        tag.style.transform = 'scale(1) translateY(0)';
      });
    });
    tagObserver.unobserve(entry.target);
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-card, .project-case__tech').forEach(el => tagObserver.observe(el));

/* ============================================
   CURSOR GLOW + PARALLAX + TILT + MAGNETIC
   ============================================ */
const isDesktop = window.matchMedia('(pointer: fine)').matches;

if (isDesktop) {
  let mouseX = 0, mouseY = 0;

  /* — Cursor glow — */
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed; pointer-events:none; z-index:9999;
    width:380px; height:380px; border-radius:50%;
    background:radial-gradient(circle, rgba(124,106,255,0.09) 0%, transparent 70%);
    transform:translate(-50%,-50%);
    transition:opacity 0.4s ease;
    top:-999px; left:-999px;
  `;
  document.body.appendChild(glow);

  let glowX = 0, glowY = 0;
  function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top  = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  /* — Hero parallax on orbs — */
  const heroOrbs = document.querySelectorAll('.hero__orb');
  const heroEl   = document.getElementById('inicio');
  const speeds   = [0.025, -0.018, 0.012, -0.008];

  /* — Card 3-D tilt — */
  function applyTilt(card, ex, ey) {
    const r  = card.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    const dx = (ex - cx) / (r.width  / 2);
    const dy = (ey - cy) / (r.height / 2);
    const rx = dy * -6;
    const ry = dx *  6;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    card.style.transition = 'transform 0.1s ease';
    const shine = card.querySelector('.card-shine');
    if (shine) {
      shine.style.background = `radial-gradient(circle at ${(dx+1)*50}% ${(dy+1)*50}%, rgba(255,255,255,0.06), transparent 60%)`;
    }
  }

  function resetTilt(card) {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1)';
  }

  document.querySelectorAll('.skill-card, .cert-card').forEach(card => {
    const shine = document.createElement('div');
    shine.className = 'card-shine';
    shine.style.cssText = `position:absolute;inset:0;border-radius:inherit;pointer-events:none;transition:background 0.15s ease;`;
    card.style.position = 'relative';
    card.appendChild(shine);

    card.addEventListener('mousemove', e => applyTilt(card, e.clientX, e.clientY));
    card.addEventListener('mouseleave', () => resetTilt(card));
  });

  /* — Magnetic buttons — */
  document.querySelectorAll('.btn--primary, .btn--ghost').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width  / 2);
      const dy = e.clientY - (r.top  + r.height / 2);
      btn.style.transform  = `translate(${dx * 0.25}px, ${dy * 0.3}px)`;
      btn.style.transition = 'transform 0.1s ease';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform  = '';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
    });
  });

  /* — Click ripple — */
  document.addEventListener('click', e => {
    if (e.target.closest('a, button, input, textarea')) return;
    const rip = document.createElement('span');
    rip.style.cssText = `
      position:fixed; pointer-events:none; z-index:9998;
      width:8px; height:8px; border-radius:50%;
      background:rgba(124,106,255,0.5);
      left:${e.clientX}px; top:${e.clientY}px;
      transform:translate(-50%,-50%) scale(1);
      animation:rippleOut 0.6s ease forwards;
    `;
    document.body.appendChild(rip);
    rip.addEventListener('animationend', () => rip.remove());
  });

  /* — Main mouse listener — */
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    /* Parallax orbs */
    if (heroEl) {
      const r  = heroEl.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        const cx = r.width  / 2;
        const cy = r.height / 2;
        const ox = e.clientX - r.left - cx;
        const oy = e.clientY - r.top  - cy;
        heroOrbs.forEach((orb, i) => {
          const s = speeds[i] || 0.01;
          orb.style.transform  = `translate(${ox * s}px, ${oy * s}px)`;
          orb.style.transition = 'transform 0.6s ease';
        });
      }
    }
  });

  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
}

/* ============================================
   ABOUT CARD — tilt 3D
   ============================================ */
if (isDesktop) {
  const aboutCard = document.querySelector('.about__card');
  if (aboutCard) {
    aboutCard.addEventListener('mousemove', e => {
      const r  = aboutCard.getBoundingClientRect();
      const dx = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2);
      const dy = (e.clientY - r.top   - r.height / 2) / (r.height / 2);
      aboutCard.style.transform  = `perspective(800px) rotateX(${dy * -5}deg) rotateY(${dx * 5}deg) translateY(-4px)`;
      aboutCard.style.transition = 'transform 0.1s ease';
    });
    aboutCard.addEventListener('mouseleave', () => {
      aboutCard.style.transform  = '';
      aboutCard.style.transition = 'transform 0.6s cubic-bezier(0.22,1,0.36,1)';
    });
  }
}

/* ============================================
   PROJECT CASES — tilt + data flow activo
   ============================================ */
if (isDesktop) {
  document.querySelectorAll('.project-case').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2);
      const dy = (e.clientY - r.top   - r.height / 2) / (r.height / 2);
      card.style.transform  = `perspective(1200px) rotateX(${dy * -2}deg) rotateY(${dx * 2}deg) translateY(-3px)`;
      card.style.transition = 'transform 0.12s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1)';
    });
  });
}

/* ============================================
   ARCHITECTURE — arch arrow animation reset
   ============================================ */
document.querySelectorAll('.project-case').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.querySelectorAll('.arch-arrow').forEach((arrow, i) => {
      arrow.style.opacity = '0';
      setTimeout(() => {
        arrow.style.transition = 'opacity 0.3s ease';
        arrow.style.opacity = '1';
      }, i * 150 + 100);
    });
  });
});

/* ============================================
   CONTACT FORM — contador de caracteres
   ============================================ */
const textarea = document.getElementById('message');
if (textarea) {
  const counter = document.createElement('span');
  counter.style.cssText = `
    display:block; text-align:right; font-size:0.7rem;
    font-family:var(--font-mono); color:var(--text-muted);
    margin-top:4px; transition:color 0.2s ease;
  `;
  counter.textContent = '0 / 500';
  textarea.parentElement.appendChild(counter);

  textarea.addEventListener('input', () => {
    const len = textarea.value.length;
    counter.textContent = `${len} / 500`;
    counter.style.color = len > 450
      ? 'var(--warning)'
      : len > 500
        ? 'var(--error)'
        : 'var(--text-muted)';
    if (len > 500) textarea.value = textarea.value.slice(0, 500);
  });
}

/* ============================================
   CONTACT ITEMS — ripple al click en email/tel
   ============================================ */
document.querySelectorAll('.contact__item').forEach(item => {
  item.addEventListener('click', () => {
    item.style.background = 'var(--accent-glow)';
    setTimeout(() => { item.style.background = ''; }, 400);
  });
});

/* ============================================
   SMOOTH SCROLL
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================
   CONTACT FORM
   ============================================ */
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async e => {
  e.preventDefault();

  const btn = contactForm.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  const action = contactForm.getAttribute('action');

  if (action.includes('YOUR_FORM_ID')) {
    btn.textContent = 'Configura Formspree primero';
    btn.style.background = 'var(--warning)';
    btn.style.transform = 'scale(0.97)';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.transform = '';
    }, 3000);
    return;
  }

  btn.textContent = 'Enviando…';
  btn.disabled = true;

  try {
    const res = await fetch(action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { Accept: 'application/json' }
    });

    if (res.ok) {
      btn.textContent = '✓ Mensaje enviado';
      btn.style.background = 'var(--success)';
      contactForm.reset();
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    } else {
      throw new Error();
    }
  } catch {
    btn.textContent = 'Error al enviar';
    btn.style.background = 'var(--error)';
    btn.disabled = false;
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
    }, 3000);
  }
});

/* ============================================
   TERMINAL ANIMATION — Hero CLI
   ============================================ */
const terminalBody = document.getElementById('terminalBody');
if (terminalBody) {
  const lines = [
    { type: 'cmd',    prompt: '$', text: 'whoami' },
    { type: 'output', text: '→ Arturo de la Cruz · Fullstack Developer' },
    { type: 'cmd',    prompt: '$', text: 'git clone arturo-portfolio' },
    { type: 'output', text: '✓ Clonando repositorio...' },
    { type: 'cmd',    prompt: '$', text: 'npm install' },
    { type: 'output-muted', text: '47 paquetes instalados en 1.2s' },
    { type: 'cmd',    prompt: '$', text: 'npm run dev' },
    { type: 'output', text: '✓ Listo en localhost:3000' },
  ];

  let cursor = null;

  function addCursor() {
    if (cursor) cursor.remove();
    cursor = document.createElement('span');
    cursor.className = 'terminal-cursor-blink';
    terminalBody.appendChild(cursor);
  }

  function removeCursor() {
    if (cursor) { cursor.remove(); cursor = null; }
  }

  function typeLineChars(el, text, speed, done) {
    let i = 0;
    addCursor();
    function step() {
      el.textContent = text.slice(0, i + 1);
      i++;
      if (i < text.length) {
        setTimeout(step, speed);
      } else {
        removeCursor();
        done();
      }
    }
    step();
  }

  function renderLine(line, delay, done) {
    setTimeout(() => {
      const row = document.createElement('div');
      row.className = 'terminal-line';

      if (line.type === 'cmd') {
        const prompt = document.createElement('span');
        prompt.className = 'terminal-prompt';
        prompt.textContent = line.prompt;
        const cmd = document.createElement('span');
        cmd.className = 'terminal-cmd';
        row.appendChild(prompt);
        row.appendChild(cmd);
        terminalBody.appendChild(row);
        typeLineChars(cmd, line.text, 38, done);
      } else {
        const out = document.createElement('span');
        out.className = line.type === 'output-muted' ? 'terminal-output--muted' : 'terminal-output';
        out.textContent = line.text;
        row.appendChild(out);
        terminalBody.appendChild(row);
        setTimeout(done, 80);
      }
    }, delay);
  }

  // Espera a que el hero sea visible para iniciar
  const termObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      termObserver.disconnect();
      let delay = 400;
      function runLine(index) {
        if (index >= lines.length) return;
        renderLine(lines[index], delay, () => {
          delay = lines[index].type === 'cmd' ? 320 : 180;
          runLine(index + 1);
        });
        delay = 0;
      }
      runLine(0);
    }
  }, { threshold: 0.3 });

  termObserver.observe(terminalBody);
}
