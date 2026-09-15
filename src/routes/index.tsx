import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Background } from "@/components/site/Background";
import { Cursor } from "@/components/site/Cursor";
import { Loader } from "@/components/site/Loader";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Skills } from "@/components/site/Skills";
import { Work } from "@/components/site/Work";
import { Projects } from "@/components/site/Projects";
import { Credentials } from "@/components/site/Credentials";
import { Contact } from "@/components/site/Contact";
import { useAdminData } from "@/features/admin/context/AdminDataContext";

const TITLE = "Meganathan R — Full Stack & MERN Developer";
const DESC =
  "Portfolio of Meganathan R, a full stack MERN developer and AI enthusiast building fast, elegant web products. Explore projects, skills and experience.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { settings, profile } = useAdminData();

  useEffect(() => {
    const title =
      settings?.seo?.metaTitle ||
      settings?.general?.websiteTitle ||
      `${profile?.fullName || "Meganathan R"} — ${profile?.professionalTitle || "Full Stack Developer"}`;
    if (title && typeof document !== "undefined") {
      document.title = title;
    }
  }, [settings, profile]);

  return (
    <>
      <Loader />
      <Background />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Work />
        <Projects />
        <Credentials />
        <Contact />
      </main>
      <Toaster />
    </>
  );
}
