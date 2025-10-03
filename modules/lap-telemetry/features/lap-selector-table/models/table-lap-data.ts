import type { ITableLapData } from "@/modules/lap-telemetry/features/lap-selector-table/models/types"
import type { DriverLapData } from "@/shared/client/generated"

export function mapLapsToTableLapData(laps: DriverLapData[]): ITableLapData[] {
    const flattenedLaps: ITableLapData[] = []

    for (const driver of laps) {
        driver.laps.forEach((lap, index) => {
            if (!flattenedLaps[index]) {
                flattenedLaps[index] = {}
            }

            flattenedLaps[index][`${driver.driver}.LapId`] = lap.id
            flattenedLaps[index][`${driver.driver}.LapTime`] = lap.laptime
            flattenedLaps[index][`${driver.driver}.IsPB`] = lap.is_pb
            flattenedLaps[index][`${driver.driver}.Sector1Time`] = lap.sector_1_time
            flattenedLaps[index][`${driver.driver}.ST1`] = lap.speedtrap_1
            flattenedLaps[index][`${driver.driver}.Sector2Time`] = lap.sector_2_time
            flattenedLaps[index][`${driver.driver}.ST2`] = lap.sector_2_time
            flattenedLaps[index][`${driver.driver}.Sector3Time`] = lap.sector_3_time
            flattenedLaps[index][`${driver.driver}.ST3`] = lap.sector_3_time
            flattenedLaps[index][`${driver.driver}.IsBestS1`] = lap.is_best_s1
            flattenedLaps[index][`${driver.driver}.IsBestS2`] = lap.is_best_s2
            flattenedLaps[index][`${driver.driver}.IsBestS3`] = lap.is_best_s3
            flattenedLaps[index][`${driver.driver}.IsBestST1`] = lap.is_best_st1
            flattenedLaps[index][`${driver.driver}.IsBestST2`] = lap.is_best_st2
            flattenedLaps[index][`${driver.driver}.IsBestST3`] = lap.is_best_stfl
            flattenedLaps[index][`${driver.driver}.IsPBS1`] = lap.is_personal_best_s1
            flattenedLaps[index][`${driver.driver}.IsPBS2`] = lap.is_personal_best_s2
            flattenedLaps[index][`${driver.driver}.IsPBS3`] = lap.is_personal_best_s3
            flattenedLaps[index][`${driver.driver}.Compound`] = lap.compound_id
        })
    }

    return flattenedLaps
}
