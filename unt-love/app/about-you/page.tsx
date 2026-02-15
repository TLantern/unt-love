"use client";

import FloatingHeartsBackground from "@/components/FloatingHeartsBackground";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export default function AboutYouPage() {
  return (
    <div className="relative min-h-screen bg-white">
      <FloatingHeartsBackground />
      
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <OnboardingFlow />
      </main>
    </div>
  );
}