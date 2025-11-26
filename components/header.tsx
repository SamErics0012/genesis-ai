'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignupButton } from '@/components/ui/signup-button';
import { cn } from '@/lib/utils';
import { useSession, signOut } from '@/lib/auth-client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Models', href: '/image-generation' },
    { name: 'Pricing', href: '/pricing' },
  ];

  const handleSignOut = async () => {
    await signOut();
    window.location.reload();
  };

  return (
    <header className="fixed top-8 left-1/2 z-[1001] flex -translate-x-1/2 items-center gap-6 rounded-full border border-white/10 bg-black/20 px-6 py-3 shadow-2xl backdrop-blur-xl transition-all hover:bg-black/30 duration-300">
       <Link href="/" className="flex items-center gap-2 mr-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white shadow-inner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <span className="text-base font-semibold tracking-wide text-white">Genesis</span>
       </Link>

       <nav className="flex items-center gap-6">
         {navItems.map((item) => (
           <Link
             key={item.href}
             href={item.href}
             className={cn(
               "text-sm font-medium transition-colors hover:text-white",
               pathname === item.href ? "text-white" : "text-white/60"
             )}
           >
             {item.name}
           </Link>
         ))}
       </nav>

       <div className="ml-4">
         {session ? (
           <DropdownMenu>
             <DropdownMenuTrigger className="outline-none">
               <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 text-white shadow-lg ring-2 ring-white/10 transition-transform hover:scale-105">
                 <span className="text-sm font-bold">
                   {session.user?.email?.[0].toUpperCase() || <User size={16} />}
                 </span>
               </div>
             </DropdownMenuTrigger>
             <DropdownMenuContent align="end" className="w-56 bg-black/90 border-white/10 text-white backdrop-blur-xl z-[1002]">
               <DropdownMenuLabel>My Account</DropdownMenuLabel>
               <DropdownMenuSeparator className="bg-white/10" />
               <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer">
                 <User className="mr-2 h-4 w-4" />
                 <span>Profile</span>
               </DropdownMenuItem>
               <DropdownMenuItem onClick={handleSignOut} className="text-red-400 focus:text-red-400 focus:bg-red-400/10 cursor-pointer">
                 <LogOut className="mr-2 h-4 w-4" />
                 <span>Log out</span>
               </DropdownMenuItem>
             </DropdownMenuContent>
           </DropdownMenu>
         ) : (
           <SignupButton />
         )}
       </div>
    </header>
  );
}
