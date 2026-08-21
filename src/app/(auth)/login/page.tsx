"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error || "Invalid login credentials.");
      } else {
        router.push("/predict");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center py-8 px-2 pb-24 sm:pb-12">
      <div className="pl-card w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-800">
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-[#00FF85] text-[#080B11] font-display text-2xl font-black shadow-md">
            PL
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
            Welcome Back
          </h1>
          <p className="mt-1 text-xs text-slate-400 font-semibold">
            Sign in to submit and track your Premier League predictions
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 p-3 text-xs font-bold text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-700 bg-[#0b0f17] px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-[#00FF85] focus:outline-none focus:ring-1 focus:ring-[#00FF85]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-700 bg-[#0b0f17] px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-[#00FF85] focus:outline-none focus:ring-1 focus:ring-[#00FF85]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00FF85] py-3 text-xs sm:text-sm font-black text-[#080B11] hover:bg-[#00e676] transition-all shadow-md active:scale-95 disabled:opacity-50 mt-3 cursor-pointer"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Sign In & Predict
              </>
            )}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-800 pt-4 text-center text-xs text-slate-400">
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="font-bold text-[#00FF85] hover:underline cursor-pointer">
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
}
