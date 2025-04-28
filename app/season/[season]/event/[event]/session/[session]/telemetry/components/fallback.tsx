export function LaptimeSectionFallback() {
    return (
        <section>
            <h2 className="divider divider-start text-lg">Lap comparison</h2>
            <div className="w-full flex flex-col items-center justify-center h-64">
                <div className="loading loading-spinner" />
                <p>Loading lap data...</p>
            </div>
        </section>
    )
}
