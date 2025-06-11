import type { SessionIdentifier } from "@/client/generated"
import dbClient from "@/client/db"

export const fetchSessionResults = async (
    season: string,
    event: string,
    session: SessionIdentifier,
) => {
    const { start_time: sessionStartTime } = await dbClient.event_sessions.findFirstOrThrow({
        where: {
            season_year: Number.parseInt(season),
            event_name: event,
            session_type_id: session,
        },
    })
    return {
        data: await dbClient.session_results.findMany({
            where: {
                season_year: Number.parseInt(season),
                event_name: event,
                session_type_id: session,
            },
            include: {
                race_session_results: session === "Race" || session === "Sprint",
                practice_session_results:
                    session === "Practice 1" ||
                    session === "Practice 2" ||
                    session === "Practice 3",
                qualifying_session_results:
                    session === "Qualifying" ||
                    session === "Sprint Qualifying" ||
                    session === "Sprint Shootout",
                drivers: {
                    include: {
                        driver_numbers: {
                            where: {
                                season_year: Number.parseInt(season),
                            },
                        },
                        driver_team_changes: {
                            take: 1,
                            where: {
                                timestamp_start: {
                                    lte: sessionStartTime,
                                },
                                OR: [
                                    {
                                        timestamp_end: {
                                            gte: sessionStartTime,
                                        },
                                    },
                                    {
                                        timestamp_end: null,
                                    },
                                ],
                            },
                            include: {
                                teams: true,
                            },
                        },
                    },
                },
            },
        }),
        type: session,
    }
}

export type TFetchSessionResultsReturn = ReturnType<typeof fetchSessionResults>
export type TFetchSessionResults = Awaited<TFetchSessionResultsReturn>["data"]