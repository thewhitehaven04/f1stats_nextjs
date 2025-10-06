import { ToasterPushContext } from '@/shared/components/toaster/provider'
import { useContext } from 'react'

export function useToaster() {
    return useContext(ToasterPushContext).addToast
}