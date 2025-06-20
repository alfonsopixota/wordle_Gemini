// service-worker.js

const CACHE_NAME = 'wordle-cache-v1';
const urlsToCache = [
    './', // Ruta raíz de la aplicación
    './index.html',
    './R.jpg', // Tu imagen de fondo
    // Agrega aquí cualquier otro recurso estático que quieras cachear (CSS, JS adicionales, etc.)
];

// Instala el Service Worker y cachea los recursos estáticos
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Cache abierta');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activa el Service Worker y limpia cachés antiguas
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Eliminando caché antigua', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Intercepta las solicitudes de red y sirve desde la caché si está disponible
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si el recurso está en la caché, lo devuelve
                if (response) {
                    return response;
                }
                // Si no está en la caché, lo obtiene de la red
                return fetch(event.request).catch(() => {
                    // Si falla la red, puedes servir una página offline aquí si lo deseas
                    // return caches.match('/offline.html'); // Ejemplo de página offline
                });
            })
    );
});

