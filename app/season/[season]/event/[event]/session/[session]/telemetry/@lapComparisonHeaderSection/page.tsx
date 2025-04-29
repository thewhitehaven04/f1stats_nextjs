import { SectorTime } from "@/components/SectorTime"
import { Speedtrap } from "@/components/Speedtrap"
import { formatTime } from "@/core/helpers/formatTime"
import { Fragment } from "react"
import { getTyreComponentByCompound } from "../../laps/components/helpers/getTyreIconByCompound"
import {
    getSessionLaptimesFilteredApiPySeasonYearEventEventSessionSessionLapsPost,
    type SessionIdentifier,
} from "@/client/generated"
import { buildQueries } from "../../laps/helpers"
import type { ISessionPathnameParams } from "../../types"
import { ApiClient } from "@/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default async function TelemetryLaptimeSection(props: {
    params: Promise<ISessionPathnameParams>
    searchParams: Promise<Record<string, string | string[]>>
}) {
    const queries = buildQueries(await props.searchParams)
    const { data } =
        await getSessionLaptimesFilteredApiPySeasonYearEventEventSessionSessionLapsPost({
            path: {
                year: (await props.params).season,
                event: decodeURIComponent((await props.params).event),
                session: decodeURIComponent((await props.params).session) as SessionIdentifier,
            },
            body: { queries },
            throwOnError: true,
            client: ApiClient,
        })

    const distinctDrivers = [...new Set(data.driver_lap_data.map((entry) => entry.driver))]

    const sessionData = distinctDrivers.flatMap((driverId) =>
        data.driver_lap_data
            .filter((entry) => entry.driver === driverId)
            .map((data) => ({
                driverId: data.driver,
                laps: data.laps,
            })),
    )

    return (
        <section>
            <h2 className="divider divider-start text-lg">Lap comparison</h2>
            <div className="flex flex-row items-start justify-start gap-4">
                {sessionData.map((session) => (
                    <Fragment key={session.driverId}>
                        {session.laps.map((lap) => {
                            const TyreIcon = getTyreComponentByCompound(lap.compound_id)
                            const gapToLeader = lap.laptime - (data.min_time || 0) || undefined

                            return (
                                <Card key={lap.id}>
                                    <CardHeader>
                                        <CardTitle>{session.driverId}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-rows-2 justify-center text-lg font-bold">
                                            <div className="flex flex-row gap-2">
                                                {formatTime(lap.laptime)}
                                                {TyreIcon && <TyreIcon className="w-4" />}
                                            </div>
                                            {gapToLeader && (
                                                <div className="text-non-personal-best">
                                                    + {formatTime(gapToLeader)}
                                                </div>
                                            )}
                                        </div>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableCell>Sector time</TableCell>
                                                    <TableCell>Speed trap</TableCell>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell className="text-center">
                                                        <SectorTime
                                                            value={lap.sector_1_time}
                                                            isSessionBest={lap.is_best_s1}
                                                            isPersonalBest={lap.is_personal_best_s1}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Speedtrap
                                                            key={lap.speedtrap_1}
                                                            value={lap.speedtrap_1 || 0}
                                                            isSessionBest={lap.is_best_st1}
                                                            isPersonalBest={lap.is_personal_best_s1}
                                                            withUnit
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="text-center">
                                                        <SectorTime
                                                            value={lap.sector_2_time}
                                                            isSessionBest={lap.is_best_s2}
                                                            isPersonalBest={lap.is_personal_best_s2}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Speedtrap
                                                            key={lap.speedtrap_2}
                                                            value={lap.speedtrap_2 || 0}
                                                            isSessionBest={lap.is_best_st2}
                                                            isPersonalBest={lap.is_personal_best_s2}
                                                            withUnit
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="text-center">
                                                        <SectorTime
                                                            value={lap.sector_3_time}
                                                            isSessionBest={lap.is_best_s3}
                                                            isPersonalBest={lap.is_personal_best_s3}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Speedtrap
                                                            key={lap.speedtrap_fl}
                                                            value={lap.speedtrap_fl || 0}
                                                            isSessionBest={lap.is_best_stfl}
                                                            isPersonalBest={lap.is_personal_best_s3}
                                                            withUnit
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </Fragment>
                ))}
            </div>
        </section>
    )
}
