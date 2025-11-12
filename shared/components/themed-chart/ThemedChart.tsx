import { useTheme } from "next-themes"
import { useEffect, useRef, type ComponentProps } from "react"
import { Chart } from "react-chartjs-2"
import type { Chart as ChartJS, ChartTypeRegistry } from "chart.js"
import { merge } from "ts-deepmerge"
import clsx from "clsx"
import { LoadingSpinner } from "@/shared/components/LoadingSpinner"
import { getThemeVar } from "./config"

export const ThemedChart = (
    props: ComponentProps<typeof Chart> & {
        hasData: boolean
        noDataMessage?: string
        isUpdatingData?: boolean
    },
) => {
    const { resolvedTheme } = useTheme()

    const chartRef = useRef<ChartJS<keyof ChartTypeRegistry, unknown, unknown>>(null)

    // biome-ignore lint/correctness/useExhaustiveDependencies: subscription to theme changes
    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.update("none")
        }
    }, [resolvedTheme])

    const { noDataMessage, hasData, isUpdatingData, ...rest } = props

    const merged = merge(rest, {
        ref: props.ref || chartRef,
        options: {
            backgroundColor: getThemeVar(resolvedTheme, "background"),
            borderColor: getThemeVar(resolvedTheme, "border"),
            color: getThemeVar(resolvedTheme, "foreground"),
            plugins: {
                legend: {
                    labels: {
                        color: getThemeVar(resolvedTheme, "foreground"),
                    },
                },
            },
            scales: {
                x: {
                    border: {
                        color: getThemeVar(resolvedTheme, "muted-foreground"),
                    },
                    ticks: {
                        color: getThemeVar(resolvedTheme, "foreground"),
                    },
                    grid: {
                        color: getThemeVar(resolvedTheme, "muted-foreground"),
                    },
                },
                y: {
                    border: {
                        color: getThemeVar(resolvedTheme, "muted-foreground"),
                    },
                    ticks: {
                        color: getThemeVar(resolvedTheme, "foreground"),
                    },
                    grid: {
                        color: getThemeVar(resolvedTheme, "muted-foreground"),
                    },
                },
            },
        },
    } as Partial<ComponentProps<typeof Chart>>)

    return (
        <>
            <div className={clsx(!hasData && "absolute backdrop-blur-xs z-10 w-full h-full")} />
            {isUpdatingData ? (
                <div className="absolute z-10 w-full top-[50%] translate-y-[-50%]">
                    <LoadingSpinner />
                </div>
            ) : !hasData ? (
                <div className="absolute z-10 w-full top-[50%] translate-y-[-50%]">
                    <h1 className="text-center text-lg font-bold">{noDataMessage}</h1>
                </div>
            ) : null}
            {/** @ts-ignore */}
            <Chart {...merged} />
        </>
    )
}
