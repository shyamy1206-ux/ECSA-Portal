"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateInterests(interests: string[]) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return { error: "Not authenticated" };

  // Validate interests
  if (!Array.isArray(interests)) return { error: "Invalid interests format" };

  const { error } = await supabase
    .from('profiles')
    .update({ interests })
    .eq('id', session.user.id);

  if (error) {
    console.error(error);
    return { error: "Failed to update interests" };
  }

  revalidatePath('/app');
  return { success: true };
}
