import { LapsScreen } from '@/modules/session-laps/LapsScreen'
import type { ISessionPathnameParams } from "../types"
import type { Metadata } from "next"

export async function generateMetadata({
    params,
}: {
    params: Promise<ISessionPathnameParams>
}): Promise<Metadata> {
    return {
        title: `F1Stats | ${decodeURIComponent((await params).event)} ${(await params).session} laptime comparison`,
    }
}

export default async function LapsPage() {
    return <LapsScreen />
}
