const staticWeatherApp = "weather-app-site-v1";
const assets = [
    ".",
    "./index.html",
    "./style.css",
    "./app.js",
    "./images/android-chrome-512x512.png",
    "./images/android-chrome-192x192.png",
    "./images/favicon.ico",
    "./images/favicon-32x32.png",
    "./images/favicon-16x16.png",
    "./images/apple-touch-icon.png"
];

self.addEventListener("install", installEvent => {
    console.log("[Service Worker] Install");
    installEvent.waitUntil(
        caches.open(staticWeatherApp).then(cache => {
            console.log("[Service Worker] Caching all: app shell and content");
            cache.addAll(assets);
        })
    )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
})

