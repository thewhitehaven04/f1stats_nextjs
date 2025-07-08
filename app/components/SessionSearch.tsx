"use client"
import { PopupCard } from "@/components/PopupCard"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { useDebouncedState } from '@/core/hooks/useDebouncedState'
import type { TEventWithSessions } from '../season/[season]/page'


export const SessionSearch = ({ events }: { events: TEventWithSessions[] }) => {
    const { season } = useParams<{ season: string }>()

    const [searchQuery, setSearchQuery] = useDebouncedState("")
    const [showResults, setShowResults] = useState<boolean>(false)

    // this isn't really a proper search engine, just having a little bit of fun
    const results = useMemo(() => {
        const terms = searchQuery.split(" ")
        return events
            ? events.filter((event) =>
                  terms.every((term) => {
                      const lowercaseTerm = term.toLowerCase()
                      return (
                          event.officialName.toLowerCase().includes(lowercaseTerm) ||
                          event.name.toLowerCase().includes(lowercaseTerm) ||
                          event.country.toLowerCase().includes(lowercaseTerm)
                      )
                  }),
              )
            : []
    }, [searchQuery, events])

    const handleChange = (value: string) => {
        setSearchQuery(value)
        setShowResults(true)
    }

    const onLinkClick = () => {
        setShowResults(false)
    }

    return (
        <div className="relative">
            <Input
                type="text"
                onChange={(evt) => handleChange(evt.target.value)}
                placeholder="Search"
            />
            {showResults && (
                <PopupCard
                    onClose={() => setShowResults(false)}
                    className="w-64 max-h-96 overflow-y-scroll backdrop-blur-sm"
                    title="Results"
                >
                    <div className="flex flex-col gap-3">
                        {results.map((result) => (
                            <div key={result.name} className="flex flex-col gap-2">
                                <ul className="menu">
                                    <li className="text-lg font-medium">{result.name}</li>
                                    <ul>
                                        <li>
                                            <Link
                                                className="link-hover"
                                                href={`/season/${season}/event/${result.name}/session/${result.sessions[0].type}/results`}
                                                onClick={onLinkClick}
                                            >
                                                {result.sessions[0].type}
                                            </Link>
                                        </li>

                                        <li>
                                            <Link
                                                className="link-hover"
                                                href={`/season/${season}/event/${result.name}/session/${result.sessions[1].type}/results`}
                                                onClick={onLinkClick}
                                            >
                                                {result.sessions[1].type}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                className="link-hover"
                                                href={`/season/${season}/event/${result.name}/session/${result.sessions[2].type}/results`}
                                                onClick={onLinkClick}
                                            >
                                                {result.sessions[2].type}
                                            </Link>
                                        </li>

                                        <li>
                                            <Link
                                                className="link-hover"
                                                href={`/season/${season}/event/${result.name}/session/${result.sessions[3].type}/results`}
                                                onClick={onLinkClick}
                                            >
                                                {result.sessions[3].type}
                                            </Link>
                                        </li>

                                        <li>
                                            <Link
                                                className="link-hover"
                                                href={`/season/${season}/event/${result.name}/session/${result.sessions[4].type}/results`}
                                                onClick={onLinkClick}
                                            >
                                                {result.sessions[4].type}
                                            </Link>
                                        </li>
                                    </ul>
                                </ul>
                            </div>
                        ))}
                        {!results.length && <span>No data matching your query</span>}
                    </div>
                </PopupCard>
            )}
        </div>
    )
}
