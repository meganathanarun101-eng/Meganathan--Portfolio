import p1 from '@/assets/p1.jpg';
import p2 from '@/assets/p2.jpg';
import p3 from '@/assets/p3.jpg';
import p4 from '@/assets/p4.jpg';
import p5 from '@/assets/p5.jpg';
import p6 from '@/assets/p6.jpg';
import profileImg from '@/assets/profile.jpg';

import {
  ProjectItem,
  SkillItem,
  EducationItem,
  ExperienceItem,
  ServiceItem,
  CertificateItem,
  AchievementItem,
  ResumeVersion,
  BlogPostItem,
  TestimonialItem,
  ProfileData,
  SiteSettings,
  CloudSyncConfig,
} from '../types/portfolio';
import { ContactMessage, AdminNotification } from '../types/messages';
import { getPortfolioServerDataFn, savePortfolioServerDataFn } from './serverPortfolioService';

const STORAGE_KEY_PORTFOLIO = 'meganathan_admin_portfolio_data_v1';

export interface PortfolioDataStore {
  profile: ProfileData;
  projects: ProjectItem[];
  skills: SkillItem[];
  education: EducationItem[];
  experience: ExperienceItem[];
  services: ServiceItem[];
  certificates: CertificateItem[];
  achievements: AchievementItem[];
  resume: ResumeVersion[];
  blogPosts: BlogPostItem[];
  testimonials: TestimonialItem[];
  messages: ContactMessage[];
  notifications: AdminNotification[];
  settings: SiteSettings;
  lastUpdated?: string;
  version?: number;
}

export const INITIAL_PORTFOLIO_DATA: PortfolioDataStore = {
  lastUpdated: '2025-01-01T00:00:00.000Z',
  version: 1,
  profile: {
    fullName: 'Meganathan R',
    professionalTitle: 'Full Stack & MERN Developer · AI Enthusiast',
    shortBio: 'I design and engineer fast, elegant web products — from pixel-perfect interfaces to resilient APIs and AI-powered experiences.',
    aboutMe: "I'm Meganathan.R, a full stack developer focused on the MERN ecosystem. I care about the small details — the easing curve of a transition, a query that drops from 900ms to 40ms, an interface that explains itself without a tooltip.\n\nRecently I've been pairing traditional web engineering with AI: retrieval pipelines, LLM-powered assistants, and tools that quietly remove busywork from people's days.",
    email: 'meganathanarun101@gmail.com',
    phone: '+91 8838574730',
    location: 'salem, Tamil Nadu, India',
    avatarUrl: profileImg,
    resumeUrl: '/resume.pdf',
    availabilityStatus: 'available',
    socialLinks: {
      github: 'https://github.com/meganathanarun101-eng/synth-port-showcase.git',
      linkedin: 'https://www.linkedin.com/in/meganathan-r-811771320?utm_source=share_via&utm_content=profile&utm_medium=member_android',
      instagram: 'https://www.instagram.com/megu_arun_350_m_s?igsh=MWpiZ3N0enJlam94eQ==',
      twitter: 'https://twitter.com/meganathan_dev',
    },
    metrics: {
      projectsCompleted: 24,
      certificatesCount: 15,
      hackathonsCount: 6,
      githubContributions: 1240,
    },
  },

  projects: [
    {
      id: 'proj-1',
      title: 'Student Job Finder',
      slug: 'student-job-finder',
      shortDescription: 'Job discovery platform matching students to internships with smart filters and alerts.',
      fullDescription: 'An end-to-end recruitment platform engineered for undergraduate students seeking internships and early-career tech jobs. Features real-time job application tracking, custom keyword alerts, automated resume parsing, and role-based matching algorithms built with Node.js and MongoDB.',
      image: p1,
      galleryImages: [p1, p2],
      demoUrl: 'https://example.com/student-job-finder',
      githubUrl: 'https://github.com/meganathan-r/student-job-finder',
      tags: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS'],
      category: 'Full Stack',
      featured: true,
      status: 'published',
      startDate: '2025-01-10',
      endDate: '2025-03-15',
      views: 1420,
      clicks: 480,
      githubClicks: 215,
      createdAt: '2025-03-16T10:00:00.000Z',
      updatedAt: '2025-04-01T14:30:00.000Z',
    },
    {
      id: 'proj-2',
      title: 'Portfolio Website',
      slug: 'portfolio-website',
      shortDescription: 'This site — a glassmorphic, motion-first personal portfolio built for speed and visual excellence.',
      fullDescription: 'Custom-designed portfolio built with modern motion design principles, custom aurora glowing cards, smooth magnetic interactions, and responsive layouts across all viewports.',
      image: p2,
      galleryImages: [p2, p3],
      demoUrl: 'https://example.com/portfolio',
      githubUrl: 'https://github.com/meganathan-r/portfolio',
      tags: ['React', 'Vite', 'Tailwind CSS', 'Motion', 'TanStack Router'],
      category: 'Frontend',
      featured: true,
      status: 'published',
      startDate: '2026-01-05',
      endDate: '2026-02-20',
      views: 3890,
      clicks: 1240,
      githubClicks: 650,
      createdAt: '2026-02-21T09:00:00.000Z',
      updatedAt: '2026-03-01T11:20:00.000Z',
    },
    {
      id: 'proj-3',
      title: 'AI Chatbot',
      slug: 'ai-chatbot',
      shortDescription: 'Context-aware assistant with streaming responses and document retrieval capabilities.',
      fullDescription: 'Intelligent conversational assistant with vector embeddings, chunked document retrieval (RAG), streaming token rendering, and latency-optimized inference pipelines.',
      image: p3,
      galleryImages: [p3, p4],
      demoUrl: 'https://example.com/ai-chatbot',
      githubUrl: 'https://github.com/meganathan-r/ai-chatbot',
      tags: ['Python', 'React', 'LLM', 'FastAPI', 'LangChain'],
      category: 'AI',
      featured: true,
      status: 'published',
      startDate: '2025-06-01',
      endDate: '2025-08-15',
      views: 2150,
      clicks: 820,
      githubClicks: 410,
      createdAt: '2025-08-16T12:00:00.000Z',
      updatedAt: '2025-09-02T16:00:00.000Z',
    },
    {
      id: 'proj-4',
      title: 'E-Commerce Website',
      slug: 'ecommerce-website',
      shortDescription: 'Storefront with cart, payments, order tracking and an admin inventory panel.',
      fullDescription: 'High-performance digital marketplace featuring Stripe checkout integration, webhook-driven inventory state sync, JWT session security, and dynamic search filters.',
      image: p4,
      galleryImages: [p4, p5],
      demoUrl: 'https://example.com/ecommerce',
      githubUrl: 'https://github.com/meganathan-r/ecommerce',
      tags: ['MERN', 'Stripe', 'Redux', 'Node.js', 'MongoDB'],
      category: 'Full Stack',
      featured: false,
      status: 'published',
      startDate: '2024-09-01',
      endDate: '2024-11-30',
      views: 1890,
      clicks: 530,
      githubClicks: 280,
      createdAt: '2024-12-01T10:00:00.000Z',
      updatedAt: '2025-01-15T08:30:00.000Z',
    },
    {
      id: 'proj-5',
      title: 'College Management System',
      slug: 'college-management-system',
      shortDescription: 'Attendance, results and staff workflows unified in one role-based dashboard.',
      fullDescription: 'Comprehensive institutional ERP system deployed for college administration. Includes attendance barcode scans, semester marks processing, student fee tracking, and automated report generation.',
      image: p5,
      galleryImages: [p5, p6],
      demoUrl: 'https://example.com/college-ms',
      githubUrl: 'https://github.com/meganathan-r/college-management',
      tags: ['React', 'Node.js', 'SQL', 'Express', 'JWT'],
      category: 'Full Stack',
      featured: false,
      status: 'published',
      startDate: '2024-03-01',
      endDate: '2024-07-20',
      views: 1670,
      clicks: 410,
      githubClicks: 195,
      createdAt: '2024-07-25T11:00:00.000Z',
      updatedAt: '2024-08-10T14:15:00.000Z',
    },
    {
      id: 'proj-6',
      title: 'Weather App',
      slug: 'weather-app',
      shortDescription: 'Location-aware forecasts with animated conditions and offline caching.',
      fullDescription: 'PWA weather forecast application built with OpenWeather API, dynamic atmospheric particle animations, 7-day extended forecasts, and offline service worker caching.',
      image: p6,
      galleryImages: [p6, p1],
      demoUrl: 'https://example.com/weather',
      githubUrl: 'https://github.com/meganathan-r/weather-app',
      tags: ['JavaScript', 'API', 'PWA', 'Tailwind CSS'],
      category: 'Frontend',
      featured: false,
      status: 'published',
      startDate: '2023-11-01',
      endDate: '2023-12-15',
      views: 980,
      clicks: 290,
      githubClicks: 140,
      createdAt: '2023-12-16T15:00:00.000Z',
      updatedAt: '2024-01-05T09:00:00.000Z',
    },
  ],

  skills: [
    { id: 'sk-1', name: 'HTML', level: 95, category: 'Frontend', sortOrder: 1, featured: true },
    { id: 'sk-2', name: 'CSS', level: 92, category: 'Frontend', sortOrder: 2, featured: true },
    { id: 'sk-3', name: 'JavaScript', level: 90, category: 'Programming', sortOrder: 3, featured: true },
    { id: 'sk-4', name: 'React', level: 91, category: 'Frontend', sortOrder: 4, featured: true },
    { id: 'sk-5', name: 'Node.js', level: 86, category: 'Backend', sortOrder: 5, featured: true },
    { id: 'sk-6', name: 'Express', level: 84, category: 'Backend', sortOrder: 6, featured: true },
    { id: 'sk-7', name: 'MongoDB', level: 82, category: 'Database', sortOrder: 7, featured: true },
    { id: 'sk-8', name: 'Python', level: 80, category: 'Programming', sortOrder: 8, featured: true },
    { id: 'sk-9', name: 'Git', level: 88, category: 'Tools', sortOrder: 9, featured: true },
    { id: 'sk-10', name: 'GitHub', level: 90, category: 'Tools', sortOrder: 10, featured: true },
    { id: 'sk-11', name: 'SQL', level: 78, category: 'Database', sortOrder: 11, featured: true },
    { id: 'sk-12', name: 'TypeScript', level: 85, category: 'Programming', sortOrder: 12, featured: false },
    { id: 'sk-13', name: 'Tailwind CSS', level: 94, category: 'Frontend', sortOrder: 13, featured: false },
    { id: 'sk-14', name: 'FastAPI', level: 75, category: 'Backend', sortOrder: 14, featured: false },
  ],

  education: [
    {
      id: 'edu-1',
      institution: 'JKKN College of Engineering Technology, Anna University, Tamil Nadu',
      degree: 'B.Tech',
      field: 'Information Technology',
      startDate: '2024',
      endDate: '2028',
      grade: 'CGPA 8.7 / 10',
      description: 'Specialisation in full stack systems, distributed databases and applied machine learning.',
      location: 'Namakkal / Erode, Tamil Nadu, India',
      sortOrder: 1,
    },
    {
      id: 'edu-2',
      institution: 'KALAIMAGAL VIDHYASHRAM MATRICULATION HIGHER SECONDARY SCHOOL',
      degree: 'Higher Secondary',
      field: 'Bio-Maths',
      startDate: '2021',
      endDate: '2023',
      grade: '65%',
      description: 'Core foundation in mathematics, logical problem solving and science.',
      location: 'Tamil Nadu, India',
      sortOrder: 2,
    },
    {
      id: 'edu-3',
      institution: "St. Mary's Matriculation School",
      degree: 'SSLC',
      field: 'Secondary School Education',
      startDate: '2020',
      endDate: '2021',
      grade: '55%',
      description: 'General high school curriculum with computer science interest.',
      location: 'Tamil Nadu, India',
      sortOrder: 3,
    },
  ],

  experience: [
    {
      id: 'exp-1',
      company: 'Nexora Technologies',
      position: 'Full Stack Developer Intern',
      employmentType: 'Internship',
      startDate: '2025-01',
      endDate: 'Present',
      currentlyWorking: true,
      location: 'Remote',
      description: [
        'Shipped a multi-tenant dashboard in React + Node serving 4k monthly users.',
        'Cut API p95 latency by 62% with query batching and Redis caching.',
        'Collaborated directly with senior engineers on schema migrations and CI/CD pipelines.',
      ],
      technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Redis'],
      published: true,
      sortOrder: 1,
    },
    {
      id: 'exp-2',
      company: 'Independent / Freelance',
      position: 'Freelance Web Developer',
      employmentType: 'Freelance',
      startDate: '2024-01',
      endDate: '2025-01',
      currentlyWorking: false,
      location: 'Hybrid / Salem',
      description: [
        'Delivered 12+ marketing sites and admin panels for local businesses.',
        'Built reusable MERN starter kit that halved project setup time.',
        'Integrated automated payment processing via Stripe and Razorpay.',
      ],
      technologies: ['React', 'Tailwind CSS', 'Node.js', 'MongoDB'],
      published: true,
      sortOrder: 2,
    },
    {
      id: 'exp-3',
      company: 'Open Source Community',
      position: 'Open Source Contributor',
      employmentType: 'Part-time',
      startDate: '2023-06',
      endDate: 'Present',
      currentlyWorking: true,
      location: 'Remote',
      description: [
        'Contributed UI and accessibility fixes to React tooling projects.',
        'Maintain small utility libraries with 400+ combined downloads.',
        'Active participant in web dev community discussions.',
      ],
      technologies: ['TypeScript', 'React', 'Git', 'GitHub Actions'],
      published: true,
      sortOrder: 3,
    },
  ],

  services: [
    {
      id: 'srv-1',
      name: 'Web Development',
      description: 'Marketing sites and product UIs built with React, Vite and Tailwind for lightning-fast loads.',
      iconName: 'LayoutTemplate',
      features: ['Pixel-perfect UI design', 'Lighthouse 95+ performance', 'SEO and OpenGraph setup', 'Mobile-first layout'],
      startingPrice: '$250',
      featured: true,
      published: true,
    },
    {
      id: 'srv-2',
      name: 'Backend & APIs',
      description: 'Node, Express and MongoDB services designed for clarity, scale, and strong data integrity.',
      iconName: 'Server',
      features: ['RESTful architecture', 'JWT authentication', 'Database schema design', 'Rate limiting & security'],
      startingPrice: '$350',
      featured: true,
      published: true,
    },
    {
      id: 'srv-3',
      name: 'AI Integration',
      description: 'Chat assistants, RAG document search and workflow automation wired cleanly into real products.',
      iconName: 'Bot',
      features: ['OpenAI / Claude API hooks', 'Vector database search', 'Streaming response rendering', 'Prompt engineering'],
      startingPrice: '$450',
      featured: true,
      published: true,
    },
    {
      id: 'srv-4',
      name: 'Responsive UI/UX Development',
      description: 'Interfaces that feel native and seamless from a 360px smartphone to an ultra-wide workstation monitor.',
      iconName: 'Smartphone',
      features: ['Fluid typography & spacing', 'Custom micro-animations', 'Touch gesture support', 'Accessible components'],
      startingPrice: '$200',
      featured: false,
      published: true,
    },
    {
      id: 'srv-5',
      name: 'Performance Audits',
      description: 'Core Web Vitals remediation: code splitting, bundle trimming, caching policies, and image pipeline strategy.',
      iconName: 'Gauge',
      features: ['Bundle size analysis', 'Render cycle profiling', 'Asset compression', 'Cache headers configuration'],
      startingPrice: '$150',
      featured: false,
      published: true,
    },
    {
      id: 'srv-6',
      name: 'Maintenance & Upgrades',
      description: 'Ongoing feature development, framework upgrades, security patches, and dependable bug triage.',
      iconName: 'Boxes',
      features: ['Dependency security audits', 'React 19 upgrades', 'Refactoring legacy spaghetti', 'Monthly uptime review'],
      startingPrice: '$100/mo',
      featured: false,
      published: true,
    },
  ],

  certificates: [
    {
      id: 'cert-1',
      name: 'Full Stack Web Development',
      issuingOrganization: 'Meta / Coursera',
      issueDate: '2025',
      credentialId: 'META-FS-984210',
      credentialUrl: 'https://coursera.org/verify/demo-meta-fs',
      description: 'Comprehensive professional certificate covering React, backend APIs, databases, and deployment.',
      featured: true,
      published: true,
    },
    {
      id: 'cert-2',
      name: 'MongoDB Developer Associate',
      issuingOrganization: 'MongoDB University',
      issueDate: '2025',
      credentialId: 'MDB-DEV-77192',
      credentialUrl: 'https://university.mongodb.com/certificates/demo',
      description: 'Official certification in document database modeling, indexing strategies, and aggregation frameworks.',
      featured: true,
      published: true,
    },
    {
      id: 'cert-3',
      name: 'Machine Learning Specialization',
      issuingOrganization: 'DeepLearning.AI',
      issueDate: '2024',
      credentialId: 'DLAI-ML-41029',
      credentialUrl: 'https://coursera.org/verify/demo-dlai',
      description: 'Foundations of supervised learning, neural networks, and ML production workflows.',
      featured: true,
      published: true,
    },
    {
      id: 'cert-4',
      name: 'Python for Everybody',
      issuingOrganization: 'University of Michigan',
      issueDate: '2024',
      credentialId: 'UMICH-PY-12847',
      credentialUrl: 'https://coursera.org/verify/demo-umich',
      description: 'Data structures, web scraping, and database interfaces in Python.',
      featured: false,
      published: true,
    },
    {
      id: 'cert-5',
      name: 'Responsive Web Design',
      issuingOrganization: 'freeCodeCamp',
      issueDate: '2023',
      credentialId: 'FCC-RWD-5519',
      credentialUrl: 'https://freecodecamp.org/certification/demo',
      description: 'CSS Grid, Flexbox, responsive typography, and accessibility best practices.',
      featured: false,
      published: true,
    },
    {
      id: 'cert-6',
      name: 'Git & GitHub Essentials',
      issuingOrganization: 'GitHub',
      issueDate: '2023',
      credentialId: 'GH-ESS-9921',
      credentialUrl: 'https://github.com/certification/demo',
      description: 'Branching models, pull request workflows, merge conflict resolution, and GitHub Actions.',
      featured: false,
      published: true,
    },
  ],

  achievements: [
    {
      id: 'ach-1',
      title: 'Winner — Smart Campus Hackathon',
      description: 'Built an automated student attendance and face verification system in 24 hours under intense competition.',
      date: '2025',
      organization: 'Anna University Zone Hackathon',
      link: 'https://github.com/meganathan-r/hackathon-winner',
      iconType: 'trophy',
      featured: true,
      published: true,
    },
    {
      id: 'ach-2',
      title: 'Top 5% — National Coding Challenge',
      description: 'Ranked among top performers out of 12,000+ collegiate participants in algorithmic problem solving.',
      date: '2024',
      organization: 'National Tech Olympiad',
      iconType: 'medal',
      featured: true,
      published: true,
    },
    {
      id: 'ach-3',
      title: '500+ DSA Problems Solved',
      description: 'Consistent daily problem solving streak across LeetCode, HackerRank, and CodeChef focusing on graph theory and dynamic programming.',
      date: '2024 — Present',
      organization: 'LeetCode & Competitive Platforms',
      link: 'https://leetcode.com/demo',
      iconType: 'star',
      featured: true,
      published: true,
    },
    {
      id: 'ach-4',
      title: 'Tech Lead — College Dev Club',
      description: 'Mentored 40+ junior developers through an intensive 8-week MERN bootcamp and guided 6 open-source final projects.',
      date: '2024',
      organization: 'JKKN Dev Community',
      iconType: 'award',
      featured: false,
      published: true,
    },
  ],

  resume: [
    {
      id: 'res-v1-2',
      version: 'v1.2',
      fileName: 'Meganathan_R_FullStack_Resume.pdf',
      fileSize: '248 KB',
      uploadDate: '2026-02-15',
      downloadUrl: '/resume.pdf',
      isActive: true,
      summary: 'Updated with latest Nexora Tech internship accomplishments and recent MERN + AI projects.',
    },
    {
      id: 'res-v1-1',
      version: 'v1.1',
      fileName: 'Meganathan_Resume_2025.pdf',
      fileSize: '232 KB',
      uploadDate: '2025-10-10',
      downloadUrl: '/resume.pdf',
      isActive: false,
      summary: 'Added MongoDB certification and Smart Campus Hackathon victory.',
    },
    {
      id: 'res-v1-0',
      version: 'v1.0',
      fileName: 'Meganathan_Resume_Initial.pdf',
      fileSize: '210 KB',
      uploadDate: '2025-03-01',
      downloadUrl: '/resume.pdf',
      isActive: false,
      summary: 'Initial one-page resume format.',
    },
  ],

  blogPosts: [
    {
      id: 'post-1',
      title: 'Why I stopped fighting the React re-render',
      slug: 'why-i-stopped-fighting-react-re-render',
      excerpt: 'Most React performance guides tell you to wrap everything in useMemo. Here is what actually matters when profiling real web applications.',
      content: `# Why I stopped fighting the React re-render\n\nWhen developers first hit performance bottlenecks in React, their instinctive reaction is to sprinkle \`useMemo\` and \`useCallback\` everywhere like magical pixie dust. I spent months doing the same thing.\n\n## The Cost of Premature Optimization\n\nEvery \`useMemo\` and \`useCallback\` has a measurable memory and comparison cost. In 90% of cases, standard component re-renders take less than 1 millisecond. If the component tree is clean, re-renders are essentially free.\n\n### Where to actually optimize:\n- **Lift state down**: Keep state as close to the leaves of your component tree as possible.\n- **Component composition**: Pass components as \`children\` so React can skip reconciliation.\n- **Virtualize large lists**: Rendering 1,000 DOM nodes will always crawl, memoized or not.\n\n## Conclusion\nMeasure first with React Profiler before adding defensive memoization.`,
      coverImage: p2,
      category: 'Engineering',
      tags: ['React', 'Performance', 'JavaScript'],
      author: 'Meganathan R',
      seoTitle: 'Why I Stopped Fighting React Re-renders | Meganathan R',
      seoDescription: 'Pragmatic guidance on React performance profiling and why component composition beats defensive useMemo.',
      readTime: '6 min',
      publishedDate: '2026-07-15',
      status: 'published',
      views: 1240,
    },
    {
      id: 'post-2',
      title: 'A pragmatic RAG setup for small products',
      slug: 'pragmatic-rag-setup-small-products',
      excerpt: 'You do not need a complex cluster of vector databases to build a helpful AI assistant. Here is a lean architecture with FastAPI and embeddings.',
      content: `# A pragmatic RAG setup for small products\n\nRetrieval Augmented Generation (RAG) is often over-engineered with multi-node clusters and complex graph databases. For 95% of small products, a streamlined setup with local vector indexing and lightweight caching yields 10x faster iteration.\n\n## The Lean Stack\n1. **FastAPI** for low-latency asynchronous endpoint handling\n2. **LiteLLM / Ollama** for local testing\n3. **Chunking Strategy**: Overlapping windows of 400 tokens with semantic boundaries\n\nStay focused on your data quality before adding pipeline complexity.`,
      coverImage: p3,
      category: 'AI & Systems',
      tags: ['Python', 'AI', 'RAG', 'FastAPI'],
      author: 'Meganathan R',
      seoTitle: 'Lean RAG Architecture for Small Web Products',
      seoDescription: 'Step-by-step guide to building high-performance RAG without enterprise bloat.',
      readTime: '9 min',
      publishedDate: '2026-05-20',
      status: 'published',
      views: 940,
    },
    {
      id: 'post-3',
      title: 'Designing motion that does not annoy people',
      slug: 'designing-motion-that-does-not-annoy-people',
      excerpt: 'Animations should guide attention, not perform cartwheels. Easing curves, spring physics, and subtle micro-delight.',
      content: `# Designing motion that does not annoy people\n\nAnimation on the web has a bad reputation because developers often over-animate every button hover and paragraph entrance.\n\n## The Rule of 200ms\nIf an animation takes longer than 300ms, users perceive it as lag. Interactive feedback should complete in 150-250ms with a crisp ease-out curve like \`cubic-bezier(0.16, 1, 0.3, 1)\`.\n\nKeep motion subtle and functional.`,
      coverImage: p4,
      category: 'Design & UX',
      tags: ['Design', 'Motion', 'CSS', 'UX'],
      author: 'Meganathan R',
      seoTitle: 'Designing Subtle Motion for Modern Web Interfaces',
      seoDescription: 'How to use spring physics and easing curves to make websites feel buttery smooth without being distracting.',
      readTime: '5 min',
      publishedDate: '2026-03-10',
      status: 'published',
      views: 1820,
    },
  ],

  testimonials: [
    {
      id: 'tst-1',
      name: 'Priya Sundaram',
      role: 'Product Manager',
      company: 'Nexora',
      quote: 'Meganathan turned a vague brief into a product our team actually enjoys using. Fast, thoughtful and unusually detail-obsessed.',
      rating: 5,
      linkedinUrl: 'https://linkedin.com/in/demo',
      featured: true,
      published: true,
      sortOrder: 1,
    },
    {
      id: 'tst-2',
      name: 'Arjun Menon',
      role: 'Founder',
      company: 'Kadai Retail',
      quote: 'He rebuilt our storefront in three weeks and load time dropped by half. Communication was clear the entire way.',
      rating: 5,
      linkedinUrl: 'https://linkedin.com/in/demo',
      featured: true,
      published: true,
      sortOrder: 2,
    },
    {
      id: 'tst-3',
      name: 'Dr. Latha R',
      role: 'Faculty, CSE Department',
      company: 'College of Engineering',
      quote: 'One of the rare developers who cares equally about the API contract and the animation curve.',
      rating: 5,
      linkedinUrl: 'https://linkedin.com/in/demo',
      featured: true,
      published: true,
      sortOrder: 3,
    },
  ],

  messages: [
    {
      id: 'msg-1',
      senderName: 'Vignesh Kumar',
      email: 'vignesh.k@cloudcraft.io',
      phone: '+91 94421 88391',
      subject: 'Freelance Full Stack Project Enquiry',
      message: 'Hi Meganathan, we saw your Student Job Finder and E-Commerce builds. We are looking to build a multi-tenant client portal with custom reports and Stripe billing. Are you available for a 4-week freelance contract starting next month?',
      date: '2026-09-08T14:20:00.000Z',
      status: 'unread',
      priority: 'high',
      starred: true,
    },
    {
      id: 'msg-2',
      senderName: 'Ananya Sharma',
      email: 'ananya@techventures.co',
      subject: 'Frontend / Full Stack Internship Opportunity',
      message: 'Hello Meganathan, your portfolio is exceptionally well crafted. We have an upcoming summer engineering residency in Bangalore working on AI web tooling. Would love to connect over a brief introductory chat!',
      date: '2026-09-05T09:45:00.000Z',
      status: 'read',
      priority: 'urgent',
      starred: true,
      replyHistory: [
        {
          id: 'rep-1',
          body: 'Hi Ananya, thank you so much for reaching out! I would love to chat. I am available this Thursday after 4 PM IST.',
          sentAt: '2026-09-05T11:30:00.000Z',
          sentBy: 'Meganathan R',
        },
      ],
    },
    {
      id: 'msg-3',
      senderName: 'Rahul Verma',
      email: 'rahul.verma@fintechpulse.in',
      subject: 'Question regarding your AI Chatbot architecture',
      message: 'Hey Meganathan, reading your notes on RAG architecture. What embedding model did you use for the streaming chatbot demo? Loved the responsive interface!',
      date: '2026-09-02T16:10:00.000Z',
      status: 'replied',
      priority: 'normal',
      starred: false,
    },
    {
      id: 'msg-4',
      senderName: 'Karthik Raja',
      email: 'karthik@innovatedigital.com',
      subject: 'Collaborative Open Source Project',
      message: 'Hi Meganathan, loved your UI components repository. Would you be interested in speaking at our local React meetup next month?',
      date: '2026-08-28T18:00:00.000Z',
      status: 'archived',
      priority: 'normal',
      starred: false,
    },
  ],

  notifications: [
    {
      id: 'notif-1',
      title: 'New Contact Enquiry',
      message: 'Vignesh Kumar sent a freelance project enquiry regarding a client portal.',
      timestamp: '2 hours ago',
      read: false,
      type: 'message',
      link: '/admin/messages',
    },
    {
      id: 'notif-2',
      title: 'Traffic Milestone',
      message: 'Your portfolio crossed 1,300 unique visitors this month (+24.8%).',
      timestamp: '1 day ago',
      read: false,
      type: 'visitor',
      link: '/admin/analytics',
    },
    {
      id: 'notif-3',
      title: 'Resume Downloaded',
      message: 'Recruiter from Bangalore downloaded your v1.2 PDF resume.',
      timestamp: '2 days ago',
      read: true,
      type: 'resume',
      link: '/admin/resume',
    },
    {
      id: 'notif-4',
      title: 'Project Featured',
      message: 'Student Job Finder marked as featured project.',
      timestamp: '3 days ago',
      read: true,
      type: 'project',
      link: '/admin/projects',
    },
  ],

  settings: {
    general: {
      websiteName: 'Meganathan R Portfolio',
      websiteTitle: 'Meganathan R — Full Stack & MERN Developer',
      websiteDescription: 'Portfolio of Meganathan R, full stack MERN developer and AI enthusiast building fast, elegant web products.',
      logoText: 'Meganathan.R',
      faviconUrl: '/favicon.ico',
      contactEmail: 'meganathanarun101@gmail.com',
    },
    appearance: {
      theme: 'dark',
      accentColor: 'violet',
      sidebarDefaultCollapsed: false,
    },
    social: {
      github: 'https://github.com/meganathanarun101-eng/synth-port-showcase.git',
      linkedin: 'https://www.linkedin.com/in/meganathan-r-811771320?utm_source=share_via&utm_content=profile&utm_medium=member_android',
      instagram: 'https://www.instagram.com/megu_arun_350_m_s?igsh=MWpiZ3N0enJlam94eQ==',
      email: 'meganathanarun101@gmail.com',
      phone: '+91 8838574730',
    },
    seo: {
      metaTitle: 'Meganathan R — Full Stack & MERN Developer',
      metaDescription: 'Explore projects, technical skills, credentials, and experience of Meganathan R.',
      keywords: 'Meganathan, MERN Stack, React Developer, Full Stack, AI Developer, Web Portfolio, Tamil Nadu',
      ogImage: '/assets/profile.jpg',
    },
    cloudSync: {
      provider: 'none',
      autoSync: true,
    },
  },
};

/**
 * Centered Portfolio Data Store
 * Persists changes in localStorage so any update is immediate and surviving refreshes.
 *
 * ARCHITECTURAL NOTE FOR REAL BACKEND:
 * To connect a real database (Supabase, Firebase, MongoDB, PostgreSQL):
 * Replace `loadStore()` and `saveStore()` with async API/SDK calls (e.g. `supabase.from('projects').select('*')`).
 * The interface of `portfolioDataService` matches REST/GraphQL services.
 */
export const portfolioDataService = {
  loadStore(): PortfolioDataStore {
    if (typeof window === 'undefined') return INITIAL_PORTFOLIO_DATA;

    try {
      const raw = localStorage.getItem(STORAGE_KEY_PORTFOLIO);
      if (!raw) {
        this.saveStore(INITIAL_PORTFOLIO_DATA);
        return INITIAL_PORTFOLIO_DATA;
      }
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error loading portfolio store, using fallback', e);
      return INITIAL_PORTFOLIO_DATA;
    }
  },

  saveStore(data: PortfolioDataStore, skipServerSync = false): void {
    if (typeof window === 'undefined') return;
    try {
      data.lastUpdated = new Date().toISOString();
      data.version = (data.version || 1) + 1;
      localStorage.setItem(STORAGE_KEY_PORTFOLIO, JSON.stringify(data));
      window.dispatchEvent(new Event('portfolio_store_updated'));
    } catch (e: any) {
      console.error('Error saving portfolio store', e);
      if (e?.name === 'QuotaExceededError' || e?.code === 22) {
        console.warn('Storage limit reached! Please optimize uploaded images.');
      }
    }

    if (!skipServerSync) {
      this.pushToServer(data).catch((err) => {
        console.warn('Auto background server sync skipped/failed:', err);
      });
    }
  },

  async pushToCloudDirect(data: PortfolioDataStore): Promise<boolean> {
    const cfg = data.settings?.cloudSync;
    if (!cfg || cfg.provider === 'none') return false;

    try {
      if (cfg.provider === 'vercel-kv' && cfg.vercelKvUrl && cfg.vercelKvToken) {
        const endpoint = `${cfg.vercelKvUrl.replace(/\/$/, '')}/set/meganathan_portfolio_store`;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${cfg.vercelKvToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        return res.ok;
      }

      if (cfg.provider === 'jsonbin' && cfg.jsonbinBinId && cfg.jsonbinApiKey) {
        const res = await fetch(`https://api.jsonbin.io/v3/b/${cfg.jsonbinBinId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': cfg.jsonbinApiKey,
          },
          body: JSON.stringify(data),
        });
        return res.ok;
      }

      if (cfg.provider === 'supabase' && cfg.supabaseUrl && cfg.supabaseAnonKey) {
        const res = await fetch(`${cfg.supabaseUrl.replace(/\/$/, '')}/rest/v1/portfolio_store`, {
          method: 'POST',
          headers: {
            apikey: cfg.supabaseAnonKey,
            Authorization: `Bearer ${cfg.supabaseAnonKey}`,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates',
          },
          body: JSON.stringify({
            id: 'default',
            data,
            lastUpdated: data.lastUpdated || new Date().toISOString(),
          }),
        });
        return res.ok;
      }
    } catch (e) {
      console.warn('Direct cloud push warning:', e);
    }
    return false;
  },

  async pullFromCloudDirect(cfg?: CloudSyncConfig): Promise<PortfolioDataStore | null> {
    const config = cfg || this.loadStore().settings?.cloudSync;
    if (!config || config.provider === 'none') return null;

    try {
      if (config.provider === 'vercel-kv' && config.vercelKvUrl && config.vercelKvToken) {
        const endpoint = `${config.vercelKvUrl.replace(/\/$/, '')}/get/meganathan_portfolio_store`;
        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${config.vercelKvToken}` },
          cache: 'no-store',
        });
        if (!res.ok) return null;
        const json = await res.json();
        if (!json.result) return null;
        return typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
      }

      if (config.provider === 'jsonbin' && config.jsonbinBinId && config.jsonbinApiKey) {
        const res = await fetch(`https://api.jsonbin.io/v3/b/${config.jsonbinBinId}/latest`, {
          headers: { 'X-Master-Key': config.jsonbinApiKey },
          cache: 'no-store',
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json.record as PortfolioDataStore;
      }

      if (config.provider === 'supabase' && config.supabaseUrl && config.supabaseAnonKey) {
        const endpoint = `${config.supabaseUrl.replace(/\/$/, '')}/rest/v1/portfolio_store?id=eq.default&select=data,lastUpdated`;
        const res = await fetch(endpoint, {
          headers: {
            apikey: config.supabaseAnonKey,
            Authorization: `Bearer ${config.supabaseAnonKey}`,
          },
          cache: 'no-store',
        });
        if (!res.ok) return null;
        const list = await res.json();
        if (Array.isArray(list) && list.length > 0) {
          return list[0].data as PortfolioDataStore;
        }
      }
    } catch (e) {
      console.warn('Direct cloud pull warning:', e);
    }
    return null;
  },

  async pushToServer(data?: PortfolioDataStore): Promise<{ success: boolean; lastUpdated?: string }> {
    try {
      const storeToSave = data || this.loadStore();
      const timestamp = storeToSave.lastUpdated || new Date().toISOString();
      storeToSave.lastUpdated = timestamp;

      // Also trigger direct cloud push if configured
      this.pushToCloudDirect(storeToSave).catch(() => {});

      const res = await savePortfolioServerDataFn({
        data: {
          store: storeToSave,
          lastUpdated: timestamp,
        },
      });
      return { success: true, lastUpdated: res.lastUpdated };
    } catch (err) {
      console.warn('Failed to push portfolio to server, attempting direct cloud fallback:', err);
      const storeToSave = data || this.loadStore();
      const directSuccess = await this.pushToCloudDirect(storeToSave);
      return { success: directSuccess, lastUpdated: storeToSave.lastUpdated };
    }
  },

  async syncWithServer(forcePush = false): Promise<{ updated: boolean; source: 'server' | 'local' | 'none' }> {
    if (typeof window === 'undefined') return { updated: false, source: 'none' };

    try {
      const serverRes = await getPortfolioServerDataFn();
      const localStore = this.loadStore();

      let serverStore = serverRes && serverRes.success ? serverRes.store : null;
      let serverTime = serverRes && serverRes.lastUpdated ? new Date(serverRes.lastUpdated).getTime() : 0;
      const localTime = localStore.lastUpdated ? new Date(localStore.lastUpdated).getTime() : 0;

      // If server returned no cloud data, try direct client cloud pull
      if (!serverStore) {
        const directData = await this.pullFromCloudDirect();
        if (directData && directData.lastUpdated) {
          serverStore = directData;
          serverTime = new Date(directData.lastUpdated).getTime();
        }
      }

      if (forcePush || (localTime > serverTime && localStore.lastUpdated && serverStore)) {
        await this.pushToServer(localStore);
        return { updated: false, source: 'local' };
      }

      if (serverStore && (serverTime > localTime || !localStore.lastUpdated)) {
        this.saveStore(serverStore, true);
        return { updated: true, source: 'server' };
      }

      if (!serverStore && localStore) {
        await this.pushToServer(localStore);
        return { updated: false, source: 'local' };
      }

      return { updated: false, source: 'none' };
    } catch (err) {
      console.warn('syncWithServer error, attempting direct cloud fallback:', err);
      try {
        const directData = await this.pullFromCloudDirect();
        const localStore = this.loadStore();
        if (directData && directData.lastUpdated) {
          const cloudTime = new Date(directData.lastUpdated).getTime();
          const localTime = localStore.lastUpdated ? new Date(localStore.lastUpdated).getTime() : 0;
          if (cloudTime > localTime) {
            this.saveStore(directData, true);
            return { updated: true, source: 'server' };
          }
        }
      } catch {
        // ignore
      }
      return { updated: false, source: 'none' };
    }
  },

  generateMobileSyncUrl(): string {
    if (typeof window === 'undefined') return '';
    try {
      const store = this.loadStore();
      const jsonStr = JSON.stringify(store);
      const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
      const url = new URL(window.location.origin);
      url.searchParams.set('sync_data', encoded);
      return url.toString();
    } catch (e) {
      console.error('Failed to generate sync URL', e);
      return window.location.origin;
    }
  },

  applySyncData(encoded: string): boolean {
    try {
      const jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(encoded))));
      const parsed = JSON.parse(jsonStr);
      if (parsed.profile && parsed.projects) {
        this.saveStore(parsed);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to apply sync data', e);
      return false;
    }
  },

  resetDefaults(): PortfolioDataStore {
    this.saveStore(INITIAL_PORTFOLIO_DATA);
    return INITIAL_PORTFOLIO_DATA;
  },

  exportJSON(): string {
    const store = this.loadStore();
    return JSON.stringify(store, null, 2);
  },

  importJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.profile || !parsed.projects) {
        throw new Error('Invalid portfolio schema');
      }
      this.saveStore(parsed);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  },

  // CRUD helpers
  getProjects(): ProjectItem[] {
    return this.loadStore().projects;
  },

  saveProject(project: ProjectItem): ProjectItem[] {
    const store = this.loadStore();
    const index = store.projects.findIndex((p) => p.id === project.id);
    if (index >= 0) {
      store.projects[index] = { ...project, updatedAt: new Date().toISOString() };
    } else {
      store.projects.unshift({
        ...project,
        id: project.id || `proj-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    this.saveStore(store);
    return store.projects;
  },

  deleteProject(id: string): ProjectItem[] {
    const store = this.loadStore();
    store.projects = store.projects.filter((p) => p.id !== id);
    this.saveStore(store);
    return store.projects;
  },

  // Skills
  saveSkill(skill: SkillItem): SkillItem[] {
    const store = this.loadStore();
    const index = store.skills.findIndex((s) => s.id === skill.id);
    if (index >= 0) {
      store.skills[index] = skill;
    } else {
      store.skills.push({ ...skill, id: skill.id || `sk-${Date.now()}` });
    }
    this.saveStore(store);
    return store.skills;
  },

  deleteSkill(id: string): SkillItem[] {
    const store = this.loadStore();
    store.skills = store.skills.filter((s) => s.id !== id);
    this.saveStore(store);
    return store.skills;
  },

  // Education
  saveEducation(edu: EducationItem): EducationItem[] {
    const store = this.loadStore();
    const index = store.education.findIndex((e) => e.id === edu.id);
    if (index >= 0) {
      store.education[index] = edu;
    } else {
      store.education.push({ ...edu, id: edu.id || `edu-${Date.now()}` });
    }
    this.saveStore(store);
    return store.education;
  },

  deleteEducation(id: string): EducationItem[] {
    const store = this.loadStore();
    store.education = store.education.filter((e) => e.id !== id);
    this.saveStore(store);
    return store.education;
  },

  // Experience
  saveExperience(exp: ExperienceItem): ExperienceItem[] {
    const store = this.loadStore();
    const index = store.experience.findIndex((e) => e.id === exp.id);
    if (index >= 0) {
      store.experience[index] = exp;
    } else {
      store.experience.unshift({ ...exp, id: exp.id || `exp-${Date.now()}` });
    }
    this.saveStore(store);
    return store.experience;
  },

  deleteExperience(id: string): ExperienceItem[] {
    const store = this.loadStore();
    store.experience = store.experience.filter((e) => e.id !== id);
    this.saveStore(store);
    return store.experience;
  },

  // Services
  saveService(srv: ServiceItem): ServiceItem[] {
    const store = this.loadStore();
    const index = store.services.findIndex((s) => s.id === srv.id);
    if (index >= 0) {
      store.services[index] = srv;
    } else {
      store.services.push({ ...srv, id: srv.id || `srv-${Date.now()}` });
    }
    this.saveStore(store);
    return store.services;
  },

  deleteService(id: string): ServiceItem[] {
    const store = this.loadStore();
    store.services = store.services.filter((s) => s.id !== id);
    this.saveStore(store);
    return store.services;
  },

  // Certificates
  saveCertificate(cert: CertificateItem): CertificateItem[] {
    const store = this.loadStore();
    const index = store.certificates.findIndex((c) => c.id === cert.id);
    if (index >= 0) {
      store.certificates[index] = cert;
    } else {
      store.certificates.push({ ...cert, id: cert.id || `cert-${Date.now()}` });
    }
    this.saveStore(store);
    return store.certificates;
  },

  deleteCertificate(id: string): CertificateItem[] {
    const store = this.loadStore();
    store.certificates = store.certificates.filter((c) => c.id !== id);
    this.saveStore(store);
    return store.certificates;
  },

  // Achievements
  saveAchievement(ach: AchievementItem): AchievementItem[] {
    const store = this.loadStore();
    const index = store.achievements.findIndex((a) => a.id === ach.id);
    if (index >= 0) {
      store.achievements[index] = ach;
    } else {
      store.achievements.push({ ...ach, id: ach.id || `ach-${Date.now()}` });
    }
    this.saveStore(store);
    return store.achievements;
  },

  deleteAchievement(id: string): AchievementItem[] {
    const store = this.loadStore();
    store.achievements = store.achievements.filter((a) => a.id !== id);
    this.saveStore(store);
    return store.achievements;
  },

  // Resume
  saveResume(res: ResumeVersion): ResumeVersion[] {
    const store = this.loadStore();
    if (res.isActive) {
      store.resume.forEach((r) => (r.isActive = false));
    }
    const index = store.resume.findIndex((r) => r.id === res.id);
    if (index >= 0) {
      store.resume[index] = res;
    } else {
      store.resume.unshift({ ...res, id: res.id || `res-${Date.now()}` });
    }
    this.saveStore(store);
    return store.resume;
  },

  setActiveResume(id: string): ResumeVersion[] {
    const store = this.loadStore();
    store.resume.forEach((r) => {
      r.isActive = r.id === id;
    });
    this.saveStore(store);
    return store.resume;
  },

  deleteResume(id: string): ResumeVersion[] {
    const store = this.loadStore();
    store.resume = store.resume.filter((r) => r.id !== id);
    this.saveStore(store);
    return store.resume;
  },

  // Blog
  saveBlogPost(post: BlogPostItem): BlogPostItem[] {
    const store = this.loadStore();
    const index = store.blogPosts.findIndex((p) => p.id === post.id);
    if (index >= 0) {
      store.blogPosts[index] = post;
    } else {
      store.blogPosts.unshift({ ...post, id: post.id || `post-${Date.now()}` });
    }
    this.saveStore(store);
    return store.blogPosts;
  },

  deleteBlogPost(id: string): BlogPostItem[] {
    const store = this.loadStore();
    store.blogPosts = store.blogPosts.filter((p) => p.id !== id);
    this.saveStore(store);
    return store.blogPosts;
  },

  // Testimonials
  saveTestimonial(test: TestimonialItem): TestimonialItem[] {
    const store = this.loadStore();
    const index = store.testimonials.findIndex((t) => t.id === test.id);
    if (index >= 0) {
      store.testimonials[index] = test;
    } else {
      store.testimonials.push({ ...test, id: test.id || `tst-${Date.now()}` });
    }
    this.saveStore(store);
    return store.testimonials;
  },

  deleteTestimonial(id: string): TestimonialItem[] {
    const store = this.loadStore();
    store.testimonials = store.testimonials.filter((t) => t.id !== id);
    this.saveStore(store);
    return store.testimonials;
  },

  // Messages
  saveMessage(msg: ContactMessage): ContactMessage[] {
    const store = this.loadStore();
    const index = store.messages.findIndex((m) => m.id === msg.id);
    if (index >= 0) {
      store.messages[index] = msg;
    } else {
      store.messages.unshift({ ...msg, id: msg.id || `msg-${Date.now()}` });
    }
    this.saveStore(store);
    return store.messages;
  },

  deleteMessage(id: string): ContactMessage[] {
    const store = this.loadStore();
    store.messages = store.messages.filter((m) => m.id !== id);
    this.saveStore(store);
    return store.messages;
  },

  replyToMessage(id: string, replyText: string): ContactMessage | null {
    const store = this.loadStore();
    const msg = store.messages.find((m) => m.id === id);
    if (!msg) return null;

    msg.status = 'replied';
    if (!msg.replyHistory) {
      msg.replyHistory = [];
    }
    msg.replyHistory.push({
      id: `rep-${Date.now()}`,
      body: replyText,
      sentAt: new Date().toISOString(),
      sentBy: store.profile.fullName,
    });

    this.saveStore(store);
    return msg;
  },

  // Notifications
  markNotificationRead(id: string): AdminNotification[] {
    const store = this.loadStore();
    const notif = store.notifications.find((n) => n.id === id);
    if (notif) notif.read = true;
    this.saveStore(store);
    return store.notifications;
  },

  markAllNotificationsRead(): AdminNotification[] {
    const store = this.loadStore();
    store.notifications.forEach((n) => (n.read = true));
    this.saveStore(store);
    return store.notifications;
  },

  // Profile
  updateProfile(profile: ProfileData): ProfileData {
    const store = this.loadStore();
    store.profile = profile;
    this.saveStore(store);
    return store.profile;
  },

  // Settings
  updateSettings(settings: SiteSettings): SiteSettings {
    const store = this.loadStore();
    store.settings = settings;
    this.saveStore(store);
    return store.settings;
  },
};
