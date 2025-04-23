export interface IBaseResultsData {
    driver: { name: string; country: string, id: string }
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
    gridPosition: number | null
    time: number | null
    gap: number | null
    points: number | null
    status: string | null
}

export enum ESessionType {
    RACE = "racelike",
    QUALIFYING = "qualilike",
    PRACTICE = "practice",
}
