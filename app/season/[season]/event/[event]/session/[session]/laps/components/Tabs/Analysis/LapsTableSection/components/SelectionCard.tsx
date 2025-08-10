import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@radix-ui/react-select"
import { Plus } from "lucide-react"
import { Form, useForm } from "react-hook-form"
import type { TGroup } from "../hooks/useSelectionGroups"
import Color from "color"

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
    const { register } = useForm<TGroup>({
        defaultValues: {
            name: "",
            color: "#FFF",
        },
    })

    return (
        <Form<TGroup>
            className="flex flex-row gap-2"
            onSubmit={({ event, data }) => {
                event?.preventDefault()
                addGroup(data)
            }}
        >
            <Input
                {...register("name")}
                required
                type="text"
                className="w-48"
                placeholder="Group"
            />
            <Input {...register("color")} required type="color" />
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
                        className={`h-9 text-sm hover:cursor-pointer 
                            ${activeGroup === name ? "brightness-75" : ""} 
                            hover:brightness-90 bg-[${color}] 
                            text-[${Color(color).isDark() ? "#FFF" : "#000"}]
                        `}
                    >
                        {name}
                    </Badge>
                ))}
            </div>
        </Form>
    )
}
