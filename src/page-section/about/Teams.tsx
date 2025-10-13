import Carousel, { member } from "@/src/component/Carousel";
import Tag from "@/src/component/Tag";
import Typography from "@/src/component/Typography";

import Team1 from '@/src/assets/images/team-1.png';
import Team2 from '@/src/assets/images/team-2.png';
import Team3 from '@/src/assets/images/team-3.png';
import Team4 from '@/src/assets/images/team-4.png';
import Team5 from '@/src/assets/images/team-5.png';


const members: member[] = [
    { name: "Cameron Williamson", experience: "8+ Years", image: Team1, position: "Project Manager" },
    { name: "Wade Warren", experience: "5+ Years", image: Team2, position: "UI/UX Design" },
    { name: "Brooklyn Simmons", experience: "4+ Years", image: Team3, position: "UI/UX Design" },
    { name: "Leslie Alexander", experience: "5+ Years", image: Team4, position: "UI/UX Design" },
    { name: "Jacob Jones", experience: "4+ Years", image: Team5, position: "Software Developer" },
    { name: "Cameron Williamson", experience: "8+ Years", image: Team1, position: "Project Manager" },
];

export default function Teams() {
    return (
        <div className="bg-white dark:bg-[#070707] w-full">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-[16px] w-full px-[16px] md:px-[72px] pt-[48px] md:pt-[60px]">
                <div className="flex flex-col items-start gap-[24px] w-full lg:w-[50%]">
                    <Tag>
                        <Typography size={14} sizeMobile={12} weight={500}>Meet The Teams</Typography>
                    </Tag>
                    <div className="text-[32px] md:text-[48px] font-bold leading-[41.6px] md:leading-[56px] text-[#070707] dark:text-[#fff]">
                        Passionate Experts, Driven
                        by Innovation & Results
                    </div>
                </div>
                <div className="flex gap-[10px] w-full lg:w-[40%]">
                    <Typography size={16} weight={500} lineHeight={24}>
                        Meet the creative minds behind our success—dedicated professionals committed to delivering innovative solutions and driving impactful digital growth
                    </Typography>
                </div>
            </div>
            <div className="mt-[60px] md:mt-[80px] pl-[16px] md:pl-[72px] pb-[48px] md:pb-[80px]">
                <Carousel
                    items={members}
                />
            </div>
        </div>
    )
}
