import Image from "next/image";
import Accordion, { AccordionData } from "@/src/component/Accordion";
import Tag from "@/src/component/Tag";
import Typography from "@/src/component/Typography";

import CaseStudyImg from '@/src/assets/images/CaseStudy.png'

export default function CaseStudy() {
    const accordionData: AccordionData[] = [
        {
            title: "Problem",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
            title: "Challenge",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
            title: "Strategy",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
            title: "Conclusion",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
    ];
    return (
        <div className="bg-white dark:bg-[#070707] py-[60px] md:py-[80px] px-[8px] md:px-[12px] w-full">
            <div className="bg-[#070707] dark:bg-[#1D1D1D] rounded-[20px] py-[64px] md:py-[80px] px-[16px] md:px-[60px]">
                <Tag color="#fff">Case Study</Tag>
                <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-end self-stretch gap-[16px] mt-[24px]">
                    <div className="flex flex-col items-start gap-[24px] w-full lg:w-[50%]">
                        <Typography as="div" noDarkMode size={48} sizeMobile={32} weight={700} lineHeightMobile={41.6} lineHeight={56} color="#fff">
                            Case Study 1: SEO Growth – Before & After Analytics
                        </Typography>
                    </div>
                    <div className="flex flex-col items-start gap-[14px] w-full lg:w-[40%]">
                        <Typography size={14} noDarkMode color="#fff">
                            Discover how our strategic SEO optimization transformed online visibility, boosted organic traffic, and increased conversions through in-depth before-and-after analytics of a successful SEO campaign.
                        </Typography>
                    </div>
                </div>
                <div className="mt-[64px] flex flex-col md:flex-row items-start justify-between gap-[48px] md:gap-[10%]">
                    <Accordion items={accordionData} variant="secondary" className="order-2 md:order-1" />
                    <Image src={CaseStudyImg} alt="CaseStudy" className="w-full order-1 md:order-2 md:w-[45%]" />
                </div>
            </div>
        </div>
    )
}
