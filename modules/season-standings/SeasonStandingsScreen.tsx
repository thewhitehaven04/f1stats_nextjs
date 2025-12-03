import { StandingsTable } from "./features/StandingsTable/StandingsTable"
import type { ISeasonStandings } from "./models/types"

export const SeasonStandingsScreen = (props: { standings: ISeasonStandings }) => {
    const { standings } = props
    return (
        <section className="flex flex-col gap-2">
            <h2>Season {standings.season}</h2>
            <StandingsTable rows={standings.standings} />
        </section>
    )
}
