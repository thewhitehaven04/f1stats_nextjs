import { LoadingSpinner } from "@/components/SectionLoadingSpinner"
import { TeamSeasonFormChart } from "@/modules/TeamSeasonResults/features/form-chart/TeamSeasonFormChart"
import { TeamSeasonFormSection } from "@/modules/TeamSeasonResults/features/form-table/TeamSeasonFormTable"
import { fetchTeamSeasonForm } from "@/modules/TeamSeasonResults/fetcher"
import { Suspense } from "react"

export async function TeamSeasonResultsScreen(props: { season: string; team: string }) {
    const { season, team } = props
    const { teamName, eventPoints, seasonEvents, driverCount } = await fetchTeamSeasonForm(
        season,
        team,
    )

    return (
        <div className="flex flex-col gap-4">
            <TeamSeasonFormSection
                seasonForm={eventPoints}
                events={seasonEvents}
                driverCount={driverCount}
            >
                {teamName} {season} form
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
