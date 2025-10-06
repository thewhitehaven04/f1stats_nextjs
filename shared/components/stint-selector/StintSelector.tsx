"use client"

import { Button } from "@/uiComponents/button"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/uiComponents/select"
import type { IStintSelectorProps } from "./types"
import { Label } from "@/uiComponents/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/uiComponents/popover"

export function StintSelector(props: IStintSelectorProps) {
    const { driverStints, onChange, selectionValues } = props

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button type="button" variant="secondary" size="md">
                    Select stint
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-min">
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
                                <SelectTrigger size="default" className="w-max">
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
