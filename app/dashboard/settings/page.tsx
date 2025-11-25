"use client";

import Sidebar from "@/components/sidebar";
import { AccountSettings } from "@/components/account-settings";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  const handleNavigate = (view: "home" | "video-gen" | "image-gen" | "account-settings") => {
    if (view === "home") {
      router.push("/dashboard");
    } else if (view === "video-gen") {
      router.push("/video-generation/sora-2");
    } else if (view === "image-gen") {
      router.push("/image-generation/nano-banana-pro");
    } else if (view === "account-settings") {
      router.push("/dashboard/settings");
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onNavigate={handleNavigate} />
      <main className="flex-1 overflow-auto">
        <AccountSettings />
      </main>
    </div>
  );
}
