import { Card, CardContent } from "@/components/ui/card"
import { AverageTelemetryPlotData } from "@/client/generated"
import { NumberRange } from "@/components/NumberInterval"

export const LapIntervalSelection = (props: {
    telemetries: AverageTelemetryPlotData[]
    onUpdateSelection: (update: {
        driver: string
        lap: number
        state: boolean
    }) => void
}) => {
    const drivers = telemetries?.map(({ driver }) => driver) || []

    return (
        <Card>
            <CardContent>
                <div className="flex flex-row gap-4">
                    {drivers.map((driver) => (
                        <div key={driver} className="flex flex-col gap-4">
                            <span>{driver}</span>
                            <NumberRange
                                name={driver}
                                onRangeChange={(range) => onUpdateSelection(driver, range)}
                            />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
