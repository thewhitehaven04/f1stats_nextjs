import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent } from "@/components/ui/tooltip"
import { TooltipTrigger } from "@radix-ui/react-tooltip"
import type { ComponentProps } from "react"

export const TooltipButton = (props: ComponentProps<typeof Button> & { tooltipText: string }) => {
    const { tooltipText, ...buttonProps } = props
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button {...buttonProps} />
            </TooltipTrigger>
            <TooltipContent>
                <span>{tooltipText}</span>
            </TooltipContent>
        </Tooltip>
    )
}
