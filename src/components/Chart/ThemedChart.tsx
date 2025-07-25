import { useTheme } from "next-themes"
import { useEffect, useRef, type ComponentProps } from "react"
import { Chart } from "react-chartjs-2"
import type { Chart as ChartJS, ChartTypeRegistry } from "chart.js"
import { getCssVar } from "@/components/Chart/config"
import { merge } from "ts-deepmerge"

export const ThemedChart = (props: ComponentProps<typeof Chart>) => {
    const { theme } = useTheme()

    const chartRef = useRef<ChartJS<keyof ChartTypeRegistry, unknown, unknown>>(null)

    // biome-ignore lint/correctness/useExhaustiveDependencies: subscription to theme changes
    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.update('none')
        }
    }, [theme])


    const merged = merge(props, {
        ref: props.ref || chartRef,
        options: {
            backgroundColor: getCssVar("--background"),
            borderColor: getCssVar("--border"),
            color: getCssVar("--foreground"),
            plugins: {
                legend: {
                    labels: {
                        color: getCssVar("--foreground"),
                    }
                }
            },
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

    // @ts-ignore ref weirdness /
    return <Chart {...merged} />
}
