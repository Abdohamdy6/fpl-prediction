"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Trophy, ArrowRight, Zap, ShieldCheck, Target, Sparkles, UserPlus } from "lucide-react";

export default function HomePage() {
  const { data: session } = useSession();

  // If user is logged in, send to /predict; otherwise send to /register
  const predictLink = session?.user ? "/predict" : "/register";

  return (
    <div className="flex flex-col items-center gap-16 py-8">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center max-w-4xl mx-auto pt-6 pb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-pl-purple-light/80 bg-pl-purple-deeper/90 px-4 py-1.5 text-xs font-bold text-pl-green uppercase tracking-widest mb-6 shadow-lg backdrop-blur-md">
          <Zap className="h-3.5 w-3.5 text-pl-green animate-pulse" />
          Live Premier League 2026/27 Predictions
        </div>

        <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight uppercase leading-[0.95] text-white">
          PREDICT EVERY <span className="text-pl-green glow-text-green">GOAL.</span>
          <br />
          RULE THE <span className="text-pl-pink glow-text-pink">LEAGUE.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
          Test your Premier League knowledge gameweek by gameweek. Predict exact match scorelines, earn points, climb the global rankings, and challenge your friends in private mini-leagues.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href={predictLink}
            className="flex items-center gap-2 rounded-xl bg-pl-green px-8 py-3.5 text-base font-extrabold text-pl-purple-deepest hover:bg-pl-green-hover transition-all glow-green active:scale-95 shadow-xl"
          >
            {session?.user ? (
              <>
                Go to Predictions
                <ArrowRight className="h-5 w-5" />
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5" />
                Start Predicting (Create Free Account)
              </>
            )}
          </Link>
          <Link
            href="/leaderboard"
            className="flex items-center gap-2 rounded-xl border border-pl-purple-light/80 bg-pl-purple-deeper/80 px-6 py-3.5 text-base font-semibold text-white hover:bg-pl-purple-light transition-all backdrop-blur-sm"
          >
            <Trophy className="h-5 w-5 text-pl-gold" />
            Global Standings
          </Link>
        </div>
      </section>

      {/* Rules & Scoring Matrix Strip */}
      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="pl-card rounded-2xl p-6 relative overflow-hidden">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-pl-green/15 border border-pl-green/40 text-pl-green font-display text-2xl font-bold shadow-inner">
            3
          </div>
          <h3 className="font-display text-xl font-bold uppercase tracking-wider text-white">
            Exact Scoreline Hit
          </h3>
          <p className="mt-2 text-sm text-slate-300">
            Predict the exact final scoreline (e.g. 2-1) and bank the maximum 3 points for that fixture.
          </p>
        </div>

        <div className="pl-card rounded-2xl p-6 relative overflow-hidden">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-pl-cyan/15 border border-pl-cyan/40 text-pl-cyan font-display text-2xl font-bold shadow-inner">
            1
          </div>
          <h3 className="font-display text-xl font-bold uppercase tracking-wider text-white">
            Correct Outcome
          </h3>
          <p className="mt-2 text-sm text-slate-300">
            Predict the right winner or draw (e.g. predicted 1-0, actual 3-1) to secure 1 point.
          </p>
        </div>

        <div className="pl-card rounded-2xl p-6 relative overflow-hidden">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-pl-pink/15 border border-pl-pink/40 text-pl-pink font-display text-2xl font-bold shadow-inner">
            🔒
          </div>
          <h3 className="font-display text-xl font-bold uppercase tracking-wider text-white">
            Kickoff Auto-Lock
          </h3>
          <p className="mt-2 text-sm text-slate-300">
            Predictions lock automatically the exact second each individual match kicks off.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full rounded-3xl border border-pl-purple-light/50 bg-gradient-to-b from-pl-purple-deeper/95 to-pl-purple-deepest/95 p-8 sm:p-12 shadow-2xl backdrop-blur-md">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-wider text-white">
            HOW IT WORKS
          </h2>
          <p className="mt-2 text-sm text-slate-300">Compete across all 38 Premier League gameweeks in 3 simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-pl-purple-dark border border-pl-purple-light/60 text-pl-green font-display text-3xl font-extrabold shadow-inner">
              01
            </div>
            <h4 className="font-display text-xl font-bold text-white uppercase">Make Your Picks</h4>
            <p className="mt-2 text-sm text-slate-300">
              Submit your predicted home and away scores for all 10 fixtures in the upcoming gameweek.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-pl-purple-dark border border-pl-purple-light/60 text-pl-cyan font-display text-3xl font-extrabold shadow-inner">
              02
            </div>
            <h4 className="font-display text-xl font-bold text-white uppercase">Track Live Action</h4>
            <p className="mt-2 text-sm text-slate-300">
              Watch matches live as real-time scores feed in and prediction points settle automatically.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-pl-purple-dark border border-pl-purple-light/60 text-pl-pink font-display text-3xl font-extrabold shadow-inner">
              03
            </div>
            <h4 className="font-display text-xl font-bold text-white uppercase">Climb & Brag</h4>
            <p className="mt-2 text-sm text-slate-300">
              Outscore your mates in private mini-leagues and see your name rise on the global leaderboard.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
