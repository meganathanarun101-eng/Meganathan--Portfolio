import { useEffect, useState } from "react";
import {
  ArrowUp,
  Download,
  FileText,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { MagneticButton, Reveal, Section, TiltCard } from "./primitives";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(160),
  message: z.string().trim().min(10, "Tell me a little more").max(1200),
});

const EMAIL = "meganathanarun101@gmail.com";
const SOCIALS = [
  {icon: Mail, label: "Mail", href: "meganathanarun101@gmail.com"},
  { icon: Github, label: "GitHub", href: "https://github.com/meganathanarun101-eng/synth-port-showcase.git" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/meganathan-r-811771320?utm_source=share_via&utm_content=profile&utm_medium=member_android" },
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/megu_arun_350_m_s?igsh=MWpiZ3N0enJlam94eQ="},
];

export function Contact() {
  const [visits, setVisits] = useState<number | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const base = 1284;
    const stored = Number(localStorage.getItem("mega-visits") ?? "0") + 1;
    localStorage.setItem("mega-visits", String(stored));
    setVisits(base + stored);
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setSending(true);
    const { name, email, message } = parsed.data;
    const url = `mailto:${EMAIL}?subject=${encodeURIComponent(
      `Portfolio enquiry from ${name}`,
    )}&body=${encodeURIComponent(`${message}\n\n— ${name} (${email})`)}`;
    window.location.href = url;
    setTimeout(() => {
      setSending(false);
      toast.success("Opening your email app — thanks for reaching out!");
      e.currentTarget?.reset?.();
    }, 600);
  };

  return (
    <>
      <Section
        id="resume"
        eyebrow="Resume"
        title={
          <>
            The one-page <span className="aurora-text">version</span>
          </>
        }
      >
        <Reveal>
          <div className="glow-card flex flex-col items-start justify-between gap-8 rounded-[2rem] p-10 md:flex-row md:items-center md:p-14">
            <div className="max-w-xl">
              <FileText className="h-7 w-7 text-primary" />
              <h3 className="mt-6 font-display text-2xl font-extrabold md:text-3xl">
                Full stack developer, MERN &amp; AI
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Education, experience, projects and the full technology list — condensed into a
                single PDF page.
              </p>
            </div>
            <MagneticButton href="/resume.pdf" download>
              <Download className="h-4 w-4" /> Download Resume
            </MagneticButton>
          </div>
        </Reveal>
      </Section>

      <Section
        id="contact"
        eyebrow="Contact"
        title={
          <>
            Let&apos;s build <span className="aurora-text">something</span>
          </>
        }
        subtitle="Freelance projects, internships or just a good technical conversation — my inbox is open."
      >
        <div className="grid gap-7 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-5">
            {[
              { icon: Mail, label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
              { icon: Phone, label: "Phone", value: "+91 8838574730", href: "tel:+918838574730" },
              { icon: MapPin, label: "Location", value: "salem, Tamil Nadu, India" },
            ].map((c) => (
              <Reveal key={c.label}>
                <TiltCard className="flex items-center gap-5 p-6">
                  <span
                    className="grid h-11 w-11 place-items-center rounded-2xl"
                    style={{
                      background: "color-mix(in oklab, var(--neon) 18%, transparent)",
                      boxShadow: "var(--glow-neon)",
                    }}
                  >
                    <c.icon className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-primary">
                      {c.label}
                    </p>
                    {c.href ? (
                      <a href={c.href} className="text-sm hover:underline">
                        {c.value}
                      </a>
                    ) : (
                      <p className="text-sm">{c.value}</p>
                    )}
                  </div>
                </TiltCard>
              </Reveal>
            ))}

            <Reveal>
              <div className="flex gap-3">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={s.label}
                    className="grid h-12 w-12 place-items-center rounded-2xl glass transition-transform hover:scale-110 hover:border-primary"
                  >
                    <s.icon className="h-4.5 w-4.5" />
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <form onSubmit={onSubmit} className="glow-card rounded-[2rem] p-8 md:p-10">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-primary">
                    Name
                  </span>
                  <input
                    name="name"
                    maxLength={80}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                    placeholder="Your name"
                  />
                </label>
                <label className="block">
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-primary">
                    Email
                  </span>
                  <input
                    name="email"
                    type="email"
                    maxLength={160}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                    placeholder="you@example.com"
                  />
                </label>
              </div>
              <label className="mt-5 block">
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-primary">
                  Message
                </span>
                <textarea
                  name="message"
                  rows={6}
                  maxLength={1200}
                  className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                  placeholder="What are you building?"
                />
              </label>
              <div className="mt-8">
                <MagneticButton type="submit">
                  <Send className="h-4 w-4" /> {sending ? "Sending…" : "Send Message"}
                </MagneticButton>
              </div>
            </form>
          </Reveal>
        </div>
      </Section>

      <Footer visits={visits} />
    </>
  );
}

function Footer({ visits }: { visits: number | null }) {
  return (
    <footer className="relative mt-16 overflow-hidden">
      <div aria-hidden className="relative h-24 w-full overflow-hidden">
        <svg
          viewBox="0 0 2880 120"
          preserveAspectRatio="none"
          className="h-full w-[200%]"
          style={{ animation: "wave-shift 14s linear infinite" }}
        >
          <path
            d="M0,60 C240,110 480,10 720,60 C960,110 1200,10 1440,60 C1680,110 1920,10 2160,60 C2400,110 2640,10 2880,60 L2880,120 L0,120 Z"
            fill="color-mix(in oklab, var(--violet) 22%, transparent)"
          />
        </svg>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 pb-14 text-center">
        <p className="font-display text-2xl font-extrabold tracking-tight">
          <span className="aurora-text">Meganathan.R</span>
        </p>
        <div className="flex gap-3">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={s.label}
              className="grid h-10 w-10 place-items-center rounded-full glass transition-transform hover:scale-110"
            >
              <s.icon className="h-4 w-4" />
            </a>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Meganathan.R · Built with React, Tailwind &amp; Motion
        </p>
        {visits !== null && (
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground/70">
            {visits.toLocaleString()} visits
          </p>
        )}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="mt-2 grid h-12 w-12 place-items-center rounded-full glass transition-transform hover:-translate-y-1 hover:border-primary"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </footer>
  );
}
