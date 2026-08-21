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
    <div className="flex min-h-[75vh] items-center justify-center py-6 px-2 pb-24 sm:pb-12">
      <div className="pl-card w-full max-w-md rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl">
        <div className="text-center mb-6 sm:mb-8">
          <div className="mx-auto mb-2.5 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-pl-purple-accent to-pl-pink text-white font-display text-xl sm:text-2xl font-bold shadow-lg">
            PL
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
            Welcome Back
          </h1>
          <p className="mt-1 text-[11px] sm:text-xs text-slate-300">
            Sign in to submit your Premier League match predictions
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 p-2.5 sm:p-3 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-pl-purple-light bg-pl-purple-deepest px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-pl-green focus:outline-none focus:ring-1 focus:ring-pl-green"
            />
          </div>

          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-pl-purple-light bg-pl-purple-deepest px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-pl-green focus:outline-none focus:ring-1 focus:ring-pl-green"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-pl-green py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-pl-purple-deepest hover:bg-pl-green-hover transition-all glow-green active:scale-95 disabled:opacity-50 shadow-md mt-2"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-5 border-t border-pl-purple-light/40 pt-3 text-center text-xs text-slate-400">
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="font-bold text-pl-green hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
