# Curriculum Damiano Catasta — versione Docker

Sito-curriculum statico (single page) basato su [damianocatasta.site](https://damianocatasta.site/),
ripulito dagli artefatti Cloudflare e impacchettato per il deploy con Docker / Portainer.

## Struttura

```
.
├── Dockerfile            # immagine nginx:alpine che serve il sito
├── nginx.conf            # config nginx (gzip, cache, security headers)
├── docker-compose.yml    # stack pronto per Portainer
├── .dockerignore
└── site/
    ├── index.html        # il curriculum
    └── assets/
        └── avatar.png    # foto profilo
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

Tutto il curriculum è in `site/index.html` (HTML + CSS + JS inline, nessuna dipendenza esterna
a parte i Google Fonts). Per modificare testi, esperienze o contatti basta editare quel file e
rifare il deploy/build dello stack.

## Note

- Nessun dato Cloudflare residuo: l'email è in chiaro come `mailto:` e l'avatar è un file locale.
- Lo sfondo animato a DNA è renderizzato via `<canvas>` in JavaScript puro, nessuna libreria esterna.
