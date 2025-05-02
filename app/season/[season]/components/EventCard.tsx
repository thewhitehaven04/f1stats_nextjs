"use client"
import Link from "next/link"
import getUnicodeFlagIcon from "country-flag-icons/unicode"
import { format } from "date-fns/format"
import { useParams } from "next/navigation"
import type { TEventWithSessions } from "../page"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const EventCard = (props: TEventWithSessions) => {
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
                                        href={`${season}/event/${name}/session/${sessions[0].type}/results`}
                                    >
                                        {sessions[0].type}
                                    </Link>
                                </Button>
                            </li>
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions[1].type}/results`}
                                    >
                                        {sessions[1].type}
                                    </Link>
                                </Button>
                            </li>
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions[2].type}/results`}
                                    >
                                        {sessions[2].type}
                                    </Link>
                                </Button>
                            </li>
                        </ul>
                        <ul className="flex flex-col">
                            {sessions[3] && (
                                <li>
                                    <Button type="button" variant="ghost">
                                        <Link
                                            className="link-hover"
                                            href={`${season}/event/${name}/session/${sessions[3].type}/results`}
                                        >
                                            {sessions[3].type}
                                        </Link>
                                    </Button>
                                </li>
                            )}
                            {sessions[4] && (
                                <li>
                                    <Button type="button" variant="ghost">
                                        <Link
                                            className="link-hover"
                                            href={`${season}/event/${name}/session/${sessions[4].type}/results`}
                                        >
                                            {sessions[4].type}
                                        </Link>
                                    </Button>
                                </li>
                            )}
                        </ul>
                    </div>
                ) : eventFormat === "testing" ? (
                    <div className="flex flex-row gap-0 justify-start">
                        <ul className="flex flex-col">
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions[0].type}/results`}
                                    >
                                        {sessions[0].type}
                                    </Link>
                                </Button>
                            </li>
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions[1].type}/results`}
                                    >
                                        {sessions[1].type}
                                    </Link>
                                </Button>
                            </li>
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions[2].type}/results`}
                                    >
                                        {sessions[2].type}
                                    </Link>
                                </Button>
                            </li>
                        </ul>
                    </div>
                ) : eventFormat === "sprint_shootout" ? (
                    <div className="flex flex-row gap-0">
                        <ul className="flex flex-col">
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions[0].type}/results`}
                                    >
                                        {sessions[0].type}
                                    </Link>
                                </Button>
                            </li>
                        </ul>
                        <ul className="">
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions[2].type}/results`}
                                    >
                                        {sessions[2].type}
                                    </Link>
                                </Button>
                            </li>
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions[3].type}/results`}
                                    >
                                        {sessions[3].type}
                                    </Link>
                                </Button>
                            </li>
                        </ul>
                        <ul className="flex flex-col">
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions[1].type}/results`}
                                    >
                                        {sessions[1].type}
                                    </Link>
                                </Button>
                            </li>
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions[4].type}/results`}
                                    >
                                        {sessions[4].type}
                                    </Link>
                                </Button>
                            </li>
                        </ul>
                    </div>
                ) : eventFormat === "sprint_qualifying" ? (
                    <div className="flex flex-row gap-0">
                        <ul className="flex flex-col">
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions[0].type}/results`}
                                    >
                                        {sessions[0].type}
                                    </Link>
                                </Button>
                            </li>
                        </ul>
                        <ul className="flex flex-col">
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions[1].type}/results`}
                                    >
                                        {sessions[1].type}
                                    </Link>
                                </Button>
                            </li>
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions[2].type}/results`}
                                    >
                                        {sessions[2].type}
                                    </Link>
                                </Button>
                            </li>
                        </ul>
                        <ul className="flex flex-col">
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions[3].type}/results`}
                                    >
                                        {sessions[3].type}
                                    </Link>
                                </Button>
                            </li>
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions[4].type}/results`}
                                    >
                                        {sessions[4].type}
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
                                        href={`${season}/event/${name}/session/${sessions[0].type}/results`}
                                    >
                                        {sessions[0].type}
                                    </Link>
                                </Button>
                            </li>
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions[2].type}/results`}
                                    >
                                        {sessions[2].type}
                                    </Link>
                                </Button>
                            </li>
                        </ul>
                        <ul className="flex flex-col gap-2">
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions[1].type}/results`}
                                    >
                                        {sessions[1].type}
                                    </Link>
                                </Button>
                            </li>
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions[3].type}/results`}
                                    >
                                        {sessions[3].type}
                                    </Link>
                                </Button>
                            </li>
                        </ul>
                        <ul className="flex flex-col gap-2">
                            <li>
                                <Button type="button" variant="ghost">
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions[4].type}/results`}
                                    >
                                        {sessions[4].type}
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
