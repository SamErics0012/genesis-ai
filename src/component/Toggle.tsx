"use client";
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

interface SwitchToggleProps {
    textLeft: string;
    textRight: string;
    onToggle?: (value: string) => void;
}

const Toggle: React.FC<SwitchToggleProps> = ({ textLeft, textRight, onToggle }) => {
    const [selected, setSelected] = useState<string>(textLeft);
    const indicatorRef = useRef<HTMLDivElement>(null);

    const handleClick = (value: string) => {
        setSelected(value);
        onToggle?.(value);
    };

    useEffect(() => {
        if (indicatorRef.current) {
            gsap.to(indicatorRef.current, {
                x: selected === textLeft ? 0 : "100%",
                duration: 0.3,
                ease: "power2.out",
            });
        }
    }, [selected, textLeft]);

    return (
        <div className="flex items-center justify-center p-4">
            <div className="relative flex bg-gray-200 dark:bg-[#393939] rounded-full p-1 w-48">
                <div
                    ref={indicatorRef}
                    className="absolute top-1 left-1 w-[48%] h-[calc(100%-0.5rem)] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full z-0"
                />
                <button
                    onClick={() => handleClick(textLeft)}
                    className={`flex-1 py-2 z-10 text-sm dark:text-[#fff] font-medium rounded-full transition-colors duration-300 cursor-pointer ${selected === textLeft ? "text-white" : "text-[#070707]"
                        }`}
                >
                    {textLeft}
                </button>
                <button
                    onClick={() => handleClick(textRight)}
                    className={`flex-1 py-2 z-10 text-sm dark:text-[#fff] font-medium rounded-full transition-colors duration-300 cursor-pointer ${selected === textRight ? "text-white" : "text-[#070707]"
                        }`}
                >
                    {textRight}
                </button>
            </div>
        </div>
    );
};

export default Toggle;
