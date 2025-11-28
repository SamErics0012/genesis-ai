"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Gallery", path: "/portofolio" },
  { name: "Features", path: "/services" },
  { name: "Pricing", path: "/pricing" },
];

interface MobileNavigationProps {
  open: boolean;
  handleOpen: () => void;
}

export default function MobileNavigation({ open = false, handleOpen }: MobileNavigationProps) {
  const pathname = usePathname();

  return (
    <div
      className={clsx(
        "fixed top-[10dvh] right-0 w-full h-[90dvh] bg-[#070707] p-[20px] md:px-[72px] text-white z-20 transition-transform duration-500 lg:hidden",
        open ? "translate-x-0" : "translate-x-full"
      )}
    >
      {open && (
        <>
          <div className="w-[1453.467px] h-[1367px] rounded-[1453.467px] bg-[#873AE3] blur-[150px] z-1 absolute left-[-100%] md:left-0 top-[95%]" />
          <div className="w-[1537.615px] h-[1444px] rounded-[1537.615px] bg-[#1146F2] blur-[180px] z-1 absolute left-[-290%] md:left-[-90%] top-[95%]" />
        </>
      )}

      <nav className="space-y-[40px] flex flex-col z-10">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={handleOpen}
              className={clsx(
                "cursor-pointer transition-all",
                isActive ? "text-[18px] font-bold text-white" : "text-[16px] font-normal text-[#8D8D8D]",
                "hover:text-white hover:font-bold"
              )}
            >
              {item.name}
            </Link>
          );
        })}
        <Link
          href="/dashboard"
          onClick={handleOpen}
          className="text-[16px] font-normal text-[#8D8D8D] hover:text-white hover:font-bold transition-all"
        >
          Dashboard
        </Link>
        <Link
          href="/login"
          onClick={handleOpen}
          className="text-[16px] font-normal text-[#8D8D8D] hover:text-white hover:font-bold transition-all"
        >
          Login
        </Link>
        <Link
          href="/signup"
          onClick={handleOpen}
          className="text-[16px] font-normal text-[#8D8D8D] hover:text-white hover:font-bold transition-all"
        >
          Get Started
        </Link>
      </nav>
    </div>
  );
}
