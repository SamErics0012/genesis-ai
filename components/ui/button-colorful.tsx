import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface ButtonColorfulProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    variant?: "default" | "purple" | "blue" | "green";
}

export function ButtonColorful({
    className,
    label = "Explore Components",
    variant = "purple",
    ...props
}: ButtonColorfulProps) {
    const gradients = {
        default: "from-indigo-500 via-purple-500 to-pink-500",
        purple: "from-purple-500 via-pink-500 to-purple-600",
        blue: "from-blue-500 via-cyan-500 to-blue-600",
        green: "from-green-500 via-emerald-500 to-green-600",
    };

    return (
        <Button
            className={cn(
                "relative h-10 px-4 overflow-hidden",
                "bg-zinc-900 dark:bg-zinc-100",
                "transition-all duration-200",
                "group",
                className
            )}
            {...props}
        >
            {/* Gradient background effect */}
            <div
                className={cn(
                    "absolute inset-0",
                    "bg-gradient-to-r",
                    gradients[variant],
                    "opacity-40 group-hover:opacity-80",
                    "blur transition-opacity duration-500"
                )}
            />

            {/* Content */}
            <div className="relative flex items-center justify-center gap-2">
                <span className="text-white dark:text-zinc-900">{label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/90 dark:text-zinc-900/90" />
            </div>
        </Button>
    );
}
