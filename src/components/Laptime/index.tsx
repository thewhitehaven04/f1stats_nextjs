import { NaLabel } from '@/components/ValueOrNa'
import { formatTime } from '../../../shared/helpers/formatTime'
import clsx from "clsx"
import type { HTMLAttributes } from "react"
export interface ILaptimeProps extends HTMLAttributes<HTMLDivElement> {
    isPersonalBest?: boolean
    isSessionBest?: boolean
    value: number | null | undefined
}

export function Laptime({ className, isPersonalBest, isSessionBest, value, ...rest }: ILaptimeProps) {
    return (
        <div
            className={clsx(className, "px-1", "overflow-hidden", {
                "text-personal-best font-medium": isPersonalBest && !isSessionBest,
                "text-best font-medium": isSessionBest,
                "text-non-personal-best font-medium": isPersonalBest === false,
                "text-black font-medium": !!isSessionBest,
            })}
            {...rest}
        >
            {value ? formatTime(value) : <NaLabel />}
        </div>
    )
}
