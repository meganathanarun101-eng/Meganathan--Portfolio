import { useEffect, useState } from "react";

/** Custom glow cursor + spotlight, disabled on touch devices. */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const el = e.target as HTMLElement | null;
      setActive(!!el?.closest("a,button,[data-magnetic]"));
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60]">
      <div
        className="absolute h-[26rem] w-[26rem] rounded-full opacity-25 blur-[90px] transition-transform duration-300"
        style={{
          left: pos.x,
          top: pos.y,
          transform: "translate(-50%,-50%)",
          background: "radial-gradient(circle, var(--neon), transparent 65%)",
        }}
      />
      <div
        className="absolute rounded-full border transition-[width,height,opacity] duration-200"
        style={{
          left: pos.x,
          top: pos.y,
          width: active ? 44 : 26,
          height: active ? 44 : 26,
          transform: "translate(-50%,-50%)",
          borderColor: "color-mix(in oklab, var(--cyan) 70%, transparent)",
          boxShadow: "0 0 18px color-mix(in oklab, var(--neon) 60%, transparent)",
        }}
      />
      <div
        className="absolute h-1.5 w-1.5 rounded-full"
        style={{
          left: pos.x,
          top: pos.y,
          transform: "translate(-50%,-50%)",
          background: "var(--cyan)",
        }}
      />
    </div>
  );
}
