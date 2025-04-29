"use client"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChevronRightCircle, ChevronRightCircleIcon, ChevronRightSquareIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const SEGMENTS = [
    {
        expression: /\/season\/(\d{4})/,
        getText: (matchArray: RegExpMatchArray | null) => (matchArray ? matchArray[1] : ""),
    },
    {
        expression: /\/season\/(\d{4})\/event\/(\S+)\/session\/(\S+)\/results/,
        getText: (matchArray: RegExpMatchArray | null) => {
            return matchArray
                ? `${decodeURIComponent(matchArray[2])}, ${decodeURIComponent(matchArray[3])} results`
                : ""
        },
    },
    {
        expression: /\/season\/(\d{4})\/event\/(\S+)\/session\/(\S+)\/laps/,
        getText: (matchArray: RegExpMatchArray | null) => {
            return matchArray
                ? `${decodeURIComponent(matchArray[2])}, ${decodeURIComponent(matchArray[3])} laps`
                : ""
        },
    },
    {
        expression: /\/season\/(\d{4})\/event\/(\S+)\/session\/(\S+)\/telemetry/,
        getText: (matchArray: RegExpMatchArray | null) => {
            return matchArray
                ? `${decodeURIComponent(matchArray[2])}, ${decodeURIComponent(matchArray[3])} telemetry`
                : ""
        },
    },
]

export const Breadcrumbs = () => {
    const pathname = usePathname()
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {SEGMENTS.map((segment, index) => {
                    if (segment.expression.test(pathname)) {
                        const match = pathname.match(segment.expression)
                        return (
                            <>
                                <BreadcrumbItem key={index}>
                                    {match ? (
                                        <BreadcrumbLink asChild>
                                            <Link href={match[0]}>{segment.getText(match)}</Link>
                                        </BreadcrumbLink>
                                    ) : null}
                                </BreadcrumbItem>
                                {index < SEGMENTS.length - 1 && (
                                    <BreadcrumbSeparator>
                                        <ChevronRightCircleIcon />
                                    </BreadcrumbSeparator>
                                )}
                            </>
                        )
                    }
                    return null
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
