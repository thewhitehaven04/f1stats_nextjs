import { yearEventsSeasonYearGet } from "@/client/generated"
import { EventSection } from "./components/EventSection"
import { ApiClient } from '@/client'

export default async function SeasonPage({ params }: { params: Promise<{ season: string }> }) {
    const events = (
        await yearEventsSeasonYearGet({
            throwOnError: true,
            client: ApiClient,
            path: {
                year: Number.parseInt((await params).season),
            },
        })
    ).data

    return <EventSection events={events} />
}
