export const TableHeader = ({ children }: { children: React.ReactNode }) => {
    return (
        <thead className='bg-base-200 text-neutral-600'>
            {children}
        </thead>
    )
}