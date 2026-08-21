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
      <span className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold bg-slate-800/80 text-slate-400 border border-slate-700">
        <Clock className="h-3 w-3" />
        Syncing...
      </span>
    );
  }

  if (status === "IN_PLAY") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-rose-500/20 px-2.5 py-0.5 text-[10px] sm:text-xs font-bold text-rose-400 border border-rose-500/40 animate-pulse">
        <Radio className="h-3 w-3 animate-spin" />
        LIVE IN PLAY
      </span>
    );
  }

  if (status === "FINISHED") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-slate-800/90 px-2.5 py-0.5 text-[10px] sm:text-xs font-bold text-slate-300 border border-slate-700">
        FULL TIME
      </span>
    );
  }

  if (timeLeft.isPast) {
    return (
      <span className="flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] sm:text-xs font-bold text-slate-500 border border-slate-800">
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
        "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] sm:text-xs font-bold border transition-colors tabular-nums",
        isUrgent
          ? "bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse"
          : "bg-[#101622] text-[#00FF85] border-slate-700/80"
      )}
    >
      <Clock className="h-3 w-3" />
      LOCKS IN: {timeString}
    </span>
  );
}
