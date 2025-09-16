import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "F1Stats",
        short_name: "F1Stats",
        description: "A progressive web app for visualisation of F1 stats and telemetry data",
        start_url: "/",
        background_color: "#FFFFFF",
        theme_color: "#000000",
        icons: [
            {
                src: "./android-chrome-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "./android-chrome-512x512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    }
}
