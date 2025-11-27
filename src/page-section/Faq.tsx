import Image from "next/image";
import Tag from "@/src/component/Tag";
import Typography from "@/src/component/Typography";
import Accordion, { AccordionData } from "@/src/component/Accordion";

import Builder from '@/src/assets/images/builder.png';

export default function Faq() {
    const accordionData: AccordionData[] = [
        {
            title: "How does the credit system work?",
            content: "Credits are used to generate images and videos. Different models and quality settings consume different amounts of credits. Credits refresh monthly for subscribers."
        },
        {
            title: "Can I use the generated content commercially?",
            content: "Yes! All content generated on our paid plans comes with a full commercial license, allowing you to use your creations for any project, including client work."
        },
        {
            title: "What video formats do you support?",
            content: "We support export in MP4 and MOV formats up to 4K resolution. You can also import most common video formats for video-to-video transformation."
        },
        {
            title: "Is there a free trial available?",
            content: "Yes, we offer a free tier with limited daily credits so you can test out our models and see the quality for yourself before upgrading."
        },
        {
            title: "Do you offer API access?",
            content: "API access is available on our Pro Studio plan and Enterprise tiers, allowing you to integrate our generation capabilities directly into your applications."
        }
    ];
    return (
        <div className="bg-white dark:bg-[#070707] w-full px-[16px] md:px-[72px] py-[48px] md:py-[80px]">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end w-full gap-[16px]">
                <div className="flex flex-col items-start gap-[24px]">
                    <Tag>
                        <Typography size={14} sizeMobile={12} weight={500}>Frequently Asked Question</Typography>
                    </Tag>
                    <div className="text-[32px] md:text-[48px] font-bold leading-[41.6px] md:leading-[56px] text-[#070707] dark:text-[#fff]">
                        Frequently Asked <br />
                        Question
                    </div>
                </div>
                <div className="flex gap-[10px]">
                    <Typography size={16} sizeMobile={14} weight={500} lineHeight={24}>
                        Clear Answers, Quick Solutions, <br />
                        Helping You Move Forward
                    </Typography>
                </div>
            </div>
            <hr className="hidden lg:block border border-[#B2B2B2] w-full my-[64px]" />
            <div className="flex justify-between items-end mt-[48px] lg:mt-0">
                <div className="hidden lg:flex flex-col">
                    <div className="flex justify-between items-end self-stretch">
                        <div>
                            <Typography color="#8D8D8D" noDarkMode>Featured Artist</Typography>
                            <Typography color="#070707" weight={600} className="mt-[4px]">CHARLOTTE AI</Typography>
                        </div>
                        <Typography color="#070707">24 Feb</Typography>
                    </div>
                    <Image src={Builder} alt="Builder" className="w-[400px] rounded-[16px] mt-[12px]" />
                </div>
                <div className="w-full lg:w-[50%]">
                    <Accordion items={accordionData} />
                </div>
            </div>
        </div>
    )
}
