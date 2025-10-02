export type TDriverRow = Array<{
    driverId: string 
    points: number
    position: string | null
}> 

export type TSessionResultResponse = {
    season_year: number
    event_name: string
    driver_id: string
    points: number
    classified_position: string | null
    gap: number | null
    timestamp_start: Date
    timestamp_end: Date | null
    start_time: Date
    end_time: Date | null
    session_type_id: "Race" | "Sprint"
    team_display_name: string
}
