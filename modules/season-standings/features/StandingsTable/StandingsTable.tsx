"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/uiComponents/table"
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import type { TStandingsTableProps } from "./types"
import {
    DRIVER_STANDINGS_COLUMN_ORDER,
    DRIVER_STANDINGS_COLUMNS,
    TEAM_STANDINGS_COLUMN_ORDER,
    TEAM_STANDINGS_COLUMNS,
} from "./columns"

export const StandingsTable = ({ type, rows }: TStandingsTableProps) => {
    const { getRowModel, getFlatHeaders } = useReactTable({
        columns: type === "driver" ? DRIVER_STANDINGS_COLUMNS : TEAM_STANDINGS_COLUMNS,
        data: rows,
        getCoreRowModel: getCoreRowModel(),
        initialState: {
            columnOrder:
                type === "driver" ? DRIVER_STANDINGS_COLUMN_ORDER : TEAM_STANDINGS_COLUMN_ORDER,
        },
        enableColumnResizing: false,
    })

    return (
        <Table className="rounded-md overflow-hidden">
            <TableHeader>
                <TableRow>
                    {getFlatHeaders().map(({ column, id, getContext }) => (
                        <TableHead
                            className="text-start px-1 bg-primary-foreground"
                            style={{ width: `${column.getSize()}px` }}
                            key={id}
                        >
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
    )
}
