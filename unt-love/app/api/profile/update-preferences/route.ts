import { NextResponse } from "next/server";
import { verifySessionForAPI } from "@/lib/dal";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      ageMin,
      ageMax,
      academicYears,
      heightPreference,
      ethnicityPreference,
      intentPreference,
      mustHaveValues,
      lifestyleMatch,
      dealbreakers,
      openToSurprises,
    } = body;

    // Verify session using DAL
    const session = await verifySessionForAPI();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const supabase = createServiceRoleClient();

    const preferencesData = {
      age_min: ageMin,
      age_max: ageMax,
      academic_years_preference: academicYears,
      height_preference: heightPreference,
      ethnicity_preference: ethnicityPreference,
      intent_preference: intentPreference,
      must_have_values: mustHaveValues,
      lifestyle_match: lifestyleMatch,
      dealbreakers,
      open_to_surprises: openToSurprises,
      preferences_completed: true,
    };

    // Also check if profile is completed to set onboarding_completed
    const { data: profile } = await supabase
      .from("profiles")
      .select("profile_completed")
      .eq("id", session.userId)
      .single();

    const updateData = {
      ...preferencesData,
      onboarding_completed: profile?.profile_completed || false,
    };

    const { error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", session.userId);

    if (error) {
      console.error("Preferences update error:", error);
      return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Preferences update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}