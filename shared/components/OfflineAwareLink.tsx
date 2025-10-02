import Link from 'next/link'
import type { ComponentProps } from 'react'

export const OfflineAwareLink = (props: ComponentProps<typeof Link>) => {
    return (
        <Link
            {...props}
            onNavigate={(evt) => {
                window.navigator.onLine
                    ? props.onNavigate
                        ? props.onNavigate(evt)
                        : null
                    : evt.preventDefault()
            }}
        />
    )
}