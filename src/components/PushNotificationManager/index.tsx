"use client"
import { useEffect, useState } from "react"
import { LucideTriangleAlert, LucideBell, LucideBellOff } from "lucide-react"
import { send, subscribeUser, unsubscribeUser } from "../../../app/swActions"
import { Button } from "../ui/button"

const urlBase64ToUint8Array = (base64String: string) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

export function PushNotificationManager() {
    const [isSupported, setIsSupported] = useState(false)
    const [subscription, setSubscription] = useState<PushSubscription | null>(null)

    useEffect(() => {
        if ("serviceWorker" in navigator && "PushManager" in window && "Notification" in window) {
            setIsSupported(true)
            registerServiceWorker()
            console.log("Service worker has been registered")
        } else {
            console.warn("Push notifications are unsupported by this user agent")
        }
    }, [])

    async function registerServiceWorker() {
        const registration = await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
            updateViaCache: "none",
        })
        const sub = await registration.pushManager.getSubscription()
        setSubscription(sub)
    }

    async function subscribeToPush() {
        const sw = await navigator.serviceWorker.ready
        const sub = await sw.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
        })
        await subscribeUser(JSON.parse(JSON.stringify(sub)))
        setSubscription(sub)
        send({
            title: "F1Stats",
            message: "You've subscribed to push notifications",
        })
    }

    async function unsubscribeFromPush() {
        send({
            title: "F1Stats",
            message: "You've unsubscribed from push notifications",
        })
        await subscription?.unsubscribe()
        setSubscription(null)
        await unsubscribeUser()
    }

    return (
        <Button variant="secondary" onClick={!subscription ? subscribeToPush : unsubscribeFromPush}>
            {isSupported ? (
                subscription ? (
                    <LucideBell />
                ) : (
                    <LucideBellOff />
                )
            ) : (
                <LucideTriangleAlert />
            )}
        </Button>
    )
}
