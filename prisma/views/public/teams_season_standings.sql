SELECT
  teams.id,
  teams.team_display_name,
  sr.season_year,
  sum(rsr.points) AS sum
FROM
  (
    (
      (
        (
          (
            (
              race_session_results rsr
              JOIN session_results sr ON ((sr.id = rsr.id))
            )
            JOIN drivers d ON (((d.id) :: text = (sr.driver_id) :: text))
          )
          JOIN driver_team_changes dtc ON (((dtc.driver_id) :: text = (d.id) :: text))
        )
        JOIN teams ON ((teams.id = dtc.team_id))
      )
      JOIN team_season_colors tsc ON (
        (
          (tsc.season_year = sr.season_year)
          AND (tsc.team_id = teams.id)
        )
      )
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
WHERE
  (
    (dtc.timestamp_start <= es.start_time)
    AND (
      (dtc.timestamp_end >= es.end_time)
      OR (dtc.timestamp_end IS NULL)
    )
  )
GROUP BY
  teams.id,
  sr.season_year;