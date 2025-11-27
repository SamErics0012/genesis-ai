import { Subscription } from './supabase';

export type PlanType = 'free' | 'premium' | 'ultra';

export interface PlanFeatures {
  imageGeneration: boolean;
  videoGeneration: boolean;
  unlimited: boolean;
  models: string[];
}

// Real models from your app
export const IMAGE_MODELS = [
  { name: "Flux Ultra Raw 1.1", iconUrl: "flux" },
  { name: "Flux Kontext Pro", iconUrl: "flux" },
  { name: "Flux Kontext Max", iconUrl: "flux" },
  { name: "Google Nano Banana", iconUrl: "google" },
  { name: "Google Imagen-3", iconUrl: "google" },
  { name: "Google Imagen-4", iconUrl: "google" },
  { name: "Seedream 4", iconUrl: "bytedance-color" },
  { name: "OpenAI GPT-Image", iconUrl: "openai" },
  { name: "Runway Gen 4 Image", iconUrl: "runway" },
  { name: "Ideogram V3", iconUrl: "ideogram" },
];

export const VIDEO_MODELS = [
  { name: "Veo 3.1 Fast", iconUrl: "google" },
  { name: "Veo 3.1", iconUrl: "google" },
  { name: "Veo 3.1 Fast (Img2Vid)", iconUrl: "google" },
  { name: "Veo 3.1 (Img2Vid)", iconUrl: "google" },
  { name: "Sora", iconUrl: "openai" },
  { name: "Sora (Img2Vid)", iconUrl: "openai" },
  { name: "Sora 2 Pro", iconUrl: "openai" },
  { name: "Sora 2 Pro (Img2Vid)", iconUrl: "openai" },
  { name: "Hailuo-02", iconUrl: "hailuo" },
  { name: "Kling 2.5 PRO", iconUrl: "kling" },
  { name: "Kling v2.1 PRO", iconUrl: "kling" },
  { name: "Kling v2.1 Master", iconUrl: "kling" },
  { name: "Luma Ray 2", iconUrl: "luma" },
];

export const PLAN_FEATURES: Record<PlanType, PlanFeatures> = {
  free: {
    imageGeneration: false,
    videoGeneration: false,
    unlimited: false,
    models: [],
  },
  premium: {
    imageGeneration: true,
    videoGeneration: true,
    unlimited: true,
    models: [...IMAGE_MODELS.map(m => m.name), ...VIDEO_MODELS.map(m => m.name)],
  },
  ultra: {
    imageGeneration: true,
    videoGeneration: true,
    unlimited: true,
    models: [...IMAGE_MODELS.map(m => m.name), ...VIDEO_MODELS.map(m => m.name)],
  },
};

export const PLAN_PRICES = {
  premium: {
    inr: 799,
    usd: 9.99,
  },
  ultra: {
    inr: 1299,
    usd: 15.99,
  },
};

export async function getUserSubscription(userId: string, token?: string): Promise<Subscription | null> {
  try {
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    let url = `/api/subscription?userId=${encodeURIComponent(userId)}`;
    if (typeof window === 'undefined') {
      // Server-side: use absolute URL
      const baseUrl = process.env.BETTER_AUTH_URL || 'http://localhost:3000';
      // Ensure no double slashes if baseUrl ends with /
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      url = `${cleanBaseUrl}${url}`;
    }

    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      console.error('Failed to fetch subscription:', response.statusText);
      return null;
    }
    
    const { subscription } = await response.json();
    return subscription;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
}

export async function createDefaultSubscription(userId: string): Promise<Subscription | null> {
  // This function would need an API route implementation
  // For now, default subscriptions are created via the database migration
  console.log('createDefaultSubscription called for user:', userId);
  return null;
}

export function canAccessFeature(
  subscription: Subscription | null,
  feature: 'imageGeneration' | 'videoGeneration'
): boolean {
  if (!subscription || subscription.status !== 'active') {
    return false;
  }

  const planFeatures = PLAN_FEATURES[subscription.plan_type];
  return planFeatures[feature];
}

export function getPlanFeatures(planType: PlanType): PlanFeatures {
  return PLAN_FEATURES[planType];
}
