import { useCallback, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type HostAuthState = {
  session: Session | null;
  user: User | null;
  isHost: boolean;
  loading: boolean;
};

/**
 * Host authentication for the ZAMIN Stays host portal.
 * Uses Supabase Auth for the session and the database `is_host()` gate,
 * which confirms the signed-in email owns at least one stay (or is on the
 * host allow-list).
 */
export function useHostAuth() {
  const [state, setState] = useState<HostAuthState>({
    session: null,
    user: null,
    isHost: false,
    loading: true,
  });

  const checkHost = useCallback(async (): Promise<boolean> => {
    const { data, error } = await supabase.rpc('is_host');
    if (error) return false;
    return data === true;
  }, []);

  useEffect(() => {
    let active = true;

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      if (!session) {
        setState({ session: null, user: null, isHost: false, loading: false });
        return;
      }
      setState((prev) => ({ ...prev, session, user: session.user }));
      void checkHost().then((isHost) => {
        if (active) {
          setState({ session, user: session.user, isHost, loading: false });
        }
      });
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, [checkHost]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      const isHost = await checkHost();
      if (!isHost) {
        await supabase.auth.signOut();
        return { error: 'This account is not linked to any ZAMIN Stays host listings.' };
      }
      setState((prev) => ({ ...prev, isHost: true, loading: false }));
      return { error: null };
    },
    [checkHost],
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState({ session: null, user: null, isHost: false, loading: false });
  }, []);

  /** Creates a host account. Access stays gated by `is_host()`. */
  const signUp = useCallback(
    async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return { error: error.message, needsConfirmation: false };
      if (!data.session) return { error: null, needsConfirmation: true };
      const isHost = await checkHost();
      if (!isHost) {
        await supabase.auth.signOut();
        return {
          error: 'No ZAMIN Stays listings are linked to this email yet. Ask our team to add you as a host.',
          needsConfirmation: false,
        };
      }
      setState((prev) => ({ ...prev, isHost: true, loading: false }));
      return { error: null, needsConfirmation: false };
    },
    [checkHost],
  );

  return { ...state, signIn, signUp, signOut };
}