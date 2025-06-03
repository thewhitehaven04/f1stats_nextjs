SELECT
  driver_id,
  event_name,
  session_type_id,
  season_year,
  min(sector_1_time) AS pb_s1,
  min(sector_2_time) AS pb_s2,
  min(sector_3_time) AS pb_s3,
  max(speedtrap_1) AS pb_st1,
  max(speedtrap_2) AS pb_st2,
  max(speedtrap_fl) AS pb_stfl,
  min(laptime) AS pb_laptime
FROM
  laps
GROUP BY
  event_name,
  session_type_id,
  season_year,
  driver_id;