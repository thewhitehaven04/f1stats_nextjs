"use client"
import { useEffect, useState } from "react"

export const OfflineHeader = () => {
    const [isShown, setIsShown] = useState(false)

    useEffect(() => {
        const turnOnline = () => setIsShown(false)
        const turnOffline = () => setIsShown(true)

        if (window) {
            window.addEventListener("online", turnOnline)
            window.addEventListener("offline", turnOffline)
        }
        return () => {
            window.removeEventListener("online", turnOnline)
            window.removeEventListener("offline", turnOffline)
        }
    }, [])

    console.log('is shown: ', isShown)

    return isShown ? (
        <div className="flex flex-row gap-4 items-center justify-center py-2 bg-red-400">
            You're in offline mode
        </div>
    ) : null
}
