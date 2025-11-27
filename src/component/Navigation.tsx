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
  { name: "Dashboard", path: "/dashboard" },
  { name: "Login", path: "/login" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="space-x-[40px] hidden lg:flex">
      {navItems.map((item, index) => {
        const isActive = pathname === item.path;

        return (
          <Link
            key={index}
            href={item.path}
            className={clsx(
              "cursor-pointer text-[16px] hover:text-white hover:font-bold transition-colors duration-200",
              isActive
                ? "font-bold text-white"
                : "font-regular text-[#8D8D8D]"
            )}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
