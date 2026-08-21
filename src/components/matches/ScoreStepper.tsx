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

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= 0}
          aria-label={`Decrease ${teamName} score`}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg border border-pl-purple-light bg-pl-purple-deeper text-white font-bold transition-all active:scale-95",
            disabled || value <= 0
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-pl-purple-light hover:border-pl-green/50 hover:text-pl-green"
          )}
        >
          <Minus className="h-4 w-4" />
        </button>

        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl border font-display text-2xl font-bold transition-all shadow-inner",
            disabled
              ? "border-slate-800 bg-pl-purple-deepest/80 text-slate-400"
              : "border-pl-purple-light bg-pl-purple-dark text-white glow-green"
          )}
        >
          {disabled && <Lock className="h-3 w-3 absolute -top-1 -right-1 text-slate-500" />}
          {value}
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || value >= 20}
          aria-label={`Increase ${teamName} score`}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg border border-pl-purple-light bg-pl-purple-deeper text-white font-bold transition-all active:scale-95",
            disabled || value >= 20
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-pl-purple-light hover:border-pl-green/50 hover:text-pl-green"
          )}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
