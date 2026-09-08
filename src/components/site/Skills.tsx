import { useRef } from "react";
import { useInView } from "motion/react";
import { Reveal, Section } from "./primitives";

const SKILLS = [
  { name: "HTML", value: 95 },
  { name: "CSS", value: 92 },
  { name: "JavaScript", value: 90 },
  { name: "React", value: 91 },
  { name: "Node.js", value: 86 },
  { name: "Express", value: 84 },
  { name: "MongoDB", value: 82 },
  { name: "Python", value: 80 },
  { name: "Git", value: 88 },
  { name: "GitHub", value: 90 },
  { name: "SQL", value: 78 },
];

function Ring({ name, value, delay }: { name: string; value: number; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const r = 42;
  const c = 2 * Math.PI * r;

  return (
    <div ref={ref} className="group flex flex-col items-center gap-4">
      <div className="relative h-28 w-28">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <defs>
            <linearGradient id={`g-${name}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--cyan)" />
              <stop offset="100%" stopColor="var(--violet)" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={`url(#g-${name})`}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={inView ? c - (c * value) / 100 : c}
            style={{
              transition: `stroke-dashoffset 1.6s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
              filter: "drop-shadow(0 0 8px color-mix(in oklab, var(--neon) 70%, transparent))",
            }}
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center font-display text-lg font-bold">
          {value}%
        </span>
      </div>
      <p className="text-sm font-semibold text-muted-foreground transition-colors group-hover:text-foreground">
        {name}
      </p>
    </div>
  );
}

export function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title={
        <>
          The <span className="aurora-text">toolkit</span>
        </>
      }
      subtitle="Technologies I reach for daily, measured by how confidently I ship with them."
    >
      <Reveal>
        <div className="glow-card rounded-[2rem] p-8 md:p-12">
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-4">
            {SKILLS.map((s, i) => (
              <Ring key={s.name} name={s.name} value={s.value} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
