"use client"

import type { LapSelectionData } from "@/client/generated"
import Form from "next/form"
import { Suspense, useActionState, useRef } from "react"
import { getTelemetry } from "./action"
import { useParams } from "next/navigation"
import { LapsTableSection } from "./LapsTableSection"
import dynamic from "next/dynamic"

export const AverageTelemetrySection = dynamic(
    async () => (await import("./AverageTelemetrySection")).AverageTelemetrySection,
    { ssr: false },
)

export const AnalysisTab = ({ laps }: { laps: Promise<LapSelectionData> }) => {
    const params = useParams()
    const [telemetry, formAction] = useActionState(getTelemetry, null)

    const ref = useRef<HTMLElement>(null)

    return (
        <Form
            action={formAction}
            onSubmit={() => {
                ref.current?.scrollIntoView({ behavior: "smooth" })
            }}
        >
            <input type="hidden" name="season" value={params.season} />
            <input type="hidden" name="event" value={decodeURIComponent(params.event as string)} />
            <input
                type="hidden"
                name="session"
                value={decodeURIComponent(params.session as string)}
            />
            <LapsTableSection laps={laps} />
            <Suspense fallback={<div>loading</div>}>
                <AverageTelemetrySection averageTelemetry={telemetry || null} ref={ref} />
            </Suspense>
        </Form>
    )
}
