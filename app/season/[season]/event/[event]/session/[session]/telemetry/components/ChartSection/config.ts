import type { CoreInteractionOptions, TooltipItem } from "chart.js"

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
