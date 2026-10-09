export const GlobeFallback = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Deep cosmic gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#090b1c] via-[#0d1333] to-[#080918]" />

      {/* Atmospheric glowing sphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-gradient-to-tr from-[#14235a] via-[#1d4ed8] to-[#38bdf8] opacity-40 blur-[40px] animate-pulse" />

      {/* Styled vector stylized globe */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full border border-sky-400/20 shadow-[0_0_80px_rgba(56,189,248,0.25)] flex items-center justify-center opacity-60">
        <div className="w-[240px] h-[240px] rounded-full border border-blue-500/30 animate-spin" style={{ animationDuration: '40s' }}>
          <div className="w-full h-full rounded-full border-t border-sky-300/40" />
        </div>
      </div>

      {/* Floating particles */}
      <div className="starfield-css" />
    </div>
  );
};
