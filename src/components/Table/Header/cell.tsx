import clsx from "clsx"
import type { HTMLProps } from "react"

export const TableHeaderCell = ({ children, className, ...rest }: HTMLProps<HTMLTableCellElement>) => {
    return (
        <th className={clsx("bg-base-100 py-2", className)} {...rest}>
            {children}
        </th>
    )
}
