import { ThemeSelector } from '@/shared/components/header/components/ThemeSelector'
import { fetchEventsWithSessions } from "./fetcher/fetcher"
import { PushNotificationManager } from "@/shared/components/header/components/PushNotificationManager"
import { Footer } from '@/shared/components/footer'
import { Header } from '@/shared/components/header'
import { SeasonSelector } from '@/shared/components/header/components/SeasonSelector'
import { SessionSearch } from '@/shared/components/header/components/SessionSearch'

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
