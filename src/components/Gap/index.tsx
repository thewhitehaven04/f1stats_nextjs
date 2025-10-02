import { NaLabel } from '@/components/ValueOrNa'
import { formatTime } from '../../../shared/helpers/formatTime'

export function Gap({ value }: { value: number | null }) {
    if (!value) return <NaLabel />
    return `+${formatTime(value)}`
}
