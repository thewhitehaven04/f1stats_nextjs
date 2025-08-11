"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@radix-ui/react-select"
import { Plus } from "lucide-react"
import type { TGroup } from "../hooks/useSelectionGroups"
import Color from "color"
import { useForm, type SubmitHandler } from "react-hook-form"

export const SelectionCard = ({
    groups,
    addGroup,
    activeGroup,
    setActiveGroup,
}: {
    groups: TGroup[]
    addGroup: (group: TGroup) => void
    activeGroup: string | undefined
    setActiveGroup: (group: string) => void
}) => {
    const { register, handleSubmit, reset } = useForm<TGroup>({
        defaultValues: {
            name: "",
            color: "#FFF",
        },
    })

    const onSubmit: SubmitHandler<TGroup> = (data) => {
        addGroup({ ...data, color: data.color.toUpperCase() })
        reset()
    }

    return (
        <form className="flex flex-row gap-2" onSubmit={handleSubmit(onSubmit)}>
            <Input
                {...register("name")}
                required
                type="text"
                className="w-48"
                placeholder="Group"
            />
            <Input {...register("color")} required type="color" className="w-12" />
            <div className="flex flex-col justify-end">
                <Button variant="ghost" type="submit">
                    <Plus />
                </Button>
            </div>
            <Separator className="border-1" />
            <div className="flex flex-row gap-4 items-center">
                {groups.map(({ color, name }) => (
                    <Badge
                        key={name}
                        onClick={() => setActiveGroup(name)}
                        variant="default"
                        style={{
                            backgroundColor: color,
                            color: Color().hex(color).isDark() ? "#FFF" : "#000",
                        }}
                        className={`h-9 text-sm hover:cursor-pointer 
                            ${activeGroup === name ? "brightness-75" : ""} 
                            hover:brightness-90 
                        `}
                    >
                        {name}
                    </Badge>
                ))}
            </div>
        </form>
    )
}
