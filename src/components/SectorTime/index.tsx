import { NaLabel } from '@/components/ValueOrNa'
import { formatTime } from '@/core/helpers/formatTime'
import clsx from "clsx"

export interface ILaptimeProps {
    value: number | null
    isPersonalBest?: boolean
    isSessionBest?: boolean
}

export function SectorTime(props: ILaptimeProps) {
    const { value, isPersonalBest, isSessionBest } = props

    return (
        <span
            className={clsx("px-1", {
                "text-green-600 font-medium": isPersonalBest && !isSessionBest,
                "text-purple-600 font-medium": isSessionBest,
            })}
        >
            {value ? formatTime(value) : <NaLabel />}
        </span>
    )
}
