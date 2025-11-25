"use client";

import { ImageGenerator } from "@/components/image-generator";
import Sidebar from "@/components/sidebar";
import { useRouter } from "next/navigation";

export default function ImageGenerationPage() {
  const router = useRouter();

  const handleNavigate = (view: "home" | "video-gen" | "image-gen") => {
    if (view === "home") {
      router.push("/dashboard");
    } else if (view === "video-gen") {
      router.push("/video-generation/sora-2");
    } else if (view === "image-gen") {
      router.push("/image-generation/nano-banana-pro");
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onNavigate={handleNavigate} />
      <main className="flex-1 overflow-auto">
        <ImageGenerator />
      </main>
    </div>
  );
}
