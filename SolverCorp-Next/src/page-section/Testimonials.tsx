"use client";

import { useRef, useState } from "react";
import gsap from "gsap";

import Image from "next/image";
import Icons from "@/src/component/Icons";
import Tag from "@/src/component/Tag";
import Typography from "@/src/component/Typography";

type Testimonial = {
  name: string;
  role: string;
  message: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Amanda Holly",
    role: "Nursing Assistant",
    message:
      "Our business experienced a significant transformation thanks to this team’s digital marketing expertise. They delivered tangible improvements in our online visibility.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "John Doe",
    role: "Marketing Manager",
    message:
      "Their innovative strategies and attention to detail made a huge difference in our campaign performance. Truly outstanding work!",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Lina Kusuma",
    role: "Founder @StartupID",
    message:
      "Pelayanan cepat, profesional, dan sangat membantu bisnis kami berkembang di dunia digital.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const animateContent = () => {
    const tl = gsap.timeline();

    tl.to(contentRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.3,
      ease: "power1.out",
      onComplete: () => {
        tl.to(contentRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power1.out",
        });
      },
    });
  };

  const prev = () => {
    animateContent();
    setTimeout(() => {
      setCurrentIndex((prev) =>
        prev === 0 ? testimonials.length - 1 : prev - 1
      );
    }, 300);
  };

  const next = () => {
    animateContent();
    setTimeout(() => {
      setCurrentIndex((prev) =>
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 300);
  };

  const current = testimonials[currentIndex];

  return (
    <div className="bg-white dark:bg-[#070707] w-full px-[16px] md:px-[72px] py-[48px] md:py-[80px] flex flex-col items-center justify-center gap-[64px]">
      <Tag>
        <Typography size={14} sizeMobile={12} weight={500}>Client Testimonials</Typography>
      </Tag>

      <div className="relative w-full md:px-[32px] text-center">
        <button
          onClick={prev}
          className="hidden md:inline absolute left-4 top-1/2 transform -translate-y-1/2 bg-white border border-[#1146F2] rounded-full w-[48px] h-[48px] p-[10px] flex items-center justify-center dark:bg-[#070707] dark:text-[#fff]"
        >
          <Icons name="arrowLeft" />
        </button>

        <button
          onClick={next}
          className="hidden md:inline absolute right-4 top-1/2 transform -translate-y-1/2 bg-white border border-[#1146F2] rounded-full w-[48px] h-[48px] p-[10px] flex items-center justify-center dark:bg-[#070707] dark:text-[#fff]"
        >
          <Icons name="arrowRight" />
        </button>

        <div className="w-full md:w-[75%] md:mx-auto" ref={contentRef}>
          <p className="text-[24px] md:text-[40px] font-semibold text-[#070707] dark:text-[#fff] leading-[31.6px] md:leading-[48px]">
            {current.message}
          </p>

          <div className="mt-[48px] md:mt-[64px] flex flex-col md:flex-row items-center justify-center gap-[12px] md:gap-[20px]">
            <Image
              src={current.avatar}
              alt={current.name}
              width={52}
              height={52}
              className="w-11 md:w-13 h-11 md:h-13 rounded-full object-cover"
            />
            <div className="text-center md:text-left">
              <p className="font-bold text-[#070707] dark:text-[#fff] text-[16px] md:text-[20px]">
                {current.name}
              </p>
              <p className="text-[14px] md:text-[16px] text-[#070707] dark:text-[#fff]">{current.role}</p>
            </div>
          </div>

          <div className="w-full flex justify-center items-center gap-[24px] mt-[48px] md:hidden">
            <button
              onClick={prev}
              className="bg-white border border-[#1146F2] rounded-full w-[32px] h-[32px] p-[8px] flex items-center justify-center dark:bg-[#070707] dark:text-[#fff]"
            >
              <Icons name="arrowLeft" />
            </button>

            <button
              onClick={next}
              className="bg-white border border-[#1146F2] rounded-full w-[32px] h-[32px] p-[8px] flex items-center justify-center dark:bg-[#070707] dark:text-[#fff]"
            >
              <Icons name="arrowRight" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
