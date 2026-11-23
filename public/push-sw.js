// Dedicated service worker for Web Push (no caching — only notifications).
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (_) {}
  const title = data.title || 'LitLoop';
  const options = {
    body: data.body || '',
    icon: '/purple-tiny-favicon.png',
    badge: '/purple-tiny-favicon.png',
    data: { url: data.url || '/chat/im' },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const path = (event.notification.data && event.notification.data.url) || '/chat/im';
  let url = path;
  try {
    url = new URL(path, self.location.origin).href;
  } catch (_) {}
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      for (const client of windows) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          if ('navigate' in client) {
            try { client.navigate(url); } catch (_) {}
          }
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
      return undefined;
    })
  );
});
