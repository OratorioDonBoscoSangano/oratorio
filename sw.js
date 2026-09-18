/* Service worker minimo.
   Tiene in cache solo il guscio dell'app (pagina, icone, manifest): i dati
   arrivano sempre dal server, così non si vedono mai informazioni vecchie.
   Cambiando VERSIONE la cache viene rifatta al prossimo avvio. */

const VERSIONE = 'oratorio-v5';
const GUSCIO = ['./', './index.html', './config.js', './manifest.json', './icona-192.png', './icona-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSIONE).then(c => c.addAll(GUSCIO)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(k => Promise.all(k.filter(x => x !== VERSIONE).map(x => caches.delete(x))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Solo le richieste della pagina stessa: le chiamate al server non si toccano.
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.registration.scope)) return;
  e.respondWith(
    fetch(e.request)
      .then(r => {
        const copia = r.clone();
        caches.open(VERSIONE).then(c => c.put(e.request, copia));
        return r;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
