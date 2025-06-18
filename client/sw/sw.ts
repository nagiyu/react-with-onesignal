/// <reference lib="webworker" />

// サービスワーカーが「push」イベントを受け取ったときの処理
self.addEventListener('push', function (event) {
  const pushEvent = event as PushEvent;
  if (pushEvent.data) {
    const data = pushEvent.data.json();
    const options = {
      body: data.body,
      icon: data.icon || '/ponzu_square.png',
      badge: '/ponzu_square.png',
      vibrate: [100, 50, 100],
    };

    pushEvent.waitUntil(
      (self as unknown as ServiceWorkerGlobalScope).registration.showNotification(data.title, options)
    );
  }
});

// 表示された通知がクリックされたときの処理
self.addEventListener('notificationclick', function (event) {
  const notificationEvent = event as NotificationEvent;
  console.log('通知をクリックしました。')
  notificationEvent.notification.close();
  notificationEvent.waitUntil(
    (self as unknown as ServiceWorkerGlobalScope).clients.openWindow("http://localhost:3000")
  );
});
