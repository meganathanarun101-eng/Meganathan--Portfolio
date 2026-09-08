import { Award, Code2, GitBranch, Trophy } from "lucide-react";
import { Counter, Reveal, Section, TiltCard } from "./primitives";

const STATS = [
  { icon: Code2, label: "Projects Completed", value: 1, suffix: "+" },
  { icon: Award, label: "Certificates", value: 15, suffix: "+" },
  { icon: Trophy, label: "Hackathons", value: 6, suffix: "" },
  { icon: GitBranch, label: "GitHub Contributions", value: 1240, suffix: "+" },
];

const EDUCATION = [
  {
    year: "2024 — 2028",
    title: "B.Tech — Information Technology",
    place: "JKKN College of Engineering Technology,Anna University, Tamil Nadu",
    detail: "CGPA 8.7 / 10 · Specialisation in full stack systems and applied machine learning.",
  },
  {
    year: "2021 — 2023",
    title: "Higher Secondary —Bio-Maths",
    place: "KALAIMAGAL VIDHYASHRAM MATRICULATION HIGHER SECONDARY SCHOOL.",
    detail: "65% ·",
  },
  {
    year: "2020 — 2021",
    title: "SSLC",
    place: "St. Mary's Matriculation School ",
    detail: "55%",
  },
];

export function About() {
  return (
    <>
      <Section
        id="about"
        eyebrow="About"
        title={
          <>
            Building software that
            <br />
            <span className="aurora-text">feels effortless</span>
          </>
        }
      >
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal>
            <div className="glow-card rounded-3xl p-8 md:p-10">
              <p className="text-lg leading-relaxed text-muted-foreground">
                I&apos;m{" "}
                <span className="font-semibold text-foreground">Meganathan.R</span>, a full stack
                developer focused on the MERN ecosystem. I care about the small details — the
                easing curve of a transition, a query that drops from 900ms to 40ms, an interface
                that explains itself without a tooltip.
              </p>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Recently I&apos;ve been pairing traditional web engineering with AI: retrieval
                pipelines, LLM-powered assistants, and tools that quietly remove busywork from
                people&apos;s days.
              </p>
              <dl className="mt-10 grid gap-6 sm:grid-cols-3">
                {[
                  ["Focus", "Full Stack · AI  Network security"],
                  ["Experience", "AI Tools Expert · MERN Developer"],
                  ["Based in", "Tamil Nadu, India"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-primary">
                      {k}
                    </dt>
                    <dd className="mt-2 text-sm text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-5">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <TiltCard className="h-full p-6">
                  <s.icon className="h-5 w-5 text-primary" />
                  <p className="mt-5 font-display text-3xl font-extrabold tracking-tight md:text-4xl">
                    <Counter to={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-1.5 text-xs leading-snug text-muted-foreground">{s.label}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section
        id="education"
        eyebrow="Education"
        title={
          <>
            An interactive <span className="aurora-text">timeline</span>
          </>
        }
        subtitle="Where curiosity turned into craft."
      >
        <div className="relative pl-8 md:pl-0">
          <div
            aria-hidden
            className="absolute bottom-0 left-2 top-0 w-px md:left-1/2"
            style={{ background: "var(--gradient-aurora)", opacity: 0.55 }}
          />
          <div className="space-y-10 md:space-y-16">
            {EDUCATION.map((e, i) => (
              <Reveal key={e.title} delay={i * 0.1}>
                <div
                  className={`relative md:flex md:items-center md:gap-10 ${
                    i % 2 ? "md:flex-row-reverse" : 
                    ""
                  }`}
                >
                  <span
                    aria-hidden
                    className="absolute -left-[1.65rem] top-6 h-3 w-3 rounded-full md:left-1/2 md:-translate-x-1/2"
                    style={{ background: "var(--cyan)", boxShadow: "var(--glow-neon)" }}
                  />
                  <div className="md:w-1/2">
                    <TiltCard className="p-7">
                      <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                        {e.year}
                      </p>
                      <h3 className="mt-3 font-display text-xl font-bold">{e.title}</h3>
                      <p className="mt-1 text-sm text-foreground/80">{e.place}</p>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        {e.detail}
                      </p>
                    </TiltCard>
                  </div>
                  <div className="hidden md:block md:w-1/2" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
