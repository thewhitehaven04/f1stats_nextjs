"use client"

import { PopupCard } from "@/components/PopupCard"
import { useState } from "react"
import type { IStint } from "./types"

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
            <button
                type="button"
                className="btn btn-sm"
                onClick={() => setIsStintSelectorOpen(!isStintSelectorOpen)}
            >
                Select stint
            </button>

            {isStintSelectorOpen && (
                <PopupCard
                    onClose={() => setIsStintSelectorOpen(false)}
                    actions={
                        <button type="button" className="btn btn-sm w-full" onClick={handleReset}>
                            Reset
                        </button>
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
