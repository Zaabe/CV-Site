/* Pagina progetti: dati dei progetti + viewer delle slide.
   Per aggiungere un progetto basta un oggetto in PROJECTS; se ha slide,
   mettere le immagini in assets/projects/<id>/slide-01.webp, -02, ... */
(function () {
  const PROJECTS = [
    {
      id: 'vegfr2-isoxazole',
      icon: '\u{1F9EC}',
      kind: 'computazionale',
      kindLabel: 'Computazionale',
      title: 'Rational Drug Discovery for Isoxazole Based VEGFR2 Inhibition',
      org: 'Chimica Farmaceutica Computazionale · Sapienza Università di Roma',
      period: 'A.A. 2025–2026',
      summary: 'Esame a progetto su una serie di inibitori di VEGFR-2 a nucleo isossazolico: '
             + 'dal dataset di letteratura al binding mode, passando per QSAR 2D, 3D-QSAR e docking molecolare.',
      tags: ['MLR-QSAR', '3D-QSAR', 'Docking', 'PLANTS', 'PaDELPy', 'VEGFR-2'],
      body: 'Il progetto parte da un dataset di inibitori di <strong>VEGFR-2</strong> a nucleo '
          + '<strong>isossazolico</strong>, diviso in quattro gruppi (carbossamidi, uree, idrazoni con '
          + 'ossoindolo e idrazoni con indolo) con IC50 misurate su fosforilazione cellulare. '
          + 'L’obiettivo era costruire un modello predittivo dell’attività e ricostruire la '
          + '<span class="hl">modalità di legame</span> al recettore, confrontando i risultati con '
          + 'quelli riportati in letteratura.',
      highlights: [
        'Profilo farmacocinetico predetto: nessuna violazione di Lipinski e Veber, buon assorbimento '
          + 'gastrointestinale, scarsa permeabilità alla barriera ematoencefalica.',
        'MLR-QSAR con PaDELPy, cross-validation Leave-One-Out e test set al 45%, su cinque descrittori '
          + '(AATSC8s, nAtomLC, VR1Dzi, minHBint6, MATS5m).',
        '3D-QSAR ligand based con Py-ConfSearch, Py-Align e Py-CoMFA: R² alto ma Q² basso, '
          + 'quindi overfitting, affrontato con ottimizzazione dei parametri (VPO).',
        'Docking sulla struttura cocristallizzata 3WZE (ligando Sorafenib, 1.9 Å) con PLANTS e '
          + 'scoring function PLP95.',
        'Binding mode: legami idrogeno con GLU885 e ASP1046 sul linker ammidico, contatti sterici della '
          + 'porzione arilica con VAL898 e le isoleucine limitrofe, più CYS919 individuato da ComBinE.',
        'Conclusione: il docking riproduce le interazioni descritte nel paper, mentre i risultati QSAR '
          + 'dell’articolo scelto risultano incoerenti, probabilmente per un errore nella trascrizione '
          + 'delle strutture del dataset.'
      ],
      slides: { dir: 'assets/projects/vegfr2-isoxazole', count: 38 },
      docs: [{ label: 'Slide complete (PDF)', href: 'assets/projects/CATASTA_CFC_2025-2026.pdf' }]
    },
    {
      id: 'denaturazione-wt-mut',
      icon: '\u{1F4C8}',
      kind: 'dati',
      kindLabel: 'Data analysis',
      title: 'Denaturazione proteica wild-type vs mutante: dalla fluorescenza al \u0394G',
      org: 'Progetto di Data Handling, Prof. Allegra Via \u00b7 Sapienza Universit\u00e0 di Roma',
      period: 'A.A. 2024\u20132025',
      summary: 'Report di analisi dati in Python sul dataset di destabilizzazione proteica: '
             + 'curve di denaturazione, conversione in energia libera e statistica inferenziale.',
      tags: ['Python', 'pandas', 'NumPy', 'matplotlib', 'Statistica'],
      body: 'Analisi del <strong>dataset di destabilizzazione</strong> di Prof. Carlo Travaglini '
          + 'Allocatelli, che confronta la denaturazione da urea di una proteina '
          + '<strong>wild-type</strong> e del suo <strong>mutante</strong> misurata in intensit\u00e0 '
          + 'di fluorescenza. Il percorso segue i nove passi del corso: dalla domanda scientifica '
          + 'alla pulizia dei dati, fino alla conversione del segnale grezzo in '
          + '<span class="hl">energia libera \u0394G</span> e alla statistica inferenziale.',
      highlights: [
        'Il wild-type raggiunge il 50% di denaturazione a urea pi\u00f9 alta del mutante '
          + '(3\u20133,3 M contro 1,8\u20132,1 M): il mutante \u00e8 meno stabile.',
        'La conversione della fluorescenza in \u0394G conferma il risultato: valori e pendenza '
          + 'del mutante sono pi\u00f9 bassi, quindi \u00e8 meno stabile anche in termini di energia.',
        'Le derivate delle due curve sono a campana e quasi sovrapponibili, tranne per la '
          + 'posizione del picco: la struttura terziaria si \u00e8 conservata nella mutazione.',
        'Deviazione standard e SEM danno un\u2019incertezza del 10\u201316%, accettabile per dati '
          + 'biologici e sufficiente a riusare i risultati.'
      ],
      note: 'Impianto termodinamico ed equazioni di riferimento (K = (Y<sub>F</sub> \u2212 Y) / '
          + '(Y \u2212 Y<sub>U</sub>), \u0394G = \u2212RT ln K, metodo di estrapolazione lineare) da '
          + '<em>An introduction to the study of the thermodynamic stability and folding mechanism '
          + 'of proteins</em>, Carlo Travaglini Allocatelli, Dip. di Scienze Biochimiche, Sapienza.',
      notebook: {
        href: 'assets/projects/data-handling/damiano_catasta_data_handling_project.ipynb',
        kernel: 'Jupyter \u00b7 Python 3',
        // misurati dal file: servono a stimare il tempo di lettura nella scheda
        // senza doverlo scaricare (67 celle, 4 grafici)
        weight: { words: 1376, codeLines: 172, outLines: 90, figures: 4 }
      },
      docs: [{ label: 'Notebook (.ipynb)', href: 'assets/projects/data-handling/damiano_catasta_data_handling_project.ipynb' }]
    },
    {
      id: 'tesi-cbd-fkbp5',
      icon: '\u{1F9EA}',
      kind: 'tesi',
      kindLabel: 'Tesi',
      title: 'Cannabidiolo nel dolore neuropatico: effetti sulla proteina FKBP5',
      org: 'Tesi di laurea in Farmacologia · Scienze Biologiche, Sapienza',
      period: 'Gennaio 2025',
      summary: 'Tesi triennale sull’utilizzo del cannabidiolo nel trattamento del dolore neuropatico, '
             + 'con analisi degli effetti sulla proteina FKBP5.',
      tags: ['Farmacologia', 'Cannabidiolo', 'FKBP5', 'Dolore neuropatico'],
      body: 'Elaborato finale del corso di laurea in Scienze Biologiche, in ambito '
          + '<strong>farmacologico</strong>: utilizzo del <strong>cannabidiolo</strong> nel trattamento '
          + 'del <span class="hl">dolore neuropatico</span>, con analisi degli effetti sulla proteina '
          + '<strong>FKBP5</strong>. Il testo completo dell’elaborato è disponibile in PDF.',
      docs: [{ label: 'Elaborato completo (PDF)', href: 'assets/SB_1994185_catasta_elaborato.pdf' }]
    },
    {
      id: 'pdia3-inibitori',
      icon: '\u{1F52C}',
      kind: 'laboratorio',
      kindLabel: 'Laboratorio',
      title: 'Inibitori della proteina PDIA3',
      org: 'Laboratorio di Biochimica, Prof. F. Altieri · Sapienza',
      period: 'Novembre 2025 · 44 ore',
      summary: 'Tirocinio in laboratorio farmaco-biologico sullo studio di inibitori di PDIA3, '
             + 'con caratterizzazione dell’interazione ligando-proteina.',
      tags: ['PDIA3', 'Saggi enzimatici', 'Spettrofluorimetria', 'IC50'],
      body: '<strong>Il bersaglio.</strong> La <strong>PDIA3</strong> \u00e8 una '
          + 'disolfuro-isomerasi che possiede anche attivit\u00e0 di ossido-reduttasi. Nel reticolo '
          + 'endoplasmatico di molti tipi cellulari coadiuva i processi di <em>folding</em> delle '
          + 'proteine, ma diversi studi l\u2019hanno trovata '
          + '<span class="hl">sovraespressa nei pazienti con glioblastoma</span>: pu\u00f2 quindi '
          + 'servire sia come bersaglio farmacologico sia come biomarcatore.'
          + '<br><br>'
          + '<strong>Da dove parte il lavoro.</strong> Lo stesso laboratorio aveva gi\u00e0 mostrato '
          + 'che la <strong>punicalagina</strong>, un estratto della buccia del melograno, inibisce '
          + 'PDIA3. Non essendo per\u00f2 una molecola selettiva e presentando criticit\u00e0 legate '
          + 'alla propria struttura, il gruppo ha sintetizzato una serie di <strong>analoghi</strong>. '
          + 'Il mio tirocinio di 44 ore \u00e8 stato dedicato a verificarne '
          + '<span class="hl">potenza inibitoria</span> e <span class="hl">affinit\u00e0</span> '
          + 'con due saggi indipendenti che, misurando grandezze diverse, permettono di '
          + 'controllarsi a vicenda.',
      highlights: [
        '<strong>Saggio dell\u2019insulina - il principio.</strong> Si sfrutta l\u2019attivit\u00e0 '
          + 'reduttasica di PDIA3, che rompe i ponti disolfuro tra la catena pesante e la catena '
          + 'leggera dell\u2019insulina. Tagliato il ponte, la catena leggera resta in soluzione '
          + 'mentre quella pesante precipita, e la soluzione si intorbida: la torbidit\u00e0 diventa '
          + 'quindi una misura indiretta di quanto l\u2019enzima sta lavorando.',
        '<strong>Come si legge il risultato.</strong> La torbidit\u00e0 viene quantificata con un '
          + 'lettore Appliskan su una scala di concentrazioni decrescenti di inibitore: alla '
          + 'concentrazione minima l\u2019analogo non interferisce con PDIA3, mentre salendo la '
          + 'inibisce progressivamente. Se la molecola \u00e8 attiva la torbidit\u00e0 cala '
          + 'all\u2019aumentare della concentrazione, e dalla curva si ricava la <strong>IC50</strong>.',
        '<strong>Quenching di fluorescenza - il principio.</strong> PDIA3 emette fluorescenza a '
          + '338 nm grazie ai residui di <strong>triptofano</strong> presenti nel sito attivo. '
          + 'Aggiungendo concentrazioni crescenti di inibitore a volume costante, fino a 5 \u03bcM, '
          + 'l\u2019emissione viene progressivamente smorzata: il calo racconta che la molecola si '
          + 'sta legando proprio dove l\u2019enzima lavora.',
        '<strong>Dallo smorzamento all\u2019affinit\u00e0.</strong> Applicando l\u2019equazione di '
          + '<strong>Stern-Volmer</strong> ai dati di quenching si ricava la costante di '
          + 'dissociazione <strong>Kd</strong>, e da questa l\u2019affinit\u00e0 dell\u2019analogo '
          + 'per PDIA3.',
        '<strong>Il senso dei due saggi insieme.</strong> Gli analoghi risultati pi\u00f9 potenti nel '
          + 'saggio dell\u2019insulina si sono rivelati anche quelli con affinit\u00e0 maggiore nel '
          + 'quenching. Potenza e legame concordano, il che rende il risultato solido: '
          + 'l\u2019inibizione osservata \u00e8 reale e non un artefatto di un singolo metodo.'
      ]
    }
  ];

  const FILTERS = [
    { key: 'all', label: 'Tutti' },
    { key: 'computazionale', label: 'Computazionale' },
    { key: 'dati', label: 'Data analysis' },
    { key: 'laboratorio', label: 'Laboratorio' },
    { key: 'tesi', label: 'Tesi' }
  ];

  const ICONS = {
    slides: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
    org: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 18l-6-6 6-6"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 6l6 6-6 6"/></svg>',
    full: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M16 21h3a2 2 0 0 0 2-2v-3M8 21H5a2 2 0 0 1-2-2v-3"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
    nb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l4-6-4-6M8 6l-4 6 4 6"/></svg>',
    dl: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>'
  };

  const grid = document.getElementById('projGrid');
  const filterRow = document.getElementById('projFilters');
  const listView = document.getElementById('listView');
  const detail = document.getElementById('projDetail');
  if (!grid || !detail) return;

  const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  /* Tempo di lettura. La prosa a 200 parole/min; slide, righe di codice, righe
     di output e grafici si scorrono, quindi hanno un costo a pezzo. Calcolato
     dal contenuto a ogni render, cosi' resta giusto se i testi cambiano. */
  const READ = { wpm: 200, slide: 12, codeLine: 2.5, outLine: 1, figure: 8 };

  function words(html) {
    const t = String(html || '').replace(/<[^>]+>/g, ' ').trim();
    return t ? t.split(/\s+/).length : 0;
  }

  function readingMinutes(p) {
    let n = words(p.summary) + words(p.body) + words(p.note)
          + (p.highlights || []).reduce((a, h) => a + words(h), 0);
    let sec = n / READ.wpm * 60;
    if (p.slides) sec += p.slides.count * READ.slide;
    const w = p.notebook && p.notebook.weight;
    if (w) {
      sec += (w.words || 0) / READ.wpm * 60
           + (w.codeLines || 0) * READ.codeLine
           + (w.outLines || 0) * READ.outLine
           + (w.figures || 0) * READ.figure;
    }
    return Math.max(1, Math.round(sec / 60));
  }
  const slidePath = (p, i) => p.slides.dir + '/slide-' + String(i + 1).padStart(2, '0') + '.webp';

  /* ── elenco ─────────────────────────────────────────────────────────── */
  let active = 'all';

  function renderFilters() {
    filterRow.innerHTML = FILTERS.map(f => {
      const n = f.key === 'all' ? PROJECTS.length : PROJECTS.filter(p => p.kind === f.key).length;
      if (!n) return '';
      return '<button class="filter' + (f.key === active ? ' on' : '') + '" data-k="' + f.key
           + '" aria-pressed="' + (f.key === active) + '">'
           + esc(f.label) + ' · ' + n + '</button>';
    }).join('');
    filterRow.querySelectorAll('.filter').forEach(b => {
      b.addEventListener('click', () => { active = b.dataset.k; renderFilters(); renderGrid(); });
    });
  }

  function renderGrid() {
    const items = PROJECTS.filter(p => active === 'all' || p.kind === active);
    if (!items.length) {
      grid.innerHTML = '<div class="proj-empty">Nessun progetto in questa categoria.</div>';
      return;
    }
    grid.innerHTML = items.map(p => {
      const badge = p.slides
        ? '<span class="proj-count">' + ICONS.slides + p.slides.count + ' slide</span>'
        : p.notebook ? '<span class="proj-count">' + ICONS.nb + 'notebook</span>'
        : (p.docs ? '<span class="proj-count">' + ICONS.doc + 'PDF</span>' : '');
      // Un link e non un pulsante: e' una navigazione, e cosi' la scheda si
      // apre anche in una nuova scheda o con il tasto centrale.
      return '<a class="proj-card" href="#' + p.id + '" data-id="' + p.id + '">'
           + '<div class="proj-top"><div class="proj-ic">' + p.icon + '</div>'
           + '<div><div class="proj-kind">' + esc(p.kindLabel)
           + (p.period ? ' \u00b7 ' + esc(p.period) : '') + '</div>'
           + '<div class="proj-title">' + esc(p.title) + '</div>'
           + '<div class="proj-org">' + esc(p.org) + '</div></div></div>'
           + '<p class="proj-sum">' + esc(p.summary) + '</p>'
           + '<div class="tags">' + p.tags.map(t => '<span class="tag">' + esc(t) + '</span>').join('') + '</div>'
           + '<div class="proj-foot"><span class="proj-info">' + badge
           + '<span class="proj-count">' + ICONS.clock + readingMinutes(p) + ' min</span></span>'
           + '<span class="proj-open">apri <span class="ar">→</span></span></div>'
           + '</a>';
    }).join('');
  }

  /* ── dettaglio ──────────────────────────────────────────────────────── */
  let viewer = null;   // stato del viewer aperto

  function renderDetail(p) {
    const docs = (p.docs || []).map(d =>
      '<a class="btn btn-ghost" href="' + d.href + '" target="_blank" rel="noopener">'
      + ICONS.dl + esc(d.label) + '</a>').join('');

    const keys = p.highlights
      ? '<ul class="key-list">' + p.highlights.map(h => '<li>' + h + '</li>').join('') + '</ul>'
      : '';

    const view = p.slides ? ''
      + '<div class="viewer">'
      + '  <div class="stage" id="stage">'
      + '    <img id="slideImg" alt="">'
      + '    <button class="vnav prev" id="vPrev" aria-label="Slide precedente">' + ICONS.prev + '</button>'
      + '    <button class="vnav next" id="vNext" aria-label="Slide successiva">' + ICONS.next + '</button>'
      + '    <span class="vfull-count" id="vFullCount" aria-hidden="true"></span>'
      + '    <button class="vclose" id="vClose" aria-label="Esci dallo schermo intero">' + ICONS.close + '</button>'
      + '  </div>'
      + '  <div class="vbar">'
      + '    <span class="vcount"><b id="vNow">1</b> / ' + p.slides.count + '</span>'
      + '    <span class="vprog"><i id="vProg"></i></span>'
      + '    <button class="vbtn" id="vFull">' + ICONS.full + 'schermo intero</button>'
      + '  </div>'
      + '  <div class="thumbs" id="thumbs"></div>'
      + '</div>' : '';

    const nbBlock = p.notebook ? ''
      + '<div class="nb-wrap">'
      + '  <div class="nb-toolbar">'
      + '    <span class="nb-kernel">' + esc(p.notebook.kernel || 'Jupyter notebook') + '</span>'
      + '    <button class="vbtn" id="nbToggle">' + ICONS.nb + 'nascondi il codice</button>'
      + '    <a class="vbtn" href="' + p.notebook.href + '" download>' + ICONS.dl + 'scarica .ipynb</a>'
      + '  </div>'
      + '  <div class="nb-body" id="nbBody"><span class="nb-loading">caricamento del notebook\u2026</span></div>'
      + '</div>' : '';

    detail.innerHTML = ''
      + '<button class="back" id="backBtn"><span class="ar">←</span> tutti i progetti</button>'
      + '<div class="proj-kind">' + esc(p.kindLabel) + '</div>'
      + '<h2>' + esc(p.title) + '</h2>'
      + '<div class="detail-meta">'
      + '  <span>' + ICONS.org + esc(p.org) + '</span>'
      + (p.period ? '  <span>' + ICONS.cal + esc(p.period) + '</span>' : '')
      + '  <span>' + ICONS.clock + readingMinutes(p) + ' min di lettura</span>'
      + '</div>'
      + '<div class="detail-body">' + p.body + keys
      + (p.note ? '<p class="detail-note">' + p.note + '</p>' : '')
      + (docs ? '<div class="doc-row">' + docs + '</div>' : '') + '</div>'
      + view + nbBlock;

    detail.querySelector('#backBtn').addEventListener('click', goList);
    if (p.slides) initViewer(p);
    if (p.notebook) initNotebook(p);
  }

  /* ── notebook ───────────────────────────────────────────────────────── */
  function initNotebook(p) {
    const body = detail.querySelector('#nbBody');
    const toggle = detail.querySelector('#nbToggle');

    toggle.addEventListener('click', () => {
      const hidden = body.classList.toggle('hide-code');
      toggle.innerHTML = ICONS.nb + (hidden ? 'mostra il codice' : 'nascondi il codice');
    });

    fetch(p.notebook.href)
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(json => {
        if (!window.NB) throw new Error('renderer assente');
        body.innerHTML = NB.render(json);
      })
      .catch(() => {
        body.innerHTML = '<p class="nb-loading">Non riesco a mostrare il notebook qui. '
                       + 'Puoi scaricarlo con il pulsante sopra.</p>';
      });
  }

  /* ── viewer slide ───────────────────────────────────────────────────── */
  function initViewer(p) {
    const img = detail.querySelector('#slideImg');
    const stage = detail.querySelector('#stage');
    const prev = detail.querySelector('#vPrev');
    const next = detail.querySelector('#vNext');
    const now = detail.querySelector('#vNow');
    const prog = detail.querySelector('#vProg');
    const thumbs = detail.querySelector('#thumbs');
    const n = p.slides.count;
    let i = 0;

    thumbs.innerHTML = Array.from({ length: n }, (_, k) =>
      '<button class="thumb" data-i="' + k + '" aria-label="Slide ' + (k + 1) + '">'
      + '<img src="' + slidePath(p, k) + '" alt="" loading="lazy" decoding="async"></button>').join('');
    const thumbEls = [...thumbs.querySelectorAll('.thumb')];
    thumbEls.forEach(t => t.addEventListener('click', () => show(+t.dataset.i)));

    function preload(k) {
      if (k < 0 || k >= n) return;
      const im = new Image();
      im.src = slidePath(p, k);
    }
    function show(k) {
      i = Math.max(0, Math.min(n - 1, k));
      img.src = slidePath(p, i);
      img.alt = 'Slide ' + (i + 1) + ' di ' + n + ' - ' + p.title;
      now.textContent = i + 1;
      fullCount.textContent = (i + 1) + ' / ' + n;
      prog.style.width = ((i + 1) / n * 100) + '%';
      prev.disabled = i === 0;
      next.disabled = i === n - 1;
      thumbEls.forEach((t, k2) => t.classList.toggle('on', k2 === i));
      const t = thumbEls[i];
      if (t) thumbs.scrollTo({ left: t.offsetLeft - thumbs.clientWidth / 2 + t.clientWidth / 2, behavior: 'smooth' });
      preload(i + 1); preload(i - 1);
    }

    prev.addEventListener('click', () => show(i - 1));
    next.addEventListener('click', () => show(i + 1));
    // Schermo intero in due strati. Il primo e' CSS: lo stage si allarga a
    // tutta la finestra, e funziona ovunque. Il secondo e' l'API del browser,
    // che toglie anche le barre, ma non sempre c'e' (su iPhone manca) e puo'
    // essere rifiutata (pagine incorporate, anteprime): prima il pulsante si
    // affidava solo a quella e, dove mancava, non succedeva nulla.
    const fullBtn = detail.querySelector('#vFull');
    const closeBtn = detail.querySelector('#vClose');
    const fullCount = detail.querySelector('#vFullCount');
    const enterNative = stage.requestFullscreen || stage.webkitRequestFullscreen;
    let full = false;

    function setFull(on) {
      if (full === on) return;
      full = on;
      stage.classList.toggle('full', on);
      document.documentElement.classList.toggle('viewer-full', on);
      if (on) {
        if (enterNative) {
          try {
            const req = enterNative.call(stage);
            if (req && req.catch) req.catch(() => {});   // rifiutata: resta lo strato CSS
          } catch (e) {}
        }
        closeBtn.focus({ preventScroll: true });
      } else {
        if (fullscreenEl()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
        fullBtn.focus({ preventScroll: true });
      }
    }
    fullBtn.addEventListener('click', () => setFull(true));
    closeBtn.addEventListener('click', () => setFull(false));

    // Su un telefono in verticale la slide a schermo intero viene ruotata di
    // 90 gradi per usare tutto lo schermo (lo fa il CSS): lo swipe allora
    // segue il lato lungo, cioe' l'asse verticale.
    const sideways = matchMedia('(orientation: portrait) and (max-width: 720px)');
    let x0 = null, y0 = null;
    stage.addEventListener('touchstart', e => {
      // due dita sono uno zoom, non uno swipe
      if (e.touches.length > 1) { x0 = null; return; }
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive: true });
    stage.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      // con la pagina ingrandita il trascinamento serve a spostarsi nella slide
      if (window.visualViewport && visualViewport.scale > 1.01) return;
      const turned = full && sideways.matches;
      const along = turned ? dy : dx, across = turned ? dx : dy;
      // conta solo un gesto deciso lungo l'asse giusto: uno scorrimento della
      // pagina appena storto non deve cambiare slide
      if (Math.abs(along) > 45 && Math.abs(along) > Math.abs(across)) show(i + (along < 0 ? 1 : -1));
    }, { passive: true });

    viewer = { show: show, get i() { return i; }, n: n, setFull: setFull, get full() { return full; } };
    show(0);
  }

  /* ── routing con hash ───────────────────────────────────────────────── */
  const fullscreenEl = () => document.fullscreenElement || document.webkitFullscreenElement;

  let listScroll = 0;      // dov'era l'elenco quando si e' aperto un progetto
  let lastOpened = null;   // per restituire il focus alla scheda giusta
  let firstRoute = true;

  // Conta l'apertura di un progetto come pagina vista. Il cambio di hash non
  // e' una navigazione per lo script di statistiche, quindi va detto a mano.
  // Al primo caricamento la pagina e' gia' stata contata.
  function track(p) {
    try {
      if (window.umami && typeof umami.track === 'function') {
        const url = location.pathname + '#' + p.id;
        umami.track(props => Object.assign({}, props, { url: url, title: document.title }));
      }
    } catch (e) {}
  }

  // pushState e non location.hash = '': quello lasciava un "#" appeso all'URL.
  function goList() {
    history.pushState(null, '', location.pathname + location.search);
    route();
  }

  // Uscendo dallo schermo intero del browser (Esc, gesto di sistema) si
  // chiude anche lo strato CSS, altrimenti resterebbe la slide a tutta finestra.
  ['fullscreenchange', 'webkitfullscreenchange'].forEach(ev => {
    document.addEventListener(ev, () => {
      if (viewer && viewer.full && !fullscreenEl()) viewer.setFull(false);
    });
  });

  function route() {
    if (viewer && viewer.full) viewer.setFull(false);
    const id = location.hash.replace(/^#/, '');
    const p = PROJECTS.find(x => x.id === id);
    const wasOpen = detail.classList.contains('on');
    if (p) {
      if (!wasOpen) listScroll = scrollY;
      lastOpened = p.id;
      renderDetail(p);
      detail.classList.add('on');
      listView.style.display = 'none';
      document.title = p.title + ' - Damiano Catasta';
      // 'instant': con 'auto' vale lo scroll-behavior del CSS, che e' smooth
      window.scrollTo({ top: 0, behavior: 'instant' });
      // il contenuto e' cambiato sotto il cursore: il focus va sul nuovo
      // titolo, altrimenti resta sul pulsante appena rimosso e si perde
      const h = detail.querySelector('h2');
      if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
      if (!firstRoute) track(p);
    } else {
      viewer = null;
      detail.classList.remove('on');
      detail.innerHTML = '';
      listView.style.display = '';
      document.title = 'Progetti - Damiano Catasta';
      if (wasOpen) {
        window.scrollTo({ top: listScroll, behavior: 'instant' });
        const card = lastOpened && grid.querySelector('[data-id="' + lastOpened + '"]');
        if (card) card.focus({ preventScroll: true });
      }
    }
    firstRoute = false;
  }

  // Solo le frecce: Home e Fine restano alla pagina, che su un progetto lungo
  // servono per scorrere.
  addEventListener('keydown', e => {
    if (viewer) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); viewer.show(viewer.i - 1); return; }
      if (e.key === 'ArrowRight') { e.preventDefault(); viewer.show(viewer.i + 1); return; }
    }
    if (e.key !== 'Escape') return;
    // il primo Esc chiude lo schermo intero, il secondo torna all'elenco
    if (viewer && viewer.full) { viewer.setFull(false); return; }
    if (!fullscreenEl() && location.hash) goList();
  });

  addEventListener('hashchange', route);
  renderFilters();
  renderGrid();
  route();
})();
