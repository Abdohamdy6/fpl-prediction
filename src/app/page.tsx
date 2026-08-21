"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Trophy, ArrowRight, Zap, Target, Award, ListOrdered, Users, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  const { data: session } = useSession();
  const predictLink = session?.user ? "/predict" : "/register";

  const [demoHome, setDemoHome] = useState(2);
  const [demoAway, setDemoAway] = useState(1);

  return (
    <div className="flex flex-col items-center gap-12 sm:gap-16 py-6 sm:py-10">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center max-w-4xl mx-auto pt-2 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#00FF85]/30 bg-[#00FF85]/10 px-4 py-1.5 text-xs font-bold text-[#00FF85] uppercase tracking-wider mb-6 shadow-sm backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-[#00FF85] animate-ping" />
          Premier League 2026/27 Predictions Live
        </div>

        <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight uppercase leading-[0.95] text-white">
          PREDICT EVERY <span className="text-[#00FF85]">GOAL.</span>
          <br />
          RULE THE <span className="text-[#E90052]">LEAGUE.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
          Test your Premier League knowledge gameweek by gameweek. Predict exact match scorelines, earn points, climb the global rankings, and challenge your mates in private mini-leagues.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
          <Link
            href={predictLink}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#00FF85] px-8 py-3.5 text-base font-black text-[#080B11] hover:bg-[#00e676] transition-all shadow-xl active:scale-95 cursor-pointer"
          >
            {session?.user ? (
              <>
                Open Predictions
                <ArrowRight className="h-5 w-5" />
              </>
            ) : (
              <>
                <Zap className="h-5 w-5" />
                Start Predicting — Play Free
              </>
            )}
          </Link>
          <Link
            href="/season-table"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-700 bg-[#121824] px-6 py-3.5 text-base font-bold text-white hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
          >
            <ListOrdered className="h-5 w-5 text-sky-400" />
            1st–20th Table Predictor
          </Link>
        </div>
      </section>

      {/* Interactive Quick Pick Demo Widget */}
      <section className="w-full max-w-2xl pl-card rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="text-center mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#00FF85]">Interactive Demo</span>
          <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-white mt-1">
            How Scoring Works
          </h2>
          <p className="text-xs text-slate-400 mt-1">Adjust the scoreline to test live scoring calculation</p>
        </div>

        <div className="grid grid-cols-2 gap-3 items-center mb-5">
          <div className="flex flex-col items-center p-3.5 rounded-xl bg-[#0b0f17] border border-slate-800">
            <span className="font-display text-base font-bold text-white mb-2">ARSENAL</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDemoHome((p) => Math.max(0, p - 1))}
                className="h-8 w-8 rounded-lg bg-[#121824] border border-slate-700 text-white font-bold flex items-center justify-center hover:bg-slate-700 cursor-pointer"
              >
                -
              </button>
              <span className="font-display text-3xl font-black text-white w-8 text-center tabular-nums">
                {demoHome}
              </span>
              <button
                type="button"
                onClick={() => setDemoHome((p) => p + 1)}
                className="h-8 w-8 rounded-lg bg-[#121824] border border-slate-700 text-white font-bold flex items-center justify-center hover:bg-slate-700 cursor-pointer"
              >
                +
              </button>
            </div>
            <span className="text-[10px] font-bold text-[#00FF85] uppercase mt-2">HOME</span>
          </div>

          <div className="flex flex-col items-center p-3.5 rounded-xl bg-[#0b0f17] border border-slate-800">
            <span className="font-display text-base font-bold text-white mb-2">CHELSEA</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDemoAway((p) => Math.max(0, p - 1))}
                className="h-8 w-8 rounded-lg bg-[#121824] border border-slate-700 text-white font-bold flex items-center justify-center hover:bg-slate-700 cursor-pointer"
              >
                -
              </button>
              <span className="font-display text-3xl font-black text-white w-8 text-center tabular-nums">
                {demoAway}
              </span>
              <button
                type="button"
                onClick={() => setDemoAway((p) => p + 1)}
                className="h-8 w-8 rounded-lg bg-[#121824] border border-slate-700 text-white font-bold flex items-center justify-center hover:bg-slate-700 cursor-pointer"
              >
                +
              </button>
            </div>
            <span className="text-[10px] font-bold text-[#E90052] uppercase mt-2">AWAY</span>
          </div>
        </div>

        {/* Demo Result Badge */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0d121c] border border-slate-800 text-white">
          <div className="flex items-center gap-2.5">
            <Target className="h-5 w-5 text-[#00FF85] shrink-0" />
            <div>
              <span className="text-xs font-bold block">
                Predicted Score: <span className="text-[#00FF85] font-display text-base font-black">{demoHome} - {demoAway}</span>
              </span>
              <span className="text-[11px] text-slate-400">
                {demoHome === demoAway
                  ? "Draw predicted • Awarded 3 PTS on exact match, 1 PT for any draw."
                  : demoHome > demoAway
                  ? "Arsenal win predicted • Awarded 3 PTS on exact score, 1 PT for Arsenal win."
                  : "Chelsea win predicted • Awarded 3 PTS on exact score, 1 PT for Chelsea win."}
              </span>
            </div>
          </div>
          <Link
            href={predictLink}
            className="shrink-0 rounded-lg bg-[#00FF85] px-3.5 py-1.5 text-xs font-black text-[#080B11] hover:bg-[#00e676] transition-colors cursor-pointer"
          >
            Predict Real Matches →
          </Link>
        </div>
      </section>

      {/* Rules & Scoring Matrix Strip */}
      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        <div className="pl-card rounded-2xl p-6 relative overflow-hidden border-t-4 border-t-emerald-500 shadow-md">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 font-display text-2xl font-black">
            3
          </div>
          <h3 className="font-display text-xl font-bold uppercase tracking-wider text-white">
            Exact Scoreline Hit
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
            Nail the exact final scoreline (e.g. 2-1) and bank the maximum 3 points for that fixture.
          </p>
        </div>

        <div className="pl-card rounded-2xl p-6 relative overflow-hidden border-t-4 border-t-sky-500 shadow-md">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400 font-display text-2xl font-black">
            1
          </div>
          <h3 className="font-display text-xl font-bold uppercase tracking-wider text-white">
            Correct Outcome
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
            Pick the right match outcome (Home Win, Away Win, or Draw) to secure 1 solid point.
          </p>
        </div>

        <div className="pl-card rounded-2xl p-6 relative overflow-hidden border-t-4 border-t-amber-500 shadow-md">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 font-display text-2xl font-black">
            10
          </div>
          <h3 className="font-display text-xl font-bold uppercase tracking-wider text-white">
            Season Table Bonus
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
            Rank all 20 clubs 1st to 20th before GW1 kickoff to earn up to 200+ bonus points at season end!
          </p>
        </div>
      </section>

      {/* 3-Step Walkthrough */}
      <section className="w-full rounded-2xl border border-slate-800 bg-[#0d121c]/80 p-6 sm:p-10 shadow-lg">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#00FF85]">Game Flow</span>
          <h2 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-wider text-white mt-1">
            COMPETE IN 3 SIMPLE STEPS
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">Everything runs automatically with live Premier League official feeds</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-[#080B11] border border-slate-800">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#00FF85] text-[#080B11] font-display text-2xl font-black shadow-sm">
              01
            </div>
            <h4 className="font-display text-lg font-bold text-white uppercase">Lock In Predictions</h4>
            <p className="mt-1 text-xs text-slate-400">
              Submit your predicted scorelines for all 10 fixtures before each individual kickoff.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-[#080B11] border border-slate-800">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-400 text-[#080B11] font-display text-2xl font-black shadow-sm">
              02
            </div>
            <h4 className="font-display text-lg font-bold text-white uppercase">Track Real-Time Action</h4>
            <p className="mt-1 text-xs text-slate-400">
              Watch fixtures unfold live as real-time goal feeds update points dynamically.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-[#080B11] border border-slate-800">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E90052] text-white font-display text-2xl font-black shadow-sm">
              03
            </div>
            <h4 className="font-display text-lg font-bold text-white uppercase">Climb The Standings</h4>
            <p className="mt-1 text-xs text-slate-400">
              Win bragging rights in your private friend leagues and rise to the Global Top 10.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
