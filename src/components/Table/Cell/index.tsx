export function TableCell({ children, className, ...rest }: React.HTMLProps<HTMLTableCellElement>) {
    return (
        <td className={`p-0 first:rounded-l-lg last:rounded-r-lg ${className}`} {...rest}>
            {children}
        </td>
    )
}
