import { encodeSVGPath, SVGPathData } from "svg-pathdata"
import type { CircuitGeometryDto, FastestDelta } from "../../../shared/client/generated"

const padding = 16
const MAX_DIMENSION = Math.min(480, document.body.getBoundingClientRect().width - padding)

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
}: {
    x: number
    y: number
    midX: number
    midY: number
    rotation: number
}) => {
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
    smallDimensionScaleFactor,
    isXSmall,
}: {
    xStart: number
    yStart: number
    xEnd: number
    yEnd: number
    X: number
    Y: number
    smallDimensionScaleFactor: number
    isXSmall: boolean
}) {
    return encodeSVGPath([
        {
            type: SVGPathData.MOVE_TO,
            relative: false,
            x: (xStart / X) * (isXSmall ? smallDimensionScaleFactor : 1) * MAX_DIMENSION,
            y: (yStart / Y) * (isXSmall ? 1 : smallDimensionScaleFactor) * MAX_DIMENSION,
        },
        {
            type: SVGPathData.LINE_TO,
            relative: false,
            x: (xEnd / X) * (isXSmall ? smallDimensionScaleFactor : 1) * MAX_DIMENSION,
            y: (yEnd / Y) * (isXSmall ? 1 : smallDimensionScaleFactor) * MAX_DIMENSION,
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

    const preparedDeltas = driverDeltas.map((d) => ({
        point: getRotatedCoordinates({
            x: d.point[1],
            y: d.point[0],
            midX,
            midY,
            rotation: geometry.rotation,
        }),
        key: d.group?.name ?? d.driver,
    }))

    const minX = Math.min(...preparedCoordinates.map((pos) => pos.x))
    const minY = Math.min(...preparedCoordinates.map((pos) => pos.y))
    const maxX = Math.max(...preparedCoordinates.map((pos) => pos.x))
    const maxY = Math.max(...preparedCoordinates.map((pos) => pos.y))
    const rotatedX = maxX - minX
    const rotatedY = maxY - minY

    const scaleFactor = Math.min(rotatedX / rotatedY, rotatedY / rotatedX)
    const isXSmallDimension = rotatedY > rotatedX

    return (
        <section className="w-full h-full flex flex-col items-center p-2 gap-4">
            <h2 className="text-lg font-bold">Circuit map</h2>
            <svg
                width={isXSmallDimension ? MAX_DIMENSION * scaleFactor : MAX_DIMENSION}
                height={isXSmallDimension ? MAX_DIMENSION : MAX_DIMENSION * scaleFactor}
                className="overflow-visible my-4"
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
                                smallDimensionScaleFactor: scaleFactor,
                                isXSmall: isXSmallDimension,
                            })}
                            fill="white"
                            stroke="var(--foreground)"
                            strokeWidth="6"
                        />
                    )
                })}
                {preparedDeltas.map((pos, index) => {
                    const first = pos
                    const second =
                        preparedDeltas[index === driverDeltas.length - 1 ? index : index + 1]

                    const xStart = first.point.x - minX
                    const yStart = first.point.y - minY
                    if (!second) return null
                    const xEnd = second.point.x - minX
                    const yEnd = second.point.y - minY
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
                                smallDimensionScaleFactor: scaleFactor,
                                isXSmall: isXSmallDimension,
                            })}
                            fill="white"
                            stroke={colorMap[pos.key]}
                            strokeWidth="4.5"
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
                                    backgroundColor: plotColor,
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
