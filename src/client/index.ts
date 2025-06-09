import { createClient } from "@hey-api/client-fetch"

export const ApiClient = createClient({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL
        ? `https://${process.env.NEXT_PUBLIC_BASE_URL}/`
        : "http://localhost:3000/",
})

console.log(process.env.NEXT_PUBLIC_BASE_URL)