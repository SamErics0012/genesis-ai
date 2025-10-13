"use client";
import React from "react";
import clsx from "clsx";
import { useTheme } from "@/src/context/ThemeProvider";
import Icons from "./Icons";

interface TagProps extends React.HTMLAttributes<HTMLParagraphElement> {
    className?: string;
    color?: string;
    noDarkMode?: boolean;
    noIcon?: boolean;
}

const Tag: React.FC<TagProps> = ({
    className = "",
    color = "#070707",
    noDarkMode = false,
    noIcon = false,
    children,
}) => {
    const { theme } = useTheme()
    return (
        <div className={clsx(
            "px-[12px] py-[6px] inline-flex items-center gap-[6px] border border-[#1146F2] rounded-full",
            `text-[${color}]`,
            !noDarkMode && "dark:text-white",
            className,
        )} style={{ color: color }}>
            {!noIcon && <Icons name="starsSparkle" className="w-3" color={!noDarkMode && theme === 'dark' ? "#fff" : color} />}
            {children}
        </div>
    );
};

export default Tag;
