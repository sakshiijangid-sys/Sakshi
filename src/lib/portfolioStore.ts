export interface HeroConfig {
  videoUrl: string;
  videoEnabled: boolean;
  videoAudioEnabled: boolean;
  videoVolume: number;
  videoOpacity: number;
  headline: string;
  subheadline: string;
}

export interface ProofCardItem {
  id: string;
  title: string;
  badge: string;
  rawImg: string;
  enhancedImg: string;
  rawText: string;
  enhancedText: string;
}

export interface PublishedProjectItem {
  id: string;
  name: string;
  desc: string;
  img: string;
  link: string;
  stack: string[];
}

export interface UnpublishedProjectItem {
  id: string | number;
  name: string;
  description: string;
  mainImg: string;
  gallery: string[];
}

export interface CertificationItem {
  id: string;
  title: string;
  desc: string;
}

export interface CertificationsConfig {
  sectionHeading: string;
  subheading: string;
  linkedinUrl: string;
  items: CertificationItem[];
}

export interface FooterConfig {
  bgImage: string;
  bgOpacity: number;
  bgEnabled: boolean;
  heading: string;
  subheading: string;
}

export interface PortfolioConfig {
  hero: HeroConfig;
  proofCards: ProofCardItem[];
  publishedProjects: PublishedProjectItem[];
  unpublishedProjects: UnpublishedProjectItem[];
  certifications: CertificationsConfig;
  footer: FooterConfig;
}

export const DEFAULT_PORTFOLIO_CONFIG: PortfolioConfig = {
  hero: {
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-graphs-and-code-31912-large.mp4",
    videoEnabled: true,
    videoAudioEnabled: false,
    videoVolume: 0.5,
    videoOpacity: 0.25,
    headline: "Hi I'm Sakshi\nAs a creative web developer and artist, I bring thoughtful visual care to reliable code that works for tech leads without breaking things.",
    subheadline: "I don't just prompt AI - I understand, debug, and refine AI-generated code. Hiring me means getting full-stack feature delivery without the traditional ramp-up delay. Let's build something good together — reach out anytime."
  },
  proofCards: [
    {
      id: "proof-1",
      title: "Analytics & Performance Dashboard",
      badge: "Data Density & Hierarchy",
      rawImg: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1000",
      enhancedImg: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
      rawText: "Overcrowded chart dump with raw unformatted numbers, zero visual contrast, and unaligned metric cards.",
      enhancedText: "Structured grid layout with distinct typographic hierarchy, clear KPI focus cards, and responsive chart containers."
    },
    {
      id: "proof-2",
      title: "SaaS Billing & Pricing Engine",
      badge: "Conversion & Micro-Interactions",
      rawImg: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000",
      enhancedImg: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000",
      rawText: "Static pricing table with wrapped button labels, uncentered column heights, and raw unstyled forms.",
      enhancedText: "Interactive billing toggle, highlighted value plan, mathematical border-radius, and seamless checkout state transitions."
    },
    {
      id: "proof-3",
      title: "Mobile-First App Onboarding Flow",
      badge: "Fluid Touch Targets & UX",
      rawImg: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=1000",
      enhancedImg: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1000",
      rawText: "Desktop-first fixed width layout causing horizontal scrolling and sub-44px touch targets on mobile screens.",
      enhancedText: "Adaptive mobile viewport layout, 48px+ touch targets, smooth slide transitions, and clear progress steppers."
    },
    {
      id: "proof-4",
      title: "Dark Luxury Portfolio Interface",
      badge: "Typography & Micro-Contrast",
      rawImg: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000",
      enhancedImg: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000",
      rawText: "Aggressive neon gradients on pure black (#000000) with poor WCAG contrast ratios and clipped text.",
      enhancedText: "Sophisticated deep slate palette (#0F172A), balanced warm neutral highlights, and fluid display typography."
    }
  ],
  publishedProjects: [
    {
      id: "pub-1",
      name: "Inspirova (Artist Discovery)",
      desc: "Pinterest-style social platform for artists to discover drawing and sketching reference art with MERN stack & Masonry feed.",
      img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1000",
      link: "https://example.com/inspirova",
      stack: ["React", "MongoDB", "Express", "Masonry"]
    },
    {
      id: "pub-2",
      name: "Solo Leveling System",
      desc: "Gamified learning system with an AI chatbot powered by Gemini API, dual manual/AI task scheduling, and Firebase Firestore persistence.",
      img: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1000",
      link: "https://example.com/solo-leveling",
      stack: ["Gemini API", "Firebase", "React", "TailwindCSS"]
    },
    {
      id: "pub-3",
      name: "Taskify (Todo Case Study)",
      desc: "Full-stack task management web application with user authentication and persistent cloud storage, built to overcome client-side state wipe on page refresh.",
      img: "https://images.unsplash.com/photo-1540350394557-8d14678e7f91?auto=format&fit=crop&q=80&w=1000",
      link: "https://example.com/taskify",
      stack: ["React", "Firebase Firestore", "Firebase Auth", "TailwindCSS"]
    },
    {
      id: "pub-4",
      name: "Full-Stack E-Commerce Store",
      desc: "Custom storefront with Supabase database storage, brand identity design in Figma, and integrated UPI online payment gateway.",
      img: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=1000",
      link: "https://example.com/ecommerce-store",
      stack: ["React", "Supabase", "UPI Gateway", "Figma"]
    }
  ],
  unpublishedProjects: [
    {
      id: 1,
      name: "AI Content Generator",
      description: "An experimental full-stack AI content studio providing rapid prompt engineering, real-time generation pipelines, and multi-format document exports.",
      mainImg: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=500",
      gallery: [
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1675271591211-126ad94e495d?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1674027444485-cec3da58eef4?auto=format&fit=crop&q=80&w=800"
      ]
    },
    {
      id: 2,
      name: "Crypto Dashboard",
      description: "A real-time cryptocurrency analytics platform with live market data feeds, interactive portfolio tracking, and automated risk indicators.",
      mainImg: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1000",
      gallery: [
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1621761191319-c6fb62004009?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1622639225985-84f88729ac12?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?auto=format&fit=crop&q=80&w=800"
      ]
    },
    {
      id: 3,
      name: "Health Tracker",
      description: "A privacy-first health metrics dashboard tracking daily activity, biometric analytics, and personalized wellness goals.",
      mainImg: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=500",
      gallery: [
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1505751172107-573957a243b0?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=800"
      ]
    },
    {
      id: 4,
      name: "Real Estate App",
      description: "A modern property search platform featuring high-resolution interactive map overlays, filterable listings, and instant virtual tour scheduling.",
      mainImg: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=500",
      gallery: [
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800"
      ]
    }
  ],
  certifications: {
    sectionHeading: "Certifications & Credentials",
    subheading: "You can verify these credentials via my LinkedIn Profile",
    linkedinUrl: "https://www.linkedin.com/in/sakshi-8b17732b4?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    items: [
      {
        id: "cert-1",
        title: "Full Stack Web Development (MERN)",
        desc: "Comprehensive mastery of full-stack engineering including React.js, Node.js, Express.js, MongoDB database modeling, RESTful API design, and client-server state management."
      },
      {
        id: "cert-2",
        title: "Node.js & Backend Architecture",
        desc: "Specialized in event loop asynchronous performance, REST API routing, runtime schema validation with Zod, database ORM integration, and server-side security checks."
      },
      {
        id: "cert-3",
        title: "Generative AI & AI-Accelerated Development",
        desc: "Certified in leveraging Gemini AI APIs, prompt optimization, rapid application prototyping, and rigorous line-by-line manual code auditing for production readiness."
      },
      {
        id: "cert-4",
        title: "Professional Frontend Developer",
        desc: "Advanced proficiency in modular React component architecture, custom hooks, TypeScript interfaces, Tailwind CSS design systems, and responsive UX optimization."
      }
    ]
  },
  footer: {
    bgImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1600",
    bgOpacity: 0.18,
    bgEnabled: true,
    heading: "Let's work together.",
    subheading: "Are you a Tech Lead looking for a developer who can pick up feature requests and ship them immediately? Let's connect directly."
  }
};

const STORAGE_KEY = "sakshi_portfolio_custom_config_v1";
const IDB_NAME = "SakshiPortfolioDB_v1";
const IDB_STORE = "portfolioConfigStore";
const IDB_KEY = "current_config";

export function sanitizePortfolioConfig(parsed: any): PortfolioConfig {
  if (!parsed || typeof parsed !== "object") return DEFAULT_PORTFOLIO_CONFIG;
  return {
    hero: { ...DEFAULT_PORTFOLIO_CONFIG.hero, ...(parsed.hero || {}) },
    proofCards: Array.isArray(parsed.proofCards) && parsed.proofCards.length > 0 ? parsed.proofCards : DEFAULT_PORTFOLIO_CONFIG.proofCards,
    publishedProjects: Array.isArray(parsed.publishedProjects) && parsed.publishedProjects.length > 0 ? parsed.publishedProjects : DEFAULT_PORTFOLIO_CONFIG.publishedProjects,
    unpublishedProjects: Array.isArray(parsed.unpublishedProjects) && parsed.unpublishedProjects.length > 0 ? parsed.unpublishedProjects : DEFAULT_PORTFOLIO_CONFIG.unpublishedProjects,
    certifications: {
      ...DEFAULT_PORTFOLIO_CONFIG.certifications,
      ...(parsed.certifications || {}),
      items: Array.isArray(parsed.certifications?.items) ? parsed.certifications.items : DEFAULT_PORTFOLIO_CONFIG.certifications.items
    },
    footer: { ...DEFAULT_PORTFOLIO_CONFIG.footer, ...(parsed.footer || {}) }
  };
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB not supported in this environment"));
    }
    const request = indexedDB.open(IDB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Failed to open IndexedDB"));
  });
}

export async function saveToIndexedDB(config: PortfolioConfig): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readwrite");
      const store = tx.objectStore(IDB_STORE);
      const req = store.put(config, IDB_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("IndexedDB save failed:", err);
  }
}

export async function loadFromIndexedDB(): Promise<PortfolioConfig | null> {
  try {
    const db = await openDB();
    return await new Promise<PortfolioConfig | null>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readonly");
      const store = tx.objectStore(IDB_STORE);
      const req = store.get(IDB_KEY);
      req.onsuccess = () => {
        if (req.result) {
          resolve(sanitizePortfolioConfig(req.result));
        } else {
          resolve(null);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("IndexedDB load failed:", err);
    return null;
  }
}

export async function resetIndexedDB(): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readwrite");
      const store = tx.objectStore(IDB_STORE);
      const req = store.delete(IDB_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("IndexedDB reset failed:", err);
  }
}

function stripLargeDataUrl(val: string): string {
  if (typeof val === "string" && val.startsWith("data:") && val.length > 50000) {
    return "";
  }
  return val;
}

function createLightweightConfig(config: PortfolioConfig): PortfolioConfig {
  return {
    ...config,
    hero: {
      ...config.hero,
      videoUrl: stripLargeDataUrl(config.hero.videoUrl) || config.hero.videoUrl
    },
    proofCards: config.proofCards.map(c => ({
      ...c,
      rawImg: stripLargeDataUrl(c.rawImg) || c.rawImg,
      enhancedImg: stripLargeDataUrl(c.enhancedImg) || c.enhancedImg
    })),
    publishedProjects: config.publishedProjects.map(p => ({
      ...p,
      img: stripLargeDataUrl(p.img) || p.img
    })),
    unpublishedProjects: config.unpublishedProjects.map(p => ({
      ...p,
      mainImg: stripLargeDataUrl(p.mainImg) || p.mainImg,
      gallery: p.gallery.map(img => stripLargeDataUrl(img) || img)
    })),
    footer: {
      ...config.footer,
      bgImage: stripLargeDataUrl(config.footer.bgImage) || config.footer.bgImage
    }
  };
}

export function loadPortfolioConfig(): PortfolioConfig {
  if (typeof window === "undefined") {
    return DEFAULT_PORTFOLIO_CONFIG;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PORTFOLIO_CONFIG;
    const parsed = JSON.parse(raw);
    return sanitizePortfolioConfig(parsed);
  } catch (e) {
    console.warn("Failed to load portfolio config from localStorage, using defaults", e);
    return DEFAULT_PORTFOLIO_CONFIG;
  }
}

export function savePortfolioConfig(config: PortfolioConfig): void {
  if (typeof window === "undefined") return;

  // 1. Always persist to IndexedDB asynchronously (handles large data/images/videos without 5MB quota)
  saveToIndexedDB(config).catch((err) => {
    console.warn("Failed to save to IndexedDB:", err);
  });

  // 2. Safely attempt saving to localStorage
  try {
    const serialized = JSON.stringify(config);
    // Standard browser localStorage is capped at ~5MB. If size is >= 2MB, avoid filling localStorage completely
    if (serialized.length < 2000000) {
      localStorage.setItem(STORAGE_KEY, serialized);
    } else {
      // Save lightweight copy in localStorage (omits multi-megabyte base64 strings), while IndexedDB retains the full copy
      const lightweight = createLightweightConfig(config);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lightweight));
    }
  } catch (e) {
    console.warn("LocalStorage Quota exceeded, safely relying on IndexedDB:", e);
    // Graceful recovery: store lightweight or remove full entry to avoid continuous quota crashes
    try {
      const lightweight = createLightweightConfig(config);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lightweight));
    } catch {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  }

  // 3. Dispatch update event so live components reflect state immediately
  try {
    window.dispatchEvent(new CustomEvent("portfolioConfigUpdated", { detail: config }));
  } catch (err) {
    console.warn("Could not dispatch portfolioConfigUpdated event:", err);
  }
}

export function resetPortfolioConfig(): PortfolioConfig {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    resetIndexedDB().catch(console.warn);
    try {
      window.dispatchEvent(new CustomEvent("portfolioConfigUpdated", { detail: DEFAULT_PORTFOLIO_CONFIG }));
    } catch {}
  }
  return DEFAULT_PORTFOLIO_CONFIG;
}
