export interface ISessionInformation {
    sessionData: {
        sessionType: string;
        startTime: Date;
        endTime: Date;
        eventName: string;
        eventOfficialName: string;
    };
    weather: {
        airTempStart: number;
        airTempEnd: number;
        trackTempStart: number;
        trackTempEnd: number;
        humidityStart: number;
        humidityEnd: number;
        airPressureStart: number;
        airPressureEnd: number;
    };
}
