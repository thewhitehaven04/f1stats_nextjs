import { format } from "date-fns/format"
import { SummaryItem } from "./components/SummaryItem"
import dbClient from "@/client/db"
import type { SessionIdentifier } from "@/client/generated"
import type { ISessionPathnameParams } from "./types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
const fetchSessionDataWithWeather = async (
    session: SessionIdentifier,
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
    const lastIndex = (eventSession.session_weather_measurements.length || 0) - 1
    const weather = {
        airTempStart: eventSession.session_weather_measurements[0].air_temp,
        airTempEnd: eventSession.session_weather_measurements[lastIndex].air_temp,
        trackTempStart: eventSession.session_weather_measurements[0].track_temp,
        trackTempEnd: eventSession.session_weather_measurements[lastIndex].track_temp,
        humidityStart: eventSession.session_weather_measurements[0].humidity,
        humidityEnd: eventSession.session_weather_measurements[lastIndex].humidity,
        airPressureStart: eventSession.session_weather_measurements[0].air_pressure,
        airPressureEnd: eventSession.session_weather_measurements[lastIndex].air_pressure,
    }
    return { weather, sessionData }
}

export default async function Layout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<ISessionPathnameParams>
}) {
    const { session, event, season } = await params
    const { weather, sessionData } = await fetchSessionDataWithWeather(
        decodeURIComponent(session) as SessionIdentifier,
        Number.parseInt(season),
        decodeURIComponent(event),
    )
    return (
        <>
            <Card className='mb-4'>
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
            {children}
        </>
    )
}
