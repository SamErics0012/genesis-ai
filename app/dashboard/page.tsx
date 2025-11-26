"use client";

import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Heart, TrendingUp, Link2, RotateCw, Sparkles, Wand2, Video, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useSession } from "@/lib/auth-client";

export default function Dashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const userName = session?.user?.name || "Creator";

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onNavigate={handleNavigate} />
      
      <main className="flex-1 overflow-auto bg-neutral-50/50 dark:bg-neutral-950">
        <div className="p-8 max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 space-y-2"
            >
              <h1 className="text-4xl font-serif font-medium tracking-tight text-foreground">
                Welcome back, <span className="italic text-purple-600 dark:text-purple-400">{userName}</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Ready to create something extraordinary today? Choose a tool to get started.
              </p>
            </motion.div>

            {/* AI Short Creator Cards */}
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-6 lg:grid-cols-3"
            >
              {/* Image Generation */}
              <motion.div variants={item}>
                <Card className="group relative h-full overflow-hidden border-border bg-card transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10 pointer-events-none" />
                  <div className="overflow-hidden bg-neutral-900 h-[300px] relative">
                    <img 
                      src="https://pub-14dba299436441e08eb347040736b11b.r2.dev/Firefly_Gemini%20Flash.png" 
                      alt="Image Generation Preview"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/10">
                      <ImageIcon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="p-6 relative z-20 -mt-20">
                    <div className="bg-card/95 backdrop-blur-xl p-5 rounded-2xl border border-border/50 shadow-lg">
                      <h3 className="mb-2 text-xl font-semibold text-card-foreground flex items-center gap-2">
                        Image Generation
                      </h3>
                      <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
                        Create stunning images from text prompts using advanced AI models like Flux and Google Imagen.
                      </p>
                      <RainbowButton 
                        onClick={() => router.push("/image-generation/flux-kontext-pro")}
                        className="w-full font-medium"
                      >
                        Start Creating Images
                      </RainbowButton>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Video Generation */}
              <motion.div variants={item}>
                <Card className="group relative h-full overflow-hidden border-purple-500/30 bg-card transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 ring-1 ring-purple-500/20">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10 pointer-events-none" />
                  <div className="overflow-hidden bg-neutral-900 h-[300px] relative">
                    <video 
                      src="https://pub-14dba299436441e08eb347040736b11b.r2.dev/01-video-to-video.ai_V2.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 z-20 bg-purple-500/80 backdrop-blur-md p-2 rounded-full border border-white/10">
                      <Video className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="p-6 relative z-20 -mt-20">
                    <div className="bg-card/95 backdrop-blur-xl p-5 rounded-2xl border border-purple-500/20 shadow-lg">
                      <h3 className="mb-2 text-xl font-semibold text-card-foreground flex items-center gap-2">
                        Video Generation <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-[10px]">POPULAR</Badge>
                      </h3>
                      <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
                        Generate professional videos from text descriptions with AI-powered precision and control.
                      </p>
                      <RainbowButton 
                        onClick={() => router.push("/video-generation/veo-3-1-fast")}
                        className="w-full font-medium"
                      >
                        Start Creating Videos
                      </RainbowButton>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Creative Image Editing */}
              <motion.div variants={item}>
                <Card className="group relative h-full overflow-hidden border-border bg-card transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10 pointer-events-none" />
                  <div className="overflow-hidden bg-neutral-900 h-[300px] relative">
                    <video 
                      src="https://pub-14dba299436441e08eb347040736b11b.r2.dev/01-image-to-video-ai-V2.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/10">
                      <Wand2 className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="p-6 relative z-20 -mt-20">
                    <div className="bg-card/95 backdrop-blur-xl p-5 rounded-2xl border border-border/50 shadow-lg">
                      <h3 className="mb-2 text-xl font-semibold text-card-foreground flex items-center gap-2">
                        Creative Editing
                      </h3>
                      <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
                        Edit and enhance images with AI-powered creative tools, effects, and transformations.
                      </p>
                      <RainbowButton 
                        onClick={() => router.push("/edit-image")}
                        className="w-full font-medium"
                      >
                        Open Editor
                      </RainbowButton>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
        </div>
      </main>
    </div>
  );
}
