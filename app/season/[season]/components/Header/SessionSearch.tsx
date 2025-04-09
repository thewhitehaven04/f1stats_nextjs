"use client"

import { yearEventsSeasonYearGet, type SessionIdentifier } from "@/client/generated"
import { PopupCard } from "@/components/PopupCard"
import { buildNavigationRoute } from "@/core/helpers/buildNavigationRoute"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ApiClient } from "@/client"

const THROTTLE_TIMEOUT = 300

export const SessionSearch = () => {
    const { season } = useParams<{ season: string }>()
    const events = useQuery({
        queryKey: ["events", season],
        queryFn: async () =>
            (
                await yearEventsSeasonYearGet({
                    throwOnError: true,
                    client: ApiClient,
                    path: {
                        year: Number.parseInt(season),
                    },
                })
            ).data,
    }).data

    const [searchQuery, setSearchQuery] = useState<string>("")
    const [showResults, setShowResults] = useState(false)

    // this isn't really a proper search engine, just having a little bit of fun
    const results = useMemo(() => {
        const terms = searchQuery.split(" ")
        return events
            ? events.filter((event) =>
                  terms.every((term) => {
                      const lowercaseTerm = term.toLowerCase()
                      return (
                          event.OfficialEventName.toLowerCase().includes(lowercaseTerm) ||
                          event.EventName.toLowerCase().includes(lowercaseTerm) ||
                          event.Country.toLowerCase().includes(lowercaseTerm)
                      )
                  }),
              )
            : []
    }, [searchQuery, events])

    let currentTimeoutId: NodeJS.Timeout
    const handleChangeThrottled = (value: string) => {
        clearTimeout(currentTimeoutId)
        currentTimeoutId = setTimeout(() => {
            setSearchQuery(value)
            setShowResults(true)
        }, THROTTLE_TIMEOUT)
    }

    const onLinkClick = () => {
        setShowResults(false)
    }

    return (
        <div className="relative">
            <input
                type="text"
                className="input input-bordered input-sm"
                onChange={(evt) => handleChangeThrottled(evt.target.value)}
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
                            <div key={result.RoundNumber} className="flex flex-col gap-2">
                                <ul className="menu">
                                    <li className="text-lg font-medium">{result.EventName}</li>
                                    <ul>
                                        <li>
                                            <Link
                                                className="link-hover"
                                                href={buildNavigationRoute(
                                                    result.Session1 as SessionIdentifier,
                                                    season,
                                                    result.RoundNumber,
                                                    result.EventFormat === "testing",
                                                )}
                                                onClick={onLinkClick}
                                            >
                                                {result.Session1}
                                            </Link>
                                        </li>

                                        <li>
                                            <Link
                                                className="link-hover"
                                                href={buildNavigationRoute(
                                                    result.Session2 as SessionIdentifier,
                                                    season,
                                                    result.RoundNumber,
                                                    result.EventFormat === "testing",
                                                )}
                                                onClick={onLinkClick}
                                            >
                                                {result.Session2}
                                            </Link>
                                        </li>

                                        <li>
                                            <Link
                                                className="link-hover"
                                                href={buildNavigationRoute(
                                                    result.Session3 as SessionIdentifier,
                                                    season,
                                                    result.RoundNumber,
                                                    result.EventFormat === "testing",
                                                )}
                                                onClick={onLinkClick}
                                            >
                                                {result.Session3}
                                            </Link>
                                        </li>

                                        <li>
                                            <Link
                                                className="link-hover"
                                                href={buildNavigationRoute(
                                                    result.Session4 as SessionIdentifier,
                                                    season,
                                                    result.RoundNumber,
                                                    result.EventFormat === "testing",
                                                )}
                                                onClick={onLinkClick}
                                            >
                                                {result.Session4}
                                            </Link>
                                        </li>

                                        <li>
                                            <Link
                                                className="link-hover"
                                                href={buildNavigationRoute(
                                                    result.Session5 as SessionIdentifier,
                                                    season,
                                                    result.RoundNumber,
                                                    result.EventFormat === "testing",
                                                )}
                                                onClick={onLinkClick}
                                            >
                                                {result.Session5}
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
