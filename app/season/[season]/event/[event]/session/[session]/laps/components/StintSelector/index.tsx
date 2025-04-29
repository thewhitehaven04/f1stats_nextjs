"use client"

import { PopupCard } from "@/components/PopupCard"
import { useState } from "react"
import type { IStint } from "./types"
import { Button } from "@/components/ui/button"

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
                    actions={
                        <Button type="button" size="md" variant="secondary" onClick={handleReset}>
                            Reset
                        </Button>
                    }
                    title="Stints"
                >
                    {driverStints.map((stintInstance) => (
                        <label
                            className="grid grid-cols-[48px,_128px] gap-2 items-center"
                            key={stintInstance.driver}
                        >
                            <span>{stintInstance.driver}</span>
                            <select
                                className="select select-sm w-full text-end"
                                onChange={(evt) =>
                                    onChange({
                                        driver: stintInstance.driver,
                                        stint: Number.parseInt(evt.target.value),
                                    })
                                }
                                value={selectionValues[stintInstance.driver]}
                            >
                                <option value={undefined}>Select stint</option>
                                {stintInstance.stints.map(({ index, text }) => (
                                    <option key={index} defaultValue={index} value={index}>
                                        {index} ({text})
                                    </option>
                                ))}
                            </select>
                        </label>
                    ))}
                </PopupCard>
            )}
        </div>
    )
}
