/* Service worker minimo.
   Tiene in cache solo il guscio dell'app (pagina, icone, manifest): i dati
   arrivano sempre dal server, così non si vedono mai informazioni vecchie.
   Cambiando VERSIONE la cache viene rifatta al prossimo avvio. */

const VERSIONE = 'oratorio-v6';
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

/* ---------------------------------------------------------------- NOTIFICHE
   I messaggi arrivano come dati, non come notifica già pronta: li mostriamo
   noi, così il testo e il comportamento del tocco restano sotto controllo. */

self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { /* payload non JSON */ }
  const c = d.data || d.notification || d;
  const titolo = c.titolo || c.title || 'Oratorio Don Bosco';
  const corpo = c.corpo || c.body || '';
  e.waitUntil(self.registration.showNotification(titolo, {
    body: corpo,
    icon: './icona-192.png',
    badge: './icona-192.png',
    tag: 'oratorio-' + (c.idData || 'avviso'),
    renotify: true,
    data: { idData: c.idData || '', testo: c.testo || '' }
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const meta = e.notification.data || {};
  const destinazione = new URL('./', self.registration.scope).href;
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(finestre => {
      for (const f of finestre) {
        if (f.url.startsWith(self.registration.scope) && 'focus' in f) {
          f.postMessage({ tipo: 'notifica', idData: meta.idData });
          return f.focus();
        }
      }
      return self.clients.openWindow(destinazione);
    })
  );
});
