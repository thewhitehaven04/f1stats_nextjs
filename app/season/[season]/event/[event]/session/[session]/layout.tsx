import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { format } from "date-fns/format"
import dbClient from "@/client/db"
import type { ISessionPathnameParams } from "./types"
import { SummaryItem } from "./SummaryItem"
import { Suspense } from "react"

const fetchSessionDataWithWeather = async (
    session: string,
    season: number,
    event: string,
) => {
    const eventSession = await dbClient.event_sessions.findFirstOrThrow({
        where: {
            session_type_id: session,
            season_year: season,
            event_name: event,
        },
        include: {
            session_weather_measurements: true,
            events: true,
        },
    })
    const sessionData = {
        sessionType: eventSession.session_type_id,
        startTime: eventSession.start_time,
        endTime: eventSession.end_time,
        eventName: eventSession.events.event_name,
        eventOfficialName: eventSession.events.event_official_name,
    }

    const endIndex = eventSession.session_weather_measurements.length - 1
    const weather = {
        airTempStart: eventSession.session_weather_measurements[0].air_temp,
        airTempEnd: eventSession.session_weather_measurements[endIndex].air_temp,
        trackTempStart: eventSession.session_weather_measurements[0].track_temp,
        trackTempEnd: eventSession.session_weather_measurements[endIndex].track_temp,
        humidityStart: eventSession.session_weather_measurements[0].humidity,
        humidityEnd: eventSession.session_weather_measurements[endIndex].humidity,
        airPressureStart: eventSession.session_weather_measurements[0].air_pressure,
        airPressureEnd: eventSession.session_weather_measurements[endIndex].air_pressure,
    }
    return { sessionData, weather }
}

export default async function SummaryLayout({
    params,
    children,
}: { params: Promise<ISessionPathnameParams>; children: React.ReactNode }) {
    const { season, session, event } = await params
    const { sessionData, weather } = await fetchSessionDataWithWeather(
        decodeURIComponent(session),
        Number.parseInt(season),
        decodeURIComponent(event),
    )
    return (
        <>
            <section className="flex flex-col gap-2 w-full overflow-x-visible">
                <Card className="mb-4">
                    <CardHeader>
                        <CardTitle>
                            {sessionData.eventName} - {sessionData.sessionType}
                        </CardTitle>
                        <CardDescription>Track conditions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <SummaryItem
                                label="Session run time"
                                value={`${format(sessionData.startTime, "MMM dd, yyyy HH:MM")} - ${format(sessionData.endTime, "HH:MM")}`}
                            />

                            <SummaryItem
                                label="Air temp (start - end)"
                                value={`${weather.airTempStart} - ${weather.airTempEnd}°C`}
                            />

                            <SummaryItem
                                label="Track temp (start - end)"
                                value={`${weather.trackTempStart} - ${weather.trackTempEnd}°C`}
                            />

                            <SummaryItem
                                label="Humidity (start - end)"
                                value={`${weather.humidityStart} - ${weather.humidityEnd}%`}
                            />
                        </div>
                    </CardContent>
                </Card>
            </section>
            <Suspense fallback={<div>Loading</div>}>{children}</Suspense>
        </>
    )
}
