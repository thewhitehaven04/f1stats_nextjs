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
import { LucideX } from "lucide-react"

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
            <div className="flex flex-row justify-between items-center px-2">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <Button type="button" size="sm" onClick={onClose}>
                    <LucideX />
                </Button>
            </div>
            <CardContent>{children}</CardContent>
            <CardFooter className="flex flex-row justify-end gap-2">
                <CardAction>{actions}</CardAction>
            </CardFooter>
        </Card>
    )
}
