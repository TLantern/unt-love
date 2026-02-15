"use client";

import FloatingHeartsBackground from "@/components/FloatingHeartsBackground";
import { YourTypeFlow } from "@/components/your-type/YourTypeFlow";

export default function YourTypePage() {
  return (
    <div className="relative min-h-screen bg-white">
      <FloatingHeartsBackground />
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <YourTypeFlow />
      </main>
    </div>
  );
}
