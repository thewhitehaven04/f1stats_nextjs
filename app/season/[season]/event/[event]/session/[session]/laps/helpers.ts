import type { SessionQuery } from "@/client/generated"

export function buildQueries(search: Record<string, string | string[]>): SessionQuery[] {
    const queries: SessionQuery[] = []
    Object.entries(search).forEach(([driver, laps]: [driver: string, lap: string | string[]]) => {
        if (typeof laps === "string")
            queries.push({ driver: driver, lap_filter: [Number.parseInt(laps)] })
        else queries.push({ driver: driver, lap_filter: laps.map((lap) => Number.parseInt(lap)) })
    })
    return queries
}
