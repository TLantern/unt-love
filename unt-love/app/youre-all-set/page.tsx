"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import FloatingHeartsBackground from "@/components/FloatingHeartsBackground";
import { Button } from "@/components/ui/Button";

export default function YoureAllSetPage() {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "success" | "error">("idle");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    
    // Get user ID for referral link
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });

    return () => clearTimeout(timer);
  }, []);

  const generateReferralLink = () => {
    const baseUrl = window.location.origin;
    const referralId = userId || "guest";
    return `${baseUrl}?ref=${referralId}`;
  };

  const handleShare = async () => {
    const shareData = {
      title: "UNT-Love",
      text: "Join UNT-Love to find your perfect match at UNT!",
      url: generateReferralLink(),
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        setShareStatus("success");
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        setShareStatus("success");
        setTimeout(() => setShareStatus("idle"), 3000);
      }
    } catch {
      setShareStatus("error");
      setTimeout(() => setShareStatus("idle"), 3000);
    }
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="relative min-h-screen bg-white">
      <FloatingHeartsBackground />
      
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div 
          className={`w-full max-w-2xl transition-all duration-500 ease-out ${
            showContent 
              ? "opacity-100 scale-100 translate-y-0" 
              : "opacity-0 scale-95 translate-y-4"
          }`}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-zinc-200/50 p-8 shadow-xl text-center">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-zinc-900 mb-3">You&apos;re In.</h1>
              <p className="text-lg text-zinc-600">
                We&apos;ll email you when we find a strong match at UNT.
              </p>
            </div>

            {/* Section 1: What Happens Next */}
            <div className="mb-8 text-left">
              <h2 className="text-xl font-semibold text-zinc-900 mb-4">What Happens Next</h2>
              <ul className="space-y-3 text-zinc-700">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#E85A50] rounded-full mt-2 shrink-0"></span>
                  <span>We analyze compatibility based on your preferences.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#E85A50] rounded-full mt-2 shrink-0"></span>
                  <span>When there&apos;s a strong match, you&apos;ll receive an email with their details.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#E85A50] rounded-full mt-2 shrink-0"></span>
                  <span>Both sides must confirm before contact is shared.</span>
                </li>
              </ul>
            </div>

            {/* Contact Section */}
            <div className="mb-8 text-center">
              <p className="text-sm text-zinc-600">
                Questions?{" "}
                <a 
                  href="https://www.instagram.com/tenbuilt/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#E85A50] hover:text-[#d44a40] transition-colors"
                >
                  Contact me at @tenbuilt
                </a>
              </p>
            </div>

            {/* Section 2: Increase Your Options */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-zinc-900 mb-2">Want More Matches?</h2>
              <p className="text-zinc-600 mb-6">
                Invite others to join UNT-Love and increase your match pool.
              </p>
              <Button
                onClick={handleShare}
                className="w-full mb-3"
                disabled={shareStatus === "success"}
              >
                {shareStatus === "success" ? "Link Copied!" : "Share UNT-Love"}
              </Button>
              <p className="text-sm text-zinc-500">
                More students = more options for you.
              </p>
              
              {shareStatus === "error" && (
                <p className="text-sm text-red-600 mt-2">
                  Failed to share. Please try again.
                </p>
              )}
            </div>

            {/* Home Button */}
            <Button
              variant="secondary"
              onClick={handleGoHome}
              className="w-full"
            >
              Home
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}