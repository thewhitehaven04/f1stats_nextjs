import { useTheme } from "next-themes"
import { useEffect, useRef, type ComponentProps } from "react"
import { Chart } from "react-chartjs-2"
import type { Chart as ChartJS } from "chart.js"
import { getCssVar } from "@/components/Chart/config"
import { merge } from "ts-deepmerge"

export const ThemedChart = (props: ComponentProps<typeof Chart>) => {
    const { theme } = useTheme()

    const chartRef = useRef<ChartJS>(null)

    // biome-ignore lint/correctness/useExhaustiveDependencies: subscription to theme changes
    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.update()
        }
    }, [theme])

    const merged = merge(props, {
        ref: (chart) => {
            if (chart) {
                chartRef.current = chart
            }

            if (props.ref) {
                props.ref = chart
            }
        },
        options: {
            backgroundColor: getCssVar("--background"),
            borderColor: getCssVar("--border"),
            color: getCssVar("--foreground"),
            scales: {
                x: {
                    border: {
                        color: getCssVar("--muted-foreground"),
                    },
                    ticks: {
                        color: getCssVar("--foreground"),
                    },
                    grid: {
                        color: getCssVar("--muted-foreground"),
                    },
                },
                y: {
                    border: {
                        color: getCssVar("--muted-foreground"),
                    },
                    ticks: {
                        color: getCssVar("--foreground"),
                    },
                    grid: {
                        color: getCssVar("--muted-foreground"),
                    },
                },
            },
        },
    } as Partial<ComponentProps<typeof Chart>>)

    return <Chart {...merged} />
}
