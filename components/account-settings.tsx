"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, CreditCard } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { getUserSubscription } from "@/lib/subscription";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast-provider";

export function AccountSettings() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch user profile from database
    const fetchProfile = async () => {
      if (session?.user?.id) {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/user/profile?userId=${session.user.id}`);
          if (response.ok) {
            const { user } = await response.json();
            if (user) {
              setDisplayName(user.display_name || user.name || '');
              setAvatarUrl(user.profile_picture_url);
            }
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          // Fallback to localStorage
          const savedName = localStorage.getItem("displayName");
          const savedAvatar = localStorage.getItem("userAvatar");
          if (savedName) setDisplayName(savedName);
          if (savedAvatar) setAvatarUrl(savedAvatar);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();
  }, [session?.user?.id]);

  // Fetch subscription status
  useEffect(() => {
    const fetchSubscription = async () => {
      if (session?.user?.id) {
        try {
          const userSubscription = await getUserSubscription(session.user.id);
          setSubscription(userSubscription);
        } catch (error) {
          console.error('Error fetching subscription:', error);
        }
      }
    };

    fetchSubscription();
  }, [session?.user?.id]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && session?.user?.id) {
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', session.user.id);

        const response = await fetch('/api/user/upload-avatar', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const { fileUrl } = await response.json();
          setAvatarUrl(fileUrl);
          localStorage.setItem("userAvatar", fileUrl);
          
          // Trigger custom event to update sidebar
          window.dispatchEvent(new CustomEvent('profileUpdated', { 
            detail: { displayName, avatarUrl: fileUrl } 
          }));
        } else {
          toast({
            title: "Upload Failed",
            description: "Failed to upload avatar. Please try again.",
            variant: "error"
          });
        }
      } catch (error) {
        console.error('Error uploading avatar:', error);
        toast({
          title: "Upload Failed",
          description: "Failed to upload avatar. Please try again.",
          variant: "error"
        });
      }
    }
  };

  const handleSaveChanges = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save changes.",
        variant: "error"
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          displayName: displayName,
        }),
      });

      if (response.ok) {
        // Save to localStorage for quick access
        localStorage.setItem("displayName", displayName);
        
        // Trigger custom event to update sidebar
        window.dispatchEvent(new CustomEvent('profileUpdated', { 
          detail: { displayName, avatarUrl } 
        }));
        
        toast({
          title: "Profile Updated",
          description: "Your changes have been saved successfully!",
          variant: "success"
        });
      } else {
        toast({
          title: "Save Failed",
          description: "Failed to save changes. Please try again.",
          variant: "error"
        });
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save changes. Please try again.",
        variant: "error"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getInitial = () => {
    return displayName.charAt(0).toUpperCase();
  };

  return (
    <div className="h-full overflow-auto bg-background p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-semibold text-foreground">Account Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account settings and connected accounts
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Personal Information */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Personal Information</h2>
              <p className="mb-6 text-sm text-muted-foreground">
                Update your profile and personal details
              </p>

              {/* Avatar Upload */}
              <div className="mb-6 flex items-center gap-4">
                <div className="relative">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-2xl font-semibold text-foreground">
                      {getInitial()}
                    </div>
                  )}
                  <button
                    onClick={handleAvatarClick}
                    className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-background border border-border hover:bg-muted transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Profile Picture</p>
                  <p className="text-xs text-muted-foreground">
                    Click the camera icon to upload a new photo
                  </p>
                </div>
              </div>

              {/* Display Name */}
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                />
                <p className="text-xs text-muted-foreground">
                  This is how your name will appear across the platform
                </p>
              </div>

              {/* Save Button */}
              <div className="mt-6">
                <Button 
                  onClick={handleSaveChanges}
                  disabled={isSaving || isLoading}
                  className="group relative overflow-hidden bg-zinc-900 px-6 transition-all duration-200 hover:bg-zinc-900 dark:bg-zinc-100 dark:hover:bg-zinc-100 disabled:opacity-50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 opacity-40 blur transition-opacity duration-500 group-hover:opacity-80" />
                  <span className="relative text-white dark:text-zinc-900">
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </span>
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column - Your Plan */}
          <div className="space-y-6">
            {/* Your Plan */}
            <Card className="p-6">
              <h2 className="mb-2 text-lg font-semibold text-foreground">Your plan</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Manage your subscription and billing information
              </p>

              <div className="rounded-lg bg-muted p-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-background">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    {subscription && subscription.plan_type !== 'free' ? (
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground capitalize">
                          {subscription.plan_type} Plan
                        </p>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          subscription.plan_type === 'premium' 
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                            : 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 dark:bg-gradient-to-r dark:from-pink-900/20 dark:to-purple-900/20 dark:text-pink-300'
                        }`}>
                          {subscription.plan_type.toUpperCase()}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-foreground">No Active Subscription</p>
                    )}
                  </div>
                </div>
                
                {subscription && subscription.plan_type !== 'free' ? (
                  <>
                    <p className="mb-2 text-xs text-muted-foreground">
                      {subscription.plan_type === 'premium' 
                        ? 'Enjoy unlimited image generation with 6 AI models'
                        : 'Enjoy unlimited image and video generation with 9 AI models'}
                    </p>
                    {subscription.expires_at && (
                      <p className="mb-4 text-xs text-muted-foreground">
                        Expires: {new Date(subscription.expires_at).toLocaleDateString()}
                      </p>
                    )}
                    <Button 
                      onClick={() => router.push('/pricing')}
                      variant="outline"
                      className="w-full"
                    >
                      Manage Subscription
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="mb-4 text-xs text-muted-foreground">
                      Get started with a plan to unlock image and video generation
                    </p>
                    <Button 
                      onClick={() => router.push('/pricing')}
                      className="group relative w-full overflow-hidden bg-zinc-900 transition-all duration-200 hover:bg-zinc-900 dark:bg-zinc-100 dark:hover:bg-zinc-100"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 opacity-40 blur transition-opacity duration-500 group-hover:opacity-80" />
                      <span className="relative text-white dark:text-zinc-900">Purchase Plan</span>
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
