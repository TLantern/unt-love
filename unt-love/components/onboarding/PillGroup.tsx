"use client";

import { useState } from "react";

interface PillGroupProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  maxSelection?: number;
  allowCustom?: boolean;
  error?: string;
}

export function PillGroup({ 
  label, 
  options, 
  selectedValues, 
  onSelectionChange, 
  maxSelection = Infinity, 
  allowCustom = false,
  error 
}: PillGroupProps) {
  const [customValue, setCustomValue] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const toggleSelection = (value: string) => {
    const isSelected = selectedValues.includes(value);
    if (isSelected) {
      onSelectionChange(selectedValues.filter(v => v !== value));
    } else if (selectedValues.length < maxSelection) {
      onSelectionChange([...selectedValues, value]);
    }
  };

  const addCustomInterest = () => {
    if (customValue.trim() && !selectedValues.includes(customValue.trim()) && selectedValues.length < maxSelection) {
      onSelectionChange([...selectedValues, customValue.trim()]);
      setCustomValue("");
      setShowCustomInput(false);
    }
  };

  const handleCustomKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomInterest();
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-zinc-700">
        {label} ({selectedValues.length}{Number.isFinite(maxSelection) ? `/${maxSelection}` : ""} selected)
      </label>
      
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <button
            key={option}
            type="button"
            onClick={() => toggleSelection(option)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedValues.includes(option)
                ? 'bg-[#E85A50] text-white'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            } ${selectedValues.length >= maxSelection && !selectedValues.includes(option) ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={selectedValues.length >= maxSelection && !selectedValues.includes(option)}
          >
            {option}
          </button>
        ))}
        
        {/* Custom interests pills */}
        {selectedValues
          .filter(value => !options.includes(value))
          .map(customInterest => (
            <button
              key={customInterest}
              type="button"
              onClick={() => toggleSelection(customInterest)}
              className="px-4 py-2 rounded-full text-sm font-medium bg-[#E85A50] text-white transition-colors"
            >
              {customInterest}
            </button>
          ))}
      </div>

      {allowCustom && (
        <div className="space-y-2">
          {!showCustomInput ? (
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              className="text-sm text-[#E85A50] hover:underline"
              disabled={selectedValues.length >= maxSelection}
            >
              + Add custom interest
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                onKeyPress={handleCustomKeyPress}
                placeholder="Enter custom interest"
                className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#E85A50] focus:outline-none focus:ring-1 focus:ring-[#E85A50]"
                maxLength={20}
              />
              <button
                type="button"
                onClick={addCustomInterest}
                className="px-3 py-2 bg-[#E85A50] text-white text-sm rounded-lg hover:brightness-90"
                disabled={!customValue.trim()}
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomValue("");
                }}
                className="px-3 py-2 bg-zinc-200 text-zinc-700 text-sm rounded-lg hover:bg-zinc-300"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}