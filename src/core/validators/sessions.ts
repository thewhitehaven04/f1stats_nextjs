import { z } from "zod"

const sessionTypes = z.enum([
    "Practice 1",
    "Practice 2",
    "Practice 3",
    "Sprint",
    "Sprint Qualifying",
    "Sprint Shootout",
    "Qualifying",
    "Race",
])
export type TSessionType = z.infer<typeof sessionTypes>
export const SessionValidators = {
    sessionTypes,
}
