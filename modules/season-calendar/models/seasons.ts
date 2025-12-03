import dbClient from "@/shared/client/db"

export const fetchSeasons = async (props: { seasons: { orderBy: "desc" | "asc" } }) => {
    return await dbClient.seasons.findMany({
        orderBy: {
            season_year: props.seasons.orderBy,
        },
    })
}
