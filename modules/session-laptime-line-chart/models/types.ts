import type { Compound, PlotColor } from '@/shared/client/generated'
import type { ChartData } from 'chart.js'

export type TLapsLinePlotDataset = {
    x: number
    y: number
    compound: Compound
}

export type TLinePlotTabBoxChartDataset = ChartData<
    "line",
    TLapsLinePlotDataset[]
>["datasets"][number] &
    PlotColor