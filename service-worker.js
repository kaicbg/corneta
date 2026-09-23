const CACHE_NAME = "corneta-v2";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/script.js",
  "./manifest.json",

  // Ícones
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",

  // Imagem usada por todos os toques
  "./assets/images/turma.png",

  // Áudios
  //"./assets/audio/atencao.mp3",
  "./assets/audio/sentido.mp3",
  "./assets/audio/ombro-arma.mp3",
  "./assets/audio/apresentar-arma.mp3",
  "./assets/audio/descansar-arma.mp3",
  "./assets/audio/descansar.mp3",
  "./assets/audio/cruzar-arma.mp3",
  "./assets/audio/armar-baioneta.mp3",
  "./assets/audio/desarmar-baioneta.mp3",

  "./assets/audio/esquerda-volver.mp3",
  "./assets/audio/direita-volver.mp3",
  "./assets/audio/meia-volta-volver.mp3",
  "./assets/audio/voltas-volver.mp3",

  "./assets/audio/oficial-superior.mp3",
  "./assets/audio/oficiais.mp3",
  "./assets/audio/subtenente.mp3",
  "./assets/audio/sargento.mp3",
  "./assets/audio/sargenteante.mp3",
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
  "./assets/audio/oficial-general.mp3",
];


// ========================================
// INSTALAÇÃO
// ========================================

self.addEventListener("install", event => {

  event.waitUntil(

    caches
      .open(CACHE_NAME)
      .then(cache => {

        console.log(
          "Salvando arquivos no cache..."
        );

        return cache.addAll(FILES_TO_CACHE);

      })

  );

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

    })

  );

  self.clients.claim();

});


// ========================================
// REQUISIÇÕES
// ========================================

self.addEventListener("fetch", event => {

  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(

    caches.match(event.request).then(cached => {

      // Se estiver no cache, usa o arquivo salvo
      if (cached) {
        return cached;
      }

      // Caso não esteja, tenta buscar na internet
      return fetch(event.request)
        .then(response => {

          if (
            !response ||
            response.status !== 200 ||
            response.type === "opaque"
          ) {
            return response;
          }

          // Salva automaticamente novos arquivos
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
