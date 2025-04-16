import { NaLabel } from '@/components/ValueOrNa'
import { formatTime } from '@/core/helpers/formatTime'
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
                "bg-personal-best": isPersonalBest && !isSessionBest,
                "bg-best": isSessionBest,
                "bg-non-personal-best": isPersonalBest === false,
                "text-white": !!isSessionBest,
            })}
            {...rest}
        >
            {value ? formatTime(value) : <NaLabel />}
        </div>
    )
}
