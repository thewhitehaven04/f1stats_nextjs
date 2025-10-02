import dbClient from '@/shared/client/db'
import type { TDriverRow, TSessionResultResponse } from './types'
// TODO: replace it with a proper model
export const fetchTeamSeasonForm = async (season: string, team: string) => {
    const parsedTeam = Number.parseInt(team)
    const parsedSeason = Number.parseInt(season)

    const [results, sessions] = await Promise.all([
        dbClient.$queryRaw`
        SELECT e.season_year, 
                e.event_name, 
                d.id as driver_id, 
                rsr.points, 
                rsr.classified_position, 
                rsr.gap, 
                dtc.timestamp_start, 
                dtc.timestamp_end, 
                es.start_time, 
                es.end_time,
                es.session_type_id,
                t.team_display_name 
        FROM race_session_results AS rsr
        INNER JOIN session_results AS sr ON sr.id = rsr.id
        INNER JOIN drivers AS d ON sr.driver_id = d.id
        INNER JOIN driver_team_changes AS dtc ON d.id = dtc.driver_id
        INNER JOIN events AS e ON e.event_name = sr.event_name
        INNER JOIN teams AS t ON t.id = dtc.team_id
        AND e.season_year = sr.season_year
        INNER JOIN event_sessions AS es ON es.event_name = e.event_name
        AND es.season_year = e.season_year
        AND es.session_type_id = sr.session_type_id
        WHERE e.season_year = ${parsedSeason}
        AND dtc.team_id = ${parsedTeam}
        AND dtc.timestamp_start <= es.start_time
        AND (
            dtc.timestamp_end >= es.end_time
            OR dtc.timestamp_end IS NULL
        )
        ORDER BY d.id ASC, es.start_time ASC
        ` as Promise<TSessionResultResponse[]>,
        dbClient.event_sessions.findMany({
            where: {
                season_year: parsedSeason,
                session_type_id: {
                    in: ["Race", "Sprint"],
                },
            },
            include: {
                events: {
                    select: {
                        country: true,
                    },
                },
            },
            orderBy: {
                start_time: "asc",
            },
        }),
    ])

    const eventPoints: TDriverRow[] = []
    const seasonEvents: string[] = []
    sessions.forEach((event) => {
        const raceResults = results.filter(
            (res) =>
                res.event_name === event.event_name &&
                res.season_year === event.season_year &&
                res.session_type_id === event.session_type_id,
        )

        const racePoints: TDriverRow = raceResults.map((result) => ({
            points: result.points || 0,
            position: result.classified_position,
            driverId: result.driver_id || "",
        }))

        eventPoints.push(racePoints)

        seasonEvents.push(
            event.session_type_id === "Sprint"
                ? `${event.events.country} (${event.session_type_id})`
                : event.events.country,
        )
    })
    const driverCount = Math.max(...eventPoints.map((column) => column.length))

    return { eventPoints, seasonEvents, driverCount, teamName: results[0].team_display_name }
}