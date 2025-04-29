"use client"

import { Button } from "@/components/ui/button"
import type { ComponentProps } from "react"
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

export const ZoomableChart = (props: ComponentProps<typeof BaseChart>) => (
    <div className="flex flex-col">
        <div className="flex flex-row justify-end gap-2">
            <Button variant="outline" size={"sm"}>
                Reset
            </Button>
        </div>
        <BaseChart {...props} />
    </div>
)
