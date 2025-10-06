import { NaLabel } from "@/shared/components/ValueOrNa"
import clsx from "clsx"
import type { ILaptimeProps } from './types'
import { formatTime } from '@/shared/helpers/formatTime'
export function Laptime({
    className,
    isPersonalBest,
    isSessionBest,
    value,
    ...rest
}: ILaptimeProps) {
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
