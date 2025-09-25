import { SeasonSelector } from "../../components/SeasonSelector"
import { SessionSearch } from "../../components/SessionSearch"
import { ThemeSelector } from "../../components/ThemeSelector"
import { fetchEventsWithSessions, type TSeasonEvent } from "./fetcher/fetcher"
import { Footer } from "./Footer"
import { Header } from "./Header"
import { PushNotificationManager } from "@/components/PushNotificationManager"

export default async function Layout({
    children,
    params,
}: { children: React.ReactNode; params: Promise<{ season: string }> }) {
    const events = await fetchEventsWithSessions((await params).season)
    return (
        <>
            <Header
                rightSlot={
                    <>
                        <SessionSearch events={events} />
                        <SeasonSelector />
                        <ThemeSelector />
                        <PushNotificationManager />
                    </>
                }
            />
            <main className="w-[calc(100vw-36px)] xl:w-[1200px] justify-self-center self-start flex flex-col gap-8">
                {children}
            </main>
            <div className="flex flex-col justify-end h-full">
                <Footer />
            </div>
        </>
    )
}
