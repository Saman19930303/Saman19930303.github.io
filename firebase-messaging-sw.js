/* WorkTime Pro - Firebase Messaging Service Worker */

importScripts("https://www.gstatic.com/firebasejs/12.2.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.2.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBcZ7j9pQpdjVkUAh2wGTISd3z0tPN-o-o",
  authDomain: "worktimepro-d4f8c.firebaseapp.com",
  projectId: "worktimepro-d4f8c",
  storageBucket: "worktimepro-d4f8c.firebasestorage.app",
  messagingSenderId: "677592470967",
  appId: "1:677592470967:web:e49b84f3b5b0a059598432"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {

  if (payload.notification) return;

  const data = payload.data || {};

  const mode = data.mode || "ATTENDANCE";
  const staffName = data.staffName || "Staff member";
  const time = data.time || "";

  const title =
    data.title ||
    (mode === "IN"
      ? "WorkTime Pro — Staff IN"
      : mode === "OUT"
      ? "WorkTime Pro — Staff OUT"
      : "WorkTime Pro");

  const body =
    data.body ||
    `${staffName} marked ${mode}${time ? ` at ${time}` : ""}`;

  self.registration.showNotification(title, {
    body: body,

    icon: "/icon-192.png",
    badge: "/icon-192.png",

    tag:
      data.notificationId ||
      `worktime-pro-${Date.now()}`,

    renotify: true,

    data: {
      url: data.url || "/"
    }
  });

});


self.addEventListener("notificationclick", (event) => {

  event.notification.close();

  const targetUrl =
    (event.notification.data &&
      event.notification.data.url) ||
    "/";

  event.waitUntil(

    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true
      })

      .then((windowClients) => {

        for (const client of windowClients) {

          if ("focus" in client) {

            client.navigate(targetUrl);

            return client.focus();
          }

        }

        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }

      })

  );

});
