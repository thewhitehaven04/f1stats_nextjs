import { encodeSVGPath, SVGPathData } from "svg-pathdata"
import type { CircuitGeometryDto } from "@/client/generated"

const WIDTH = 400
const HEIGHT = 400

export function getPath({
    xStart,
    yStart,
    xEnd,
    yEnd,
    X,
    Y,
}: { xStart: number; yStart: number; xEnd: number; yEnd: number; X: number; Y: number }) {
    return encodeSVGPath([
        {
            type: SVGPathData.MOVE_TO,
            relative: false,
            x: (xStart / X) * WIDTH,
            y: (yStart / Y) * HEIGHT,
        },
        {
            type: SVGPathData.LINE_TO,
            relative: false,
            x: (xEnd / X) * WIDTH,
            y: (yEnd / Y) * HEIGHT,
        },
    ])
}

export function CircuitMap(props: { geometry: CircuitGeometryDto }) {
    const { geometry } = props
    const minX = geometry.bbox?.[0] || 0
    const minY = geometry.bbox?.[1] || 0
    const maxX = geometry.bbox?.[2] || 0
    const maxY = geometry.bbox?.[3] || 0

    const X = maxX - minX
    const Y = maxY - minY

    return (
        <div className="w-full h-full flex justify-center items-center p-2">
            <svg width={WIDTH} height={HEIGHT} className="overflow-visible">
                <title>Driver speed comparison</title>
                {geometry.geometry?.coordinates.map((pos, index) => {
                    const first = pos
                    const second =
                        geometry.geometry?.coordinates[
                            index === geometry.geometry?.coordinates.length - 1 ? index : index + 1
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
                            })}
                            fill="white"
                            stroke="black"
                            strokeWidth="3"
                        />
                    )
                })}
            </svg>
        </div>
    )
}
