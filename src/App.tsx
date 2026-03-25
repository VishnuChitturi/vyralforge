/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { 
  Sparkles, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Youtube, 
  Copy, 
  Check, 
  Zap, 
  Type as TypeIcon,
  Maximize2,
  ChevronRight,
  Loader2,
  Send,
  Terminal,
  Cpu,
  Music,
  Eye,
  Hash,
  ArrowLeft
} from 'lucide-react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { generateRepurposedContent, RepurposedContent, ShortFormScript } from './services/gemini';

// --- Components ---

const Particle = ({ index }: { index: number, key?: number }) => {
  const x = useMemo(() => Math.random() * 100, []);
  const y = useMemo(() => Math.random() * 100, []);
  const size = useMemo(() => Math.random() * 2 + 1, []);
  const duration = useMemo(() => Math.random() * 20 + 10, []);

  return (
    <motion.div
      className="absolute bg-cyan/20 rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
      }}
      animate={{
        y: [0, -100, 0],
        opacity: [0, 0.5, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
        delay: index * 0.1,
      }}
    />
  );
};

const Background = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 100 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Parallax effects
  const bgX = useTransform(springX, [0, 1920], [20, -20]);
  const bgY = useTransform(springY, [0, 1080], [20, -20]);
  
  const midX = useTransform(springX, [0, 1920], [40, -40]);
  const midY = useTransform(springY, [0, 1080], [40, -40]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-dark">
      {/* Deep Background Layer */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        style={{ x: bgX, y: bgY }}
      >
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_50%,#0f172a_0%,transparent_70%)]" />
      </motion.div>

      {/* Floating Blobs (Mid Layer) */}
      <motion.div style={{ x: midX, y: midY }} className="absolute inset-0">
        <motion.div
          animate={{
            x: [0, 150, 0],
            y: [0, -100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -120, 0],
            y: [0, 180, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-neon/10 rounded-full blur-[100px]"
        />
      </motion.div>

      {/* Cursor Follow Glow */}
      <motion.div 
        className="absolute w-[600px] h-[600px] pointer-events-none opacity-40 mix-blend-screen"
        style={{
          left: springX,
          top: springY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(0, 245, 255, 0.15) 0%, transparent 70%)'
        }}
      />

      {/* Particle System */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <Particle key={i} index={i} />
        ))}
      </div>

      {/* Subtle Grid with Parallax */}
      <motion.div 
        style={{ x: bgX, y: bgY }}
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:60px_60px]" 
      />
    </div>
  );
};

const TypewriterText = ({ text, speed = 10 }: { text: string, speed?: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return <span className="whitespace-pre-wrap">{displayedText}</span>;
};

const TabButton = ({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 group outline-none focus:ring-0 ${
      active 
        ? 'bg-cyan/10 text-cyan border border-cyan/30 shadow-[0_0_15px_rgba(0,245,255,0.2)]' 
        : 'text-white/40 hover:text-cyan/70 hover:bg-cyan/5'
    }`}
  >
    <Icon size={16} className={active ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
    <span className="text-sm font-mono font-medium tracking-tight">{label}</span>
  </button>
);

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 rounded-md bg-white/5 hover:bg-cyan/10 text-white/40 hover:text-cyan transition-all border border-transparent hover:border-cyan/20 outline-none focus:ring-0"
      title="Copy to clipboard"
    >
      {copied ? <Check size={16} className="text-neon" /> : <Copy size={16} />}
    </button>
  );
};

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 h-[70px] bg-dark border-b border-white/5 z-50 flex items-center justify-center">
      <div className="w-full max-w-[1200px] px-6 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="p-1.5 bg-cyan/10 rounded-lg border border-cyan/20 group-hover:border-cyan/40 transition-colors">
            <Cpu className="text-cyan" size={18} />
          </div>
          <span className="text-lg font-black tracking-tighter text-white font-mono">
            VYRAL<span className="text-cyan neon-text">FORGE</span>
          </span>
        </div>
      </div>
    </header>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="relative min-h-screen bg-dark selection:bg-cyan/30 selection:text-cyan overflow-x-hidden">
    <Background />
    <Header />
    <main className="w-full max-w-[1200px] mx-auto px-6 pt-[100px] pb-20">
      {children}
    </main>
    {/* Footer / Branding */}
    <div className="w-full max-w-[1200px] mx-auto px-6 py-12 border-t border-white/5 flex items-center justify-between">
      <div className="text-cyan/30 text-[10px] font-mono tracking-[0.2em] uppercase">
        <span>created by vishnu</span>
      </div>
      <div className="flex items-center gap-6">
        <Twitter size={14} className="text-white/20 hover:text-cyan transition-colors cursor-pointer" />
        <Linkedin size={14} className="text-white/20 hover:text-cyan transition-colors cursor-pointer" />
        <Instagram size={14} className="text-white/20 hover:text-cyan transition-colors cursor-pointer" />
      </div>
    </div>
  </div>
);

// --- Pages ---

const LivePreview = ({ input }: { input: string }) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const placeholders = [
    "Generating viral hooks...",
    "Crafting engaging posts...",
    "Optimizing content...",
    "Forging digital impact...",
    "Analyzing neural patterns..."
  ];

  useEffect(() => {
    if (!input) {
      const interval = setInterval(() => {
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [input]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div className="lg:col-span-5 space-y-8">
      <motion.div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        whileHover={{ y: -5 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 backdrop-blur-xl relative overflow-hidden group min-h-[400px] flex flex-col"
      >
        {/* Cursor Glow */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute w-32 h-32 bg-cyan/20 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 left-[var(--mouse-x)] top-[var(--mouse-y)]" />
        </div>

        <div className="flex items-center justify-between relative z-10">
          <h3 className="text-sm font-mono font-black tracking-[0.3em] text-cyan uppercase">
            Live_Preview
          </h3>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500/50" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
            <div className="w-2 h-2 rounded-full bg-green-500/50" />
          </div>
        </div>

        <div className="flex-1 relative z-10">
          <AnimatePresence mode="wait">
            {!input ? (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden relative">
                    <motion.div 
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    />
                  </div>
                  <div className="h-3 w-4/5 bg-white/5 rounded-full overflow-hidden relative">
                    <motion.div 
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.2 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    />
                  </div>
                  <div className="h-3 w-2/3 bg-white/5 rounded-full overflow-hidden relative">
                    <motion.div 
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.4 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    />
                  </div>
                </div>
                
                <div className="text-cyan/40 font-mono text-xs italic animate-pulse">
                  <TypewriterText text={placeholders[placeholderIndex]} speed={50} />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 font-mono"
              >
                <div className="space-y-2">
                  <div className="text-[10px] text-white/20 uppercase tracking-widest">Sample_Hook</div>
                  <p className="text-white/90 text-sm leading-relaxed bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    {input.length > 20 ? `${input.substring(0, 60)}...` : "Forging a viral hook from your thoughts..."}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] text-white/20 uppercase tracking-widest">LinkedIn_Snippet</div>
                  <p className="text-cyan/80 text-sm leading-relaxed border-l-2 border-cyan/30 pl-4 py-1">
                    {input.length > 10 ? `I just discovered how ${input.substring(0, 30)} changes everything.` : "Crafting a professional perspective..."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-4">
                  <span className="text-[10px] px-2 py-1 rounded bg-cyan/10 text-cyan border border-cyan/20">#VyralForge</span>
                  <span className="text-[10px] px-2 py-1 rounded bg-white/5 text-white/40 border border-white/10">#AIContent</span>
                  <span className="text-[10px] px-2 py-1 rounded bg-white/5 text-white/40 border border-white/10">#Viral</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="pt-6 border-t border-white/5 space-y-4 relative z-10">
          <div className="flex items-center gap-3 text-white/40 text-[10px] font-mono uppercase tracking-widest">
            <Check size={12} className="text-cyan" />
            <span>Neural_Analysis_Active</span>
          </div>
        </div>
      </motion.div>

      <div className="p-8 bg-cyan/5 border border-cyan/10 rounded-3xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <p className="text-sm font-mono text-cyan/60 leading-relaxed relative z-10">
          "VyralForge analyzes your input using advanced neural patterns to forge content that resonates across the digital landscape."
        </p>
      </div>
    </div>
  );
};

const InputPage = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [tone, setTone] = useState('Viral');
  const [length, setLength] = useState('Medium');
  const [isViral, setIsViral] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const data = await generateRepurposedContent(input, tone, length, isViral);
      navigate('/output', { state: { results: data } });
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const tones = ['Professional', 'Casual', 'Viral', 'Storytelling'];
  const lengths = ['Short', 'Medium', 'Long'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-12"
    >
      {/* Main Content Section - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Input Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7"
        >
          <div 
            className={`flex flex-col gap-6 bg-indigo/40 rounded-3xl p-6 lg:p-8 backdrop-blur-xl shadow-2xl relative group transition-all duration-500 border ${
              isFocused 
                ? 'border-cyan shadow-[0_0_40px_rgba(0,245,255,0.2)]' 
                : 'border-white/10 hover:border-cyan/30'
            }`}
          >
            <div className="relative z-10 min-h-[300px]">
              <textarea
                value={input}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setInput(e.target.value)}
                placeholder="INPUT_SOURCE: Paste blog, idea, or notes..."
                className="w-full h-full min-h-[300px] bg-transparent border-none outline-none focus:ring-0 text-cyan/90 placeholder:text-white/10 resize-none text-lg lg:text-xl leading-relaxed font-mono"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 pt-6 border-t border-white/5">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] text-cyan/60 font-black flex items-center gap-2">
                  <TypeIcon size={14} /> TONE_PROFILE
                </label>
                <div className="flex flex-wrap gap-2">
                  {tones.map(t => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono transition-all border outline-none focus:ring-0 ${
                        tone === t 
                          ? 'bg-cyan text-dark border-cyan shadow-[0_0_15px_rgba(0,245,255,0.4)]' 
                          : 'bg-white/5 text-white/40 border-white/10 hover:border-cyan/30 hover:text-cyan'
                      }`}
                    >
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] text-cyan/60 font-black flex items-center gap-2">
                  <Maximize2 size={14} /> LENGTH_VAL
                </label>
                <div className="flex gap-2">
                  {lengths.map(l => (
                    <button
                      key={l}
                      onClick={() => setLength(l)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono transition-all border outline-none focus:ring-0 ${
                        length === l 
                          ? 'bg-neon text-dark border-neon shadow-[0_0_15px_rgba(0,255,136,0.4)]' 
                          : 'bg-white/5 text-white/40 border-white/10 hover:border-neon/30 hover:text-neon'
                      }`}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-6 relative z-10">
              <button
                onClick={() => setIsViral(!isViral)}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all border font-mono text-[10px] font-bold outline-none focus:ring-0 ${
                  isViral 
                    ? 'bg-yellow/10 text-yellow border-yellow/30 shadow-[0_0_15px_rgba(250,204,21,0.2)]' 
                    : 'bg-white/5 text-white/40 border-white/10'
                }`}
              >
                <Zap size={18} fill={isViral ? "currentColor" : "none"} />
                <span>VIRAL_BOOST: {isViral ? 'ON' : 'OFF'}</span>
              </button>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(0, 245, 255, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                disabled={loading || !input.trim()}
                className="w-full sm:w-auto relative group overflow-hidden px-10 py-4 rounded-2xl bg-cyan text-dark font-black font-mono tracking-tighter flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all outline-none focus:ring-0"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="animate-spin" size={24} />
                    <span className="text-xs">GENERATING...</span>
                  </div>
                ) : (
                  <>
                    <span>EXECUTE_GENERATE</span>
                    <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Live Preview */}
        <LivePreview input={input} />
      </div>
    </motion.div>
  );
};

const OutputPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const results = location.state?.results as RepurposedContent | null;
  const [activeTab, setActiveTab] = useState<'linkedin' | 'twitter' | 'instagram' | 'youtube' | 'hooks' | 'shortForm'>('linkedin');

  useEffect(() => {
    if (!results) {
      navigate('/');
    }
  }, [results, navigate]);

  if (!results) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex flex-col gap-8"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 rounded-xl bg-white/5 hover:bg-cyan/10 text-white/40 hover:text-cyan transition-all border border-white/10 hover:border-cyan/30"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-black tracking-tighter text-white font-mono">
            GENERATED<span className="text-cyan neon-text">_CONTENT</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar max-w-full">
          <TabButton active={activeTab === 'linkedin'} onClick={() => setActiveTab('linkedin')} icon={Linkedin} label="LINKEDIN" />
          <TabButton active={activeTab === 'twitter'} onClick={() => setActiveTab('twitter')} icon={Twitter} label="TWITTER" />
          <TabButton active={activeTab === 'instagram'} onClick={() => setActiveTab('instagram')} icon={Instagram} label="INSTAGRAM" />
          <TabButton active={activeTab === 'youtube'} onClick={() => setActiveTab('youtube')} icon={Youtube} label="YOUTUBE" />
          <TabButton active={activeTab === 'hooks'} onClick={() => setActiveTab('hooks')} icon={Sparkles} label="HOOKS" />
          <TabButton active={activeTab === 'shortForm'} onClick={() => setActiveTab('shortForm')} icon={Zap} label="SHORTS" />
        </div>
      </div>

      <div className="bg-indigo/20 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl flex flex-col min-h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col p-6 lg:p-10"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-mono font-black tracking-[0.4em] text-cyan flex items-center gap-4 uppercase">
                {activeTab}_OUTPUT
              </h3>
              <CopyButton text={
                activeTab === 'twitter' ? results.twitter.join('\n\n') :
                activeTab === 'hooks' ? results.hooks.join('\n') :
                activeTab === 'shortForm' ? `[HOOK]\n${results.shortForm.hook}\n\n[SCENE 1]\n${results.shortForm.scene1}\n\n[SCENE 2]\n${results.shortForm.scene2}\n\n[SCENE 3]\n${results.shortForm.scene3}\n\n[CTA]\n${results.shortForm.ending}` :
                results[activeTab as keyof RepurposedContent] as string
              } />
            </div>

            <div className="flex-1 font-mono text-sm lg:text-lg leading-relaxed text-white/90">
              {activeTab === 'twitter' ? (
                <div className="space-y-6 lg:space-y-8">
                  {results.twitter.map((tweet, i) => (
                    <div key={i} className="p-4 lg:p-6 bg-white/5 rounded-2xl border border-white/5 relative group hover:border-cyan/20 transition-colors">
                      <span className="absolute top-4 right-6 text-[10px] lg:text-xs font-mono text-cyan/30">{i + 1}/{results.twitter.length}</span>
                      <div className="text-white/80">
                        <TypewriterText text={tweet} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : activeTab === 'hooks' ? (
                <div className="space-y-4 lg:space-y-6">
                  {results.hooks.map((hook, i) => (
                    <div key={i} className="p-4 lg:p-6 bg-indigo/20 rounded-2xl border-l-4 border-cyan group hover:bg-indigo/30 transition-all">
                      <p className="text-white/90 font-bold tracking-tight">
                        <TypewriterText text={hook} />
                      </p>
                    </div>
                  ))}
                </div>
              ) : activeTab === 'shortForm' ? (
                <div className="space-y-8 lg:space-y-10">
                  <section className="space-y-4">
                    <div className="flex items-center gap-3 text-yellow text-[10px] lg:text-xs font-black tracking-widest">
                      <Zap size={18} /> [HOOK]
                    </div>
                    <div className="p-4 lg:p-6 bg-yellow/5 border border-yellow/20 rounded-2xl text-white/90 italic text-lg lg:text-xl">
                      <TypewriterText text={results.shortForm.hook} />
                    </div>
                  </section>

                  <div className="grid gap-6 lg:gap-8">
                    {[
                      { label: 'SCENE 1 (0-5s)', content: results.shortForm.scene1 },
                      { label: 'SCENE 2 (5-10s)', content: results.shortForm.scene2 },
                      { label: 'SCENE 3 (10-20s)', content: results.shortForm.scene3 },
                    ].map((scene, i) => (
                      <section key={i} className="space-y-3">
                        <div className="text-cyan text-[10px] lg:text-xs font-black tracking-widest flex items-center gap-3">
                          <Eye size={16} /> [{scene.label}]
                        </div>
                        <div className="p-4 lg:p-6 bg-white/5 border border-white/10 rounded-2xl text-white/80">
                          <TypewriterText text={scene.content} />
                        </div>
                      </section>
                    ))}
                  </div>

                  <section className="space-y-3">
                    <div className="text-neon text-[10px] lg:text-xs font-black tracking-widest flex items-center gap-3">
                      <ChevronRight size={16} /> [CTA]
                    </div>
                    <div className="p-4 lg:p-6 bg-neon/5 border border-neon/20 rounded-2xl text-white/90 font-bold text-lg lg:text-xl">
                      <TypewriterText text={results.shortForm.ending} />
                    </div>
                  </section>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 pt-8 border-t border-white/10">
                    <div className="space-y-3">
                      <div className="text-white/30 text-[10px] lg:text-xs font-black tracking-widest flex items-center gap-3">
                        <Music size={14} /> MUSIC_VIBE
                      </div>
                      <p className="text-white/60 italic text-sm lg:text-base">{results.shortForm.musicVibe}</p>
                    </div>
                    <div className="space-y-3">
                      <div className="text-white/30 text-[10px] lg:text-xs font-black tracking-widest flex items-center gap-3">
                        <Hash size={14} /> HASHTAGS
                      </div>
                      <div className="flex flex-wrap gap-2 lg:gap-3">
                        {results.shortForm.hashtags.map(h => (
                          <span key={h} className="text-cyan/60 text-xs lg:text-sm">{h}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-white/80 whitespace-pre-wrap">
                  <TypewriterText text={results[activeTab as keyof RepurposedContent] as string} />
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<InputPage />} />
          <Route path="/output" element={<OutputPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

