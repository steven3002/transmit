import { MdClose } from "react-icons/md";

export function CloseButton(
    {
        close,
        className
    }: CloseButtonProps
) {
    return (
        <button
            className={`border border-solid border-neutral-50 rounded-md ${className}`}
            onClick={close}
            type="button"
        >
            <MdClose className="w-4 m-1 text-neutral-900" />
        </button>
    );
}

type CloseButtonProps = {
    close: () => void,
    className?: string
}