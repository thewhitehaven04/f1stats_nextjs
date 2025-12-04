import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/uiComponents/tabs"
import { StandingsTable } from "./features/StandingsTable/StandingsTable"
import type { ISeasonStandings } from "./models/types"

export const SeasonStandingsScreen = (props: { standings: ISeasonStandings }) => {
    const { standings } = props
    return (
        <section className="flex flex-col gap-2">
            <h2>Season {standings.season}</h2>
            <Tabs defaultValue='drivers'>
                <TabsList>
                    <TabsTrigger value="drivers">Drivers</TabsTrigger>
                    <TabsTrigger value="teams">Teams</TabsTrigger>
                </TabsList>
                <TabsContent value="teams">
                    <StandingsTable type="team" rows={standings.teamStandings} />
                </TabsContent>
                <TabsContent value="drivers">
                    <StandingsTable type="driver" rows={standings.driverStandings} />
                </TabsContent>
            </Tabs>
        </section>
    )
}
