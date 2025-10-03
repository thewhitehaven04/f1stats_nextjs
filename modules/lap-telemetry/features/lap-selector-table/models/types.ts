import type { LapTimingData } from '@/shared/client/generated'

export interface ITableLapData {
    [key: `${string}.LapId`]: LapTimingData["id"]
    [key: `${string}.LapTime`]: LapTimingData["laptime"]
    [key: `${string}.IsPB`]: LapTimingData["is_pb"]
    [key: `${string}.Sector1Time`]: LapTimingData["sector_1_time"]
    [key: `${string}.ST1`]: LapTimingData["speedtrap_1"]
    [key: `${string}.Sector2Time`]: LapTimingData["sector_2_time"]
    [key: `${string}.ST2`]: LapTimingData["speedtrap_2"]
    [key: `${string}.Sector3Time`]: LapTimingData["sector_3_time"]
    [key: `${string}.ST3`]: LapTimingData["speedtrap_fl"]
    [key: `${string}.IsBestS1`]: LapTimingData["is_best_s1"]
    [key: `${string}.IsBestS2`]: LapTimingData["is_best_s2"]
    [key: `${string}.IsBestS3`]: LapTimingData["is_best_s3"]
    [key: `${string}.IsBestST1`]: LapTimingData["is_best_st1"]
    [key: `${string}.IsBestST2`]: LapTimingData["is_best_st2"]
    [key: `${string}.IsBestST3`]: LapTimingData["is_best_stfl"]
    [key: `${string}.IsPBS1`]: LapTimingData["is_personal_best_s1"]
    [key: `${string}.IsPBS2`]: LapTimingData["is_personal_best_s2"]
    [key: `${string}.IsPBS3`]: LapTimingData["is_personal_best_s3"]
    [key: `${string}.Compound`]: LapTimingData["compound_id"]
}