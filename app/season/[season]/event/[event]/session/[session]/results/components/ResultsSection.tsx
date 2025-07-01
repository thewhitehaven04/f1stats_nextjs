import Form from "next/form"
import { ResultsTable } from "./ResultsTable"
import type { ComponentProps } from "react"
import { ESessionType, type IPracticeData, type IQualifyingData, type IRaceData } from "./types"
import type { TFetchSessionResults } from "../fetcher"

export const ResultsSection = (props: {
    sessionResults: TFetchSessionResults
    sessionType: string
}) => {
    const { sessionResults, sessionType } = props
    let tableData: ComponentProps<typeof ResultsTable>
    if (sessionType.toLowerCase().includes("practice")) {
        tableData = {
            rows: sessionResults.map((result) => {
                return {
                    driver: {
                        country: result.drivers?.country_alpha3 || "",
                        name: `${result.drivers?.first_name} ${result.drivers?.last_name}` || "",
                        id: result.drivers?.id || "",
                    },
                    teamName: result.drivers?.driver_team_changes[0].teams
                        ? {
                              name:
                                  result.drivers?.driver_team_changes[0].teams.team_display_name ||
                                  "",
                              id: result.drivers?.driver_team_changes[0].teams.id,
                          }
                        : null,
                    time: result.practice_session_results
                        ? result.practice_session_results.laptime
                        : 0,
                    gap: result.practice_session_results ? result.practice_session_results.gap : 0,
                } satisfies IPracticeData
            }),
            sessionType: ESessionType.PRACTICE,
        }
    } else if (
        sessionType === "Qualifying" ||
        sessionType === "Sprint Qualifying" ||
        sessionType === "Sprint Shootout"
    ) {
        tableData = {
            rows: sessionResults.map((result) => {
                return {
                    driver: {
                        country: result.drivers?.country_alpha3 || "",
                        name: `${result.drivers?.first_name} ${result.drivers?.last_name}` || "",
                        id: result.drivers?.id || "",
                    },
                    teamName: result.drivers?.driver_team_changes[0].teams
                        ? {
                              name:
                                  result.drivers?.driver_team_changes[0].teams.team_display_name ||
                                  "",
                              id: result.drivers?.driver_team_changes[0].teams.id,
                          }
                        : null,
                    q1Time: result.qualifying_session_results?.q1_laptime ?? null,
                    q2Time: result.qualifying_session_results?.q2_laptime ?? null,
                    q3Time: result.qualifying_session_results?.q3_laptime ?? null,
                } satisfies IQualifyingData
            }),
            sessionType: ESessionType.QUALIFYING,
        }
    } else {
        tableData = {
            rows: sessionResults.map((result) => {
                return {
                    driver: {
                        country: result.drivers?.country_alpha3 || "",
                        name: `${result.drivers?.first_name} ${result.drivers?.last_name}` || "",
                        id: result.drivers?.id || "",
                    },
                    gap: result.race_session_results ? result.race_session_results.gap : null,
                    teamName: result.drivers?.driver_team_changes[0].teams
                        ? {
                              name:
                                  result.drivers?.driver_team_changes[0].teams.team_display_name ||
                                  "",
                              id: result.drivers?.driver_team_changes[0].teams.id,
                          }
                        : null,
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
