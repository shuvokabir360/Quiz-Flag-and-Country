export const DesktopBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 select-none">
      {/* Deep vibrant rich base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, #110d33 0%, #0c0926 40%, #070716 100%)',
        }}
      />

      {/* Top-Left: Vivid Neon Fuchsia / Electric Purple Orb */}
      <div
        className="absolute -top-[10%] -left-[10%] w-[55vw] h-[55vw] rounded-full opacity-70 blur-[90px]"
        style={{
          background:
            'radial-gradient(circle, #ec4899 0%, #a855f7 40%, #6366f1 70%, transparent 100%)',
          animation: 'floatSlow 14s ease-in-out infinite alternate',
        }}
      />

      {/* Top-Right: Vibrant Electric Cyan / Sky Blue Orb */}
      <div
        className="absolute -top-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full opacity-70 blur-[90px]"
        style={{
          background:
            'radial-gradient(circle, #00f0ff 0%, #0ea5e9 40%, #3b82f6 70%, transparent 100%)',
          animation: 'floatSlow 16s ease-in-out infinite alternate-reverse',
        }}
      />

      {/* Bottom-Left: Fiery Amber / Warm Sunset Orb */}
      <div
        className="absolute -bottom-[15%] -left-[10%] w-[50vw] h-[50vw] rounded-full opacity-65 blur-[100px]"
        style={{
          background:
            'radial-gradient(circle, #fbbf24 0%, #f97316 40%, #ef4444 70%, transparent 100%)',
          animation: 'floatSlow 18s ease-in-out infinite alternate',
        }}
      />

      {/* Bottom-Right: Neon Emerald / Turquoise Orb */}
      <div
        className="absolute -bottom-[15%] -right-[10%] w-[55vw] h-[55vw] rounded-full opacity-65 blur-[100px]"
        style={{
          background:
            'radial-gradient(circle, #10b981 0%, #06b6d4 40%, #4f46e5 75%, transparent 100%)',
          animation: 'floatSlow 20s ease-in-out infinite alternate-reverse',
        }}
      />

      {/* Center Aura: Multi-colored rotating neon halo behind the mobile frame */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[920px] rounded-[56px] opacity-40 blur-[70px]"
        style={{
          background:
            'conic-gradient(from 0deg, #ff007f, #8b5cf6, #00f0ff, #10b981, #f59e0b, #ff007f)',
          animation: 'rotateConic 12s linear infinite',
        }}
      />

      {/* Floating decorative ambient light rings on desktop sides */}
      <div className="hidden lg:block absolute top-[25%] left-[8%] w-36 h-36 rounded-full border border-pink-500/30 opacity-40 animate-pulse blur-[1px]" />
      <div className="hidden lg:block absolute bottom-[25%] right-[8%] w-44 h-44 rounded-full border border-cyan-400/30 opacity-40 animate-pulse blur-[1px]" />

      {/* Drifting star grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

      {/* Desktop Branding Watermarks */}
      <div className="hidden lg:flex absolute bottom-6 left-8 flex-col gap-1 text-slate-300/70 text-xs font-bold uppercase tracking-widest select-none">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-sky-400 font-black text-sm">
          WORLD FLAG QUIZ
        </span>
        <span className="text-[11px] text-slate-400/80">9:16 Social Recording Format</span>
      </div>

      <div className="hidden lg:flex absolute bottom-6 right-8 flex-col items-end gap-1 text-slate-300/70 text-xs font-bold tracking-wider select-none">
        <span className="text-amber-400 font-black text-sm">195 Sovereign Countries</span>
        <span className="text-[11px] text-slate-400/80">TikTok • Reels • Shorts Ready</span>
      </div>
    </div>
  );
};
