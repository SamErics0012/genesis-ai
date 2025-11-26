import Image from "next/image";
import HeroBackground from "@/src/component/HeroBackground";
import Typography from "@/src/component/Typography";
import Button from "@/src/component/Button";
import Icons from "@/src/component/Icons";

import Avatar1 from '@/src/assets/images/avatar-1.png';
import Avatar2 from '@/src/assets/images/avatar-2.png';
import Avatar3 from '@/src/assets/images/avatar-3.png';
import Avatar4 from '@/src/assets/images/avatar-4.png';

export default function Hero() {
    return (
        <HeroBackground>
            <div className="w-full lg:w-[60%] lg:mx-auto flex flex-col items-start lg:items-center lg:text-center justify-center gap-[72px] lg:gap-[160px]">
                <div className="w-full flex flex-col items-start lg:items-center gap-[24px]">
                    <div className="flex flex-col items-start gap-[12px] pt-[24px]">
                        <div className="flex items-center">
                            <Image src={Avatar1} alt="Avatar1" className="w-[32px]" />
                            <Image src={Avatar2} alt="Avatar2" className="w-[32px] ml-[-8px]" />
                            <Image src={Avatar3} alt="Avatar3" className="w-[32px] ml-[-8px]" />
                            <Image src={Avatar4} alt="Avatar4" className="w-[32px] ml-[-8px]" />
                        </div>
                        <Typography color="#fff" noDarkMode className="md:hidden">Client Worldwide</Typography>
                    </div>
                    <Typography as="div" color="#fff" size={72} sizeTablet={52} sizeMobile={40} weight={600} lineHeight={85} lineHeightTablet={64} lineHeightMobile={52} letterSpacing={-2.16} letterSpacingMobile={-1.2} noDarkMode>
                        {`Connect With Us – Let's
                        Elevate Your Brand!`}
                    </Typography>
                    <Typography color="#fff" noDarkMode size={18} className="md:w-[80%]">
                        Choose a plan that fits your goals and budget, offering scalable solutions with transparent pricing and no hidden fees
                    </Typography>
                    <Button variant="primary" className="mt-[32px]">GET STARTED</Button>
                </div>
                <div className="flex flex-col lg:flex-row items-start justify-between gap-[32px] w-full lg:w-[90%]">
                    <div className="flex items-center gap-[24px]">
                        <div className="bg-[#1D1D1D] dark:bg-[#393939] rounded-[12px] p-[12px]">
                            <Icons name="chats" className="w-[24px] h-[24px]" color="#fff" />
                        </div>
                        <div className="flex flex-col items-start gap-[4px]">
                            <Typography color="#070707" size={20} weight={700}>Live Chat</Typography>
                            <Typography color="#070707" size={14} weight={400} className="underline">sales@adverza.com</Typography>
                        </div>
                    </div>
                    <div className="flex items-center gap-[24px]">
                        <div className="bg-[#1D1D1D] dark:bg-[#393939] rounded-[12px] p-[12px]">
                            <Icons name="map" className="w-[24px] h-[24px]" color="#fff" />
                        </div>
                        <div className="flex flex-col items-start gap-[4px]">
                            <Typography color="#070707" size={20} weight={700}>Visit Us</Typography>
                            <Typography color="#070707" size={14} weight={400} className="underline">Worldwide 87 adibas</Typography>
                        </div>
                    </div>
                    <div className="flex items-center gap-[24px]">
                        <div className="bg-[#1D1D1D] dark:bg-[#393939] rounded-[12px] p-[12px]">
                            <Icons name="phone" className="w-[24px] h-[24px]" color="#fff" />
                        </div>
                        <div className="flex flex-col items-start gap-[4px]">
                            <Typography color="#070707" size={20} weight={700}>Call Us</Typography>
                            <Typography color="#070707" size={14} weight={400} className="underline">+1 234 5678978</Typography>
                        </div>
                    </div>
                </div>
            </div>
        </HeroBackground>
    )
}
