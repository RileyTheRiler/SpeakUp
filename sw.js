const CACHE_NAME = 'speakup-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './styles.css',
    './utils.js',
    './manifest.json',

    // Games
    './games/animals.html', './games/animals.js',
    './games/coloring.html', './games/coloring.js',
    './games/faces.html', './games/faces.js',
    './games/feeding.html', './games/feeding.js',
    './games/hide.html', './games/hide.js',
    './games/orchestra.html', './games/orchestra.js',
    './games/race.html', './games/race.js',
    './games/simon.html', './games/simon.js',
    './games/story.html', './games/story.js',

    // New Pages
    './settings.html', './settings.js',
    './shop.html', './shop.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE).catch(err => {
                    console.warn("Some assets failed to cache, proceeding anyway.", err);
                });
            })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request).catch(() => {
                    // Fallback for offline (e.g., return index.html for navigation requests)
                    if (event.request.mode === 'navigate') {
                        return caches.match('./index.html');
                    }
                });
            })
    );
});
