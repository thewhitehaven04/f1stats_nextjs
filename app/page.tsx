import "./globals.css"
import Link from "next/link"

export default function Home() {
    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <section className="hero">
                <div className="hero-content flex flex-col items-center">
                    <h1 className="hero-title text-5xl font-semibold">F1Stats</h1>
                    <span className="text-2xl">
                        F1 Statistics and Telemetry data at your fingertips
                    </span>
                    <Link href="season/2024" className="btn btn-lg btn-neutral btn-wide">
                        Get started
                    </Link>
                </div>
            </section>
        </div>
    )
}
