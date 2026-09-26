const CACHE_NAME = "corneta-v5";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/script.js",
  "./manifest.json",

  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",

  "./assets/images/turma.png",

  "./assets/audio/atencao.mp3",
  "./assets/audio/sentido.mp3",
  "./assets/audio/ombro-arma.mp3",
  "./assets/audio/apresentar-arma.mp3",
  "./assets/audio/descansar-arma.mp3",
  "./assets/audio/descansar.mp3",

  "./assets/audio/esquerda-volver.mp3",
  "./assets/audio/direita-volver.mp3",
  "./assets/audio/meia-volta-volver.mp3",
  "./assets/audio/voltas-volver.mp3",

  "./assets/audio/oficial-superior.mp3",
  "./assets/audio/oficiais.mp3",
  "./assets/audio/cmt-chefe-diretor.mp3",
  "./assets/audio/sub-comandante.mp3",

  "./assets/audio/ordinario-marche.mp3",
  "./assets/audio/acelerado.mp3",
  "./assets/audio/alvorada.mp3",
  "./assets/audio/silencio.mp3",
  "./assets/audio/continencia-bandeira.mp3",
  "./assets/audio/cobrir.mp3",
  "./assets/audio/firme.mp3",
  "./assets/audio/alto.mp3",
  "./assets/audio/a-vontade.mp3",
  "./assets/audio/olhar-a-direita.mp3",
  "./assets/audio/olhar-frente.mp3",
  "./assets/audio/inicio-expediente.mp3",
  "./assets/audio/termino-expediente.mp3",
  "./assets/audio/avancar-ao-rancho.mp3",
  "./assets/audio/marcar-passo.mp3",
  "./assets/audio/oficial-general.mp3"
];


// ========================================
// INSTALAÇÃO
// ========================================

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))

  );

  // Ativa imediatamente a nova versão
  self.skipWaiting();

});


// ========================================
// ATIVAÇÃO
// ========================================

self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(keys => {

      return Promise.all(

        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))

      );

    }).then(() => {

      // Assume imediatamente todas as páginas abertas
      return self.clients.claim();

    })

  );

});


// ========================================
// REQUISIÇÕES
// ========================================

self.addEventListener("fetch", event => {

  if (event.request.method !== "GET") {
    return;
  }

  const url = new URL(event.request.url);

  // ========================================
  // HTML: SEMPRE BUSCAR A VERSÃO NOVA
  // ========================================

  if (
    event.request.mode === "navigate" ||
    url.pathname.endsWith(".html") ||
    url.pathname === "/"
  ) {

    event.respondWith(

      fetch(event.request, {
        cache: "no-store"
      })
        .then(response => {

          // Guarda a versão mais recente do HTML
          const copy = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, copy);
            });

          return response;

        })
        .catch(() => {

          // Se estiver offline, usa o HTML salvo
          return caches.match(event.request)
            .then(cached => {

              return cached ||
                caches.match("./index.html");

            });

        })

    );

    return;
  }


  // ========================================
  // JS E CSS
  // ========================================

  if (
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css")
  ) {

    event.respondWith(

      fetch(event.request, {
        cache: "no-store"
      })
        .then(response => {

          const copy = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, copy);
            });

          return response;

        })
        .catch(() => {

          return caches.match(event.request);

        })

    );

    return;
  }


  // ========================================
  // ÁUDIOS, IMAGENS E OUTROS
  // ========================================

  event.respondWith(

    caches.match(event.request)
      .then(cached => {

        if (cached) {
          return cached;
        }

        return fetch(event.request)
          .then(response => {

            if (
              !response ||
              response.status !== 200
            ) {
              return response;
            }

            const copy = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, copy);
              });

            return response;

          });

      })

  );

});