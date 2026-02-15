"use client";

interface RangeSliderProps {
  label: string;
  min: number;
  max: number;
  minValue: number;
  maxValue: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  error?: string;
}

export function RangeSlider({
  label,
  min,
  max,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  error,
}: RangeSliderProps) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onMinChange(Math.min(value, maxValue - 1));
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onMaxChange(Math.max(value, minValue + 1));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-zinc-700">
        {label}
      </label>
      <div className="flex justify-between text-xs text-zinc-500 mb-1">
        <span>Min: {minValue}</span>
        <span>Max: {maxValue}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-zinc-500 mb-1">Min age</p>
          <input
            type="range"
            min={min}
            max={max}
            value={minValue}
            onChange={handleMinChange}
            className="w-full h-2 rounded-lg appearance-none bg-zinc-200 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#E85A50] [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>
        <div>
          <p className="text-xs text-zinc-500 mb-1">Max age</p>
          <input
            type="range"
            min={min}
            max={max}
            value={maxValue}
            onChange={handleMaxChange}
            className="w-full h-2 rounded-lg appearance-none bg-zinc-200 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#E85A50] [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}