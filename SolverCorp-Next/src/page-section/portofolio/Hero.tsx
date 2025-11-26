"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import Image from "next/image";
import Button from "@/src/component/Button";
import Typography from "@/src/component/Typography";
import HeroBackground from "@/src/component/HeroBackground";

import Avatar1 from '@/src/assets/images/avatar-1.png';
import Avatar2 from '@/src/assets/images/avatar-2.png';
import Avatar3 from '@/src/assets/images/avatar-3.png';
import Avatar4 from '@/src/assets/images/avatar-4.png';
import SliderPorto1 from '@/src/assets/images/slider-porto-1.png';
import SliderPorto2 from '@/src/assets/images/slider-porto-2.png';
import SliderPorto3 from '@/src/assets/images/slider-porto-3.png';
import SliderPorto4 from '@/src/assets/images/slider-porto-4.png';
import SliderPorto5 from '@/src/assets/images/slider-porto-5.png';
import SliderPorto6 from '@/src/assets/images/slider-porto-6.png';
import Link from "next/link";

const sliders = [
    { src: SliderPorto1, alt: "SliderPorto1", title: "Web Design", name: "Lumina", date: "24 Feb" },
    { src: SliderPorto2, alt: "SliderPorto2", title: "Web Design", name: "Builder", date: "24 Feb" },
    { src: SliderPorto3, alt: "SliderPorto3", title: "Web Design", name: "Emperhia", date: "24 Feb" },
    { src: SliderPorto4, alt: "SliderPorto4", title: "Web Design", name: "YSL", date: "24 Feb" },
    { src: SliderPorto5, alt: "SliderPorto5", title: "Product Design", name: "luxious", date: "24 Feb" },
    { src: SliderPorto6, alt: "SliderPorto6", title: "Web Design", name: "victory gym", date: "24 Feb" },
];

export default function Hero() {
    const sliderRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sliderRef.current) return;

        const wrapper = sliderRef.current.querySelector(".slider-track") as HTMLDivElement;
        if (!wrapper) return;

        const totalWidth = wrapper.scrollWidth / 2;
        gsap.to(wrapper, {
            x: `-=${totalWidth}`,
            duration: 20,
            ease: "linear",
            repeat: -1,
            modifiers: {
                x: (x) => {
                    const current = parseFloat(x);
                    return (current % totalWidth) + "px";
                },
            },
        });
    }, []);
    return (
        <HeroBackground component={
            <div className="mt-[72px] lg:mt-[120px] overflow-hidden w-full" ref={sliderRef}>
                <div className="flex items-center gap-[32px] slider-track w-max">
                    {[...sliders, ...sliders].map((sliders, index) => (
                        <div key={`slider-porto-${index}`} className="flex flex-col items-start gap-[16px] w-[230px]">
                            <Image src={sliders.src} alt={sliders.alt} />
                            <div className="flex justify-between items-end w-full">
                                <div className="flex flex-col items-start justify-between">
                                    <Typography color="#8D8D8D" noDarkMode>{sliders.title}</Typography>
                                    <Typography weight={600}>{sliders.name}</Typography>
                                </div>
                                <Typography>{sliders.date}</Typography>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        }>
            <div className="flex flex-col lg:flex-row justify-between items-start self-stretch">
                <div className="w-full order-2 lg:w-[70%] lg:order-1">
                    <Typography as="div" color="#fff" size={72} sizeTablet={52} sizeMobile={40} weight={600} lineHeight={85} lineHeightTablet={64} lineHeightMobile={52} letterSpacing={-2.16} letterSpacingMobile={-1.2} noDarkMode>
                        {`Creative Strategies, Powerful Results, Your Brand’s Success Story.`}
                    </Typography>
                    <Typography color="#fff" noDarkMode size={18} className="mt-[24px] w-full lg:w-[70%]">
                        {`Transforming ideas into digital success with innovative strategies, data-driven solutions, and creative marketing that elevate your brand's impact`}
                    </Typography>
                    <Link href="/contact">
                        <Button variant="primary" className="mt-[32px]">GET STARTED</Button>
                    </Link>
                </div>
                <div className="flex flex-col items-start lg:items-end gap-[12px] pt-[24px] order-1 lg:order-2">
                    <div className="flex items-center">
                        <Image src={Avatar1} alt="Avatar1" className="w-[32px]" />
                        <Image src={Avatar2} alt="Avatar2" className="w-[32px] ml-[-8px]" />
                        <Image src={Avatar3} alt="Avatar3" className="w-[32px] ml-[-8px]" />
                        <Image src={Avatar4} alt="Avatar4" className="w-[32px] ml-[-8px]" />
                    </div>
                    <Typography color="#fff" noDarkMode>Client Worldwide</Typography>
                </div>
            </div>
        </HeroBackground>
    )
}
