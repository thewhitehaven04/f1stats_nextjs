"use client"

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
                ? `${decodeURIComponent(matchArray[2])} - ${decodeURIComponent(matchArray[3])}`
                : ""
        },
    },
]

export const Breadcrumbs = () => {
    const pathname = usePathname()
    return (
        <nav className="breadcrumbs">
            <ul>
                {SEGMENTS.map((segment, index) => {
                    if (segment.expression.test(pathname)) {
                        const match = pathname.match(segment.expression)
                        return (
                            <li key={index}>
                                {match ? (
                                    <Link href={match[0]}>{segment.getText(match)}</Link>
                                ) : null}
                            </li>
                        )
                    }
                    return null
                })}
            </ul>
        </nav>
    )
}
