/* Comportamenti condivisi: tema, nav mobile, timeline, reveal, accordion,
   anello DNA dell'avatar (si autodisattiva se l'elemento non c'e). */
  // ── Theme toggle ──
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeBtn');
  const sun = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const moon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    themeBtn.innerHTML = t === 'dark' ? sun : moon;
    try { localStorage.setItem('theme', t); } catch (e) {}
  }
  let saved = 'dark';
  try { saved = localStorage.getItem('theme') || 'dark'; } catch (e) {}
  applyTheme(saved);
  themeBtn.addEventListener('click', () => {
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  // ── Mobile nav ──
  const navToggle = document.getElementById('navToggle');
  const navlinks = document.getElementById('navlinks');
  if (navToggle && navlinks) navToggle.addEventListener('click', () => navlinks.classList.toggle('open'));
  if (navlinks) navlinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navlinks.classList.remove('open')));

  // ── Expandable timeline ──
  document.querySelectorAll('.tl').forEach(tl => {
    tl.addEventListener('click', () => tl.classList.toggle('open'));
  });

  // ── Reveal on scroll ──
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (i % 4 * 60) + 'ms';
    obs.observe(el);
  });

  // ── Subhead comprimibili (skills) ──
  document.querySelectorAll('.subhead.acc').forEach(sh => {
    const panel = sh.nextElementSibling;
    let closeTimer = null;

    // i figli .reveal non vengono mai osservati da chiusi: li mostro all'apertura
    function showReveals() {
      [panel, ...panel.querySelectorAll('.reveal')].forEach(el => {
        if (el.classList.contains('reveal')) el.classList.add('in');
      });
    }
    // deve coprire animazione + ritardi dell'ultima card
    function closeMs() {
      return matchMedia('(prefers-reduced-motion: reduce)').matches ? 240 : 500;
    }
    function open() {
      sh.classList.remove('collapsed', 'closing');
      panel.classList.remove('closing');
      sh.setAttribute('aria-expanded', 'true');
      showReveals();
    }
    function toggle() {
      if (closeTimer) {            // chiusura in corso: annullo e riapro
        clearTimeout(closeTimer);
        closeTimer = null;
        open();
        return;
      }
      if (sh.classList.contains('collapsed')) { open(); return; }
      sh.classList.add('closing');  // chiudo solo a animazione finita
      panel.classList.add('closing');
      sh.setAttribute('aria-expanded', 'false');
      closeTimer = setTimeout(() => {
        closeTimer = null;
        sh.classList.remove('closing');
        panel.classList.remove('closing');
        sh.classList.add('collapsed');
      }, closeMs());
    }
    sh.addEventListener('click', toggle);
    sh.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });

  // ── DNA polymerase ring around the avatar ──
  (function () {
    const host = document.getElementById('dna');
    if (!host) return;
    const C = 100, R = 96, A = 6.5, K = 16, N = 260, RUNGS = 42;
    const pt = (t, s) => {
      const r = R + s * A * Math.sin(K * t);
      return [C + r * Math.cos(t), C + r * Math.sin(t)];
    };
    let s1 = '', s2 = '', rungs = '';
    for (let i = 0; i <= N; i++) {
      const t = i / N * Math.PI * 2;
      const [x1, y1] = pt(t, 1), [x2, y2] = pt(t, -1);
      s1 += (i ? 'L' : 'M') + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' ';
      s2 += (i ? 'L' : 'M') + x2.toFixed(1) + ' ' + y2.toFixed(1) + ' ';
    }
    for (let i = 0; i < RUNGS; i++) {
      const t = i / RUNGS * Math.PI * 2;
      const [x1, y1] = pt(t, 1), [x2, y2] = pt(t, -1);
      rungs += '<line class="rg" x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '"/>';
    }
    host.innerHTML =
      '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">' +
        '<circle class="bc" cx="100" cy="100" r="' + R + '" fill="none"/>' +
        '<g id="dnaSpin" fill="none" stroke-linecap="round">' + rungs +
          '<path class="s1" d="' + s1 + '"/><path class="s2" d="' + s2 + '"/>' +
        '</g>' +
        '<g class="enzWrap" id="enzWrap">' +
          '<path class="nascent" fill="none" id="nascentPath" d="M100 -8 q 9 -8 2 -19"/>' +
          '<ellipse class="enz" cx="96" cy="7" rx="12.5" ry="10"/>' +
          '<ellipse class="enz" cx="106" cy="2" rx="9.5" ry="8"/>' +
          '<circle class="enzCore" cx="100.5" cy="4.5" r="3.6"/>' +
        '</g>' +
      '</svg>';

    const wrap = host.parentElement;
    const dnaSpin = host.querySelector('#dnaSpin');
    const enz = host.querySelector('#enzWrap');
    const nascent = host.querySelector('#nascentPath');
    // Keep angles in [0,360) to avoid overflow in the shortest-path formula
    const norm = a => ((a % 360) + 360) % 360;
    const shortDiff = (to, from) => (((to - from + 180) % 360) + 360) % 360 - 180;
    let cur = 270, target = 270; // 270° = top (enzyme starts at 12 o'clock)
    let autoMode = true;
    let isOverAvatar = false;
    let dashOffset = 0;
    let ringAngle = 0;

    addEventListener('mousemove', function (e) {
      if (isOverAvatar) return;
      autoMode = false;
      const r = wrap.getBoundingClientRect();
      target = norm(Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI);
    }, { passive: true });

    wrap.addEventListener('mouseenter', function () { isOverAvatar = true; });
    wrap.addEventListener('mouseleave', function () { isOverAvatar = false; });

    (function follow() {
      // Nascent strand flow
      dashOffset -= 0.3;
      if (nascent) nascent.style.strokeDashoffset = dashOffset;

      // Ring rotation (JS-driven: 24s/revolution ≈ 0.25°/frame @60fps)
      ringAngle = norm(ringAngle + 0.25);
      if (dnaSpin) dnaSpin.setAttribute('transform', 'rotate(' + ringAngle.toFixed(2) + ' 100 100)');

      // Enzyme: auto-orbit or follow mouse
      if (autoMode) {
        cur = norm(cur + 0.3);
        target = cur;
      } else if (!isOverAvatar) {
        cur = norm(cur + shortDiff(target, cur) * 0.18);
      }
      // isOverAvatar → freeze

      if (enz) enz.setAttribute('transform', 'rotate(' + norm(cur + 90).toFixed(1) + ' 100 100)');
      requestAnimationFrame(follow);
    })();
  })();
