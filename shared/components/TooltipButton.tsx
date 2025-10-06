import { Button } from '@/uiComponents/button'
import type { ComponentProps } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

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
