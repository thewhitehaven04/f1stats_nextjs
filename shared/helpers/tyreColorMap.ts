import type { Compound } from '@/shared/client/generated'

export const TYRE_COLOR_MAP: Record<Compound, string> = {
    SOFT: "#e32526",
    MEDIUM: "#ffe826",
    HARD: "#fdfffe",
    WET: "#0e629e",
    INTERMEDIATE: "#148f37",
    TEST_UNKNOWN: "#FFFFFF",
    UNKNOWN: "#FFFFFF",
}
