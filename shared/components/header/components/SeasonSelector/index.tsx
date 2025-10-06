"use client"
import { Select, SelectContent, SelectItem, SelectValue } from "@/uiComponents/select"
import { SelectTrigger } from "@radix-ui/react-select"
import { useParams, useRouter } from "next/navigation"
const SUPPORTED_SEASONS = ["2024", "2025"]

export const SeasonSelector = () => {
    const { season } = useParams<{ season: string }>()
    const router = useRouter()
    return (
        <Select
            name="year"
            onValueChange={(val) => {
                router.push(`/season/${val}`)
            }}
        >
            <SelectTrigger>
                <SelectValue placeholder={season} defaultValue={season} />
            </SelectTrigger>
            <SelectContent>
                {SUPPORTED_SEASONS.map((season) => (
                    <SelectItem key={season} value={season}>
                        {season}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
