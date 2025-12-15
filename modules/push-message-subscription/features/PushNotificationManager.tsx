"use client"
import { useEffect, useState } from "react"
import { LucideTriangleAlert, LucideBell, LucideBellOff } from "lucide-react"
import { send, subscribeUser, unsubscribeUser } from "@/shared/workers/swActions"
import { Button } from "@/uiComponents/button"
import { useQuery } from "@tanstack/react-query"
import { getSubscriptionApiSubscriptionsIdGet } from "@/shared/client/generated"

const LS_SUBSCRIPTION_KEY = "subscriptionId"

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
    const [pushSubscription, setPushSubscription] = useState<PushSubscription | null>(null)
    const [subscriptionId, setSubscriptionId] = useState(
        typeof window !== "undefined"
            ? Number(localStorage.getItem(LS_SUBSCRIPTION_KEY)) || null
            : null,
    )

    useQuery({
        queryKey: ["subcriptions", subscriptionId],
        queryFn: async () => {
            const sub = (
                await getSubscriptionApiSubscriptionsIdGet({
                    path: {
                        id: String(subscriptionId),
                    },
                    throwOnError: true,
                })
            ).data
            setPushSubscription(JSON.parse(sub.subscription))
        },
        enabled: !!subscriptionId,
    })

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
        if (sub) {
            setPushSubscription(sub)
        }
    }

    async function subscribeToPush() {
        const sw = await navigator.serviceWorker.ready
        const sub = await sw.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
        })

        const { subscriptionId } = await subscribeUser(JSON.parse(JSON.stringify(sub)))
        localStorage.setItem(LS_SUBSCRIPTION_KEY, String(subscriptionId))
        setSubscriptionId(Number(subscriptionId))
        setPushSubscription(sub)

        send({
            subscription: {
                endpoint: sub.endpoint,
                keys: {
                    auth: String(sub.getKey("auth")),
                    p256dh: String(sub.getKey("p256dh")),
                },
            },
            title: "F1Stats",
            message:
                "This is a test messsage. If you see this, you've subscribed to push notifications",
        })
    }

    async function unsubscribeFromPush() {
        await pushSubscription?.unsubscribe()
        if (subscriptionId) {
            await unsubscribeUser({
                subscriptionId,
            })
            localStorage.removeItem(LS_SUBSCRIPTION_KEY)
            setPushSubscription(null)
        }
    }

    return (
        <Button
            variant="secondary"
            onClick={!pushSubscription ? subscribeToPush : unsubscribeFromPush}
        >
            {isSupported ? (
                pushSubscription ? (
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
