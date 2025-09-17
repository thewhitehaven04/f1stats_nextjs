"use client"
import { LucideWifiOff } from "lucide-react"
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

    return isShown ? (
        <div className="flex flex-row gap-4 items-center justify-center py-2 opacity-100 z-50">
            <LucideWifiOff />
            You're in offline mode
        </div>
    ) : null
}
