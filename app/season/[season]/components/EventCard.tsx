"use client"
import Link from "next/link"
import getUnicodeFlagIcon from "country-flag-icons/unicode"
import { format } from "date-fns/format"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { TMappedSeasonEvent } from "../fetcher/types"

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
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.fp1}/results`}
                                    >
                                        {sessions.fp1}
                                    </Link>
                                </Button>
                            </li>
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.fp2}/results`}
                                    >
                                        {sessions.fp2}
                                    </Link>
                                </Button>
                            </li>
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.fp3}/results`}
                                    >
                                        {sessions.fp3}
                                    </Link>
                                </Button>
                            </li>
                        </ul>
                        <ul className="flex flex-col">
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.quali}/results`}
                                    >
                                        {sessions.quali}
                                    </Link>
                                </Button>
                            </li>
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.race}/results`}
                                    >
                                        {sessions.race}
                                    </Link>
                                </Button>
                            </li>
                        </ul>
                    </div>
                ) : eventFormat === "testing" ? (
                    <div className="flex flex-row gap-0 justify-start">
                        <ul className="flex flex-col">
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.fp1}/results`}
                                    >
                                        {sessions.fp1}
                                    </Link>
                                </Button>
                            </li>
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.fp2}/results`}
                                    >
                                        {sessions.fp2}
                                    </Link>
                                </Button>
                            </li>
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.fp3}/results`}
                                    >
                                        {sessions.fp3}
                                    </Link>
                                </Button>
                            </li>
                        </ul>
                    </div>
                ) : eventFormat === "sprint_qualifying" || eventFormat === "sprint_shootout" ? (
                    <div className="flex flex-row gap-0">
                        <ul className="flex flex-col">
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.fp1}/results`}
                                    >
                                        {sessions.fp1}
                                    </Link>
                                </Button>
                            </li>
                        </ul>
                        <ul className="flex flex-col">
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.sprintQuali}/results`}
                                    >
                                        {sessions.sprintQuali}
                                    </Link>
                                </Button>
                            </li>
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.sprint}/results`}
                                    >
                                        {sessions.sprint}
                                    </Link>
                                </Button>
                            </li>
                        </ul>
                        <ul className="flex flex-col">
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.quali}/results`}
                                    >
                                        {sessions.quali}
                                    </Link>
                                </Button>
                            </li>
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.race}/results`}
                                    >
                                        {sessions.race}
                                    </Link>
                                </Button>
                            </li>
                        </ul>
                    </div>
                ) : eventFormat === "sprint" ? (
                    <div className="flex flex-row gap-0">
                        <ul className="flex flex-col gap-2">
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.fp1}/results`}
                                    >
                                        {sessions.fp1}
                                    </Link>
                                </Button>
                            </li>
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.quali}/results`}
                                    >
                                        {sessions.quali}
                                    </Link>
                                </Button>
                            </li>
                        </ul>
                        <ul className="flex flex-col gap-2">
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.sprintQuali}/results`}
                                    >
                                        {sessions.sprintQuali}
                                    </Link>
                                </Button>
                            </li>
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.fp2}/results`}
                                    >
                                        {sessions.fp2}
                                    </Link>
                                </Button>
                            </li>
                        </ul>
                        <ul className="flex flex-col gap-2">
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions.race}/results`}
                                    >
                                        {sessions.race}
                                    </Link>
                                </Button>
                            </li>
                        </ul>
                    </div>
                ) : null}
            </CardContent>
        </Card>
    )
}
