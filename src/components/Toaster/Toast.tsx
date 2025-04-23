import type { ReactNode } from "react"

export function Toast({ children, onDismiss }: { children: ReactNode; onDismiss: () => void }) {
    return (
        <div className="alert border-2 border-solid border-neutral-200 shadow-sm" onClick={onDismiss}>
            {children}
        </div>
    )
}
