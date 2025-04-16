import { z } from "zod"

const eventFormats = z.enum([
    "conventional",
    "testing",
    "sprint_qualifying",
    "sprint",
    "sprint_shootout",
])
export type TEventFormat = z.infer<typeof eventFormats>

export const EventValidators = {
    eventFormats
}
