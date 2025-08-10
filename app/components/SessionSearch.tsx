"use client"
import { PopupCard } from "@/components/PopupCard"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { useDebouncedState } from "@/core/hooks/useDebouncedState"
import type { TSeasonEvent } from "../season/[season]/fetcher/fetcher"

export const SessionSearch = ({ events }: { events: TSeasonEvent[] }) => {
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
                          event.event_official_name.toLowerCase().includes(lowercaseTerm) ||
                          event.event_name.toLowerCase().includes(lowercaseTerm) ||
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
                            <div key={result.event_name} className="flex flex-col gap-2">
                                <ul className="menu">
                                    <li className="text-lg font-medium">{result.event_name}</li>
                                    <ul>
                                        {result.event_sessions[0]?.session_type_id && (
                                            <li>
                                                <Link
                                                    className="link-hover"
                                                    href={`/season/${season}/event/${result.event_name}/session/${result.event_sessions[0].session_type_id}/results`}
                                                    onClick={onLinkClick}
                                                >
                                                    {result.event_sessions[0].session_type_id}
                                                </Link>
                                            </li>
                                        )}

                                        {result.event_sessions[1]?.session_type_id && (
                                            <li>
                                                <Link
                                                    className="link-hover"
                                                    href={`/season/${season}/event/${result.event_name}/session/${result.event_sessions[1].session_type_id}/results`}
                                                    onClick={onLinkClick}
                                                >
                                                    {result.event_sessions[1].session_type_id}
                                                </Link>
                                            </li>
                                        )}

                                        {result.event_sessions[2]?.session_type_id && (
                                            <li>
                                                <Link
                                                    className="link-hover"
                                                    href={`/season/${season}/event/${result.event_name}/session/${result.event_sessions[2].session_type_id}/results`}
                                                    onClick={onLinkClick}
                                                >
                                                    {result.event_sessions[2].session_type_id}
                                                </Link>
                                            </li>
                                        )}

                                        {result.event_sessions[3]?.session_type_id && (
                                            <li>
                                                <Link
                                                    className="link-hover"
                                                    href={`/season/${season}/event/${result.event_name}/session/${result.event_sessions[3].session_type_id}/results`}
                                                    onClick={onLinkClick}
                                                >
                                                    {result.event_sessions[3].session_type_id}
                                                </Link>
                                            </li>
                                        )}

                                        {result.event_sessions[4]?.session_type_id && (
                                            <li>
                                                <Link
                                                    className="link-hover"
                                                    href={`/season/${season}/event/${result.event_name}/session/${result.event_sessions[4].session_type_id}/results`}
                                                    onClick={onLinkClick}
                                                >
                                                    {result.event_sessions[4].session_type_id}
                                                </Link>
                                            </li>
                                        )}
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
