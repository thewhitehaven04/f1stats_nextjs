import { Footer } from "./Footer"
import { Header } from "./Header"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main className="w-[calc(100vw-36px)] xl:w-[1200px] 2xl:w-[1440px]">{children}</main>
            <div className="flex flex-col justify-end h-full">
                <Footer />
            </div>
        </>
    )
}
