SELECT
  laps.driver_id,
  laps.event_name,
  laps.session_type_id,
  laps.season_year,
  min(laps.sector_1_time) AS pb_s1,
  min(laps.sector_2_time) AS pb_s2,
  min(laps.sector_3_time) AS pb_s3,
  max(laps.speedtrap_1) AS pb_st1,
  max(laps.speedtrap_2) AS pb_st2,
  max(laps.speedtrap_fl) AS pb_stfl,
  min(laps.laptime) AS pb_laptime
FROM
  laps
GROUP BY
  laps.event_name,
  laps.session_type_id,
  laps.season_year,
  laps.driver_id;