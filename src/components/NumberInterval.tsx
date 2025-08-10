import {Input} from "@/components/ui/input";
import {useState} from "react";

export const NumberRange = ({name, onRangeChange}: { name: string, onRangeChange: (range: number[]) => void }) => {
    const [start, setStart] = useState<number>(undefined)
    const [end, setEnd] = useState<number>(undefined)

    const handleChange = ({evtStart, evtEnd}: { evtStart?: number, evtEnd?: number }) => {
        if (evtStart) {
            setStart(evtStart)
        }

        if (evtEnd) {
            setEnd(evtEnd)
        }
        if ((start || evtStart) && (end || evtEnd)) {
            const rangeStart = (start || evtStart) ?? 0
            const rangeEnd = (end || evtEnd) ?? 0
            const range = Array.from({length: rangeEnd - rangeStart + 1}).map((_, i) => rangeStart + i)
            onRangeChange(range)
        }
    }

    return (
        <div className='flex flex-col gap-2'>
            <Input type="number" name={`${name}-start`} onChange={(value) => setStart(value)}/>
            <Input type="number" name={`${name}-end`} onChange={(value) => setEnd(value)}/>
        </div>
    )
}