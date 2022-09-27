
// This code executes in its own worker or thread
self.addEventListener("install", event => {
  console.log("Service worker installed");
});
self.addEventListener("activate", event => {
  console.log("Service worker activated");
});

self.addEventListener('push', (event) => {
  let body
  if (event.data) {
    //You can set an original message by passing it on the event.
    body = event.data.text()
  } else {
    body = 'Greeting from Badminstar'
  }

  const options = {
    body: body,
    icon: '/icon/logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  }
  event.waitUntil(
    self.registration.showNotification(
      'Badminstar Notification',
      options
    ))
})

// TODO: ยังไม่ได้ test
self.addEventListener('notificationclick', async (event) => {
  console.log(event)
  if (!event.action) return

  // This always opens a new browser tab,
  // even if the URL happens already open in a tab
  clients.openWindow(event.action)
})
