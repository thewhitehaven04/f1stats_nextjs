import { encodeSVGPath, SVGPathData } from "svg-pathdata"
import type { CircuitGeometryDto, FastestDelta, PlotColor } from "@/client/generated"
import { getAlternativeColor } from "../../../app/season/[season]/event/[event]/session/[session]/laps/components/helpers/getAlternativeColor"

const HEIGHT = 400

export function getPath({
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
    const width = HEIGHT * aspect_ratio
    return encodeSVGPath([
        {
            type: SVGPathData.MOVE_TO,
            relative: false,
            x: (xStart / X) * width,
            y: (yStart / Y) * HEIGHT,
        },
        {
            type: SVGPathData.LINE_TO,
            relative: false,
            x: (xEnd / X) * width,
            y: (yEnd / Y) * HEIGHT,
        },
    ])
}

export function DeltaCircuitMap(props: {
    geometry: CircuitGeometryDto
    driverDeltas: FastestDelta[]
    colorMap: Record<string, PlotColor>
}) {
    const { geometry, driverDeltas, colorMap } = props
    const minX = geometry.geojson.bbox?.[0] || 0 - 10
    const maxY = geometry.geojson.bbox?.[1] || 0 - 10
    const maxX = geometry.geojson.bbox?.[2] || 0 + 10
    const minY = geometry.geojson.bbox?.[3] || 0 + 10

    const X = maxX - minX
    const Y = maxY - minY
    const aspect_ratio = Math.abs(X / Y)

    return (
        <section className="w-full h-full flex flex-col justify-center items-center p-2 gap-4">
            <h2 className="text-lg font-bold">Circuit map</h2>
            <svg
                width={HEIGHT * aspect_ratio}
                height={HEIGHT}
                className="overflow-visible my-10"
                transform={`rotate(${geometry.rotation})`}
            >
                <title>Driver speed comparison</title>
                {geometry.geojson.geometry?.coordinates.map((pos, index) => {
                    const first = pos
                    const second =
                        geometry.geojson.geometry?.coordinates[
                            index === geometry.geojson.geometry?.coordinates.length - 1
                                ? index
                                : index + 1
                        ]

                    const xStart = first[0] - minX
                    const yStart = first[1] - minY
                    if (!second) return null
                    const xEnd = second[0] - minX
                    const yEnd = second[1] - minY
                    return (
                        <path
                            key={yStart - xStart}
                            d={getPath({
                                xStart,
                                yStart,
                                xEnd,
                                yEnd,
                                X,
                                Y,
                                aspect_ratio,
                            })}
                            fill="white"
                            stroke="black"
                            strokeWidth="5"
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
                            key={yStart - xStart}
                            d={getPath({
                                xStart,
                                yStart,
                                xEnd,
                                yEnd,
                                X,
                                Y,
                                aspect_ratio,
                            })}
                            fill="white"
                            stroke={
                                colorMap[pos.driver].style === "alternative"
                                    ? getAlternativeColor(colorMap[pos.driver].color)
                                    : colorMap[pos.driver].color
                            }
                            strokeWidth="3.5"
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
                                    backgroundColor:
                                        colorMap[driver].style === "alternative"
                                            ? getAlternativeColor(plotColor.color)
                                            : plotColor.color,
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
