export function LapsTableFallback() {
    return (
        <div className="flex flex-col w-full justify-center items-center mt-4">
            <div className="loading loading-spinner loading-lg" />
            <span>Loading laptime data...</span>
        </div>
    )
}
