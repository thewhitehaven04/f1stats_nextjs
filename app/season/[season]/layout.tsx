import { SeasonSelector } from "../../components/SeasonSelector"
import { SessionSearch } from "../../components/SessionSearch"
import { ThemeSelector } from "../../components/ThemeSelector"
import { fetchEventsWithSessions } from "./fetcher"
import { Footer } from "./Footer"
import { Header } from "./Header"

export default async function Layout({
    children,
    params,
}: { children: React.ReactNode; params: Promise<{ season: string }> }) {
    const events = await fetchEventsWithSessions(Number.parseInt((await params).season))
    return (
        <>
            <Header
                rightSlot={
                    <div className='flex flex-row gap-4 ml-12'>
                        <SessionSearch events={events} />
                        <SeasonSelector />
                        <ThemeSelector />
                    </div>
                }
            />
            <main className="mt-8 w-[calc(100vw-36px)] xl:w-[1200px] justify-self-center self-start">
                {children}
            </main>
            <div className="flex flex-col justify-end h-full mt-4">
                <Footer />
            </div>
        </>
    )
}
