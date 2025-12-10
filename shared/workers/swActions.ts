"use server"
import { setVapidDetails, sendNotification, type PushSubscription } from "web-push"
import db from "../client/db"

setVapidDetails(
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
        ? `https://${process.env.NEXT_PUBLIC_URL}`
        : "https://localhost:3000/",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
)

export async function subscribeUser(sub: PushSubscription) {
    const res = await db.subscriptions.create({
        data: {
            subscription: JSON.stringify(sub),
        },
    })
    return { success: true, subscriptionId: res.id }
}

export async function unsubscribeUser({
    subscriptionId,
}: {
    subscriptionId: number
}) {
    await db.subscriptions.delete({
        where: {
            id: subscriptionId,
        },
    })
    return { success: true }
}

export async function send({
    subscription,
    title,
    message,
}: {
    subscription: PushSubscription
    title: string
    message: string
}) {
    try {
        await sendNotification(
            subscription,
            JSON.stringify({
                title: title,
                body: message,
            }),
        )
        return { success: true }
    } catch (error) {
        console.error("Error sending push notification:", error)
        return { success: false, error: "Failed to send notification" }
    }
}
