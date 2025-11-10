import { defineConfig } from "@hey-api/openapi-ts"

export default defineConfig({
    input: "shared/client/apiGenerator/generated/openapi.json",
    output: { path: "shared/client/generated", format: "biome" },
    plugins: ["@hey-api/client-fetch"],
    logs: {
        level: "trace",
    },
})
