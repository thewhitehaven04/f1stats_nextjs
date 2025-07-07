export const formatTime = (time_s: number) => {
    const hours = Math.floor(time_s / 3600) 
    const minutes = Math.floor((time_s % 3600) / 60)
    const seconds = Math.floor(time_s % 60).toString()
    const thousandths = Math.floor((time_s % 1) * 1000)
        .toString()
        .padStart(3, "0")

    if (minutes === 0 && hours === 0) {
        return `${seconds}.${thousandths}`
    }
    if (hours === 0) {
        return `${minutes}:${seconds.padStart(2, "0")}.${thousandths}`
    }
    return `${hours}:${minutes}:${seconds.padStart(2, "0")}.${thousandths}`
}