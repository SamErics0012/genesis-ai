"use client";

import IcMoon from "@/src/assets/icons/moon.svg";
import IcSun from "@/src/assets/icons/sun.svg";
import IcList from "@/src/assets/icons/list.svg";
import IcArrowRight from "@/src/assets/icons/arrowRight.svg";
import IcArrowLeft from "@/src/assets/icons/arrowLeft.svg";
import IcArrowDown from "@/src/assets/icons/arrowDown.svg";
import IcArrowUpRight from "@/src/assets/icons/arrowUpRight.svg";
import IcStarsSparkle from "@/src/assets/icons/starsSparkle.svg";
import IcGroup from "@/src/assets/icons/group.svg";
import IcCash from "@/src/assets/icons/cash.svg";
import IcTarget from "@/src/assets/icons/target.svg";
import IcCaretUp from "@/src/assets/icons/caretUp.svg";
import IcCaretDown from "@/src/assets/icons/caretDown.svg";
import IcCopyRight from "@/src/assets/icons/copyRight.svg";
import IcTrendsBlue from "@/src/assets/icons/trendsBlue.svg";
import IcRocketBlue from "@/src/assets/icons/rocketBlue.svg";
import IcTargetBlue from "@/src/assets/icons/targetBlue.svg";
import IcChats from "@/src/assets/icons/chats.svg";
import IcMap from "@/src/assets/icons/map.svg";
import IcPhone from "@/src/assets/icons/phone.svg";
import IcMenu from "@/src/assets/icons/menu.svg";

import clsx from "clsx";
import { useTheme } from "@/src/context/ThemeProvider";
import Image from "next/image";

const iconMap = {
  moon: IcMoon,
  sun: IcSun,
  list: IcList,
  arrowRight: IcArrowRight,
  arrowLeft: IcArrowLeft,
  arrowDown: IcArrowDown,
  arrowUpRight: IcArrowUpRight,
  starsSparkle: IcStarsSparkle,
  group: IcGroup,
  cash: IcCash,
  target: IcTarget,
  caretUp: IcCaretUp,
  caretDown: IcCaretDown,
  copyRight: IcCopyRight,
  trendsBlue: IcTrendsBlue,
  rocketBlue: IcRocketBlue,
  targetBlue: IcTargetBlue,
  chats: IcChats,
  map: IcMap,
  phone: IcPhone,
  menu: IcMenu,
};

interface IconProps {
  name: keyof typeof iconMap;
  className?: string;
  color?: string;
  noDarkMode?: boolean;
}

const Icons: React.FC<IconProps> = ({
  name,
  className = "",
  color = "currentColor",
  noDarkMode = false,
}) => {
  const IconSrc = iconMap[name];
  const { theme } = useTheme();

  if (!IconSrc) return null;

  return (
    <div className={clsx(className, "relative inline-block")}>
       <Image src={IconSrc} alt={name} className="w-full h-full object-contain" />
    </div>
  );
};

export default Icons;
