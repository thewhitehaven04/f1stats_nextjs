import { useParams } from "next/navigation"
import { z } from "zod"
import type { GetLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPostData } from "@/client/generated"

type TSession =
    GetLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPostData["path"]["session"]

const sessionValidator = z.object({
    season: z.string(),
    event: z.string().transform((val) => decodeURIComponent(val)),
    session: z.string().transform((val) => decodeURIComponent(val))
})

export const useSession = () =>
    sessionValidator.parse(useParams()) as {
        season: string
        event: string
        session: TSession
    }
