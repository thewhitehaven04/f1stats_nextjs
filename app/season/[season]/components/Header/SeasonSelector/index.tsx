"use client"
import { useParams, useRouter } from "next/navigation"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
                <SelectValue placeholder="Season" defaultValue={season} />
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
