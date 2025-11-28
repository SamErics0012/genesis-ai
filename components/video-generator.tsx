"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  ChevronDown, 
  Clock, 
  Monitor, 
  Film,
  Volume2,
  Check,
  Sparkles,
  Download,
  Play,
  Pause,
  Volume1,
  VolumeX,
  Maximize
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModelSelector, ModelOption } from "@/components/ui/model-selector";
import { ErrorDialog } from "@/components/error-dialog";
import { useTheme } from "@/components/theme-provider";
import { useRouter, useParams } from "next/navigation";
import { useVideoGenerations } from "@/hooks/use-video-generations";
import { useSession } from "@/lib/auth-client";
import { startJob, completeJob, cleanupStaleJobs } from "@/lib/job-manager";
import { getUserSubscription, canAccessFeature } from "@/lib/subscription";

const getIconUrl = (iconName: string, theme: string) => {
  const themeFolder = theme === "dark" ? "dark" : "light";
  return `https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/${themeFolder}/${iconName}.png`;
};

const videoModels = [
  { name: "Veo 3.1 Fast", slug: "veo-3-1-fast", iconUrl: "google", duration: "5s", resolution: "1080p", badge: "PRO", hasAudio: false, hasApi: true, supportsImg2Vid: true },
  { name: "Veo 3.1", slug: "veo-3-1", iconUrl: "google", duration: "5s", resolution: "1080p", badge: "PRO", hasAudio: false, hasApi: true, supportsImg2Vid: true },
  { name: "Sora", slug: "sora", iconUrl: "openai", duration: "5s", resolution: "1080p", badge: "PRO", hasAudio: false, hasApi: true, supportsImg2Vid: true },
  { name: "Sora 2 Pro", slug: "sora-2-pro", iconUrl: "openai", duration: "5s", resolution: "1080p", badge: "PRO", hasAudio: false, hasApi: true, supportsImg2Vid: true },
  { name: "Luma Ray 2", slug: "luma-ray-2", iconUrl: "luma", duration: "5s-10s", resolution: "720p-1080p", badge: "PRO", hasAudio: false, hasApi: false, supportsImg2Vid: false },
  
  // Fal AI - Kling
  { name: "Kling 2.5 Turbo Pro", slug: "fal-ai/kling-video/v2.5-turbo/pro", iconUrl: "kwaivgI", duration: "5s", resolution: "1080p", badge: "PRO", hasAudio: false, hasApi: true, supportsImg2Vid: false },
  { name: "Kling 2.5 Standard", slug: "fal-ai/kling-video/v2.5/standard", iconUrl: "kwaivgI", duration: "5s", resolution: "1080p", badge: "PRO", hasAudio: false, hasApi: true, supportsImg2Vid: true },
  { name: "Kling 2.5 Pro", slug: "fal-ai/kling-video/v2.5/pro", iconUrl: "kwaivgI", duration: "5s", resolution: "1080p", badge: "PRO", hasAudio: false, hasApi: true, supportsImg2Vid: true },
  { name: "Kling 1.5 Pro", slug: "fal-ai/kling-video/v1.5/pro", iconUrl: "kwaivgI", duration: "5s", resolution: "1080p", badge: "PRO", hasAudio: false, hasApi: true, supportsImg2Vid: true },

  // Fal AI - MiniMax
  { name: "MiniMax Hailuo 02 Standard", slug: "fal-ai/minimax/hailuo-02/standard", iconUrl: "minimax", duration: "6s", resolution: "768p", badge: "PRO", hasAudio: false, hasApi: true, supportsImg2Vid: false },

  // Hugging Face - Wan AI
  { name: "Wan 2.2 T2V A14B", slug: "Wan-AI/Wan2.2-T2V-A14B", iconUrl: "Wan-AI", duration: "5s", resolution: "720p", badge: "PRO", hasAudio: false, hasApi: true, supportsImg2Vid: false },
  { name: "Wan 2.2 TI2V 5B", slug: "Wan-AI/Wan2.2-TI2V-5B", iconUrl: "Wan-AI", duration: "5s", resolution: "720p", badge: "PRO", hasAudio: false, hasApi: true, supportsImg2Vid: true },
  { name: "Wan 2.1 T2V 1.3B", slug: "Wan-AI/Wan2.1-T2V-1.3B", iconUrl: "Wan-AI", duration: "5s", resolution: "720p", badge: "PRO", hasAudio: false, hasApi: true, supportsImg2Vid: false },
  { name: "Wan 2.2 T2V A14B Diffusers", slug: "Wan-AI/Wan2.2-T2V-A14B-Diffusers", iconUrl: "Wan-AI", duration: "5s", resolution: "720p", badge: "PRO", hasAudio: false, hasApi: true, supportsImg2Vid: false },
  { name: "Wan 2.1 T2V 14B", slug: "Wan-AI/Wan2.1-T2V-14B", iconUrl: "Wan-AI", duration: "5s", resolution: "720p", badge: "PRO", hasAudio: false, hasApi: true, supportsImg2Vid: false },
  
  // Hugging Face - Lightricks
  { name: "LTX Video 0.9.7 Distilled", slug: "Lightricks/LTX-Video-0.9.7-distilled", iconUrl: "Lightricks", duration: "5s", resolution: "720p", badge: "PRO", hasAudio: false, hasApi: true, supportsImg2Vid: false },
  { name: "LTX Video 0.9.5", slug: "Lightricks/LTX-Video-0.9.5", iconUrl: "Lightricks", duration: "5s", resolution: "720p", badge: "PRO", hasAudio: false, hasApi: true, supportsImg2Vid: false },
  { name: "LTX Video 0.9.7 Dev", slug: "Lightricks/LTX-Video-0.9.7-dev", iconUrl: "Lightricks", duration: "5s", resolution: "720p", badge: "PRO", hasAudio: false, hasApi: true, supportsImg2Vid: false },
  
  // Hugging Face - Others
  { name: "LongCat Video", slug: "meituan-longcat/LongCat-Video", iconUrl: "meituan-longcat", duration: "5s", resolution: "720p", badge: "PRO", hasAudio: false, hasApi: true, supportsImg2Vid: false },
  { name: "Hunyuan Video", slug: "tencent/HunyuanVideo", iconUrl: "tencent", duration: "5s", resolution: "720p", badge: "PRO", hasAudio: false, hasApi: true, supportsImg2Vid: false },
  { name: "Mochi 1 Preview", slug: "genmo/mochi-1-preview", iconUrl: "genmo", duration: "5s", resolution: "720p", badge: "PRO", hasAudio: false, hasApi: true, supportsImg2Vid: false },
  { name: "CogVideoX 5b", slug: "zai-org/CogVideoX-5b", iconUrl: "zai-org", duration: "5s", resolution: "720p", badge: "PRO", hasAudio: false, hasApi: true, supportsImg2Vid: false },
];

export function VideoGenerator() {
  const { theme } = useTheme();
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const modelSlug = params?.model as string;
  const videoRef = useRef<HTMLVideoElement>(null);
  const { videos, saveVideo, isLoading: videosLoading } = useVideoGenerations();
  
  const [selectedModel, setSelectedModel] = useState<ModelOption>(() => {
    const model = videoModels.find(m => m.slug === modelSlug);
    return model || videoModels[0];
  });
  const [duration, setDuration] = useState("6");
  const [resolution, setResolution] = useState("1080p");
  const [prompt, setPrompt] = useState("");
  const [enhancePrompt, setEnhancePrompt] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [subscription, setSubscription] = useState<any>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get available durations based on model and resolution
  const getAvailableDurations = () => {
    if (selectedModel.slug.startsWith("veo-3-1")) {
      return ["4", "6", "8"]; // Veo 3.1 supports 4s, 6s, 8s
    } else if (selectedModel.slug.startsWith("sora")) {
      return ["4", "8", "12"]; // Sora supports 4, 8, 12 seconds
    } else if (selectedModel.slug.startsWith("fal-ai/kling")) {
      return ["5", "10"]; // Kling supports 5s, 10s
    } else if (selectedModel.slug.startsWith("fal-ai/minimax")) {
      return ["6", "10"]; // MiniMax supports 6s, 10s
    }
    return ["4", "6", "8", "10"];
  };

  // Get available resolutions based on model
  const getAvailableResolutions = () => {
    if (selectedModel.slug.startsWith("veo-3-1")) {
      return ["720p", "1080p"]; // Veo 3.1 supports 720p and 1080p
    } else if (selectedModel.slug.startsWith("sora")) {
      return ["720p"]; // Sora only supports 720p
    }
    return ["720p", "1080p"];
  };

  const durations = getAvailableDurations();
  const resolutions = getAvailableResolutions();

  // Cleanup stale jobs on mount
  useEffect(() => {
    if (session?.user?.id) {
      cleanupStaleJobs(session.user.id);
    }
  }, [session?.user?.id]);

  // Check subscription status
  useEffect(() => {
    const checkSubscription = async () => {
      if (session?.user?.id) {
        setSubscriptionLoading(true);
        const userSubscription = await getUserSubscription(session.user.id, session.access_token);
        setSubscription(userSubscription);
        setSubscriptionLoading(false);
      } else {
        setSubscriptionLoading(false);
      }
    };

    checkSubscription();
  }, [session?.user?.id]);

  useEffect(() => {
    if (modelSlug) {
      const model = videoModels.find(m => m.slug === modelSlug);
      if (model) {
        setSelectedModel(model);
      }
    }
  }, [modelSlug]);

  // Reset duration when switching models
  useEffect(() => {
    // Reset duration for Veo models
    if (selectedModel.slug.startsWith("veo-3-1") && !["4", "6", "8"].includes(duration)) {
      setDuration("8");
    }
    // Reset duration for Sora models
    if (selectedModel.slug.startsWith("sora") && !["4", "8", "12"].includes(duration)) {
      setDuration("4");
    }
    // Reset duration for Kling models
    if (selectedModel.slug.startsWith("fal-ai/kling") && !["5", "10"].includes(duration)) {
      setDuration("5");
    }
    // Reset duration for MiniMax models
    if (selectedModel.slug.startsWith("fal-ai/minimax") && !["6", "10"].includes(duration)) {
      setDuration("6");
    }
  }, [selectedModel.slug, duration]);

  // Reset resolution when switching to Sora models (only 720p supported)
  useEffect(() => {
    if (selectedModel.slug.startsWith("sora") && resolution !== "720p") {
      setResolution("720p");
    }
  }, [selectedModel.slug, resolution]);

  const handleModelChange = (model: ModelOption) => {
    setSelectedModel(model);
    window.history.replaceState(null, '', `/video-generation/${model.slug}`);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size must be less than 10MB');
        return;
      }

      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    if (selectedModel.supportsImg2Vid) {
      fileInputRef.current?.click();
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove the data URL prefix to get just the base64 string
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt");
      return;
    }

    if (!session?.user?.id) {
      alert("Please sign in to generate videos");
      return;
    }

    // No validation needed - image is optional for img2vid models

    // Check subscription access
    if (!canAccessFeature(subscription, 'videoGeneration')) {
      router.push('/pricing');
      return;
    }

    let jobId: string | null = null;

    try {
      // Start job tracking
      jobId = await startJob(session.user.id, 'video');
      setCurrentJobId(jobId);
      setIsGenerating(true);
      setGeneratedVideo(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'You already have a generation in progress');
      setShowErrorDialog(true);
      return;
    }
    
    if (selectedModel.hasApi) {
      try {
        // Prepare request body
        const requestBody: any = {
          prompt: prompt,
          duration: parseInt(duration),
          model: selectedModel.slug
        };

        // Add resolution for models that support it
        // Veo and Sora models need resolution
        requestBody.resolution = resolution;

        // Add image data if uploaded - automatically switches to img2vid mode
        if (imageFile && selectedModel.supportsImg2Vid) {
          const base64Image = await convertImageToBase64(imageFile);
          requestBody.image = base64Image;
          requestBody.isImg2Vid = true; // Flag to tell API to use img2vid model
        }

        const response = await fetch('/api/generate-video', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        
        if (data.video_url) {
          setGeneratedVideo(data.video_url);
          
          try {
            await saveVideo({
              video_url: data.video_url,
              prompt: prompt,
              model: selectedModel.name,
              duration: `${duration}s`,
            });
          } catch (error) {
            console.error('Failed to save to Supabase:', error);
          }
        } else {
          throw new Error('No video URL in response');
        }
        
        // Complete job successfully
        if (jobId) {
          await completeJob(jobId, 'completed');
          setCurrentJobId(null);
        }
      } catch (error) {
        console.error('Video generation failed:', error);
        alert(`Failed to generate video: ${error instanceof Error ? error.message : 'Unknown error'}`);
        
        // Mark job as failed
        if (jobId) {
          await completeJob(jobId, 'failed');
          setCurrentJobId(null);
        }
      } finally {
        setIsGenerating(false);
      }
    } else {
      setTimeout(async () => {
        const demoVideo = "https://pub-14dba299436441e08eb347040736b11b.r2.dev/01-video-to-video.ai_V2.mp4";
        setGeneratedVideo(demoVideo);
        setIsGenerating(false);
        
        // Complete job
        if (jobId) {
          await completeJob(jobId, 'completed');
          setCurrentJobId(null);
        }
      }, 3000);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleDownload = async (videoUrl: string) => {
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `video-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download video');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex h-full flex-col">
      {/* Video Preview Area */}
      <div className="flex flex-1 items-center justify-center p-4 overflow-hidden">
        {isGenerating ? (
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 opacity-20 blur-xl"></div>
              </div>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-foreground">Generating your video...</h2>
            <p className="text-sm text-muted-foreground">This may take a minute</p>
          </div>
        ) : generatedVideo ? (
          <div className="flex flex-col items-center">
            {/* Video Player */}
            <Card className="inline-block overflow-hidden bg-black">
              <video
                ref={videoRef}
                src={generatedVideo}
                style={{ maxHeight: '400px', maxWidth: '100%', display: 'block' }}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
              />
            </Card>
            
            {/* Compact Video Controls */}
            <div className="mt-3 flex items-center gap-2">
              {/* Play/Pause */}
              <Button
                size="icon"
                onClick={togglePlay}
                className="h-8 w-8 bg-purple-600 hover:bg-purple-700"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              {/* Volume */}
              <Button
                size="icon"
                variant="outline"
                onClick={toggleMute}
                className="h-8 w-8"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume1 className="h-4 w-4" />}
              </Button>
              
              {/* Download */}
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleDownload(generatedVideo)}
                className="h-8 w-8"
              >
                <Download className="h-4 w-4" />
              </Button>
              
              {/* Fullscreen */}
              <Button
                size="icon"
                variant="outline"
                onClick={() => videoRef.current?.requestFullscreen()}
                className="h-8 w-8"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Film className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-foreground">No videos yet</h2>
            <p className="text-sm text-muted-foreground">
              Start by creating your first AI-generated video
            </p>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="bg-background p-6">
        <div className="mb-4 grid grid-cols-[auto_1fr] gap-4">
          <div className="flex flex-col items-center">
            <div 
              className={`flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                selectedModel.supportsImg2Vid
                  ? "border-border bg-muted/50 hover:border-primary hover:bg-muted" 
                  : "border-muted bg-muted/20 cursor-not-allowed"
              }`}
              onClick={handleImageClick}
            >
              {uploadedImage ? (
                <div className="relative h-full w-full">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded frame" 
                    className="h-full w-full rounded-lg object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage();
                    }}
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="mb-1 h-5 w-5 text-muted-foreground" />
                  <span className="text-xs font-medium text-foreground">Start frame</span>
                  <span className="text-xs text-muted-foreground">
                    {selectedModel.supportsImg2Vid ? "Optional" : "Not supported"}
                  </span>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your video prompt"
              className="h-24 w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={5000}
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-2">
              <button
                onClick={() => setEnhancePrompt(!enhancePrompt)}
                className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors ${
                  enhancePrompt
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <Sparkles className="h-3 w-3" />
                Enhance prompt {enhancePrompt ? "on" : "off"}
              </button>
              <span className="text-xs text-muted-foreground">{prompt.length} / 5000</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ModelSelector
              models={videoModels}
              selectedModel={selectedModel}
              onModelChange={handleModelChange}
              theme={theme}
              showDetails={true}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Clock className="h-4 w-4" />
                  {duration}s
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {durations.map((d) => (
                  <DropdownMenuItem key={d} onClick={() => setDuration(d)}>
                    {d}s
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Resolution (for Veo and Sora models) */}
            {(selectedModel.slug.startsWith("veo-3-1") || selectedModel.slug.startsWith("sora")) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Monitor className="h-4 w-4" />
                    {resolution}
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {resolutions.map((res) => (
                    <DropdownMenuItem key={res} onClick={() => setResolution(res)}>
                      {res}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Subscription Status & Generate Button */}
          <div className="flex items-center gap-3">
            {subscription && (
              <Badge 
                variant={subscription.plan_type === 'free' ? 'destructive' : 'default'}
                className={subscription.plan_type === 'free' ? 'bg-orange-500' : subscription.plan_type === 'premium' ? 'bg-indigo-500' : 'bg-purple-500'}
              >
                {subscription.plan_type.toUpperCase()}
              </Badge>
            )}
            
            <RainbowButton 
              onClick={handleGenerate}
              disabled={isGenerating || subscriptionLoading}
              className="gap-2 px-6"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isGenerating ? "Generating..." : "Generate"}</span>
            </RainbowButton>
          </div>
        </div>
      </div>

      {/* Error Dialog */}
      <ErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        title="Generation in Progress"
        message={errorMessage}
      />
    </div>
  );
}
