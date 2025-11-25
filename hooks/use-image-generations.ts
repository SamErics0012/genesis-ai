import { useState, useEffect } from 'react';
import { supabase, GeneratedImage } from '@/lib/supabase';
import { useSession } from '@/lib/auth-client';

export function useImageGenerations() {
  const { data: session } = useSession();
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's generated images
  const fetchImages = async () => {
    if (!session?.user?.id) {
      setImages([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('generated_images')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch images');
    } finally {
      setIsLoading(false);
    }
  };

  // Save a new generated image
  const saveImage = async (imageData: {
    image_url: string;
    prompt: string;
    model: string;
    aspect_ratio: string;
  }) => {
    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      const { data, error } = await supabase
        .from('generated_images')
        .insert({
          user_id: session.user.id,
          ...imageData,
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      setImages((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error saving image:', err);
      throw err;
    }
  };

  // Delete an image
  const deleteImage = async (imageId: string) => {
    try {
      // Get the image data to extract storage path
      const imageToDelete = images.find(img => img.id === imageId);
      
      // Delete from database
      const { error } = await supabase
        .from('generated_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      // Delete from storage if image URL is from Supabase storage
      if (imageToDelete?.image_url && imageToDelete.image_url.includes('supabase')) {
        try {
          const url = new URL(imageToDelete.image_url);
          const pathParts = url.pathname.split('/');
          const bucketIndex = pathParts.findIndex(part => part === 'storage');
          if (bucketIndex !== -1 && pathParts[bucketIndex + 2]) {
            const bucketName = pathParts[bucketIndex + 2];
            const filePath = pathParts.slice(bucketIndex + 3).join('/');
            
            await supabase.storage
              .from(bucketName)
              .remove([filePath]);
          }
        } catch (storageError) {
          console.warn('Could not delete from storage:', storageError);
        }
      }

      // Remove from local state
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      console.error('Error deleting image:', err);
      throw err;
    }
  };

  // Fetch images when session changes
  useEffect(() => {
    fetchImages();
  }, [session?.user?.id]);

  // Set up real-time subscription
  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase
      .channel('generated_images_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'generated_images',
          filter: `user_id=eq.${session.user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setImages((prev) => [payload.new as GeneratedImage, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setImages((prev) => prev.filter((img) => img.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id]);

  return {
    images,
    isLoading,
    error,
    saveImage,
    deleteImage,
    refetch: fetchImages,
  };
}
