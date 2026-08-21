"use client";

import { useState, useEffect } from "react";
import { Clock, Lock, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  kickoffTime: string | Date;
  status: string;
}

export default function CountdownTimer({ kickoffTime, status }: CountdownTimerProps) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    setMounted(true);
    const target = new Date(kickoffTime).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, isPast: false });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [kickoffTime]);

  if (!mounted) {
    return (
      <span className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold bg-pl-purple-dark text-slate-400 border border-slate-800">
        <Clock className="h-3 w-3" />
        LOADING...
      </span>
    );
  }

  if (status === "IN_PLAY") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-pl-pink/20 px-2.5 py-0.5 text-[10px] sm:text-xs font-bold text-pl-pink border border-pl-pink/40 animate-pulse">
        <Radio className="h-3 w-3 animate-spin" />
        LIVE IN PLAY
      </span>
    );
  }

  if (status === "FINISHED") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold text-slate-300 border border-slate-700">
        FULL TIME
      </span>
    );
  }

  if (timeLeft.isPast) {
    return (
      <span className="flex items-center gap-1 rounded-full bg-pl-purple-dark px-2.5 py-0.5 text-[10px] sm:text-xs font-medium text-slate-400 border border-slate-800">
        <Lock className="h-3 w-3 text-slate-500" />
        LOCKED
      </span>
    );
  }

  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 2;

  let timeString = "";
  if (timeLeft.days > 0) {
    timeString = `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`;
  } else if (timeLeft.hours > 0) {
    timeString = `${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`;
  } else {
    timeString = `${timeLeft.minutes}m ${timeLeft.seconds}s`;
  }

  return (
    <span
      className={cn(
        "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold border transition-colors",
        isUrgent
          ? "bg-pl-pink/15 text-pl-pink border-pl-pink/30 animate-pulse"
          : "bg-pl-purple-dark text-pl-green border-pl-green/30"
      )}
    >
      <Clock className="h-3 w-3" />
      LOCKS IN: {timeString}
    </span>
  );
}
