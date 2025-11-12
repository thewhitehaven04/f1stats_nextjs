import { BoxAndWiskers, BoxPlotChart, BoxPlotController } from "@sgratzl/chartjs-chart-boxplot"

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
    ScatterController,
} from "chart.js"
import zoom from "chartjs-plugin-zoom"

Chart.register([
    LineController,
    LineElement,
    LinearScale,
    CategoryScale,
    PointElement,
    ScatterController,
    Tooltip,
    Legend,
    Title,
    zoom,
    BoxAndWiskers,
    BoxPlotChart,
    BoxPlotController,
])


export const getThemeVar = (theme: string | undefined, name: keyof typeof lightTheme) =>
    theme === "dark" ? darkTheme[name] : lightTheme[name]

const lightTheme = {
    background: "oklch(1 0 0)",
    foreground: "oklch(0.141 0.005 285.823)",
    border: "oklch(0.92 0.004 286.32)",
    "muted-foreground": "oklch(0.552 0.016 285.938)",
}

const darkTheme = {
    background: "oklch(0.141 0.005 285.823)",
    foreground: "oklch(0.985 0 0)",
    border: "oklch(1 0 0 / 10%)",
    "muted-foreground": "oklch(0.705 0.015 286.067)",
}

export const initGlobalChartConfig = () => {
    Chart.defaults.font.family = '"Archivo", sans-serif'
    Chart.defaults.font.size = 13
    Chart.defaults.font.lineHeight = 1.5

    Chart.defaults.plugins.tooltip.enabled = true
    Chart.defaults.plugins.tooltip.includeInvisible = false
    Chart.defaults.plugins.tooltip.titleFont = {
        size: 16,
    }
    Chart.defaults.plugins.tooltip.bodyFont = {
        size: 14,
    }
    Chart.defaults.plugins.tooltip.cornerRadius = 8
    Chart.defaults.plugins.tooltip.boxPadding = 4
    Chart.defaults.plugins.tooltip.bodySpacing = 4
    Chart.defaults.plugins.tooltip.backgroundColor = "rgba(0, 0, 0, 0.5)"
    Chart.defaults.plugins.tooltip.bodyFont = {
        size: 14,
    }

    Chart.defaults.elements.line.borderWidth = 2
}
