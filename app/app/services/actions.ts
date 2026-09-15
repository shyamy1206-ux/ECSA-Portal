"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitServiceRequest(formData: FormData) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return { error: "You must be logged in." };
  }

  const request_type = formData.get("request_type") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string || "medium";

  if (!title || !description || !request_type) {
    return { error: "Missing required fields." };
  }
  
  if (title.length < 5 || description.length < 10) {
    return { error: "Input is too short." };
  }

  const { error } = await supabase
    .from("service_requests")
    .insert({
      student_id: session.user.id,
      request_type,
      title,
      description,
      priority,
      status: "pending"
    });

  if (error) {
    return { error: "Failed to submit request." };
  }

  revalidatePath("/app/services");
  return { success: true };
}

export async function submitLostAndFound(formData: FormData) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return { error: "You must be logged in." };
  }

  const item_type = formData.get("type") as string; // 'lost' or 'found'
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const date_found_lost = formData.get("date") as string;

  if (!title || !description || !item_type || !location || !date_found_lost) {
    return { error: "Missing required fields." };
  }

  const { error } = await supabase
    .from("lost_found_items")
    .insert({
      reported_by: session.user.id,
      item_type,
      title,
      description,
      location,
      date_found_lost: new Date(date_found_lost).toISOString(),
      status: "pending",
      category: "other"
    });

  if (error) {
    return { error: "Failed to submit report." };
  }

  revalidatePath("/app/services");
  return { success: true };
}

export async function submitEquipmentRequest(formData: FormData) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return { error: "You must be logged in." };
  }

  const request_type = formData.get("request_type") as string; // 'equipment' or 'lab_access'
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const equipment_name = formData.get("equipment_name") as string;
  const lab_name = formData.get("lab_name") as string;
  const date_needed = formData.get("date_needed") as string;
  const time_slot = formData.get("time_slot") as string;
  const purpose = formData.get("purpose") as string;

  if (!title || !request_type) {
    return { error: "Title and request type are required." };
  }

  if (title.length < 5) {
    return { error: "Title is too short." };
  }

  const { error } = await supabase
    .from("equipment_requests")
    .insert({
      student_id: session.user.id,
      request_type,
      title,
      description: description || null,
      equipment_name: equipment_name || null,
      lab_name: lab_name || null,
      date_needed: date_needed ? new Date(date_needed).toISOString() : null,
      time_slot: time_slot || null,
      purpose: purpose || null,
      status: "submitted"
    });

  if (error) {
    console.error(error);
    return { error: "Failed to submit request." };
  }

  revalidatePath("/app/services");
  return { success: true };
}
