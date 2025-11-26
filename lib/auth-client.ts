import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setIsPending(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsPending(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { data: session, isPending };
}

export const signIn = {
    email: async (creds: any, options?: any) => {
        const { error } = await supabase.auth.signInWithPassword(creds);
        if (error) {
            options?.onError?.({ error });
        } else {
            options?.onSuccess?.();
        }
    }
};

export const signUp = {
    email: async (creds: any, options?: any) => {
        const { error } = await supabase.auth.signUp({
            email: creds.email,
            password: creds.password,
            options: {
                data: {
                    full_name: creds.name
                }
            }
        });
        if (error) {
            options?.onError?.({ error });
        } else {
            options?.onSuccess?.({ data: { user: { id: 'mock-id' } } });
        }
    }
};

export const signOut = async () => {
    await supabase.auth.signOut();
};
