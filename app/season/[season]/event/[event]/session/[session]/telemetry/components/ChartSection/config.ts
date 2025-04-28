import type { ChartProps } from "react-chartjs-2"
import type { ISpeedTraceOptions } from "~/features/session/telemetry/components/ChartSection/types"

export const BASE_CHART_OPTIONS = {
    elements: {
        point: {
            radius: 0,
        },
        line: {
            borderWidth: 2,
        },
    },
} as const

export const getSpeedTraceOptions = (options: ISpeedTraceOptions): ChartProps<"line">["options"] => ({
    ...BASE_CHART_OPTIONS,
    responsive: true,
    elements: {
        ...BASE_CHART_OPTIONS.elements,
        line: {
            ...BASE_CHART_OPTIONS.elements.line,
            cubicInterpolationMode: "monotone",
        },
        point: {
            radius: 0,
            hitRadius: 0.5,
        }
    },
    interaction: {
        mode: 'x',
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
            align: "center",
        },
        tooltip: {
            enabled: true,
            includeInvisible: false,
            axis: "x",
            mode: "x",
        },
    },
    scales: {
        x: {
            type: "linear",
            max: options.trackLength,
            title: {
                text: "Distance (m)",
                display: true,
                font: {
                    size: 14,
                },
            },
            min: 0,
        },
        y: {
            type: "linear",
            title: {
                text: "Speed (kph)",
                display: true,
                font: {
                    size: 14,
                },
            },
        },
    },
})