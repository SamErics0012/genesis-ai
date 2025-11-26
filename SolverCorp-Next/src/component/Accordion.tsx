"use client";
import { useState } from "react";
import AccordionItem from "./AccordionItem";

export interface AccordionData {
    title: string;
    content: string;
}

interface AccordionProps {
    items: AccordionData[];
    variant?: "primary" | "secondary";
    className?: string;
}

const Accordion: React.FC<AccordionProps> = ({ items, variant = "primary", className }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setOpenIndex(prevIndex => (prevIndex === index ? null : index));
    };

    return (
        <div
            className={`w-full flex flex-col gap-6 overflow-hidden ${className ?? ""}`}
        >
            {items.map((item, index) => (
                <AccordionItem
                    key={index}
                    title={item.title}
                    content={item.content}
                    isOpen={openIndex === index}
                    onClick={() => handleToggle(index)}
                    variant={variant}
                />
            ))}
        </div>
    );
};

export default Accordion;
