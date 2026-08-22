/* Renderer di Jupyter/Colab notebook (.ipynb) senza dipendenze esterne.
   Copre quello che serve a questi notebook: markdown con un sottoinsieme di
   LaTeX, evidenziazione Python, output testuali, tabelle pandas e immagini PNG.
   Uso:  NB.render(jsonDelNotebook)  ->  stringa HTML  */
window.NB = (function () {

  // sentinella per mettere da parte le formule: fuori dai caratteri stampabili
  const SEN = String.fromCharCode(0xE000);

  const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  /* ═══════════════ LaTeX (sottoinsieme) ═══════════════ */

  const SYM = {
    Delta: 'Δ', Gamma: 'Γ', Lambda: 'Λ', Omega: 'Ω', Phi: 'Φ',
    Pi: 'Π', Psi: 'Ψ', Sigma: 'Σ', Theta: 'Θ',
    alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε',
    zeta: 'ζ', eta: 'η', theta: 'θ', kappa: 'κ', lambda: 'λ',
    mu: 'μ', nu: 'ν', pi: 'π', rho: 'ρ', sigma: 'σ', tau: 'τ',
    phi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω',
    cdot: '·', times: '×', pm: '±', approx: '≈', neq: '≠',
    leq: '≤', geq: '≥', le: '≤', ge: '≥', infty: '∞',
    to: '→', rightarrow: '→', leftarrow: '←', partial: '∂',
    sum: '∑', prod: '∏', int: '∫', propto: '∝', sim: '∼',
    ll: '≪', gg: '≫', circ: '∘', degree: '°', percent: '%'
  };
  const OPS = ['ln', 'log', 'exp', 'sin', 'cos', 'tan', 'min', 'max', 'lim', 'det', 'mod'];
  const IGNORE = ['displaystyle', 'textstyle', 'left', 'right', 'limits', 'nolimits', 'quad', 'qquad'];

  function math(src) {
    let i = 0;
    const s = String(src);

    function group() {                       // legge {...} bilanciato, o un carattere
      while (s[i] === ' ') i++;
      if (s[i] === '{') {
        let d = 0, j = i;
        for (; j < s.length; j++) {
          if (s[j] === '{') d++;
          else if (s[j] === '}') { d--; if (!d) break; }
        }
        const inner = s.slice(i + 1, j);
        i = j + 1;
        return inner;
      }
      if (s[i] === '\\') {                   // un comando conta come gruppo singolo
        const m = /^\\([a-zA-Z]+)/.exec(s.slice(i));
        if (m) { i += m[0].length; return m[0]; }
      }
      const ch = s[i] || ''; i++; return ch;
    }

    let out = '';
    while (i < s.length) {
      const c = s[i];

      if (c === '\\') {
        const m = /^\\([a-zA-Z]+)/.exec(s.slice(i));
        if (!m) { i += 2; continue; }        // \, \! \; ecc: spaziature, le salto
        i += m[0].length;
        while (s[i] === ' ') i++;            // in LaTeX lo spazio dopo una macro separa, non spazia
        const name = m[1];
        if (name === 'frac' || name === 'dfrac' || name === 'tfrac') {
          const a = group(), b = group();
          out += '<span class="m-frac"><span class="m-num">' + math(a)
               + '</span><span class="m-den">' + math(b) + '</span></span>';
        } else if (name === 'sqrt') {
          out += '<span class="m-sqrt">' + math(group()) + '</span>';
        } else if (name === 'text' || name === 'mathrm' || name === 'operatorname') {
          out += '<span class="m-txt">' + esc(group()) + '</span>';
        } else if (SYM[name]) {
          out += SYM[name];
        } else if (OPS.indexOf(name) >= 0) {
          out += '<span class="m-op">' + name + '</span>';
        } else if (IGNORE.indexOf(name) >= 0) {
          /* niente */
        } else {
          out += '<span class="m-txt">' + esc(name) + '</span>';
        }
        continue;
      }

      if (c === '_' || c === '^') {
        i++;
        const g = group();
        out += c === '_' ? '<sub>' + math(g) + '</sub>' : '<sup>' + math(g) + '</sup>';
        continue;
      }

      if (c === '{' || c === '}') { i++; continue; }

      if (/[A-Za-z]/.test(c)) {              // variabili in corsivo
        let j = i;
        while (j < s.length && /[A-Za-z]/.test(s[j])) j++;
        out += '<i>' + esc(s.slice(i, j)) + '</i>';
        i = j;
        continue;
      }

      if (/[=+\-<>]/.test(c)) {              // operatori con respiro attorno
        out += '<span class="m-rel">' + esc(c === '-' ? '−' : c) + '</span>';
        i++;
        continue;
      }

      out += esc(c);
      i++;
    }
    return out;
  }

  /* ═══════════════ Markdown ═══════════════ */

  // Solo questi tag passano come HTML: tutto il resto resta testo.
  const KEEP = ['p', 'br', 'b', 'i', 'em', 'strong', 'u', 'sub', 'sup', 'code', 'small'];
  function keepTags(html) {
    return html.replace(/&lt;(\/?)([a-zA-Z]+)\s*\/?&gt;/g, (all, slash, tag) =>
      KEEP.indexOf(tag.toLowerCase()) >= 0 ? '<' + slash + tag.toLowerCase() + '>' : all);
  }

  function inline(text) {
    const mathBits = [];
    // il math va estratto prima, o gli underscore dei pedici diventano corsivi
    let t = text.replace(/\$([^$]+)\$/g, (all, tex) => {
      mathBits.push(math(tex));
      return SEN + (mathBits.length - 1) + SEN;
    });

    t = keepTags(esc(t));
    t = t.replace(/`([^`]+)`/g, (a, c) => '<code>' + c + '</code>');
    t = t.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g,
      (a, txt, url) => '<a href="' + url + '" target="_blank" rel="noopener">' + txt + '</a>');
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // corsivo solo a confine di parola, così snake_case resta intatto
    t = t.replace(/(^|[\s(])_(\S(?:.*?\S)?)_(?=$|[\s.,;:)])/g, '$1<em>$2</em>');
    t = t.replace(/(^|[\s(])\*(\S(?:.*?\S)?)\*(?=$|[\s.,;:)])/g, '$1<em>$2</em>');

    return t.replace(new RegExp(SEN + '(\\d+)' + SEN, 'g'),
      (a, n) => '<span class="m">' + mathBits[+n] + '</span>');
  }

  function markdown(src) {
    const lines = String(src).replace(/\r/g, '').split('\n');
    let html = '', para = [], list = null, fence = null;

    const flushPara = () => {
      if (!para.length) return;
      const joined = para.join(' ').trim();
      // un paragrafo fatto di sola formula: lo mostro centrato
      const only = /^\$([^$]+)\$$/.exec(joined);
      if (only) html += '<div class="nb-math">' + math(only[1]) + '</div>';
      else if (/^<(?:p|br)\b/i.test(joined)) html += inline(joined);   // ha gia i suoi <p>
      else if (joined) html += '<p>' + inline(joined) + '</p>';
      para = [];
    };
    const flushList = () => { if (list) { html += '</' + list + '>'; list = null; } };
    const flush = () => { flushPara(); flushList(); };

    for (const raw of lines) {
      const line = raw.trimEnd();

      if (fence !== null) {                                  // dentro un blocco ```
        if (/^\s*```/.test(line)) { html += '<pre class="nb-code">' + python(fence.join('\n')) + '</pre>'; fence = null; }
        else fence.push(raw);
        continue;
      }
      if (/^\s*```/.test(line)) { flush(); fence = []; continue; }

      if (!line.trim() || line.trim() === '\\') { flush(); continue; }   // \ da solo = spaziatore Colab
      if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { flush(); html += '<hr>'; continue; }

      const h = /^(#{1,6})\s*(.+)$/.exec(line);
      if (h) {
        flush();
        const lvl = Math.min(h[1].length + 1, 6);            // h1 del notebook -> h2 nella pagina
        html += '<h' + lvl + '>' + inline(h[2].replace(/^\*\*(.*)\*\*$/, '$1')) + '</h' + lvl + '>';
        continue;
      }

      const ul = /^\s*[-*+]\s+(.+)$/.exec(line);
      const ol = /^\s*\d+[.)]\s+(.+)$/.exec(line);
      if (ul || ol) {
        flushPara();
        const want = ul ? 'ul' : 'ol';
        if (list !== want) { flushList(); html += '<' + want + ' class="nb-list">'; list = want; }
        html += '<li>' + inline((ul || ol)[1]) + '</li>';
        continue;
      }

      flushList();
      para.push(line.trim());
    }
    flush();
    if (fence) html += '<pre class="nb-code">' + python(fence.join('\n')) + '</pre>';
    return html;
  }

  /* ═══════════════ Python ═══════════════ */

  const KW = 'False|None|True|and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield';
  const BI = 'abs|all|any|bool|dict|enumerate|filter|float|format|int|isinstance|len|list|map|max|min|open|print|range|round|set|sorted|str|sum|tuple|type|zip';
  const PY = new RegExp(
    '(^[ \\t]*[!%][^\\n]*)'                                   // magic Colab: !ls, %matplotlib
    + '|(#[^\\n]*)'                                           // commento
    + '|("""[\\s\\S]*?"""|\'\'\'[\\s\\S]*?\'\'\'|"(?:\\\\.|[^"\\\\\\n])*"|\'(?:\\\\.|[^\'\\\\\\n])*\')'
    + '|(\\b(?:' + KW + ')\\b)'
    + '|(\\b(?:' + BI + ')\\b)'
    + '|(\\b\\d+\\.?\\d*(?:[eE][+-]?\\d+)?\\b)', 'gm');

  function python(code) {
    let out = '', last = 0;
    String(code).replace(PY, function (m, magic, com, str, kw, bi, num, off) {
      out += esc(String(code).slice(last, off));
      const cls = magic ? 'k-magic' : com ? 'k-com' : str ? 'k-str' : kw ? 'k-kw' : bi ? 'k-bi' : 'k-num';
      out += '<span class="' + cls + '">' + esc(m) + '</span>';
      last = off + m.length;
      return m;
    });
    return out + esc(String(code).slice(last));
  }

  /* ═══════════════ Output delle celle ═══════════════ */

  function safeHtml(html) {                        // le tabelle pandas: tengo il markup, butto stile e script
    return String(html)
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  }

  function outputs(list) {
    let html = '';
    for (const o of list || []) {
      if (o.output_type === 'stream') {
        html += '<pre class="nb-out-txt">' + esc((o.text || []).join('')) + '</pre>';
        continue;
      }
      if (o.output_type === 'error') {
        html += '<pre class="nb-out-txt nb-err">'
              + esc((o.traceback || []).join('\n').replace(/\[[0-9;]*m/g, '')) + '</pre>';
        continue;
      }
      const d = o.data || {};
      if (d['image/png']) {
        const b64 = Array.isArray(d['image/png']) ? d['image/png'].join('') : d['image/png'];
        html += '<div class="nb-fig"><img class="nb-img" loading="lazy" decoding="async" alt="Grafico prodotto dal codice" src="data:image/png;base64,' + b64.replace(/\s+/g, '') + '"></div>';
      } else if (d['text/html']) {
        html += '<div class="nb-out-html">' + safeHtml([].concat(d['text/html']).join('')) + '</div>';
      } else if (d['text/plain']) {
        html += '<pre class="nb-out-txt">' + esc([].concat(d['text/plain']).join('')) + '</pre>';
      }
    }
    return html;
  }

  /* ═══════════════ Notebook ═══════════════ */

  function render(nb) {
    const cells = (nb && nb.cells) || [];
    let html = '';
    for (const c of cells) {
      const src = [].concat(c.source || []).join('');
      if (c.cell_type === 'markdown') {
        if (src.trim()) html += '<div class="nb-md">' + markdown(src) + '</div>';
        continue;
      }
      if (c.cell_type !== 'code') continue;
      const out = outputs(c.outputs);
      if (!src.trim() && !out) continue;
      // Colab salva execution_count solo negli output, non sulla cella
      const n = c.execution_count
              || (c.outputs || []).reduce((a, o) => a || o.execution_count, null);
      html += '<div class="nb-cell">'
            + '<div class="nb-in">'
            + '<span class="nb-prompt">' + (n ? '[' + n + ']' : '') + '</span>'
            + '<pre class="nb-code">' + python(src.replace(/\n+$/, '')) + '</pre>'
            + '</div>'
            + (out ? '<div class="nb-out">' + out + '</div>' : '')
            + '</div>';
    }
    return html;
  }

  return { render: render, markdown: markdown, python: python, math: math };
})();
