import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import type { TDriverRow } from "../types"
import { Position } from "@/components/Position"
import { NaLabel } from "@/components/ValueOrNa"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const TeamSeasonFormSection = (props: {
    driverCount: number
    seasonForm: TDriverRow[]
    events: string[]
    children?: React.ReactNode
}) => {
    const { seasonForm, events, driverCount, children } = props

    return (
        <Card>
            <CardHeader>
                <CardTitle>{children}</CardTitle>
            </CardHeader>
            <CardContent>
                <Table className="overflow-x-scroll">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="sticky left-0 bg-primary-foreground z-50 outline-[1px] outline-accent pl-2 pr-4">
                                Driver
                            </TableHead>
                            {events.map((event, index) => (
                                // biome-ignore lint/suspicious/noArrayIndexKey: static array
                                <TableHead key={index} className="w-8">
                                    {event}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: driverCount }).map((_, index) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: Not a dynamic array, hence indices as keys are perfectly acceptable
                            <TableRow key={index}>
                                <TableCell className="sticky left-0 bg-primary-foreground z-50 outline-[1px] outline-accent pl-2 pr-4 max-w-max">
                                    {seasonForm[0][index].driverId}
                                </TableCell>
                                {seasonForm.map((_, roundNumber) => {
                                    return (
                                        <TableCell
                                            // biome-ignore lint/suspicious/noArrayIndexKey: SAME
                                            key={roundNumber}
                                            className="align-middle p-0 text-accent-foreground dark:text-accent w-8"
                                        >
                                            {seasonForm[roundNumber][index] ? (
                                                <Position
                                                    position={
                                                        seasonForm[roundNumber][index].position ||
                                                        ""
                                                    }
                                                    points={seasonForm[roundNumber][index].points}
                                                />
                                            ) : (
                                                <NaLabel />
                                            )}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
