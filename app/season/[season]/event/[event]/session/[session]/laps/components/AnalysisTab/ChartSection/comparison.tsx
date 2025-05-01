import type { ChartData } from "chart.js"
import { use, useMemo } from "react"
import { Chart, type ChartProps } from "react-chartjs-2"
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from "chart.js"
import { getAlternativeColor } from "../../helpers/getAlternativeColor"
import { CircuitMap } from "../CircuitMap"
import { initGlobalChartConfig } from "@/components/Chart/config"

ChartJS.register(
    LineController,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    Title,
)
initGlobalChartConfig()

export function TimeDeltaComparison(props: { comparison: Promise<unknown> }) {
    const { comparison: comparisonPromise } = props
    const comparison = use(comparisonPromise)
    const max = comparison.telemetries[0].comparison.distance.at(-1) || 0

    const labels = comparison.telemetries[0].comparison.distance
    const options = {
        scales: {
            x: {
                type: "linear",
                max: max,
                min: 0,
            },
            y: {
                type: "linear",
                title: {
                    text: "Gap (s)",
                    display: true,
                    font: {
                        size: 14,
                    },
                },
            },
        },
        interaction: {
            mode: "nearest",
            intersect: false,
        },
        plugins: {
            legend: {
                display: true,
                title: {
                    font: {
                        size: 14,
                    },
                },
                fullSize: true,
            },
            tooltip: {
                enabled: true,
                includeInvisible: false,
                axis: "x",
                mode: "nearest",
            },
        },
    } satisfies ChartProps<"line">["options"]

    const timeDeltaDatasets: ChartData<"line">["datasets"] = useMemo(
        () =>
            comparison.telemetries.map((comp) => ({
                label: `${comp.driver} vs ${comparison.reference}`,
                borderColor: comp.alternative_style ? getAlternativeColor(comp.color) : comp.color,
                data: comp.comparison.distance.map((distance, index) => ({
                    x: distance,
                    y: comp.comparison.gap[index],
                })),
            })),
        [comparison],
    )

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <section className="h-full">
                <h2 className="divider divider-start text-lg">Time delta</h2>
                <Chart
                    className="h-full"
                    type="line"
                    data={{ labels, datasets: timeDeltaDatasets }}
                    options={options}
                />
            </section>
            <section className="h-full">
                <h2 className="divider divider-start text-lg">Track map</h2>
                <CircuitMap comparison={comparison} />
            </section>
        </div>
    )
}
