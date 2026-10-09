import type { ReactNode } from 'react';

interface GameFrameProps {
  children: ReactNode;
}

export const GameFrame: React.FC<GameFrameProps> = ({ children }) => {
  return (
    <div className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden p-2 sm:p-4 md:p-6 select-none">
      {/* 
        Phone Frame Container:
        Locked strictly to fixed 9:16 aspect ratio on BOTH mobile and desktop/web view.
        Surrounded by a seamless 360-degree rotating colorful neon border.
      */}
      <div className="phone-frame-container flex items-center justify-center">
        {/* Main 9:16 mobile display */}
        <main
          id="game-viewport"
          style={{ backgroundColor: '#080c1e' }}
          className="relative bg-[#080c1e] overflow-hidden 
                     flex flex-col touch-none overscroll-none z-10"
          role="region"
          aria-label="Flag Quiz Game Screen"
        >
          {/* Dynamic Island / Smartphone speaker camera punch pill */}
          <div className="hidden sm:flex absolute top-2.5 left-1/2 -translate-x-1/2 z-50 pointer-events-none items-center justify-center">
            <div className="w-24 h-4 bg-slate-950/95 rounded-full border border-slate-700/60 flex items-center justify-center gap-2 shadow-inner">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-600/70" />
            </div>
          </div>

          {/* Inner Game Content */}
          <div className="relative w-full h-full flex flex-col overflow-hidden z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
