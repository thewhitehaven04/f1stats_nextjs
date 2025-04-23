"use client"
import Link from "next/link"
import getUnicodeFlagIcon from "country-flag-icons/unicode"
import { format } from "date-fns/format"
import { NaLabel } from "@/components/ValueOrNa"
import { useParams } from "next/navigation"
import type { TEventWithSessions } from "../page"

export const EventCard = (props: TEventWithSessions) => {
    const { country, dateStart, name, officialName, sessions, format: eventFormat } = props
    const { season } = useParams<{ season: string }>()
    return (
        <article
            key={name}
            className="card bg-base-100 card-sm shadow-md"
        >
            <div className="card-body p-4">
                <div className="flex flex-col gap-0">
                    <div className="flex flex-row gap-2 card-title items-center">
                        <span className="text-2xl">{country && getUnicodeFlagIcon(country)}</span>
                        <h1 className="text-lg">{name}</h1>
                    </div>
                    <span className="text-neutral-500 font-medium">
                        {dateStart ? format(dateStart, "MMMM dd, yyyy") : <NaLabel />}
                    </span>
                </div>
                {eventFormat === "conventional" ? (
                    <div className="flex flex-row gap-0 justify-start">
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${name}/session/${sessions[0].type}/results`}
                                >
                                    {sessions[0].type}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${name}/session/${sessions[1].type}/results`}
                                >
                                    {sessions[1].type}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${name}/session/${sessions[2].type}/results`}
                                >
                                    {sessions[2].type}
                                </Link>
                            </li>
                        </ul>
                        <ul className="menu menu-vertical p-0">
                            {sessions[3] && (
                                <li>
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions[3].type}/results`}
                                    >
                                        {sessions[3].type}
                                    </Link>
                                </li>
                            )}
                            {sessions[4] && (
                                <li>
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${name}/session/${sessions[4].type}/results`}
                                    >
                                        {sessions[4].type}
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                ) : eventFormat === "testing" ? (
                    <div className="flex flex-row gap-0 justify-start">
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${name}/session/${sessions[0].type}/results`}
                                >
                                    {sessions[0].type}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${name}/session/${sessions[1].type}/results`}
                                >
                                    {sessions[1].type}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${name}/session/${sessions[2].type}/results`}
                                >
                                    {sessions[2].type}
                                </Link>
                            </li>
                        </ul>
                    </div>
                ) : eventFormat === "sprint_shootout" ? (
                    <div className="flex flex-row gap-0">
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${name}/session/${sessions[0].type}/results`}
                                >
                                    {sessions[0].type}
                                </Link>
                            </li>
                        </ul>
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${name}/session/${sessions[2].type}/results`}
                                >
                                    {sessions[2].type}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${name}/session/${sessions[3].type}/results`}
                                >
                                    {sessions[3].type}
                                </Link>
                            </li>
                        </ul>
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${name}/session/${sessions[1].type}/results`}
                                >
                                    {sessions[1].type}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${name}/session/${sessions[4].type}/results`}
                                >
                                    {sessions[4].type}
                                </Link>
                            </li>
                        </ul>
                    </div>
                ) : eventFormat === "sprint_qualifying" ? (
                    <div className="flex flex-row gap-0">
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${name}/session/${sessions[0].type}/results`}
                                >
                                    {sessions[0].type}
                                </Link>
                            </li>
                        </ul>
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${name}/session/${sessions[1].type}/results`}
                                >
                                    {sessions[1].type}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${name}/session/${sessions[2].type}/results`}
                                >
                                    {sessions[2].type}
                                </Link>
                            </li>
                        </ul>
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${name}/session/${sessions[3].type}/results`}
                                >
                                    {sessions[3].type}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${name}/session/${sessions[4].type}/results`}
                                >
                                    {sessions[4].type}
                                </Link>
                            </li>
                        </ul>
                    </div>
                ) : eventFormat === "sprint" ? (
                    <div className="flex flex-row gap-0">
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${name}/session/${sessions[0].type}/results`}
                                >
                                    {sessions[0].type}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${name}/session/${sessions[2].type}/results`}
                                >
                                    {sessions[2].type}
                                </Link>
                            </li>
                        </ul>
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${name}/session/${sessions[1].type}/results`}
                                >
                                    {sessions[1].type}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${name}/session/${sessions[3].type}/results`}
                                >
                                    {sessions[3].type}
                                </Link>
                            </li>
                        </ul>
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${name}/session/${sessions[4].type}/results`}
                                >
                                    {sessions[4].type}
                                </Link>
                            </li>
                        </ul>
                    </div>
                ) : null}
            </div>
        </article>
    )
}
