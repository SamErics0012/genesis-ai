import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/lib/auth-client';

export interface GeneratedVideo {
  id: string;
  user_id: string;
  video_url: string;
  prompt: string;
  model: string;
  duration: string;
  created_at: string;
}

export function useVideoGenerations() {
  const { data: session } = useSession();
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's generated videos
  const fetchVideos = async () => {
    if (!session?.user?.id) {
      setVideos([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/videos', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch videos');
      const data = await response.json();
      setVideos(data || []);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch videos');
    } finally {
      setIsLoading(false);
    }
  };

  // Save a new generated video
  const saveVideo = async (videoData: {
    video_url: string;
    prompt: string;
    model: string;
    duration: string;
  }) => {
    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(videoData),
      });

      if (!response.ok) throw new Error('Failed to save video');
      const data = await response.json();

      // Add to local state
      setVideos((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error saving video:', err);
      throw err;
    }
  };

  // Delete a video
  const deleteVideo = async (videoId: string) => {
    try {
      const response = await fetch(`/api/videos?id=${videoId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete video');

      // Remove from local state
      setVideos((prev) => prev.filter((vid) => vid.id !== videoId));
    } catch (err) {
      console.error('Error deleting video:', err);
      throw err;
    }
  };

  // Fetch videos when session changes
  useEffect(() => {
    fetchVideos();
  }, [session?.user?.id]);

  // Set up real-time subscription
  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase
      .channel('generated_videos_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'generated_videos',
          filter: `user_id=eq.${session.user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setVideos((prev) => [payload.new as GeneratedVideo, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setVideos((prev) => prev.filter((vid) => vid.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id]);

  return {
    videos,
    isLoading,
    error,
    saveVideo,
    deleteVideo,
    refetch: fetchVideos,
  };
}
