import { NaLabel } from "@/shared/components/ValueOrNa"
import clsx from "clsx"

export const Slope = ({ value }: { value: number | null }) => {
    return value ? (
        <span className={clsx("px-1", value > 0 ? "text-red-400" : "text-green-400")}>
            {value.toFixed(3)}
        </span>
    ) : (
        <NaLabel />
    )
}
