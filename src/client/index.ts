import { createClient } from "@hey-api/client-fetch"

const url =
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
        ? process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
        : process.env.NEXT_PUBLIC_BASE_URL
          ? `https://${process.env.NEXT_PUBLIC_BASE_URL}/`
          : "http://localhost:3000/"

export const ApiClient = createClient({
    baseUrl: url,
})

console.log('base url: ', url)
