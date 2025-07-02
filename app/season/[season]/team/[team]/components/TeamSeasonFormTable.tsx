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
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Driver</TableHead>
                            {events.map((event, index) => (
                                <TableHead key={index}>{event}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: driverCount }).map((_, index) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: Not a dynamic array, hence indices as keys are perfectly acceptable
                            <TableRow key={index}>
                                <TableCell>{seasonForm[0][index].driverId}</TableCell>
                                {seasonForm.map((_, roundNumber) => {
                                    return (
                                        // biome-ignore lint/suspicious/noArrayIndexKey: SAME
                                        <TableCell key={roundNumber} className="align-middle">
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
