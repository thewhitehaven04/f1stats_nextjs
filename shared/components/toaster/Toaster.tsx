import { ToasterContext } from "@/shared/components/toaster/provider"
import { Toast } from "@/shared/components/toaster/components/Toast"
import { useContext } from "react"

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
