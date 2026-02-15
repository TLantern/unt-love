import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { generateVerificationCode, hashCode, isValidUNTEmail } from "@/lib/auth/verification";
import { sendEmail } from "@/lib/email";

const EXPIRY_MINUTES = 10;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!email || !isValidUNTEmail(email)) {
      return NextResponse.json({ error: "Must use a valid UNT student email." }, { status: 400 });
    }

    const code = generateVerificationCode();
    const codeHash = hashCode(code);
    const expiresAt = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);

    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("email_verifications").upsert(
      { email, code_hash: codeHash, expires_at: expiresAt.toISOString(), attempts: 0, verified: false },
      { onConflict: "email" }
    );
    if (error) return NextResponse.json({ error: "Failed to store verification" }, { status: 500 });

    await sendEmail(email, code);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Request failed";
    if (process.env.NODE_ENV === "development") console.error("[request-verification]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
