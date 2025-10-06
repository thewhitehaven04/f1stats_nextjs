export const ChartLoadingIndicator = () => {
    return (
        <div className="flex flex-col justify-center items-center w-full min-h-96 rounded-lg gap-4">
            <div className="size-12 animate-spin rounded-[50%] border-8 border-x-white border-y-black" />
            Loading the charts...
        </div>
    )
}