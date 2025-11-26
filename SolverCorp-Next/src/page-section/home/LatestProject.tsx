import Image from "next/image";
import Icons from "@/src/component/Icons";
import Tag from "@/src/component/Tag";
import Typography from "@/src/component/Typography";

import Eclipse from '@/src/assets/images/lates-project-eclipse.png';
import Portofolio1 from '@/src/assets/images/Portfolio-1.png';
import Portofolio2 from '@/src/assets/images/Portfolio-2.png';
import Portofolio3 from '@/src/assets/images/Portfolio-3.png';

export default function LatestProject() {
    return (
        <div className="bg-white dark:bg-[#070707] w-full px-[20px] md:px-[72px] py-[48px] md:py-[80px]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full gap-[24px]">
                <div className="flex flex-col items-start gap-[24px]">
                    <Tag>
                        <Typography size={14} sizeMobile={12} weight={500}>Latest Projects</Typography>
                    </Tag>
                    <div className="text-[32px] md:text-[48px] font-bold leading-[41.6px] md:leading-[56px] text-[#070707] dark:text-[#fff]">
                        Showcasing Creativity, <br />
                        Inspiring <Image src={Eclipse} alt="Eclipse" className="inline w-10 md:w-20" /> Possibilities
                    </div>
                </div>
                <div className="flex gap-[10px] border-b border-[#070707] dark:border-[#fff] cursor-pointer">
                    <Typography size={16} weight={500}>SEE ALL PORTOFOLIO</Typography>
                    <Icons name="arrowRight" className="w-5" />
                </div>
            </div>
            <div className="mt-[64px] grid grid-rows-[auto_1fr] gap-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="aspect-[16/9] w-full md:aspect-auto">
                        <Image src={Portofolio1} alt="Portofolio1" className="w-full h-full object-cover" />
                    </div>
                    <div className="aspect-[16/9] w-full md:aspect-auto">
                        <Image src={Portofolio2} alt="Portofolio2" className="w-full h-full object-cover" />
                    </div>
                </div>
                <div className="aspect-[16/9] w-full md:aspect-auto">
                    <Image src={Portofolio3} alt="Portofolio3" className="w-full h-full object-cover" />
                </div>
            </div>
        </div>
    )
}
