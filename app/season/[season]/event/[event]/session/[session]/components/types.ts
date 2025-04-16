export interface IBaseResultsData {
    driver: { name: string; country: string }
    driverNumber: string
    teamName: string
}

export interface IPracticeData extends IBaseResultsData {
    time: number | null
    gap: number | null
}

export interface IQualifyingData extends IBaseResultsData {
    q1Time: number | null
    q2Time: number | null
    q3Time: number | null
}

export interface IRaceData extends IBaseResultsData {
    gridPosition: number
    time: number | null
    gap: number | null
    points: number
    status: string
}

export enum ESessionType {
    RACE = "racelike",
    QUALIFYING = "qualilike",
    PRACTICE = "practice",
}
