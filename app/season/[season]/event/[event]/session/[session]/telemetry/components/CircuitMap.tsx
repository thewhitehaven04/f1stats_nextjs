import type { TelemetryComparison } from "~/client/generated"
import { encodeSVGPath, SVGPathData } from "svg-pathdata"
import { getAlternativeColor } from "~/core/charts/getAlternativeColor"

const WIDTH = 500
const HEIGHT = 300

export function getPath({
    xStart,
    yStart,
    xEnd,
    yEnd,
    X,
    Y,
}: { xStart: number; yStart: number; xEnd: number; yEnd: number; X: number; Y: number }) {
    return encodeSVGPath([
        { type: SVGPathData.MOVE_TO, relative: false, x: (xStart / X) * WIDTH, y: (yStart / Y) * HEIGHT },
        { type: SVGPathData.LINE_TO, relative: false, x: (xEnd / X) * WIDTH, y: (yEnd / Y) * HEIGHT },
    ])
}

export function CircuitMap(props: { comparison: TelemetryComparison }) {
    const { comparison } = props

    const maxX = Math.max(...comparison.circuit_data.position_data.map((pos) => pos.X))
    const maxY = Math.max(...comparison.circuit_data.position_data.map((pos) => pos.Y))
    return (
        <div className="w-full h-full flex justify-center items-center p-2">
            <svg width={WIDTH} height={HEIGHT} className="overflow-visible" rotate={comparison.circuit_data.rotation}>
                <title>Driver speed comparison</title>
                {comparison.circuit_data.position_data.map((pos, index) => {
                    const retValue = (
                        <path
                            key={pos.Distance}
                            d={getPath({
                                xStart: pos.X,
                                yStart: pos.Y,
                                xEnd:
                                    index === comparison.circuit_data.position_data.length - 1
                                        ? comparison.circuit_data.position_data[index].X
                                        : comparison.circuit_data.position_data[index + 1].X,
                                yEnd:
                                    index === comparison.circuit_data.position_data.length - 1
                                        ? comparison.circuit_data.position_data[index].Y
                                        : comparison.circuit_data.position_data[index + 1].Y,
                                X: maxX,
                                Y: maxY,
                            })}
                            fill="white"
                            stroke={pos.AlternativeStyle ? getAlternativeColor(pos.Color) : pos.Color}
                            strokeWidth="8"
                        />
                    )
                    return retValue
                })}
            </svg>
        </div>
    )
}
