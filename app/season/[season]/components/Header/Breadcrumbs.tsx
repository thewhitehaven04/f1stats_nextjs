"use client"
import { useSelectedLayoutSegments } from "next/navigation"

const STATIC_SEGMENTS = ["season", "event", "session"]

export const Breadcrumbs = () => {
    const segments = useSelectedLayoutSegments()
    const breadcrumbSegments = segments.filter(segment => !STATIC_SEGMENTS.includes(segment))
    return (
        <nav className="breadcrumbs">
            <ul>
                {breadcrumbSegments.map(segment => (
                    <li key={segment}>
                        <a href={segment}>{decodeURIComponent(segment)}</a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
