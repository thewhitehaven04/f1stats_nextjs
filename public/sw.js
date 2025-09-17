self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json()
        event.waitUntil(self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon || '/notification.png',
            vibrate: [100, 50, 100],

            data: {
                dateOfArrival: Date.now(),
                primaryKey: '2',
            },
        }))
    }
})

self.addEventListener('notificationclick', (event) => {
    event.notification.close()
    event.waitUntil(
        self.clients.openWindow(
            process.env.NEXT_PUBLIC_VERCEL_ENV ? `https://${process.env.NEXT_PUBLIC_URL}` : 'https://localhost:3000/'
        )
    )
})