import { createClient } from "@hey-api/client-fetch"

const baseUrl =
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
        ? `https://${process.env.NEXT_PUBLIC_URL}`
        : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
          ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
          : `http://${process.env.NEXT_PUBLIC_VERCEL_URL}`

export const ApiClient = createClient({
    baseUrl,
})

console.log('base url: ', baseUrl)