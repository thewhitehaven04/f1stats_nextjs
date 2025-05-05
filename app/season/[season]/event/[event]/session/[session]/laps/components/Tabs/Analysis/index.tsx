"use client"

import type { LapSelectionData } from "@/client/generated"
import Form from "next/form"
import { useActionState, useRef } from "react"
import { getTelemetry } from "./action"
import { useParams } from "next/navigation"
import { LapsTableSection } from "./LapsTableSection"
import dynamic from "next/dynamic"

const AverageTelemetrySection = dynamic(
    async () => (await import("./AverageTelemetrySection/index")).AverageTelemetrySection,
    { ssr: false },
)

const TelemetryChartSection = dynamic(
    async () => (await import("./ChartSection/index")).TelemetryChartSection,
    { ssr: false },
)

export const AnalysisTab = ({ laps }: { laps: Promise<LapSelectionData> }) => {
    const params = useParams()
    const [state, formAction] = useActionState(getTelemetry, { tab: "telemetry", data: null })

    const ref = useRef<HTMLElement>(null)

    return (
        <Form
            action={formAction}
            onSubmit={() => {
                ref.current?.scrollIntoView({ behavior: "smooth" })
            }}
            className="flex flex-col gap-4 items-stretch"
        >
            <input type="hidden" name="season" value={params.season} />
            <input type="hidden" name="event" value={decodeURIComponent(params.event as string)} />
            <input
                type="hidden"
                name="session"
                value={decodeURIComponent(params.session as string)}
            />
            <LapsTableSection laps={laps} />
            {state?.tab === "telemetry" && (
                <TelemetryChartSection telemetryMeasurements={state?.data} ref={ref} />
            )}
            {state?.tab === "averageTelemetry" && (
                <AverageTelemetrySection averageTelemetry={state?.data || null} ref={ref} />
            )}
        </Form>
    )
}
