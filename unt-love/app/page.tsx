"use client";

import Image from "next/image";
import { Inter } from "next/font/google";
import { BackgroundPlus } from "@/components/ui/background-plus";
import { useState } from "react";
import { useActionState } from "react";
import { signup, type AuthState } from "@/lib/actions/auth";

const inter = Inter({ subsets: ["latin"] });

function FeatureCard({
  feature,
  title,
  bullets,
  button,
  mirror,
  imageSrc,
  imageWidth = 100,
  imageHeight = 120,
  imageClassName = "",
  className = "",
}: {
  feature: string;
  title: string;
  bullets: string[];
  button?: string;
  mirror?: boolean;
  imageSrc?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageClassName?: string;
  className?: string;
}) {
  return (
    <div className={`relative flex size-60 flex-col overflow-hidden border border-transparent bg-pink-50 px-6 py-5 shadow ring-1 ring-black/5 transition-shadow md:size-72 hover:shadow-lg ${mirror ? "rounded-tr-3xl rounded-bl-3xl rounded-br-3xl" : "rounded-tl-3xl rounded-br-3xl rounded-bl-3xl"} ${className}`}>
      <div className="relative z-10 flex flex-1 flex-col text-center">
      <span className="mb-1 block text-xs font-semibold text-zinc-500">{feature}</span>
      <h3 className="mb-3 text-lg font-bold">{title}</h3>
      <ul className="mb-4 list-inside list-disc space-y-1 text-sm text-zinc-700">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      {button && (
        <button className="w-full rounded-lg bg-[#E85A50] py-2.5 text-sm font-medium text-white">
          {button}
        </button>
      )}
      {imageSrc && (
        <div className={imageClassName || "mt-3"}>
          <Image src={imageSrc} alt="" width={imageWidth} height={imageHeight} className="mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.08)]" />
        </div>
      )}
      </div>
      <BackgroundPlus plusColor="#E85A50" plusSize={40} fade />
    </div>
  );
}


export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [state, action, pending] = useActionState<AuthState, FormData>(signup, {});

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${showLoginModal ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setShowLoginModal(false)}
          aria-hidden
        />
        <div className="relative z-10 mx-4 w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-xl">
          <button
            onClick={() => setShowLoginModal(false)}
            className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
          <h2 className="pr-8 text-center text-xl font-bold text-zinc-900">Login with your UNT email</h2>
          <p className="mt-2 text-center text-sm text-zinc-600">Enter your @my.unt.edu email to continue.</p>
          <form className="mt-6" action={action}>
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="you@my.unt.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              className="mt-4 w-full rounded-md bg-[#E85A50] px-4 py-2.5 font-medium text-white shadow-md transition hover:brightness-90 hover:shadow-lg disabled:opacity-70"
            >
              {pending ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>
      </div>
      <nav className="flex items-center justify-between border-b border-zinc-200 px-6 py-2">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="UNT Love" width={60} height={60} />
          <h1 className="text-2xl font-bold text-[#000000]">UNT Love</h1>
        </div>
        <button
          onClick={() => setShowLoginModal(true)}
          className="rounded-md bg-[#E85A50] px-4 py-2 font-medium text-white shadow-md transition hover:brightness-90 hover:shadow-lg"
        >
          Match Me
        </button>
      </nav>
      <div className="flex flex-col items-center px-8 pt-4">
        <div className="relative w-full max-w-2xl overflow-hidden rounded-tl-3xl rounded-tr-3xl rounded-br-3xl rounded-bl-3xl border border-transparent bg-pink-50 px-8 py-8 shadow ring-1 ring-black/5">
          <div className="relative z-10 text-center">
            <h1 className="text-4xl font-bold text-[#E85A50]">
              Meet Someone Special at UNT
            </h1>
            <p className={`${inter.className} mt-4 text-lg font-bold text-zinc-600`}>
              Yikyak failed to match you at UNT. So we&apos;re here to help.
              <br />
              No swiping. Just real chemistry. We&apos;re here to help you find your perfect match.
            </p>
          </div>
          <BackgroundPlus plusColor="#E85A50" plusSize={50} fade />
        </div>
        <button
          onClick={() => setShowLoginModal(true)}
          className="mt-4 rounded-md bg-[#E85A50] px-4 py-2 font-medium text-white shadow-md transition hover:brightness-90 hover:shadow-lg"
        >
          Match Me
        </button>
        <div className="mt-2 flex items-center justify-center gap-8">
          <FeatureCard
            feature=""
            title="Quick Profile"
            bullets={["Tell us about yourself", "Share what you're looking for", "Add your Instagram"]}
            imageSrc="/girl.png"
          />
          <Image
            src="/scrappymain.png"
            alt="Scrappy mascot with heart"
            width={300}
            height={370}
            priority
          />
          <FeatureCard
            imageClassName="-mt-2"
            feature=""
            title="We Handle the Rest"
            bullets={["Find your perfect match", "Schedule the date", "Send reminders", "Ensure both show up"]}
            imageSrc="/boy%26girl.png"
            imageWidth={120}
            imageHeight={140}
            mirror
          />
        </div>
      </div>
    </div>
  );
}