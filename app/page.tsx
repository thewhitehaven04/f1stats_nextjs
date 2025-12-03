import { Button } from "@/uiComponents/button"
import "./globals.css"
import Link from "next/link"

export default function Home() {
    return (
        <section
            id="hero"
            className="bg-[url('/background.jpeg')] bg-center bg-cover text-white h-screen"
        >
            <div className="flex flex-col justify-center h-full items-center gap-4 backdrop-blur-xs text-shadow-md">
                <h1 className="text-5xl font-semibold text-shadow-inherit">F1Stats</h1>
                <span className="text-4xl">
                    F1 Statistics and Telemetry data at your fingertips
                </span>
                <Button
                    type="button"
                    variant={"secondary"}
                    asChild
                    size="lg"
                    className="w-64 text-2xl py-8"
                >
                    <Link href="/season/2025">Get started</Link>
                </Button>
            </div>
        </section>
    )
}
