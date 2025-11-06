"use client"
import Form from "next/form"
import { ResultsTable } from "./features/results-table/ResultsTable"
import { useMemo } from "react"
import { ESessionType } from "./features/results-table/types"
import type { TFetchSessionResults } from "./models/types"
import { TooltipButton } from "@/shared/components/TooltipButton"
import { useHasDriverSelection } from "./features/atoms/driverSelection"
import {
    getRowDataFromPractice,
    getRowDataFromQualifying,
    getRowDataFromRace,
} from "./models/row-data"

export const SessionResultsScreen = (props: {
    sessionResults: TFetchSessionResults
    sessionType: string
}) => {
    const { sessionResults, sessionType } = props

    const tableData = useMemo(() => {
        if (sessionType.toLowerCase().includes("practice")) {
            return {
                rows: sessionResults.map((result) => getRowDataFromPractice(result)),
                sessionType: ESessionType.PRACTICE as const,
            }
        }
        if (
            sessionType === "Qualifying" ||
            sessionType === "Sprint Qualifying" ||
            sessionType === "Sprint Shootout"
        ) {
            return {
                rows: sessionResults.map((result) => getRowDataFromQualifying(result)),
                sessionType: ESessionType.QUALIFYING as const,
            }
        }
        return {
            rows: sessionResults.map((result) => getRowDataFromRace(result)),
            sessionType: ESessionType.RACE as const,
        }
    }, [sessionType, sessionResults])

    const hasSelection = useHasDriverSelection()

    return (
        <section className="flex flex-col gap-2 w-full overflow-x-visible">
            <Form action="laps" className="w-full flex flex-col items-end gap-2">
                <div className="flex flex-row justify-end">
                    <TooltipButton
                        variant="secondary"
                        type="submit"
                        disabled={!hasSelection}
                        tooltipText="You need to select at least one result"
                        size="md"
                    >
                        Lap-by-lap details
                    </TooltipButton>
                </div>
                <ResultsTable {...tableData} />
            </Form>
        </section>
    )
}
