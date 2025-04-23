import clsx from "clsx"

export const PopupCard = (
    props: {
        children?: React.ReactNode
        actions?: React.ReactNode
        title?: React.ReactNode | string
        onClose: () => void
    } & React.HTMLAttributes<HTMLDivElement>,
) => {
    const { className, children, actions, title, onClose, ...rest } = props
    return (
        <div
            className={clsx(
                "card card-sm bg-base-100 border-2 border-neutral-100 border-solid shadow-xl absolute left-0 top-10 min-w-40 py-4",
                className,
            )}
            {...rest}
        >
            <div className="flex flex-row justify-between items-start px-4">
                <div className="card-title">{title}</div>
                <button type="button" onClick={onClose}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="inline-block h-4 w-4 stroke-current"
                    >
                        <title>Close</title>
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
            {title && <div className="divider w-full px-2 my-0" />}
            <div className="card-body">
                {children}
                <div className="card-actions">{actions}</div>
            </div>
        </div>
    )
}
