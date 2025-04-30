import { ColumnVisibilityButton } from "@/components/Table/Toolbars/ColumnVisibilityButton"
import {
    flexRender,
    type TableOptions,
    useReactTable,
    getCoreRowModel,
} from "@tanstack/react-table"
import type { ReactNode } from "react"
import type { ILapData } from "."
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TableContext } from '@/components/Table/context'

export function LapsTable(
    props: Omit<TableOptions<ILapData>, "getCoreRowModel"> & { toolbar?: ReactNode },
) {
    const { toolbar, ...options } = props
    const table = useReactTable<ILapData>({
        ...options,
        getCoreRowModel: getCoreRowModel(),
    })

    const { getHeaderGroups, getRowModel } = table

    const headerGroups = getHeaderGroups()
    const rowModel = getRowModel().rows

    return (
        <TableContext.Provider value={table}>
            <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-end gap-4">
                    {
                        <>
                            <ColumnVisibilityButton />
                            {toolbar}
                        </>
                    }
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {headerGroups.map((group) => (
                                <TableRow key={group.id}>
                                    {group.headers.map((header) => (
                                        <TableHead
                                            className="text-center"
                                            key={header.id}
                                            colSpan={header.colSpan}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {rowModel.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell className="text-center"  key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </TableContext.Provider>
    )
}
