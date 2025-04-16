import { SessionValidators } from '@/core/validators/sessions'
import { z } from 'zod'


export const sessionDataValidator = z.object({
    sessionType: SessionValidators.sessionTypes,
    startTime: z.date(),
    endTime: z.date(),
    eventName: z.string(),
    eventOfficialName: z.string(),
})

export const weatherValidator = z.object({
    airTempStart: z.number(),
    airTempEnd: z.number(),
    trackTempStart: z.number(),
    trackTempEnd: z.number(),
    humidityStart: z.number(), 
    humidityEnd: z.number(),
    airPressureStart: z.number(),
    airPressureEnd: z.number(),
})
