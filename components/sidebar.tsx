"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import { getUserSubscription } from "@/lib/subscription";
import { 
  Home,
  LayoutDashboard, 
  FolderOpen, 
  Library, 
  Video, 
  Circle,
  Play,
  Wand2,
  ImagePlus,
  Banana,
  Sparkles as SparklesIcon,
  Zap,
  BarChart3,
  Aperture,
  Grid3x3,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  LogOut,
  ChevronUp,
  CreditCard
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PurchaseButton } from "@/components/purchase-button";
import { useTheme } from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getIconUrl = (iconName: string, theme: string) => {
  const themeFolder = theme === "dark" ? "dark" : "light";
  return `https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/${themeFolder}/${iconName}.png`;
};

const menuItems = [
  { icon: Home, label: "Home", active: false },
  { icon: LayoutDashboard, label: "Dashboard", active: false },
  { icon: Library, label: "Media Library", active: false },
];

const videoGeneration = [
  { icon: Video, label: "Create Video", active: true, iconUrl: null, badge: undefined },
];

const imageGeneration = [
  { icon: Wand2, label: "Edit Image", active: false, iconUrl: null, route: "/edit-image" },
  { icon: ImagePlus, label: "Create Image", active: false, iconUrl: null, route: "/image-generation/flux-kontext-pro" },
  { icon: Zap, label: "Flux Ultra Raw 1.1", active: false, iconUrl: "flux", route: "/image-generation/flux-ultra-raw-1-1" },
  { icon: Zap, label: "Flux Kontext Pro", active: false, iconUrl: "flux", route: "/image-generation/flux-kontext-pro" },
  { icon: Zap, label: "Flux Kontext Max", active: false, iconUrl: "flux", route: "/image-generation/flux-kontext-max" },
  { icon: Circle, label: "Google Nano Banana", active: false, iconUrl: "google", route: "/image-generation/google-nano-banana" },
  { icon: Circle, label: "Google Imagen-3", active: false, iconUrl: "google", route: "/image-generation/google-imagen-3" },
  { icon: Circle, label: "Google Imagen-4", active: false, iconUrl: "google", route: "/image-generation/google-imagen-4" },
  { icon: SparklesIcon, label: "OpenAI GPT-Image", active: false, iconUrl: "openai", route: "/image-generation/openai-gpt-image" },
  { icon: Circle, label: "Runway Gen 4 Image", active: false, iconUrl: "runway", route: "/image-generation/runway-gen-4-image" },
  { icon: Grid3x3, label: "Ideogram V3", active: false, iconUrl: "ideogram", route: "/image-generation/ideogram-v3" },
];

interface SidebarProps {
  onNavigate?: (view: "home" | "video-gen" | "image-gen" | "account-settings" | "media-library" | "edit-image") => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [subscription, setSubscription] = React.useState<any>(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const [displayName, setDisplayName] = React.useState("User");
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const [userEmail, setUserEmail] = React.useState("");

  // Fetch user profile from database
  React.useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/user/profile?userId=${session.user.id}`);
          if (response.ok) {
            const { user } = await response.json();
            if (user) {
              setDisplayName(user.display_name || user.name || user.email?.split('@')[0] || 'User');
              setAvatarUrl(user.profile_picture_url);
              setUserEmail(user.email);
              
              // Save to localStorage for quick access
              localStorage.setItem("displayName", user.display_name || user.name || '');
              if (user.profile_picture_url) {
                localStorage.setItem("userAvatar", user.profile_picture_url);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Fallback to localStorage
          const savedName = localStorage.getItem("displayName");
          const savedAvatar = localStorage.getItem("userAvatar");
          if (savedName) setDisplayName(savedName);
          if (savedAvatar) setAvatarUrl(savedAvatar);
        }
      }
    };

    fetchUserProfile();

    // Listen for profile update events
    const handleProfileUpdate = (event: any) => {
      if (event.detail) {
        if (event.detail.displayName) {
          setDisplayName(event.detail.displayName);
        }
        if (event.detail.avatarUrl) {
          setAvatarUrl(event.detail.avatarUrl);
        }
      }
      // Also refetch from database to ensure consistency
      fetchUserProfile();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, [session?.user?.id]);

  // Check subscription status
  React.useEffect(() => {
    const checkSubscription = async () => {
      if (session?.user?.id) {
        try {
          const userSubscription = await getUserSubscription(session.user.id, session.access_token);
          setSubscription(userSubscription);
        } catch (error) {
          console.error('Error fetching subscription:', error);
        }
      }
    };

    checkSubscription();
  }, [session?.user?.id]);

  const getInitial = () => {
    return displayName.charAt(0).toUpperCase();
  };

  // Check if route is active
  const isRouteActive = (route: string) => {
    if (route === "home") return pathname === "/";
    if (route === "dashboard") return pathname === "/dashboard";
    if (route === "media-library") return pathname === "/dashboard/media-library";
    if (route === "edit-image") return pathname === "/edit-image";
    if (route === "video-gen") return pathname?.startsWith("/video-generation");
    if (route === "image-gen") return pathname?.startsWith("/image-generation");
    return false;
  };
  
  return (
    <div 
      className={`flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300 ease-in-out relative ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      style={{ 
        borderRadius: '0 16px 16px 0',
        boxShadow: '4px 0 12px rgba(0, 0, 0, 0.1), 8px 0 24px rgba(0, 0, 0, 0.08)',
        zIndex: 1000
      }}
    >
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center justify-center px-3">
        {isCollapsed ? (
          <button 
            onClick={() => setIsCollapsed(false)}
            className="flex items-center justify-center transition-all duration-300 hover:opacity-80"
          >
            <Play className="h-7 w-7 text-purple-500" />
          </button>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Play className="h-7 w-7 text-purple-500" />
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-xl text-foreground">
                  GΣПΣƧIƧ ΛI
                </span>
                <span className="rounded border border-purple-500 px-1 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-purple-500">
                  Beta
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 ml-auto"
              onClick={() => setIsCollapsed(true)}
            >
              <PanelLeftClose className="h-4 w-4" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </>
        )}
      </div>

      <ScrollArea className="flex-1 overflow-auto px-3 py-4">
        {/* Main Menu */}
        <div className="space-y-1">
          {menuItems.map((item) => {
            const route = item.label === "Home" ? "home" : item.label === "Dashboard" ? "dashboard" : "media-library";
            const active = isRouteActive(route);
            return (
              <Button
                key={item.label}
                variant={active ? "secondary" : "ghost"}
                className={`w-full gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-300 ${
                  isCollapsed ? 'justify-center px-2' : 'justify-start'
                }`}
                onClick={() => {
                  if (item.label === "Home") {
                    router.push("/");
                  } else if (item.label === "Dashboard") {
                    router.push("/dashboard");
                  } else if (item.label === "Media Library") {
                    router.push("/dashboard/media-library");
                  }
                }}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className={`text-sm transition-all duration-300 ${
                  isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'
                }`}>{item.label}</span>
              </Button>
            );
          })}
        </div>

        <Separator className={`my-4 transition-all duration-300 ${
          isCollapsed ? 'opacity-0' : 'opacity-100'
        }`} />

        {/* Video Generation */}
        <div className="space-y-1">
          <h3 className={`mb-2 px-3 text-xs font-semibold text-muted-foreground transition-all duration-300 ${
            isCollapsed ? 'w-0 h-0 opacity-0 overflow-hidden' : 'w-auto h-auto opacity-100'
          }`}>
            Video Generation
          </h3>
          {videoGeneration.map((item) => {
            const active = isRouteActive("video-gen");
            return (
              <Button
                key={item.label}
                variant={active ? "secondary" : "ghost"}
                className={`w-full gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-300 ${
                  isCollapsed ? 'justify-center px-2' : 'justify-start'
                }`}
                onClick={() => onNavigate?.("video-gen")}
              >
                {item.iconUrl ? (
                  <img src={getIconUrl(item.iconUrl, theme)} alt={item.label} className="h-4 w-4 shrink-0" />
                ) : (
                  <item.icon className="h-4 w-4 shrink-0" />
                )}
                <span className={`text-sm transition-all duration-300 ${
                  isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'
                }`}>{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>

        <Separator className={`my-4 transition-all duration-300 ${
          isCollapsed ? 'opacity-0' : 'opacity-100'
        }`} />

        {/* Image Generation */}
        <div className="space-y-1">
          <h3 className={`mb-2 px-3 text-xs font-semibold text-muted-foreground transition-all duration-300 ${
            isCollapsed ? 'w-0 h-0 opacity-0 overflow-hidden' : 'w-auto h-auto opacity-100'
          }`}>
            Image Generation
          </h3>
          {imageGeneration.map((item) => {
            const active = pathname === item.route || (item.route.includes('/image-generation') && pathname?.startsWith('/image-generation'));
            
            return (
              <Button
                key={item.label}
                variant={active && pathname === item.route ? "secondary" : "ghost"}
                className={`w-full gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-300 ${
                  isCollapsed ? 'justify-center px-2' : 'justify-start'
                }`}
                onClick={() => {
                  router.push(item.route);
                }}
              >
                {item.iconUrl ? (
                  <img 
                    src={getIconUrl(item.iconUrl, theme)} 
                    alt={item.label} 
                    className="h-4 w-4 shrink-0"
                    style={item.iconUrl === 'bytedance-color' ? {
                      filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'brightness(0)'
                    } : undefined}
                  />
                ) : (
                  <item.icon className="h-4 w-4 shrink-0" />
                )}
                <span className={`text-sm transition-all duration-300 ${
                  isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'
                }`}>{item.label}</span>
              </Button>
            );
          })}
        </div>

        <Separator className={`my-4 transition-all duration-300 ${
          isCollapsed ? 'opacity-0' : 'opacity-100'
        }`} />
      </ScrollArea>

      {/* Subscription Status - Fixed at bottom */}
      <div className={`shrink-0 p-3 transition-all duration-300 ${
        isCollapsed ? 'opacity-0 h-0 overflow-hidden p-0' : 'opacity-100 h-auto'
      }`}>
        <div className="rounded-lg bg-card p-3">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-muted shrink-0">
              <CreditCard className="h-3 w-3 text-muted-foreground" />
            </div>
            <span className="text-xs font-semibold text-card-foreground whitespace-nowrap overflow-hidden">
              {subscription ? 
                `${subscription.plan_type.charAt(0).toUpperCase() + subscription.plan_type.slice(1)} Plan` : 
                'No Active Subscription'
              }
            </span>
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            {subscription && subscription.plan_type !== 'free' ? 
              `Enjoy unlimited ${subscription.plan_type === 'ultra' ? 'image & video' : 'image'} generation` :
              'Get started with a plan to unlock features...'
            }
          </p>
          {(!subscription || subscription.plan_type === 'free') && (
            <PurchaseButton />
          )}
        </div>
      </div>

      {/* User Profile - Fixed at bottom */}
      <div className={`shrink-0 border-t border-border transition-all duration-300 ${
        isCollapsed ? 'p-2' : 'p-4'
      }`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={`h-auto w-full gap-3 p-0 hover:bg-transparent transition-all duration-300 ${
              isCollapsed ? 'justify-center' : 'justify-start'
            }`}>
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground shrink-0">
                  {getInitial()}
                </div>
              )}
              <div className={`flex-1 overflow-hidden text-left transition-all duration-300 ${
                isCollapsed ? 'hidden' : 'block'
              }`}>
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
                  {subscription && subscription.plan_type !== 'free' && (
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      subscription.plan_type === 'premium' 
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                        : 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 dark:bg-gradient-to-r dark:from-pink-900/20 dark:to-purple-900/20 dark:text-pink-300'
                    }`}>
                      {subscription.plan_type.toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {userEmail || session?.user?.email || 'user@example.com'}
                </p>
              </div>
              <ChevronUp className={`h-4 w-4 text-muted-foreground transition-all duration-300 ${
                isCollapsed ? 'hidden' : 'block'
              }`} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="right" className="w-56 z-[1002]">
            <div className="flex items-center gap-3 px-2 py-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
                  {getInitial()}
                </div>
              )}
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">{displayName}</p>
                  {subscription && subscription.plan_type !== 'free' && (
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      subscription.plan_type === 'premium' 
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                        : 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 dark:bg-gradient-to-r dark:from-pink-900/20 dark:to-purple-900/20 dark:text-pink-300'
                    }`}>
                      {subscription.plan_type.toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {userEmail || session?.user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="ml-6">Toggle Theme</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate?.("account-settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Account Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600 dark:text-red-400"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
