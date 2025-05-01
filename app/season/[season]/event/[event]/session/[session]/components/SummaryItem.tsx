import type { ReactNode } from "react"

interface ISummaryItemProps {
    label: ReactNode
    value: ReactNode
}

export function SummaryItem(props: ISummaryItemProps) {
    const { label, value } = props

    return (
        <div className="flex flex-col justify-center text-card-foreground">
            <span className='font-medium'>{label}</span>
            <span>{value}</span>
        </div>
    )
}
