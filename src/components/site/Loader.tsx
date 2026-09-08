import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export function Loader() {
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const p = Math.min(100, ((performance.now() - start) / 1400) * 100);
      setPct(Math.round(p));
      if (p < 100) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative mb-8 h-24 w-24">
            <div
              className="absolute inset-0 rounded-full border-2 border-transparent"
              style={{
                borderTopColor: "var(--neon)",
                borderRightColor: "var(--violet)",
                animation: "spin-slow 1.1s linear infinite",
              }}
            />
            <div className="absolute inset-0 grid place-items-center font-mono text-sm text-muted-foreground">
              {pct}%
            </div>
          </div>
          <p className="font-display text-2xl font-bold tracking-tight">
            <span className="aurora-text">Meganathan.R(Arun)</span>
          </p>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.4em] text-muted-foreground">
            loading experience
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
