import { useState, useMemo } from "react";
import { ExternalLink, Github } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import { Reveal, Section } from "./primitives";
import { cn } from "@/lib/utils";
import { useAdminData } from "@/features/admin/context/AdminDataContext";

type ProjectDisplay = {
  id: string;
  title: string;
  blurb: string;
  image: string;
  tags: string[];
  category: string;
  demo: string;
  repo: string;
};

const DEFAULT_PROJECTS: ProjectDisplay[] = [
  {
    id: "proj-1",
    title: "Student Job Finder",
    blurb: "Job discovery platform matching students to internships with smart filters and alerts.",
    image: p1,
    tags: ["React", "Node.js", "MongoDB", "Express"],
    category: "Full Stack",
    demo: "https://example.com/student-job-finder",
    repo: "https://github.com/meganathan-r/student-job-finder",
  },
  {
    id: "proj-2",
    title: "Portfolio Website",
    blurb: "This site — a glassmorphic, motion-first personal portfolio built for speed.",
    image: p2,
    tags: ["React", "Vite", "Tailwind", "Motion"],
    category: "Frontend",
    demo: "https://example.com/portfolio",
    repo: "https://github.com/meganathan-r/portfolio",
  },
  {
    id: "proj-3",
    title: "AI Chatbot",
    blurb: "Context-aware assistant with streaming responses and document retrieval.",
    image: p3,
    tags: ["Python", "React", "LLM", "FastAPI"],
    category: "AI",
    demo: "https://example.com/ai-chatbot",
    repo: "https://github.com/meganathan-r/ai-chatbot",
  },
  {
    id: "proj-4",
    title: "E-Commerce Website",
    blurb: "Storefront with cart, payments, order tracking and an admin inventory panel.",
    image: p4,
    tags: ["MERN", "Stripe", "Redux"],
    category: "Full Stack",
    demo: "https://example.com/ecommerce",
    repo: "https://github.com/meganathan-r/ecommerce",
  },
  {
    id: "proj-5",
    title: "College Management System",
    blurb: "Attendance, results and staff workflows unified in one role-based dashboard.",
    image: p5,
    tags: ["React", "Node.js", "SQL"],
    category: "Full Stack",
    demo: "https://example.com/college-ms",
    repo: "https://github.com/meganathan-r/college-management",
  },
  {
    id: "proj-6",
    title: "Weather App",
    blurb: "Location-aware forecasts with animated conditions and offline caching.",
    image: p6,
    tags: ["JavaScript", "API", "PWA"],
    category: "Frontend",
    demo: "https://example.com/weather",
    repo: "https://github.com/meganathan-r/weather-app",
  },
];

export function Projects() {
  const { projects } = useAdminData();

  const publishedProjects: ProjectDisplay[] = useMemo(() => {
    const list = projects?.filter((p) => p.status === "published" || !p.status);
    if (list && list.length > 0) {
      return list.map((p) => ({
        id: p.id,
        title: p.title,
        blurb: p.shortDescription || p.fullDescription || "",
        image: p.image || p1,
        tags: Array.isArray(p.tags) ? p.tags : [],
        category: p.category || "Full Stack",
        demo: p.demoUrl || "",
        repo: p.githubUrl || "",
      }));
    }
    return DEFAULT_PROJECTS;
  }, [projects]);

  const filterCategories = useMemo(() => {
    const unique = Array.from(new Set(publishedProjects.map((p) => p.category).filter(Boolean)));
    return ["All", ...unique];
  }, [publishedProjects]);

  const [filter, setFilter] = useState<string>("All");

  const list = publishedProjects.filter((p) => filter === "All" || p.category === filter);

  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title={
        <>
          Selected <span className="aurora-text">work</span>
        </>
      }
      subtitle="A few builds that pushed me — each one shipped, tested and iterated on."
    >
      <Reveal className="mb-10">
        <div className="inline-flex flex-wrap gap-2 rounded-full glass p-1.5">
          {filterCategories.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "relative rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors",
                filter === f ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {filter === f && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 -z-10 rounded-full"
                  style={{ background: "var(--gradient-aurora)", opacity: 0.9 }}
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                />
              )}
              {f}
            </button>
          ))}
        </div>
      </Reveal>

      <motion.div layout className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((p) => (
            <motion.article
              key={p.id || p.title}
              layout
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="glow-card group overflow-hidden rounded-3xl"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={p.image}
                  alt={`${p.title} project preview`}
                  loading="lazy"
                  width={1024}
                  height={640}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 40%, color-mix(in oklab, var(--background) 92%, transparent))",
                  }}
                />
                <span className="absolute left-4 top-4 rounded-full glass px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.25em]">
                  {p.category}
                </span>
              </div>

              <div className="p-7">
                <h3 className="font-display text-xl font-bold">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.blurb}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-white/10 px-3 py-1 font-mono text-[0.65rem] text-muted-foreground"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex items-center gap-3">
                  {p.demo && (
                    <a
                      href={p.demo}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-primary-foreground transition-transform hover:scale-105"
                      style={{ background: "var(--gradient-aurora)" }}
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                    </a>
                  )}
                  {p.repo && (
                    <a
                      href={p.repo}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-semibold transition-colors hover:border-primary"
                    >
                      <Github className="h-3.5 w-3.5" /> GitHub
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}
