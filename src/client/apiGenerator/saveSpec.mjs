import * as fs from "node:fs"

const SAVE_PATH = "/src/client/apiGenerator/generated"

export const saveOpenApiSpec = async () => {
    const baseUrl = process.argv[2] ?? "http://localhost:8000"
    const apiDirectory = process.cwd() + SAVE_PATH

    if (!fs.existsSync(apiDirectory)) {
        fs.mkdirSync(apiDirectory)
    }

    const path = `${baseUrl}/openapi.json`
    console.log('Directory', apiDirectory)
    console.log('Fetching API specification from: ', path)
    fetch(path)
        .then((res) => res.text())
        .then((text) => {
            fs.writeFileSync(`${apiDirectory}/openapi.json`, text)
        })
        .catch(() => {
            throw new Error("Unable to retrieve API specification data")
        })
}

saveOpenApiSpec()
