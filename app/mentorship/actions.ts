"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function requestMentorship(mentorProfileId: string, message: string, topics: string[]) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return { error: "You must be logged in." };

  if (!message || message.length < 20) {
    return { error: "Please write a message of at least 20 characters." };
  }

  const { error } = await supabase
    .from('mentorship_requests')
    .insert({
      mentor_id: mentorProfileId,
      student_id: session.user.id,
      message,
      topics,
      status: 'pending'
    });

  if (error) {
    if (error.code === '23505') return { error: "You have already sent a request to this mentor." };
    console.error(error);
    return { error: "Failed to send request." };
  }

  revalidatePath("/mentorship");
  return { success: true };
}

export async function updateMentorshipRequest(requestId: string, status: 'accepted' | 'declined', notes?: string) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return { error: "You must be logged in." };

  const updateData: any = { status, updated_at: new Date().toISOString() };
  if (notes) updateData.mentor_notes = notes;

  const { error } = await supabase
    .from('mentorship_requests')
    .update(updateData)
    .eq('id', requestId);

  if (error) return { error: "Failed to update request." };

  revalidatePath("/mentorship");
  revalidatePath("/app/mentorship");
  return { success: true };
}
