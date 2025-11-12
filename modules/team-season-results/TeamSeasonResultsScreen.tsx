import { LoadingSpinner } from "@/shared/components/LoadingSpinner"
import { TeamSeasonFormChart } from "@/modules/team-season-results/features/form-chart/TeamSeasonFormChart"
import { TeamSeasonFormSection } from "@/modules/team-season-results/features/form-table/TeamSeasonFormTable"
import type { fetchTeamSeasonForm } from "@/modules/team-season-results/fetcher"
import { Suspense } from "react"

export async function TeamSeasonResultsScreen(
    props: Awaited<ReturnType<typeof fetchTeamSeasonForm>>,
) {
    const { eventPoints, seasonEvents, driverCount, teamName } = props

    return (
        <div className="flex flex-col gap-4">
            <TeamSeasonFormSection
                seasonForm={eventPoints}
                events={seasonEvents}
                driverCount={driverCount}
            >
                {teamName} form
            </TeamSeasonFormSection>
            <Suspense fallback={<LoadingSpinner />}>
                <TeamSeasonFormChart
                    events={seasonEvents}
                    points={eventPoints}
                    driverCount={driverCount}
                />
            </Suspense>
        </div>
    )
}
