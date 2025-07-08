"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { LucideMoon, LucideSettings, LucideSun } from "lucide-react"
import { useTheme } from "next-themes"

export const ThemeSelector = () => {
    const { setTheme, theme } = useTheme()

    return (
        <div className="flex flex-row gap-2">
            <ToggleGroup
                type="single"
                value={theme}
                variant="outline"
                onValueChange={setTheme}
                defaultValue="system"
            >
                <ToggleGroupItem value="light">
                    <LucideSun />
                </ToggleGroupItem>
                <ToggleGroupItem value="dark">
                    <LucideMoon />
                </ToggleGroupItem>
                <ToggleGroupItem value="system">
                    <LucideSettings />
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    )
}
