"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select } from "@/components/onboarding/Select";
import { PillGroup } from "@/components/onboarding/PillGroup";
import { RangeSlider } from "./RangeSlider";
import { Toggle } from "./Toggle";

interface PreferencesData {
  ageMin: number;
  ageMax: number;
  academicYears: string[];
  heightPreference: string;
  ethnicityPreference: string[];
  intentPreference: string;
  mustHaveValues: string[];
  lifestyleMatch: string[];
  dealbreakers: string[];
  openToSurprises: boolean;
}

const INITIAL_PREFERENCES: PreferencesData = {
  ageMin: 18,
  ageMax: 30,
  academicYears: [],
  heightPreference: "",
  ethnicityPreference: [],
  intentPreference: "",
  mustHaveValues: [],
  lifestyleMatch: [],
  dealbreakers: [],
  openToSurprises: false,
};

const ACADEMIC_YEAR_OPTIONS = ["Freshman", "Sophomore", "Junior", "Senior", "Grad"];

const HEIGHT_OPTIONS = [
  { value: "no_preference", label: "No preference" },
  { value: "5_0_to_5_5", label: "5'0\" – 5'5\"" },
  { value: "5_6_to_5_9", label: "5'6\" – 5'9\"" },
  { value: "5_10_to_6_0", label: "5'10\" – 6'0\"" },
  { value: "6_1_plus", label: "6'1\"+" },
];

const ETHNICITY_OPTIONS = [
  "American Indian or Alaska Native",
  "Asian",
  "Black or African American",
  "Hispanic or Latino",
  "Native Hawaiian or Pacific Islander",
  "White",
  "Mixed Race",
  "Other",
  "No preference",
];

const INTENT_OPTIONS = [
  { value: "long_term", label: "Long-term" },
  { value: "serious", label: "Serious dating" },
  { value: "friends_first", label: "Friends first" },
  { value: "casual", label: "Casual" },
  { value: "open", label: "Open" },
];

const MUST_HAVE_VALUES = [
  "Honesty", "Loyalty", "Communication", "Respect", "Kindness",
  "Ambition", "Humor", "Family-oriented", "Adventure", "Faith",
  "Growth mindset", "Empathy", "Independence",
];

const LIFESTYLE_OPTIONS = [
  "Fitness", "Night owl", "Early bird", "Outdoorsy", "Homebody",
  "Social butterfly", "Introvert", "Travel lover", "Foodie",
  "Creative", "Academic", "Athletic", "Music lover",
];

const DEALBREAKER_OPTIONS = [
  "Smoking", "Drinking", "Drugs", "Non-monogamy", "Long distance",
  "Different faith", "No kids ever", "Wants kids", "Politics",
  "Clubbing", "Gaming", "Social media", "Other",
];

interface ValidationErrors {
  [key: string]: string;
}

export function YourTypeFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [preferences, setPreferences] = useState<PreferencesData>(INITIAL_PREFERENCES);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);

  const updatePref = <K extends keyof PreferencesData>(key: K, value: PreferencesData[K]) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    if (errors[key as string]) setErrors(prev => ({ ...prev, [key]: "" }));
  };

  const validateStep1 = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (preferences.ageMin > preferences.ageMax) {
      newErrors.ageRange = "Min age must be less than or equal to max age";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep < 2) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setErrors({});
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/profile/update-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error("Failed to save preferences");
      }

      router.push("/youre-all-set");
    } catch (error) {
      console.error("Preferences save error:", error);
      setErrors({ submit: "Failed to save preferences. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = (currentStep / 2) * 100;

  return (
    <div className="w-full max-w-2xl">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-zinc-900 mb-2">Your Type</h1>
        <p className="text-lg text-zinc-600 mb-6">Set your match preferences so we can find the right people for you</p>
        <div className="space-y-2">
          <p className="text-sm text-zinc-500">Step {currentStep} of 2</p>
          <div className="w-full bg-zinc-200 rounded-full h-2">
            <div
              className="bg-[#E85A50] h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </header>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-zinc-200/50 p-8 shadow-xl">
        {/* Step 1: Non-Negotiables */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">Non-Negotiables</h2>
            <p className="text-zinc-600 text-sm mb-4">Hard filters — only people matching these will appear.</p>

            <RangeSlider
              label="Age Range"
              min={18}
              max={30}
              minValue={preferences.ageMin}
              maxValue={preferences.ageMax}
              onMinChange={(v) => updatePref("ageMin", v)}
              onMaxChange={(v) => updatePref("ageMax", v)}
              error={errors.ageRange}
            />

            <PillGroup
              label="Academic Year"
              options={ACADEMIC_YEAR_OPTIONS}
              selectedValues={preferences.academicYears}
              onSelectionChange={(v) => updatePref("academicYears", v)}
              error={errors.academicYears}
            />

            <Select
              id="heightPreference"
              label="Height Preference"
              options={HEIGHT_OPTIONS}
              value={preferences.heightPreference}
              onChange={(e) => updatePref("heightPreference", e.target.value)}
            />

            <PillGroup
              label="Ethnicity Preference"
              options={ETHNICITY_OPTIONS}
              selectedValues={preferences.ethnicityPreference}
              onSelectionChange={(v) => updatePref("ethnicityPreference", v)}
              error={errors.ethnicityPreference}
            />
          </div>
        )}

        {/* Step 2: Compatibility Signals */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">Compatibility Signals</h2>
            <p className="text-zinc-600 text-sm mb-4">Soft filters — we use these to rank and suggest matches.</p>

            <Select
              id="intentPreference"
              label="Intent Preference"
              options={INTENT_OPTIONS}
              value={preferences.intentPreference}
              onChange={(e) => updatePref("intentPreference", e.target.value)}
            />

            <PillGroup
              label="Must-Have Values (up to 3)"
              options={MUST_HAVE_VALUES}
              selectedValues={preferences.mustHaveValues}
              onSelectionChange={(v) => updatePref("mustHaveValues", v)}
              maxSelection={3}
            />

            <PillGroup
              label="Lifestyle Match (up to 3)"
              options={LIFESTYLE_OPTIONS}
              selectedValues={preferences.lifestyleMatch}
              onSelectionChange={(v) => updatePref("lifestyleMatch", v)}
              maxSelection={3}
            />

            <PillGroup
              label="Dealbreakers (up to 3)"
              options={DEALBREAKER_OPTIONS}
              selectedValues={preferences.dealbreakers}
              onSelectionChange={(v) => updatePref("dealbreakers", v)}
              maxSelection={3}
            />

            <div className="pt-2 border-t border-zinc-200">
              <Toggle
                label="Open to surprises"
                checked={preferences.openToSurprises}
                onChange={(v) => updatePref("openToSurprises", v)}
              />
              <p className="text-xs text-zinc-500 mt-1">Softens strict filtering so you may see a few outside your usual type.</p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleBack}
            className={`px-6 py-3 text-zinc-600 font-medium rounded-lg transition ${currentStep === 1 ? "invisible" : "hover:bg-zinc-100"}`}
            disabled={currentStep === 1}
          >
            Back
          </button>
          {currentStep < 2 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-8 py-3 bg-[#E85A50] text-white font-semibold rounded-lg shadow-lg transition hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-[#E85A50] focus:ring-offset-2"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={loading}
              className="px-8 py-3 bg-[#E85A50] text-white font-semibold rounded-lg shadow-lg transition hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-[#E85A50] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Finish"}
            </button>
          )}
        </div>
        {errors.submit && (
          <p className="text-sm text-red-600 text-center mt-4">{errors.submit}</p>
        )}
      </div>
    </div>
  );
}