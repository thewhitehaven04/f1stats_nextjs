import "./globals.css"
import { Providers } from "./providers"

export const metadata = {
    title: "F1 Stats",
    description: "F1 Statistics and telemetry data at your fingertips",
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <div className="flex flex-col gap-8 items-center overflow-y-scroll min-h-screen">
                    <Providers>{children}</Providers>
                </div>
            </body>
        </html>
    )
}
