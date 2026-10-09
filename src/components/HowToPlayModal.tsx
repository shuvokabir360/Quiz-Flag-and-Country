import { motion } from 'framer-motion';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal = ({ isOpen, onClose }: HowToPlayModalProps) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      title: 'Read Country Name',
      desc: 'Look at the bold country name displayed at the top.',
      icon: '🌍',
    },
    {
      num: 2,
      title: 'Find Its Flag',
      desc: 'Spot the correct realistic flag from the 4 options.',
      icon: '🚩',
    },
    {
      num: 3,
      title: 'Drag Flag Card',
      desc: 'Touch or click to grab and drag with one finger.',
      icon: '👆',
    },
    {
      num: 4,
      title: 'Drop Into Target',
      desc: 'Release over the glowing central pedestal.',
      icon: '🎯',
    },
    {
      num: 5,
      title: 'Build Streak & Score',
      desc: 'Stack consecutive correct drops to trigger fire streaks!',
      icon: '🔥',
    },
  ];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm max-h-[90%] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700/80 p-5 shadow-2xl flex flex-col gap-4 text-white"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <h3 className="text-lg font-black tracking-wide uppercase text-amber-400">
              How To Play
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {steps.map((st) => (
            <div
              key={st.num}
              className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/40"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-base shrink-0 shadow-md">
                {st.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400">
                    STEP {st.num}
                  </span>
                  <h4 className="text-sm font-bold text-white">{st.title}</h4>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-1 flex flex-col gap-2">
          <div className="text-[11px] text-slate-300 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/30">
            🏛️ <strong className="text-amber-300">Capital Cities Mode:</strong> Challenge yourself to recognize flags from capital cities like <span className="text-white font-bold">Tokyo, Paris, Dhaka</span>!
          </div>
          <div className="text-center text-[11px] text-slate-400 bg-slate-800/40 p-2 rounded-xl border border-slate-700/40">
            💡 <span className="font-semibold text-slate-300">Keyboard tip:</span> Press keys{' '}
            <strong className="text-amber-400">1, 2, 3, 4</strong> to answer instantly!
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 font-black tracking-wider uppercase text-white shadow-lg shadow-sky-500/25 active:scale-98 transition-all"
        >
          GOT IT, LET&apos;S PLAY!
        </button>
      </motion.div>
    </div>
  );
};
