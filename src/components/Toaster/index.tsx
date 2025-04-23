import { useContext } from "react"
import { ToasterContext } from "~/features/toaster/provider"
import { Toast } from "~/features/toaster/Toast"

export function Toaster() {
    const { toasts, dismissToast } = useContext(ToasterContext)

    return (
        <div className="toast z-50">
            {toasts.map((toast) => (
                <Toast key={toast.id} onDismiss={() => dismissToast(toast.id)}>
                    {toast.text}
                </Toast>
            ))}
        </div>
    )
}
