'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Instagram, X } from 'lucide-react';

interface UpgradePopupProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
}

export function UpgradePopup({ isOpen, onClose, planName }: UpgradePopupProps) {
  const instagramUrl = 'https://www.instagram.com/samurai_apiog/';

  const handleInstagramClick = () => {
    window.open(instagramUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Upgrade to {planName}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="text-center space-y-4">
            <div className="p-4 border border-gray-300 dark:border-gray-700">
              <h3 className="font-semibold mb-2">
                Manual Purchase Required
              </h3>
              <p className="text-sm opacity-70">
                We currently don't support web purchases. Please contact us on Instagram for manual purchase and activation.
              </p>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm opacity-70">
                Contact us for instant activation:
              </p>
              
              <Button
                onClick={handleInstagramClick}
                className="w-full bg-black text-white dark:bg-white dark:text-black hover:opacity-80"
                size="lg"
              >
                <Instagram className="h-5 w-5 mr-2" />
                Contact on Instagram
              </Button>
              
              <p className="text-xs opacity-70">
                @samurai_apiog
              </p>
            </div>
            
            <div className="pt-4 border-t border-gray-300 dark:border-gray-700">
              <p className="text-xs opacity-70">
                💡 Tip: Send us a screenshot of this page along with your preferred plan for faster processing.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
