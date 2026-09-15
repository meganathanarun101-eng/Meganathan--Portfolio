import { Bot, Boxes, Gauge, LayoutTemplate, Server, Smartphone } from "lucide-react";
import { Reveal, Section, TiltCard } from "./primitives";
import { useAdminData } from "@/features/admin/context/AdminDataContext";

const ICON_MAP: Record<string, typeof LayoutTemplate> = {
  LayoutTemplate,
  Server,
  Bot,
  Smartphone,
  Gauge,
  Boxes,
};

const DEFAULT_EXPERIENCE = [
  {
    role: "Full Stack Developer Intern",
    org: "Nexora Technologies",
    period: "2025 — Present",
    points: [
      "Shipped a multi-tenant dashboard in React + Node serving 4k monthly users.",
      "Cut API p95 latency by 62% with query batching and Redis caching.",
    ],
  },
  {
    role: "Freelance Web Developer",
    org: "Independent",
    period: "2024 — 2025",
    points: [
      "Delivered 12+ marketing sites and admin panels for local businesses.",
      "Built reusable MERN starter kit that halved project setup time.",
    ],
  },
  {
    role: "Open Source Contributor",
    org: "Community",
    period: "2023 — Present",
    points: [
      "Contributed UI and accessibility fixes to React tooling projects.",
      "Maintain small utility libraries with 400+ combined downloads.",
    ],
  },
];

const DEFAULT_SERVICES = [
  { icon: LayoutTemplate, title: "Web Development", body: "Marketing sites and product UIs built with React, Vite and Tailwind." },
  { icon: Server, title: "Backend & APIs", body: "Node, Express and MongoDB services designed for clarity and scale." },
  { icon: Bot, title: "AI Integration", body: "Chat assistants, RAG search and automation wired into real products." },
  { icon: Smartphone, title: "Responsive UI/UX", body: "Interfaces that feel native from a 360px phone to an ultrawide." },
  { icon: Gauge, title: "Performance Audits", body: "Core Web Vitals work: bundle trimming, caching, image strategy." },
  { icon: Boxes, title: "Maintenance", body: "Ongoing feature work, refactors and dependable bug triage." },
];

export function Work() {
  const { experience, services } = useAdminData();

  const publishedExp = experience
    ?.filter((e) => e.published !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const experienceList =
    publishedExp && publishedExp.length > 0
      ? publishedExp.map((e) => ({
          id: e.id,
          role: e.position,
          org: e.company,
          period: `${e.startDate || ""}${e.currentlyWorking ? " — Present" : e.endDate ? ` — ${e.endDate}` : ""}`,
          points: Array.isArray(e.description)
            ? e.description
            : typeof e.description === "string"
              ? [e.description]
              : [],
        }))
      : DEFAULT_EXPERIENCE.map((e, idx) => ({ id: `dexp-${idx}`, ...e }));

  const publishedServices = services?.filter((s) => s.published !== false);

  const servicesList =
    publishedServices && publishedServices.length > 0
      ? publishedServices.map((s) => ({
          id: s.id,
          icon: ICON_MAP[s.iconName] || LayoutTemplate,
          title: s.name,
          body: s.description,
        }))
      : DEFAULT_SERVICES.map((s, idx) => ({ id: `dsrv-${idx}`, ...s }));

  return (
    <>
      <Section
        id="experience"
        eyebrow="Experience"
        title={
          <>
            Where I&apos;ve <span className="aurora-text">shipped</span>
          </>
        }
      >
        <div className="grid gap-6 md:grid-cols-3">
          {experienceList.map((e, i) => (
            <Reveal key={e.id || e.role} delay={i * 0.1}>
              <TiltCard className="h-full p-8">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                  {e.period}
                </p>
                <h3 className="mt-4 font-display text-xl font-bold leading-snug">{e.role}</h3>
                <p className="mt-1 text-sm text-foreground/75">{e.org}</p>
                <ul className="mt-6 space-y-3">
                  {e.points.map((p, pIdx) => (
                    <li key={pIdx} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <span
                        aria-hidden
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: "var(--cyan)" }}
                      />
                      {p}
                    </li>
                  ))}
                </ul>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        id="services"
        eyebrow="Services"
        title={
          <>
            How I can <span className="aurora-text">help</span>
          </>
        }
        subtitle="End-to-end product engineering, or a focused hand on the part that's stuck."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {servicesList.map((s, i) => (
            <Reveal key={s.id || s.title} delay={i * 0.06}>
              <TiltCard className="h-full p-8">
                <span
                  className="inline-grid h-12 w-12 place-items-center rounded-2xl"
                  style={{
                    background: "color-mix(in oklab, var(--neon) 18%, transparent)",
                    boxShadow: "var(--glow-neon)",
                  }}
                >
                  <s.icon className="h-5 w-5 text-foreground" />
                </span>
                <h3 className="mt-6 font-display text-lg font-bold">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
