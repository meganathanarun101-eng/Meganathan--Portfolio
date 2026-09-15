import { useEffect, useRef, useState, useMemo } from "react";
import { ArrowDown, Download, Mail, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import defaultProfileImg from "@/assets/profile.jpg";
import { MagneticButton } from "./primitives";
import { useAdminData } from "@/features/admin/context/AdminDataContext";

function useTyping(roles: string[]) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    if (!roles || roles.length === 0) return;
    const full = roles[i % roles.length]!;
    const speed = del ? 45 : 85;
    const t = setTimeout(() => {
      const next = del ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1);
      setText(next);
      if (!del && next === full) setTimeout(() => setDel(true), 1300);
      if (del && next === "") {
        setDel(false);
        setI((v) => v + 1);
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, del, i, roles]);

  return text;
}

export function Hero() {
  const { profile } = useAdminData();
  const roles = useMemo(() => {
    const list = (profile?.professionalTitle || "")
      .split(/[·|,/]/)
      .map((r) => r.trim())
      .filter(Boolean);
    return list.length > 0 ? list : ["Full Stack Developer", "MERN Stack Developer", "AI Enthusiast"];
  }, [profile?.professionalTitle]);

  const typed = useTyping(roles);
  const imgRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState("");
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setParallax({
        x: (e.clientX / window.innerWidth - 0.5) * 22,
        y: (e.clientY / window.innerHeight - 0.5) * 22,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const availabilityLabel =
    profile?.availabilityStatus === "busy"
      ? "Busy with projects"
      : profile?.availabilityStatus === "open_to_offers"
        ? "Open to offers"
        : "Available for work";

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden px-6 pb-24 pt-36"
    >
      {/* floating glowing circles */}
      {[
        { s: 120, x: "8%", y: "22%", d: 0 },
        { s: 70, x: "82%", y: "18%", d: 1.2 },
        { s: 44, x: "72%", y: "76%", d: 2.1 },
        { s: 90, x: "16%", y: "78%", d: 0.6 },
      ].map((c, k) => (
        <motion.div
          key={k}
          aria-hidden
          className="pointer-events-none absolute rounded-full border border-white/10"
          style={{
            width: c.s,
            height: c.s,
            left: c.x,
            top: c.y,
            background:
              "radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--neon) 35%, transparent), transparent 70%)",
            boxShadow: "0 0 60px color-mix(in oklab, var(--violet) 40%, transparent)",
          }}
          animate={{ y: [0, -26, 0], rotate: [0, 18, 0] }}
          transition={{ duration: 9 + c.d * 2, repeat: Infinity, ease: "easeInOut", delay: c.d }}
        />
      ))}

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 font-mono text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Welcome to my portfolio
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(14px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl xl:text-8xl"
          >
            <span className="block text-muted-foreground/80">𝙃𝙞-𝙡𝙤,𝙄 𝙖𝙢</span>
            <span
              className="mt-2 block aurora-text"
              style={{ textShadow: "0 0 80px color-mix(in oklab, var(--violet) 40%, transparent)" }}
            >
              {profile?.fullName || "MEGANATHAN.R"}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="mt-6 font-mono text-lg text-foreground/90 sm:text-2xl"
          >
            {typed}
            <span
              className="ml-0.5 inline-block h-6 w-[2px] translate-y-1 bg-primary sm:h-7"
              style={{ animation: "blink 1s steps(1) infinite" }}
            />
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            {profile?.shortBio ||
              "I design and engineer fast, elegant web products — from pixel-perfect interfaces to resilient APIs and AI-powered experiences."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.65 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <MagneticButton href="#projects">
              View Projects <ArrowDown className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton href={profile?.resumeUrl || "#resume"} variant="outline">
              <Download className="h-4 w-4" /> Download Resume
            </MagneticButton>
            <MagneticButton href="#contact" variant="outline">
              <Mail className="h-4 w-4" /> Contact Me
            </MagneticButton>
          </motion.div>
        </div>

        {/* 3D profile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-sm"
          style={{ transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)` }}
        >
          <div
            aria-hidden
            className="absolute -inset-10 rounded-full opacity-60 blur-3xl"
            style={{ background: "radial-gradient(circle, var(--violet), transparent 65%)" }}
          />
          <div
            ref={imgRef}
            className="relative overflow-hidden rounded-[2rem] border border-white/15 neon-ring"
            style={{
              transform: tilt,
              transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
            }}
            onMouseMove={(e) => {
              const r = imgRef.current!.getBoundingClientRect();
              const rx = ((e.clientY - r.top) / r.height - 0.5) * -14;
              const ry = ((e.clientX - r.left) / r.width - 0.5) * 14;
              setTilt(`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`);
            }}
            onMouseLeave={() => setTilt("")}
          >
            <img
              src={profile?.avatarUrl || defaultProfileImg}
              alt={`Portrait of ${profile?.fullName || "Meganathan.R"}, full stack developer`}
              width={768}
              height={960}
              className="h-full w-full object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent 45%, color-mix(in oklab, var(--background) 85%, transparent))",
              }}
            />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl glass px-4 py-3">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-primary">
                {availabilityLabel}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {profile?.location || "salem, Tamil Nadu, India · Remote"}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowDown className="h-5 w-5" />
      </motion.div>
    </section>
  );
}
