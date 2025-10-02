import type { TSeasonEvent } from '@/modules/SeasonCalendar/fetcher/fetcher'
import type { TMappedSeasonEvent } from "./types"

export const mapSeasonEvents = (event: TSeasonEvent): TMappedSeasonEvent => {
    const rest = {
        name: event.event_name,
        officialName: event.event_official_name,
        country: event.country,
        season: event.season_year,
        dateStart: event.date_start,
    }
    if (event.event_format_name === "conventional") {
        return {
            ...rest,
            format: event.event_format_name,
            sessions: {
                fp1:
                    event.event_sessions.find((s) => s.session_type_id === "Practice 1")
                        ?.session_type_id || "",
                fp2:
                    event.event_sessions.find((s) => s.session_type_id === "Practice 2")
                        ?.session_type_id || "",
                fp3:
                    event.event_sessions.find((s) => s.session_type_id === "Practice 3")
                        ?.session_type_id || "",
                quali:
                    event.event_sessions.find((s) => s.session_type_id === "Qualifying")
                        ?.session_type_id || "",
                race:
                    event.event_sessions.find((s) => s.session_type_id === "Race")
                        ?.session_type_id || "",
            },
        }
    }

    if (
        event.event_format_name === "sprint_shootout" ||
        event.event_format_name === "sprint_qualifying"
    ) {
        return {
            ...rest,
            format: event.event_format_name,
            sessions: {
                fp1:
                    event.event_sessions.find((s) => s.session_type_id === "Practice 1")
                        ?.session_type_id || "",
                sprintQuali:
                    event.event_sessions.find((s) => s.session_type_id === "Sprint Qualifying")
                        ?.session_type_id || "",
                sprint:
                    event.event_sessions.find((s) => s.session_type_id === "Sprint")
                        ?.session_type_id || "",
                quali:
                    event.event_sessions.find((s) => s.session_type_id === "Qualifying")
                        ?.session_type_id || "",
                race:
                    event.event_sessions.find((s) => s.session_type_id === "Race")
                        ?.session_type_id || "",
            },
        }
    }

    if (event.event_format_name === "sprint") {
        return {
            ...rest,
            format: event.event_format_name,
            sessions: {
                fp1:
                    event.event_sessions.find((s) => s.session_type_id === "Practice 1")
                        ?.session_type_id || "",
                sprintQuali:
                    event.event_sessions.find((s) => s.session_type_id === "Sprint")
                        ?.session_type_id || "",
                quali:
                    event.event_sessions.find((s) => s.session_type_id === "Qualifying")
                        ?.session_type_id || "",
                fp2:
                    event.event_sessions.find((s) => s.session_type_id === "Practice 2")
                        ?.session_type_id || "",
                race:
                    event.event_sessions.find((s) => s.session_type_id === "Race")
                        ?.session_type_id || "",
            },
        }
    }
    if (event.event_format_name === "testing") {
        return {
            ...rest,
            format: event.event_format_name,
            sessions: {
                fp1:
                    event.event_sessions.find((s) => s.session_type_id === "Practice 1")
                        ?.session_type_id || "",
                fp2:
                    event.event_sessions.find((s) => s.session_type_id === "Practice 2")
                        ?.session_type_id || "",
                fp3:
                    event.event_sessions.find((s) => s.session_type_id === "Practice 3")
                        ?.session_type_id || "",
            },
        }
    }
    throw new Error("Unknown event format")
}
