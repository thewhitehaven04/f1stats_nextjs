import Link from "next/link"
import { SiGithub, SiGmail, SiTelegram } from "react-icons/si"

export const Footer = () => (
    <footer className="w-screen bg-accent py-4 px-12 flex flex-col items-center text-accent-foreground font-medium">
        <div className="flex flex-row justify-between w-full">
            <div className="flex flex-col">
                <p>
                    This site is a passion project and is not affiliated with, endorsed by, or
                    sponsored by Formula 1.
                </p>
                <p>All trademarks and copyrights belong to their respective owners.</p>
                <p className="mt-3">Built by thewhitehaven04, {new Date().getFullYear()}</p>
            </div>
            <div className="flex flex-col items-start gap-2">
                <Link href="https://github.com/thewhitehaven04" className="link link-hover">
                    <SiGithub />
                </Link>
                <Link href="mailto:thewhitehaven04@gmail.com" className="link link-hover">
                    <SiGmail />
                </Link>
                <Link href="https://t.me/Northern_L1ghts" className="link link-hover">
                    <SiTelegram />
                </Link>
            </div>
        </div>
    </footer>
)
