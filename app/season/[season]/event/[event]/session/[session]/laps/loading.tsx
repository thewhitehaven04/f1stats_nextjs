import { LoadingSpinner } from "@/components/SectionLoadingSpinner"

export default function LoadingLaps() {
    return (
        <div className="flex flex-row items-center justify-center min-h-96 w-full gap-4">
            <div className="flex flex-col gap-4">
                <LoadingSpinner />
                Loading laptime data...
            </div>
        </div>
    )
}
