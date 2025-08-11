"use client"
import { useTableContext } from "@/components/Table/context"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { RowData } from "@tanstack/react-table"
import { LucideColumns3 } from "lucide-react"

export function ColumnVisibilityButton() {
    const { getAllLeafColumns } = useTableContext<RowData>()

    return (
        <Popover>
            <PopoverTrigger className="flex flex-row justify-start w-max" asChild>
                <Button type="button" variant="ghost" size="sm" className="flex flex-row gap-2">
                    <LucideColumns3 />
                    Columns
                </Button>
            </PopoverTrigger>
            <PopoverContent side='bottom' align='start' className="min-w-sm w-full">
                <h2 className="text-card-foreground mb-6">Columns</h2>
                <div className="grid grid-cols-[repeat(auto-fit,_minmax(124px,_1fr))] pl-4 grid-rows-8 grid-flow-col justify-stretch gap-6">
                    {getAllLeafColumns().map(
                        (column) =>
                            column.getCanHide() &&
                            typeof column.columnDef.header === "string" && (
                                <Label key={column.id} className="font-normal">
                                    <Checkbox
                                        checked={column.getIsVisible()}
                                        onCheckedChange={() => column.toggleVisibility()}
                                    />
                                    {column.parent &&
                                        typeof column.parent.columnDef.header === "string" &&
                                        column.parent.columnDef.header}
                                    , {column.columnDef.header}
                                </Label>
                            ),
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
