/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useId, useRef, useState } from "react";
import TrueFocus from "./components/TrueFocus";
import GradualBlur from "./components/GradualBlur";
import { CardStack, type CardStackItem } from "./components/ui/card-stack";
import SpecularButton from "./components/SpecularButton";
import BubbleMenu from "./components/BubbleMenu";
import BlurText from "./components/BlurText";
import OptionWheel from "./components/OptionWheel";
import FlowerCTAWrapper from "./components/FlowerClusterPopup";
import ParticleText from "./components/ParticleText";
import GlassAssembly from "./components/GlassAssembly";
import Masonry from "./components/Masonry";
import SwarmCursor from "./components/SwarmCursor";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { 
  Mail, 
  Linkedin, 
  ExternalLink, 
  ChevronUp,
  X,
  Send,
  Calendar,
  ArrowRight,
  Copy,
  Check,
  LayoutGrid,
  Sparkles,
  Volume2,
  VolumeX
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const UNPUBLISHED_PROJECTS = [
  {
    id: 1,
    name: "Infix",
    description: "A creative streetwear and DIY clothing storefront concept exploring modular garment customization and editorial lookbook layouts.",
    mainImg: "https://i.pinimg.com/736x/43/4e/94/434e9422da4800c264bb84c0a6c592b6.jpg",
    gallery: [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1675271591211-126ad94e495d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1674027444485-cec3da58eef4?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: 2,
    name: "Homaker",
    description: "An architectural home planning and living-space discovery prototype combining curated interiors with interactive layout previews.",
    mainImg: "https://i.pinimg.com/736x/04/41/4e/04414e1ec1ce7b787899ffbf5256fca1.jpg",
    gallery: [
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1621761191319-c6fb62004009?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1622639225985-84f88729ac12?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: 3,
    name: "Inspirova",
    description: "A Pinterest-style visual discovery platform crafted for artists to collect sketching references, studies, and curated moodboards.",
    mainImg: "https://i.pinimg.com/736x/2b/db/49/2bdb494c326e66846293cecafe4273b2.jpg",
    gallery: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1505751172107-573957a243b0?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: 4,
    name: "Fairy-Topia",
    description: "An illustrated interactive fantasy realm prototype blending atmospheric motion design, character lore, and storybook exploration.",
    mainImg: "https://i.pinimg.com/736x/03/85/18/03851844e7e77c3e605cbd93cf8d2a60.jpg",
    gallery: [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800"
    ]
  }
];

const CREDENTIAL_STACK_ITEMS: CardStackItem[] = [
  {
    id: "tcs-ion-career-edge",
    title: "TCS iON Career Edge – Young Professional Certificate",
    imageSrc: "/assets/aistudio/image_547bbe76.png",
  },
  {
    id: "infosys-mern-fsd",
    title: "Infosys Springboard – The MERN Stack & FSD Certificate",
    imageSrc: "/assets/aistudio/image_c43bd471.png",
  },
  {
    id: "skill-india-genai",
    title: "Skill India NSDC – Introduction on Generative AI Certificate",
    imageSrc: "/assets/aistudio/image_b77d7918.png",
  },
  {
    id: "reliance-frontend-dev",
    title: "Reliance Foundation – Front-end Web Development Certificate",
    imageSrc: "/assets/aistudio/image_b89e97f9.png",
  },
  {
    id: "flyrank-ai-fluency",
    title: "FlyRank AI – AI Fluency Internship Certificate",
    imageSrc: "/assets/aistudio/image_c5d43003.png",
  },
];

interface ProofItem {
  title: string;
  badge?: string;
  rawImg: string;
  enhancedImg: string;
  rawText: string;
  enhancedText: string;
}

function ProofFlipCard({ item }: { item: ProofItem; key?: React.Key }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardUid = useId().replace(/:/g, "");

  useEffect(() => {
    // Auto-flip after 4.5 seconds when hovering over the raw front card
    if (isHovered && !isFlipped) {
      const timer = setTimeout(() => {
        setIsFlipped(true);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [isHovered, isFlipped]);

  return (
    <div 
      onClick={() => setIsFlipped(!isFlipped)} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flip-card-container group h-[430px] sm:h-[440px] w-full select-none cursor-pointer"
    >
      <div className={`flip-card rounded-3xl shadow-2xl ${isFlipped ? 'is-flipped' : ''}`}>
        
        {/* FRONT CARD: RAW AI OUTPUT */}
        <div className="flip-card-front rounded-3xl overflow-hidden border border-rose-900/40 bg-[#1A080D] flex flex-col shadow-2xl relative">
          {/* Top/Main Image Frame: Unobstructed with curvy top wave border */}
          <div className="relative flex-1 overflow-hidden">
            <img 
              src={item.rawImg} 
              alt={`${item.title} Raw AI Draft`} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />

            {/* Upper Layered Curvy Wave Border (matching #proof section wave dividers) */}
            <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none -translate-y-[1px]">
              <svg
                className="relative block w-full h-11"
                viewBox="0 0 400 44"
                preserveAspectRatio="none"
              >
                <defs>
                  <filter id={`cardTopBlurFront-${cardUid}`} x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur stdDeviation="2.5" />
                  </filter>
                  <linearGradient id={`cardTopGrad1Front-${cardUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8C2D40" stopOpacity="0.88" />
                    <stop offset="50%" stopColor="#E07A5F" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#6B1D2F" stopOpacity="0.88" />
                  </linearGradient>
                  <linearGradient id={`cardTopGrad2Front-${cardUid}`} x1="0%" y1="0%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#E07A5F" stopOpacity="0.82" />
                    <stop offset="100%" stopColor="#8C2D40" stopOpacity="0.65" />
                  </linearGradient>
                  <linearGradient id={`cardTopGrad3Front-${cardUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6B1D2F" stopOpacity="0.92" />
                    <stop offset="100%" stopColor="#3D121B" stopOpacity="0.85" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,0 L400,0 L400,36 C333,7 266,43 200,23 C133,3 66,36 0,14 Z"
                  fill={`url(#cardTopGrad1Front-${cardUid})`}
                  filter={`url(#cardTopBlurFront-${cardUid})`}
                />
                <path
                  d="M0,0 L400,0 L400,30 C333,10 266,36 200,20 C133,4 66,30 0,11 Z"
                  fill={`url(#cardTopGrad1Front-${cardUid})`}
                />
                <path
                  d="M0,0 L400,0 L400,22 C320,40 236,7 153,28 C78,44 33,14 0,25 Z"
                  fill={`url(#cardTopGrad2Front-${cardUid})`}
                />
                <path
                  d="M0,0 L400,0 L400,11 C305,27 222,4 125,20 C70,30 28,7 0,14 Z"
                  fill={`url(#cardTopGrad3Front-${cardUid})`}
                />
                <path
                  d="M0,0 L400,0 L400,15 C305,34 208,6 111,26 C55,36 22,15 0,18 Z"
                  fill="#1A080D"
                />
              </svg>
            </div>

            <div className="absolute top-11 left-3.5 z-10">
              <span className="inline-flex items-center space-x-1.5 bg-rose-950/85 border border-rose-700/60 text-rose-200 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-md">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                <span>Raw AI Output</span>
              </span>
            </div>
          </div>

          {/* Bottom Caption Bar with Curvy Top Wave Transition + Hover Details */}
          <div className="relative z-10 shrink-0 bg-[#1A080D] px-5 pt-2 pb-3.5">
            <div className="absolute -top-5 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-10 translate-y-[1px]">
              <svg className="relative block w-full h-5" viewBox="0 0 400 22" preserveAspectRatio="none">
                <path
                  d="M0,22 L400,22 L400,6 C315,18 225,2 140,13 C75,21 30,5 0,10 Z"
                  fill="#8C2D40"
                  fillOpacity="0.65"
                />
                <path
                  d="M0,22 L400,22 L400,10 C315,20 225,5 140,15 C75,22 30,8 0,13 Z"
                  fill="#1A080D"
                />
              </svg>
            </div>

            <div
              className="absolute bottom-full left-0 right-0 z-[5] bg-[#6B1D2F]/65 backdrop-blur-md px-5 pt-6 pb-6 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-none"
              style={{
                maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 140' preserveAspectRatio='none'%3E%3Cpath d='M0,16 C65,28 130,3 210,14 C290,25 345,4 400,12 L400,140 L0,140 Z' fill='black'/%3E%3C/svg%3E")`,
                WebkitMaskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 140' preserveAspectRatio='none'%3E%3Cpath d='M0,16 C65,28 130,3 210,14 C290,25 345,4 400,12 L400,140 L0,140 Z' fill='black'/%3E%3C/svg%3E")`,
                maskSize: '100% 100%',
                WebkitMaskSize: '100% 100%',
              }}
            >
              <svg
                className="absolute top-0 left-0 right-0 w-full h-5 pointer-events-none"
                viewBox="0 0 400 24"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,14 C65,24 130,3 210,12 C290,21 345,4 400,10"
                  fill="none"
                  stroke="#E07A5F"
                  strokeOpacity="0.6"
                  strokeWidth="2.5"
                />
              </svg>
              <span className="font-extrabold uppercase text-[10px] text-rose-200 block mb-0.5 tracking-wider drop-shadow-sm">
                Raw Output Issues:
              </span>
              <p className="text-white text-xs md:text-sm leading-relaxed drop-shadow-sm">
                {item.rawText}
              </p>
            </div>

            <h4 className="relative z-10 text-lg xl:text-xl font-bold text-white tracking-tight truncate">
              {item.title}
            </h4>
          </div>
        </div>

        {/* BACK CARD: ENHANCED UI OUTPUT */}
        <div className="flip-card-back rounded-3xl overflow-hidden border border-emerald-500/50 bg-[#1A080D] flex flex-col shadow-2xl relative">
          {/* Top/Main Image Frame: Unobstructed with curvy top wave border */}
          <div className="relative flex-1 overflow-hidden">
            <img 
              src={item.enhancedImg} 
              alt={`${item.title} Enhanced Interface`} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />

            {/* Upper Layered Curvy Wave Border (matching #proof section wave dividers) */}
            <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none -translate-y-[1px]">
              <svg
                className="relative block w-full h-11"
                viewBox="0 0 400 44"
                preserveAspectRatio="none"
              >
                <defs>
                  <filter id={`cardTopBlurBack-${cardUid}`} x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur stdDeviation="2.5" />
                  </filter>
                  <linearGradient id={`cardTopGrad1Back-${cardUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8C2D40" stopOpacity="0.88" />
                    <stop offset="50%" stopColor="#E07A5F" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#6B1D2F" stopOpacity="0.88" />
                  </linearGradient>
                  <linearGradient id={`cardTopGrad2Back-${cardUid}`} x1="0%" y1="0%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#E07A5F" stopOpacity="0.82" />
                    <stop offset="100%" stopColor="#8C2D40" stopOpacity="0.65" />
                  </linearGradient>
                  <linearGradient id={`cardTopGrad3Back-${cardUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6B1D2F" stopOpacity="0.92" />
                    <stop offset="100%" stopColor="#3D121B" stopOpacity="0.85" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,0 L400,0 L400,36 C333,7 266,43 200,23 C133,3 66,36 0,14 Z"
                  fill={`url(#cardTopGrad1Back-${cardUid})`}
                  filter={`url(#cardTopBlurBack-${cardUid})`}
                />
                <path
                  d="M0,0 L400,0 L400,30 C333,10 266,36 200,20 C133,4 66,30 0,11 Z"
                  fill={`url(#cardTopGrad1Back-${cardUid})`}
                />
                <path
                  d="M0,0 L400,0 L400,22 C320,40 236,7 153,28 C78,44 33,14 0,25 Z"
                  fill={`url(#cardTopGrad2Back-${cardUid})`}
                />
                <path
                  d="M0,0 L400,0 L400,11 C305,27 222,4 125,20 C70,30 28,7 0,14 Z"
                  fill={`url(#cardTopGrad3Back-${cardUid})`}
                />
                <path
                  d="M0,0 L400,0 L400,15 C305,34 208,6 111,26 C55,36 22,15 0,18 Z"
                  fill="#1A080D"
                />
              </svg>
            </div>

            <div className="absolute top-11 left-3.5 z-10">
              <span className="inline-flex items-center space-x-1.5 bg-emerald-950/85 border border-emerald-600/60 text-emerald-200 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Enhanced UI</span>
              </span>
            </div>
          </div>

          {/* Bottom Caption Bar with Curvy Top Wave Transition + Hover Details */}
          <div className="relative z-10 shrink-0 bg-[#1A080D] px-5 pt-2 pb-3.5">
            <div className="absolute -top-5 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-10 translate-y-[1px]">
              <svg className="relative block w-full h-5" viewBox="0 0 400 22" preserveAspectRatio="none">
                <path
                  d="M0,22 L400,22 L400,6 C315,18 225,2 140,13 C75,21 30,5 0,10 Z"
                  fill="#8C2D40"
                  fillOpacity="0.65"
                />
                <path
                  d="M0,22 L400,22 L400,10 C315,20 225,5 140,15 C75,22 30,8 0,13 Z"
                  fill="#1A080D"
                />
              </svg>
            </div>

            <div
              className="absolute bottom-full left-0 right-0 z-[5] bg-[#6B1D2F]/65 backdrop-blur-md px-5 pt-6 pb-6 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-none"
              style={{
                maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 140' preserveAspectRatio='none'%3E%3Cpath d='M0,16 C65,28 130,3 210,14 C290,25 345,4 400,12 L400,140 L0,140 Z' fill='black'/%3E%3C/svg%3E")`,
                WebkitMaskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 140' preserveAspectRatio='none'%3E%3Cpath d='M0,16 C65,28 130,3 210,14 C290,25 345,4 400,12 L400,140 L0,140 Z' fill='black'/%3E%3C/svg%3E")`,
                maskSize: '100% 100%',
                WebkitMaskSize: '100% 100%',
              }}
            >
              <svg
                className="absolute top-0 left-0 right-0 w-full h-5 pointer-events-none"
                viewBox="0 0 400 24"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,14 C65,24 130,3 210,12 C290,21 345,4 400,10"
                  fill="none"
                  stroke="#E07A5F"
                  strokeOpacity="0.6"
                  strokeWidth="2.5"
                />
              </svg>
              <span className="font-extrabold uppercase text-[10px] text-emerald-200 block mb-0.5 tracking-wider drop-shadow-sm">
                My Refactored Enhancements:
              </span>
              <p className="text-white text-xs md:text-sm leading-relaxed drop-shadow-sm">
                {item.enhancedText}
              </p>
            </div>

            <h4 className="relative z-10 text-lg xl:text-xl font-bold text-white tracking-tight truncate">
              {item.title}
            </h4>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<typeof UNPUBLISHED_PROJECTS[0] | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [interviewSubject, setInterviewSubject] = useState("Technical Interview Request - Full Stack Developer");
  const [interviewMessage, setInterviewMessage] = useState("Hi Sakshi,\n\nI am a Tech Lead looking for someone to ship full-stack features rapidly. Your portfolio caught my attention. Let's schedule a 20-minute intro call.");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [stackDimensions, setStackDimensions] = useState<{ width: number; height: number }>(() => {
    if (typeof window === "undefined") return { width: 500, height: 355 };
    if (window.innerWidth < 640) return { width: 280, height: 200 };
    if (window.innerWidth < 1024) return { width: 420, height: 300 };
    return { width: 500, height: 355 };
  });

  useEffect(() => {
    const updateStackDimensions = () => {
      if (window.innerWidth < 640) {
        setStackDimensions({ width: 280, height: 200 });
      } else if (window.innerWidth < 1024) {
        setStackDimensions({ width: 420, height: 300 });
      } else {
        setStackDimensions({ width: 500, height: 355 });
      }
    };
    updateStackDimensions();
    window.addEventListener("resize", updateStackDimensions);
    return () => window.removeEventListener("resize", updateStackDimensions);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsVideoMuted(false);
        })
        .catch(() => {
          if (video) {
            video.muted = true;
            setIsVideoMuted(true);
            video.play().catch(() => {});
          }
        });
    }

    const handleFirstInteraction = () => {
      const v = videoRef.current;
      if (v && v.muted) {
        v.muted = false;
        setIsVideoMuted(false);
        v.play().catch(() => {});
      }
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };

    window.addEventListener("click", handleFirstInteraction, { once: true });
    window.addEventListener("keydown", handleFirstInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, []);

  const toggleVideoAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsVideoMuted(nextMuted);
    if (!nextMuted) {
      video.play().catch(() => {});
    }
  };

  useGSAP(() => {
    const unpublishedCards = gsap.utils.toArray<HTMLElement>(".unpublished-project-card");
    const cols = window.innerWidth >= 768 ? 4 : 2;

    unpublishedCards.forEach((card, index) => {
      const fromX = index % 2 === 0 ? -90 : 90;
      gsap.fromTo(
        card,
        { opacity: 0, x: fromX },
        {
          opacity: 1,
          x: 0,
          duration: 0.75,
          delay: (index % cols) * 0.14,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            once: true,
          },
        }
      );
    });
  }, { scope: containerRef });

  // Modal Animation - Separate effect to avoid re-triggering scroll animations
  useGSAP(() => {
    if (selectedProject || showInviteModal) {
      gsap.from(".modal-content", {
        scale: 0.95,
        opacity: 0,
        duration: 0.3,
        ease: "power3.out"
      });
    }
  }, { scope: containerRef, dependencies: [selectedProject, showInviteModal] });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("sakshiijangid@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const isMobileDevice = typeof window !== 'undefined' && (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    ('ontouchstart' in window && window.innerWidth <= 768)
  );

  const mailLink = isMobileDevice
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=sakshiijangid@gmail.com&su=${encodeURIComponent(interviewSubject)}&body=${encodeURIComponent(interviewMessage)}`
    : `mailto:sakshiijangid@gmail.com?subject=${encodeURIComponent(interviewSubject)}&body=${encodeURIComponent(interviewMessage)}`;

  return (
    <div ref={containerRef} className="bg-white text-[#1A1A1A] font-sans antialiased selection:bg-[#966F33] selection:text-white overflow-x-clip w-full max-w-full">
      {/* Global Swarm Cursor Overlay */}
      <SwarmCursor
        globalOverlay
        hideCursor
        dotSize={9}
        count={130}
        size={2.2}
        color="#8C2D40"
        accentColor="#EF4444"
        spread={72}
        swirl={0.6}
        tail={0.5}
        trail={0.65}
        wander={0.5}
        depth={0.7}
        clickEffect="burst"
        idle="hide"
        lightMode
      />
      {/* Direct Interview Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            onClick={() => setShowInviteModal(false)}
          />
          <div className="modal-content relative bg-white w-full max-w-2xl overflow-y-auto rounded-3xl p-8 md:p-10 shadow-2xl border border-gray-100">
            <button 
              onClick={() => setShowInviteModal(false)}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
            >
              <X size={28} />
            </button>

            <div className="flex items-center space-x-3 mb-3 text-[#581C24]">
              <Calendar size={22} />
              <span className="text-xs font-bold uppercase tracking-widest">Direct Tech Lead Invite</span>
            </div>

            <h2 className="text-3xl font-bold mb-2">Schedule a Technical Interview</h2>
            <p className="text-gray-600 text-sm mb-6">
              Skip the HR screen. Send a direct interview request straight to my inbox: <span className="font-semibold text-black">sakshiijangid@gmail.com</span>.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Email Subject
                </label>
                <input 
                  type="text" 
                  value={interviewSubject}
                  onChange={(e) => setInterviewSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FDFBF7] border border-gray-200 rounded-xl font-medium focus:outline-none focus:border-[#581C24] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Invite Message
                </label>
                <textarea 
                  rows={4}
                  value={interviewMessage}
                  onChange={(e) => setInterviewMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FDFBF7] border border-gray-200 rounded-xl font-medium focus:outline-none focus:border-[#8C2D40] text-sm resize-none"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <FlowerCTAWrapper className="flex-1">
                <a 
                  href={mailLink} 
                  target={isMobileDevice ? "_blank" : "_self"}
                  rel={isMobileDevice ? "noopener noreferrer" : undefined}
                  className="w-full bg-[#8C2D40] text-white py-4 px-6 rounded-full font-bold flex items-center justify-center space-x-2 hover:bg-[#6B1D2F] transition-all shadow-lg text-sm"
                >
                  <Send size={18} />
                  <span>Send Interview Invite</span>
                </a>
              </FlowerCTAWrapper>
              <button 
                onClick={handleCopyEmail}
                className="px-6 py-4 border-2 border-[#8C2D40] text-[#8C2D40] rounded-full font-bold hover:bg-[#8C2D40]/10 transition-all flex items-center justify-center space-x-2 text-sm"
              >
                {copiedEmail ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
                <span>{copiedEmail ? "Email Copied!" : "Copy Email"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Gallery Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
          <div 
            className="absolute inset-0 bg-stone-950/60 backdrop-blur-md transition-opacity" 
            onClick={() => setSelectedProject(null)}
          />
          <div className="modal-content relative bg-white/85 backdrop-blur-xl border border-white/60 w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 md:p-12 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)]">
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 p-2.5 bg-stone-100/60 hover:bg-stone-200/80 rounded-full transition-colors border border-stone-200/50 text-stone-700"
            >
              <X size={28} />
            </button>
            
            <div className="mb-8">
              <h2 className="text-4xl font-bold mb-3">{selectedProject.name}</h2>
              <p className="text-stone-600 text-base leading-relaxed max-w-3xl">
                {selectedProject.description || "An in-development prototype exploring high-velocity UI patterns, responsive full-stack architecture, and streamlined user experiences."}
              </p>
            </div>

            <div>
              <Masonry
                items={selectedProject.gallery.map((img, i) => ({
                  id: `popup-${selectedProject.id}-${i}`,
                  img,
                  height: [420, 320, 480, 360][i % 4] || 380
                }))}
                ease="power3.out"
                duration={0.6}
                stagger={0.06}
                animateFrom="bottom"
                scaleOnHover={true}
                hoverScale={0.96}
                blurToFocus={true}
                colorShiftOnHover={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 pointer-events-none">
        <GradualBlur
          target="parent"
          position="top"
          height="6rem"
          strength={3}
          divCount={6}
          curve="ease-out"
          opacity={1}
          zIndex={10}
        />
        {/* Desktop Header Nav */}
        <nav className="hidden md:flex relative z-20 pointer-events-auto px-6 py-5 justify-between items-center text-slate-900 bg-white/75 backdrop-blur-md border-b border-slate-900/10 shadow-sm transition-all">
          <a href="#" aria-label="Sakshi Home" className="flex items-center group">
            <span className="w-9 h-9 rounded-full overflow-hidden border border-[#581C24]/20 bg-white shadow-sm shrink-0 flex items-center justify-center">
              <img
                src="/assets/aistudio/SJ_logo_on_white_background_e8dc6e80_17e10099.jpg"
                alt="SJ Logo"
                className="w-full h-full object-cover scale-125"
              />
            </span>
          </a>
          
          {/* Desktop Navigation Links */}
          <div className="flex space-x-8 text-sm font-semibold uppercase tracking-widest text-slate-800">
            <a href="#proof" className="hover:text-[#8C2D40] transition-colors">The Proof</a>
            <a href="#projects" className="hover:text-[#8C2D40] transition-colors">Projects</a>
            <a href="#skills" className="hover:text-[#8C2D40] transition-colors">Skills</a>
            <a href="#education" className="hover:text-[#8C2D40] transition-colors">Certifications</a>
          </div>

          {/* Desktop Header Button */}
          <FlowerCTAWrapper>
            <SpecularButton 
              onClick={() => setShowInviteModal(true)}
              size="sm"
              radius={9999}
              tint="#8C2D40"
              tintOpacity={1}
              textColor="#ffffff"
              lineColor="#ffffff"
              baseColor="#581C24"
              intensity={1.2}
              className="text-xs font-bold uppercase tracking-wider shadow-md hover:scale-105 hover:bg-[#8C2D40] transition-all"
            >
              Send Interview Invite
            </SpecularButton>
          </FlowerCTAWrapper>
        </nav>

        {/* Mobile BubbleMenu */}
        <div className="md:hidden pointer-events-auto">
          <BubbleMenu 
            logo={
              <span className="flex items-center gap-1.5 font-extrabold text-xs sm:text-sm tracking-tight text-[#581C24] uppercase">
                <img
                  src="/assets/aistudio/SJ_logo_on_white_background_e8dc6e80_17e10099.jpg"
                  alt="SJ Logo"
                  className="w-6 h-6 rounded-full object-cover scale-110 border border-[#581C24]/20"
                />
                <span>SAKSHI</span>
              </span>
            }
            items={[
              {
                label: 'The Proof',
                href: '#proof',
                ariaLabel: 'The Proof',
                rotation: -4,
                hoverStyles: { bgColor: '#8C2D40', textColor: '#ffffff' }
              },
              {
                label: 'Projects',
                href: '#projects',
                ariaLabel: 'Projects',
                rotation: 4,
                hoverStyles: { bgColor: '#581C24', textColor: '#ffffff' }
              },
              {
                label: 'Skills',
                href: '#skills',
                ariaLabel: 'Skills',
                rotation: -4,
                hoverStyles: { bgColor: '#8C2D40', textColor: '#ffffff' }
              },
              {
                label: 'Certifications',
                href: '#education',
                ariaLabel: 'Certifications',
                rotation: 4,
                hoverStyles: { bgColor: '#581C24', textColor: '#ffffff' }
              },
              {
                label: 'Invite Me',
                href: '#',
                ariaLabel: 'Send Interview Invite',
                onClick: () => setShowInviteModal(true),
                rotation: -4,
                hoverStyles: { bgColor: '#8C2D40', textColor: '#ffffff' }
              }
            ]}
            menuBg="#ffffff"
            menuContentColor="#1A1A1A"
            useFixedPosition={true}
            animationDuration={0.4}
          />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-28 sm:pt-32 md:pt-36 lg:pt-40 pb-0 px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 overflow-hidden bg-[#C3C5C2]">
        {/* Responsive Background Video (Starts cleanly below fixed header so upper part is never hidden; anchored right-bottom) */}
        <div className="absolute top-[68px] md:top-[76px] bottom-0 left-0 right-0 z-0 overflow-hidden pointer-events-none bg-[#C3C5C2]">
          {/* Seamless left-side white bottom wave extension matched proportionally to video height at every breakpoint */}
          <svg
            className="absolute bottom-0 left-0 right-0 w-full h-[35px] min-[420px]:h-[38px] sm:h-[45px] md:h-[12%] z-[1] pointer-events-none"
            viewBox="0 0 1000 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,120 L1000,120 L1000,19 C850,22 700,14 500,20 C300,26 150,15 0,20 Z"
              fill="#ffffff"
            />
          </svg>
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isVideoMuted}
            playsInline
            className="absolute bottom-0 right-0 h-[290px] min-[420px]:h-[320px] sm:h-[380px] md:h-full w-auto max-w-none z-[2] pointer-events-none transform-gpu"
            style={{ clipPath: 'inset(0 0 4px 0)' }}
          >
            <source src="/assets/aistudio/InShot_20261121_204512407_bfa2e43e.mp4" type="video/mp4" />
          </video>
          {/* Clean solid white bottom seal bridging seamlessly into the #proof top white wave */}
          <div className="absolute bottom-0 left-0 right-0 h-[10px] bg-white z-[5] pointer-events-none" />
        </div>

        {/* Interactive Audio Toggle Pill */}
        <button
          onClick={toggleVideoAudio}
          className="absolute bottom-5 left-5 sm:bottom-8 sm:left-8 md:left-auto md:bottom-12 md:right-10 z-30 flex items-center space-x-2 px-3.5 py-2 rounded-full bg-stone-900/85 hover:bg-[#8C2D40] text-white text-xs font-mono font-semibold backdrop-blur-md border border-white/30 shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
          title={isVideoMuted ? "Click to play audio" : "Click to mute audio"}
          aria-label={isVideoMuted ? "Unmute background audio" : "Mute background audio"}
        >
          {isVideoMuted ? (
            <>
              <VolumeX size={15} className="text-stone-300" />
              <span>Audio Muted</span>
            </>
          ) : (
            <>
              <Volume2 size={15} className="text-[#E07A5F] animate-pulse" />
              <span>Audio On</span>
            </>
          )}
        </button>

        <div className="z-10 w-full sm:max-w-[58%] md:max-w-[56%] lg:max-w-[58%] xl:max-w-[780px] 2xl:max-w-[920px] relative">
          <div className="bg-transparent p-0">
            <div className="pb-20 sm:pb-24 lg:pb-28 xl:pb-32">
              <BlurText
                as="h1"
                text={"Hi I'm Sakshi\nAs a creative web developer and artist, I bring thoughtful visual care to reliable code that works for tech leads without breaking things."}
                delay={80}
                animateBy="words"
                direction="top"
                stepDuration={0.35}
                className="text-[clamp(1.3rem,4.6vw,1.8rem)] md:text-[clamp(1.6rem,3.3vw,3.5rem)] font-extrabold tracking-tight leading-[1.18] md:leading-[1.12] mb-5 sm:mb-6 md:mb-8 text-[#1C1917] max-w-full"
                getWordClassName={(_word, index, total) => index >= total - 5 ? 'text-[#8C2D40]' : ''}
              />

              <p className="text-[clamp(0.8125rem,2.6vw,0.95rem)] md:text-[clamp(0.95rem,1.35vw,1.3rem)] text-stone-800 max-w-[56%] min-[420px]:max-w-[58%] sm:max-w-full lg:max-w-2xl xl:max-w-3xl mb-6 sm:mb-8 md:mb-10 leading-snug sm:leading-relaxed font-medium">
                I don't just prompt AI - I understand, debug, and refine AI-generated code. Hiring me means getting full-stack feature delivery without the traditional ramp-up delay. Let's build something good together — reach out anytime.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <FlowerCTAWrapper>
                  <a 
                    href="#projects" 
                    className="bg-[#581C24] text-white px-5 sm:px-8 lg:px-9 py-3 sm:py-4 rounded-full font-bold hover:bg-[#8C2D40] hover:scale-105 transition-all duration-300 inline-flex items-center justify-center space-x-2 shadow-lg text-xs sm:text-sm md:text-base xl:text-lg whitespace-nowrap"
                  >
                    <span>Inspect Shipped Work</span>
                    <ArrowRight size={18} />
                  </a>
                </FlowerCTAWrapper>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Proof Section: 2 Subsections (UI Enhancements & Code Audit Diff) */}
      <section id="proof" className="-mt-[2px] pt-36 pb-40 px-6 md:px-20 bg-[#2B0B12] text-white relative overflow-hidden">
        {/* Top Outer Padding Gradient Ambient Overlay */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#8C2D40]/35 via-[#6B1D2F]/20 to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 left-1/3 w-[600px] h-[220px] bg-gradient-to-r from-[#8C2D40]/50 via-[#E07A5F]/35 to-[#6B1D2F]/45 rounded-full blur-3xl pointer-events-none z-10" />

        {/* Bottom Outer Padding Gradient Ambient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#8C2D40]/35 via-[#6B1D2F]/20 to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[220px] bg-gradient-to-r from-[#6B1D2F]/45 via-[#E07A5F]/35 to-[#8C2D40]/50 rounded-full blur-3xl pointer-events-none z-10" />

        {/* Top Wave Curve Divider */}
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none z-20 pointer-events-none -translate-y-[2px]">
          <svg 
            className="relative block w-full h-[80px] sm:h-[120px] md:h-[150px]" 
            viewBox="0 0 1440 130" 
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="topProofBlur" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="8" />
              </filter>
              <linearGradient id="proofTopGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8C2D40" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#E07A5F" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#6B1D2F" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="proofTopGrad2" x1="0%" y1="0%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#E07A5F" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#8C2D40" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="proofTopGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6B1D2F" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#3D121B" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Wave Layer Glow Blur */}
            <path 
              d="M0,0 L1440,0 L1440,110 C1200,20 960,130 720,70 C480,10 240,110 0,40 Z" 
              fill="url(#proofTopGrad1)" 
              filter="url(#topProofBlur)"
            />
            {/* Wave Layer 1 (Accent Burgundy Gradient) */}
            <path 
              d="M0,0 L1440,0 L1440,90 C1200,30 960,110 720,60 C480,10 240,90 0,30 Z" 
              fill="url(#proofTopGrad1)" 
            />
            {/* Wave Layer 2 (Warm Terracotta / Rose Gradient) */}
            <path 
              d="M0,0 L1440,0 L1440,65 C1150,120 850,20 550,85 C280,140 120,40 0,75 Z" 
              fill="url(#proofTopGrad2)" 
            />
            {/* Wave Layer 3 (Deep Rose Glow Gradient) */}
            <path 
              d="M0,0 L1440,0 L1440,30 C1100,80 800,10 450,60 C250,90 100,20 0,40 Z" 
              fill="url(#proofTopGrad3)" 
            />
            {/* Main Top Section Background Cutout (#ffffff) */}
            <path 
              d="M0,0 L1440,0 L1440,45 C1100,105 750,15 400,80 C200,115 80,45 0,55 Z" 
              fill="#ffffff"
            />
          </svg>
        </div>

        {/* Bottom Wave Curve Divider */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-20 pointer-events-none translate-y-[1px]">
          <svg 
            className="relative block w-full h-[80px] sm:h-[120px] md:h-[150px]" 
            viewBox="0 0 1440 130" 
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="btmProofBlur" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="8" />
              </filter>
              <linearGradient id="proofBtmGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8C2D40" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#E07A5F" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#6B1D2F" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="proofBtmGrad2" x1="0%" y1="0%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#E07A5F" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#8C2D40" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="proofBtmGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6B1D2F" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#3D121B" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Wave Layer Glow Blur */}
            <path 
              d="M0,130 L1440,130 L1440,20 C1200,100 960,-10 720,50 C480,110 240,10 0,70 Z" 
              fill="url(#proofBtmGrad1)" 
              filter="url(#btmProofBlur)"
            />
            {/* Wave Layer 1 (Accent Burgundy Gradient) */}
            <path 
              d="M0,130 L1440,130 L1440,30 C1200,90 960,10 720,60 C480,110 240,30 0,90 Z" 
              fill="url(#proofBtmGrad1)" 
            />
            {/* Wave Layer 2 (Warm Terracotta / Rose Gradient) */}
            <path 
              d="M0,130 L1440,130 L1440,55 C1150,5 850,100 550,35 C280,-20 120,80 0,45 Z" 
              fill="url(#proofBtmGrad2)" 
            />
            {/* Wave Layer 3 (Deep Rose Glow Gradient) */}
            <path 
              d="M0,130 L1440,130 L1440,85 C1100,40 800,110 450,50 C250,20 100,90 0,70 Z" 
              fill="url(#proofBtmGrad3)" 
            />
            {/* Main Bottom Section Background Cutout (#ffffff) */}
            <path 
              d="M0,130 L1440,130 L1440,75 C1100,15 750,105 400,40 C200,5 80,75 0,65 Z" 
              fill="#ffffff"
            />
          </svg>
        </div>

        {/* Background glow effects */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#6B1D2F]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-rose-950/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Main Proof Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 flex justify-center text-white">
              <TrueFocus 
                sentence="AI Speed + | Human Engineering" 
                separator=" | "
                borderColor="#E07A5F" 
                glowColor="rgba(224, 122, 95, 0.5)" 
                animationDuration={0.5} 
                pauseBetweenAnimations={1} 
              />
            </h2>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed">
              Explore how I leverage AI for initial velocity while taking full control over UI craftsmanship and code safety.
            </p>
          </div>

          {/* 3 Distinct UI Enhancement Showcase 3D Flip Cards */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 [&>*:last-child]:md:col-span-2 [&>*:last-child]:lg:col-span-1">
              {[
                {
                  title: "Appropriate fonts and visuals",
                  rawImg: "/assets/aistudio/Untitled6_20261122233208_4e01f8dd.png",
                  enhancedImg: "/assets/aistudio/Untitled6_20261122233756_398a7fc8.png",
                  rawText: "No text styling, blank footer and no images on cards make it difficult to identify flowers.",
                  enhancedText: "Personally selected and uploaded flower images on cards and added navbar and footer styling."
                },
                {
                  title: "Bookish theme on literature",
                  rawImg: "/assets/aistudio/Untitled6_20261123001246_c2e05229.png",
                  enhancedImg: "/assets/aistudio/Untitled6_20261123001526_c25c93c8.png",
                  rawText: "Generic elements styling with no unique identity, although having sloppy structure.",
                  enhancedText: "Created a book-style website design with artistic visuals and more interactive simulations."
                },
                {
                  title: "Dark and light theme toggle",
                  rawImg: "/assets/aistudio/Untitled6_20261122235425_e7970fea.png",
                  enhancedImg: "/assets/aistudio/Untitled6_20261123000021_bec228d7.png",
                  rawText: "A task management platform with simple styling and minimal animations having different styles on different pages.",
                  enhancedText: "Implemented smooth theme toggle, inhanced assistant appearance and kept minecraft theme throughout the website."
                }
              ].map((item, idx) => (
                <ProofFlipCard key={idx} item={item} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section - Shipped Proof */}
      <section id="projects" className="py-32 px-6 md:px-20 bg-white overflow-x-clip">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-[1px] w-12 bg-[#6B1D2F]" />
            <span className="text-[#8C2D40] font-bold uppercase tracking-widest text-lg">Proof of Shipment</span>
          </div>
          
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#1C1917]">
              Published Projects
            </h2>
          </div>

          {/* Published Projects: Dynamic Masonry Layout */}
          <div className="mb-20">
            <Masonry
              items={[
                {
                  id: "pub-1",
                  img: "/assets/aistudio/Untitled7_20261123011958_538ac064.png",
                  url: "https://solo-leveling-system-xi.vercel.app",
                  height: 540,
                  title: "Solo Leveling System",
                  desc: "A gamified task management and learning platform featuring XP progression, daily quests, and adaptive study workflows.",
                  stack: ["React", "Firebase", "Gemini API"],
                  imageFit: "contain",
                  bgColor: "#ffffff"
                },
                {
                  id: "pub-2",
                  img: "/assets/aistudio/Untitled7_20261123011439_0b364adf.png",
                  url: "https://example.com/infix-clothing",
                  height: 540,
                  title: "Election Explorer",
                  desc: "A useful website for individuals which are trying to understand elections and are first time voters via a simulation.",
                  stack: ["React", "Firebase"],
                  imageFit: "contain",
                  bgColor: "#ffffff"
                },
                {
                  id: "pub-3",
                  img: "/assets/aistudio/Untitled7_20261123005155_2617deeb.png",
                  url: "https://cook-book-psi.vercel.app",
                  height: 560,
                  title: "Cookbook - Recipe Book & Planner",
                  desc: "A curated recipe library and weekly meal planner equipped with an interactive macro and nutrition evaluator.",
                  stack: ["TypeScript", "React", "Gemini API"],
                  imageFit: "contain",
                  bgColor: "#ffffff"
                },
                {
                  id: "pub-4",
                  img: "/assets/aistudio/Untitled7_20261123010249_d4fc6863.png",
                  url: "https://floral-spectrum.vercel.app",
                  height: 560,
                  title: "Floral Spectrum",
                  desc: "An interactive botanical reference platform built for botanists to explore rare species, taxonomy, and floral traits.",
                  stack: ["React", "TailwindCSS"],
                  imageFit: "contain",
                  bgColor: "#ffffff"
                }
              ]}
              ease="power3.out"
              duration={0.6}
              stagger={0.14}
              animateFrom="alternate"
              scrollTrigger={true}
              scaleOnHover={true}
              hoverScale={0.96}
              blurToFocus={true}
              colorShiftOnHover={true}
            />
          </div>

          {/* In Development Prototypes */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-[#1C1917]">Prototypes & Concepts in Development</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 md:gap-6 pt-2 pb-4">
              {UNPUBLISHED_PROJECTS.map((project) => (
                <div 
                  key={project.id} 
                  className="unpublished-project-card relative aspect-square rounded-2xl overflow-hidden border border-stone-200/40 md:border-stone-200/60 bg-stone-50 flex items-center justify-center cursor-pointer group shadow-sm hover:shadow-md transition-shadow duration-300"
                  onClick={() => setSelectedProject(project)}
                >
                  <img 
                    src={project.mainImg} 
                    alt={project.name} 
                    className="prototype-hover-img w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center pointer-events-none">
                    <p className="text-white text-xs font-bold uppercase tracking-widest drop-shadow-md">{project.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills & Capabilities Section */}
      <section id="skills" className="pt-24 md:pt-32 pb-0 px-6 md:px-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-[1px] w-12 bg-[#6B1D2F]" />
            <span className="text-[#8C2D40] font-bold uppercase tracking-widest text-lg">Capabilities</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-12 text-[#1C1917]">
            Skills & Technical Mastery
          </h2>

          {/* Interactive Option Wheels for Soft and Technical Skills (No inner boxed container, directly on white canvas) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mb-20">
            {/* Soft Skills Column (Left Edge) */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-stone-100">
                <div>
                  <h3 className="text-2xl font-bold text-[#1C1917]">Soft Skills</h3>
                  <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">Scroll/drag to view</p>
                </div>
              </div>

              {/* Wheel Stage starting directly from left edge */}
              <div className="h-[380px] sm:h-[420px] md:h-[480px] w-full relative bg-transparent overflow-hidden">
                <OptionWheel
                  items={[
                    'Code Ownership',
                    'Rapid Learning',
                    'Effective Communication',
                    'Problem Solving',
                    'Creative Thinking',
                    'Client Alignment',
                    'Adaptability'
                  ]}
                  defaultSelected={2}
                  textColor="#71717a"
                  activeColor="#000000"
                  side="left"
                  fontSize={2.2}
                  spacing={1.6}
                  curve={1.2}
                  tilt={7}
                  blur={2.5}
                  fade={0.35}
                  smoothing={200}
                  inset={24}
                  loop={false}
                  draggable={true}
                />
              </div>
            </div>

            {/* Technical Skills Column (Right Edge) */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-stone-100 md:justify-end">
                <div className="md:text-right">
                  <h3 className="text-2xl font-bold text-[#1C1917]">Technical Skills</h3>
                  <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">Scroll/drag to view</p>
                </div>
              </div>

              {/* Wheel Stage starting directly from right edge */}
              <div className="h-[380px] sm:h-[420px] md:h-[480px] w-full relative bg-transparent overflow-hidden">
                <OptionWheel
                  items={[
                    'JavaScript',
                    'TypeScript',
                    'React.js',
                    'TailwindCSS',
                    'System Design',
                    'Firebase & Supabase',
                    'GSAP & Motion',
                    'Git & Github'
                  ]}
                  defaultSelected={2}
                  textColor="#71717a"
                  activeColor="#000000"
                  side="right"
                  fontSize={2.2}
                  spacing={1.6}
                  curve={1.2}
                  tilt={7}
                  blur={2.5}
                  fade={0.35}
                  smoothing={200}
                  inset={24}
                  loop={false}
                  draggable={true}
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* AI-Accelerated Workflow Section (Full-bleed edge-to-edge with zero horizontal slider/overflow) */}
      <section id="workflow" className="w-full relative overflow-x-clip bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-20 pt-16 pb-8">
          <div className="flex items-center space-x-4">
            <div className="h-[1px] w-12 bg-[#6B1D2F]" />
            <h3 className="text-3xl font-bold text-[#1C1917]">AI-Accelerated Workflow</h3>
          </div>
        </div>

        <div className="w-full relative overflow-x-clip">
          <GlassAssembly nextSectionId="education" />
        </div>
      </section>

      {/* Certifications & Credentials */}
      <section id="education" className="py-24 bg-white border-t border-stone-100 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-20 mb-6">
          <div className="flex items-center space-x-4 mb-3">
            <div className="h-[1px] w-12 bg-[#6B1D2F]" />
            <span className="text-[#8C2D40] font-bold uppercase tracking-widest text-lg">Certifications & Credentials</span>
          </div>
          <p className="text-stone-600 text-base md:text-lg font-medium pl-16">
            You can verify these credentials via my{" "}
            <a 
              href="https://www.linkedin.com/in/sakshi-8b17732b4?utm_source=share_via&utm_content=profile&utm_medium=member_android" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#8C2D40] font-semibold underline underline-offset-4 hover:text-[#1C1917] transition-colors"
            >
              LinkedIn Profile
            </a>
          </p>
        </div>

        <div className="w-full px-4 sm:px-6 md:px-12 pt-4 pb-2">
          <CardStack
            items={CREDENTIAL_STACK_ITEMS}
            initialIndex={0}
            maxVisible={5}
            cardWidth={stackDimensions.width}
            cardHeight={stackDimensions.height}
            overlap={0.48}
            spreadDeg={42}
            depthPx={130}
            autoAdvance
            intervalMs={2600}
            pauseOnHover
            showDots
            renderCard={(item) => (
              <div className="h-full w-full overflow-hidden bg-white">
                <img
                  src={item.imageSrc}
                  alt={item.title}
                  className="h-full w-full object-contain"
                  draggable={false}
                  loading="eager"
                />
              </div>
            )}
          />
        </div>
      </section>

      {/* Footer / CTA Section */}
      <footer id="contact" className="bg-[#020404] text-white pt-48 sm:pt-60 md:pt-72 pb-16 sm:pb-24 px-6 md:px-20 relative overflow-hidden">
        {/* Responsive Footer Background Image (Statically anchored to bottom with bottom static effect) */}
        <div className="absolute top-12 sm:top-20 md:top-24 bottom-0 left-0 right-0 z-0 overflow-hidden pointer-events-none select-none bg-[#020404]">
          <img
            src="/assets/aistudio/image_30b63e87_aa9ad8f6.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-[66%_16%] lg:object-contain lg:object-right-bottom scale-[1.24] origin-[66%_22%] sm:scale-[1.28] sm:origin-[68%_22%] md:scale-[1.32] md:origin-[70%_22%] lg:scale-[1.4] lg:origin-[76%_22%] opacity-90 md:opacity-95 transition-transform duration-700 ease-out"
          />

          {/* Soft Readability Vignette (desktop left-side text contrast only; no black overlay on mobile) */}
          <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#020404]/85 via-[#020404]/20 to-transparent" />

          {/* Static Noise / Analog Grain Effect intensifying toward the bottom */}
          <div
            className="absolute inset-0 opacity-45 mix-blend-screen"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='footerStatic'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23footerStatic)' opacity='0.55'/%3E%3C/svg%3E")`,
              backgroundSize: '180px 180px',
              maskImage: 'linear-gradient(to bottom, transparent 35%, rgba(0, 0, 0, 0.45) 72%, rgba(0, 0, 0, 1) 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 35%, rgba(0, 0, 0, 0.45) 72%, rgba(0, 0, 0, 1) 100%)',
            }}
          />

          {/* Subtle Horizontal Scanline Static Texture toward bottom */}
          <div
            className="absolute inset-x-0 bottom-0 h-44 opacity-25"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 3px)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
            }}
          />

          {/* Subtle Bottom Edge Static Grounding (kept minimal on mobile so image stays bright) */}
          <div className="absolute inset-x-0 bottom-0 h-10 md:h-24 bg-gradient-to-t from-[#020404]/65 via-[#020404]/20 to-transparent md:from-[#020404] md:via-[#020404]/55" />
        </div>

        {/* Top Wave Ambient Blur Gradient Glows */}
        <div className="absolute top-0 left-1/4 -translate-y-1/3 w-[500px] h-[180px] bg-gradient-to-r from-[#8C2D40]/60 via-[#E07A5F]/40 to-[#581C24]/60 rounded-full blur-3xl pointer-events-none z-10" />
        <div className="absolute top-10 right-10 w-[400px] h-[160px] bg-gradient-to-r from-[#6B1D2F]/50 via-[#8C2D40]/40 to-[#2B0C12]/60 rounded-full blur-3xl pointer-events-none z-10" />

        {/* Top Wave Layered Divider with Blur Gradient Effect */}
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none z-20 pointer-events-none -translate-y-[1px]">
          <svg 
            className="relative block w-full h-[90px] sm:h-[140px] md:h-[200px]" 
            viewBox="0 0 1440 180" 
            preserveAspectRatio="none"
          >
            <defs>
              {/* Blur Filters */}
              <filter id="softWaveBlur" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="8" />
              </filter>
              <filter id="deepWaveBlur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="14" />
              </filter>

              {/* Rich Burgundy Gradients */}
              <linearGradient id="burgundyGradGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E07A5F" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#8C2D40" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#581C24" stopOpacity="0.6" />
              </linearGradient>

              <linearGradient id="burgundyGrad1" x1="0%" y1="0%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#B8324E" />
                <stop offset="45%" stopColor="#8C2D40" />
                <stop offset="100%" stopColor="#581C24" />
              </linearGradient>

              <linearGradient id="burgundyGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8C2D40" />
                <stop offset="50%" stopColor="#6B1D2F" />
                <stop offset="100%" stopColor="#2B0C12" />
              </linearGradient>

              <linearGradient id="nearBlackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3D121B" />
                <stop offset="50%" stopColor="#2B0C12" />
                <stop offset="100%" stopColor="#120E10" />
              </linearGradient>

              <linearGradient id="topWhiteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
              </linearGradient>
            </defs>

            {/* Ambient Blurred Glow Wave Path (Behind Main Waves) */}
            <path 
              d="M0,0 L1440,0 L1440,165 C1200,20 950,185 700,70 C450,-25 230,175 0,60 Z" 
              fill="url(#burgundyGradGlow)" 
              filter="url(#deepWaveBlur)"
            />

            {/* Soft Glow Layer (Lighter Rose-Burgundy) */}
            <path 
              d="M0,0 L1440,0 L1440,150 C1220,30 980,175 720,80 C480,-15 260,160 0,70 Z" 
              fill="url(#burgundyGrad1)" 
              fillOpacity="0.85"
            />

            {/* Blurred Edge Overlay Layer */}
            <path 
              d="M0,0 L1440,0 L1440,135 C1200,40 930,160 670,100 C410,40 210,145 0,95 Z" 
              fill="url(#burgundyGradGlow)" 
              filter="url(#softWaveBlur)"
              fillOpacity="0.7"
            />

            {/* Rich Burgundy Flow Layer */}
            <path 
              d="M0,0 L1440,0 L1440,120 C1180,170 910,25 640,125 C390,175 180,35 0,115 Z" 
              fill="url(#burgundyGrad2)" 
              fillOpacity="0.95"
            />

            {/* Dark Burgundy Wave Layer */}
            <path 
              d="M0,0 L1440,0 L1440,90 C1210,15 930,140 600,45 C340,-15 140,120 0,80 Z" 
              fill="url(#burgundyGrad3)" 
            />

            {/* Near Black Burgundy Layer */}
            <path 
              d="M0,0 L1440,0 L1440,65 C1120,130 810,10 460,95 C240,135 80,25 0,55 Z" 
              fill="url(#nearBlackGrad)"
            />

            {/* Top Cutout (White #ffffff matching section above) */}
            <path 
              d="M0,0 L1440,0 L1440,42 C1150,98 840,8 480,82 C250,118 90,18 0,32 Z" 
              fill="url(#topWhiteGrad)"
            />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 pt-12 sm:pt-20 md:pt-32">
          <div className="grid md:grid-cols-2 gap-16 mb-0 mt-8 sm:mt-14 md:mt-20">
            <div>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-none text-white">
                Let's work <br />
                <span className="inline-block w-full max-w-[320px] sm:max-w-[420px] h-20 md:h-28 align-middle">
                  <ParticleText
                    text="together."
                    particleSize={2.5}
                    density={3}
                    color="#8C2D40"
                    highlightColor="#E06D85"
                    scatter={140}
                    gatherDuration={1600}
                    stagger={380}
                    pointerRepel={40}
                    repelRadius={110}
                    idleDrift={0.6}
                    trigger="hover"
                    fontSize="clamp(2.8rem, 6.5vw, 4.8rem)"
                    fontWeight={800}
                    fontFamily="inherit"
                    glow
                  />
                </span>
              </h2>
              <p className="text-stone-400 text-lg mb-8 max-w-md">
                Are you a Tech Lead looking for a developer who can pick up feature requests and ship them immediately? Let's connect directly.
              </p>

              <div className="flex flex-row items-center gap-3 sm:gap-4">
                <FlowerCTAWrapper>
                  <SpecularButton 
                    onClick={() => setShowInviteModal(true)}
                    size="lg"
                    radius={9999}
                    tint="#581C24"
                    tintOpacity={1}
                    textColor="#ffffff"
                    lineColor="#ffffff"
                    baseColor="#3D1017"
                    intensity={1.2}
                    className="!h-12 sm:!h-14 !py-0 px-5 sm:px-8 font-bold text-xs sm:text-sm shadow-xl hover:scale-105 transition-transform flex items-center justify-center"
                  >
                    <Mail size={18} />
                    <span>Send Interview Invite</span>
                  </SpecularButton>
                </FlowerCTAWrapper>

                <a 
                  href="https://www.linkedin.com/in/sakshi-8b17732b4?utm_source=share_via&utm_content=profile&utm_medium=member_android" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="!h-12 !w-12 sm:!h-14 sm:!w-14 !p-0 bg-transparent text-white border-2 border-[#8C2D40] rounded-full hover:bg-[#8C2D40] hover:scale-105 transition-all shrink-0 flex items-center justify-center shadow-lg"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
              </div>
            </div>

            <div className="flex flex-col justify-end items-start md:items-end mt-6 md:mt-0">
              <div className="text-left md:text-right space-y-1">
                <p className="text-stone-300 text-sm font-medium">Sakshi</p>
                <p className="text-stone-500 text-xs tracking-widest uppercase">Full-Stack Developer</p>
                <p className="text-stone-500 text-xs tracking-widest uppercase">Faridabad, Haryana, India</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 p-4 bg-[#581C24] text-white rounded-full shadow-2xl hover:bg-[#3D1017] hover:scale-110 transition-all z-40"
        aria-label="Back to Top"
      >
        <ChevronUp size={22} />
      </button>
    </div>
  );
}

