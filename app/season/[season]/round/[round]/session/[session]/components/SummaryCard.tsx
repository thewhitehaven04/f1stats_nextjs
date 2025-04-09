import {
    getSessionSummarySeasonYearRoundRoundNumberSessionSessionIdentifierSummaryGet,
    type SessionIdentifier,
} from "@/client/generated"
import { NaLabel } from "@/components/ValueOrNa"
import { SummaryItem } from "./SummaryItem"
import { format } from "date-fns/format"
import { ApiClient } from "@/client"

export const SessionSummaryCard = async ({
    season,
    round,
    session,
}: { season: string; round: string; session: SessionIdentifier }) => {
    const { summary, weather } = (
        await getSessionSummarySeasonYearRoundRoundNumberSessionSessionIdentifierSummaryGet({
            client: ApiClient,
            throwOnError: true,
            path: {
                round_number: round,
                session_identifier: decodeURI(session) as SessionIdentifier,
                year: Number.parseInt(season),
            },
        })
    ).data
    return (
        <section className="w-full">
            <h1 className="card-title text-lg text-neutral-700">
                {session ? `${summary.official_name} - ${summary.session_type}` : "Session Summary"}
            </h1>
            <h2 className="divider divider-start text-lg">Track conditions</h2>
            <div className="flex flex-col p-0 gap-2">
                <div className="grid grid-cols-2 gap-4">
                    {summary.start_time && summary.finish_time ? (
                        <SummaryItem
                            label="Session run time"
                            value={`${format(summary.start_time, "MMM dd, yyyy HH:MM")} - ${format(summary.finish_time, "HH:MM")}`}
                        />
                    ) : (
                        <NaLabel />
                    )}

                    {summary.start_time && summary.finish_time ? (
                        <SummaryItem
                            label="Air temp (start - end)"
                            value={`${weather.air_temp_start} - ${weather.air_temp_finish}°C`}
                        />
                    ) : (
                        <NaLabel />
                    )}
                    {weather ? (
                        <SummaryItem
                            label="Track temp (start - end)"
                            value={`${weather.track_temp_start} - ${weather.track_temp_finish}°C`}
                        />
                    ) : (
                        <NaLabel />
                    )}

                    {weather ? (
                        <SummaryItem
                            label="Humidity (start - end)"
                            value={`${weather.humidity_start} - ${weather.humidity_finish}%`}
                        />
                    ) : (
                        <NaLabel />
                    )}
                </div>
            </div>
        </section>
    )
}
