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
    <div className="flex min-h-[85vh] items-center justify-center py-8 px-2 pb-24 sm:pb-12">
      <div className="pl-card w-full max-w-md sm:max-w-lg rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-800">
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-[#00FF85] text-[#080B11] font-display text-2xl font-black shadow-md">
            PL
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
            Create Predictor Account
          </h1>
          <p className="mt-1 text-xs text-slate-400 font-semibold">
            Join thousands of fans competing across all 38 Premier League matchweeks
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
              Predictor Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. SakaKing10"
              className="w-full rounded-xl border border-slate-700 bg-[#0b0f17] px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-[#00FF85] focus:outline-none focus:ring-1 focus:ring-[#00FF85]"
            />
          </div>

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

          {/* Favorite Club Selector */}
          {clubs.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Select Supported Club
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-40 overflow-y-auto p-2.5 rounded-xl bg-[#0b0f17] border border-slate-800">
                {clubs.map((club) => {
                  const isSelected = favoriteClubId === club.id;
                  return (
                    <button
                      key={club.id}
                      type="button"
                      onClick={() => setFavoriteClubId(club.id)}
                      className={`relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#00FF85] bg-[#00FF85]/10 shadow-md ring-1 ring-[#00FF85]"
                          : "border-slate-800 bg-[#121824] hover:border-slate-700"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#00FF85] text-[#080B11] font-bold">
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                      )}
                      <img
                        src={club.crestUrl}
                        alt={club.name}
                        className="h-7 w-7 sm:h-8 sm:w-8 object-contain shrink-0 filter drop-shadow"
                      />
                      <span className="mt-1 text-[9px] sm:text-[10px] font-bold text-slate-300 truncate w-full text-center">
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
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00FF85] py-3 text-xs sm:text-sm font-black text-[#080B11] hover:bg-[#00e676] transition-all shadow-md active:scale-95 disabled:opacity-50 mt-3 cursor-pointer"
          >
            {loading ? (
              <span>Creating your account...</span>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Sign Up & Start Predicting
              </>
            )}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-800 pt-4 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[#00FF85] hover:underline cursor-pointer">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
