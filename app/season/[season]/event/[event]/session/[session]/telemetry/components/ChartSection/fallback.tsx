'use client'
import { Chart } from "react-chartjs-2"
import {
    CategoryScale,
    Chart as ChartJS,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from "chart.js"

ChartJS.register([LineController, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Title])

export function TelemetryChartFallback(props: { height: number; sectionTitle: string }) {
    const { height, sectionTitle } = props
    return (
        <section className="w-full">
            <h2 className="divider divider-start text-lg">{sectionTitle}</h2>
            <div className="relative">
                <div className="z-10">
                    <Chart
                        type="line"
                        height={height}
                        data={{
                            datasets: [],
                        }}
                        options={{
                            scales: {
                                x: {
                                    display: true,
                                    min: 0,
                                    max: 300,
                                },
                                y: {
                                    display: true,
                                    min: 0,
                                    max: 300,
                                },
                            },
                        }}
                    />
                </div>
                <div className="absolute w-full h-full flex flex-col items-center justify-center gap-2 top-0 left-0 bg-transparent z-20">
                    <div className="loading loading-lg loading-spinner" />
                    <div className="text-lg">Preparing your graph...</div>
                </div>
            </div>
        </section>
    )
}
