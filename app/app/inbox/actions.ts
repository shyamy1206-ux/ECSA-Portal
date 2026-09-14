"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markAllAsRead(formData?: FormData) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return;

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', session.user.id)
    .eq('is_read', false);

  if (error) {
    console.error(error);
    return;
  }

  revalidatePath('/app/inbox');
}

export async function deleteNotification(notificationId: string, formData?: FormData) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return;

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId)
    .eq('user_id', session.user.id);

  if (error) {
    console.error(error);
    return;
  }

  revalidatePath('/app/inbox');
}
