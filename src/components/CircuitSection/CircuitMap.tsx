import { encodeSVGPath, SVGPathData } from "svg-pathdata"
import type { CircuitGeometryDto, FastestDelta } from "@/client/generated"

const WIDTH = 500

const rotate = ({ x, y, rotation }: { x: number; y: number; rotation: number }) => {
    const cos = Math.cos(rotation)
    const sin = Math.sin(rotation)
    return {
        x: x * cos - y * sin,
        y: -x * sin - y * cos,
    }
}

const getRotatedCoordinates = ({
    x,
    y,
    midX,
    midY,
    rotation,
}: { x: number; y: number; midX: number; midY: number; rotation: number }) => {
    const xCentered = x - midX
    const yCentered = y - midY

    const shiftRotated = rotate({
        x: xCentered,
        y: yCentered,
        rotation: (Math.PI * rotation) / 180,
    })
    return {
        x: shiftRotated.x + midX,
        y: shiftRotated.y + midY,
    }
}

function getPath({
    xStart,
    yStart,
    xEnd,
    yEnd,
    X,
    Y,
    aspect_ratio,
}: {
    xStart: number
    yStart: number
    xEnd: number
    yEnd: number
    X: number
    Y: number
    aspect_ratio: number
}) {
    const height = WIDTH / aspect_ratio
    return encodeSVGPath([
        {
            type: SVGPathData.MOVE_TO,
            relative: false,
            x: (xStart / X) * WIDTH,
            y: (yStart / Y) * height,
        },
        {
            type: SVGPathData.LINE_TO,
            relative: false,
            x: (xEnd / X) * WIDTH,
            y: (yEnd / Y) * height,
        },
    ])
}

export function DeltaCircuitMap(props: {
    geometry: CircuitGeometryDto
    driverDeltas: FastestDelta[]
    colorMap: Record<string, string>
}) {
    const { geometry, driverDeltas, colorMap } = props
    const bboxMinX = geometry.geojson.bbox?.[0] || 0
    const bboxMaxY = geometry.geojson.bbox?.[1] || 0
    const bboxMaxX = geometry.geojson.bbox?.[2] || 0
    const bboxMinY = geometry.geojson.bbox?.[3] || 0

    const X = bboxMaxX - bboxMinX
    const Y = bboxMaxY - bboxMinY

    const midX = bboxMinX + X / 2
    const midY = bboxMinY + Y / 2

    const preparedCoordinates =
        geometry.geojson.geometry?.coordinates.map((pos) =>
            getRotatedCoordinates({
                x: pos[0],
                y: pos[1],
                midX,
                midY,
                rotation: geometry.rotation,
            }),
        ) || []

    const minX = Math.min(...preparedCoordinates.map((pos) => pos.x))
    const minY = Math.min(...preparedCoordinates.map((pos) => pos.y))
    const maxX = Math.max(...preparedCoordinates.map((pos) => pos.x))
    const maxY = Math.max(...preparedCoordinates.map((pos) => pos.y))
    const rotatedX = maxX - minX
    const rotatedY = maxY - minY

    const aspect_ratio = Math.abs(rotatedX / rotatedY)
    const scale = aspect_ratio > 1 ? 1 : aspect_ratio

    return (
        <section className="w-full h-full flex flex-col justify-center items-center p-2 gap-4">
            <h2 className="text-lg font-bold">Circuit map</h2>
            <svg
                width={WIDTH}
                height={WIDTH / aspect_ratio}
                className="overflow-visible my-4"
                transform={`scale(${scale})`}
            >
                <title>Driver speed comparison</title>
                {preparedCoordinates.map((pos, index) => {
                    const first = pos
                    const second =
                        preparedCoordinates[
                            index === preparedCoordinates.length - 1 ? index : index + 1
                        ]

                    const xStart = first.x - minX
                    const yStart = first.y - minY
                    if (!second) return null
                    const xEnd = second.x - minX
                    const yEnd = second.y - minY
                    return (
                        <path
                            // biome-ignore lint/suspicious/noArrayIndexKey: static array
                            key={index}
                            d={getPath({
                                xStart,
                                yStart,
                                xEnd,
                                yEnd,
                                X: rotatedX,
                                Y: rotatedY,
                                aspect_ratio,
                            })}
                            fill="white"
                            stroke="var(--foreground)"
                            strokeWidth="5.5"
                        />
                    )
                })}
                {driverDeltas.map((pos, index) => {
                    const first = pos.point
                    const second =
                        driverDeltas[index === driverDeltas.length - 1 ? index : index + 1].point

                    const xStart = first[0] - minX
                    const yStart = first[1] - minY
                    if (!second) return null
                    const xEnd = second[0] - minX
                    const yEnd = second[1] - minY
                    return (
                        <path
                            // biome-ignore lint/suspicious/noArrayIndexKey: static array
                            key={index}
                            d={getPath({
                                xStart,
                                yStart,
                                xEnd,
                                yEnd,
                                X: rotatedX,
                                Y: rotatedY,
                                aspect_ratio,
                            })}
                            fill="white"
                            stroke={colorMap[pos.driver]}
                            strokeWidth="4"
                        />
                    )
                })}
            </svg>
            <div className="flex flex-row gap-2 justify-center">
                {Object.entries(colorMap).map(([driver, plotColor]) => {
                    return (
                        <div key={driver} className="flex flex-row gap-2 items-center text-sm">
                            <div
                                className="h-3 w-9 border-2 border-black"
                                style={{
                                    backgroundColor: colorMap[driver],
                                }}
                            />
                            <div>{driver}</div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
