import React from "react";
import clsx from "clsx";

import Icons from "./Icons";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "form" | "back";
}

const Button: React.FC<ButtonProps> = ({
    variant = "primary",
    className,
    children,
    ...props
}) => {
    return (
        <button
            className={clsx(
                "rounded-full font-semibold cursor-pointer text-[14px] md:text-[16px]",
                {
                    "flex bg-[#070707] text-white items-center gap-[24px] p-[6px] pl-[24px]": variant === "primary",
                    "flex bg-[#fff] text-[#070707] items-center gap-[16px] md:gap-[24px] p-[6px] pl-[20px] md:pl-[24px] ": variant === "secondary",
                    "flex bg-[#1146F2] text-white items-center justify-center": variant === "form",
                    "inline-flex bg-[#070707] text-white items-center justify-center py-[12px] px-[24px]": variant === "back",
                },
                className
            )}
            {...props}
        >
            {children}
            <div
                className={clsx(
                    "w-[36px] md:w-[40px] h-[36px] md:h-[40px] p-[10px] rounded-full",
                    {
                        "bg-white": variant === "primary",
                        "bg-[#070707]": variant === "secondary",
                        "hidden": variant === "form" || variant === "back",
                    },
                )}>
                <Icons name="arrowRight" color={variant === "primary" ? "#070707" : "#fff"}  noDarkMode/>
            </div>
        </button>
    );
};

export default Button;
