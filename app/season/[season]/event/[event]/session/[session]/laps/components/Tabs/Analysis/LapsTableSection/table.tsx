"use client"

import { ColumnVisibilityButton } from "@/components/Table/Toolbars/ColumnVisibilityButton"
import {
    flexRender,
    type TableOptions,
    useReactTable,
    getCoreRowModel,
} from "@tanstack/react-table"
import { memo, useEffect, useRef, useState, type ReactNode } from "react"
import type { ILapData } from "."
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TableContext } from "@/components/Table/context"
import clsx from "clsx"
import { Button } from "@/components/ui/button"

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

    const [showScroll, setShowScroll] = useState(false)

    const tableRef = useRef<HTMLTableElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const intersectionObserverRef = useRef<IntersectionObserver | null>(
        new IntersectionObserver((entries) => {
            const hasIntersectingEntries = entries.find((entry) => entry.isIntersecting)
            if (hasIntersectingEntries) {
                setShowScroll(true)
            } else {
                setShowScroll(false)
            }
        }),
    )

    const { getHeaderGroups, getRowModel } = table

    const headerGroups = getHeaderGroups()
    const rowModel = getRowModel().rows

    useEffect(() => {
        if (tableRef.current) intersectionObserverRef.current?.observe(tableRef.current)
    }, [])

    const handleScroll = (direction: "left" | "right") => {
        containerRef.current?.scrollBy({
            behavior: "smooth",
            left: direction === "left" ? -300 : 300,
        })
    }

    return (
        /** @ts-ignore TanStack table types not being cooperative */
        <TableContext.Provider value={table}>
            <div className="flex flex-col gap-2">
                <div className="flex flex-row justify-end gap-4 mb-2">
                    <ColumnVisibilityButton />
                </div>
                <div className="overflow-auto max-h-[720px]" ref={containerRef}>
                    <table
                        data-slot="table"
                        className="w-full caption-bottom text-sm relative"
                        ref={tableRef}
                    >
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
                                                        ? "sticky left-0 border-r-[1px] border-zinc-200 bg-white z-10"
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
                {showScroll && (
                    <div className="flex flex-row justify-between">
                        <Button variant="ghost" size="sm" onClick={() => handleScroll("left")}>
                            {"<"}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleScroll("right")}>
                            {">"}
                        </Button>
                    </div>
                )}
            </div>
        </TableContext.Provider>
    )
}

export const LapsTable = memo(lapsTable)
