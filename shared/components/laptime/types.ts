import type { HTMLAttributes } from 'react'

export interface ILaptimeProps extends HTMLAttributes<HTMLDivElement> {
    isPersonalBest?: boolean
    isSessionBest?: boolean
    value: number | null | undefined
}