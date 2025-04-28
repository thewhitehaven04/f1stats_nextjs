export default async function TelemetryPage({
    laptimeSection,
    telemetrySection,
}: {
    laptimeSection: React.ReactNode
    telemetrySection: React.ReactNode
}) {
    return (
        <>
            {laptimeSection}
            {telemetrySection}
        </>
    )
}
