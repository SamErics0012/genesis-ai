"use client";

import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Heart, TrendingUp, Link2, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const handleNavigate = (view: "home" | "video-gen" | "image-gen" | "account-settings" | "media-library" | "edit-image") => {
    if (view === "home") {
      router.push("/dashboard");
    } else if (view === "video-gen") {
      router.push("/video-generation/veo-3-1-fast");
    } else if (view === "image-gen") {
      router.push("/image-generation/flux-kontext-pro");
    } else if (view === "account-settings") {
      router.push("/dashboard/settings");
    } else if (view === "media-library") {
      router.push("/dashboard/media-library");
    } else if (view === "edit-image") {
      router.push("/edit-image");
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onNavigate={handleNavigate} />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6 pb-6">
            <div className="mb-4">
              <h1 className="mb-2 text-3xl font-serif">
                Create Your Creative <span className="italic">Workflow</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Begin with a template that inspires or create something entirely yours
              </p>
            </div>

            {/* AI Short Creator Cards */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* Image Generation */}
              <Card className="group relative overflow-hidden border-border bg-card transition-all hover:border-purple-500/50" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), 0 8px 24px rgba(0, 0, 0, 0.08)' }}>
                <div className="overflow-hidden bg-black" style={{ height: '400px' }}>
                  <img 
                    src="https://pub-14dba299436441e08eb347040736b11b.r2.dev/Firefly_Gemini%20Flash.png" 
                    alt="Image Generation Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-3 pt-2 pb-3">
                  <h3 className="mb-1 text-sm font-semibold text-card-foreground">Image Generation</h3>
                  <p className="mb-2 text-xs text-muted-foreground">
                    Create stunning images from text prompts using advanced AI models.
                  </p>
                  <Button 
                    onClick={() => router.push("/image-generation/flux-kontext-pro")}
                    className="group relative w-full overflow-hidden bg-zinc-900 transition-all duration-200 hover:bg-zinc-900 dark:bg-zinc-100 dark:hover:bg-zinc-100"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 opacity-40 blur transition-opacity duration-500 group-hover:opacity-80" />
                    <span className="relative text-white dark:text-zinc-900">Select Image Generation</span>
                  </Button>
                </div>
              </Card>

              {/* Video Generation */}
              <Card className="group relative overflow-hidden border-2 border-purple-500 bg-card" style={{ boxShadow: '0 4px 12px rgba(168, 85, 247, 0.2), 0 8px 24px rgba(168, 85, 247, 0.15)' }}>
                <div className="overflow-hidden bg-black" style={{ height: '400px' }}>
                  <video 
                    src="https://pub-14dba299436441e08eb347040736b11b.r2.dev/01-video-to-video.ai_V2.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-3 pt-2 pb-3">
                  <h3 className="mb-1 text-sm font-semibold text-card-foreground">Video Generation</h3>
                  <p className="mb-2 text-xs text-muted-foreground">
                    Generate professional videos from text descriptions with AI-powered precision.
                  </p>
                  <Button 
                    onClick={() => router.push("/video-generation/veo-3-1-fast")}
                    className="group relative w-full overflow-hidden bg-zinc-900 transition-all duration-200 hover:bg-zinc-900 dark:bg-zinc-100 dark:hover:bg-zinc-100"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 opacity-40 blur transition-opacity duration-500 group-hover:opacity-80" />
                    <span className="relative text-white dark:text-zinc-900">Select Video Generation</span>
                  </Button>
                </div>
              </Card>

              {/* Creative Image Editing */}
              <Card className="group relative overflow-hidden border-border bg-card transition-all hover:border-purple-500/50" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), 0 8px 24px rgba(0, 0, 0, 0.08)' }}>
                <div className="overflow-hidden bg-black" style={{ height: '400px' }}>
                  <video 
                    src="https://pub-14dba299436441e08eb347040736b11b.r2.dev/01-image-to-video-ai-V2.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-3 pt-2 pb-3">
                  <h3 className="mb-1 text-sm font-semibold text-card-foreground">Creative Image Editing</h3>
                  <p className="mb-2 text-xs text-muted-foreground">
                    Edit and enhance images with AI-powered creative tools and effects.
                  </p>
                  <Button 
                    onClick={() => router.push("/edit-image")}
                    className="group relative w-full overflow-hidden bg-zinc-900 transition-all duration-200 hover:bg-zinc-900 dark:bg-zinc-100 dark:hover:bg-zinc-100"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 opacity-40 blur transition-opacity duration-500 group-hover:opacity-80" />
                    <span className="relative text-white dark:text-zinc-900">Select Creative Image Editing</span>
                  </Button>
                </div>
              </Card>
            </div>
        </div>
      </main>
    </div>
  );
}
