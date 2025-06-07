import { defineConfig } from "@hey-api/openapi-ts"

export default defineConfig({
    input: "src/client/apiGenerator/generated/openapi.json",
    output: { path: "src/client/generated", format: "biome" },
    plugins: ["@hey-api/client-fetch"],
    logs: {
        level: "trace",
    },
})
