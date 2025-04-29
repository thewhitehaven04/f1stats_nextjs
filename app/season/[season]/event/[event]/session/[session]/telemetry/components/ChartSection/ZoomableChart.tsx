"use client"

import { Button } from "@/components/ui/button"
import { useCallback, useRef, type ComponentProps } from "react"
import {
    CategoryScale,
    Legend,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Chart as ChartJS,
    type Chart,
} from "chart.js"
import zoom from "chartjs-plugin-zoom"
import { Chart as BaseChart } from "react-chartjs-2"

ChartJS.register([
    LineController,
    LineElement,
    LinearScale,
    CategoryScale,
    PointElement,
    Tooltip,
    Legend,
    Title,
    zoom,
])

export const ZoomableChart = (props: ComponentProps<typeof BaseChart>) => {
    const ref = useRef<ChartJS>(null)

    const resetZoom = useCallback(() => {
        ref.current?.resetZoom()
    }, [])

    return (
        <div className="flex flex-col">
            <div className="flex flex-row justify-end gap-2">
                <Button variant="outline" size={"sm"} onClick={resetZoom}>
                    Reset
                </Button>
            </div>
            <BaseChart {...props} ref={ref} />
        </div>
    )
}
