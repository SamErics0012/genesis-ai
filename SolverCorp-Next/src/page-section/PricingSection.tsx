"use client";
import { useState } from "react";
import Link from "next/link";

import Icons from "@/src/component/Icons";
import Tag from "@/src/component/Tag"
import Typography from "@/src/component/Typography"
import Toggle from "@/src/component/Toggle"

export default function PricingSection() {
    const [selected, setSelected] = useState<string>('Monthly');

    const handleToggle = (value: string) => {
        setSelected(value);
    };
    return (
        <div className="bg-white dark:bg-[#070707] w-full px-[16px] md:px-[72px] py-[80px] flex flex-col items-center gap-[24px]">
            <Tag>
                <Typography size={14} sizeMobile={12} weight={500}>Pricing</Typography>
            </Tag>
            <div className="flex flex-col items-center gap-[40px]">
                <div className="flex flex-col items-center gap-[24px]">
                    <Typography as="div" size={48} sizeMobile={32} weight={700} lineHeight={56} lineHeightMobile={41.6} className="w-full lg:w-[65%] text-center">
                        Upgrade Today – Unlock More
                        Features, More Power, More Growth!
                    </Typography>
                    <Typography as="div" size={14} lineHeight={24} className="text-center w-full md:w-[80%] lg:w-[40%]">
                        Investing in your growth has never been easier. Discover our flexible pricing
                        plans  and unlock a world of possibilities.
                    </Typography>
                </div>
            </div>
            <Toggle textLeft="Monthly" textRight="Annually" onToggle={handleToggle} />
            <div className="bg-[#EEE] dark:bg-[#1D1D1D] flex flex-col lg:flex-row items-start gap-[24px] p-[24px] rounded-[20px] w-full md:w-[75%]">
                <div className="w-full lg:w-[50%] rounded-[12px] p-[24px] cursor-pointer hover:bg-white group hover:dark:bg-[#393939] transition-all duration-300">
                    <Typography size={32} weight={600} lineHeight={40}>
                        Standard Plan
                    </Typography>
                    <Typography as="div" size={40} weight={600} lineHeight={48} className="mt-[24px] flex items-center gap-[8px]">
                        $40 {selected === "Monthly" && (<Typography as="span" size={14}>/Month</Typography>)}
                    </Typography>
                    <Typography as="div" size={14} lineHeight={24} className="mt-[12px]">
                        Perfect for individuals and small businesses looking to establish their online presence.
                    </Typography>
                    <Link href="/contact">
                        <div className="my-[32px] rounded-full border  border-[#1D1D1D] dark:border-[#fff] dark:text-[#fff] py-[18px] flex items-center justify-center group-hover:bg-[#1146F2] group-hover:border-[#1146F2] group-hover:text-white group-hover:dark:text-[#070707]">
                            <div>GET STARTED</div>
                        </div>
                    </Link>
                    <div className="flex flex-col items-start gap-[12px] dark:text-[#fff]">
                        <div className="flex items-center gap-[16px]">
                            <Icons name="arrowUpRight" className="w-5" />
                            Full Access to All Features
                        </div>
                        <div className="flex items-center gap-[16px]">
                            <Icons name="arrowUpRight" className="w-5" />
                            Higher Limits & Scalability
                        </div>
                        <div className="flex items-center gap-[16px]">
                            <Icons name="arrowUpRight" className="w-5" />
                            Priority Customer Support
                        </div>
                        <div className="flex items-center gap-[16px]">
                            <Icons name="arrowUpRight" className="w-5" />
                            Advanced Analytics & Insights
                        </div>
                        <div className="flex items-center gap-[16px]">
                            <Icons name="arrowUpRight" className="w-5" />
                            Seamless Integrations
                        </div>
                        <div className="flex items-center gap-[16px]">
                            <Icons name="arrowUpRight" className="w-5" />
                            Exclusive Early Access to New Features
                        </div>
                        <div className="flex items-center gap-[16px]">
                            <Icons name="arrowUpRight" className="w-5" />
                            Enhanced Security & Reliability
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-[50%] rounded-[12px] p-[24px] relative cursor-pointer hover:bg-white hover:dark:bg-[#393939] group transition-all duration-300">
                    <div className="absolute top-0 right-2 lg:right-10 p-[8px] text-[14px] text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-[8px]">
                        Best Value!
                    </div>
                    <Typography size={32} weight={600} lineHeight={40}>
                        Premium Plan
                    </Typography>
                    <Typography as="div" size={40} weight={600} lineHeight={48} className="mt-[24px] flex items-center gap-[8px]">
                        $80 {selected === "Monthly" && (<Typography as="span" size={14}>/Month</Typography>)}
                    </Typography>
                    <Typography as="div" size={14} lineHeight={24} className="mt-[12px]">
                        Perfect for individuals and small businesses looking to establish their online presence.
                    </Typography>
                    <Link href="/contact">
                        <div className="my-[32px] rounded-full border border-[#1D1D1D] dark:border-[#fff] dark:text-[#fff] py-[18px] flex items-center justify-center group-hover:bg-[#1146F2] group-hover:border-[#1146F2] group-hover:text-white group-hover:dark:text-[#070707]">
                            <div>GET STARTED</div>
                        </div>
                    </Link>
                    <div className="flex flex-col items-start gap-[12px] dark:text-[#fff]">
                        <div className="flex items-center gap-[16px]">
                            <Icons name="arrowUpRight" className="w-5" />
                            Full Access to All Features
                        </div>
                        <div className="flex items-center gap-[16px]">
                            <Icons name="arrowUpRight" className="w-5" />
                            Higher Limits & Scalability
                        </div>
                        <div className="flex items-center gap-[16px]">
                            <Icons name="arrowUpRight" className="w-5" />
                            Priority Customer Support
                        </div>
                        <div className="flex items-center gap-[16px]">
                            <Icons name="arrowUpRight" className="w-5" />
                            Advanced Analytics & Insights
                        </div>
                        <div className="flex items-center gap-[16px]">
                            <Icons name="arrowUpRight" className="w-5" />
                            Seamless Integrations
                        </div>
                        <div className="flex items-center gap-[16px]">
                            <Icons name="arrowUpRight" className="w-5" />
                            Exclusive Early Access to New Features
                        </div>
                        <div className="flex items-center gap-[16px]">
                            <Icons name="arrowUpRight" className="w-5" />
                            Enhanced Security & Reliability
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
