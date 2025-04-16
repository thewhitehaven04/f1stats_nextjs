export const NaLabel = () => <span className="text-gray-400">N/A</span>

export const ValueOrNa = ({ value }: { value: number | string | null }) => {
    return value ? value : <NaLabel />
}
