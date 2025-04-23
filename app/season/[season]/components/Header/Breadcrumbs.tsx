"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const SEGMENTS = [
    /\/season\/\d{4}/g,
    /\/season\/\d{4}\/event\/\S+%20Grand%20Prix/g,
    /\/season\/\d{4}\/event\/\S+\/session\/\S+/g,
]

export const Breadcrumbs = () => {
    const pathname = usePathname()
    return (
        <nav className="breadcrumbs">
            <ul>
                {SEGMENTS.map((segment, index) => {
                    if (segment.test(pathname)) {
                        const match = pathname.match(segment)
                        const segments = match?.toString().split("/") || []
                        return (
                            <li key={index}>
                                {match ? (
                                    <Link href={match.toString()}>
                                        {decodeURIComponent(segments[segments.length - 1])}
                                    </Link>
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
