"use client"
import { Breadcrumbs } from "./components/Header/Breadcrumbs"
import Link from "next/link"
import { SessionSearch } from "./components/Header/SessionSearch"
import { SeasonSelector } from "./components/Header/SeasonSelector"

export const Header = () => (
    <div className="sticky backdrop-blur-sm z-40 top-0">
        <header className="bg-base-100 opacity-80 shadow-sm w-screen flex flex-row gap-8 justify-between items-center py-2 pl-4">
            <div className="pl-4 flex flex-row gap-8 items-center">
                <div className="text-xl font-semibold opacity-80">
                    <Link href="/">F1Stats</Link>
                </div>
                <Breadcrumbs />
            </div>
            <div className="flex flex-row gap-2 items-center">
                <SessionSearch />
                <SeasonSelector />
            </div>
        </header>
    </div>
)
