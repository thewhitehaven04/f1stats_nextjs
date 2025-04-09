import type { SessionIdentifier } from "@/client/generated"
import { Suspense } from "react"
import { SessionSummaryCard } from "./components/SummaryCard"
import { ResultsSection } from "./components/ResultsSection"

export default async function Page({
    params,
}: { params: Promise<{ session: string; season: string; round: string }> }) {
    const { session: sessionEncoded, round, season } = await params
    const session = decodeURI(sessionEncoded)
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <SessionSummaryCard
                    season={season}
                    round={round}
                    session={session as SessionIdentifier}
                />
            </Suspense>
            <Suspense fallback={<div>Loading...</div>}>
                <ResultsSection
                    season={season}
                    round={round}
                    session={session as SessionIdentifier}
                />
            </Suspense>
        </>
    )
}
