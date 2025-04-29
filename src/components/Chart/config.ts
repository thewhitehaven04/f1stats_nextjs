import { BoxAndWiskers, BoxPlotChart, BoxPlotController } from "@sgratzl/chartjs-chart-boxplot"
import type { FontSpec, TooltipOptions } from "chart.js"

import {
    CategoryScale,
    Legend,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Chart,
} from "chart.js"
import zoom from "chartjs-plugin-zoom"

Chart.register([
    LineController,
    LineElement,
    LinearScale,
    CategoryScale,
    PointElement,
    Tooltip,
    Legend,
    Title,
    zoom,
    BoxAndWiskers,
    BoxPlotChart,
    BoxPlotController,
])

export const initGlobalChartConfig = () => {
    Chart.defaults.font.family = '"Archivo", sans-serif'
    Chart.defaults.font.size = 13
    Chart.defaults.font.lineHeight = 1.5

    Chart.defaults.plugins.tooltip.titleFont = {
        size: 16,
    }
    Chart.defaults.plugins.tooltip.cornerRadius = 12
    Chart.defaults.plugins.tooltip.boxPadding = 4
    Chart.defaults.plugins.tooltip.bodyFont = {
        size: 14,
    }

    Chart.defaults.elements.line.borderWidth = 2
}

export const SCALE_FONT_CONFIG = {
    family: '"Archivo", sans-serif',
    size: 13,
} satisfies Partial<FontSpec>

export const TICKS_FONT_CONFIG = SCALE_FONT_CONFIG
export const LEGEND_FONT_CONFIG = SCALE_FONT_CONFIG

export const TOOLTIP_CONFIG = {
    enabled: true,
    includeInvisible: false,
    axis: "x",
    mode: "nearest",
    intersect: false,
    titleFont: {
        size: 16,
        family: '"Archivo", sans-serif',
    },
    bodyFont: {
        size: 14,
        family: '"Archivo", sans-serif',
    },
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    cornerRadius: 8,
    boxPadding: 2,
    bodySpacing: 4,
} satisfies Partial<TooltipOptions>
