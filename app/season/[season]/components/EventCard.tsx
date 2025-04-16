"use client"
import Link from "next/link"
import getUnicodeFlagIcon from "country-flag-icons/unicode"
import { format } from "date-fns/format"
import { NaLabel } from "@/components/ValueOrNa"
import { useParams } from "next/navigation"
import type { TEventWithSessions } from "../page"

export const EventCard = (props: TEventWithSessions & { roundNumber: number }) => {
    const { event_format_name, event_name, event_sessions, country, date_start, roundNumber } =
        props
    const { season } = useParams<{ season: string }>()
    return (
        <article
            key={event_name}
            className="card bg-base-100 border-2 border-neutral-100 border-solid card-compact shadow-md"
        >
            <div className="card-body p-3">
                <div className="flex flex-col gap-0">
                    <div className="flex flex-row gap-2 card-title items-center">
                        <span className="text-2xl">{country && getUnicodeFlagIcon(country)}</span>
                        <h1 className="text-lg">{event_name}</h1>
                    </div>
                    <span className="text-neutral-500 font-medium">
                        {date_start ? format(new Date(), "MMMM dd, yyyy") : <NaLabel />}
                    </span>
                </div>
                {event_format_name === "conventional" ? (
                    <div className="flex flex-row gap-0 justify-start">
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${event_name}/session/${event_sessions[0].session_type_id}`}
                                >
                                    {event_sessions[0].session_type_id}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${event_name}/session/${event_sessions[1].session_type_id}`}
                                >
                                    {event_sessions[1].session_type_id}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${event_name}/session/${event_sessions[2].session_type_id}`}
                                >
                                    {event_sessions[2].session_type_id}
                                </Link>
                            </li>
                        </ul>
                        <ul className="menu menu-vertical p-0">
                            {event_sessions[3] && (
                                <li>
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${event_name}/session/${event_sessions[3].session_type_id}`}
                                    >
                                        {event_sessions[3].session_type_id}
                                    </Link>
                                </li>
                            )}
                            {event_sessions[4] && (
                                <li>
                                    <Link
                                        className="link-hover"
                                        href={`${season}/event/${event_name}/session/${event_sessions[4].session_type_id}`}
                                    >
                                        {event_sessions[4].session_type_id}
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                ) : event_format_name === "testing" ? (
                    <div className="flex flex-row gap-0 justify-start">
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${event_name}/session/${event_sessions[0].session_type_id}`}
                                >
                                    {event_sessions[0].session_type_id}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${event_name}/session/${event_sessions[1].session_type_id}`}
                                >
                                    {event_sessions[1].session_type_id}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${event_name}/session/${event_sessions[2].session_type_id}`}
                                >
                                    {event_sessions[2].session_type_id}
                                </Link>
                            </li>
                        </ul>
                    </div>
                ) : event_format_name === "sprint_shootout" ? (
                    <div className="flex flex-row gap-0">
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${event_name}/session/${event_sessions[0].session_type_id}`}
                                >
                                    {event_sessions[0].session_type_id}
                                </Link>
                            </li>
                        </ul>
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${event_name}/session/${event_sessions[2].session_type_id}`}
                                >
                                    {event_sessions[2].session_type_id}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${event_name}/session/${event_sessions[3].session_type_id}`}
                                >
                                    {event_sessions[3].session_type_id}
                                </Link>
                            </li>
                        </ul>
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${event_name}/session/${event_sessions[1].session_type_id}`}
                                >
                                    {event_sessions[1].session_type_id}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${event_name}/session/${event_sessions[4].session_type_id}`}
                                >
                                    {event_sessions[4].session_type_id}
                                </Link>
                            </li>
                        </ul>
                    </div>
                ) : event_format_name === "sprint_qualifying" ? (
                    <div className="flex flex-row gap-0">
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${event_name}/session/${event_sessions[0].session_type_id}`}
                                >
                                    {event_sessions[0].session_type_id}
                                </Link>
                            </li>
                        </ul>
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${event_name}/session/${event_sessions[1].session_type_id}`}
                                >
                                    {event_sessions[1].session_type_id}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${event_name}/session/${event_sessions[2].session_type_id}`}
                                >
                                    {event_sessions[2].session_type_id}
                                </Link>
                            </li>
                        </ul>
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${event_name}/session/${event_sessions[3].session_type_id}`}
                                >
                                    {event_sessions[3].session_type_id}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${event_name}/session/${event_sessions[4].session_type_id}`}
                                >
                                    {event_sessions[4].session_type_id}
                                </Link>
                            </li>
                        </ul>
                    </div>
                ) : event_format_name === "sprint" ? (
                    <div className="flex flex-row gap-0">
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${event_name}/session/${event_sessions[0].session_type_id}`}
                                >
                                    {event_sessions[0].session_type_id}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${event_name}/session/${event_sessions[2].session_type_id}`}
                                >
                                    {event_sessions[2].session_type_id}
                                </Link>
                            </li>
                        </ul>
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${event_name}/session/${event_sessions[1].session_type_id}`}
                                >
                                    {event_sessions[1].session_type_id}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${event_name}/session/${event_sessions[3].session_type_id}`}
                                >
                                    {event_sessions[3].session_type_id}
                                </Link>
                            </li>
                        </ul>
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/event/${event_name}/session/${event_sessions[4].session_type_id}`}
                                >
                                    {event_sessions[4].session_type_id}
                                </Link>
                            </li>
                        </ul>
                    </div>
                ) : null}
            </div>
        </article>
    )
}
