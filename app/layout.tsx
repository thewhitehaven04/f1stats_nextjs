import "./globals.css"
import { Archivo } from "next/font/google"
import { Providers } from "./providers"

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
        <html lang="en" suppressHydrationWarning>
            <body className={`${appFont.className} bg-background text-foreground`}>
                <Providers>
                    <div className="grid grid-cols-1 grid-rows-[min-content] min-h-screen gap-y-4">
                        {children}
                    </div>
                </Providers>
            </body>
        </html>
    )
}
