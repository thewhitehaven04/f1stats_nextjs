import { Button } from "@/components/ui/button"
import "./globals.css"
import Link from "next/link"

export default function Home() {
    return (
        <section className="h-screen flex flex-col justify-center items-center gap-4">
            <h1 className="text-5xl font-semibold">F1Stats</h1>
            <span className="text-3xl">F1 Statistics and Telemetry data at your fingertips</span>
            <Button type="button" asChild size="lg" className='w-64 text-2xl py-8'>
                <Link href="season/2024">
                    Get started
                </Link>
            </Button>
        </section>
    )
}
