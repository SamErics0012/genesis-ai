"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import Icons from "./Icons";
import { useTheme } from "@/src/context/ThemeProvider";

interface SwitchProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, "onChange"> {
    noDarkMode?: boolean;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({
    noDarkMode = false,
    checked,
    onChange,
    className,
    ...props
}) => {
    const { theme, toggleTheme  } = useTheme();
    const [isOn, setIsOn] = useState(checked ?? false);

    useEffect(() => {
        if (theme === 'light') {
            setIsOn(false);
        } else {
            setIsOn(true);
        }
    }, [theme])


    const toggle = () => {
        if (noDarkMode) {
            setIsOn((prev) => {
                const next = !prev;
                onChange?.(next);
                return next;
            });
        } else {
            if (theme === 'dark') {
                toggleTheme ();
                setIsOn(false);
                onChange?.(false);
            } else {
                toggleTheme ();
                setIsOn(true);
                onChange?.(true);
            }
        }
    };

    return (
        <button
            onClick={toggle}
            className={clsx(
                "relative w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none bg-black border border-[#B2B2B2]",
                className
            )}
            {...props}
        >
            <div
                className={clsx(
                    "absolute left-1.5 top-1.1 w-5 h-5 bg-white rounded-full transform transition-transform duration-300 ease-in-out flex items-center justify-center",
                    isOn ? "translate-x-5.5" : "translate-x-0"
                )}
            >
            </div>
            <div className="flex jusity-between w-full gap-[6px] px-1">
                <Icons name="moon" color="#fff" />
                <Icons name="sun" color="#fff" />
            </div>
        </button>
    );
};

export default Switch;
