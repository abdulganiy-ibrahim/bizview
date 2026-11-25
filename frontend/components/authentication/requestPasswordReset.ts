import { getUpdatePasswordRedirectUrl } from "@/lib/supabase/redirectUrls";
import { supabaseBrowserClient } from "@/lib/supabase/supabaseClient";

// Sends the password reset email.
export async function requestPasswordReset(email: string): Promise<void> {
  const supabase = await supabaseBrowserClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getUpdatePasswordRedirectUrl(),
  });

  if (error) { throw error; }
}