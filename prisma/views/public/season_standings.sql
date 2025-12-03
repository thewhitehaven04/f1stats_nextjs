SELECT
  sr.driver_id,
  sr.season_year,
  sum(rsr.points) AS sum
FROM
  (
    (
      race_session_results rsr
      JOIN session_results sr ON ((sr.id = rsr.id))
    )
    JOIN drivers d ON (((d.id) :: text = (sr.driver_id) :: text))
  )
GROUP BY
  sr.driver_id,
  sr.season_year;