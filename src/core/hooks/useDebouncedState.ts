import { useCallback, useRef, useState, type Dispatch, type SetStateAction } from "react"

const DEBOUNCE_TIMEOUT = 300

export function useDebouncedState<T>(value: T, delay: number = DEBOUNCE_TIMEOUT) {
    const [debouncedState, setState] = useState<T>(value)
    const timeoutRef = useRef<NodeJS.Timeout>(null)

    const setValue: Dispatch<SetStateAction<T>> = useCallback(
        (newValue: T | SetStateAction<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }

            timeoutRef.current = setTimeout(
                () => {
                    setState(newValue)
                },
                timeoutRef.current ? 0 : delay,
            )
        },
        [delay],
    )

    return [debouncedState, setValue] as const
}
