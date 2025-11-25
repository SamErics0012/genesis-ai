"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Image as ImageIcon, Video, Music, Folder, ChevronDown, HardDrive, Download, Trash2 } from "lucide-react";
import { useImageGenerations } from "@/hooks/use-image-generations";
import { useVideoGenerations } from "@/hooks/use-video-generations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MediaItem {
  id: string;
  type: string;
  url: string;
  prompt: string;
  model: string;
  aspectRatio: string;
  timestamp: string;
}

export function MediaLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Date Created");
  const [thumbnailSize, setThumbnailSize] = useState(50);
  const [selectedMediaType, setSelectedMediaType] = useState("All");
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { images, isLoading, deleteImage } = useImageGenerations();
  const { videos, isLoading: videosLoading, deleteVideo } = useVideoGenerations();

  // Combine images and videos into unified media array
  const allMedia = [
    ...images.map(img => ({ ...img, type: 'image', url: img.image_url })),
    ...videos.map(vid => ({ ...vid, type: 'video', url: vid.video_url }))
  ];

  const filteredMedia = allMedia.filter(item => {
    const matchesSearch = item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedMediaType === "All" || 
                       (selectedMediaType === "Image" && item.type === 'image') ||
                       (selectedMediaType === "Video" && item.type === 'video');
    return matchesSearch && matchesType;
  });

  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${prompt.slice(0, 30)}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedImage) return;
    
    try {
      setIsDeleting(true);
      
      // Delete from database based on media type
      if (selectedImage.type === 'image') {
        await deleteImage(selectedImage.id);
      } else {
        await deleteVideo(selectedImage.id);
      }
      
      // Close dialog
      setSelectedImage(null);
    } catch (error) {
      console.error('Error deleting media:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Calculate grid columns based on thumbnail size
  const getGridColumns = () => {
    if (thumbnailSize <= 20) return "grid-cols-8 xl:grid-cols-10";
    if (thumbnailSize <= 40) return "grid-cols-6 xl:grid-cols-8";
    if (thumbnailSize <= 60) return "grid-cols-4 xl:grid-cols-6";
    if (thumbnailSize <= 80) return "grid-cols-3 xl:grid-cols-4";
    return "grid-cols-2 xl:grid-cols-3";
  };

  return (
    <div className="flex h-full">
      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Header with Search */}
        <div className="bg-background p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Media Grid or Empty State */}
        <div className="flex-1 overflow-auto p-6">
          {filteredMedia.length > 0 ? (
            <div className={`grid gap-4 transition-all duration-300 ${getGridColumns()}`}>
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-border bg-muted transition-all hover:border-primary hover:shadow-lg"
                  onClick={() => setSelectedImage(item)}
                >
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.prompt}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="relative h-full w-full bg-black">
                      <video
                        src={item.url}
                        className="h-full w-full object-cover"
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Video className="h-8 w-8 text-white/80" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="mb-1 text-xs font-medium text-white line-clamp-2">
                        {item.prompt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/70">{item.model}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">No media found.</h3>
                <p className="text-sm text-muted-foreground">Showing {filteredMedia.length} of {allMedia.length} items</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Filters */}
      <div className="w-64 border-l border-border bg-background p-4">
        {/* Thumbnail Size */}
        <div className="mb-6">
          <label className="mb-2 block text-xs font-semibold text-foreground">Thumbnail Size</label>
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
            <input
              type="range"
              min="0"
              max="100"
              value={thumbnailSize}
              onChange={(e) => setThumbnailSize(Number(e.target.value))}
              className="flex-1 accent-purple-500"
              style={{
                background: `linear-gradient(to right, rgb(168 85 247) 0%, rgb(168 85 247) ${thumbnailSize}%, rgb(71 85 105) ${thumbnailSize}%, rgb(71 85 105) 100%)`
              }}
            />
            <span className="text-xs text-muted-foreground">{thumbnailSize}%</span>
          </div>
        </div>

        {/* Media Type */}
        <div className="mb-6">
          <label className="mb-2 block text-xs font-semibold text-foreground">Media Type</label>
          <div className="space-y-2">
            <Button
              variant={selectedMediaType === "All" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setSelectedMediaType("All")}
            >
              <ImageIcon className="h-4 w-4" />
              <span className="text-sm">All</span>
            </Button>
            <Button
              variant={selectedMediaType === "Image" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setSelectedMediaType("Image")}
            >
              <ImageIcon className="h-4 w-4" />
              <span className="text-sm">Image</span>
            </Button>
            <Button
              variant={selectedMediaType === "Video" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setSelectedMediaType("Video")}
            >
              <Video className="h-4 w-4" />
              <span className="text-sm">Video</span>
            </Button>
            <Button
              variant={selectedMediaType === "Audio" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setSelectedMediaType("Audio")}
            >
              <Music className="h-4 w-4" />
              <span className="text-sm">Audio</span>
            </Button>
          </div>
        </div>

        {/* Collections */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground">Collections</label>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Folder className="h-4 w-4" />
            <span className="flex-1 text-left text-sm">All Media</span>
            <p className="text-sm text-muted-foreground">Total: {allMedia.length} items</p>
          </Button>
        </div>
      </div>

      {/* Media Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedImage?.type === 'video' ? 'Video' : 'Image'} Preview</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              {/* Media */}
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                {selectedImage.type === 'image' ? (
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.prompt}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <video
                    src={selectedImage.url}
                    controls
                    className="h-full w-full object-contain"
                  />
                )}
              </div>

              {/* Info */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Prompt</label>
                  <p className="mt-1 text-sm text-foreground">{selectedImage.prompt}</p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Model</label>
                    <p className="mt-1 text-sm text-foreground">{selectedImage.model}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">
                      {selectedImage.type === 'video' ? 'Duration' : 'Aspect Ratio'}
                    </label>
                    <p className="mt-1 text-sm text-foreground">
                      {selectedImage.type === 'video' ? selectedImage.duration : selectedImage.aspect_ratio}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(selectedImage.url, selectedImage.prompt)}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
