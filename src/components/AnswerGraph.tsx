import React from 'react';
import { motion } from 'framer-motion';
import type { QuizStats } from '../types/game';

interface AnswerGraphProps {
  stats: QuizStats;
  lastAnswerClicks?: number | null;
}

export const AnswerGraph: React.FC<AnswerGraphProps> = ({ stats, lastAnswerClicks }) => {
  const c1 = stats.oneClickCount ?? 0;
  const c2 = stats.twoClickCount ?? 0;
  const c3 = stats.threeClickCount ?? 0;
  const c4 = stats.fourClickCount ?? 0;
  const total = c1 + c2 + c3 + c4;

  const pct1 = total > 0 ? Math.round((c1 / total) * 100) : 0;
  const pct2 = total > 0 ? Math.round((c2 / total) * 100) : 0;
  const pct3 = total > 0 ? Math.round((c3 / total) * 100) : 0;
  const pct4 = total > 0 ? Math.round((c4 / total) * 100) : 0;

  const maxCount = Math.max(c1, c2, c3, c4, 1);

  const columns = [
    {
      clicks: 1,
      label: '1-Click',
      sublabel: '+10 PTS',
      count: c1,
      pct: pct1,
      colorText: 'text-amber-400',
      colorBg: 'bg-amber-400',
      borderClass: 'border-amber-500/40',
      gradient: 'from-amber-400 to-amber-500',
      glow: 'shadow-[0_0_12px_rgba(251,191,36,0.55)]',
      isLatest: lastAnswerClicks === 1,
    },
    {
      clicks: 2,
      label: '2-Click',
      sublabel: '+7 PTS',
      count: c2,
      pct: pct2,
      colorText: 'text-sky-400',
      colorBg: 'bg-sky-400',
      borderClass: 'border-sky-500/40',
      gradient: 'from-sky-400 to-sky-500',
      glow: 'shadow-[0_0_12px_rgba(56,189,248,0.55)]',
      isLatest: lastAnswerClicks === 2,
    },
    {
      clicks: 3,
      label: '3-Click',
      sublabel: '+5 PTS',
      count: c3,
      pct: pct3,
      colorText: 'text-purple-400',
      colorBg: 'bg-purple-400',
      borderClass: 'border-purple-500/40',
      gradient: 'from-purple-400 to-purple-500',
      glow: 'shadow-[0_0_12px_rgba(192,132,252,0.55)]',
      isLatest: lastAnswerClicks === 3,
    },
    {
      clicks: 4,
      label: '4-Click',
      sublabel: '+2 PTS',
      count: c4,
      pct: pct4,
      colorText: 'text-emerald-400',
      colorBg: 'bg-emerald-400',
      borderClass: 'border-emerald-500/40',
      gradient: 'from-emerald-400 to-emerald-500',
      glow: 'shadow-[0_0_12px_rgba(52,211,153,0.55)]',
      isLatest: lastAnswerClicks === 4,
    },
  ];

  return (
    <div className="w-full max-w-[420px] mx-auto px-4 pb-2 z-20">
      <div className="p-3 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-white/15 shadow-[0_12px_32px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col gap-2">
        {/* Header with Title and Total answers badge */}
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider px-1">
          <span className="flex items-center gap-1.5 text-amber-300">
            <span className="text-sm">📊</span>
            <span>ANSWER GRAPH</span>
          </span>
          <span className="text-white/90 font-bold text-[11px] bg-slate-800/90 px-2.5 py-0.5 rounded-full border border-white/15 shadow-sm">
            TOTAL ANSWERS: <span className="text-amber-300 font-black">{total}</span>
          </span>
        </div>

        {/* Multi-Segment Horizontal Stacked Bar */}
        <div className="w-full h-3 rounded-full bg-slate-800/90 overflow-hidden flex p-0.5 gap-0.5 border border-white/10 shadow-inner">
          {total === 0 ? (
            <div className="w-full h-full rounded-full bg-slate-700/40" />
          ) : (
            <>
              {c1 > 0 && (
                <div
                  style={{ width: `${(c1 / total) * 100}%` }}
                  className="h-full rounded-sm bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.6)] transition-all duration-500"
                />
              )}
              {c2 > 0 && (
                <div
                  style={{ width: `${(c2 / total) * 100}%` }}
                  className="h-full rounded-sm bg-gradient-to-r from-sky-400 to-sky-500 shadow-[0_0_8px_rgba(56,189,248,0.6)] transition-all duration-500"
                />
              )}
              {c3 > 0 && (
                <div
                  style={{ width: `${(c3 / total) * 100}%` }}
                  className="h-full rounded-sm bg-gradient-to-r from-purple-400 to-purple-500 shadow-[0_0_8px_rgba(192,132,252,0.6)] transition-all duration-500"
                />
              )}
              {c4 > 0 && (
                <div
                  style={{ width: `${(c4 / total) * 100}%` }}
                  className="h-full rounded-sm bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.6)] transition-all duration-500"
                />
              )}
            </>
          )}
        </div>

        {/* 4 Click Columns: 1, 2, 3, 4 Click with vertical bars and counts */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          {columns.map((col) => {
            // Height ratio of the vertical bar: between 6px (min) and 42px (max)
            const barHeight = total > 0 && col.count > 0 ? Math.max(8, Math.round((col.count / maxCount) * 42)) : 4;

            return (
              <motion.div
                key={col.label}
                animate={col.isLatest ? { scale: [1, 1.06, 1] } : {}}
                transition={{ duration: 0.3 }}
                className={`flex flex-col items-center bg-slate-800/80 rounded-xl py-1.5 px-1 border transition-all ${col.borderClass} ${
                  col.isLatest ? col.glow : ''
                }`}
              >
                {/* Column Label */}
                <span className={`text-[11px] font-black uppercase tracking-wide ${col.colorText}`}>
                  {col.label}
                </span>

                {/* Score Tag */}
                <span className="text-[9px] font-bold text-slate-300 opacity-90 -mt-0.5">
                  {col.sublabel}
                </span>

                {/* Vertical Bar Graph Container */}
                <div className="w-5 h-11 flex items-end justify-center my-1 bg-slate-950/60 rounded-md p-0.5 border border-white/5">
                  <motion.div
                    initial={{ height: 4 }}
                    animate={{ height: barHeight }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className={`w-full rounded-sm bg-gradient-to-t ${col.gradient} ${
                      col.count > 0 ? col.glow : 'opacity-30'
                    }`}
                  />
                </div>

                {/* Answers Count */}
                <span className="text-xs sm:text-sm font-black text-white leading-tight">
                  {col.count}
                </span>

                {/* Percentage */}
                <span className="text-[9px] font-bold text-slate-400 leading-tight">
                  {col.pct}%
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
