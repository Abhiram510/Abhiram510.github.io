(() => {
  const nav = document.getElementById('nav');
  const toggle = document.querySelector('.mobile-toggle');
  const links = document.querySelector('.nav-links');
  const cursorGlow = document.getElementById('cursorGlow');
  const scrollBar = document.getElementById('scrollProgress');

  // --- Scroll: nav shadow + progress bar ---
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    scrollBar.style.width = `${Math.min(pct * 100, 100)}%`;
  });

  // --- Mobile menu ---
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    const open = links.classList.contains('open');
    const spans = toggle.querySelectorAll('span');
    spans[0].style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity = open ? '0' : '1';
    spans[2].style.transform = open ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
    })
  );

  // --- Cursor glow (desktop) ---
  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', e => {
      cursorGlow.classList.add('active');
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    });
    document.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
  }

  // --- Glow card mouse tracking ---
  document.querySelectorAll('.glow-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', (e.clientX - r.left) + 'px');
      card.style.setProperty('--mouse-y', (e.clientY - r.top) + 'px');
    });
  });

  // --- Tilt effect on project cards ---
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // --- Scroll animations (staggered) ---
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (!el.dataset.delay) {
          const siblings = [...el.parentElement.children].filter(c => c.hasAttribute('data-anim'));
          const idx = siblings.indexOf(el);
          el.style.transitionDelay = `${idx * 0.12}s`;
        }
        requestAnimationFrame(() => el.classList.add('visible'));
        observer.unobserve(el);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('[data-anim]').forEach(el => observer.observe(el));

  // --- Typewriter ---
  const phrases = [
    'I build things for the web & beyond.',
    'I engineer low-latency systems.',
    'I ship products people love.',
  ];
  const typeEl = document.getElementById('typewriter');
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = phrases[phraseIdx];
    typeEl.textContent = current.substring(0, charIdx);

    if (!deleting) {
      charIdx++;
      if (charIdx > current.length) {
        deleting = true;
        setTimeout(type, 2200);
        return;
      }
      setTimeout(type, 55 + Math.random() * 35);
    } else {
      charIdx--;
      if (charIdx < 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        charIdx = 0;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 30);
    }
  }
  setTimeout(type, 800);

  // --- Counter animation ---
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      if (isNaN(target)) return;
      const isFloat = target % 1 !== 0;
      const duration = 1600;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const val = eased * target;
        el.textContent = isFloat ? val.toFixed(2) : Math.round(val);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  // --- Active nav link highlight ---
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-links a');
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--accent)' : '';
      });
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });
  sections.forEach(s => navObserver.observe(s));
})();
