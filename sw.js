// Minimal service worker so order-status notifications work on Android,
// and tapping a notification opens the order page.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "./";
  e.waitUntil(
    self.clients.matchAll({ type: "window" }).then((wins) => {
      const open = wins.find((w) => w.url === url);
      return open ? open.focus() : self.clients.openWindow(url);
    })
  );
});
