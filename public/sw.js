self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.notification.body,
      icon:
        data.notification.icon || "/referral-retrieve/practiceroi-favicon.ico",
      badge: "/referral-retrieve/practiceroi-favicon.ico",
      data: data.notification.data,
    };

    event.waitUntil(
      self.registration.showNotification(data.notification.title, options),
    );
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow("/referral-retrieve/");
    }),
  );
});
