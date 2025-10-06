import { NaLabel } from "@/shared/components/ValueOrNa"
import clsx from "clsx"
import { formatTime } from "@/shared/helpers/formatTime"
import type { ISectorProps } from './types'

export function SectorTime(props: ISectorProps) {
    const { value, isPersonalBest, isSessionBest } = props

    return (
        <span
            className={clsx("px-1", {
                "text-personal-best font-medium": isPersonalBest && !isSessionBest,
                "text-best font-medium": isSessionBest,
            })}
        >
            {value ? formatTime(value) : <NaLabel />}
        </span>
    )
}
