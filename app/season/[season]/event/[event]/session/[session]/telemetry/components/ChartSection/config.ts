import type { ChartProps } from "react-chartjs-2"
import type { CoreInteractionOptions, LegendOptions, TooltipItem, TooltipOptions } from "chart.js"

export const BASE_CHART_OPTIONS = {
    elements: {
        point: {
            radius: 0,
        },
        line: {
            borderWidth: 2.5,
            cubicInterpolationMode: "default",
        },
    },
    font: {
        family: '"Archivo", sans-serif',
        size: 16,
    },
} satisfies ChartProps["options"]


export const INTERACTION_CONFIG = {
    mode: "x",
    axis: "x",
    intersect: false,
} satisfies Partial<CoreInteractionOptions>

export const getDistanceLabelInTooltipTitleCallback = (tooltipItems: TooltipItem<"line">[]) => {
    return `${Math.floor(tooltipItems[0].raw.x as number).toString()} m`
}

export const getSpeedLabelInTooltipCallback = (tooltipItems: TooltipItem<"line">[]) => {
    return `${Math.floor(tooltipItems[0].raw.y as number).toString()} kph`
}
