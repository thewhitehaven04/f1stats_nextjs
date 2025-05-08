"use client"
import { Card, CardContent } from "@/components/ui/card"
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
        <Card className="fixed bottom-8 right-8 max-w-80 cursor-pointer shadow-md" onClick={handleDismiss}>
            <CardContent className="shadow-zinc-200">
                In order to plot telemetry data, select the desired laps from the table and then
                click on the "View telemetry" button
            </CardContent>
        </Card>
    ) : null
}
