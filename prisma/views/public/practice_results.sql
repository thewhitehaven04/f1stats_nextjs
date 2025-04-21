SELECT
  sr.id,
  sr.driver_id,
  psr.gap,
  psr.laptime,
  d.country_alpha3,
  concat(d.first_name, ' ', d.last_name) AS driver_full_name,
  t.team_display_name,
  sr.event_name,
  sr.season_year,
  sr.session_type_id
FROM
  (
    (
      (
        (
          (
            (
              session_results sr
              JOIN practice_session_results psr ON ((sr.id = psr.id))
            )
            JOIN event_sessions es ON (
              (
                (es.event_name = sr.event_name)
                AND (es.season_year = sr.season_year)
                AND (
                  (es.session_type_id) :: text = (sr.session_type_id) :: text
                )
              )
            )
          )
          JOIN drivers d ON (((sr.driver_id) :: text = (d.id) :: text))
        )
        JOIN driver_team_changes dtc ON (
          (
            (dtc.timestamp_start <= es.start_time)
            AND (
              (dtc.timestamp_end >= es.start_time)
              OR (dtc.timestamp_end IS NULL)
            )
            AND ((dtc.driver_id) :: text = (d.id) :: text)
          )
        )
      )
      JOIN teams t ON ((t.id = dtc.team_id))
    )
    JOIN driver_numbers dn ON (
      (
        ((dn.driver_id) :: text = (d.id) :: text)
        AND (dn.season_year = sr.season_year)
      )
    )
  )
ORDER BY
  psr.laptime;


SELECT laps.id, laps.lap_number, laps.stint, laps.event_name, laps.compound_id, laps.driver_id, laps.session_type_id, laps.sector_1_time, laps.sector_2_time, laps.sector_3_time, laps.speedtrap_1, laps.speedtrap_2, laps.speedtrap_fl, laps.season_year, laps.laptime, laps.pit_in_time, laps.pit_out_time, laps.is_inlap, laps.is_outlap, teams.id AS id_1, teams.team_display_name
FROM laps 
  JOIN drivers ON laps.driver_id = drivers.id 
  JOIN event_sessions ON event_sessions.event_name = %(event_name_1)s AND event_sessions.season_year = %(season_year_1)s AND event_sessions.session_type_id = %(session_type_id_1)s 
  JOIN driver_team_changes ON driver_team_changes.driver_id = drivers.id AND driver_team_changes.timestamp_start <= event_sessions.start_time AND (driver_team_changes.timestamp_end >= event_sessions.start_time OR driver_team_changes.timestamp_end IS %(timestamp_end_1)s) 
  JOIN teams ON driver_team_changes.team_id = teams.id
WHERE laps.season_year = %(season_year_2)s AND laps.session_type_id = %(session_type_id_2)s AND laps.event_name = %(event_name_2)s