import { Breadcrumbs } from "./components/Header/Breadcrumbs"
import Link from "next/link"
import { OfflineHeader } from "./OfflineHeader"

export const Header = ({ rightSlot }: { rightSlot?: React.ReactNode }) => (
    <div className="sticky backdrop-blur-sm z-40 top-0">
        <header className="bg-base-100 opacity-80 shadow-sm w-screen flex flex-col md:flex-row gap-2 md:gap-8 justify-between items-center px-4 py-1 md:py-2">
            <div className="flex flex-row gap-8 items-start md:items-center w-full">
                <div className="text-xl font-semibold opacity-80">
                    <Link href="/">F1Stats</Link>
                </div>
                <OfflineHeader />
                <Breadcrumbs />
            </div>
            <div className="flex flex-row md:justify-end gap-2 w-full">{rightSlot}</div>
        </header>
    </div>
)
