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
            <main className="mt-8 w-[calc(100vw-36px)] xl:w-[1200px] justify-self-center self-start">{children}</main>
            <div className="flex flex-col justify-end h-full mt-4">
                <Footer />
            </div>
        </>
    )
}
