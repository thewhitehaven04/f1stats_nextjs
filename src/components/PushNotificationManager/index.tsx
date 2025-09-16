'use client'
import {useEffect, useState} from "react";
import {LucideTriangleAlert, LucideBell, LucideBellOff} from "lucide-react";
import {subscribeUser, unsubscribeUser} from "../../../app/swActions";
import {Button} from "../ui/button";

const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

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
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true)
            registerServiceWorker()
        }
    }, [])

    async function registerServiceWorker() {
        const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
            updateViaCache: 'none',
        })
        const sub = await registration.pushManager.getSubscription()
        setSubscription(sub)
    }

    async function subscribeToPush() {
        navigator.serviceWorker.ready.then(async (registration) => {
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
                ),
            })
            setSubscription(sub)
            const serializedSub = JSON.parse(JSON.stringify(sub))
            await subscribeUser(serializedSub)
        })
    }

    async function unsubscribeFromPush() {
        await subscription?.unsubscribe()
        setSubscription(null)
        await unsubscribeUser()
    }

    return (
        <Button variant='ghost' onClick={subscription ? subscribeToPush : unsubscribeFromPush}>
            {isSupported ? (
                subscription ? <LucideBell/> : <LucideBellOff/>
            ) : (
                <LucideTriangleAlert/>
            )}
        </Button>
    )
}