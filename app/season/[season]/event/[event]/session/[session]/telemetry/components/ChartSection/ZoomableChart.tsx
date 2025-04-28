'use client'

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
} from "chart.js"
import zoom from "chartjs-plugin-zoom"
import { Chart as BaseChart } from "react-chartjs-2"

export const ZoomableChart = (props: ComponentProps<typeof BaseChart>) => {
    return (
        <div className="flex flex-col">
            <div className="flex flex-row justify-end gap-2">
                <Button variant={"default"} size={"sm"}>
                    Reset
                </Button>
            </div>
            <BaseChart
                {...props}
                plugins={[
                    LineController,
                    LineElement,
                    CategoryScale,
                    LinearScale,
                    PointElement,
                    Tooltip,
                    Legend,
                    Title,
                    zoom,
                ]}
            />
        </div>
    )
}
