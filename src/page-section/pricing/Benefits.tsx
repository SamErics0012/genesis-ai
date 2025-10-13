import Image from "next/image";
import Tag from "@/src/component/Tag";
import Typography from "@/src/component/Typography";

import Eclipse from '@/src/assets/images/lates-project-eclipse.png';
import Trends from '@/src/assets/images/trends.png';
import Rocket from '@/src/assets/images/rocket.png';
import TargetBlue from '@/src/assets/images/targetBlue.png';

export default function Benefits() {
    return (
        <div className="bg-white dark:bg-[#070707] w-full px-[16px] md:px-[72px] py-[60px] md:py-[80px]">
            <Tag>
                <Typography size={14} sizeMobile={12} weight={500}>Benefits</Typography>
            </Tag>
            <div className="flex flex-col lg:flex-row justify-between items-start w-full mt-[24px] gap-[16px]">
                <div className="text-[32px] md:text-[48px] font-bold leading-[41.6px] md:leading-[56px] text-[#070707] dark:text-[#fff] w-full lg:w-[50%]">
                    Benefits of Upgrading to <br />
                    the Premium Plan <Image src={Eclipse} alt="Eclipse" className="inline w-12 md:w-20" />
                </div>
                <div className="flex gap-[10px] w-full lg:w-[30%]">
                    <Typography size={16} weight={500}>
                        Get premium design talent at a predictable flat rate. Adibas offers versatile design solutions to meet all your business needs. Choose your plan now!
                    </Typography>
                </div>
            </div>
            <div className="mt-[64px] flex flex-col lg:flex-row items-center gap-[24px]">
                <div className="flex flex-1 shrink-0 basis-0 flex-col items-start gap-[32px] bg-[#EEE] dark:bg-[#1D1D1D] border border-[#EEE] rounded-[12px] p-[24px]">
                    <Image src={Trends} alt="Trends" className="w-15" />
                    <div>
                        <Typography size={20} weight={700} lineHeight={32}>
                            Advanced Features & Tools
                        </Typography>
                        <Typography className="mt-[8px]">
                            Unlock exclusive features, automation, and premium tools to enhance efficiency and performance.
                        </Typography>
                    </div>
                </div>
                <div className="flex  flex-1 shrink-0 basis-0 flex-col items-start gap-[32px] bg-[#EEE] dark:bg-[#1D1D1D] border border-[#EEE] rounded-[12px] p-[24px]">
                    <Image src={Rocket} alt="Rocket" className="w-15" />
                    <div>
                        <Typography size={20} weight={700} lineHeight={32}>
                            Priority Support & Assistance
                        </Typography>
                        <Typography className="mt-[8px]">
                            Unlock exclusive features, automation, and premium tools to enhance efficiency and performance.
                        </Typography>
                    </div>
                </div>
                <div className="flex flex-1 shrink-0 basis-0 flex-col items-start gap-[32px] bg-[#EEE] dark:bg-[#1D1D1D] border border-[#EEE] rounded-[12px] p-[24px]">
                    <Image src={TargetBlue} alt="TargetBlue" className="w-15" />
                    <div>
                        <Typography size={20} weight={700} lineHeight={32}>
                            Higher Limits & Customization
                        </Typography>
                        <Typography className="mt-[8px]">
                            Unlock exclusive features, automation, and premium tools to enhance efficiency and performance.
                        </Typography>
                    </div>
                </div>
            </div>
            <div className="mt-[24px] flex flex-col lg:flex-row items-center gap-[24px]">
                <div className="flex flex-1 shrink-0 basis-0 flex-col items-start gap-[32px] bg-[#EEE] dark:bg-[#1D1D1D] border border-[#EEE] rounded-[12px] p-[24px]">
                    <Image src={Trends} alt="Trends" className="w-15" />
                    <div>
                        <Typography size={20} weight={700} lineHeight={32}>
                            Better Performance & Insights
                        </Typography>
                        <Typography className="mt-[8px]">
                            Unlock exclusive features, automation, and premium tools to enhance efficiency and performance.
                        </Typography>
                    </div>
                </div>
                <div className="flex flex-1 shrink-0 basis-0 flex-col items-start gap-[32px] bg-[#EEE] dark:bg-[#1D1D1D] border border-[#EEE] rounded-[12px] p-[24px]">
                    <Image src={Rocket} alt="Rocket" className="w-15" />
                    <div>
                        <Typography size={20} weight={700} lineHeight={32}>
                            Exclusive Access to Updates
                        </Typography>
                        <Typography className="mt-[8px]">
                            Unlock exclusive features, automation, and premium tools to enhance efficiency and performance.
                        </Typography>
                    </div>
                </div>
                <div className="flex flex-1 shrink-0 basis-0 flex-col items-start gap-[32px] bg-[#EEE] dark:bg-[#1D1D1D] border border-[#EEE] rounded-[12px] p-[24px]">
                    <Image src={TargetBlue} alt="TargetBlue" className="w-15" />
                    <div>
                        <Typography size={20} weight={700} lineHeight={32}>
                            Enhanced Security & Reliability
                        </Typography>
                        <Typography className="mt-[8px]">
                            Unlock exclusive features, automation, and premium tools to enhance efficiency and performance.
                        </Typography>
                    </div>
                </div>
            </div>
        </div>
    )
}
