import type { TDriverRow } from "../../types"
import { Position } from "@/components/Position"
import { NaLabel } from "@/components/ValueOrNa"
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/uiComponents/table'
import { Table } from 'lucide-react'

export const TeamSeasonFormSection = (props: {
    driverCount: number
    seasonForm: TDriverRow[]
    events: string[]
    children?: React.ReactNode
}) => {
    const { seasonForm, events, driverCount, children } = props

    return (
        <section className="flex flex-col gap-4">
            <h1 className="text-xl font-medium">{children}</h1>
            <Table className="overflow-x-scroll w-max">
                <TableHeader>
                    <TableRow>
                        <TableHead className="sticky left-0 bg-primary-foreground z-50 outline-[1px] outline-accent pl-2 pr-4 rounded-tl-md">
                            Driver
                        </TableHead>
                        {events.map((event, index) => (
                            <TableHead
                                // biome-ignore lint/suspicious/noArrayIndexKey: static array
                                key={index}
                                className="w-8 whitespace-normal text-center bg-primary-foreground"
                            >
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
                                                    seasonForm[roundNumber][index].position || ""
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
        </section>
    )
}
