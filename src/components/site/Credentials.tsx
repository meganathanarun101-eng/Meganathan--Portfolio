import { BadgeCheck, Medal, Quote } from "lucide-react";
import { Reveal, Section, TiltCard } from "./primitives";

const CERTIFICATES = [
  { title: "Full Stack Web Development", issuer: "Meta / Coursera", year: "2025" },
  { title: "MongoDB Developer Associate", issuer: "MongoDB University", year: "2025" },
  { title: "Machine Learning Specialization", issuer: "DeepLearning.AI", year: "2024" },
  { title: "Python for Everybody", issuer: "University of Michigan", year: "2024" },
  { title: "Responsive Web Design", issuer: "freeCodeCamp", year: "2023" },
  { title: "Git & GitHub Essentials", issuer: "GitHub", year: "2023" },
];

const ACHIEVEMENTS = [
  { title: "Winner — Smart Campus Hackathon", detail: "Built an attendance automation system in 24 hours." },
  { title: "Top 5% — National Coding Challenge", detail: "Ranked among 12,000+ participants in DSA rounds." },
  { title: "500+ DSA problems solved", detail: "Consistent LeetCode practice with a 180-day streak." },
  { title: "Tech Lead — College Dev Club", detail: "Mentored 40 juniors through a MERN bootcamp." },
];

const TESTIMONIALS = [
  {
    quote:
      "Meganathan turned a vague brief into a product our team actually enjoys using. Fast, thoughtful and unusually detail-obsessed.",
    name: "Priya Sundaram",
    role: "Product Manager, Nexora",
  },
  {
    quote:
      "He rebuilt our storefront in three weeks and load time dropped by half. Communication was clear the entire way.",
    name: "Arjun Menon",
    role: "Founder, Kadai Retail",
  },
  {
    quote:
      "One of the rare developers who cares equally about the API contract and the animation curve.",
    name: "Dr. Latha R",
    role: "Faculty, CSE Department",
  },
];

const POSTS = [
  { title: "Why I stopped fighting the React re-render", date: "Jul 2026", read: "6 min" },
  { title: "A pragmatic RAG setup for small products", date: "May 2026", read: "9 min" },
  { title: "Designing motion that doesn't annoy people", date: "Mar 2026", read: "5 min" },
];

export function Credentials() {
  return (
    <>
      <Section
        id="credentials"
        eyebrow="Certificates & Achievements"
        title={
          <>
            Proof of <span className="aurora-text">practice</span>
          </>
        }
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="grid gap-5 sm:grid-cols-2">
            {CERTIFICATES.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.05}>
                <TiltCard className="h-full p-6">
                  <BadgeCheck className="h-5 w-5 text-primary" />
                  <h3 className="mt-4 font-display text-base font-bold leading-snug">{c.title}</h3>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {c.issuer} · {c.year}
                  </p>
                </TiltCard>
              </Reveal>
            ))}
          </div>

          <div className="space-y-5">
            {ACHIEVEMENTS.map((a, i) => (
              <Reveal key={a.title} delay={i * 0.08}>
                <TiltCard className="flex items-start gap-5 p-7">
                  <span
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl"
                    style={{
                      background: "color-mix(in oklab, var(--violet) 22%, transparent)",
                      boxShadow: "var(--glow-violet)",
                    }}
                  >
                    <Medal className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold">{a.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.detail}</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <TiltCard className="h-full p-8">
                <Quote className="h-6 w-6 text-primary" />
                <p className="mt-5 text-sm leading-relaxed text-foreground/85">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="mt-6 font-display text-sm font-bold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        id="blog"
        eyebrow="Blog"
        title={
          <>
            Notes from the <span className="aurora-text">build</span>
          </>
        }
        subtitle="Occasional writing about engineering decisions and the trade-offs behind them."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {POSTS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <TiltCard className="h-full p-8">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-primary">
                  {p.date} · {p.read}
                </p>
                <h3 className="mt-5 font-display text-lg font-bold leading-snug">{p.title}</h3>
                <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Coming soon
                </p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
