"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, AlertCircle, Check } from "lucide-react";

interface Club {
  id: string;
  name: string;
  abbr: string;
  crestUrl: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [favoriteClubId, setFavoriteClubId] = useState("");
  const [clubs, setClubs] = useState<Club[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/proxy/clubs")
      .then((res) => res.json())
      .then((data) => {
        if (data.clubs) setClubs(data.clubs);
      })
      .catch((err) => console.error("Failed to load clubs:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          favoriteClubId: favoriteClubId || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to register account");
      }

      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center py-10">
      <div className="pl-card w-full max-w-lg rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-pl-purple-accent to-pl-pink text-white font-display text-2xl font-bold shadow-lg">
            PL
          </div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wider text-white">
            Create Predictor Account
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Join thousands of fans competing across all 38 matchweeks
          </p>
        </div>

        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. SakaKing10"
              className="w-full rounded-xl border border-pl-purple-light bg-pl-purple-deepest px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-pl-green focus:outline-none focus:ring-1 focus:ring-pl-green"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-pl-purple-light bg-pl-purple-deepest px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-pl-green focus:outline-none focus:ring-1 focus:ring-pl-green"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-pl-purple-light bg-pl-purple-deepest px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-pl-green focus:outline-none focus:ring-1 focus:ring-pl-green"
            />
          </div>

          {/* Favorite Club Selector */}
          {clubs.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Select Your Favorite Club
              </label>
              <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto p-2 rounded-xl bg-pl-purple-deepest border border-pl-purple-light/50">
                {clubs.map((club) => {
                  const isSelected = favoriteClubId === club.id;
                  return (
                    <button
                      key={club.id}
                      type="button"
                      onClick={() => setFavoriteClubId(club.id)}
                      className={`relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                        isSelected
                          ? "border-pl-green bg-pl-green/10 glow-green"
                          : "border-transparent hover:border-pl-purple-light hover:bg-pl-purple-dark"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pl-green text-pl-purple-deepest">
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <img
                        src={club.crestUrl}
                        alt={club.name}
                        className="h-8 w-8 object-contain"
                      />
                      <span className="mt-1 text-[10px] font-bold text-slate-300 truncate w-full text-center">
                        {club.abbr}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-pl-green py-3 text-sm font-bold text-pl-purple-deepest hover:bg-pl-green-hover transition-all glow-green active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <span>Creating account...</span>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Sign Up & Start Predicting
              </>
            )}
          </button>
        </form>

        <div className="mt-6 border-t border-pl-purple-light/40 pt-4 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-pl-green hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
