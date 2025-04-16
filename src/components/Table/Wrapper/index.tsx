import type { HTMLProps, ReactNode } from "react"

export const TableWrapper = ({
    children,
}: HTMLProps<HTMLTableElement> & { children?: ReactNode }) => {
    return (
        <table className="table table-zebra border-separate rounded-lg border-spacing-1 w-full overflow-x-scroll font-medium text-neutral-600">
            {children}
        </table>
    )
}
