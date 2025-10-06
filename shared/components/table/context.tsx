'use client'
import type { RowData, Table } from "@tanstack/react-table"
import { createContext, useContext } from "react"

export const TableContext = createContext<Table<RowData> | null>(null)

export function useTableContext<T extends RowData>() {
    const tableContext = useContext(TableContext)

    if (!tableContext) {
        throw new Error("useTableContext must be used within a TableContext.Provider")
    }

    return tableContext as Table<T> 
}