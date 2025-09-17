import "./globals.css"
import { Archivo } from "next/font/google"
import { Providers } from "./providers"
import type { Metadata } from 'next'

const appFont = Archivo({
    subsets: ["latin"],
    variable: "--font-sans",
    weight: ["400", "500", "700"],
})

const APP_NAME = "F1Stats"
const APP_DEFAULT_TITLE = "F1Stats"
const APP_TITLE_TEMPLATE = "%s - PWA App"
const APP_DESCRIPTION = "F1Stats PWA app"

export const metadata: Metadata = {
    applicationName: APP_NAME,
    title: {
        default: APP_DEFAULT_TITLE,
        template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: APP_DEFAULT_TITLE,
        // startUpImage: [],
    },
    formatDetection: {
        telephone: false,
    },
    openGraph: {
        type: "website",
        siteName: APP_NAME,
        title: {
            default: APP_DEFAULT_TITLE,
            template: APP_TITLE_TEMPLATE,
        },
        description: APP_DESCRIPTION,
    },
    twitter: {
        card: "summary",
        title: {
            default: APP_DEFAULT_TITLE,
            template: APP_TITLE_TEMPLATE,
        },
        description: APP_DESCRIPTION,
    },
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${appFont.className} bg-background text-foreground`}>
                <Providers>
                    <div className="grid grid-cols-1 grid-rows-[min-content] min-h-screen w-full gap-y-4">
                        {children}
                    </div>
                </Providers>
            </body>
        </html>
    )
}
