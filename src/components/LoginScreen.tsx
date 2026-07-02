import React, { useState } from "react";
import { motion } from "motion/react";
import { User, Sparkles, ArrowRight, Brain, Shield, Layers, Award, Trees, Zap } from "lucide-react";

interface LoginScreenProps {
  onLogin: (name: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [identifier, setInputIdentifier] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick Login Presets to ensure instant access with a single click
  const presets = [
    { name: "Anurag Das", label: "Creator Profile", icon: Award, color: "from-[#3ab54a] to-emerald-500" },
    { name: "SHL Specialist", label: "Recruiter Mode", icon: Brain, color: "from-sky-500 to-indigo-500" },
    { name: "Hiring Manager", label: "Standard Session", icon: User, color: "from-amber-500 to-orange-500" }
  ];

  const executeLoginSequence = (name: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      onLogin(name);
    }, 400); // Super clean fast-transition
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    executeLoginSequence(identifier.trim());
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#070b0e] font-sans text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Scenic/Landscape Aesthetic Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1920&auto=format&fit=crop')",
        }}
      />

      {/* Elegant Dark Vignette and Color Grading Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/70 to-slate-950/90 z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-[#060a0d]/40 to-[#060a0d]/90 z-0" />

      {/* Landscape Fog / Light Atmosphere Effect */}
      <div className="absolute top-1/4 left-0 right-0 h-96 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 blur-[120px] pointer-events-none z-0" />

      {/* Glassmorphic Container Grid */}
      <div className="relative z-10 w-full max-w-5xl px-6 py-12 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        
        {/* ==================== LEFT: THE CREATOR BADGE CARD ==================== */}
        <div className="w-full max-w-[340px] shrink-0">
          <div className="relative p-6 rounded-2xl bg-slate-950/75 border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl overflow-hidden group">
            {/* Shifting warm highlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-transparent opacity-60 pointer-events-none" />

            {/* Corner Indicators */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#3ab54a]/40" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#3ab54a]/40" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#3ab54a]/40" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#3ab54a]/40" />

            {/* Creator Badge Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[#3ab54a]/10 border border-[#3ab54a]/20 text-[#3ab54a]">
                <Award className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-[0.25em] text-[#3ab54a] uppercase font-bold block">Developer</span>
                <span className="text-xs text-slate-400 font-medium">Platform Architect</span>
              </div>
            </div>

            {/* Main Creator Details */}
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-2xl font-bold tracking-tight text-white font-mono">
                    Anurag Das
                  </h3>
                  <Zap className="w-4 h-4 text-[#3ab54a] fill-[#3ab54a]/20" />
                </div>
                <p className="text-xs text-slate-400">
                  Full Stack Engineer &amp; Designer
                </p>
              </div>

              {/* Advanced Technical Specs (Tech Dash Decor) */}
              <div className="pt-4 border-t border-white/[0.08] space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-500">SYSTEM REVISION</span>
                  <span className="text-slate-300 font-semibold">SHL-RECOM v2.4.0</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-500">INTELLIGENCE AGENT</span>
                  <span className="text-[#3ab54a] font-semibold">Gemini 3.5 Flash</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-500">AUTHENTICATOR</span>
                  <span className="text-slate-300 font-semibold">Instant Access Grid</span>
                </div>
              </div>
            </div>

            {/* Floating verification badge */}
            <div className="mt-6 flex justify-end">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-mono font-bold bg-[#3ab54a]/10 text-[#3ab54a] border border-[#3ab54a]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3ab54a] animate-ping" />
                CREATOR AUTHENTICATED
              </span>
            </div>
          </div>
        </div>

        {/* ==================== RIGHT: PORTAL LOGIN CARD ==================== */}
        <div className="w-full max-w-[480px]">
          {/* Frosted Glass Login Panel */}
          <div className="relative p-8 md:p-10 rounded-3xl bg-slate-900/60 border border-white/[0.06] shadow-[0_30px_70px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden group">
            
            {/* Top Glow bar */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#3ab54a] to-transparent shadow-[0_0_12px_rgba(58,181,74,0.6)]" />

            <div className="space-y-6">
              {/* Header Title & Concept */}
              <div className="text-center space-y-2.5">
                <div className="inline-flex p-3 rounded-2xl bg-[#3ab54a]/10 border border-[#3ab54a]/20 text-[#3ab54a] mb-1">
                  <Brain className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                    SHL Recommender Portal
                  </h2>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Identify your role to load the automated catalog advisor &amp; shortlist constructor framework.
                  </p>
                </div>
              </div>

              {/* Form Input Action */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono tracking-widest text-[#3ab54a] uppercase font-bold">
                      Hiring Manager Name / Email
                    </label>
                    <span className="text-[9px] font-mono text-slate-500">NO PASSWORD REQUIRED</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setInputIdentifier(e.target.value)}
                      placeholder="e.g. Anurag Das or HR Specialist"
                      className="w-full text-sm pl-10 pr-4 py-3.5 bg-slate-950/80 border border-white/[0.08] focus:border-[#3ab54a]/50 focus:ring-1 focus:ring-[#3ab54a]/20 rounded-xl outline-none text-white placeholder:text-slate-600 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Secure bypass notification */}
                <div className="flex items-start gap-2 p-3 rounded-xl bg-[#3ab54a]/5 border border-[#3ab54a]/10 text-slate-400">
                  <Shield className="w-4 h-4 text-[#3ab54a] shrink-0 mt-0.5 animate-pulse" />
                  <p className="text-[11px] leading-relaxed">
                    <strong className="text-slate-300">Fast-Path Authenticator:</strong> Click the system unlock button below or select one of our premium preset profiles below to log in instantly.
                  </p>
                </div>

                {/* Submit Launch button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !identifier.trim()}
                  className="relative w-full py-4 px-4 rounded-xl bg-gradient-to-r from-[#3ab54a] to-emerald-500 hover:from-[#34a242] hover:to-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(58,181,74,0.15)] hover:shadow-[0_0_30px_rgba(58,181,74,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Synchronizing Node...</span>
                    </>
                  ) : (
                    <>
                      <span>Unlock System Access</span>
                      <ArrowRight className="w-4.5 h-4.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Presets Grid section (Guarantees instant bypass entry) */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-[1px] flex-1 bg-white/[0.05]" />
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Quick Login Presets</span>
                  <span className="h-[1px] flex-1 bg-white/[0.05]" />
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {presets.map((preset, idx) => {
                    const Icon = preset.icon;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setInputIdentifier(preset.name);
                          executeLoginSequence(preset.name);
                        }}
                        disabled={isSubmitting}
                        className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/[0.02] hover:bg-[#3ab54a]/5 border border-white/[0.04] hover:border-[#3ab54a]/25 transition-all text-center cursor-pointer group/preset disabled:opacity-50"
                      >
                        <div className={`p-1.5 rounded-lg bg-gradient-to-tr ${preset.color} text-slate-950 shadow-md transform group-hover/preset:scale-105 transition-transform duration-200`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="block text-[10px] font-bold text-slate-200 truncate max-w-[100px]">{preset.name}</span>
                          <span className="block text-[8px] text-slate-500 font-medium tracking-wide truncate max-w-[100px]">{preset.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer labels */}
              <div className="flex items-center justify-center gap-4 text-[9px] font-mono text-slate-500 pt-3 border-t border-white/[0.05]">
                <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> MULTI-RATER DECISIONS</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Trees className="w-3.5 h-3.5" /> SCENIC ENVIRONMENT</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
