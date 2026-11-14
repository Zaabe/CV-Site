# Curriculum Damiano Catasta — versione Docker

Sito-curriculum statico (single page) basato su [damianocatasta.site](https://damianocatasta.site/),
ripulito dagli artefatti Cloudflare e impacchettato per il deploy con Docker / Portainer.

## Struttura

```
.
├── Dockerfile            # immagine nginx:alpine che serve il sito
├── nginx.conf            # config nginx (gzip, cache, security headers, URL senza .html, 404)
├── docker-compose.yml    # stack pronto per Portainer
├── .dockerignore
└── site/
    ├── index.html        # il curriculum
    ├── projects.html     # i progetti (raggiungibile su /projects)
    ├── 404.html          # risposta agli indirizzi inesistenti
    ├── favicon.svg       # icona del sito
    └── assets/
        ├── site.css      # tema e componenti, condivisi dalle due pagine
        ├── site.js       # tema, nav mobile, timeline, reveal, accordion
        ├── bg.js         # sfondo animato a molecole
        ├── projects.js   # dati dei progetti + viewer delle slide
        ├── notebook.js   # renderer .ipynb (markdown, LaTeX, Python, output)
        ├── avatar-2026.webp   # foto profilo
        ├── CV Damiano Catasta 2026.pdf
        ├── SB_1994185_catasta_elaborato.pdf   # tesi triennale
        └── projects/
            ├── CATASTA_CFC_2025-2026.pdf      # slide originali
            ├── vegfr2-isoxazole/              # slide-01.webp ... slide-38.webp
            └── data-handling/                 # il notebook .ipynb
```

## Deploy su Portainer

### Opzione A — Stack da repository Git (consigliata)
1. Carica questa cartella su un repository Git (GitHub/GitLab/Gitea).
2. In Portainer: **Stacks → Add stack → Repository**.
3. Inserisci l'URL del repo e come *Compose path* metti `docker-compose.yml`.
4. **Deploy the stack**. Portainer fa la build dell'immagine ed avvia il container.

### Opzione B — Stack con editor web
1. In Portainer: **Stacks → Add stack → Web editor**.
2. Incolla il contenuto di `docker-compose.yml`.
3. Nota: con l'editor web serve che i file (`Dockerfile`, `nginx.conf`, `site/`)
   siano già presenti sull'host nella directory dello stack, oppure usa l'Opzione A.

### Opzione C — Immagine già buildata
Se preferisci non far buildare a Portainer:
```bash
docker build -t damianocatasta-cv:latest .
docker run -d --name damianocatasta-cv -p 8080:80 --restart unless-stopped damianocatasta-cv:latest
```

## Accesso

Una volta avviato, il sito è raggiungibile su:

```
http://<ip-del-server>:8080
```

Cambia la porta `8080` nel file `docker-compose.yml` (sezione `ports`) se ti serve diversa.

## Aggiornare i contenuti

- **Testi del curriculum**: `site/index.html`.
- **Stile** (colori, tipografia, componenti): `site/assets/site.css` — è condiviso, quindi una
  modifica si riflette su entrambe le pagine.
- **Progetti**: `site/assets/projects.js`. Ogni progetto è un oggetto dell'array `PROJECTS`;
  per aggiungerne uno con le slide servono l'`id`, il campo
  `slides: { dir: 'assets/projects/<id>', count: N }` e le immagini
  `assets/projects/<id>/slide-01.webp`, `-02`, ... Per un notebook basta invece
  `notebook: { href: 'assets/projects/<id>/nome.ipynb', kernel: 'Jupyter · Python 3' }`:
  viene scaricato e renderizzato al volo, quindi per aggiornarlo basta sostituire il file.
  Un progetto senza `slides` ne' `notebook` mostra solo la scheda testuale con eventuali `docs`.

Nessuna dipendenza esterna a parte i Google Fonts. Dopo le modifiche va rifatto il
build/deploy dello stack.

### Convertire delle slide da PDF a WebP

Le slide vengono servite come immagini, non come PDF incorporato, per restare nello stile del
sito ed essere usabili da mobile. La conversione usata (38 slide → 1,9 MB totali):

```python
import pymupdf                       # pip install pymupdf
doc = pymupdf.open("presentazione.pdf")
for i, page in enumerate(doc, 1):
    zoom = 1500 / page.rect.width    # 1500 px di larghezza
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
    open("slide-%02d.webp" % i, "wb").write(
        pymupdf.Pixmap(pix).pil_tobytes(format="WEBP", quality=80, method=6))
```

## Note

- Nessun dato Cloudflare residuo: l'email è in chiaro come `mailto:` e l'avatar è un file locale.
- Lo sfondo animato a molecole è renderizzato via `<canvas>` in JavaScript puro, nessuna libreria esterna.
- `nginx.conf` risolve gli URL senza estensione (`try_files $uri $uri.html`), quindi `/projects`
  serve `projects.html`; un indirizzo che non esiste risponde 404 con `404.html`.
- Cache: HTML, CSS, JS e PDF si rivalidano a ogni caricamento (`no-cache`, risposte 304), quindi
  un aggiornamento è visibile subito anche a chi ha già visitato il sito. Immagini e slide restano
  in cache 30 giorni: se ne sostituisci una, cambiale nome (come `avatar-2026.webp`).
- Il tema viene scelto da un piccolo script in `<head>` (tema salvato, altrimenti preferenza di
  sistema) prima che la pagina venga disegnata. Lo stesso script mette la classe `js` su `<html>`:
  senza di essa, e in stampa, timeline e competenze restano aperte e leggibili.
- I `.ipynb` sono dichiarati `application/json` con un `default_type` limitato a quella
  location, così vengono gzippati (408 KB -> 272 KB: il grosso sono immagini in base64,
  che comprimono poco). Non usare un blocco `types` a livello server: sostituisce l'intera
  mappa mime di nginx e css/js/html finirebbero come `application/octet-stream`.
- `notebook.js` copre un sottoinsieme di LaTeX (`\frac`, pedici/esponenti, `\sqrt`, lettere
  greche, operatori come `\ln`): abbastanza per questi report, non un motore completo. Se un
  notebook futuro usasse matrici o integrali servirebbe estenderlo.
