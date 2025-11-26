"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FolderOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function EditImage() {
  const [showComingSoonDialog, setShowComingSoonDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    setShowComingSoonDialog(true);
  };

  const handleSelectFromLibrary = () => {
    setShowComingSoonDialog(true);
  };

  return (
    <div className="flex h-full items-center justify-center bg-background">
      <div className="w-full max-w-2xl p-8">
        {/* Upload Area */}
        <div className="rounded-lg border-2 border-dashed border-border bg-card p-12">
          <div className="flex flex-col items-center justify-center gap-6">
            {/* Buttons */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleUploadClick}
              >
                <Upload className="h-4 w-4" />
                Upload
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleSelectFromLibrary}
              >
                <FolderOpen className="h-4 w-4" />
                Select from library
              </Button>
            </div>

            {/* Instructions */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Drag and drop an image here, or click to browse
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Max 10MB
              </p>
            </div>
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

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
