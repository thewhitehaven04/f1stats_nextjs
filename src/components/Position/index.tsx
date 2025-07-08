const positionToColorMap: Record<string, string> = {
    "1": "bg-yellow-200",
    "2": "bg-gray-200",
    "3": "bg-amber-200",
    "4": "bg-green-200",
    "5": "bg-green-200",
    "6": "bg-green-200",
    "7": "bg-green-200",
    "8": "bg-green-200",
    "9": "bg-green-200",
    "10": "bg-green-200",
} as const

const getPositionColor = (position: string) =>
    Object.hasOwn(positionToColorMap, position) ? positionToColorMap[position] : "bg-white"

export const Position = ({ position, points }: { position: string; points: number }) => {
    return (
        <div className={`${getPositionColor(position)} flex flex-col items-center justify-center text-inherit`}>
            <div>
                {points}p
                <sup>{position}</sup>
            </div>
        </div>
    )
}
