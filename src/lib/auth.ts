import { getSupabaseClient } from "./supabase";
import type { User } from "@supabase/supabase-js";

export type { User };

export async function signIn(email: string, password: string) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOut() {
  const supabase = getSupabaseClient();
  await supabase.auth.signOut();
}

export function onAuthChange(callback: (user: User | null) => void) {
  const supabase = getSupabaseClient();
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
  supabase.auth.getUser().then(({ data }) => {
    callback(data.user ?? null);
  });
  return () => subscription.unsubscribe();
}
