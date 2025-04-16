export const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600) 
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = Math.floor(time % 60).toString()
    const thousandths = Math.floor((time % 1) * 1000)
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
