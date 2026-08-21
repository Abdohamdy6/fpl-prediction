import type { Metadata } from "next";
import "./../styles/globals.css";
import Navigation from "@/components/navbar/Navigation";
import AuthProvider from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "Premier League Predictor — Match Outcome & Score Predictions",
  description: "Predict English Premier League match scores, earn points, climb the global leaderboards, and compete with friends in private mini-leagues.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen text-white antialiased flex flex-col justify-between"
        suppressHydrationWarning
      >
        <div className="ambient-glow-purple" />
        <AuthProvider>
          <Navigation />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 relative z-10">
            {children}
          </main>
          <footer className="border-t border-pl-purple-light/40 bg-pl-purple-deepest/90 backdrop-blur-md py-6 text-center text-xs text-slate-300 relative z-10">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span suppressHydrationWarning>
                © 2026 Premier League Predictor. Powered by internal Premier League data feeds.
              </span>
              <div className="flex items-center gap-4 text-slate-300 font-semibold">
                <span className="text-pl-green">Exact Hit: +3 PTS</span>
                <span>•</span>
                <span className="text-pl-cyan">Correct Outcome: +1 PT</span>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
