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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button type="button" variant="secondary" size="md">
                    Select stint
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-min'>
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
                                value={selectionValues[stintInstance.driver]?.toString()}
                            >
                                <SelectTrigger size="default" className='w-max'>
                                    <SelectValue placeholder="Select stint" />
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
            </PopoverContent>
        </Popover>
    )
}
