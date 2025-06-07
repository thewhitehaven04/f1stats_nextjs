import type { SessionIdentifier } from '@/client/generated'
import { useParams } from "next/navigation"
import { z } from "zod"

const sessionValidator = z.object({
    season: z.string(),
    event: z.string().transform((val) => decodeURIComponent(val)),
    session: z
        .string()
        .transform((val) => decodeURIComponent(val))
})

export const useSession = () => sessionValidator.parse(useParams())
