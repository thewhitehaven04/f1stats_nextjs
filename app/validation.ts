import { EventValidators } from '@/core/validators/events'
import { SessionValidators } from '@/core/validators/sessions'
import { z } from "zod"

export const eventsPopulatedWithSessionDataModel = z.array(
    z.object({
        event_format_name: EventValidators.eventFormats, 
        event_official_name: z.string(),
        event_name: z.string(),
        date_start: z.date(),
        country: z.string(),
        event_sessions: z.array(
            z.object({
                session_type_id: SessionValidators.sessionTypes,
            }),
        ),
    }),
)