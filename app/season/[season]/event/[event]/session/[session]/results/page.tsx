import { SessionResultsScreen } from '@/modules/session-results/SessionResultsScreen'
import type { ISessionPathnameParams } from "../types"
import type { Metadata } from "next"
import { fetchSessionResults } from '@/modules/session-results/models/session-results'

export async function generateMetadata({
    params,
}: { params: Promise<ISessionPathnameParams> }): Promise<Metadata> {
    return {
        title: `F1Stats | ${decodeURIComponent((await params).event)} ${(await params).session} results`,
    }
}

export default async function Page({ params }: { params: Promise<ISessionPathnameParams> }) {
    const { session, event, season } = await params

    const { data, type } = await fetchSessionResults(
        season,
        decodeURIComponent(event),
        decodeURIComponent(session),
    )

    return <SessionResultsScreen sessionType={type} sessionResults={data} />
}
