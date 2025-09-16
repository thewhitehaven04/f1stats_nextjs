import {setVapidDetails, sendNotification, PushSubscription} from "web-push";
import db from "@/client/db";

setVapidDetails(
    '', process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
)

let subscription: PushSubscription | null = null
let subscriptionId: bigint | null = null

export async function subscribeUser(sub: PushSubscription) {
    subscription = sub
    const res = await db.subscriptions.create({
        data: {
            subscription: JSON.stringify(sub)
        }
    })
    subscriptionId = res.id
    return {success: true}
}

export async function unsubscribeUser() {
    subscription = null

    if (subscriptionId) {
        await db.subscriptions.delete({
            where: {
                id: subscriptionId
            }
        })
        return {success: true}
    }
    return {success: false}
}

export async function send({message}: { message: string }) {
    if (!subscription) {
        throw new Error('No subscription available')
    }

    try {
        await sendNotification(
            subscription,
            JSON.stringify({
                title: 'Test Notification',
                body: message,
                icon: 'app/android-chrome-512x512.png',
            })
        )
        return {success: true}
    } catch (error) {
        console.error('Error sending push notification:', error)
        return {success: false, error: 'Failed to send notification'}
    }
}