'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { UpgradePopup } from '@/components/upgrade-popup';
import { PLAN_FEATURES, PLAN_PRICES, IMAGE_MODELS, VIDEO_MODELS, getUserSubscription } from '@/lib/subscription';
import { useTheme } from '@/components/theme-provider';
import { useSession } from '@/lib/auth-client';

// Icon URL function from your app
const getIconUrl = (iconName: string, theme: string) => {
  const themeFolder = theme === "dark" ? "dark" : "light";
  return `https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/${themeFolder}/${iconName}.png`;
};

// Get model with icon for display
const getModelWithIcon = (modelName: string) => {
  const imageModel = IMAGE_MODELS.find(m => m.name === modelName);
  const videoModel = VIDEO_MODELS.find(m => m.name === modelName);
  return imageModel || videoModel;
};

export default function PricingPage() {
  const { theme } = useTheme();
  const { data: session } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscription() {
      if (session?.user?.id) {
        try {
          const userSubscription = await getUserSubscription(session.user.id);
          setSubscription(userSubscription);
        } catch (error) {
          console.error('Error fetching subscription:', error);
        }
      }
      setSubscriptionLoading(false);
    }

    fetchSubscription();
  }, [session?.user?.id]);

  const handleUpgrade = (planName: string) => {
    setSelectedPlan(planName);
    setShowUpgradePopup(true);
  };

  const currentPlan = subscription?.plan_type || 'free';

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="container mx-auto px-6 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
          <p className="text-base opacity-70">Simple pricing for powerful AI generation</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Premium Plan */}
          <div className="relative backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold mb-1">Premium</h2>
              <p className="opacity-70 mb-3 text-sm">Image generation</p>
              <div className="text-2xl font-bold text-purple-400">
                ${PLAN_PRICES.premium.usd} / ₹{PLAN_PRICES.premium.inr}
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4" />
                <span className="text-sm">Unlimited Image Generation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4" />
                <span className="text-sm">{IMAGE_MODELS.length} Image Models</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4" />
                <span className="text-sm">No Daily Limits</span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2 text-sm">Models:</h4>
              <div className="text-xs space-y-1">
                {PLAN_FEATURES.premium.models.map((modelName) => {
                  const model = getModelWithIcon(modelName);
                  return (
                    <div key={modelName} className="flex items-center space-x-2">
                      {model?.iconUrl && (
                        <img 
                          src={getIconUrl(model.iconUrl, theme)} 
                          alt={modelName}
                          className="w-3 h-3"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <span className="opacity-90">{modelName}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {currentPlan === 'premium' ? (
              <div className="w-full flex items-center justify-center gap-2 py-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-300 dark:border-purple-700 rounded-2xl">
                <Check className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span className="text-purple-600 dark:text-purple-400 font-semibold">Current Plan</span>
              </div>
            ) : (
              <Button 
                className="group relative w-full gap-2 overflow-hidden bg-zinc-900 px-6 py-3 transition-all duration-200 hover:bg-zinc-900 dark:bg-zinc-100 dark:hover:bg-zinc-100 disabled:opacity-50"
                onClick={() => handleUpgrade('Premium')}
              >
                {/* Gradient background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 opacity-40 blur transition-opacity duration-500 group-hover:opacity-80" />
                
                {/* Content */}
                <div className="relative flex items-center justify-center gap-2">
                  <span className="text-white dark:text-zinc-900 font-semibold">Get Premium</span>
                </div>
              </Button>
            )}
          </div>

          {/* Ultra Plan */}
          <div className="relative backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="absolute top-3 right-3 bg-black/80 dark:bg-white/80 text-white dark:text-black px-2 py-1 text-xs rounded-full backdrop-blur-sm">
              Best Value
            </div>
            
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold mb-1">Ultra</h2>
              <p className="opacity-70 mb-3 text-sm">Image + Video generation</p>
              <div className="text-2xl font-bold text-purple-400">
                ${PLAN_PRICES.ultra.usd} / ₹{PLAN_PRICES.ultra.inr}
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4" />
                <span className="text-sm">Unlimited Image Generation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4" />
                <span className="text-sm">Unlimited Video Generation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4" />
                <span className="text-sm">{IMAGE_MODELS.length + VIDEO_MODELS.length} AI Models</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4" />
                <span className="text-sm">Priority Processing</span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2 text-sm">Video Models:</h4>
              <div className="text-xs space-y-1">
                {PLAN_FEATURES.ultra.models.map((modelName) => {
                  const model = getModelWithIcon(modelName);
                  return (
                    <div key={modelName} className="flex items-center space-x-2">
                      {model?.iconUrl && (
                        <img 
                          src={getIconUrl(model.iconUrl, theme)} 
                          alt={modelName}
                          className="w-3 h-3"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <span className="opacity-90">{modelName}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 text-xs opacity-60">
                + All {IMAGE_MODELS.length} image models from Premium plan
              </div>
            </div>

            {currentPlan === 'ultra' ? (
              <div className="w-full flex items-center justify-center gap-2 py-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-300 dark:border-purple-700 rounded-2xl">
                <Check className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span className="text-purple-600 dark:text-purple-400 font-semibold">Current Plan</span>
              </div>
            ) : (
              <Button 
                className="group relative w-full gap-2 overflow-hidden bg-zinc-900 px-6 py-3 transition-all duration-200 hover:bg-zinc-900 dark:bg-zinc-100 dark:hover:bg-zinc-100 disabled:opacity-50"
                onClick={() => handleUpgrade('Ultra')}
              >
                {/* Gradient background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 opacity-40 blur transition-opacity duration-500 group-hover:opacity-80" />
                
                {/* Content */}
                <div className="relative flex items-center justify-center gap-2">
                  <span className="text-white dark:text-zinc-900 font-semibold">Get Ultra</span>
                </div>
              </Button>
            )}
          </div>
        </div>

      </div>

      <UpgradePopup
        isOpen={showUpgradePopup}
        onClose={() => setShowUpgradePopup(false)}
        planName={selectedPlan}
      />
    </div>
  );
}
