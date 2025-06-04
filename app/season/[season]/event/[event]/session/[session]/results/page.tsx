import type { SessionIdentifier } from "@/client/generated"
import type { ComponentProps } from "react"
import Form from "next/form"
import { ResultsTable } from "./components/ResultsTable"
import dbClient from "@/client/db"
import {
    ESessionType,
    type IPracticeData,
    type IQualifyingData,
    type IRaceData,
} from "./components/types"
import type { ISessionPathnameParams } from "../types"

const fetchSessionResults = async (season: string, event: string, session: SessionIdentifier) => {
    const { start_time: sessionStartTime } = await dbClient.event_sessions.findFirstOrThrow({
        where: {
            season_year: Number.parseInt(season),
            event_name: event,
            session_type_id: session,
        },
    })
    return await dbClient.session_results.findMany({
        where: {
            season_year: Number.parseInt(season),
            event_name: event,
            session_type_id: session,
        },
        include: {
            race_session_results: session === "Race" || session === "Sprint",
            practice_session_results:
                session === "Practice 1" || session === "Practice 2" || session === "Practice 3",
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
    })
}

export default async function Page({ params }: { params: Promise<ISessionPathnameParams> }) {
    const { session, event, season } = await params

    const data = await fetchSessionResults(
        season,
        decodeURIComponent(event),
        decodeURIComponent(session) as SessionIdentifier,
    )

    let tableData: ComponentProps<typeof ResultsTable>
    if (session.toLowerCase().includes("practice")) {
        tableData = {
            rows: data.map((result) => {
                return {
                    driver: {
                        country: result.drivers?.country_alpha3 || "",
                        name: `${result.drivers?.first_name} ${result.drivers?.last_name}` || "",
                        id: result.drivers?.id || "",
                    },
                    teamName: result.drivers?.driver_team_changes[0].teams.team_display_name || "",
                    time: result.practice_session_results
                        ? result.practice_session_results.laptime
                        : 0,
                    gap: result.practice_session_results ? result.practice_session_results.gap : 0,
                } satisfies IPracticeData
            }),
            sessionType: ESessionType.PRACTICE,
        }
    } else if (
        session === "Qualifying" ||
        session === "Sprint Qualifying" ||
        session === "Sprint Shootout"
    ) {
        tableData = {
            rows: data.map((result) => {
                return {
                    driver: {
                        country: result.drivers?.country_alpha3 || "",
                        name: `${result.drivers?.first_name} ${result.drivers?.last_name}` || "",
                        id: result.drivers?.id || "",
                    },
                    teamName: result.drivers?.driver_team_changes[0].teams.team_display_name || "",
                    q1Time: result.qualifying_session_results?.q1_laptime ?? null,
                    q2Time: result.qualifying_session_results?.q2_laptime ?? null,
                    q3Time: result.qualifying_session_results?.q3_laptime ?? null,
                } satisfies IQualifyingData
            }),
            sessionType: ESessionType.QUALIFYING,
        }
    } else {
        tableData = {
            rows: data.map((result) => {
                return {
                    driver: {
                        country: result.drivers?.country_alpha3 || "",
                        name: `${result.drivers?.first_name} ${result.drivers?.last_name}` || "",
                        id: result.drivers?.id || "",
                    },
                    gap: result.race_session_results ? result.race_session_results.gap : null,
                    teamName: result.drivers?.driver_team_changes[0].teams.team_display_name || "",
                    time: result.race_session_results
                        ? result.race_session_results.total_time
                        : null,
                    status: result.race_session_results?.result_status ?? null,
                    points: result.race_session_results?.points ?? null,
                    gridPosition: result.race_session_results?.grid_position ?? null,
                } satisfies IRaceData
            }),
            sessionType: ESessionType.RACE,
        }
    }
    return (
        <section className="flex flex-col gap-2 w-full overflow-x-visible">
            <Form action="laps" className="w-full flex flex-col items-end gap-2">
                <ResultsTable {...tableData} />
            </Form>
        </section>
    )
}
