SELECT
  event_name,
  session_type_id,
  season_year,
  min(sector_1_time) AS min_s1,
  min(sector_2_time) AS min_s2,
  min(sector_3_time) AS min_s3,
  max(speedtrap_1) AS best_st1,
  max(speedtrap_2) AS best_st2,
  max(speedtrap_fl) AS best_stfl,
  min(laptime) AS best_laptime
FROM
  laps
GROUP BY
  event_name,
  session_type_id,
  season_year;