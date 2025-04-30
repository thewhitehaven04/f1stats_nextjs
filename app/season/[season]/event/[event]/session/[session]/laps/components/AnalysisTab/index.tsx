"use client"

import type { LapSelectionData } from "@/client/generated"
import Form from "next/form"
import { LapsTableTab } from "../LapsTableTab"
import { useActionState } from "react"
import { getTelemetry } from "../../action"
import { useParams } from "next/navigation"

export const AnalysisTab = ({ laps }: { laps: Promise<LapSelectionData> }) => {
    const params = useParams()
    const [state, formAction, pending] = useActionState(getTelemetry, null)

    return (
        <Form action={formAction}>
            <input type="hidden" name="season" value={params.season} />
            <input type="hidden" name="event" value={decodeURIComponent(params.event)} />
            <input type="hidden" name="session" value={decodeURIComponent(params.session)} />
            <LapsTableTab laps={laps} />
            <span>{state?.toString()}</span>
        </Form>
    )
}
