"use client"

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
    type RowData,
} from "@tanstack/react-table"
import { useMemo } from "react"
import type { IBaseResultsData } from "../types"
import { TableCell } from "@/components/Table/Cell"
import { TableHeader } from "@/components/Table/Header"
import { TableHeaderCell } from "@/components/Table/Header/cell"
import { TableWrapper } from "@/components/Table/Wrapper"

const baseColumnHelper = createColumnHelper<IBaseResultsData>()

const baseColumns = [
    baseColumnHelper.display({
        id: "selector",
        cell: ({ row }) => (
            <div className="flex flex-row items-center py-1 justify-center">
                <input
                    className="checkbox"
                    type="checkbox"
                    name="driver"
                    value={row.getValue("driverNumber")}
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                />
            </div>
        ),
    }),
    baseColumnHelper.display({
        id: "position",
        header: () => "Pos",
        cell: ({ row }) => row.index + 1,
    }),
]

export interface IResultsTableProps<T extends RowData> {
    columns: ColumnDef<T>[]
    rows: T[]
}

export const ResultsTable = <T extends IBaseResultsData>(props: IResultsTableProps<T>) => {
    const { rows, columns } = props
    const mergedColumns = useMemo(() => [...baseColumns, ...columns], [columns]) as ColumnDef<T>[]

    const { getRowModel, getFlatHeaders, getIsSomeRowsSelected } = useReactTable<T>({
        data: rows,
        columns: mergedColumns,
        getRowId: (row) => row.driverNumber,
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
