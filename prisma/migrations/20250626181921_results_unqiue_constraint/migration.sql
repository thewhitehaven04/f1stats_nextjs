/*
  Warnings:

  - A unique constraint covering the columns `[driver_id,session_type_id,event_name,season_year]` on the table `session_results` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "session_results_driver_id_session_type_id_event_name_season_key" ON "session_results"("driver_id", "session_type_id", "event_name", "season_year");
