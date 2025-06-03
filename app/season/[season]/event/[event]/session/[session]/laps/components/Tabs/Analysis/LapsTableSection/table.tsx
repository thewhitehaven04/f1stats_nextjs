import { ColumnVisibilityButton } from "@/components/Table/Toolbars/ColumnVisibilityButton"
import {
    flexRender,
    type TableOptions,
    useReactTable,
    getCoreRowModel,
} from "@tanstack/react-table"
import { memo, type ReactNode } from "react"
import type { ILapData } from "."
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TableContext } from "@/components/Table/context"
import clsx from "clsx"

function lapsTable(
    props: Omit<TableOptions<ILapData>, "getCoreRowModel"> & { children?: ReactNode },
) {
    const { children, ...options } = props
    const table = useReactTable<ILapData>({
        ...options,
        initialState: {
            ...options.initialState,
            columnPinning: {
                left: ["lap"],
            },
        },
        getCoreRowModel: getCoreRowModel(),
    })

    const { getHeaderGroups, getRowModel } = table

    const headerGroups = getHeaderGroups()
    const rowModel = getRowModel().rows

    return (
        /** @ts-ignore TanStack table types not being cooperative */
        <TableContext.Provider value={table}>
            <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-end gap-4">
                    <ColumnVisibilityButton />
                </div>
                <div className="overflow-auto max-h-[720px]">
                    <table data-slot="table" className="w-full caption-bottom text-sm">
                        <TableHeader className="border-b-[1px]">
                            {headerGroups.map((group) => (
                                <TableRow key={group.id} className="border-collapse border-b-0!">
                                    {group.headers.map((header) => (
                                        <TableHead
                                            className={clsx(
                                                "text-center sticky z-20 bg-white",
                                                group.depth === 0 ? "top-0" : "top-10",
                                            )}
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
                        <TableBody className="relative">
                            {rowModel.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => {
                                        return (
                                            <TableCell
                                                className={clsx(
                                                    "text-center",
                                                    cell.column.getIsPinned() === "left"
                                                        ? "sticky left-0 border-r-[1px] border-zinc-200 bg-white"
                                                        : "",
                                                )}
                                                key={cell.id}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </table>
                </div>
            </div>
        </TableContext.Provider>
    )
}

export const LapsTable = memo(lapsTable)
