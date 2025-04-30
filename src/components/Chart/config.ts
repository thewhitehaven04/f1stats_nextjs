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
