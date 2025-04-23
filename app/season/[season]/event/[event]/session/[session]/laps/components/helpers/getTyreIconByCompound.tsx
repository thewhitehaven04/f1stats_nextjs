import { HardTyreIcon } from "@/components/Icons/tyres/Hard"
import { IntermediateTyreIcon } from "@/components/Icons/tyres/Intermediate"
import { MediumTyreIcon } from "@/components/Icons/tyres/Medium"
import { SoftTyreIcon } from "@/components/Icons/tyres/Soft"
import type { ITyreIconProps } from "@/components/Icons/tyres/types"
import { WetTyreIcon } from "@/components/Icons/tyres/Wet"

export function getTyreComponentByCompound(
    compound: string | null,
): React.FunctionComponent<ITyreIconProps> | null {
    switch (compound) {
        case "SOFT":
            return SoftTyreIcon
        case "MEDIUM":
            return MediumTyreIcon
        case "HARD":
            return HardTyreIcon
        case "INTERMEDIATE":
            return IntermediateTyreIcon
        case "WET":
            return WetTyreIcon
        default:
            return null
    }
}
