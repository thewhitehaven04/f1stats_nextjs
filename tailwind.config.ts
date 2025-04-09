import type { Config } from "tailwindcss"

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
     
        // Or if using `src` directory:
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    daisyui: {
        themes: ["light"],
    },
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                "non-personal-best": "#F8D30B",
                best: "#AA3CDC",
                "personal-best": "#4DD346",
                "hard-tyre": "#fdfffe",
                "medium-tyre": "#ffe826",
                "soft-tyre": "#e32526",
                "wet-tyre": "#0e629e",
                "intermediate-tyre": "#148f37",
            }
        },
    },
    plugins: [require("@tailwindcss/typography"), require("daisyui")],
}
export default config
