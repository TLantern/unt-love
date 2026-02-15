"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { signup, type AuthState } from "@/lib/actions/auth";

function VerifyForm({ initialEmail }: { initialEmail: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(signup, {});

  return (
    <div className="mx-auto max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-xl">
      <h1 className="text-center text-xl font-bold text-zinc-900">Create your account</h1>
      <p className="mt-2 text-center text-sm text-zinc-600">Enter your UNT student email to get started.</p>
      <form className="mt-6" action={action}>
        <input
          type="email"
          name="email"
          placeholder="you@my.unt.edu"
          defaultValue={initialEmail}
          required
          className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus:border-[#E85A50] focus:outline-none focus:ring-1 focus:ring-[#E85A50]"
        />
        {state?.errors?.email && (
          <p className="mt-2 text-sm text-red-600">{state.errors.email[0]}</p>
        )}
        {state?.errors?._form && (
          <p className="mt-2 text-sm text-red-600">{state.errors._form[0]}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="mt-4 w-full rounded-md bg-[#E85A50] px-4 py-2.5 font-medium text-white shadow-md transition hover:brightness-90 disabled:opacity-70"
        >
          {pending ? "Creating account…" : "Create Account"}
        </button>
      </form>
      <Link href="/" className="mt-4 block text-center text-sm text-zinc-500 hover:text-zinc-700">
        Back to home
      </Link>
    </div>
  );
}

function VerifyPageContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <VerifyForm initialEmail={emailParam} />
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen flex-col items-center justify-center bg-white px-4"><div className="text-zinc-500">Loading…</div></div>}>
      <VerifyPageContent />
    </Suspense>
  );
}
