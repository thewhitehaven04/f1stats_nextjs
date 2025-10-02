export const rollingSum = (arr: number[]) => {
    const rolling: number[] = []
    arr.reduce((acc, num) => {
        rolling.push(acc + num)
        return acc + num
    }, 0)
    return rolling
}
