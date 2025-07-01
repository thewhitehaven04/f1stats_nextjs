"use client"

import { Chart } from "react-chartjs-2"
import type { TDriverRow } from "../types"

export const TeamSeasonFormChart = ({ eventColumns }: { eventColumns: TDriverRow[] }) => {
    return (
        <Chart
            type="line"
            data={{
                datasets: [],
            }}
        />
    )
}
