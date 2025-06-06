/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async () => {
        return [
            {
                source: "/api/py/:path*",
                destination:
                    process.env.NODE_ENV === "development"
                        ? "http://127.0.0.1:8000/api/py/:path*"
                        : "/api/py/:path*",
            },
            {
                source: "/docs",
                destination:
                    process.env.NODE_ENV === "development" ? "http://127.0.0.1:8000/docs" : "/docs",
            },
            {
                source: "/openapi.json",
                destination:
                    process.env.NODE_ENV === "development"
                        ? "http://127.0.0.1:8000/openapi.json"
                        : "/openapi.json",
            },
        ]
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "4mb",
        },
    },
}

export default nextConfig
