import { Card, CardContent } from "@/components/ui/card"
import type { ISessionPathnameParams } from "../types"
import { ResultsSection } from "./components/ResultsSection"
import { fetchSessionResults } from "./fetcher"
import type { Metadata } from "next"

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

    return <ResultsSection sessionType={type} sessionResults={data} />
}
