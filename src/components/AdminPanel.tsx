import React, { useState, useEffect, useRef } from "react";
import { 
  PortfolioConfig, 
  DEFAULT_PORTFOLIO_CONFIG, 
  loadPortfolioConfig, 
  loadFromIndexedDB,
  savePortfolioConfig, 
  resetPortfolioConfig,
  PublishedProjectItem,
  UnpublishedProjectItem,
  ProofCardItem,
  CertificationItem
} from "../lib/portfolioStore";
import { 
  ArrowLeft, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Video, 
  Volume2, 
  VolumeX, 
  Image, 
  Award, 
  Briefcase, 
  Layers, 
  FileCode, 
  Check, 
  Sparkles, 
  Sliders, 
  Eye, 
  Film, 
  Maximize2,
  Copy,
  Terminal,
  Compass
} from "lucide-react";

interface AdminPanelProps {
  onBackToSite: () => void;
}

const PRESET_VIDEOS = [
  {
    name: "Tech Screens & Code (Default)",
    url: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-graphs-and-code-31912-large.mp4"
  },
  {
    name: "Futuristic Cyber Grid Network",
    url: "https://assets.mixkit.co/videos/preview/mixkit-tunnel-of-futuristic-lines-and-geometric-shapes-41804-large.mp4"
  },
  {
    name: "Floating Digital Data Particles",
    url: "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-1728-large.mp4"
  },
  {
    name: "Subtle Geometric Plexus",
    url: "https://assets.mixkit.co/videos/preview/mixkit-digital-network-lines-connecting-41793-large.mp4"
  }
];

const PRESET_FOOTER_IMAGES = [
  {
    name: "Dark Cyber Grid (Default)",
    url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1600"
  },
  {
    name: "Deep Space Architecture",
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600"
  },
  {
    name: "Minimalist High-Tech Circuit",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1600"
  },
  {
    name: "Abstract Warm Burgundy Mesh",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1600"
  }
];

export default function AdminPanel({ onBackToSite }: AdminPanelProps) {
  const [config, setConfig] = useState<PortfolioConfig>(() => loadPortfolioConfig());
  const [activeTab, setActiveTab] = useState<"hero" | "projects" | "prototypes" | "proof" | "certifications" | "footer" | "backup">("hero");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [importJsonText, setImportJsonText] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const [previewFlippedCard, setPreviewFlippedCard] = useState<string | null>(null);
  const [testVideoMuted, setTestVideoMuted] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importFileInputRef = useRef<HTMLInputElement>(null);

  // Asynchronously hydrate from IndexedDB to restore complete data including any media assets
  useEffect(() => {
    loadFromIndexedDB().then((idbConfig) => {
      if (idbConfig) {
        setConfig(idbConfig);
      }
    }).catch(console.warn);
  }, []);

  useEffect(() => {
    // When config changes, auto-save safely (persisting to IndexedDB and syncing localStorage)
    savePortfolioConfig(config);
  }, [config]);

  const showToast = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleManualSave = () => {
    try {
      savePortfolioConfig(config);
      showToast("All changes saved successfully!");
    } catch {
      showToast("Error saving to local storage.");
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all data back to factory defaults? Any custom modifications will be restored to the initial state.")) {
      const reset = resetPortfolioConfig();
      setConfig(reset);
      showToast("Reset to default configuration.");
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sakshi-portfolio-config-${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Configuration JSON exported!");
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    showToast("JSON copied to clipboard!");
  };

  const handleImportSubmit = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      if (!parsed.hero || !parsed.publishedProjects) {
        throw new Error("Invalid schema");
      }
      setConfig(parsed);
      savePortfolioConfig(parsed);
      setShowImportModal(false);
      setImportJsonText("");
      showToast("Configuration imported successfully!");
    } catch {
      alert("Invalid JSON format. Please verify the JSON structure and try again.");
    }
  };

  const handleImportFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        setConfig(parsed);
        savePortfolioConfig(parsed);
        showToast("JSON file loaded and applied!");
      } catch {
        alert("Failed to parse the uploaded JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Helper for image and video uploads with client-side canvas compression for images
  const handleMediaUpload = (callback: (base64Url: string) => void) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,video/*";
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;
      if (file.size > 30 * 1024 * 1024) {
        alert("File size exceeds 30MB limit. Please provide an external URL or compress the media file.");
        return;
      }

      // If image file, automatically downscale and compress via Canvas to save 90%+ space
      if (file.type.startsWith("image/")) {
        const img = new window.Image();
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          const rawResult = uploadEvent.target?.result as string;
          img.onload = () => {
            try {
              const canvas = document.createElement("canvas");
              let { width, height } = img;
              const maxDim = 1600;
              if (width > maxDim || height > maxDim) {
                if (width > height) {
                  height = Math.round((height * maxDim) / width);
                  width = maxDim;
                } else {
                  width = Math.round((width * maxDim) / height);
                  height = maxDim;
                }
              }
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                const compressedUrl = canvas.toDataURL("image/jpeg", 0.86);
                callback(compressedUrl);
                showToast("Image optimized and saved!");
                return;
              }
            } catch (err) {
              console.warn("Canvas compression failed, falling back to original:", err);
            }
            callback(rawResult);
            showToast("Image saved!");
          };
          img.onerror = () => {
            callback(rawResult);
            showToast("Image saved!");
          };
          img.src = rawResult;
        };
        reader.readAsDataURL(file);
        return;
      }

      // For video or other media files
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        callback(result);
        showToast("Video uploaded and saved!");
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-[#0D0A0B] text-stone-100 font-sans selection:bg-[#8C2D40] selection:text-white pb-20">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-[#140F11]/95 backdrop-blur-md border-b border-[#8C2D40]/30 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBackToSite}
            className="flex items-center space-x-2 text-stone-300 hover:text-white px-3.5 py-2 rounded-xl bg-stone-900/80 hover:bg-[#8C2D40]/40 border border-stone-800 transition-all text-xs sm:text-sm font-semibold group cursor-pointer"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Live Portfolio</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
              <span className="text-[#E07A5F]">CMS</span> ADMIN PORTAL
            </h1>
            <span className="hidden sm:inline-block text-[11px] uppercase tracking-wider font-bold bg-[#8C2D40]/30 text-[#E07A5F] px-2.5 py-0.5 rounded-full border border-[#8C2D40]/50">
              Live Dynamic Content
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          {saveStatus && (
            <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-600/50 px-3 py-1.5 rounded-lg shadow-sm animate-fade-in">
              <Check size={14} />
              <span>{saveStatus}</span>
            </div>
          )}

          <button 
            onClick={handleManualSave}
            className="flex items-center space-x-1.5 bg-[#8C2D40] hover:bg-[#6B1D2F] text-white px-4 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            <Save size={15} />
            <span>Save All</span>
          </button>

          <button 
            onClick={handleReset}
            title="Reset to original portfolio defaults"
            className="p-2 text-stone-400 hover:text-rose-400 bg-stone-900 hover:bg-stone-800 rounded-xl border border-stone-800 transition-colors cursor-pointer"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto scrollbar-none gap-2 p-1.5 bg-[#171214] rounded-2xl border border-stone-800/80 mb-8">
          {[
            { id: "hero", label: "Hero & Video", icon: Video },
            { id: "projects", label: "Published Projects", icon: Briefcase },
            { id: "prototypes", label: "In-Dev Prototypes", icon: Layers },
            { id: "proof", label: "Screenshot Cards", icon: Image },
            { id: "certifications", label: "Certifications", icon: Award },
            { id: "footer", label: "Footer & Contact", icon: Sliders },
            { id: "backup", label: "Backup & Export", icon: Download }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                  isActive 
                    ? "bg-[#8C2D40] text-white shadow-lg shadow-[#8C2D40]/30" 
                    : "text-stone-400 hover:text-stone-200 hover:bg-stone-900/60"
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: HERO & VIDEO */}
        {activeTab === "hero" && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-[#171214] border border-stone-800/90 rounded-3xl p-6 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-stone-800/80 gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <Video className="text-[#E07A5F]" size={24} />
                    <span>Hero Section Background Video & Audio</span>
                  </h2>
                  <p className="text-stone-400 text-xs sm:text-sm mt-1">
                    Configure the ambient background video, toggle sound, adjust opacity, and preview live in real-time.
                  </p>
                </div>
                
                {/* Toggles */}
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2.5 cursor-pointer bg-stone-900/80 px-4 py-2 rounded-xl border border-stone-800">
                    <input 
                      type="checkbox"
                      checked={config.hero.videoEnabled}
                      onChange={(e) => setConfig({
                        ...config,
                        hero: { ...config.hero, videoEnabled: e.target.checked }
                      })}
                      className="rounded accent-[#8C2D40] w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-300">Video Active</span>
                  </label>

                  <label className="flex items-center space-x-2.5 cursor-pointer bg-stone-900/80 px-4 py-2 rounded-xl border border-stone-800">
                    <input 
                      type="checkbox"
                      checked={config.hero.videoAudioEnabled}
                      onChange={(e) => setConfig({
                        ...config,
                        hero: { ...config.hero, videoAudioEnabled: e.target.checked }
                      })}
                      className="rounded accent-[#8C2D40] w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-300">Audio Unmute Button</span>
                  </label>
                </div>
              </div>

              {/* Video URL & Presets */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                      Video Source URL (MP4 / WebM direct URL)
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={config.hero.videoUrl}
                        onChange={(e) => setConfig({
                          ...config,
                          hero: { ...config.hero, videoUrl: e.target.value }
                        })}
                        placeholder="https://example.com/video.mp4"
                        className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-sm font-mono text-stone-200 focus:outline-none focus:border-[#8C2D40]"
                      />
                      <button
                        type="button"
                        onClick={() => handleMediaUpload((base64) => {
                          setConfig({
                            ...config,
                            hero: { ...config.hero, videoUrl: base64 }
                          });
                        })}
                        className="px-4 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      >
                        <Upload size={14} />
                        <span>Upload</span>
                      </button>
                    </div>
                  </div>

                  {/* Preset quick buttons */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                      Curated Tech Video Presets
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {PRESET_VIDEOS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setConfig({
                            ...config,
                            hero: { ...config.hero, videoUrl: preset.url }
                          })}
                          className={`text-left p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                            config.hero.videoUrl === preset.url
                              ? "bg-[#8C2D40]/30 border-[#8C2D40] text-white"
                              : "bg-stone-900/60 border-stone-800/80 text-stone-400 hover:bg-stone-800/80 hover:text-stone-200"
                          }`}
                        >
                          <div className="font-bold mb-0.5">{preset.name}</div>
                          <div className="text-[10px] text-stone-500 truncate">{preset.url}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sliders: Opacity & Volume */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="bg-stone-900/80 p-4 rounded-xl border border-stone-800">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                        <span className="text-stone-400">Video Opacity</span>
                        <span className="text-[#E07A5F]">{Math.round(config.hero.videoOpacity * 100)}%</span>
                      </div>
                      <input 
                        type="range"
                        min="0.05"
                        max="0.80"
                        step="0.02"
                        value={config.hero.videoOpacity}
                        onChange={(e) => setConfig({
                          ...config,
                          hero: { ...config.hero, videoOpacity: parseFloat(e.target.value) }
                        })}
                        className="w-full accent-[#8C2D40] cursor-pointer"
                      />
                      <p className="text-[11px] text-stone-500 mt-1">Keeps text in the foreground readable</p>
                    </div>

                    <div className="bg-stone-900/80 p-4 rounded-xl border border-stone-800">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                        <span className="text-stone-400">Default Audio Volume</span>
                        <span className="text-[#E07A5F]">{Math.round(config.hero.videoVolume * 100)}%</span>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={config.hero.videoVolume}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setConfig({
                            ...config,
                            hero: { ...config.hero, videoVolume: val }
                          });
                          if (videoRef.current) {
                            videoRef.current.volume = val;
                          }
                        }}
                        className="w-full accent-[#8C2D40] cursor-pointer"
                      />
                      <p className="text-[11px] text-stone-500 mt-1">Volume when unmuted by user</p>
                    </div>
                  </div>
                </div>

                {/* Live Video Preview Box */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                      <Eye size={14} className="text-[#E07A5F]" />
                      <span>Live Video Stage Preview</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        if (videoRef.current) {
                          const nextMute = !videoRef.current.muted;
                          videoRef.current.muted = nextMute;
                          setTestVideoMuted(nextMute);
                        }
                      }}
                      className="text-xs font-bold flex items-center gap-1.5 px-3 py-1 bg-stone-900 border border-stone-800 rounded-lg text-stone-300 hover:text-white hover:border-[#8C2D40] cursor-pointer"
                    >
                      {testVideoMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-emerald-400" />}
                      <span>{testVideoMuted ? "Audio Muted (Click to Test Sound)" : "Audio Playing!"}</span>
                    </button>
                  </div>

                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-stone-800 shadow-2xl flex items-center justify-center group">
                    {config.hero.videoUrl && config.hero.videoEnabled ? (
                      <>
                        <video
                          ref={videoRef}
                          src={config.hero.videoUrl}
                          autoPlay
                          loop
                          muted={testVideoMuted}
                          playsInline
                          className="w-full h-full object-cover transition-opacity duration-300"
                          style={{ opacity: config.hero.videoOpacity }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                        
                        {/* Simulation of Hero Text over video */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-end pointer-events-none">
                          <span className="text-xs font-bold text-[#E07A5F] uppercase tracking-widest mb-1">Live Foreground Layer</span>
                          <h3 className="text-lg sm:text-xl font-bold text-white drop-shadow-md">Hi I'm Sakshi</h3>
                          <p className="text-xs text-stone-300 max-w-sm line-clamp-2 drop-shadow-sm">
                            {config.hero.subheadline}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="text-stone-500 text-xs font-medium text-center p-6">
                        Hero Video is currently disabled. Toggle &quot;Video Active&quot; to enable.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Headline and Bio Text Editor */}
            <div className="bg-[#171214] border border-stone-800/90 rounded-3xl p-6 sm:p-8 space-y-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Terminal size={18} className="text-[#E07A5F]" />
                <span>Hero Content & Bio Texts</span>
              </h3>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Hero Headline / Tagline
                </label>
                <textarea 
                  rows={3}
                  value={config.hero.headline}
                  onChange={(e) => setConfig({
                    ...config,
                    hero: { ...config.hero, headline: e.target.value }
                  })}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-sm text-stone-200 focus:outline-none focus:border-[#8C2D40]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Hero Paragraph / Positioning Statement
                </label>
                <textarea 
                  rows={3}
                  value={config.hero.subheadline}
                  onChange={(e) => setConfig({
                    ...config,
                    hero: { ...config.hero, subheadline: e.target.value }
                  })}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-sm text-stone-200 focus:outline-none focus:border-[#8C2D40]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PUBLISHED PROJECTS */}
        {activeTab === "projects" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <Briefcase className="text-[#E07A5F]" size={24} />
                  <span>Published Projects (Proof of Shipment)</span>
                </h2>
                <p className="text-stone-400 text-xs sm:text-sm mt-1">
                  Manage title, description, link, tech tags, and main image for each published card.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newProject: PublishedProjectItem = {
                    id: `pub-${Date.now()}`,
                    name: "New Shipped Project",
                    desc: "Comprehensive full-stack web application featuring modern responsive design, authentication, and API integrations.",
                    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
                    link: "https://github.com",
                    stack: ["React", "TypeScript", "TailwindCSS"]
                  };
                  setConfig({
                    ...config,
                    publishedProjects: [newProject, ...config.publishedProjects]
                  });
                  showToast("Added new published project!");
                }}
                className="flex items-center space-x-1.5 bg-[#8C2D40] hover:bg-[#6B1D2F] text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer self-start sm:self-auto"
              >
                <Plus size={16} />
                <span>Add Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {config.publishedProjects.map((project, index) => (
                <div 
                  key={project.id || index}
                  className="bg-[#171214] border border-stone-800/90 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    {/* Header with index & delete */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#E07A5F] bg-[#8C2D40]/20 px-2.5 py-1 rounded-md border border-[#8C2D40]/40">
                        Project #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (config.publishedProjects.length <= 1) {
                            alert("You should keep at least one project.");
                            return;
                          }
                          setConfig({
                            ...config,
                            publishedProjects: config.publishedProjects.filter((_, i) => i !== index)
                          });
                          showToast("Project removed.");
                        }}
                        className="text-stone-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-stone-900 transition-colors cursor-pointer"
                        title="Delete this project"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Image preview & upload */}
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/60 border border-stone-800 group">
                      <img 
                        src={project.img} 
                        alt={project.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleMediaUpload((base64) => {
                            const updated = [...config.publishedProjects];
                            updated[index].img = base64;
                            setConfig({ ...config, publishedProjects: updated });
                          })}
                          className="bg-[#8C2D40] hover:bg-[#6B1D2F] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Upload size={13} />
                          <span>Upload Image</span>
                        </button>
                      </div>
                    </div>

                    {/* Image URL input */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                        Image URL
                      </label>
                      <input 
                        type="text"
                        value={project.img}
                        onChange={(e) => {
                          const updated = [...config.publishedProjects];
                          updated[index].img = e.target.value;
                          setConfig({ ...config, publishedProjects: updated });
                        }}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-stone-200 focus:outline-none focus:border-[#8C2D40]"
                      />
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                        Project Title
                      </label>
                      <input 
                        type="text"
                        value={project.name}
                        onChange={(e) => {
                          const updated = [...config.publishedProjects];
                          updated[index].name = e.target.value;
                          setConfig({ ...config, publishedProjects: updated });
                        }}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-[#8C2D40]"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                        Description
                      </label>
                      <textarea 
                        rows={3}
                        value={project.desc}
                        onChange={(e) => {
                          const updated = [...config.publishedProjects];
                          updated[index].desc = e.target.value;
                          setConfig({ ...config, publishedProjects: updated });
                        }}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-300 focus:outline-none focus:border-[#8C2D40]"
                      />
                    </div>

                    {/* Link */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                        Visit Link / Repo URL
                      </label>
                      <input 
                        type="text"
                        value={project.link}
                        onChange={(e) => {
                          const updated = [...config.publishedProjects];
                          updated[index].link = e.target.value;
                          setConfig({ ...config, publishedProjects: updated });
                        }}
                        placeholder="https://example.com"
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-stone-200 focus:outline-none focus:border-[#8C2D40]"
                      />
                    </div>

                    {/* Tech Stack */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                        Tech Stack Tags (comma separated)
                      </label>
                      <input 
                        type="text"
                        value={project.stack.join(", ")}
                        onChange={(e) => {
                          const updated = [...config.publishedProjects];
                          updated[index].stack = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                          setConfig({ ...config, publishedProjects: updated });
                        }}
                        placeholder="React, Node.js, Express, TailwindCSS"
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-[#8C2D40]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PROTOTYPES & IN-DEV CONCEPTS */}
        {activeTab === "prototypes" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <Layers className="text-[#E07A5F]" size={24} />
                  <span>Prototypes & Concepts in Development</span>
                </h2>
                <p className="text-stone-400 text-xs sm:text-sm mt-1">
                  Manage prototype cards, main thumbnail images, descriptions, and multi-image gallery overlays.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newProto: UnpublishedProjectItem = {
                    id: Date.now(),
                    name: "New Prototype Concept",
                    description: "High-velocity proof-of-concept exploring experimental user interfaces and reactive serverless workflows.",
                    mainImg: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
                    gallery: [
                      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
                      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
                    ]
                  };
                  setConfig({
                    ...config,
                    unpublishedProjects: [...config.unpublishedProjects, newProto]
                  });
                  showToast("Added new prototype concept!");
                }}
                className="flex items-center space-x-1.5 bg-[#8C2D40] hover:bg-[#6B1D2F] text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer self-start sm:self-auto"
              >
                <Plus size={16} />
                <span>Add Prototype</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {config.unpublishedProjects.map((proto, index) => (
                <div 
                  key={proto.id || index}
                  className="bg-[#171214] border border-stone-800/90 rounded-3xl p-6 shadow-xl space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#E07A5F] bg-[#8C2D40]/20 px-2.5 py-1 rounded-md border border-[#8C2D40]/40">
                      Prototype #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setConfig({
                          ...config,
                          unpublishedProjects: config.unpublishedProjects.filter((_, i) => i !== index)
                        });
                        showToast("Prototype removed.");
                      }}
                      className="text-stone-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-stone-900 transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Thumbnail Image */}
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/60 border border-stone-800 group">
                    <img 
                      src={proto.mainImg} 
                      alt={proto.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleMediaUpload((base64) => {
                          const updated = [...config.unpublishedProjects];
                          updated[index].mainImg = base64;
                          setConfig({ ...config, unpublishedProjects: updated });
                        })}
                        className="bg-[#8C2D40] hover:bg-[#6B1D2F] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Upload size={13} />
                        <span>Upload Cover</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                      Cover Thumbnail URL
                    </label>
                    <input 
                      type="text"
                      value={proto.mainImg}
                      onChange={(e) => {
                        const updated = [...config.unpublishedProjects];
                        updated[index].mainImg = e.target.value;
                        setConfig({ ...config, unpublishedProjects: updated });
                      }}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-stone-200 focus:outline-none focus:border-[#8C2D40]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                      Prototype Name
                    </label>
                    <input 
                      type="text"
                      value={proto.name}
                      onChange={(e) => {
                        const updated = [...config.unpublishedProjects];
                        updated[index].name = e.target.value;
                        setConfig({ ...config, unpublishedProjects: updated });
                      }}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-[#8C2D40]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                      Prototype Description
                    </label>
                    <textarea 
                      rows={2}
                      value={proto.description}
                      onChange={(e) => {
                        const updated = [...config.unpublishedProjects];
                        updated[index].description = e.target.value;
                        setConfig({ ...config, unpublishedProjects: updated });
                      }}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-300 focus:outline-none focus:border-[#8C2D40]"
                    />
                  </div>

                  {/* Gallery images */}
                  <div className="pt-2 border-t border-stone-800/80">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                        Modal Gallery Images ({proto.gallery.length})
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...config.unpublishedProjects];
                          updated[index].gallery.push("https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800");
                          setConfig({ ...config, unpublishedProjects: updated });
                        }}
                        className="text-xs text-[#E07A5F] hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={12} />
                        <span>Add Gallery Photo</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {proto.gallery.map((galleryUrl, gIndex) => (
                        <div key={gIndex} className="flex items-center gap-2">
                          <input 
                            type="text"
                            value={galleryUrl}
                            onChange={(e) => {
                              const updated = [...config.unpublishedProjects];
                              updated[index].gallery[gIndex] = e.target.value;
                              setConfig({ ...config, unpublishedProjects: updated });
                            }}
                            className="flex-1 bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-stone-300"
                          />
                          <button
                            type="button"
                            onClick={() => handleMediaUpload((base64) => {
                              const updated = [...config.unpublishedProjects];
                              updated[index].gallery[gIndex] = base64;
                              setConfig({ ...config, unpublishedProjects: updated });
                            })}
                            className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs"
                            title="Upload replacement"
                          >
                            <Upload size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...config.unpublishedProjects];
                              updated[index].gallery.splice(gIndex, 1);
                              setConfig({ ...config, unpublishedProjects: updated });
                            }}
                            className="p-1.5 text-stone-500 hover:text-rose-400 rounded-lg"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SCREENSHOT CARDS (THE PROOF 3D FLIP CARDS) */}
        {activeTab === "proof" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <Image className="text-[#E07A5F]" size={24} />
                  <span>The Proof: Screenshot &amp; Audit Flip Cards</span>
                </h2>
                <p className="text-stone-400 text-xs sm:text-sm mt-1">
                  Customise raw AI screenshot vs enhanced interface images, badge titles, and auditing notes. Click on the preview to test the 3D flip effect!
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newCard: ProofCardItem = {
                    id: `proof-${Date.now()}`,
                    title: "Custom Interactive Feature",
                    badge: "Refactored UI & Architecture",
                    rawImg: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1000",
                    enhancedImg: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
                    rawText: "Unstyled layout with poor mobile responsiveness and missing defensive error handling.",
                    enhancedText: "Polished responsive component with clean state management, accessible buttons, and fluid transitions."
                  };
                  setConfig({
                    ...config,
                    proofCards: [...config.proofCards, newCard]
                  });
                  showToast("Added new proof flip card!");
                }}
                className="flex items-center space-x-1.5 bg-[#8C2D40] hover:bg-[#6B1D2F] text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer self-start sm:self-auto"
              >
                <Plus size={16} />
                <span>Add Flip Card</span>
              </button>
            </div>

            <div className="space-y-8">
              {config.proofCards.map((card, index) => {
                const isFlipped = previewFlippedCard === card.id;

                return (
                  <div 
                    key={card.id || index}
                    className="bg-[#171214] border border-stone-800/90 rounded-3xl p-6 sm:p-8 shadow-xl"
                  >
                    <div className="flex items-center justify-between pb-4 border-b border-stone-800/80 mb-6">
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#E07A5F] bg-[#8C2D40]/20 px-3 py-1 rounded-md border border-[#8C2D40]/40">
                          Flip Card #{index + 1}
                        </span>
                        <h3 className="text-lg font-bold text-white">{card.title}</h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (config.proofCards.length <= 1) {
                            alert("Keep at least one screenshot card.");
                            return;
                          }
                          setConfig({
                            ...config,
                            proofCards: config.proofCards.filter((_, i) => i !== index)
                          });
                          showToast("Proof card deleted.");
                        }}
                        className="text-stone-500 hover:text-rose-400 p-2 rounded-lg hover:bg-stone-900 transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Left: Fields Editor (8 cols) */}
                      <div className="lg:col-span-7 space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                              Card Title
                            </label>
                            <input 
                              type="text"
                              value={card.title}
                              onChange={(e) => {
                                const updated = [...config.proofCards];
                                updated[index].title = e.target.value;
                                setConfig({ ...config, proofCards: updated });
                              }}
                              className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-[#8C2D40]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                              Category Badge
                            </label>
                            <input 
                              type="text"
                              value={card.badge}
                              onChange={(e) => {
                                const updated = [...config.proofCards];
                                updated[index].badge = e.target.value;
                                setConfig({ ...config, proofCards: updated });
                              }}
                              className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm font-medium text-stone-200 focus:outline-none focus:border-[#8C2D40]"
                            />
                          </div>
                        </div>

                        {/* Front: Raw Output */}
                        <div className="p-4 bg-rose-950/20 border border-rose-900/40 rounded-2xl space-y-3">
                          <span className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            <span>Front Side (Raw AI Draft)</span>
                          </span>

                          <div className="flex gap-2">
                            <input 
                              type="text"
                              value={card.rawImg}
                              onChange={(e) => {
                                const updated = [...config.proofCards];
                                updated[index].rawImg = e.target.value;
                                setConfig({ ...config, proofCards: updated });
                              }}
                              placeholder="Raw Image URL"
                              className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-stone-200 focus:outline-none focus:border-rose-700"
                            />
                            <button
                              type="button"
                              onClick={() => handleMediaUpload((base64) => {
                                const updated = [...config.proofCards];
                                updated[index].rawImg = base64;
                                setConfig({ ...config, proofCards: updated });
                              })}
                              className="px-3 py-2 bg-rose-900/60 hover:bg-rose-900 text-rose-200 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                            >
                              <Upload size={13} />
                              <span>Upload</span>
                            </button>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-rose-300 mb-1">
                              Raw Output Issues Text
                            </label>
                            <textarea 
                              rows={2}
                              value={card.rawText}
                              onChange={(e) => {
                                const updated = [...config.proofCards];
                                updated[index].rawText = e.target.value;
                                setConfig({ ...config, proofCards: updated });
                              }}
                              className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-rose-700"
                            />
                          </div>
                        </div>

                        {/* Back: Enhanced UI */}
                        <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-2xl space-y-3">
                          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Back Side (Enhanced UI)</span>
                          </span>

                          <div className="flex gap-2">
                            <input 
                              type="text"
                              value={card.enhancedImg}
                              onChange={(e) => {
                                const updated = [...config.proofCards];
                                updated[index].enhancedImg = e.target.value;
                                setConfig({ ...config, proofCards: updated });
                              }}
                              placeholder="Enhanced Image URL"
                              className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-stone-200 focus:outline-none focus:border-emerald-700"
                            />
                            <button
                              type="button"
                              onClick={() => handleMediaUpload((base64) => {
                                const updated = [...config.proofCards];
                                updated[index].enhancedImg = base64;
                                setConfig({ ...config, proofCards: updated });
                              })}
                              className="px-3 py-2 bg-emerald-900/60 hover:bg-emerald-900 text-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                            >
                              <Upload size={13} />
                              <span>Upload</span>
                            </button>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-300 mb-1">
                              Refactored Enhancements Text
                            </label>
                            <textarea 
                              rows={2}
                              value={card.enhancedText}
                              onChange={(e) => {
                                const updated = [...config.proofCards];
                                updated[index].enhancedText = e.target.value;
                                setConfig({ ...config, proofCards: updated });
                              }}
                              className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-emerald-700"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: Live Interactive Flip Preview (5 cols) */}
                      <div className="lg:col-span-5 flex flex-col justify-center space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-stone-400">
                          <span>Live 3D Flip Preview</span>
                          <button
                            type="button"
                            onClick={() => setPreviewFlippedCard(isFlipped ? null : card.id)}
                            className="text-[#E07A5F] hover:text-white flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw size={12} />
                            <span>Flip to {isFlipped ? "Raw" : "Enhanced"}</span>
                          </button>
                        </div>

                        <div 
                          onClick={() => setPreviewFlippedCard(isFlipped ? null : card.id)}
                          className="h-[360px] w-full rounded-2xl overflow-hidden relative border border-stone-800 cursor-pointer shadow-2xl group select-none"
                        >
                          {/* Image */}
                          <img 
                            src={isFlipped ? card.enhancedImg : card.rawImg}
                            alt="Preview"
                            className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10" />

                          {/* Badge */}
                          <div className="absolute top-4 left-4 z-10">
                            <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                              isFlipped 
                                ? "bg-emerald-950/80 border border-emerald-600/60 text-emerald-200" 
                                : "bg-rose-950/80 border border-rose-700/60 text-rose-200"
                            }`}>
                              <span className={`w-2 h-2 rounded-full ${isFlipped ? "bg-emerald-400" : "bg-rose-400"}`} />
                              <span>{isFlipped ? "Enhanced UI (Back)" : "Raw AI Output (Front)"}</span>
                            </span>
                          </div>

                          {/* Content */}
                          <div className="absolute bottom-4 left-4 right-4 z-10 space-y-1">
                            <div className="text-[11px] text-stone-300 leading-snug">
                              <span className="font-bold text-white block mb-0.5">
                                {isFlipped ? "Enhancements:" : "Raw Issues:"}
                              </span>
                              {isFlipped ? card.enhancedText : card.rawText}
                            </div>
                            <h4 className="text-lg font-bold text-white pt-1">{card.title}</h4>
                            <p className="text-[10px] text-stone-400 italic">Click card to test 3D flip</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: CERTIFICATIONS */}
        {activeTab === "certifications" && (
          <div className="space-y-6 animate-fade-in">
            {/* Header Settings */}
            <div className="bg-[#171214] border border-stone-800/90 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-800/80 gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <Award className="text-[#E07A5F]" size={24} />
                    <span>Certifications &amp; Credentials Configuration</span>
                  </h2>
                  <p className="text-stone-400 text-xs sm:text-sm mt-1">
                    Control the section title, LinkedIn verification URL, total number of certifications, and credentials content.
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400 bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800">
                    Total: <span className="text-white font-extrabold">{config.certifications.items.length}</span>
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => {
                      const newCert: CertificationItem = {
                        id: `cert-${Date.now()}`,
                        title: "New Technical Credential",
                        desc: "Verified domain mastery in system architecture, modern full-stack performance optimization, and defensive engineering."
                      };
                      setConfig({
                        ...config,
                        certifications: {
                          ...config.certifications,
                          items: [...config.certifications.items, newCert]
                        }
                      });
                      showToast("Added new certification!");
                    }}
                    className="flex items-center space-x-1.5 bg-[#8C2D40] hover:bg-[#6B1D2F] text-white px-4 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                  >
                    <Plus size={16} />
                    <span>Add Certification</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                    Section Heading
                  </label>
                  <input 
                    type="text"
                    value={config.certifications.sectionHeading}
                    onChange={(e) => setConfig({
                      ...config,
                      certifications: { ...config.certifications, sectionHeading: e.target.value }
                    })}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#8C2D40]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                    LinkedIn Verification Profile URL
                  </label>
                  <input 
                    type="text"
                    value={config.certifications.linkedinUrl}
                    onChange={(e) => setConfig({
                      ...config,
                      certifications: { ...config.certifications, linkedinUrl: e.target.value }
                    })}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-xs font-mono text-stone-200 focus:outline-none focus:border-[#8C2D40]"
                  />
                </div>
              </div>
            </div>

            {/* List of Certifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {config.certifications.items.map((cert, index) => (
                <div 
                  key={cert.id || index}
                  className="bg-[#171214] border border-stone-800/90 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#E07A5F] bg-[#8C2D40]/20 px-2.5 py-1 rounded-md border border-[#8C2D40]/40">
                        Credential #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (config.certifications.items.length <= 1) {
                            alert("Keep at least one credential card.");
                            return;
                          }
                          setConfig({
                            ...config,
                            certifications: {
                              ...config.certifications,
                              items: config.certifications.items.filter((_, i) => i !== index)
                            }
                          });
                          showToast("Certification removed.");
                        }}
                        className="text-stone-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-stone-900 transition-colors cursor-pointer"
                        title="Delete certification"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                        Credential Title
                      </label>
                      <input 
                        type="text"
                        value={cert.title}
                        onChange={(e) => {
                          const updated = [...config.certifications.items];
                          updated[index].title = e.target.value;
                          setConfig({
                            ...config,
                            certifications: { ...config.certifications, items: updated }
                          });
                        }}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-[#8C2D40]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                        Curriculum &amp; Mastery Description
                      </label>
                      <textarea 
                        rows={3}
                        value={cert.desc}
                        onChange={(e) => {
                          const updated = [...config.certifications.items];
                          updated[index].desc = e.target.value;
                          setConfig({
                            ...config,
                            certifications: { ...config.certifications, items: updated }
                          });
                        }}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-300 focus:outline-none focus:border-[#8C2D40]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: FOOTER & BACKGROUND STATIC IMAGE */}
        {activeTab === "footer" && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-[#171214] border border-stone-800/90 rounded-3xl p-6 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-stone-800/80 gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <Sliders className="text-[#E07A5F]" size={24} />
                    <span>Footer Background Static Image &amp; Settings</span>
                  </h2>
                  <p className="text-stone-400 text-xs sm:text-sm mt-1">
                    Control the static backdrop behind the footer wave dividers and particle CTA section.
                  </p>
                </div>

                <label className="flex items-center space-x-2.5 cursor-pointer bg-stone-900/80 px-4 py-2 rounded-xl border border-stone-800 self-start sm:self-auto">
                  <input 
                    type="checkbox"
                    checked={config.footer.bgEnabled}
                    onChange={(e) => setConfig({
                      ...config,
                      footer: { ...config.footer, bgEnabled: e.target.checked }
                    })}
                    className="rounded accent-[#8C2D40] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-300">Background Active</span>
                </label>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                      Static Background Image URL
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={config.footer.bgImage}
                        onChange={(e) => setConfig({
                          ...config,
                          footer: { ...config.footer, bgImage: e.target.value }
                        })}
                        placeholder="https://example.com/footer-bg.jpg"
                        className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-sm font-mono text-stone-200 focus:outline-none focus:border-[#8C2D40]"
                      />
                      <button
                        type="button"
                        onClick={() => handleMediaUpload((base64) => {
                          setConfig({
                            ...config,
                            footer: { ...config.footer, bgImage: base64 }
                          });
                        })}
                        className="px-4 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      >
                        <Upload size={14} />
                        <span>Upload</span>
                      </button>
                    </div>
                  </div>

                  {/* Preset Footer Images */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                      Aesthetic Backdrop Presets
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {PRESET_FOOTER_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setConfig({
                            ...config,
                            footer: { ...config.footer, bgImage: preset.url }
                          })}
                          className={`text-left p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                            config.footer.bgImage === preset.url
                              ? "bg-[#8C2D40]/30 border-[#8C2D40] text-white"
                              : "bg-stone-900/60 border-stone-800/80 text-stone-400 hover:bg-stone-800/80 hover:text-stone-200"
                          }`}
                        >
                          <div className="font-bold mb-0.5">{preset.name}</div>
                          <div className="text-[10px] text-stone-500 truncate">{preset.url}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Opacity Slider */}
                  <div className="bg-stone-900/80 p-4 rounded-xl border border-stone-800">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                      <span className="text-stone-400">Backdrop Opacity</span>
                      <span className="text-[#E07A5F]">{Math.round(config.footer.bgOpacity * 100)}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0.05"
                      max="0.60"
                      step="0.01"
                      value={config.footer.bgOpacity}
                      onChange={(e) => setConfig({
                        ...config,
                        footer: { ...config.footer, bgOpacity: parseFloat(e.target.value) }
                      })}
                      className="w-full accent-[#8C2D40] cursor-pointer"
                    />
                    <p className="text-[11px] text-stone-500 mt-1">Controls the subtle depth of the dark footer texture</p>
                  </div>
                </div>

                {/* Footer Preview */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                    <Eye size={14} className="text-[#E07A5F]" />
                    <span>Live Footer Stage Preview</span>
                  </span>

                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#120E10] border border-stone-800 shadow-2xl flex items-center justify-center">
                    {config.footer.bgEnabled && config.footer.bgImage && (
                      <div 
                        className="absolute inset-0 bg-cover bg-center pointer-events-none transition-opacity duration-300"
                        style={{ 
                          backgroundImage: `url(${config.footer.bgImage})`,
                          opacity: config.footer.bgOpacity 
                        }}
                      />
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-[#120E10] via-transparent to-[#120E10]/80 pointer-events-none" />

                    <div className="relative z-10 p-6 text-center space-y-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Let's work together.
                      </h3>
                      <p className="text-stone-400 text-xs max-w-sm mx-auto">
                        {config.footer.subheading}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: BACKUP & EXPORT */}
        {activeTab === "backup" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#171214] border border-stone-800/90 rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <Download className="text-[#E07A5F]" size={24} />
                  <span>Portability, JSON Export &amp; Backup</span>
                </h2>
                <p className="text-stone-400 text-xs sm:text-sm mt-1">
                  Download or copy your complete configuration to keep a permanent backup or migrate across devices.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="p-5 bg-stone-900/80 hover:bg-[#8C2D40]/30 border border-stone-800 hover:border-[#8C2D40] rounded-2xl text-left transition-all cursor-pointer group"
                >
                  <Download className="text-[#E07A5F] mb-3 group-hover:scale-110 transition-transform" size={24} />
                  <div className="font-bold text-white text-sm mb-1">Download JSON File</div>
                  <div className="text-xs text-stone-400">Saves a timestamped backup to your machine.</div>
                </button>

                <button
                  type="button"
                  onClick={handleCopyJSON}
                  className="p-5 bg-stone-900/80 hover:bg-[#8C2D40]/30 border border-stone-800 hover:border-[#8C2D40] rounded-2xl text-left transition-all cursor-pointer group"
                >
                  <Copy className="text-[#E07A5F] mb-3 group-hover:scale-110 transition-transform" size={24} />
                  <div className="font-bold text-white text-sm mb-1">Copy to Clipboard</div>
                  <div className="text-xs text-stone-400">Instantly copies entire raw JSON configuration.</div>
                </button>

                <button
                  type="button"
                  onClick={() => setShowImportModal(true)}
                  className="p-5 bg-stone-900/80 hover:bg-[#8C2D40]/30 border border-stone-800 hover:border-[#8C2D40] rounded-2xl text-left transition-all cursor-pointer group"
                >
                  <Upload className="text-[#E07A5F] mb-3 group-hover:scale-110 transition-transform" size={24} />
                  <div className="font-bold text-white text-sm mb-1">Import Configuration</div>
                  <div className="text-xs text-stone-400">Paste or upload a saved configuration JSON.</div>
                </button>
              </div>

              {/* JSON Code Viewer */}
              <div className="space-y-2 pt-4 border-t border-stone-800">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Current Configuration Snapshot
                </span>
                <pre className="bg-black/80 border border-stone-800 rounded-2xl p-4 text-xs font-mono text-stone-300 max-h-96 overflow-y-auto scrollbar-thin">
                  {JSON.stringify(config, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#171214] border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Import Configuration JSON</h3>
            <p className="text-xs text-stone-400">
              Upload a previously exported .json file or paste raw JSON text below.
            </p>

            <div className="flex items-center gap-3">
              <input 
                ref={importFileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImportFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => importFileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold cursor-pointer"
              >
                <Upload size={14} />
                <span>Upload .JSON File</span>
              </button>
            </div>

            <textarea 
              rows={8}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste JSON text here..."
              className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-xs font-mono text-stone-200 focus:outline-none focus:border-[#8C2D40]"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportSubmit}
                disabled={!importJsonText.trim()}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#8C2D40] hover:bg-[#6B1D2F] text-white disabled:opacity-50 cursor-pointer"
              >
                Apply Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
