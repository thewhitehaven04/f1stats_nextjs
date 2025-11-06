import type { TFetchSessionResults } from "./types"

export const getRowDataFromPractice = (data: NonNullable<TFetchSessionResults[number]>) => {
    return {
        driver: {
            country: data.drivers?.country_alpha3 || "",
            name: `${data.drivers?.first_name} ${data.drivers?.last_name}` || "",
            id: data.drivers?.id || "",
        },
        teamName: data.drivers?.driver_team_changes[0].teams
            ? {
                  name: data.drivers?.driver_team_changes[0].teams.team_display_name || "",
                  id: data.drivers?.driver_team_changes[0].teams.id,
              }
            : null,
        time: data.practice_session_results ? data.practice_session_results.laptime : 0,
        gap: data.practice_session_results ? data.practice_session_results.gap : 0,
    }
}

export const getRowDataFromQualifying = (data: NonNullable<TFetchSessionResults[number]>) => {
    return {
        driver: {
            country: data.drivers?.country_alpha3 || "",
            name: `${data.drivers?.first_name} ${data.drivers?.last_name}` || "",
            id: data.drivers?.id || "",
        },
        teamName: data.drivers?.driver_team_changes[0].teams
            ? {
                  name: data.drivers?.driver_team_changes[0].teams.team_display_name || "",
                  id: data.drivers?.driver_team_changes[0].teams.id,
              }
            : null,
        q1Time: data.qualifying_session_results?.q1_laptime ?? null,
        q2Time: data.qualifying_session_results?.q2_laptime ?? null,
        q3Time: data.qualifying_session_results?.q3_laptime ?? null,
    }
}

export const getRowDataFromRace = (data: NonNullable<TFetchSessionResults[number]>) => {
    return {
        driver: {
            country: data.drivers?.country_alpha3 || "",
            name: `${data.drivers?.first_name} ${data.drivers?.last_name}` || "",
            id: data.drivers?.id || "",
        },
        gap: data.race_session_results ? data.race_session_results.gap : null,
        teamName: data.drivers?.driver_team_changes[0].teams
            ? {
                  name: data.drivers?.driver_team_changes[0].teams.team_display_name || "",
                  id: data.drivers?.driver_team_changes[0].teams.id,
              }
            : null,
        time: data.race_session_results ? data.race_session_results.total_time : null,
        status: data.race_session_results?.result_status ?? null,
        points: data.race_session_results?.points ?? null,
        gridPosition: data.race_session_results?.grid_position ?? null,
    }
}
