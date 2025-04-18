import Form from "next/form"
import { ESessionType } from "../types"
import type { SessionIdentifier } from "@/client/generated"
import { ResultsTable } from "./ResultsTable"
import { dbClient } from "@/client/db"
import type { ComponentProps } from "react"

export const ResultsSection = async ({
    season,
    event,
    session,
}: { season: string; event: string; session: SessionIdentifier }) => {
    let tableData: ComponentProps<typeof ResultsTable>
    const { start_time: sessionStartTime } = await dbClient.event_sessions.findFirstOrThrow({
        where: {
            season_year: Number.parseInt(season),
            event_name: event,
            session_type_id: session,
        },
    })
    switch (session) {
        case "Practice 1":
        case "Practice 2":
        case "Practice 3":
            tableData = {
                rows: (
                    await dbClient.session_results.findMany({
                        where: {
                            season_year: Number.parseInt(season),
                            event_name: event,
                            session_type_id: session,
                        },
                        include: {
                            practice_session_results: true,
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
                ).map(result => ({
                    driver: {
                        name: `${result.drivers?.first_name} ${result.drivers?.last_name}`,
                        country: result.drivers?.country_alpha3,
                    },
                    driverNumber: result.drivers?.driver_numbers[0].driver_number,
                    time: result.practice_session_results?.laptime,
                    gap: result.practice_session_results?.gap,
                    teamName: result.drivers?.driver_team_changes[0].teams.id,
                })),
                sessionType: ESessionType.PRACTICE,
            } as const
            break
        case "Qualifying":
        case "Sprint Qualifying":
        case "Sprint Shootout":
            tableData = {
                rows: (
                    await dbClient.session_results.findMany({
                        where: {
                            season_year: Number.parseInt(season),
                            event_name: event,
                            session_type_id: session,
                        },
                        include: {
                            qualifying_session_results: true,
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
                ).map(result => ({
                    driver: {
                        name: `${result.drivers?.first_name} ${result.drivers?.last_name}`,
                        country: result.drivers?.country_alpha3,
                    },
                    driverNumber: result.drivers?.driver_numbers[0].driver_number,
                    q1Time: result.qualifying_session_results?.q1_laptime,
                    q2Time: result.qualifying_session_results?.q2_laptime,
                    q3Time: result.qualifying_session_results?.q3_laptime,
                    teamName: result.drivers?.driver_team_changes[0].teams.id,
                })),
                sessionType: ESessionType.QUALIFYING,
            } as const
            break
        case "Race":
        case "Sprint":
            tableData = {
                rows: (
                    await dbClient.session_results.findMany({
                        where: {
                            season_year: Number.parseInt(season),
                            event_name: event,
                            session_type_id: session,
                        },
                        include: {
                            race_session_results: true,
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
                ).map(result => ({
                    driver: {
                        name: `${result.drivers?.first_name} ${result.drivers?.last_name}`,
                        country: result.drivers?.country_alpha3,
                    },
                    driverNumber: result.drivers?.driver_numbers[0].driver_number,
                    gridPosition: 0,
                    time: result.race_session_results?.total_time,
                    gap: result.race_session_results?.gap,
                    points: result.race_session_results?.points,
                    status: result.race_session_results?.result_status,
                    teamName: result.drivers?.driver_team_changes[0].teams.id,
                })),
                sessionType: ESessionType.RACE,
            } as const
            break
        default:
            throw new Error("Unsupported type")
    }

    return (
        <>
            <section className="flex flex-col gap-2 w-full overflow-x-visible">
                <h2 className="divider divider-start text-lg">Results</h2>
                <Form
                    formMethod="get"
                    action="laps"
                    className="w-full flex flex-col items-end gap-2"
                >
                    <ResultsTable {...tableData} />
                </Form>
            </section>
        </>
    )
}
