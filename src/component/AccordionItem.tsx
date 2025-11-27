"use client";
import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import clsx from "clsx";

import Icons from "./Icons";

interface AccordionItemProps {
    title: string;
    content: string;
    isOpen: boolean;
    onClick: () => void;
    variant?: "primary" | "secondary";
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, content, isOpen, onClick, variant }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const tl = useRef<gsap.core.Timeline | null>(null);

    useLayoutEffect(() => {
        if (!contentRef.current) return;

        if (!tl.current) {
            tl.current = gsap.timeline({ paused: true });
            tl.current.fromTo(
                contentRef.current,
                { height: 0, opacity: 0 },
                { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" }
            );
        }

        if (isOpen) {
            tl.current.play();
        } else {
            tl.current.reverse();
        }
    }, [isOpen]);
    return (
        <div className={clsx(
            "cursor-pointer",
            {
                "bg-[#EEE] dark:bg-[#1D1D1D] p-[24px] rounded-[12px] ": variant === "primary",
                "bg-transparent py-[16px] border-b border-[#1D1D1D] dark:border-[#B2B2B2] last:border-b-0": variant === "secondary",
            },
        )}
            onClick={onClick}
        >
            <button
                className={clsx(
                    "flex items-center justify-between w-full text-left font-medium cursor-pointer",
                    {
                        "text-lg dark:text-[#fff]": variant === "primary",
                        "text-[28px] text-white": variant === "secondary",
                    },
                )}
            >
                {title}
                <div
                    className={clsx(
                        "rounded-full w-9 p-2",
                        variant === "primary" && "bg-white dark:bg-[#393939]",
                        variant === "secondary" &&
                        (isOpen
                            ? "bg-[linear-gradient(282deg,_#1146F2_-8.95%,_#873AE3_118.24%)]"
                            : "bg-[#1D1D1D] dark:bg-[#393939]")
                    )}
                >
                    {isOpen ? (<Icons name="caretUp" />) : <Icons name="caretDown" />}
                </div>
            </button >

            <div
                ref={contentRef}
                className="overflow-hidden text-[#B2B2B2] dark:text-white/60"
                style={{ height: 0, opacity: 0 }}
            >
                <div className="pt-[16px]">
                    {content}
                </div>
            </div>
        </div >
    );
};

export default AccordionItem;
