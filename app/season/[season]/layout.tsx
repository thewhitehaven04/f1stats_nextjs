import { SessionSearch } from "./components/Header/SessionSearch"
import { Footer } from "./Footer"
import { Header } from "./Header"
import { fetchEventsWithSessions } from "./page"

export default async function Layout({
    children,
    params,
}: { children: React.ReactNode; params: Promise<{ season: string }> }) {
    const events = await fetchEventsWithSessions(Number.parseInt((await params).season))
    return (
        <>
            <Header sessionSearchSlot={<SessionSearch events={events} />} />
            <main className="w-[calc(100vw-36px)] xl:w-[1200px] 2xl:w-[1440px]">{children}</main>
            <div className="flex flex-col justify-end h-full">
                <Footer />
            </div>
        </>
    )
}
