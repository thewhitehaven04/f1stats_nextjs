import type { TooltipItem } from "chart.js"

export const getDistanceLabelInTooltipTitleCallback = (tooltipItems: TooltipItem<"line">[]) => {
    return `${Math.floor(tooltipItems[0].raw.x as number).toString()} m`
}

export const getSpeedLabelInTooltipCallback = (tooltipItems: TooltipItem<"line">[]) => {
    return `${Math.floor(tooltipItems[0].raw.y as number).toString()} kph`
}
