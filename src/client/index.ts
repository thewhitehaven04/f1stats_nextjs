import { createClient, createConfig } from "@hey-api/client-fetch"

export const ApiClient = createClient(createConfig({
    baseUrl: "http://localhost:3000",
}))
