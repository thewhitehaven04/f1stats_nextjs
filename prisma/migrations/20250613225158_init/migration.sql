-- CreateTable
CREATE TABLE "compounds" (
    "id" VARCHAR(16) NOT NULL,

    CONSTRAINT "compounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "driver_numbers" (
    "driver_id" VARCHAR(64) NOT NULL,
    "season_year" SMALLINT NOT NULL,
    "driver_number" SMALLINT NOT NULL,

    CONSTRAINT "driver_numbers_pkey" PRIMARY KEY ("driver_id","season_year")
);

-- CreateTable
CREATE TABLE "driver_team_changes" (
    "driver_id" VARCHAR(64) NOT NULL,
    "timestamp_start" TIMESTAMP(6) NOT NULL,
    "timestamp_end" TIMESTAMP(6),
    "team_id" SMALLINT NOT NULL,

    CONSTRAINT "driver_team_changes_pkey" PRIMARY KEY ("driver_id","timestamp_start")
);

-- CreateTable
CREATE TABLE "drivers" (
    "id" VARCHAR(64) NOT NULL,
    "country_alpha3" VARCHAR(3) NOT NULL,
    "abbreviation" VARCHAR(3) NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,

    CONSTRAINT "drivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_formats" (
    "event_format_name" VARCHAR(32) NOT NULL,

    CONSTRAINT "event_formats_pkey" PRIMARY KEY ("event_format_name")
);

-- CreateTable
CREATE TABLE "event_sessions" (
    "event_name" TEXT NOT NULL,
    "season_year" SMALLINT NOT NULL,
    "session_type_id" VARCHAR(32) NOT NULL,
    "start_time" TIMESTAMP(6) NOT NULL,
    "end_time" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "event_sessions_pkey" PRIMARY KEY ("event_name","season_year","session_type_id")
);

-- CreateTable
CREATE TABLE "events" (
    "event_name" TEXT NOT NULL,
    "event_official_name" TEXT NOT NULL,
    "date_start" DATE NOT NULL,
    "country" VARCHAR(3) NOT NULL,
    "season_year" SMALLINT NOT NULL,
    "event_format_name" VARCHAR(32) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("event_name","season_year")
);

-- CreateTable
CREATE TABLE "laps" (
    "id" BIGSERIAL NOT NULL,
    "lap_number" SMALLINT NOT NULL,
    "sector_1_time" REAL,
    "sector_2_time" REAL,
    "sector_3_time" REAL,
    "speedtrap_1" SMALLINT,
    "speedtrap_2" SMALLINT,
    "speedtrap_fl" SMALLINT,
    "stint" SMALLINT NOT NULL,
    "event_name" TEXT NOT NULL,
    "compound_id" VARCHAR(16) NOT NULL,
    "driver_id" VARCHAR(64) NOT NULL,
    "session_type_id" VARCHAR(32) NOT NULL,
    "season_year" SMALLINT,
    "laptime" REAL GENERATED ALWAYS AS ((sector_1_time + sector_2_time) + sector_3_time) STORED,
    "pit_in_time" REAL,
    "pit_out_time" REAL,
    "is_inlap" BOOLEAN GENERATED ALWAYS AS (pit_in_time IS NOT NULL) STORED,
    "is_outlap" BOOLEAN GENERATED ALWAYS AS (pit_out_time IS NOT NULL) STORED,

    CONSTRAINT "laps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "practice_session_results" (
    "id" SERIAL NOT NULL,
    "laptime" REAL,
    "gap" REAL,

    CONSTRAINT "practice_session_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qualifying_session_results" (
    "id" SERIAL NOT NULL,
    "q1_laptime" REAL,
    "q2_laptime" REAL,
    "q3_laptime" REAL,
    "position" SMALLINT,

    CONSTRAINT "qualifying_session_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "race_session_results" (
    "id" SERIAL NOT NULL,
    "total_time" REAL,
    "result_status" TEXT,
    "classified_position" TEXT,
    "points" SMALLINT,
    "gap" REAL,
    "grid_position" SMALLINT DEFAULT 0,

    CONSTRAINT "race_session_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seasons" (
    "season_year" SMALLINT NOT NULL,
    "description_text" TEXT,

    CONSTRAINT "seasons_pkey" PRIMARY KEY ("season_year")
);

-- CreateTable
CREATE TABLE "session_results" (
    "id" SERIAL NOT NULL,
    "event_name" TEXT,
    "season_year" SMALLINT,
    "session_type_id" VARCHAR(32),
    "driver_id" VARCHAR(64),

    CONSTRAINT "session_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_types" (
    "id" VARCHAR(32) NOT NULL,

    CONSTRAINT "session_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_weather_measurements" (
    "event_name" TEXT NOT NULL,
    "season_year" SMALLINT NOT NULL,
    "session_type_id" VARCHAR(32) NOT NULL,
    "time_at" REAL NOT NULL,
    "humidity" SMALLINT NOT NULL,
    "air_pressure" SMALLINT NOT NULL,
    "track_temp" SMALLINT NOT NULL,
    "air_temp" SMALLINT NOT NULL,

    CONSTRAINT "session_weather_measurements_pkey" PRIMARY KEY ("time_at","event_name","season_year","session_type_id")
);

-- CreateTable
CREATE TABLE "team_season_colors" (
    "team_id" SMALLINT NOT NULL,
    "season_year" SMALLINT NOT NULL,
    "color" CHAR(7) NOT NULL,

    CONSTRAINT "team_season_colors_pkey" PRIMARY KEY ("team_id","season_year")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" SMALLSERIAL NOT NULL,
    "team_display_name" VARCHAR(64),

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telemetry_measurements" (
    "lap_id" BIGINT NOT NULL,
    "laptime_at" REAL NOT NULL,
    "speed" REAL NOT NULL,
    "rpm" SMALLINT NOT NULL,
    "brake" SMALLINT NOT NULL,
    "throttle" SMALLINT NOT NULL,
    "distance" REAL NOT NULL,
    "gear" SMALLINT NOT NULL,

    CONSTRAINT "telemetry_measurements_pkey" PRIMARY KEY ("lap_id","laptime_at")
);

-- CreateIndex
CREATE UNIQUE INDEX "session_type_id_event_name_season_year_driver_id_lap_number_uni" ON "laps"("session_type_id", "season_year", "event_name", "driver_id", "lap_number");

-- CreateIndex
CREATE UNIQUE INDEX "teams_team_display_name_key" ON "teams"("team_display_name");

-- AddForeignKey
ALTER TABLE "driver_numbers" ADD CONSTRAINT "fk_driver_id" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "driver_numbers" ADD CONSTRAINT "fk_season_year" FOREIGN KEY ("season_year") REFERENCES "seasons"("season_year") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "driver_team_changes" ADD CONSTRAINT "fk_driver_id" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "driver_team_changes" ADD CONSTRAINT "fk_team_id" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_sessions" ADD CONSTRAINT "fk_event_name_season_year" FOREIGN KEY ("event_name", "season_year") REFERENCES "events"("event_name", "season_year") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_sessions" ADD CONSTRAINT "fk_session_type_id" FOREIGN KEY ("session_type_id") REFERENCES "session_types"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "fk_event_format_name" FOREIGN KEY ("event_format_name") REFERENCES "event_formats"("event_format_name") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "fk_season_year" FOREIGN KEY ("season_year") REFERENCES "seasons"("season_year") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "laps" ADD CONSTRAINT "fk_compound_id" FOREIGN KEY ("compound_id") REFERENCES "compounds"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "laps" ADD CONSTRAINT "fk_driver_id" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "laps" ADD CONSTRAINT "fk_event_name_season_year" FOREIGN KEY ("event_name", "season_year") REFERENCES "events"("event_name", "season_year") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "laps" ADD CONSTRAINT "fk_session_type_id" FOREIGN KEY ("session_type_id") REFERENCES "session_types"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "practice_session_results" ADD CONSTRAINT "fk_session_result_id" FOREIGN KEY ("id") REFERENCES "session_results"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "qualifying_session_results" ADD CONSTRAINT "fk_session_result_id" FOREIGN KEY ("id") REFERENCES "session_results"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "race_session_results" ADD CONSTRAINT "fk_session_result_id" FOREIGN KEY ("id") REFERENCES "session_results"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "session_results" ADD CONSTRAINT "fk_driver_id" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "session_results" ADD CONSTRAINT "fk_event_sessions_event_name_season_year_session_type_id" FOREIGN KEY ("event_name", "season_year", "session_type_id") REFERENCES "event_sessions"("event_name", "season_year", "session_type_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "session_weather_measurements" ADD CONSTRAINT "fk_event_name_season_year_session_type_id_event_sessions" FOREIGN KEY ("event_name", "season_year", "session_type_id") REFERENCES "event_sessions"("event_name", "season_year", "session_type_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team_season_colors" ADD CONSTRAINT "fk_seasons_season_year" FOREIGN KEY ("season_year") REFERENCES "seasons"("season_year") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team_season_colors" ADD CONSTRAINT "fk_teams_id" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "telemetry_measurements" ADD CONSTRAINT "fk_lap_id" FOREIGN KEY ("lap_id") REFERENCES "laps"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
