import "./globals.css"
import { Providers } from "./providers"
import { Archivo } from "next/font/google"

export const metadata = {
    title: "F1 Stats",
    description: "F1 Statistics and telemetry data at your fingertips",
}

const appFont = Archivo({
    subsets: ["latin"],
    variable: "--font-sans",
    weight: ["400", "500", "700"],
})

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={appFont.className}>
                <div className="flex flex-col gap-8 items-center overflow-y-scroll min-h-screen">
                    {children}
                </div>
            </body>
        </html>
    )
}
