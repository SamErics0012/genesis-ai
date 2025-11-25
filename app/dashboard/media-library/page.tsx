"use client";

import Sidebar from "@/components/sidebar";
import { MediaLibrary } from "@/components/media-library";
import { useRouter } from "next/navigation";

export default function MediaLibraryPage() {
  const router = useRouter();

  const handleNavigate = (view: "home" | "video-gen" | "image-gen" | "account-settings" | "media-library") => {
    if (view === "home") {
      router.push("/dashboard");
    } else if (view === "video-gen") {
      router.push("/video-generation/sora-2");
    } else if (view === "image-gen") {
      router.push("/image-generation/nano-banana-pro");
    } else if (view === "account-settings") {
      router.push("/dashboard/settings");
    } else if (view === "media-library") {
      router.push("/dashboard/media-library");
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onNavigate={handleNavigate} />
      <main className="flex-1 overflow-hidden">
        <MediaLibrary />
      </main>
    </div>
  );
}
