export default async function TelemetryPage({
    lapComparisonHeaderSection,
    telemetrySection,
}: {
    lapComparisonHeaderSection: React.ReactNode
    telemetrySection: React.ReactNode
}) {
    return (
        <>
            {lapComparisonHeaderSection}
            {telemetrySection}
        </>
    )
}
