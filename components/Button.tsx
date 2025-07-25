import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    children,
    disabled,
    type = "button",
    ...props
}, ref) => {
        return (
            <button type={type}
            className={twMerge(`
                w-full
                rounded-full
                bg-[#ba2ce6]
                border
                border-transparent
                px-3
                py-3
                disabled:opacity-50
                disabled:cursor-not-allowed
                font-bold
                text-black
                hover:opacity-75
                transition
            `, className)} disabled={disabled} ref={ref} {...props}>
                {children}
            </button>
        )
})

Button.displayName = "Button";
export default Button;