import { Button } from '@/uiComponents/button'
import { Tooltip, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip"
import type { ComponentProps } from "react"

export const TooltipButton = (props: ComponentProps<typeof Button> & { tooltipText: string }) => {
    const { tooltipText, disabled, ...buttonProps } = props
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div>
                    <Button {...buttonProps} disabled={disabled} />
                </div>
            </TooltipTrigger>
            {disabled && (
                <TooltipContent>
                    <span>{tooltipText}</span>
                </TooltipContent>
            )}
        </Tooltip>
    )
}
