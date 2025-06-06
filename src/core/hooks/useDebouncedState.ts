import { useCallback, useState } from "react"

const DEBOUNCE_TIMEOUT = 300

export function useDebouncedState<T>(value: T, delay: number = DEBOUNCE_TIMEOUT) {
    const [debouncedState, setState] = useState<T>(value)

    let timeoutId: NodeJS.Timeout | null = null

    const setValue = useCallback(
        (newValue: T) => {
            if (timeoutId) {
                clearTimeout(timeoutId)
            }

            timeoutId = setTimeout(() => {
                setState(newValue)
            }, delay)
        },
        [delay, timeoutId],
    )

    return [debouncedState, setValue] as const
}
