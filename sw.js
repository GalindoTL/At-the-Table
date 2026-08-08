const CACHE = "attable-v1";
const ASSETS = [
  "index.html", "manifest.json", "icon-192.png", "icon-512.png",
  "https://cdn.jsdelivr.net/npm/@babel/standalone@7.24.7/babel.min.js",
  "https://esm.sh/react@18.3.1?bundle",
  "https://esm.sh/react-dom@18.3.1/client?bundle",
  "https://esm.sh/lucide-react@0.383.0?bundle&deps=react@18.3.1"
];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => Promise.allSettled(ASSETS.map((u) => c.add(u)))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request).then((resp) => {
      const cp = resp.clone();
      caches.open(CACHE).then((c) => c.put(e.request, cp)).catch(() => {});
      return resp;
    }).catch(() => caches.match("index.html")))
  );
});
