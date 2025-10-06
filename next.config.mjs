import withSerwistInit from "@serwist/next"

const withSerwist = withSerwistInit({
    // Note: This is only an example. If you use Pages Router,
    // use something else that works, such as "service-worker/index.ts".
    swSrc: "/shared/workers/sw.ts",
    swDest: "public/sw.js",
    cacheOnNavigation: true,
})

const nextConfig = withSerwist({
    rewrites: async () => {
        return [
            {
                source: "/api/:slug*",
                destination:
                    process.env.NODE_ENV === "development"
                        ? "http://127.0.0.1:8000/api/:slug*"
                        : "/api/:slug*",
            },
            {
                source: "/docs",
                destination:
                    process.env.NODE_ENV === "development"
                        ? "http://127.0.0.1:8000/docs"
                        : "/api/docs",
            },
            {
                source: "/openapi.json",
                destination:
                    process.env.NODE_ENV === "development"
                        ? "http://127.0.0.1:8000/openapi.json"
                        : "/api/openapi.json",
            },
        ]
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "4mb",
        },
    },
    headers: async () => {
        return [
            {
                source: "/sw.js",
                headers: [
                    {
                        key: "Content-Type",
                        value: "application/javascript; charset=utf-8",
                    },
                    {
                        key: "Cache-Control",
                        value: "no-cache, no-store, must-revalidate",
                    },
                    {
                        key: "Content-Security-Policy",
                        value: "default-src 'self'; script-src 'self'",
                    },
                ],
            },
        ]
    },
})

export default nextConfig
