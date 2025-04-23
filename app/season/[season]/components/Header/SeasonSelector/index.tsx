"use client"
import Form from "next/form"
import { useParams } from "next/navigation"
import { action } from "./action"
const SUPPORTED_SEASONS = ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"]

export const SeasonSelector = () => {
    const { season } = useParams<{ season: string }>()
    return (
        <Form action={action}>
            <select name="year" className="select select-sm w-max" defaultValue={season}>
                {SUPPORTED_SEASONS.map((season) => (
                    <option key={season} value={season}>
                        {season}
                    </option>
                ))}
            </select>
        </Form>
    )
}
