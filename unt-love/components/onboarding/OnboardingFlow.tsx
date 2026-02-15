"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "./Input";
import { Select } from "./Select";
import { PillGroup } from "./PillGroup";

interface FormData {
  // Step 1
  firstName: string;
  age: string;
  academicYear: string;
  major: string;
  height: string;
  ethnicity: string;
  // Step 2
  interests: string[];
  // Step 3
  aboutMe: string;
  instagramHandle: string;
}

const INITIAL_DATA: FormData = {
  firstName: "",
  age: "",
  academicYear: "",
  major: "",
  height: "",
  ethnicity: "",
  interests: [],
  aboutMe: "",
  instagramHandle: "",
};

const ACADEMIC_YEARS = [
  { value: "freshman", label: "Freshman" },
  { value: "sophomore", label: "Sophomore" },
  { value: "junior", label: "Junior" },
  { value: "senior", label: "Senior" },
  { value: "graduate", label: "Graduate" },
  { value: "phd", label: "PhD Student" },
];

const HEIGHTS = [
  { value: "4'8\"", label: "4'8\"" },
  { value: "4'9\"", label: "4'9\"" },
  { value: "4'10\"", label: "4'10\"" },
  { value: "4'11\"", label: "4'11\"" },
  { value: "5'0\"", label: "5'0\"" },
  { value: "5'1\"", label: "5'1\"" },
  { value: "5'2\"", label: "5'2\"" },
  { value: "5'3\"", label: "5'3\"" },
  { value: "5'4\"", label: "5'4\"" },
  { value: "5'5\"", label: "5'5\"" },
  { value: "5'6\"", label: "5'6\"" },
  { value: "5'7\"", label: "5'7\"" },
  { value: "5'8\"", label: "5'8\"" },
  { value: "5'9\"", label: "5'9\"" },
  { value: "5'10\"", label: "5'10\"" },
  { value: "5'11\"", label: "5'11\"" },
  { value: "6'0\"", label: "6'0\"" },
  { value: "6'1\"", label: "6'1\"" },
  { value: "6'2\"", label: "6'2\"" },
  { value: "6'3\"", label: "6'3\"" },
  { value: "6'4\"", label: "6'4\"" },
  { value: "6'5\"", label: "6'5\"" },
  { value: "6'6\"", label: "6'6\"" },
  { value: "6'7\"", label: "6'7\"" },
];

const ETHNICITIES = [
  { value: "american_indian", label: "American Indian or Alaska Native" },
  { value: "asian", label: "Asian" },
  { value: "black", label: "Black or African American" },
  { value: "hispanic", label: "Hispanic or Latino" },
  { value: "pacific_islander", label: "Native Hawaiian or Pacific Islander" },
  { value: "white", label: "White" },
  { value: "mixed", label: "Mixed Race" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

const INTEREST_OPTIONS = [
  "Photography", "Hiking", "Gaming", "Music", "Art", "Cooking", "Dancing", "Reading",
  "Sports", "Fitness", "Travel", "Movies", "Technology", "Fashion", "Writing",
  "Volunteering", "Anime", "Coffee", "Dogs", "Cats", "Yoga", "Basketball",
  "Football", "Soccer", "Tennis", "Swimming", "Rock Climbing", "Cycling",
  "Skateboarding", "Snowboarding", "Surfing", "Camping"
];

interface ValidationErrors {
  [key: string]: string;
}

export function OnboardingFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);

  const updateFormData = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.age.trim()) newErrors.age = "Age is required";
    else if (parseInt(formData.age) < 18 || parseInt(formData.age) > 30) {
      newErrors.age = "Age must be between 18 and 30";
    }
    if (!formData.academicYear) newErrors.academicYear = "Academic year is required";
    if (!formData.major.trim()) newErrors.major = "Major is required";
    if (!formData.height) newErrors.height = "Height is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (formData.interests.length < 3) {
      newErrors.interests = "Please select at least 3 interests";
    } else if (formData.interests.length > 5) {
      newErrors.interests = "Please select no more than 5 interests";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!formData.instagramHandle.trim()) newErrors.instagramHandle = "Instagram handle is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    
    if (currentStep === 1) isValid = validateStep1();
    else if (currentStep === 2) isValid = validateStep2();
    else if (currentStep === 3) isValid = validateStep3();

    if (isValid && currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/profile/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      router.push("/your-type");
    } catch (error) {
      console.error("Profile save error:", error);
      setErrors({ submit: "Failed to save profile. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = (currentStep / 3) * 100;

  return (
    <div className="w-full max-w-2xl">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-zinc-900 mb-2">About You</h1>
        <p className="text-lg text-zinc-600 mb-6">Tell us about yourself so we can find your perfect match at UNT</p>
        
        {/* Progress Indicator */}
        <div className="space-y-2">
          <p className="text-sm text-zinc-500">Step {currentStep} of 3</p>
          <div className="w-full bg-zinc-200 rounded-full h-2">
            <div 
              className="bg-[#E85A50] h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </header>

      {/* Form Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-zinc-200/50 p-8 shadow-xl">
        {/* Step 1: Basics */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={(e) => updateFormData("firstName", e.target.value)}
                placeholder="Enter your first name"
                error={errors.firstName}
                required
              />

              <Input
                id="age"
                label="Age"
                type="number"
                min="18"
                max="30"
                value={formData.age}
                onChange={(e) => updateFormData("age", e.target.value)}
                placeholder="18"
                error={errors.age}
                required
              />

              <Select
                id="academicYear"
                label="Academic Year"
                options={ACADEMIC_YEARS}
                value={formData.academicYear}
                onChange={(e) => updateFormData("academicYear", e.target.value)}
                error={errors.academicYear}
                required
              />

              <Input
                id="major"
                label="Major"
                value={formData.major}
                onChange={(e) => updateFormData("major", e.target.value)}
                placeholder="e.g. Computer Science"
                error={errors.major}
                required
              />

              <Select
                id="height"
                label="Height"
                options={HEIGHTS}
                value={formData.height}
                onChange={(e) => updateFormData("height", e.target.value)}
                error={errors.height}
                required
              />

              <Select
                id="ethnicity"
                label="Ethnicity"
                options={ETHNICITIES}
                value={formData.ethnicity}
                onChange={(e) => updateFormData("ethnicity", e.target.value)}
                error={errors.ethnicity}
              />
            </div>
          </div>
        )}

        {/* Step 2: Interests */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">Your Interests</h2>
            <p className="text-zinc-600 mb-6">Pick 3-5 interests that best describe you. This helps us find compatible matches!</p>
            
            <PillGroup
              label="Interests"
              options={INTEREST_OPTIONS}
              selectedValues={formData.interests}
              onSelectionChange={(values) => updateFormData("interests", values)}
              maxSelection={5}
              allowCustom={true}
              error={errors.interests}
            />
          </div>
        )}

        {/* Step 3: About & Instagram */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">Tell Us About You</h2>
            
            <div>
              <label htmlFor="aboutMe" className="block text-sm font-medium text-zinc-700 mb-2">
                About Me
              </label>
              <textarea
                id="aboutMe"
                rows={4}
                value={formData.aboutMe}
                onChange={(e) => {
                  if (e.target.value.length <= 250) {
                    updateFormData("aboutMe", e.target.value);
                  }
                }}
                className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:border-[#E85A50] focus:outline-none focus:ring-1 focus:ring-[#E85A50] resize-none"
                placeholder="Tell us about yourself, what makes you unique, what you're looking for..."
              />
              <div className="flex justify-between mt-1">
                <p className="text-xs text-zinc-500">Optional</p>
                <p className="text-xs text-zinc-500">{formData.aboutMe.length}/250</p>
              </div>
            </div>

            <Input
              id="instagramHandle"
              label="Instagram Handle"
              value={formData.instagramHandle}
              onChange={(e) => updateFormData("instagramHandle", e.target.value)}
              placeholder="@yourhandle"
              error={errors.instagramHandle}
              required
            />
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleBack}
            className={`px-6 py-3 text-zinc-600 font-medium rounded-lg transition ${
              currentStep === 1 
                ? 'invisible' 
                : 'hover:bg-zinc-100'
            }`}
            disabled={currentStep === 1}
          >
            Back
          </button>

          {currentStep < 3 ? (
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
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 bg-[#E85A50] text-white font-semibold rounded-lg shadow-lg transition hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-[#E85A50] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Create Profile"}
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