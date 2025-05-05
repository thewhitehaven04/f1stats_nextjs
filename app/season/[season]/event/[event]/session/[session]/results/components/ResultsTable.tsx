"use client"

import { flexRender, getCoreRowModel, useReactTable, type RowData } from "@tanstack/react-table"
import type { ESessionType, IBaseResultsData } from "./types"
import { SESSION_TYPE_TO_RESULT_COLUMN_MAP } from "./constants"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export interface IResultsTableProps<T extends RowData> {
    rows: T[]
}

export const ResultsTable = <T extends IBaseResultsData>(
    props: IResultsTableProps<T> & { sessionType: ESessionType },
) => {
    const { rows, sessionType } = props

    const { getRowModel, getFlatHeaders, getIsSomeRowsSelected } = useReactTable<T>({
        data: rows,
        columns: SESSION_TYPE_TO_RESULT_COLUMN_MAP[sessionType],
        getRowId: (row) => row.driver.name,
        getCoreRowModel: getCoreRowModel(),
    })
    return (
        <div className="w-full flex flex-col items-end gap-2">
            {!getIsSomeRowsSelected() ? (
                <div
                    className="tooltip tooltip-left"
                    data-tip="To view detailed data, please select at least one of the laps in the table by clicking on a checkbox"
                >
                    <Button type="submit" disabled size="md">
                        View laps
                    </Button>
                </div>
            ) : (
                <Button type="submit" size="md">
                    View laps
                </Button>
            )}

            <Table>
                <TableHeader>
                    <TableRow>
                        {getFlatHeaders().map(({ column, id, getContext }) => (
                            <TableHead className="text-start px-1" key={id}>
                                {flexRender(column.columnDef.header, getContext())}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {getRowModel().rows.map(({ id, getVisibleCells }) => (
                        <TableRow key={id}>
                            {getVisibleCells().map(({ id: cellId, column, getContext }) => (
                                <TableCell className="pl-1" key={cellId}>
                                    {flexRender(column.columnDef.cell, getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
