"use client";

export default function StadiumCanvasBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {/* Layer 1: Rich Multi-Color Fancy Dark Background Gradients */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 10% 10%, rgba(85, 0, 102, 0.45) 0%, transparent 60%),
            radial-gradient(ellipse 65% 45% at 90% 15%, rgba(0, 140, 75, 0.35) 0%, transparent 55%),
            radial-gradient(ellipse 80% 60% at 50% 45%, rgba(15, 23, 50, 0.6) 0%, transparent 65%),
            radial-gradient(ellipse 60% 50% at 85% 85%, rgba(200, 0, 70, 0.25) 0%, transparent 60%),
            radial-gradient(ellipse 70% 55% at 15% 90%, rgba(0, 160, 120, 0.25) 0%, transparent 60%),
            linear-gradient(170deg, #13001c 0%, #09101d 40%, #061915 80%, #03110d 100%)
          `,
        }}
      />

      {/* Layer 2: Subtle Luminous Light Beams / Stadium Glow Cones */}
      <div
        className="absolute top-0 left-0 w-full h-[500px] opacity-40"
        style={{
          background: "radial-gradient(circle at 50% -10%, rgba(0, 255, 133, 0.2) 0%, rgba(233, 0, 82, 0.1) 40%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Layer 3: Canva-Style High-Definition Sports Vector Art */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Dot Grid Pattern */}
          <pattern id="canva-dots" width="36" height="36" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="rgba(0, 255, 133, 0.2)" />
            <circle cx="20" cy="20" r="1" fill="rgba(233, 0, 82, 0.15)" />
          </pattern>

          {/* Isometric Line Grid */}
          <pattern id="canva-grid" width="72" height="72" patternUnits="userSpaceOnUse">
            <path d="M 72 0 L 0 0 0 72" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
          </pattern>

          {/* Gradients for Vector Lines */}
          <linearGradient id="mint-cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00FF85" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#04F5FF" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="pink-purple-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E90052" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#9333EA" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Fill Background Patterns */}
        <rect width="100%" height="100%" fill="url(#canva-grid)" />
        <rect width="100%" height="100%" fill="url(#canva-dots)" />

        {/* Tactical Pitch Center Circle (Top-Left) */}
        <g transform="translate(90, 110)">
          <circle cx="0" cy="0" r="130" stroke="url(#mint-cyan-grad)" strokeWidth="1.5" strokeDasharray="6 4" fill="rgba(0, 255, 133, 0.02)" />
          <circle cx="0" cy="0" r="5" fill="#00FF85" />
          <line x1="-180" y1="0" x2="180" y2="0" stroke="url(#mint-cyan-grad)" strokeWidth="1" strokeDasharray="8 6" />
          {/* Tactical pass arc with arrow */}
          <path d="M -90 70 Q 10 160 120 50" stroke="#00FF85" strokeWidth="2" fill="none" strokeOpacity="0.7" />
          <polygon points="120,50 108,58 114,44" fill="#00FF85" />
        </g>

        {/* Tactical Penalty Area Box & Arc (Top-Right) */}
        <g transform="translate(1180, 160)">
          <rect x="-160" y="-90" width="320" height="180" rx="10" stroke="url(#pink-purple-grad)" strokeWidth="1.5" fill="rgba(233, 0, 82, 0.02)" />
          <path d="M -90 90 A 70 70 0 0 1 90 90" stroke="#E90052" strokeWidth="2" strokeDasharray="6 6" fill="none" strokeOpacity="0.6" />
          <circle cx="0" cy="35" r="4" fill="#E90052" />
          {/* Canva Crosshair Markers */}
          <path d="M -190 -110 L -170 -110 M -180 -120 L -180 -100" stroke="#FFD700" strokeWidth="1.5" strokeOpacity="0.6" />
          <path d="M 170 -110 L 190 -110 M 180 -120 L 180 -100" stroke="#FFD700" strokeWidth="1.5" strokeOpacity="0.6" />
        </g>

        {/* Dynamic Curved Match Trajectory (Mid-Screen) */}
        <g fill="none">
          <path d="M 80 620 C 350 480, 650 740, 1150 560" stroke="url(#mint-cyan-grad)" strokeWidth="1.5" strokeDasharray="10 6" strokeOpacity="0.45" />
          <circle cx="650" cy="630" r="8" stroke="#00FF85" strokeWidth="1.5" fill="rgba(0, 255, 133, 0.3)" />
          <circle cx="1150" cy="560" r="5" fill="#00FF85" />
        </g>

        {/* Bottom Decorative Technical Crosshairs & Coordinates */}
        <g transform="translate(120, 850)" stroke="rgba(0, 255, 133, 0.3)" strokeWidth="1" fill="none">
          <line x1="-25" y1="0" x2="25" y2="0" />
          <line x1="0" y1="-25" x2="0" y2="25" />
          <circle cx="0" cy="0" r="35" strokeDasharray="4 4" />
          <text x="45" y="5" fill="rgba(0, 255, 133, 0.5)" fontSize="11" fontFamily="monospace" fontWeight="bold">
            PREMIER LEAGUE TACTICAL MATRIX • 2026/27
          </text>
        </g>

        <g transform="translate(1280, 780)" stroke="rgba(233, 0, 82, 0.35)" strokeWidth="1" fill="none">
          <line x1="-25" y1="0" x2="25" y2="0" />
          <line x1="0" y1="-25" x2="0" y2="25" />
          <rect x="-28" y="-28" width="56" height="56" rx="8" strokeDasharray="5 5" />
        </g>
      </svg>
    </div>
  );
}
