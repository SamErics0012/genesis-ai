import Image from "next/image";
import Tag from "@/src/component/Tag";
import Typography from "@/src/component/Typography";
import Accordion, { AccordionData } from "@/src/component/Accordion";

import Builder from '@/src/assets/images/builder.png';

export default function Faq() {
    const accordionData: AccordionData[] = [
        {
            title: "What services does your digital marketing agency offer?",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
            title: "How can digital marketing benefit my business?",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
            title: "How long does it take to see results?",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
            title: "Do you offer customized marketing strategies?",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
            title: "What industries do you specialize in?",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
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
                            <Typography color="#8D8D8D" noDarkMode>Web Design</Typography>
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
