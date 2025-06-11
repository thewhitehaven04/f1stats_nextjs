import type { SessionQuery } from "@/client/generated"

export function buildQueries(
    search: Record<string, string | string[] | undefined>,
): SessionQuery[] {
    const queries: SessionQuery[] = []
    Object.entries(search).forEach(([key, value]) => {
        if (key === "driver") {
            if (typeof value === "string") {
                queries.push({ driver: value, lap_filter: null })
            } else {
                value?.forEach((driver) => {
                    queries.push({ driver: driver, lap_filter: null })
                })
            }
        }
    })
    return queries
}
