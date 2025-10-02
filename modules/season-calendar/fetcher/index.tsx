import { mapSeasonEvents } from "./eventMapper"
import { fetchEventsWithSessions } from "./fetcher"

export const fetchSeasonEvents = async ({ season }: { season: string }) => {
    return (await fetchEventsWithSessions(season)).map(mapSeasonEvents)
}