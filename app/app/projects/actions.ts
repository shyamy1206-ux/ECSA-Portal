"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProject(formData: FormData) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return { error: "You must be logged in." };
  }

  const title = formData.get("title") as string;
  const summary = formData.get("summary") as string;
  const description = formData.get("description") as string;
  const github_url = formData.get("github_url") as string;
  const live_url = formData.get("live_url") as string;
  
  // Extract tech stack comma separated
  const techStackRaw = formData.get("tech_stack") as string;
  const tech_stack = techStackRaw ? techStackRaw.split(',').map(s => s.trim()).filter(Boolean) : [];

  if (!title || !summary) {
    return { error: "Title and summary are required." };
  }

  // Insert project
  const { data: project, error: insertError } = await supabase
    .from('projects')
    .insert({
      title,
      summary,
      description,
      github_url: github_url || null,
      live_url: live_url || null,
      tech_stack,
      created_by: session.user.id,
      status: 'draft' // Default to draft, needs admin approval to be published
    })
    .select('id')
    .single();

  if (insertError || !project) {
    console.error(insertError);
    return { error: "Failed to create project." };
  }

  // Automatically add creator as an approved member (owner)
  const { error: memberError } = await supabase
    .from('project_members')
    .insert({
      project_id: project.id,
      user_id: session.user.id,
      role: 'owner',
      status: 'approved'
    });

  if (memberError) {
    console.error(memberError);
    // Non-fatal, they are still 'created_by' owner
  }

  revalidatePath("/app/projects");
  redirect(`/app/projects/${project.id}`);
}

export async function requestToJoinProject(projectId: string, role: string) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) return { error: "You must be logged in." };

  const { error } = await supabase
    .from('project_members')
    .insert({
      project_id: projectId,
      user_id: session.user.id,
      role: role || 'member',
      status: 'pending'
    });

  if (error) {
    if (error.code === '23505') return { error: "You have already requested to join this project." };
    return { error: "Failed to send join request." };
  }

  revalidatePath("/app/projects/discover");
  revalidatePath(`/app/projects/${projectId}`);
  return { success: true };
}

export async function updateMemberStatus(memberId: string, status: 'approved' | 'rejected') {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) return { error: "You must be logged in." };

  const { error } = await supabase
    .from('project_members')
    .update({ status })
    .eq('id', memberId);

  if (error) return { error: "Failed to update member status." };

  revalidatePath("/app/projects");
  // Assuming caller handles specific path revalidation if needed
  return { success: true };
}
