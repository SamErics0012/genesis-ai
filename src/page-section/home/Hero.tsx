"use client";

import HeroBackground from "@/src/component/HeroBackground";
import Typography from "@/src/component/Typography";
import Button from "@/src/component/Button";
import Icons from "@/src/component/Icons";
import Image from "next/image";
import Link from "next/link";

import Avatar1 from "@/src/assets/images/avatar-1.png";
import Avatar2 from "@/src/assets/images/avatar-2.png";
import Avatar3 from "@/src/assets/images/avatar-3.png";
import Avatar4 from "@/src/assets/images/avatar-4.png";
import Givenchy from "@/src/assets/images/givenchy.png";

interface HeroProps {
  onScrollToTestimonials?: () => void;
}

export default function Hero({ onScrollToTestimonials }: HeroProps) {
  return (
    <HeroBackground>
      <div className="flex flex-col lg:flex-row justify-between items-start self-stretch gap-[8px]">
        {/* Text Section */}
        <div className="w-full order-2 lg:w-[70%] lg:order-1">
          <Typography
            as="div"
            color="#fff"
            size={72}
            sizeTablet={52}
            sizeMobile={40}
            weight={600}
            lineHeight={85}
            lineHeightTablet={64}
            lineHeightMobile={52}
            letterSpacing={-2.16}
            letterSpacingMobile={-1.2}
            noDarkMode
          >
            Unleash Your Creativity
            <br />
            with Genesis AI
          </Typography>

          <Typography
            color="#fff"
            noDarkMode
            size={18}
            className="mt-[24px] lg:w-[60%]"
          >
            Generate stunning videos and images in seconds with our state-of-the-art AI models. 
            Transform your ideas into reality without boundaries.
          </Typography>

          <Link href="/signup">
            <Button variant="primary" className="mt-[32px]">
              START CREATING
            </Button>
          </Link>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-start lg:items-end gap-[12px] pt-[24px] order-1 lg:order-2">
          <div className="flex items-center">
            <Image src={Avatar1} alt="Avatar1" className="w-[32px]" />
            <Image src={Avatar2} alt="Avatar2" className="w-[32px] ml-[-8px]" />
            <Image src={Avatar3} alt="Avatar3" className="w-[32px] ml-[-8px]" />
            <Image src={Avatar4} alt="Avatar4" className="w-[32px] ml-[-8px]" />
          </div>
          <Typography color="#fff" noDarkMode>
            Creators Worldwide
          </Typography>
        </div>
      </div>

      {/* Stats for Mobile */}
      <div className="flex items-center gap-[40px] mt-[48px] lg:hidden">
        <div className="w-[180px]">
          <Typography color="#070707" size={40} weight={600} lineHeight={48}>
            10M+
          </Typography>
          <Typography color="#070707" className="mt-[8px]">
            Assets Generated
          </Typography>
        </div>
        <div className="w-[180px]">
          <Typography color="#070707" size={40} weight={600} lineHeight={48}>
            500K+
          </Typography>
          <Typography color="#070707" className="mt-[8px]">
            Active Users
          </Typography>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-stretch lg:items-end self-stretch mt-[48px] lg:mt-[22px]">
        {/* Scroll Down */}
        <div
          className="hidden lg:flex justify-between items-center gap-[8px] text-[#070707] dark:text-white cursor-pointer"
          onClick={onScrollToTestimonials}
        >
          SCROLL DOWN <Icons name="arrowDown" className="w-5" />
        </div>

        {/* Portfolio + Stats */}
        <div className="relative flex flex-col justify-between items-end pt-[56px] lg:pt-0">
          {/* Desktop Stats */}
          <div className="hidden absolute left-0 top-[-650%] lg:flex items-center gap-[80px]">
            <div className="w-[180px]">
              <Typography color="#070707" size={40} weight={600} lineHeight={48}>
                10M+
              </Typography>
              <Typography color="#070707" className="mt-[8px]">
                Assets Generated
              </Typography>
            </div>
            <div className="w-[180px]">
              <Typography color="#070707" size={40} weight={600} lineHeight={48}>
                500K+
              </Typography>
              <Typography color="#070707" className="mt-[8px]">
                Active Users
              </Typography>
            </div>
          </div>

          {/* Link to Portfolio */}
          <Link href="/dashboard/media-library">
            <div className="flex justify-between items-center gap-[8px] text-[#070707] text-[14px] dark:text-[#fff] cursor-pointer">
              EXPLORE GALLERY <Icons name="arrowUpRight" className="w-5" />
            </div>
          </Link>

          <Typography
            as="div"
            className="lg:hidden"
            color="#070707"
            size={28}
            weight={500}
            lineHeight={24}
          >
            <Typography
              as="span"
              color="#8D8D8D"
              size={28}
              weight={500}
              lineHeight={24}
              noDarkMode
            >
              3
            </Typography>
            /5
          </Typography>
        </div>

        {/* Image + Project */}
        <div className="flex items-end gap-[24px] w-[50%] md:w-auto">
          <Typography
            as="div"
            className="hidden lg:inline-block"
            color="#070707"
            size={28}
            weight={500}
            lineHeight={24}
          >
            <Typography
              as="span"
              color="#8D8D8D"
              size={28}
              weight={500}
              lineHeight={24}
              noDarkMode
            >
              3
            </Typography>
            /5
          </Typography>

          <div>
            <div className="flex justify-between items-start self-stretch">
              <div>
                <Typography color="#8D8D8D" noDarkMode>
                  Featured Creation
                </Typography>
                <Typography color="#070707" weight={600} className="mt-[4px]">
                  COSMIC VOYAGE
                </Typography>
              </div>
              <Typography color="#070707">24 Feb</Typography>
            </div>
            <Image
              src={Givenchy}
              alt="Cosmic Voyage"
              className="w-full md:w-[270px] rounded mt-[12px]"
            />
          </div>
        </div>
      </div>
    </HeroBackground>
  );
}
