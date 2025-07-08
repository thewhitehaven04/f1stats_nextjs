import type { ReactNode } from "react"

interface ISummaryItemProps {
    label: ReactNode
    value: ReactNode
}

export function SummaryItem(props: ISummaryItemProps) {
    const { label, value } = props

    return (
        <div className="flex flex-col justify-center text-card-foreground">
            <div className="font-medium flex flex-row gap-2">{label}</div>
            <span className='pl-8'>{value}</span>
        </div>
    )
}
