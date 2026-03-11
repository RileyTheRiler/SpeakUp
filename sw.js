const CACHE_NAME = 'speakup-v2';
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
    './shop.html', './shop.js',

    // Local assets
    './assets/bee.png',
    './assets/bunny.png',
    './assets/snake.png',
    './assets/lion.png',
    './assets/kitten.png',
    './assets/dog.png',
    './assets/robot_neutral.png',
    './assets/robot_happy.png',
    './assets/robot_sad.png',
    './assets/robot_angry.png',
    './assets/car_outline.png',
    './assets/car_red.png',
    './assets/house_outline.png',
    './assets/house_blue.png',
    './assets/tree_outline.png',
    './assets/tree_green.png'
];

const RUNTIME_CACHE = 'speakup-runtime-v1';
const EXTERNAL_ORIGINS = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://cdnjs.cloudflare.com'
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
    if (event.request.method !== 'GET') return;

    const requestUrl = new URL(event.request.url);
    const isExternalAsset = EXTERNAL_ORIGINS.some(origin => requestUrl.origin === origin);

    if (isExternalAsset) {
        event.respondWith(
            caches.open(RUNTIME_CACHE).then(async cache => {
                const cached = await cache.match(event.request);
                if (cached) return cached;

                const response = await fetch(event.request);
                cache.put(event.request, response.clone());
                return response;
            }).catch(() => caches.match(event.request))
        );
        return;
    }

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
