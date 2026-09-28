import { useCallback, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type AdminAuthState = {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
};

/**
 * Admin authentication for ZAMIN Stays.
 * Uses Supabase Auth for the session and the database `is_admin()` gate
 * (which checks the signed-in email against the admin allow-list).
 */
export function useAdminAuth() {
  const [state, setState] = useState<AdminAuthState>({
    session: null,
    user: null,
    isAdmin: false,
    loading: true,
  });

  const checkAdmin = useCallback(async (): Promise<boolean> => {
    const { data, error } = await supabase.rpc('is_admin');
    if (error) return false;
    return data === true;
  }, []);

  useEffect(() => {
    let active = true;

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      if (!session) {
        setState({ session: null, user: null, isAdmin: false, loading: false });
        return;
      }
      setState((prev) => ({ ...prev, session, user: session.user }));
      void checkAdmin().then((isAdmin) => {
        if (active) {
          setState({ session, user: session.user, isAdmin, loading: false });
        }
      });
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, [checkAdmin]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      const isAdmin = await checkAdmin();
      if (!isAdmin) {
        await supabase.auth.signOut();
        return { error: 'This account does not have ZAMIN Stays admin access.' };
      }
      setState((prev) => ({ ...prev, isAdmin: true, loading: false }));
      return { error: null };
    },
    [checkAdmin],
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState({ session: null, user: null, isAdmin: false, loading: false });
  }, []);

  /**
   * Creates the first admin account. Access stays gated by the `is_admin()`
   * allow-list, so a non-listed email is signed straight back out.
   * Returns `needsConfirmation` when Supabase requires email confirmation.
   */
  const signUp = useCallback(
    async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return { error: error.message, needsConfirmation: false };
      if (!data.session) return { error: null, needsConfirmation: true };
      const isAdmin = await checkAdmin();
      if (!isAdmin) {
        await supabase.auth.signOut();
        return { error: 'This email is not on the ZAMIN admin allow-list.', needsConfirmation: false };
      }
      setState((prev) => ({ ...prev, isAdmin: true, loading: false }));
      return { error: null, needsConfirmation: false };
    },
    [checkAdmin],
  );

  return { ...state, signIn, signUp, signOut };
}