"use client"
import { useSelectedLayoutSegments } from "next/navigation"

export const Breadcrumbs = () => {
    const segments = useSelectedLayoutSegments()
    return (
        <nav className="breadcrumbs">
            <ul>
                {segments.map((segment) => (
                    <li key={segment}>
                        <a href={segment}>{segment}</a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
