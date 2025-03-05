const CACHE_NAME = "quicklist-v1"

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/styles.css",
        "/script.js",
        "/assets/icons/logo.svg",
        "/assets/icons/check-box-initial.svg",
        "/assets/icons/check-box-hover.svg",
        "/assets/icons/check-box-checked.svg",
        "/assets/icons/icon delete.svg",
        "/assets/icons/warning-circle-filled.svg",
        "/assets/icons/delete-small.svg",
      ])
    })
  )
  // Força o service worker a assumir o controle imediatamente
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        // Força o service worker a controlar todas as abas abertas
        clients.claim()
      })
  )
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - retorna a resposta do cache
      if (response) {
        return response
      }

      // Clona a requisição porque ela só pode ser usada uma vez
      const fetchRequest = event.request.clone()

      return fetch(fetchRequest).then((response) => {
        // Verifica se recebemos uma resposta válida
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response
        }

        // Clona a resposta porque ela só pode ser usada uma vez
        const responseToCache = response.clone()

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })

        return response
      })
    })
  )
})
