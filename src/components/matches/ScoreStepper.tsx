"use client";

import { Minus, Plus, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreStepperProps {
  value: number;
  onChange: (val: number) => void;
  disabled?: boolean;
  teamName: string;
}

export default function ScoreStepper({
  value,
  onChange,
  disabled = false,
  teamName,
}: ScoreStepperProps) {
  const handleDecrement = () => {
    if (disabled || value <= 0) return;
    onChange(value - 1);
  };

  const handleIncrement = () => {
    if (disabled || value >= 20) return;
    onChange(value + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const raw = e.target.value;
    if (raw === "") {
      onChange(0);
      return;
    }
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 20) {
      onChange(parsed);
    }
  };

  return (
    <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2 select-none">
      {/* Minus Button */}
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || value <= 0}
        aria-label={`Decrease ${teamName} score`}
        className={cn(
          "flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border transition-all active:scale-95 shadow-sm",
          disabled || value <= 0
            ? "border-slate-800 bg-[#0d121c] text-slate-600 opacity-40 cursor-not-allowed"
            : "border-slate-700 bg-[#121824] text-white hover:bg-slate-700 hover:border-slate-500 cursor-pointer"
        )}
      >
        <Minus className="h-4 w-4 stroke-[2.5]" />
      </button>

      {/* Digital Score Input Display */}
      <div className="relative">
        <input
          type="number"
          min={0}
          max={20}
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
          aria-label={`${teamName} predicted score`}
          className={cn(
            "h-10 w-12 sm:h-11 sm:w-14 rounded-xl border text-center font-display text-2xl sm:text-3xl font-black tabular-nums transition-all shadow-inner focus:outline-none",
            disabled
              ? "border-slate-800 bg-[#0a0e16] text-slate-500 cursor-not-allowed"
              : "border-slate-700 bg-[#0b0f17] text-white focus:border-[#00FF85] focus:ring-2 focus:ring-[#00FF85]/20"
          )}
        />
        {disabled && (
          <Lock className="h-3 w-3 absolute top-1.5 right-1.5 text-slate-500 pointer-events-none" />
        )}
      </div>

      {/* Plus Button */}
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || value >= 20}
        aria-label={`Increase ${teamName} score`}
        className={cn(
          "flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border transition-all active:scale-95 shadow-sm",
          disabled || value >= 20
            ? "border-slate-800 bg-[#0d121c] text-slate-600 opacity-40 cursor-not-allowed"
            : "border-slate-700 bg-[#121824] text-white hover:bg-slate-700 hover:border-slate-500 cursor-pointer"
        )}
      >
        <Plus className="h-4 w-4 stroke-[2.5]" />
      </button>
    </div>
  );
}
