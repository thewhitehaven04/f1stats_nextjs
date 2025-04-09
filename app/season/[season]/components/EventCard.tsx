"use client"
import type { ScheduledEvent } from "@/client/generated"
import Link from "next/link"
import getUnicodeFlagIcon from "country-flag-icons/unicode"
import { format } from "date-fns/format"
import { NaLabel } from "@/components/ValueOrNa"
import { useParams } from "next/navigation"

export const EventCard = (props: ScheduledEvent) => {
    const {
        EventFormat,
        EventName,
        EventDate,
        Session1,
        Session2,
        Session3,
        Session4,
        Session5,
        Country,
        RoundNumber,
    } = props
    // const isTesting = EventFormat === "testing"
    const { season } = useParams<{ season: string }>()
    return (
        <article
            key={EventName}
            className="card bg-base-100 border-2 border-neutral-100 border-solid card-compact shadow-md"
        >
            <div className="card-body p-3">
                <div className="flex flex-col gap-0">
                    <div className="flex flex-row gap-2 card-title items-center">
                        <span className="text-2xl">{getUnicodeFlagIcon(Country)}</span>
                        <h1 className="text-lg">{EventName}</h1>
                    </div>
                    <span className="text-neutral-500 font-medium">
                        {EventDate ? format(new Date(EventDate), "MMMM dd, yyyy") : <NaLabel />}
                    </span>
                </div>
                {EventFormat === "conventional" ? (
                    <div className="flex flex-row gap-0 justify-start">
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/round/${RoundNumber}/session/${Session1}`}
                                >
                                    {Session1}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/round/${RoundNumber}/session/${Session2}`}
                                >
                                    {Session2}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/round/${RoundNumber}/session/${Session3}`}
                                >
                                    {Session3}
                                </Link>
                            </li>
                        </ul>
                        <ul className="menu menu-vertical p-0">
                            {Session4 && (
                                <li>
                                    <Link
                                        className="link-hover"
                                        href={`${season}/round/${RoundNumber}/session/${Session4}`}
                                    >
                                        {Session4}
                                    </Link>
                                </li>
                            )}
                            {Session5 && (
                                <li>
                                    <Link
                                        className="link-hover"
                                        href={`${season}/round/${RoundNumber}/session/${Session5}`}
                                    >
                                        {Session5}
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                ) : EventFormat === "testing" ? (
                    <div className="flex flex-row gap-0 justify-start">
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/round/${RoundNumber}/session/${Session1}`}
                                >
                                    {Session1}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/round/${RoundNumber}/session/${Session2}`}
                                >
                                    {Session2}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/round/${RoundNumber}/session/${Session3}`}
                                >
                                    {Session3}
                                </Link>
                            </li>
                        </ul>
                    </div>
                ) : EventFormat === "sprint_shoohrefut" ? (
                    <div className="flex flex-row gap-0">
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/round/${RoundNumber}/session/${Session1}`}
                                >
                                    {Session1}
                                </Link>
                            </li>
                        </ul>
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/round/${RoundNumber}/session/${Session3}`}
                                >
                                    {Session3}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/round/${RoundNumber}/session/${Session4}`}
                                >
                                    {Session4}
                                </Link>
                            </li>
                        </ul>
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/round/${RoundNumber}/session/${Session2}`}
                                >
                                    {Session2}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/round/${RoundNumber}/session/${Session5}`}
                                >
                                    {Session5}
                                </Link>
                            </li>
                        </ul>
                    </div>
                ) : EventFormat === "sprint_qualifying" ? (
                    <div className="flex flex-row gap-0">
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/round/${RoundNumber}/session/${Session1}`}
                                >
                                    {Session1}
                                </Link>
                            </li>
                        </ul>
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/round/${RoundNumber}/session/${Session2}`}
                                >
                                    {Session2}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/round/${RoundNumber}/session/${Session3}`}
                                >
                                    {Session3}
                                </Link>
                            </li>
                        </ul>
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/round/${RoundNumber}/session/${Session4}`}
                                >
                                    {Session4}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/round/${RoundNumber}/session/${Session5}`}
                                >
                                    {Session5}
                                </Link>
                            </li>
                        </ul>
                    </div>
                ) : EventFormat === "sprint" ? (
                    <div className="flex flex-row gap-0">
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/round/${RoundNumber}/session/${Session1}`}
                                >
                                    {Session1}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/round/${RoundNumber}/session/${Session3}`}
                                >
                                    {Session3}
                                </Link>
                            </li>
                        </ul>
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/round/${RoundNumber}/session/${Session2}`}
                                >
                                    {Session2}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/round/${RoundNumber}/session/${Session4}`}
                                >
                                    {Session4}
                                </Link>
                            </li>
                        </ul>
                        <ul className="menu menu-vertical p-0">
                            <li>
                                <Link
                                    className="link-hover"
                                    href={`${season}/round/${RoundNumber}/session/${Session5}`}
                                >
                                    {Session5}
                                </Link>
                            </li>
                        </ul>
                    </div>
                ) : null}
            </div>
        </article>
    )
}
