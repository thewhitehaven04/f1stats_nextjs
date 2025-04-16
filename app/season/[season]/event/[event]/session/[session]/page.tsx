import type { SessionIdentifier } from "@/client/generated"
import { Suspense } from "react"
import { SessionSummaryCard } from "./components/SummaryCard"
import { SectionLoadingSpinner } from "@/components/SectionLoadingSpinner"

export default async function Page({
    params,
}: { params: Promise<{ session: string; event: string; season: string }> }) {
    const { session: sessionEncoded, event: eventEncoded, season } = await params
    const session = decodeURIComponent(sessionEncoded)
    const event = decodeURIComponent(eventEncoded)
    return (
        <>
            <Suspense fallback={<SectionLoadingSpinner />}>
                <SessionSummaryCard
                    season={season}
                    event={event}
                    session={session as SessionIdentifier}
                />
            </Suspense>
            {/* <Suspense fallback={<div>Loading...</div>}>
                <ResultsSection
                    season={season}
                    round={event}
                    session={session as SessionIdentifier}
                />
            </Suspense> */}
        </>
    )
}
