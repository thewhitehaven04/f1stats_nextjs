import { LucideDroplets, LucideThermometer, LucideThermometerSun, LucideTimer } from "lucide-react"
import { SummaryItem } from "./components/SummaryItem"
import { Suspense, type PropsWithChildren } from "react"
import { LoadingSpinner } from "@/components/SectionLoadingSpinner"
import { format } from "date-fns/format"
import type { ISessionInformation } from '../../models/types'

export const SessionInformation = (props: PropsWithChildren<ISessionInformation>) => {
    const { sessionData, weather, children } = props
    return (
        <>
            <section className="flex flex-col gap-2 w-full overflow-x-visible">
                <h1 className="text-xl font-medium">
                    {sessionData.eventName} - {sessionData.sessionType}
                </h1>
                <div className="grid grid-cols-2 gap-4">
                    <SummaryItem
                        icon={<LucideTimer size={32} />}
                        label="Session time"
                        value={`${format(sessionData.startTime, "MMM dd, yyyy HH:MM")} — ${format(sessionData.endTime, "HH:MM")}`}
                    />

                    <SummaryItem
                        icon={<LucideThermometerSun size={32} />}
                        label="Air temp"
                        value={`${weather.airTempStart} — ${weather.airTempEnd}°C`}
                    />

                    <SummaryItem
                        icon={<LucideThermometer size={32} />}
                        label="Tarmac temp"
                        value={`${weather.trackTempStart} — ${weather.trackTempEnd}°C`}
                    />

                    <SummaryItem
                        icon={<LucideDroplets size={32} />}
                        label="Humidity"
                        value={`${weather.humidityStart} — ${weather.humidityEnd}%`}
                    />
                </div>
            </section>
            <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
        </>
    )
}
