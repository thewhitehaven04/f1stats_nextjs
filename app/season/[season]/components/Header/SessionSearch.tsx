"use client"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useMemo, useState } from "react"
import type { TEventWithSessions } from "../../page"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const THROTTLE_TIMEOUT = 300

export const SessionSearch = ({ events }: { events: TEventWithSessions[] }) => {
    const { season } = useParams<{ season: string }>()

    const [searchQuery, setSearchQuery] = useState<string>("")

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

    let currentTimeoutId: NodeJS.Timeout
    const handleChangeThrottled = (value: string) => {
        clearTimeout(currentTimeoutId)
        currentTimeoutId = setTimeout(() => {
            setSearchQuery(value)
        }, THROTTLE_TIMEOUT)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Input
                    type="text"
                    onChange={(evt) => handleChangeThrottled(evt.target.value)}
                    placeholder="Search"
                />
            </PopoverTrigger>
            <PopoverContent className="max-h-80 overflow-y-scroll flex flex-col gap-4">
                {results.map((result) => (
                    <div key={result.name} className="flex flex-col gap-2">
                        <ul className="menu">
                            <li className="text-lg font-medium">{result.name}</li>
                            <ul>
                                <li>
                                    <Link
                                        className="link-hover"
                                        href={`/season/${season}/event/${result.name}/session/${result.sessions[0].type}/results`}
                                    >
                                        {result.sessions[0].type}
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        className="link-hover"
                                        href={`/season/${season}/event/${result.name}/session/${result.sessions[1].type}/results`}
                                    >
                                        {result.sessions[1].type}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="link-hover"
                                        href={`/season/${season}/event/${result.name}/session/${result.sessions[2].type}/results`}
                                    >
                                        {result.sessions[2].type}
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        className="link-hover"
                                        href={`/season/${season}/event/${result.name}/session/${result.sessions[3].type}/results`}
                                    >
                                        {result.sessions[3].type}
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        className="link-hover"
                                        href={`/season/${season}/event/${result.name}/session/${result.sessions[4].type}/results`}
                                    >
                                        {result.sessions[4].type}
                                    </Link>
                                </li>
                            </ul>
                        </ul>
                    </div>
                ))}
                {!results.length && <span>No data matching your query</span>}
            </PopoverContent>
        </Popover>
    )
}
