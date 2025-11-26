"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message: string;
}

export function ErrorDialog({ open, onOpenChange, title = "Error", message }: ErrorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            {/* Warning Icon */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            
            {/* Title */}
            <DialogTitle className="text-center text-xl">{title}</DialogTitle>
            
            {/* Message */}
            <DialogDescription className="text-center text-base">
              {message}
            </DialogDescription>
          </div>
        </DialogHeader>
        
        {/* OK Button */}
        <div className="flex justify-center pb-2">
          <Button
            onClick={() => onOpenChange(false)}
            className="min-w-[100px] bg-red-500 hover:bg-red-600"
          >
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
