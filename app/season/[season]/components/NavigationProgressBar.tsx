"use client"

import { Progress } from "@/components/ui/progress"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export const NavigationProgressBar = () => {
    const pathname = usePathname()
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        setTimeout(() => {
            setProgress((progress) => 100)
        }, 1000)
    }, [pathname])

    return (
        <div className="fixed">
            <Progress value={progress} />
        </div>
    )
}
