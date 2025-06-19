import { useParams } from "next/navigation"
import { z } from "zod"
import type { GetLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPostData } from "@/client/generated"

type TSession =
    GetLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPostData["path"]["session"]

const sessionValidator = z.object({
    season: z.string(),
    event: z.string().transform((val) => decodeURIComponent(val)),
    session: z.custom<TSession>((val) =>
        [
            "Qualifying",
            "Race",
            "Sprint",
            "Sprint Qualifying",
            "Sprint Shootout",
            "Practice 1",
            "Practice 2",
            "Practice 3",
        ].includes(decodeURIComponent(val)),
    ),
})

export const useSession = () => sessionValidator.parse(useParams())
