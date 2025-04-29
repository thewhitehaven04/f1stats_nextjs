"use client"

import { PopupCard } from "@/components/PopupCard"
import { useState } from "react"
import type { IStint } from "./types"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function StintSelector(props: {
    driverStints: {
        driver: string
        stints: IStint[]
    }[]
    onChange: ({
        driver,
        stint,
    }: {
        driver: string
        stint: number
    }) => void
    onReset: () => void
    selectionValues: Record<string, number | undefined>
}) {
    const { driverStints, onChange, onReset, selectionValues } = props
    const [isStintSelectorOpen, setIsStintSelectorOpen] = useState(false)
    const handleReset = () => {
        onReset()
        setIsStintSelectorOpen(false)
    }

    return (
        <div className="relative">
            <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => setIsStintSelectorOpen(!isStintSelectorOpen)}
            >
                Select stint
            </Button>

            {isStintSelectorOpen && (
                <PopupCard
                    onClose={() => setIsStintSelectorOpen(false)}
                    className="w-48"
                    actions={
                        <Button type="button" size="md" variant="secondary" onClick={handleReset}>
                            Reset
                        </Button>
                    }
                    title="Stints"
                >
                    <div className="flex flex-col gap-4 w-full">
                        {driverStints.map((stintInstance) => (
                            <Label
                                className="flex flex-col gap-2 items-start w-full"
                                key={stintInstance.driver}
                            >
                                <span>{stintInstance.driver}</span>
                                <Select
                                    onValueChange={(value) =>
                                        onChange({
                                            driver: stintInstance.driver,
                                            stint: Number.parseInt(value),
                                        })
                                    }
                                >
                                    <SelectTrigger className='w-full'>
                                        <SelectValue
                                            placeholder="Select stint"
                                            defaultValue={selectionValues[stintInstance.driver]}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {stintInstance.stints.map(({ index, text }) => (
                                            <SelectItem
                                                key={index}
                                                defaultValue={index}
                                                value={index.toString()}
                                            >
                                                {index} ({text})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Label>
                        ))}
                    </div>
                </PopupCard>
            )}
        </div>
    )
}
