import { createClient } from "@hey-api/client-fetch"

export const ApiClient = createClient({
    baseUrl:
        process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
            ? `https://${process.env.NEXT_PUBLIC_URL}`
            : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
              ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
              : `http://${process.env.NEXT_PUBLIC_VERCEL_URL}`,
})
