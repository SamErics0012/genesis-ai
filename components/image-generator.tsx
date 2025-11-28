"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  ChevronDown, 
  Image as ImageIcon,
  Sparkles,
  Download,
  Share2,
  ThumbsUp,
  Star
} from "lucide-react";
import { useImageGenerations } from "@/hooks/use-image-generations";
import { useSession } from "@/lib/auth-client";
import { startJob, completeJob, cleanupStaleJobs } from "@/lib/job-manager";
import { getUserSubscription, canAccessFeature } from "@/lib/subscription";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModelSelector } from "@/components/ui/model-selector";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ErrorDialog } from "@/components/error-dialog";
import { useTheme } from "@/components/theme-provider";
import { useRouter, useParams } from "next/navigation";

const getIconUrl = (iconName: string, theme: string) => {
  const themeFolder = theme === "dark" ? "dark" : "light";
  return `https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/${themeFolder}/${iconName}.png`;
};

const imageModels = [
  // DeathPrix API Models
  { name: "Midjourney", slug: "midjourney", iconUrl: "midjourney", badge: "PRO", hasApi: true },
  { name: "Flux Pro 1.1", slug: "flux-pro-1-1", iconUrl: "flux", badge: "PRO", hasApi: true },
  { name: "Flux Ultra 1.1", slug: "flux-ultra-1-1", iconUrl: "flux", badge: "PRO", hasApi: true },
  { name: "Flux Ultra Raw 1.1", slug: "flux-ultra-raw-1-1", iconUrl: "flux", badge: "PRO", hasApi: true },
  { name: "Flux Kontext Pro", slug: "flux-kontext-pro", iconUrl: "flux", badge: "PRO", hasApi: true },
  { name: "Flux Kontext Max", slug: "flux-kontext-max", iconUrl: "flux", badge: "PRO", hasApi: true },
  { name: "Nano Banana", slug: "google-nano-banana-base", iconUrl: "google", badge: "PRO", hasApi: true },
  { name: "Nano Banana Pro", slug: "google-nano-banana", iconUrl: "google", badge: "PRO", hasApi: true },
  { name: "Google Imagen-3", slug: "google-imagen-3", iconUrl: "google", badge: "PRO", hasApi: true },
  { name: "Google Imagen-4", slug: "google-imagen-4", iconUrl: "google", badge: "PRO", hasApi: true },
  { name: "Runway Gen 4 Image", slug: "runway-gen-4-image", iconUrl: "runway", badge: "PRO", hasApi: true },
  { name: "Adobe Firefly 5", slug: "adobe-firefly-5", iconUrl: "adobe", badge: "PRO", hasApi: true },
  { name: "OpenAI GPT-Image", slug: "openai-gpt-image", iconUrl: "openai", badge: "PRO", hasApi: true },
  { name: "Ideogram V3", slug: "ideogram-v3", iconUrl: "ideogram", badge: "PRO", hasApi: true },
  // Leonardo AI Models (Infip API)
  { name: "Lucid Origin", slug: "lucid-origin", iconUrl: "leonardo", badge: "PRO", hasApi: true },
  { name: "Phoenix", slug: "phoenix", iconUrl: "leonardo", badge: "PRO", hasApi: true },
  // Fal.ai Models
  { name: "Recraft V3", slug: "recraft-v3", iconUrl: "recraft", badge: "PRO", hasApi: true },
  // Reve Models
  { name: "Reve", slug: "reve", iconUrl: "reve", badge: "PRO", hasApi: true },
  // Minimax Models
  { name: "Minimax Image 01", slug: "minimax-image-01", iconUrl: "minimax", badge: "PRO", hasApi: true },
  // Together AI Models
  { name: "FLUX.2 Flex", slug: "flux-2-flex", iconUrl: "flux", badge: "PRO", hasApi: true },
  // HuggingFace Models
  { name: "Qwen Image", slug: "qwen-image", iconUrl: "qwen", badge: "PRO", hasApi: true },
  { name: "FLUX.2 Dev", slug: "flux-2-dev", iconUrl: "flux", badge: "PRO", hasApi: true },
];

interface ImageGeneratorProps {
  modelSlug: string;
}

export function ImageGenerator({ modelSlug }: ImageGeneratorProps) {
  const { theme } = useTheme();
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const { images, saveImage, isLoading: imagesLoading } = useImageGenerations();
  
  const [selectedModel, setSelectedModel] = useState(() => {
    const model = imageModels.find(m => m.slug === modelSlug);
    return model || imageModels[0]; // Default to Flux Ultra Raw
  });
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedImageAspectRatio, setGeneratedImageAspectRatio] = useState<string>("1:1");
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [enhancePrompt, setEnhancePrompt] = useState(false);
  const [showComingSoonDialog, setShowComingSoonDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resolution, setResolution] = useState("1K");
  const [imageCount, setImageCount] = useState("4 images");
  const [subscription, setSubscription] = useState<any>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  // Get available aspect ratios based on selected model
  const getAvailableAspectRatios = () => {
    // OpenAI GPT-Image only supports 1:1, 3:4, and 4:3
    if (selectedModel.slug === "openai-gpt-image") {
      return ["1:1", "4:3", "3:4"];
    }
    // Ideogram V3 doesn't support 9:16
    if (selectedModel.slug === "ideogram-v3") {
      return ["1:1", "16:9", "4:3", "3:4"];
    }
    return ["1:1", "16:9", "9:16", "4:3", "3:4"];
  };
  
  const aspectRatios = getAvailableAspectRatios();
  const resolutions = ["1K", "2K", "4K"];
  const imageCounts = ["1 image", "2 images", "4 images", "8 images"];

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

  // Sync selected model with URL parameter changes without resetting other state
  useEffect(() => {
    if (modelSlug) {
      const model = imageModels.find(m => m.slug === modelSlug);
      if (model && model.slug !== selectedModel.slug) {
        setSelectedModel(model);
        // If switching to OpenAI GPT-Image and current aspect ratio is not supported, reset to 1:1
        if (model.slug === "openai-gpt-image" && !["1:1", "4:3", "3:4"].includes(aspectRatio)) {
          setAspectRatio("1:1");
        }
        // If switching to Ideogram V3 and current aspect ratio is 9:16, reset to 1:1
        if (model.slug === "ideogram-v3" && aspectRatio === "9:16") {
          setAspectRatio("1:1");
        }
      }
    }
  }, [modelSlug]);

  // Images are now loaded automatically via useImageGenerations hook

  // Get aspect ratio class and size for preview box
  const getAspectRatioClass = (ratio: string) => {
    switch (ratio) {
      case "1:1": return "aspect-square";
      case "16:9": return "aspect-video";
      case "9:16": return "aspect-[9/16]";
      case "4:3": return "aspect-[4/3]";
      case "3:4": return "aspect-[3/4]";
      default: return "aspect-square";
    }
  };

  const getPreviewSize = (ratio: string) => {
    // For portrait ratios, constrain height and let width calculate
    // For landscape ratios (16:9, 4:3), use larger width
    // For square (1:1), use standard width
    if (ratio === "9:16" || ratio === "3:4") {
      return { height: "360px", width: "auto" };
    } else if (ratio === "16:9" || ratio === "4:3") {
      return { width: "480px", height: "auto", maxHeight: "360px" };
    } else {
      return { width: "320px", height: "auto", maxHeight: "360px" };
    }
  };

  const handleModelChange = (model: typeof imageModels[0]) => {
    setSelectedModel(model);
    // If switching to OpenAI GPT-Image and current aspect ratio is not supported, reset to 1:1
    if (model.slug === "openai-gpt-image" && !["1:1", "4:3", "3:4"].includes(aspectRatio)) {
      setAspectRatio("1:1");
    }
    // If switching to Ideogram V3 and current aspect ratio is 9:16, reset to 1:1
    if (model.slug === "ideogram-v3" && aspectRatio === "9:16") {
      setAspectRatio("1:1");
    }
    // Don't use router.push to avoid component re-render and state reset
    // Just update the URL without navigation
    window.history.replaceState(null, '', `/image-generation/${model.slug}`);
  };


  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt");
      return;
    }

    if (!session?.user?.id) {
      alert("Please sign in to generate images");
      return;
    }

    // Check subscription access
    if (!canAccessFeature(subscription, 'imageGeneration')) {
      router.push('/pricing');
      return;
    }

    let jobId: string | null = null;

    try {
      // Start job tracking
      jobId = await startJob(session.user.id, 'image');
      setCurrentJobId(jobId);
      setIsGenerating(true);
      setGeneratedImage(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'You already have a generation in progress');
      setShowErrorDialog(true);
      return;
    }
    
    // Check if model has API support
    if (selectedModel.hasApi) {
      try {
        const response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            prompt: prompt,
            aspect_ratio: aspectRatio,
            model: selectedModel.slug
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        
        // Handle different response formats
        let imageUrl: string | null = null;
        
        // Standard format: { image_url: "...", task_id: "..." }
        if (data.image_url) {
          imageUrl = data.image_url;
        }
        // Other models format: { output: [{ url: "..." }] }
        else if (data.output && data.output.length > 0) {
          imageUrl = data.output[0].url;
        }
        
        if (imageUrl) {
          setGeneratedImage(imageUrl);
          setGeneratedImageAspectRatio(aspectRatio); // Store the aspect ratio used for this image
          
          // Save to Supabase
          try {
            await saveImage({
              image_url: imageUrl,
              prompt: prompt,
              model: selectedModel.name,
              aspect_ratio: aspectRatio,
            });
          } catch (error) {
            console.error('Failed to save to Supabase:', error);
          }
        } else {
          throw new Error('No image URL in response');
        }
        
        // Complete job successfully
        if (jobId) {
          await completeJob(jobId, 'completed');
          setCurrentJobId(null);
        }
      } catch (error) {
        console.error('Image generation failed:', error);
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
        setShowErrorDialog(true);
        
        // Mark job as failed
        if (jobId) {
          await completeJob(jobId, 'failed');
          setCurrentJobId(null);
        }
      } finally {
        setIsGenerating(false);
      }
    } else {
      // Demo mode for other models
      setTimeout(async () => {
        const demoImage = "https://pub-14dba299436441e08eb347040736b11b.r2.dev/Firefly_Gemini%20Flash.png";
        setGeneratedImage(demoImage);
        setGeneratedImageAspectRatio(aspectRatio);
        setIsGenerating(false);
        
        // Complete job
        if (jobId) {
          await completeJob(jobId, 'completed');
          setCurrentJobId(null);
        }
      }, 3000);
    }
  };

  const handleDownload = async (imageUrl: string) => {
    try {
      // Use server-side API route to bypass CORS
      const downloadUrl = `/api/download-image?url=${encodeURIComponent(imageUrl)}`;
      
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `genesis-ai-${Date.now()}.png`;
      link.style.display = 'none';
      
      // Add to DOM, trigger click, and clean up
      document.body.appendChild(link);
      link.click();
      
      // Clean up after a short delay
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
      
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  const handleShare = async (imageUrl: string) => {
    try {
      // Try using the Web Share API first (for mobile and supported browsers)
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this AI-generated image!',
          text: 'Created with Genesis AI',
          url: imageUrl,
        });
      } else {
        // Fallback: Copy URL to clipboard
        try {
          await navigator.clipboard.writeText(imageUrl);
          alert('Image link copied to clipboard!');
        } catch (err) {
          console.warn('Clipboard write failed:', err);
          // Fallback for when clipboard API is blocked (e.g. in iframe)
          window.prompt('Copy this link:', imageUrl);
        }
      }
    } catch (error) {
      // If share was cancelled or failed, try clipboard
      try {
        await navigator.clipboard.writeText(imageUrl);
        alert('Image link copied to clipboard!');
      } catch (clipboardError) {
        console.warn('Clipboard write failed:', clipboardError);
        window.prompt('Copy this link:', imageUrl);
      }
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Preview Area */}
      <div className="flex flex-1 items-center justify-center overflow-hidden p-4 pt-16">
        <div className="relative flex h-full w-full items-center justify-center">
          {/* Shimmer Animation or Generated Image */}
          <div 
            className={`relative ${getAspectRatioClass(generatedImage ? generatedImageAspectRatio : aspectRatio)} overflow-hidden rounded-2xl ${isGenerating || generatedImage ? 'bg-background' : 'bg-transparent'}`} 
            style={getPreviewSize(generatedImage ? generatedImageAspectRatio : aspectRatio)}
          >
            {isGenerating ? (
              /* Shimmer Animation with Loading Spinner */
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-background via-purple-500/20 to-background animate-shimmer bg-[length:200%_100%]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500/20 border-t-purple-500"></div>
                </div>
              </>
            ) : generatedImage ? (
              /* Generated Image with Hover Effects */
              <div className="group relative h-full w-full">
                <img 
                  src={generatedImage} 
                  alt="Generated" 
                  className="h-full w-full object-cover transition-opacity duration-500"
                />
                {/* Dark Vignette Border on Hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" 
                     style={{
                       boxShadow: 'inset 0 0 60px 20px rgba(0, 0, 0, 0.8)'
                     }}
                />
                {/* Action Buttons in Corners */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {/* Download Button - Bottom Left */}
                  <button 
                    onClick={() => handleDownload(generatedImage)}
                    className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-lg bg-black/80 backdrop-blur-sm transition-all hover:bg-black hover:scale-110"
                  >
                    <Download className="h-5 w-5 text-white" />
                  </button>
                  {/* Share Button - Bottom Right */}
                  <button 
                    onClick={() => handleShare(generatedImage)}
                    className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-lg bg-black/80 backdrop-blur-sm transition-all hover:bg-black hover:scale-110"
                  >
                    <Share2 className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                  <h2 className="mb-2 text-xl font-semibold text-foreground">No images yet</h2>
                  <p className="text-sm text-muted-foreground">
                    Start by creating your first AI-generated image
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="bg-background p-6">
        {/* Generation History */}
        {images.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-muted-foreground">Recent</span>
              <button className="text-xs text-primary hover:underline">View all</button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {images.slice(0, 20).map((item, index) => (
                <div 
                  key={item.id}
                  className="relative h-20 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 border-transparent hover:border-primary transition-colors"
                  onClick={() => {
                    setGeneratedImage(item.image_url);
                    setGeneratedImageAspectRatio(item.aspect_ratio);
                  }}
                >
                  <img src={item.image_url} alt={`Generated ${index + 1}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prompt Area */}
        <div className="mb-4 grid grid-cols-[auto_1fr] gap-4">
          {/* Use Image Upload */}
          <div className="flex flex-col items-center">
            <div 
              onClick={() => setShowComingSoonDialog(true)}
              className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 transition-colors hover:border-primary hover:bg-muted"
            >
              <Upload className="mb-1 h-5 w-5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">Use image</span>
              <span className="text-xs text-muted-foreground">Optional</span>
            </div>
          </div>

          {/* Prompt Input */}
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt"
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
                Enhance prompt off
              </button>
              <span className="text-xs text-muted-foreground">{prompt.length} / 5000</span>
            </div>
          </div>
        </div>

        {/* Model and Settings */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Model Selector */}
            <ModelSelector
              models={imageModels}
              selectedModel={selectedModel}
              onModelChange={handleModelChange}
              theme={theme}
            />

            {/* Aspect Ratio */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
                  </svg>
                  {aspectRatio}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {aspectRatios.map((ratio) => (
                  <DropdownMenuItem key={ratio} onClick={() => setAspectRatio(ratio)}>
                    {ratio}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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

      {/* Coming Soon Dialog */}
      <Dialog open={showComingSoonDialog} onOpenChange={setShowComingSoonDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Feature Coming Soon</DialogTitle>
            <DialogDescription className="pt-4">
              Image editing functionality will be added soon. Currently, text-to-image and video generation are supported in the beta preview of Genesis AI.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-4">
            <Button onClick={() => setShowComingSoonDialog(false)}>
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
