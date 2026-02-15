import { NextResponse } from "next/server";
import { verifySessionForAPI } from "@/lib/dal";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  console.log("[update-profile] Starting profile update request");
  
  try {
    const body = await req.json();
    console.log("[update-profile] Request body:", body);
    const { firstName, age, academicYear, major, height, ethnicity, interests, aboutMe, instagramHandle } = body;

    // Verify session using DAL
    const session = await verifySessionForAPI();
    if (!session) {
      console.log("[update-profile] No session, returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("[update-profile] Session verified for user:", session.userId);

    const supabase = createServiceRoleClient();

    const profileData = {
      first_name: firstName,
      age: parseInt(age),
      academic_year: academicYear,
      major,
      height,
      ethnicity,
      interests,
      about_me: aboutMe,
      instagram_handle: instagramHandle,
      profile_completed: true,
    };
    console.log("[update-profile] Profile data to update:", profileData);

    console.log("[update-profile] Updating profile for user:", session.userId);
    const { error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("id", session.userId);

    if (error) {
      console.error("[update-profile] Profile update error:", error);
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    console.log("[update-profile] Profile updated successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[update-profile] Catch block error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}