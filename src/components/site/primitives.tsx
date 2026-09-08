import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("relative mx-auto max-w-7xl px-6 py-28 md:py-36", className)}>
      <Reveal className="mb-14 md:mb-20">
        <p className="font-mono text-xs uppercase tracking-[0.45em] text-primary">{eyebrow}</p>
        <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {subtitle}
          </p>
        )}
      </Reveal>
      {children}
    </section>
  );
}

/** Button with magnetic pull + ripple. */
export function MagneticButton({
  children,
  href,
  variant = "primary",
  className,
  onClick,
  type = "button",
  download,
}: {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "ghost" | "outline";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  download?: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [t, setT] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setT({
      x: (e.clientX - (r.left + r.width / 2)) * 0.25,
      y: (e.clientY - (r.top + r.height / 2)) * 0.35,
    });
  };

  const base =
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors duration-300 will-change-transform";
  const styles = {
    primary: "text-primary-foreground",
    outline: "glass text-foreground hover:border-primary",
    ghost: "text-muted-foreground hover:text-foreground",
  }[variant];

  const inner = (
    <>
      {variant === "primary" && (
        <span
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{ background: "var(--gradient-aurora)", backgroundSize: "200% 200%" }}
        />
      )}
      {variant === "primary" && (
        <span
          aria-hidden
          className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ boxShadow: "var(--glow-violet)" }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25 transition-all duration-700 group-active:h-64 group-active:w-64 group-active:opacity-0"
      />
    </>
  );

  const style = {
    transform: `translate3d(${t.x}px, ${t.y}px, 0)`,
    transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
  };

  if (href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        download={download}
        data-magnetic
        onMouseMove={handleMove}
        onMouseLeave={() => setT({ x: 0, y: 0 })}
        className={cn(base, styles, className)}
        style={style}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      data-magnetic
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={() => setT({ x: 0, y: 0 })}
      className={cn(base, styles, className)}
      style={style}
    >
      {inner}
    </button>
  );
}

/** Card that tilts toward the pointer. */
export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState("");

  return (
    <div
      ref={ref}
      className={cn("glow-card rounded-3xl", className)}
      style={{ transform: tilt, transformStyle: "preserve-3d" }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -8;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 8;
        setTilt(`perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`);
      }}
      onMouseLeave={() => setTilt("")}
    >
      {children}
    </div>
  );
}

export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const p = Math.min(1, (performance.now() - start) / 1600);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}
