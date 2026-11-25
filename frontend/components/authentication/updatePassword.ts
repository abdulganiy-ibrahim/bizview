import { supabaseBrowserClient } from '@/lib//supabase/supabaseClient';

export async function updatePassword(password: string): Promise<void> {
  const supabase = await supabaseBrowserClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) { throw error; }
}