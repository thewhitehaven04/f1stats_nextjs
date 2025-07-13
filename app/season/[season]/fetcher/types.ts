export interface IConventionalFormatSessions {
    fp1: string
    fp2: string
    fp3: string
    quali: string
    race: string
}

export interface ISprintQualifyingFormatSessions {
    fp1: string
    sprintQuali: string
    sprint: string
    quali: string
    race: string
}

export interface ITestingFormatSessions {
    fp1: string
    fp2: string
    fp3: string
}

export interface ISprintFormatSessions {
    fp1: string
    quali: string
    fp2: string
    sprintQuali: string
    race: string
}

/** take from mapseasonevents return value */
export type TMappedSeasonEvent =
    | {
          name: string
          officialName: string
          format: "conventional"
          sessions: IConventionalFormatSessions
          dateStart: Date
          country: string
          season: number
      }
    | {
          name: string
          officialName: string
          format: "sprint"
          sessions: ISprintFormatSessions
          dateStart: Date
          country: string
          season: number
      }
    | {
          name: string
          officialName: string
          format: "testing"
          sessions: ITestingFormatSessions
          dateStart: Date
          country: string
          season: number
      }
    | {
          name: string
          officialName: string
          format: "sprint_qualifying" | "sprint_shootout"
          sessions: ISprintQualifyingFormatSessions 
          dateStart: Date
          country: string
          season: number
      }
