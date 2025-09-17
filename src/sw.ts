import { defaultCache } from "@serwist/next/worker"
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist"
import { Serwist } from "serwist"

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
    }
}

declare const self: ServiceWorkerGlobalScope

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: defaultCache,
})

self.addEventListener("push", (event) => {
    if (event.data) {
        const data = event.data.json()
        event.waitUntil(
            self.registration.showNotification(data.title, {
                body: data.body,
                icon: data.icon || "/public/notification.png",
                vibrate: [100, 50, 100],

                data: {
                    dateOfArrival: Date.now(),
                    primaryKey: "2",
                },
            }),
        )
    }
})

self.addEventListener("notificationclick", (event) => {
    event.notification.close()
    event.waitUntil(
        self.clients.openWindow(
            process.env.NEXT_PUBLIC_VERCEL_ENV
                ? `https://${process.env.NEXT_PUBLIC_URL}`
                : "https://localhost:3000/",
        ),
    )
})

serwist.addEventListeners()
