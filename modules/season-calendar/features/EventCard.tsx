"use client"
import getUnicodeFlagIcon from "country-flag-icons/unicode"
import { format } from "date-fns/format"
import { useParams } from "next/navigation"
import { Button } from '@/uiComponents/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/uiComponents/card'
import type { TMappedSeasonEvent } from '@/modules/SeasonCalendar/fetcher/types'
import { OfflineAwareLink } from '@/shared/components/OfflineAwareLink'


export const EventCard = (props: TMappedSeasonEvent) => {
    const { country, dateStart, name, officialName, sessions, format: eventFormat } = props
    const { season } = useParams<{ season: string }>()
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex flex-row gap-2">
                    <span className="text-2xl">{country && getUnicodeFlagIcon(country)}</span>
                    <h1 className="text-lg">{name}</h1>
                </CardTitle>
                <CardDescription className="flex flex-col gap-1">
                    <span>{officialName}</span>
                    <span>{format(dateStart, "MMMM dd, yyyy")}</span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                {eventFormat === "conventional" ? (
                    <div className="flex flex-row gap-2 justify-start">
                        <ul className="flex flex-col">
                            <li>
                                <Button type="button" variant="ghost">
                                    <OfflineAwareLink
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.fp1}/results`}
                                    >
                                        {sessions.fp1}
                                    </OfflineAwareLink>
                                </Button>
                            </li>
                            <li>
                                <Button type="button" variant="ghost">
                                    <OfflineAwareLink
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.fp2}/results`}
                                    >
                                        {sessions.fp2}
                                    </OfflineAwareLink>
                                </Button>
                            </li>
                            <li>
                                <Button type="button" variant="ghost">
                                    <OfflineAwareLink
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.fp3}/results`}
                                    >
                                        {sessions.fp3}
                                    </OfflineAwareLink>
                                </Button>
                            </li>
                        </ul>
                        <ul className="flex flex-col">
                            <li>
                                <Button type="button" variant="ghost">
                                    <OfflineAwareLink
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.quali}/results`}
                                    >
                                        {sessions.quali}
                                    </OfflineAwareLink>
                                </Button>
                            </li>
                            <li>
                                <Button type="button" variant="ghost">
                                    <OfflineAwareLink
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.race}/results`}
                                    >
                                        {sessions.race}
                                    </OfflineAwareLink>
                                </Button>
                            </li>
                        </ul>
                    </div>
                ) : eventFormat === "testing" ? (
                    <div className="flex flex-row gap-0 justify-start">
                        <ul className="flex flex-col">
                            <li>
                                <Button type="button" variant="ghost">
                                    <OfflineAwareLink
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.fp1}/results`}
                                    >
                                        {sessions.fp1}
                                    </OfflineAwareLink>
                                </Button>
                            </li>
                            <li>
                                <Button type="button" variant="ghost">
                                    <OfflineAwareLink
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.fp2}/results`}
                                    >
                                        {sessions.fp2}
                                    </OfflineAwareLink>
                                </Button>
                            </li>
                            <li>
                                <Button type="button" variant="ghost">
                                    <OfflineAwareLink
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.fp3}/results`}
                                    >
                                        {sessions.fp3}
                                    </OfflineAwareLink>
                                </Button>
                            </li>
                        </ul>
                    </div>
                ) : eventFormat === "sprint_qualifying" || eventFormat === "sprint_shootout" ? (
                    <div className="flex flex-row gap-0">
                        <ul className="flex flex-col">
                            <li>
                                <Button type="button" variant="ghost">
                                    <OfflineAwareLink
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.fp1}/results`}
                                    >
                                        {sessions.fp1}
                                    </OfflineAwareLink>
                                </Button>
                            </li>
                        </ul>
                        <ul className="flex flex-col">
                            <li>
                                <Button type="button" variant="ghost">
                                    <OfflineAwareLink
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.sprintQuali}/results`}
                                    >
                                        {sessions.sprintQuali}
                                    </OfflineAwareLink>
                                </Button>
                            </li>
                            <li>
                                <Button type="button" variant="ghost">
                                    <OfflineAwareLink
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.sprint}/results`}
                                    >
                                        {sessions.sprint}
                                    </OfflineAwareLink>
                                </Button>
                            </li>
                        </ul>
                        <ul className="flex flex-col">
                            <li>
                                <Button type="button" variant="ghost">
                                    <OfflineAwareLink
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.quali}/results`}
                                    >
                                        {sessions.quali}
                                    </OfflineAwareLink>
                                </Button>
                            </li>
                            <li>
                                <Button type="button" variant="ghost">
                                    <OfflineAwareLink
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.race}/results`}
                                    >
                                        {sessions.race}
                                    </OfflineAwareLink>
                                </Button>
                            </li>
                        </ul>
                    </div>
                ) : eventFormat === "sprint" ? (
                    <div className="flex flex-row gap-0">
                        <ul className="flex flex-col gap-2">
                            <li>
                                <Button type="button" variant="ghost">
                                    <OfflineAwareLink
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.fp1}/results`}
                                    >
                                        {sessions.fp1}
                                    </OfflineAwareLink>
                                </Button>
                            </li>
                            <li>
                                <Button type="button" variant="ghost">
                                    <OfflineAwareLink
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.quali}/results`}
                                    >
                                        {sessions.quali}
                                    </OfflineAwareLink>
                                </Button>
                            </li>
                        </ul>
                        <ul className="flex flex-col gap-2">
                            <li>
                                <Button type="button" variant="ghost">
                                    <OfflineAwareLink
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.sprintQuali}/results`}
                                    >
                                        {sessions.sprintQuali}
                                    </OfflineAwareLink>
                                </Button>
                            </li>
                            <li>
                                <Button type="button" variant="ghost">
                                    <OfflineAwareLink
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.fp2}/results`}
                                    >
                                        {sessions.fp2}
                                    </OfflineAwareLink>
                                </Button>
                            </li>
                        </ul>
                        <ul className="flex flex-col gap-2">
                            <li>
                                <Button type="button" variant="ghost">
                                    <OfflineAwareLink
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.race}/results`}
                                    >
                                        {sessions.race}
                                    </OfflineAwareLink>
                                </Button>
                            </li>
                        </ul>
                    </div>
                ) : null}
            </CardContent>
        </Card>
    )
}
