SELECT
  laps.event_name,
  laps.session_type_id,
  laps.season_year,
  min(laps.sector_1_time) AS min_s1,
  min(laps.sector_2_time) AS min_s2,
  min(laps.sector_3_time) AS min_s3,
  max(laps.speedtrap_1) AS best_st1,
  max(laps.speedtrap_2) AS best_st2,
  max(laps.speedtrap_fl) AS best_stfl,
  min(laps.laptime) AS best_laptime
FROM
  laps
GROUP BY
  laps.event_name,
  laps.session_type_id,
  laps.season_year;