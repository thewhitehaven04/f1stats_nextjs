self.addEventListener('push', function (event) {
    if (event.data) {
        const data = event.data.json()
        event.waitUntil(self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon || '/icon.png',
            badge: '/badge.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: '2',
            },
        }))
    }
})

self.addEventListener('notificationclick', function (event) {
    console.log('Notification click received.')
    event.notification.close()
    event.waitUntil(clients.openWindow('<https://your-website.com>'))
})