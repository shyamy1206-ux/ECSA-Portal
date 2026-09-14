import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { contentType, contentId } = await request.json();

    if (!contentType || !contentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createClient();
    
    // Get user id if logged in (optional for views)
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || null;

    // Log the view
    const { error } = await supabase
      .from('content_engagement')
      .insert({
        content_type: contentType,
        content_id: contentId,
        action: 'view',
        user_id: userId
      });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Engagement tracking error:", error);
    return NextResponse.json({ error: "Failed to log engagement" }, { status: 500 });
  }
}
