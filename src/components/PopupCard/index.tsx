import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import clsx from "clsx"
import { X } from "lucide-react"

export const PopupCard = (
    props: {
        children?: React.ReactNode
        actions?: React.ReactNode
        title?: React.ReactNode | string
        onClose: () => void
    } & React.HTMLAttributes<HTMLDivElement>,
) => {
    const { className, children, actions, title, onClose, ...rest } = props
    return (
        <Card className={clsx("absolute left-0 top-10 min-w-40 py-4", className)} {...rest}>
            <div className="flex flex-row justify-between items-baseline px-2">
                <CardHeader>
                    <CardTitle className='text-xl'>{title}</CardTitle>
                </CardHeader>
                <Button type="button" variant='ghost' size="sm" onClick={onClose}>
                    <X />
                </Button>
            </div>
            <CardContent>{children}</CardContent>
            <CardFooter className="flex flex-row justify-end gap-2">
                <CardAction>{actions}</CardAction>
            </CardFooter>
        </Card>
    )
}
