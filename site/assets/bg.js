/* Sfondo animato a molecole, condiviso tra le pagine. */
  // ── Floating molecules / proteins background ──
  (function () {
    const root = document.documentElement;
    const themeBtn = document.getElementById('themeBtn');
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, worldH, dpr, mols = [];

    function cssVar(name, fb) { return getComputedStyle(root).getPropertyValue(name).trim() || fb; }
    function hexToRgb(hex) {
      hex = hex.replace('#', '');
      if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
      const n = parseInt(hex, 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    let cPrim = hexToRgb(cssVar('--primary', '#34d399'));
    let cSec  = hexToRgb(cssVar('--secondary', '#22d3ee'));
    const rgba = (c, o) => `rgba(${c[0]},${c[1]},${c[2]},${o})`;

    // ── Realistic pharmaceutical molecule templates (skeletal formula) ──
    // tpl(rawAtoms, bonds): auto-centers atoms at centroid
    function tpl(rawAtoms, bonds) {
      let cx = 0, cy = 0;
      rawAtoms.forEach(a => { cx += a[0]; cy += a[1]; });
      cx /= rawAtoms.length; cy /= rawAtoms.length;
      return {
        atoms: rawAtoms.map(([x, y, h]) => ({ x: x - cx, y: y - cy, hetero: !!h })),
        bonds
      };
    }

    // Benzene (C6H6)
    const benzene = tpl(
      [[1,0],[.5,.87],[-.5,.87],[-1,0],[-.5,-.87],[.5,-.87]],
      [{a:0,b:1},{a:1,b:2,double:true},{a:2,b:3},{a:3,b:4,double:true},{a:4,b:5},{a:5,b:0,double:true}]
    );

    // Caffeine (1,3,7-trimethylxanthine) – fused 6+5 ring, 3×CH3, 2×C=O
    const caffeine = tpl([
      [-.5,0,1],[.5,0,0],[1,.87,1],[.5,1.73,0],[-.5,1.73,0],[-1,.87,0],  // N1 C2 N3 C4 C5 C6
      [1,-.87,1],[-2,.87,1],                                               // O= on C2, O= on C6
      [-.3,2.6,1],[.7,2.8,0],[1.4,2.1,1],                                 // N7 C8 N9 (5-ring)
      [-.5,-.87,0],[2,.87,0],[-.3,3.5,0]                                   // CH3 on N1 N3 N7
    ],[
      {a:0,b:1},{a:1,b:2},{a:2,b:3},{a:3,b:4},{a:4,b:5},{a:5,b:0},
      {a:1,b:6,double:true},{a:5,b:7,double:true},
      {a:4,b:8},{a:8,b:9},{a:9,b:10},{a:10,b:3},
      {a:0,b:11},{a:2,b:12},{a:8,b:13}
    ]);

    // Acetaminophen / paracetamol (4-acetamidophenol)
    const acetaminophen = tpl([
      [0,1,0],[.87,.5,0],[.87,-.5,0],[0,-1,0],[-.87,-.5,0],[-.87,.5,0],  // ring
      [0,2,1],                                                              // OH (para)
      [0,-2,1],[0,-3,0],[.87,-3.5,1],[0,-4,0]                             // NH–C(=O)–CH3
    ],[
      {a:0,b:1,double:true},{a:1,b:2},{a:2,b:3,double:true},{a:3,b:4},{a:4,b:5,double:true},{a:5,b:0},
      {a:0,b:6},
      {a:3,b:7},{a:7,b:8},{a:8,b:9,double:true},{a:8,b:10}
    ]);

    // Ibuprofen (2-(4-isobutylphenyl)propanoic acid)
    const ibuprofen = tpl([
      [0,1,0],[.87,.5,0],[.87,-.5,0],[0,-1,0],[-.87,-.5,0],[-.87,.5,0],  // ring
      [0,2,0],[-.87,2.5,0],[0,3,0],[-.87,3.5,1],[.87,3.5,1],              // CH(CH3)–COOH chain (top)
      [0,-2,0],[0,-3,0],[-.87,-3.5,0],[.87,-3.5,0]                        // –CH2–CH(CH3)2 (bottom)
    ],[
      {a:0,b:1},{a:1,b:2,double:true},{a:2,b:3},{a:3,b:4,double:true},{a:4,b:5},{a:5,b:0,double:true},
      {a:0,b:6},{a:6,b:7},{a:6,b:8},{a:8,b:9,double:true},{a:8,b:10},
      {a:3,b:11},{a:11,b:12},{a:12,b:13},{a:12,b:14}
    ]);

    // Aspirin (2-acetoxybenzoic acid)
    const aspirin = tpl([
      [0,0,0],[1,0,0],[1.5,.87,0],[1,1.73,0],[0,1.73,0],[-.5,.87,0],  // ring
      [-.5,-.87,0],[-.5,-1.87,1],[.5,-1.87,1],                         // COOH on C1
      [2,-.87,1],[2.87,-1.37,0],[3.73,-1.37,1],[2.87,-2.23,0]          // O–CO–CH3 on C2
    ],[
      {a:0,b:1,double:true},{a:1,b:2},{a:2,b:3,double:true},{a:3,b:4},{a:4,b:5,double:true},{a:5,b:0},
      {a:0,b:6},{a:6,b:7,double:true},{a:6,b:8},
      {a:1,b:9},{a:9,b:10},{a:10,b:11,double:true},{a:10,b:12}
    ]);

    // Dopamine (3,4-dihydroxyphenethylamine) – catechol + ethylamine
    const dopamine = tpl([
      [0,0,0],[1,0,0],[1.5,.87,0],[1,1.73,0],[0,1.73,0],[-.5,.87,0],  // ring
      [1,2.6,1],[0,2.6,1],                                               // OH OH (catechol)
      [1,-1,0],[1,-2,0],[1,-3,1]                                         // –CH2–CH2–NH2
    ],[
      {a:0,b:1},{a:1,b:2,double:true},{a:2,b:3},{a:3,b:4,double:true},{a:4,b:5},{a:5,b:0,double:true},
      {a:3,b:6},{a:4,b:7},
      {a:1,b:8},{a:8,b:9},{a:9,b:10}
    ]);

    // Adenine (6-aminopurine – DNA/RNA base)
    const adenine = tpl([
      [0,0,1],[1,0,0],[1.5,.87,1],[1,1.73,0],[0,1.73,0],[-.5,.87,0],  // 6-ring (N1 C2 N3 C4 C5 C6)
      [-.3,2.6,1],[.7,2.8,0],[1.4,2.1,1],                               // N7 C8 N9 (5-ring)
      [-1.5,.87,1]                                                        // –NH2 exocyclic
    ],[
      {a:0,b:1},{a:1,b:2},{a:2,b:3},{a:3,b:4},{a:4,b:5},{a:5,b:0},
      {a:4,b:6},{a:6,b:7},{a:7,b:8},{a:8,b:3},
      {a:5,b:9}
    ]);

    // Glycine (simplest amino acid: NH2–CH2–COOH)
    const glycine = tpl([
      [0,0,1],[1,0,0],[2,0,0],[2.5,.87,1],[2.5,-.87,1],[1,-1,0]
    ],[
      {a:0,b:1},{a:1,b:2},{a:2,b:3,double:true},{a:2,b:4},{a:1,b:5}
    ]);

    const templates = [
      benzene,
      caffeine, caffeine,
      acetaminophen, acetaminophen,
      ibuprofen,
      aspirin,
      dopamine, dopamine,
      adenine, adenine,
      glycine, glycine
    ];

    // y is in WORLD space (full page height); x wraps in viewport width
    function makeMol() {
      return {
        x: Math.random() * w,
        y: Math.random() * worldH,
        vx: (Math.random() - 0.5) * 0.13 * dpr,
        vy: (Math.random() - 0.5) * 0.13 * dpr,
        ang: Math.random() * Math.PI * 2,
        va: (Math.random() - 0.5) * 0.004,
        scale: (Math.random() * 9 + 10) * dpr,
        tpl: templates[Math.floor(Math.random() * templates.length)],
        op: Math.random() * 0.14 + 0.14,
        grabbed: false
      };
    }
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = innerWidth * dpr;
      h = canvas.height = innerHeight * dpr;
      worldH = document.body.scrollHeight * dpr;
      canvas.style.width = innerWidth + 'px';
      canvas.style.height = innerHeight + 'px';
    }
    function init() {
      // density grows with sqrt(ratio) so large pages don't get overcrowded
      const ratio = Math.max(1, document.body.scrollHeight / innerHeight);
      const base = innerWidth < 720 ? 10 : 22;
      const count = Math.min(Math.round(base * Math.sqrt(ratio)), base * 3);
      mols = [];
      for (let i = 0; i < count; i++) mols.push(makeMol());
    }

    // ── Mouse / touch interaction ──
    // canvas is pointer-events:none → listen on window, convert to world coords
    let mx = -9999, my = -9999, mdx = 0, mdy = 0;
    let grabbed = null;

    // Screen coords → world coords (account for scroll)
    function toWorld(sx, sy) {
      return { x: sx * dpr, y: sy * dpr + scrollY * dpr };
    }

    function nearestMol(wx, wy, maxR) {
      let best = null, bd = Infinity;
      for (const m of mols) {
        const d = Math.hypot(m.x - wx, m.y - wy);
        if (d < bd && d < maxR) { bd = d; best = m; }
      }
      return best;
    }

    addEventListener('mousemove', e => {
      const p = toWorld(e.clientX, e.clientY);
      mdx = p.x - mx; mdy = p.y - my;
      mx = p.x; my = p.y;
    }, { passive: true });

    addEventListener('mousedown', e => {
      if (e.target.closest('nav,button,a,input,select,textarea,label')) return;
      const p = toWorld(e.clientX, e.clientY);
      mx = p.x; my = p.y;
      const m = nearestMol(mx, my, 75 * dpr);
      if (m) { grabbed = m; m.grabbed = true; document.body.style.cursor = 'grabbing'; }
    });

    addEventListener('mouseup', () => {
      if (grabbed) {
        grabbed.vx = mdx * 0.55; grabbed.vy = mdy * 0.55;
        grabbed.grabbed = false; grabbed = null;
      }
    });

    addEventListener('mouseleave', () => { mx = -9999; my = -9999; });

    addEventListener('touchstart', e => {
      const t = e.touches[0], p = toWorld(t.clientX, t.clientY);
      mx = p.x; my = p.y; mdx = mdy = 0;
      const m = nearestMol(mx, my, 85 * dpr);
      if (m) { grabbed = m; m.grabbed = true; }
    }, { passive: true });

    addEventListener('touchmove', e => {
      if (!grabbed) return;
      const t = e.touches[0], p = toWorld(t.clientX, t.clientY);
      mdx = p.x - mx; mdy = p.y - my;
      mx = p.x; my = p.y;
    }, { passive: true });

    addEventListener('touchend', () => {
      if (grabbed) {
        grabbed.vx = mdx * 0.55; grabbed.vy = mdy * 0.55;
        grabbed.grabbed = false; grabbed = null;
      }
      mx = -9999; my = -9999;
    });

    // Update worldH when page content changes (e.g. accordions, nav)
    new ResizeObserver(() => {
      const nh = document.body.scrollHeight * dpr;
      if (nh !== worldH) { worldH = nh; }
    }).observe(document.body);

    function draw() {
      const scrollOff = scrollY * dpr; // world→screen Y offset
      ctx.clearRect(0, 0, w, h);
      let nearAny = false;
      const pad = 110 * dpr;

      for (const m of mols) {
        if (m.grabbed) {
          // Spring-follow cursor in world space
          m.x += (mx - m.x) * 0.28;
          m.y += (my - m.y) * 0.28;
          m.ang += m.va * 0.4;
        } else {
          // Repulsion from cursor (world coords)
          const dx = m.x - mx, dy = m.y - my, d = Math.hypot(dx, dy) || 1;
          const R = 120 * dpr;
          if (d < R) {
            const f = 0.14 * (1 - d / R) * R / d;
            m.vx += dx * f; m.vy += dy * f;
            // Only highlight if molecule is actually visible on screen
            const sy = m.y - scrollOff;
            if (d < 60 * dpr && sy > -pad && sy < h + pad) nearAny = true;
          }
          m.vx *= 0.965; m.vy *= 0.965;
          const spd = Math.hypot(m.vx, m.vy), MAX = 10 * dpr;
          if (spd > MAX) { m.vx = m.vx / spd * MAX; m.vy = m.vy / spd * MAX; }
          m.x += m.vx; m.y += m.vy;
          m.ang += m.va + spd * 0.004 * Math.sign(m.va || 1);
        }

        // Horizontal wrap (viewport width)
        if (m.x < -pad) m.x = w + pad; else if (m.x > w + pad) m.x = -pad;
        // Vertical wrap (full page height)
        if (m.y < -pad) m.y = worldH + pad; else if (m.y > worldH + pad) m.y = -pad;

        // Project world Y → screen Y
        const sy = m.y - scrollOff;

        // Skip drawing if off-screen
        if (sy < -pad || sy > h + pad) continue;

        const cos = Math.cos(m.ang), sin = Math.sin(m.ang);
        const pts = m.tpl.atoms.map(a => ({
          x: m.x + (a.x * cos - a.y * sin) * m.scale,
          y: sy  + (a.x * sin + a.y * cos) * m.scale,
          hetero: a.hetero
        }));
        const op = m.grabbed ? Math.min(m.op * 1.9, 0.48) : m.op;
        ctx.lineWidth = dpr * (m.grabbed ? 1.7 : 1.2);
        ctx.strokeStyle = rgba(cPrim, op);
        for (const b of m.tpl.bonds) {
          if (b.a >= pts.length || b.b >= pts.length) continue;
          const p = pts[b.a], q = pts[b.b];
          if (b.double) {
            const dx = q.x - p.x, dy = q.y - p.y, len = Math.hypot(dx, dy) || 1;
            const ox = -dy / len * 2.2 * dpr, oy = dx / len * 2.2 * dpr;
            ctx.beginPath(); ctx.moveTo(p.x+ox, p.y+oy); ctx.lineTo(q.x+ox, q.y+oy); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(p.x-ox, p.y-oy); ctx.lineTo(q.x-ox, q.y-oy); ctx.stroke();
          } else {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        for (const p of pts) {
          const col = p.hetero ? cSec : cPrim;
          ctx.fillStyle = rgba(col, Math.min(op * 2.2, 0.55));
          ctx.beginPath(); ctx.arc(p.x, p.y, (p.hetero ? 3.5 : 2.5) * dpr, 0, Math.PI * 2); ctx.fill();
        }
      }
      if (!grabbed) document.body.style.cursor = nearAny ? 'grab' : '';
      requestAnimationFrame(draw);
    }
    resize(); init(); draw();
    addEventListener('resize', () => { resize(); init(); });
    if (themeBtn) themeBtn.addEventListener('click', () => setTimeout(() => {
      cPrim = hexToRgb(cssVar('--primary', '#34d399'));
      cSec = hexToRgb(cssVar('--secondary', '#22d3ee'));
    }, 60));
  })();

