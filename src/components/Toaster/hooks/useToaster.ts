import { ToasterPushContext } from '@/components/Toaster/provider'
import { useContext } from 'react'

export function useToaster() {
    return useContext(ToasterPushContext).addToast
}