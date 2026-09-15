import { BadgeCheck, Medal, Quote, Trophy, Star } from "lucide-react";
import { Reveal, Section, TiltCard } from "./primitives";
import { useAdminData } from "@/features/admin/context/AdminDataContext";

const DEFAULT_CERTIFICATES = [
  { id: "c-1", title: "Full Stack Web Development", issuer: "Meta / Coursera", year: "2025" },
  { id: "c-2", title: "MongoDB Developer Associate", issuer: "MongoDB University", year: "2025" },
  { id: "c-3", title: "Machine Learning Specialization", issuer: "DeepLearning.AI", year: "2024" },
  { id: "c-4", title: "Python for Everybody", issuer: "University of Michigan", year: "2024" },
  { id: "c-5", title: "Responsive Web Design", issuer: "freeCodeCamp", year: "2023" },
  { id: "c-6", title: "Git & GitHub Essentials", issuer: "GitHub", year: "2023" },
];

const DEFAULT_ACHIEVEMENTS = [
  { id: "a-1", title: "Winner — Smart Campus Hackathon", detail: "Built an attendance automation system in 24 hours.", iconType: "trophy" as const },
  { id: "a-2", title: "Top 5% — National Coding Challenge", detail: "Ranked among 12,000+ participants in DSA rounds.", iconType: "medal" as const },
  { id: "a-3", title: "500+ DSA problems solved", detail: "Consistent LeetCode practice with a 180-day streak.", iconType: "star" as const },
  { id: "a-4", title: "Tech Lead — College Dev Club", detail: "Mentored 40 juniors through a MERN bootcamp.", iconType: "medal" as const },
];

const DEFAULT_TESTIMONIALS = [
  {
    id: "t-1",
    quote:
      "Meganathan turned a vague brief into a product our team actually enjoys using. Fast, thoughtful and unusually detail-obsessed.",
    name: "Priya Sundaram",
    role: "Product Manager, Nexora",
  },
  {
    id: "t-2",
    quote:
      "He rebuilt our storefront in three weeks and load time dropped by half. Communication was clear the entire way.",
    name: "Arjun Menon",
    role: "Founder, Kadai Retail",
  },
  {
    id: "t-3",
    quote:
      "One of the rare developers who cares equally about the API contract and the animation curve.",
    name: "Dr. Latha R",
    role: "Faculty, CSE Department",
  },
];

const DEFAULT_POSTS = [
  { id: "p-1", title: "Why I stopped fighting the React re-render", date: "Jul 2026", read: "6 min" },
  { id: "p-2", title: "A pragmatic RAG setup for small products", date: "May 2026", read: "9 min" },
  { id: "p-3", title: "Designing motion that doesn't annoy people", date: "Mar 2026", read: "5 min" },
];

function getAchievementIcon(type?: string) {
  switch (type) {
    case "trophy":
      return Trophy;
    case "star":
      return Star;
    case "award":
      return BadgeCheck;
    case "medal":
    default:
      return Medal;
  }
}

export function Credentials() {
  const { certificates, achievements, testimonials, blogPosts } = useAdminData();

  const publishedCerts = certificates?.filter((c) => c.published !== false);
  const certList =
    publishedCerts && publishedCerts.length > 0
      ? publishedCerts.map((c) => ({
          id: c.id,
          title: c.name,
          issuer: c.issuingOrganization,
          year: c.issueDate,
          link: c.credentialUrl,
        }))
      : DEFAULT_CERTIFICATES;

  const publishedAchs = achievements?.filter((a) => a.published !== false);
  const achList =
    publishedAchs && publishedAchs.length > 0
      ? publishedAchs.map((a) => ({
          id: a.id,
          title: a.title,
          detail: a.description,
          iconType: a.iconType,
          link: a.link,
        }))
      : DEFAULT_ACHIEVEMENTS;

  const publishedTests = testimonials?.filter((t) => t.published !== false);
  const testList =
    publishedTests && publishedTests.length > 0
      ? publishedTests.map((t) => ({
          id: t.id,
          quote: t.quote,
          name: t.name,
          role: `${t.role}${t.company ? `, ${t.company}` : ""}`,
        }))
      : DEFAULT_TESTIMONIALS;

  const publishedPosts = blogPosts?.filter((p) => p.status === "published" || !p.status);
  const postList =
    publishedPosts && publishedPosts.length > 0
      ? publishedPosts.map((p) => ({
          id: p.id,
          title: p.title,
          date: p.publishedDate,
          read: p.readTime,
        }))
      : DEFAULT_POSTS;

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
            {certList.map((c, i) => (
              <Reveal key={c.id || c.title} delay={i * 0.05}>
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
            {achList.map((a, i) => {
              const IconComp = getAchievementIcon(a.iconType);
              return (
                <Reveal key={a.id || a.title} delay={i * 0.08}>
                  <TiltCard className="flex items-start gap-5 p-7">
                    <span
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl"
                      style={{
                        background: "color-mix(in oklab, var(--violet) 22%, transparent)",
                        boxShadow: "var(--glow-violet)",
                      }}
                    >
                      <IconComp className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-base font-bold">{a.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.detail}</p>
                    </div>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {testList.map((t, i) => (
            <Reveal key={t.id || t.name} delay={i * 0.1}>
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
          {postList.map((p, i) => (
            <Reveal key={p.id || p.title} delay={i * 0.08}>
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
