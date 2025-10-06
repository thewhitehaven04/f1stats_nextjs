'use client'
import { createContext, useCallback, useMemo, useState, type ReactNode } from "react"
import { v4 as uuidv4 } from 'uuid'

type TToastState = Array<{
    text: string
    id: string
}>

export type TToastContext = {
    toasts: TToastState
    dismissToast: (text: string) => void
}

export type TToastPushContext = {
    addToast: (text: string) => void
}

export const ToasterContext = createContext<TToastContext>({
    toasts: [],
    dismissToast: () => {}
})

export const ToasterPushContext = createContext<TToastPushContext>({ addToast: () => {} })

export function ToasterProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<TToastState>([])

    const dismissToast = useCallback((id: string) => {
        setToasts((toasts) => toasts.filter((toast) => toast.id !== id))
    }, [])

    const addToast = useCallback((text: string) => {
        const id = uuidv4()
        setToasts((toasts) => {
            return [...toasts, { id, text }]
        })

        setTimeout(() => {
            setToasts((toasts) => toasts.filter((toast) => toast.id !== id))
        }, 5000)
    }, [])

    const toastCtxValue = useMemo(
        () => ({
            dismissToast,
            toasts,
        }),
        [dismissToast, toasts],
    )

    const pushToastCtxValue = useMemo(() => ({ addToast }), [addToast])

    return (
        <ToasterContext.Provider value={toastCtxValue}>
            <ToasterPushContext.Provider value={pushToastCtxValue}>{children}</ToasterPushContext.Provider>
        </ToasterContext.Provider>
    )
}
