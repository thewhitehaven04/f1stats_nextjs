import { fetchSessionInformation } from "@/modules/session-information/models/session-information"
import type { ISessionPathnameParams } from "./types"
import { SessionInformation } from "@/modules/session-information/features/session-information/SessionInformation"

export default async function SessionLayout({
    params,
    children,
}: { params: Promise<ISessionPathnameParams>; children: React.ReactNode }) {
    const { season, session, event } = await params
    const sessionInformation = await fetchSessionInformation(
        decodeURIComponent(session),
        Number.parseInt(season),
        decodeURIComponent(event),
    )
    return <SessionInformation {...sessionInformation}>{children}</SessionInformation>
}
