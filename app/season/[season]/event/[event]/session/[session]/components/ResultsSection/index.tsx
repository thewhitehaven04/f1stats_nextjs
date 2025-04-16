import Form from "next/form"
import { SESSION_TYPE_TO_RESULT_COLUMN_MAP } from "../constants"
import { ESessionType } from "../types"
import type { ColumnDef } from "@tanstack/react-table"
import {
    getPracticeResultsSessionResultsPracticeGet,
    getQualifyingResultsSessionResultsQualilikeGet,
    getRacelikeResultsSessionResultsRacelikeGet,
    type SessionIdentifier,
} from "@/client/generated"
import { ResultsTable } from "./ResultsTable"
import { ApiClient } from "@/client"

export const ResultsSection = async ({
    season,
    round,
    session,
}: { season: string; round: string; session: SessionIdentifier }) => {
    let tableData
    switch (session) {
        case "Practice 1":
        case "Practice 2":
        case "Practice 3":
            tableData = {
                rows: (
                    await getPracticeResultsSessionResultsPracticeGet({
                        client: ApiClient,
                        throwOnError: true,
                        query: {
                            round: round || "",
                            type: session,
                            year: season,
                        },
                    })
                ).data.map((result) => ({
                    driver: { name: result.Driver, country: result.CountryCode },
                    driverNumber: result.DriverNumber,
                    teamName: result.TeamName,
                    laptime: result.Time_,
                    gap: result.Gap,
                })),
                columns: SESSION_TYPE_TO_RESULT_COLUMN_MAP[ESessionType.PRACTICE],
            }
            break
        case "Qualifying":
        case "Sprint Qualifying":
        case "Sprint Shootout":
            tableData = {
                rows: (
                    await getQualifyingResultsSessionResultsQualilikeGet({
                        client: ApiClient,
                        throwOnError: true,
                        query: {
                            round: round || "",
                            type: session,
                            year: season,
                        },
                    })
                ).data.map((result) => ({
                    driver: { name: result.Driver, country: result.CountryCode },
                    driverNumber: result.DriverNumber,
                    teamName: result.TeamName,
                    q1Time: result.Q1Time,
                    q2Time: result.Q2Time,
                    q3Time: result.Q3Time,
                })),
                columns: SESSION_TYPE_TO_RESULT_COLUMN_MAP[ESessionType.PRACTICE],
            }
            break
        case "Race":
        case "Sprint":
            tableData = {
                rows: (
                    await getRacelikeResultsSessionResultsRacelikeGet({
                        client: ApiClient,
                        throwOnError: true,
                        query: {
                            round,
                            year: season,
                            type: session,
                        },
                    })
                ).data.map((result) => ({
                    driver: { name: result.Driver, country: result.CountryCode },
                    driverNumber: result.DriverNumber,
                    teamName: result.TeamName,
                    gridPosition: result.GridPosition,
                    time: result.Time,
                    gap: result.Gap,
                    points: result.Points,
                    status: result.Status,
                })),
                columns: SESSION_TYPE_TO_RESULT_COLUMN_MAP[ESessionType.RACE],
            }
            break
        default:
            throw new Error("Unsupported type")
    }

    return (
        <>
            <section className="flex flex-col gap-2 w-full overflow-x-visible">
                <h2 className="divider divider-start text-lg">Results</h2>
                <Form formMethod="get" action="laps" className="w-full flex flex-col items-end gap-2">
                    <ResultsTable
                        rows={tableData.rows}
                        columns={tableData.columns as ColumnDef<(typeof tableData)["rows"][number]>[]}
                    />
                </Form>
            </section>
        </>
    )
}
