import * as fs from "node:fs"

const SAVE_PATH = "/shared/client/apiGenerator/generated"
const OPENAPI_URL = "http://localhost:3000/openapi.json"

export const saveOpenApiSpec = async () => {
    const apiDirectory = process.cwd() + SAVE_PATH

    if (!fs.existsSync(apiDirectory)) {
        fs.mkdirSync(apiDirectory)
    }

    console.log("--------\nDirectory: ", apiDirectory, "\n--------")
    console.log("Fetching API specification from: ", OPENAPI_URL, "\n--------")
    fetch(OPENAPI_URL)
        .then((res) => res.text())
        .then((text) => {
            fs.writeFileSync(`${apiDirectory}/openapi.json`, text)
        })
        .catch(() => {
            throw new Error("Unable to retrieve API specification data")
        })
}

saveOpenApiSpec()
