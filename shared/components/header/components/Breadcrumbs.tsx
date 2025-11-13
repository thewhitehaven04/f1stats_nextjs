"use client"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/uiComponents/breadcrumb'
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment } from "react"

const SEGMENTS = [
    {
        expression: /\/season\/(\d{4})/,
        getText: (matchArray: RegExpMatchArray | null) => (matchArray ? matchArray[1] : ""),
        getHref: (matchArray: RegExpMatchArray | null) => {
            return matchArray ? `/season/${matchArray[1]}` : ""
        },
    },
    {
        expression: /\/season\/(\d{4})\/event\/([a-zA-Z0-9%]+)\/session\/([a-zA-Z0-9%]+)/,
        getText: (matchArray: RegExpMatchArray | null) => {
            return matchArray
                ? `${decodeURIComponent(matchArray[2])}, ${decodeURIComponent(matchArray[3])} results`
                : ""
        },
        getHref: (matchArray: RegExpMatchArray | null) => {
            return matchArray
                ? `/season/${matchArray[1]}/event/${matchArray[2]}/session/${matchArray[3]}/results`
                : ""
        },
    },
    {
        expression: /\/season\/(\d{4})\/event\/([a-zA-Z0-9%]+)\/session\/([a-zA-Z0-9%]+)\/laps/,
        getText: () => {
            return 'Laps' 
        },
        getHref: (matchArray: RegExpMatchArray | null) => {
            return matchArray
                ? `/season/${matchArray[1]}/event/${matchArray[2]}/session/${matchArray[3]}/laps`
                : ""
        },
    },
    {
        expression: /\/season\/(\d{4})\/team\/(\d+)/,
        getText: (matchArray: RegExpMatchArray | null) => {
            return "Team form"
        },
        getHref: (matchArray: RegExpMatchArray | null) => {
            return matchArray ? `/season/${matchArray[1]}` : ""
        },
    },
]

export const Breadcrumbs = () => {
    const pathname = usePathname()

    const crumbs = SEGMENTS.map((segment) => {
        if (segment.expression.test(pathname)) {
            const match = pathname.match(segment.expression)
            return match ? (
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href={segment.getHref(match)}>{segment.getText(match)}</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
            ) : null
        }
        return null
    }).filter(Boolean)
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {crumbs.slice(0, -1).map((crumb, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: static array
                    <Fragment key={index}>
                        {crumb}
                        <BreadcrumbSeparator>
                            <ChevronRight size={24} />
                        </BreadcrumbSeparator>
                    </Fragment>
                ))}
                {crumbs.length > 1 && crumbs.at(-1)}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
