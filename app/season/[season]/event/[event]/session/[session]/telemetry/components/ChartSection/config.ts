import type { ChartProps } from "react-chartjs-2"
import type { CoreInteractionOptions, TooltipItem, TooltipOptions } from "chart.js"

export const BASE_CHART_OPTIONS = {
    elements: {
        point: {
            radius: 0,
        },
        line: {
            borderWidth: 3,
            cubicInterpolationMode: "default",
        },
    },
    font: {
        family: '"Archivo", sans-serif',
    },
} satisfies ChartProps["options"]

export const TOOLTIP_CONFIG = {
    enabled: true,
    includeInvisible: false,
    axis: "x",
    mode: "nearest",
} satisfies Partial<TooltipOptions>

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
