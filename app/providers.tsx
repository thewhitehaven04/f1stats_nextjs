"use client"

import { isServer, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode } from "react"

const getQueryClient = () => {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: Number.POSITIVE_INFINITY,
            },
        },
    })
}

let browserQueryClient: QueryClient | undefined = undefined

const provideClient = () => {
    if (isServer) {
        return getQueryClient()
    }
    if (!browserQueryClient) browserQueryClient = getQueryClient()
    return browserQueryClient
}

export const Providers = ({ children }: { children: ReactNode }) => {
    const queryClient = provideClient()
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
