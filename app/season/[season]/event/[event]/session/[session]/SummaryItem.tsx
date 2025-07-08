import type { ReactNode } from "react"

interface ISummaryItemProps {
    label: ReactNode
    value: ReactNode
    icon: ReactNode
}

export function SummaryItem(props: ISummaryItemProps) {
    const { label, value, icon } = props

    return (
        <div className="flex flex-row gap-4 justify-start items-center">
            {icon}
            <div className="flex flex-col">
                <div className="font-medium flex flex-row gap-2">{label}</div>
                <span>{value}</span>
            </div>
        </div>
    )
}
