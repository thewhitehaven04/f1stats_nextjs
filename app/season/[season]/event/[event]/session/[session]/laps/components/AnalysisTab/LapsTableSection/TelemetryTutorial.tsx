"use client"
import { useEffect, useState } from "react"

const HAS_COMPLETED_TUTORIAL_KEY = "hasCompletedTelemetryTutorial"

export function LapsTableTelemetryTutorial() {
    const [isTutorialShown, setIsTutorialShown] = useState(false)
    const hasCompletedTutorial =
        typeof window !== "undefined" && !!localStorage.getItem(HAS_COMPLETED_TUTORIAL_KEY)

    useEffect(() => {
        setTimeout(() => {
            setIsTutorialShown(true)
        }, 5000)
    }, [])

    const handleDismiss = () => {
        setIsTutorialShown(false)
        localStorage.setItem(HAS_COMPLETED_TUTORIAL_KEY, "true")
    }

    return !hasCompletedTutorial && isTutorialShown ? (
        <div className="toast toast-start toast-middle cursor-pointer" onClick={handleDismiss}>
            <div className="alert w-[300px] text-wrap shadow-md shadow-gray-400">
                In order to plot telemetry data, select the desired laps from the table and then
                click on the "View telemetry" button
            </div>
        </div>
    ) : null
}
