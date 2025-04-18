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