"use client"

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type RowData,
} from "@tanstack/react-table"
import type { ESessionType, IBaseResultsData } from "./types"
import { TableCell } from "@/components/Table/Cell"
import { TableHeader } from "@/components/Table/Header"
import { TableHeaderCell } from "@/components/Table/Header/cell"
import { TableWrapper } from "@/components/Table/Wrapper"
import { SESSION_TYPE_TO_RESULT_COLUMN_MAP } from './constants'

export interface IResultsTableProps<T extends RowData> {
    rows: T[]
}

export const ResultsTable = <T extends IBaseResultsData>(props: IResultsTableProps<T> & { sessionType: ESessionType }) => {
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
                    <button type="submit" disabled className="btn btn-sm">
                        View laps
                    </button>
                </div>
            ) : (
                <button type="submit" className="btn btn-sm">
                    View laps
                </button>
            )}

            <TableWrapper className="border-2">
                <TableHeader>
                    <tr>
                        {getFlatHeaders().map(({ column, id, getContext }) => (
                            <TableHeaderCell className="text-start px-1" key={id}>
                                {flexRender(column.columnDef.header, getContext())}
                            </TableHeaderCell>
                        ))}
                    </tr>
                </TableHeader>
                <tbody>
                    {getRowModel().rows.map(({ id, getVisibleCells }) => (
                        <tr key={id}>
                            {getVisibleCells().map(({ id: cellId, column, getContext }) => (
                                <TableCell className="pl-1" key={cellId}>
                                    {flexRender(column.columnDef.cell, getContext())}
                                </TableCell>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </TableWrapper>
        </div>
    )
}
