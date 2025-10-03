import dbClient from "@/shared/client/db"

export async function fetchSessionInformation(session: string, season: number, event: string) {
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
