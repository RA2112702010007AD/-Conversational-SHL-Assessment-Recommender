import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, MessageSquare, Search, Sparkles, RefreshCw, AlertCircle, 
  ExternalLink, Compass, Grid, Filter, CheckCircle2, HelpCircle, 
  Info, Brain, Clock, Target, ShieldAlert, ArrowRight, BookOpen,
  Check, X, Award, Eye, ThumbsUp, ThumbsDown
} from "lucide-react";
import { SHL_CATALOG, SHLAssessment } from "./catalog.js";
import { COMPETENCY_DEFINITIONS } from "./competencyDefinitions";
import LoginScreen from "./components/LoginScreen";

interface Message {
  role: "user" | "assistant";
  content: string;
  recommendations?: Array<{
    name: string;
    url: string;
    test_type: "C" | "P" | "K";
  }>;
  end_of_conversation?: boolean;
  feedback?: "up" | "down";
  latencyMs?: number;
}

interface QuickScenario {
  id: string;
  title: string;
  description: string;
  prompt: string;
  expected: string[];
}

const QUICK_SCENARIOS: QuickScenario[] = [
  {
    id: "java-dev",
    title: "Java Developer",
    description: "Mid-level Java developer with 4 years experience who works with stakeholders.",
    prompt: "I want to hire a mid-level Java developer with around 4 years of experience. They also need to work closely with various stakeholders to gather requirements.",
    expected: ["Java 8 (New)", "Occupational Personality Questionnaire OPQ32r"]
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    description: "Entry-level analyst needing strong attention to detail, spreadsheets, and SQL knowledge.",
    prompt: "I'm looking for an entry-level Data Analyst who can work with complex spreadsheets, spot errors in reporting, and has strong attention to numerical detail.",
    expected: ["SHL Verify Interactive – Numerical Reasoning", "Verify - Technical Checking - Next Generation", "SQL (New)"]
  },
  {
    id: "scrum-master",
    title: "Scrum Master",
    description: "Agile leader requiring Scrum framework skills and team leadership traits.",
    prompt: "I am hiring a Scrum Master who can lead agile squads, coach teams, and coordinate sprint ceremonies under high delivery pressure.",
    expected: ["Agile Software Development", "Occupational Personality Questionnaire OPQ32r", "Universal Competency Framework Interview Guide"]
  },
  {
    id: "vague-frontend",
    title: "Frontend Developer (Vague Intent)",
    description: "Vague initial query to trigger the assistant's Clarification behavior.",
    prompt: "I need to hire a frontend web developer.",
    expected: []
  },
  {
    id: "comparison",
    title: "OPQ32r vs GSA (Comparison)",
    description: "A grounded query comparing personality (OPQ) vs cognitive (GSA) assessments.",
    prompt: "What is the difference between the OPQ32r and the Verify GSA assessment? Which one is better for understanding work style?",
    expected: []
  }
];

function CompetencyTag({ comp, className = "bg-slate-100 text-slate-600 border border-slate-200/40" }: { comp: string; className?: string; key?: React.Key }) {
  const [isHovered, setIsHovered] = useState(false);
  const definition = COMPETENCY_DEFINITIONS[comp] || "Key competency evaluated to map fit, cognitive capability, or technical strength.";

  return (
    <div 
      className="relative inline-block cursor-help"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all duration-150 inline-block ${className} hover:brightness-95`}>
        {comp}
      </span>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 6 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white rounded-xl shadow-xl text-xs z-50 pointer-events-none border border-slate-800"
          >
            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
            
            <div className="flex flex-col gap-1">
              <div className="font-semibold text-[#3ab54a] tracking-tight">{comp}</div>
              <div className="text-slate-300 text-[11px] leading-relaxed font-normal">{definition}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FormattedMessage({ text }: { text: string }) {
  if (!text) return null;
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  return (
    <>
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          return <strong key={index} className="font-bold text-[#34a242]">{part}</strong>;
        }
        return part;
      })}
    </>
  );
}

function calculateMatchConfidence(assessment: SHLAssessment, messages: Message[]): number {
  const userMessages = messages.filter((m) => m.role === "user");
  if (userMessages.length === 0) return 85; // Fallback score
  
  const userText = userMessages.map((m) => m.content.toLowerCase()).join(" ");
  
  // Clean punctuation and tokenize
  const cleanUserText = userText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, " ").replace(/\s+/g, " ");
  const userWords = cleanUserText.split(/\s+/).filter(w => w.length > 2);
  
  if (userWords.length === 0) return 75;

  let matchedTokens = 0;

  // Assessment keywords to search for
  const searchTargets = [
    ...assessment.name.toLowerCase().split(/\s+/),
    ...assessment.competencies.map(c => c.toLowerCase()).join(" ").split(/\s+/),
    ...assessment.description.toLowerCase().split(/\s+/)
  ].filter(w => w.length > 2 && !["the", "and", "for", "with", "this", "that", "from", "you"].includes(w));

  // De-duplicate targets
  const uniqueTargets = Array.from(new Set(searchTargets));
  
  // Check how many unique targets overlap with user words
  uniqueTargets.forEach(target => {
    const isMatched = userWords.some(uWord => uWord.includes(target) || target.includes(uWord));
    if (isMatched) {
      matchedTokens++;
    }
  });

  // Also look for specific competency phrase matches
  let competencyMatches = 0;
  assessment.competencies.forEach(comp => {
    const compLower = comp.toLowerCase();
    if (cleanUserText.includes(compLower)) {
      competencyMatches++;
    }
  });

  // Base score begins at 75% for recommended items
  let score = 75;

  // Add points for token matches
  if (uniqueTargets.length > 0) {
    const overlapRatio = matchedTokens / Math.min(25, uniqueTargets.length); // capped denominator to make matching easier
    score += Math.round(overlapRatio * 15);
  }

  // Add points for direct competency phrase overlap
  score += competencyMatches * 8;

  // Boost score based on technical keyword direct match
  const nameLower = assessment.name.toLowerCase();
  if (userText.includes("java") && nameLower.includes("java")) score += 15;
  if (userText.includes("python") && nameLower.includes("python")) score += 15;
  if (userText.includes("sql") && nameLower.includes("sql")) score += 15;
  if (userText.includes("react") && nameLower.includes("react")) score += 15;
  if (userText.includes("angular") && nameLower.includes("angular")) score += 15;
  if (userText.includes("c++") && nameLower.includes("c++")) score += 15;
  if (userText.includes("c#") && nameLower.includes("c#")) score += 15;
  if ((userText.includes("agile") || userText.includes("scrum")) && nameLower.includes("agile")) score += 15;
  if (userText.includes("checking") && nameLower.includes("checking")) score += 15;
  if (userText.includes("numerical") && nameLower.includes("numerical")) score += 15;
  if ((userText.includes("personality") || userText.includes("stakeholder")) && nameLower.includes("personality")) score += 15;

  // Return capped score
  return Math.min(98, Math.max(80, score));
}

export default function App() {
  const [user, setUser] = useState<string | null>(() => {
    return localStorage.getItem("shl_user_name");
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am your SHL Labs Assessment Recommender assistant. I will guide you to find the perfect individual test solutions for your roles.\n\nDescribe the role you are hiring for, or click one of the **Quick Scenarios** on the side to test my conversational recommendations!"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentRecommendations, setCurrentRecommendations] = useState<SHLAssessment[]>([]);
  const [activeTab, setActiveTab] = useState<"shortlist" | "catalog" | "compare">("catalog");
  const [isEnd, setIsEnd] = useState(false);
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking");
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<SHLAssessment | null>(null);
  const [engineMode, setEngineMode] = useState<"hybrid" | "local">("hybrid");

  // Search & Filter state for catalog browser
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "C" | "P" | "K">("ALL");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check backend health on mount
  useEffect(() => {
    fetch("/health")
      .then((res) => {
        if (res.ok) {
          setBackendStatus("online");
        } else {
          setBackendStatus("offline");
          setEngineMode("local");
        }
      })
      .catch(() => {
        setBackendStatus("offline");
        setEngineMode("local");
      });
  }, []);

  // Scroll to bottom whenever messages list updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = { role: "user", content: textToSend };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText("");
    setLoading(true);

    try {
      // Map frontend messages format to backend expectation
      const requestPayload = {
        messages: updatedMessages.map((m) => ({
          role: m.role,
          content: m.content
        })),
        engineMode: engineMode,
        user: user || ""
      };

      const response = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload)
      });

      // Extract latency from header
      const latencyHeader = response.headers.get("X-Latency-Ms");
      const latencyMs = latencyHeader ? parseInt(latencyHeader, 10) : undefined;

      if (!response.ok) {
        if (response.status === 429) {
          try {
            const data = await response.json();
            const botMessage: Message = {
              role: "assistant",
              content: data.reply || "Too many requests. Please wait a bit before trying again.",
              recommendations: [],
              end_of_conversation: false,
              latencyMs: latencyMs
            };
            setMessages((prev) => [...prev, botMessage]);
            return;
          } catch (e) {
            // fallback
          }
        }
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      
      const botMessage: Message = {
        role: "assistant",
        content: data.reply || "I've processed your input.",
        recommendations: data.recommendations || [],
        end_of_conversation: !!data.end_of_conversation,
        latencyMs: latencyMs
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsEnd(!!data.end_of_conversation);

      if (data.recommendations && data.recommendations.length > 0) {
        // Resolve recommendations details from catalog
        const resolved = data.recommendations.map((rec: any) => {
          return SHL_CATALOG.find((item) => item.name.toLowerCase() === rec.name.toLowerCase()) || {
            name: rec.name,
            url: rec.url || "https://www.shl.com/solutions/products/product-catalog/",
            test_type: rec.test_type || "K",
            description: "No additional details available in catalog.",
            target_audience: "N/A",
            typical_duration: "N/A",
            competencies: []
          };
        }) as SHLAssessment[];

        setCurrentRecommendations(resolved);
        setActiveTab("shortlist"); // Automatically jump to see the shortlist!
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I am having trouble connecting to my recommendation engine. Please ensure your GEMINI_API_KEY is configured in the AI Studio panel."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hello! I am your SHL Labs Assessment Recommender assistant. I will guide you to find the perfect individual test solutions for your roles.\n\nDescribe the role you are hiring for, or click one of the **Quick Scenarios** on the side to test my conversational recommendations!"
      }
    ]);
    setInputText("");
    setCurrentRecommendations([]);
    setIsEnd(false);
    setActiveTab("catalog");
  };

  const handleFeedback = (index: number, type: "up" | "down") => {
    setMessages((prev) =>
      prev.map((m, idx) => (idx === index ? { ...m, feedback: type } : m))
    );
  };

  // Filter full catalog items
  const filteredCatalog = SHL_CATALOG.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.competencies.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = typeFilter === "ALL" || item.test_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTestTypeBadge = (type: "C" | "P" | "K") => {
    switch (type) {
      case "C":
        return <span className="px-2 py-1 text-xs font-semibold rounded bg-sky-50 text-sky-700 border border-sky-200">Cognitive Ability</span>;
      case "P":
        return <span className="px-2 py-1 text-xs font-semibold rounded bg-purple-50 text-purple-700 border border-purple-200">Personality & Behavior</span>;
      case "K":
        return <span className="px-2 py-1 text-xs font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Knowledge & Skills</span>;
    }
  };

  if (!user) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="login"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full min-h-screen"
        >
          <LoginScreen onLogin={(name) => {
            localStorage.setItem("shl_user_name", name);
            setUser(name);
          }} />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div id="shl-app-root" className="min-h-screen flex flex-col bg-slate-50">
      {/* Header Bar */}
      <header id="shl-header" className="bg-[#121c24] text-white py-4 px-6 shadow-md border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#3ab54a] text-white p-2 rounded-lg font-bold text-xl tracking-tight shadow-sm font-display flex items-center justify-center">
              SHL
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight font-display flex items-center gap-2">
                SHL Labs Assessment Recommender
                <span className="text-xs bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded-full uppercase font-mono font-normal">Intern Role Assignment</span>
              </h1>
              <p className="text-xs text-slate-400">Conversational search, refinement, comparison, and evaluation grounded on catalog.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Creator Badge */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800/80 px-3 py-1.5 rounded-full text-[11px] font-medium text-slate-300">
              <span className="text-[#3ab54a]">✦</span> Creator: <span className="text-white hover:text-[#3ab54a] transition-colors font-bold cursor-pointer">Anurag Das</span>
            </div>

            {/* Backend connection indicator */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-xs">
              <span className="text-slate-400">API Status:</span>
              {backendStatus === "checking" && (
                <span className="flex items-center gap-1.5 text-yellow-400 font-medium">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Checking
                </span>
              )}
              {backendStatus === "online" && (
                <span className="flex items-center gap-1.5 text-[#3ab54a] font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#3ab54a] animate-pulse"></span> Grounded Engine Live
                </span>
              )}
              {backendStatus === "offline" && (
                <span className="flex items-center gap-1.5 text-red-400 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> Offline
                </span>
              )}
            </div>

            {/* Authenticated User Badge */}
            <div className="flex items-center gap-2 bg-[#1a2d24] border border-[#2b5936]/40 px-3 py-1.5 rounded-full text-xs">
              <span className="text-slate-300">Manager:</span>
              <span className="text-[#3ab54a] font-bold">{user}</span>
              <button
                onClick={() => {
                  localStorage.removeItem("shl_user_name");
                  setUser(null);
                }}
                className="text-slate-400 hover:text-rose-400 font-semibold ml-1 cursor-pointer transition-colors"
                title="Sign Out"
              >
                (Sign Out)
              </button>
            </div>

            {/* Engine Selector Toggle */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 shadow-inner">
              <button
                onClick={() => setEngineMode("hybrid")}
                disabled={backendStatus === "offline"}
                className={`px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  engineMode === "hybrid"
                    ? "bg-[#3ab54a] text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200 disabled:opacity-40"
                }`}
                title={backendStatus === "offline" ? "Gemini API Offline" : "Use Gemini LLM for reasoning (auto fallback)"}
              >
                Gemini LLM
              </button>
              <button
                onClick={() => setEngineMode("local")}
                className={`px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  engineMode === "local"
                    ? "bg-[#3ab54a] text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Use local semantic search matching (Zero-latency & offline-capable)"
              >
                Local Engine
              </button>
            </div>
            
            <button 
              id="reset-btn"
              onClick={resetChat}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Reset Chat
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Chat and Playgrounds (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6 h-[calc(100vh-140px)] min-h-[550px]">
          
          {/* Chat Window Box */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            {/* Chat header */}
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <span className="font-semibold text-sm text-slate-700">Conversational dialogue</span>
              </div>
              <div className="text-xs text-slate-500">
                Turn Count: <span className="font-mono bg-slate-200 px-1.5 py-0.5 rounded font-bold text-slate-700">{messages.length}</span> / 8 limit
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm font-semibold text-xs text-white ${
                    msg.role === "user" ? "bg-slate-800" : "bg-[#121c24]"
                  }`}>
                    {msg.role === "user" ? "U" : "AI"}
                  </div>

                  {/* Message Bubble */}
                  <div className={`flex flex-col gap-1.5`}>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.role === "user" 
                        ? "bg-slate-800 text-white rounded-tr-none" 
                        : "bg-white text-slate-800 rounded-tl-none border border-slate-200"
                    }`}>
                      <p className="whitespace-pre-line"><FormattedMessage text={msg.content} /></p>
                      
                      {/* Recommendations inline display if returned */}
                      {msg.recommendations && msg.recommendations.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                          <p className="text-xs font-semibold text-[#3ab54a] flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" /> Grounded Assessment Shortlist ({msg.recommendations.length} Items):
                          </p>
                          <div className="grid grid-cols-1 gap-1.5">
                            {msg.recommendations.map((rec, rIdx) => {
                              const matchingItem = SHL_CATALOG.find((item) => item.name.toLowerCase() === rec.name.toLowerCase());
                              const confidence = matchingItem ? calculateMatchConfidence(matchingItem, messages) : null;
                              return (
                                <motion.div 
                                  key={rIdx} 
                                  initial={{ opacity: 0, y: 12 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: rIdx * 0.08, ease: "easeOut" }}
                                  className="bg-slate-50 border border-slate-200/60 p-2.5 rounded-lg flex justify-between items-center text-xs"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${
                                      rec.test_type === "C" ? "bg-sky-400" : rec.test_type === "P" ? "bg-purple-400" : "bg-emerald-400"
                                    }`}></span>
                                    <span className="font-semibold text-slate-700">{rec.name}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-slate-500">
                                    {confidence !== null && (
                                      <span className="font-mono text-[10px] bg-[#eef9ef] text-[#34a242] border border-[#3ab54a]/30 px-1.5 py-0.5 rounded font-bold">
                                        {confidence}% Match
                                      </span>
                                    )}
                                    <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded font-bold uppercase">{rec.test_type}</span>
                                    <a href={rec.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#3ab54a] transition-colors">
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Message metadata */}
                    <div className={`text-[10px] text-slate-400 ${msg.role === "user" ? "text-right" : "text-left"} flex items-center justify-between gap-4 w-full min-w-[220px]`}>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-medium text-slate-500">
                          {msg.role === "user" ? "Hiring Manager" : "SHL Specialist"}
                        </span>
                        {msg.role === "assistant" && msg.latencyMs !== undefined && (
                          <span className="ml-1 text-slate-400 font-mono text-[9px] bg-slate-100 px-1 py-0.5 rounded border border-slate-200/50">
                            ⚡ {msg.latencyMs}ms
                          </span>
                        )}
                        {msg.end_of_conversation && (
                          <span className="ml-1 font-semibold text-[#3ab54a]">● Shortlist Committed (Task Done)</span>
                        )}
                      </div>

                      {/* Feedback buttons only for assistant messages */}
                      {msg.role === "assistant" && (
                        <div className="flex items-center gap-1 ml-auto shrink-0 bg-slate-100/60 hover:bg-slate-100 p-0.5 rounded-md border border-slate-200/40 transition-colors">
                          <span className="text-[9px] text-slate-400 font-medium px-1">Was this helpful?</span>
                          <button
                            onClick={() => handleFeedback(idx, "up")}
                            className={`p-0.5 rounded transition-all cursor-pointer ${
                              msg.feedback === "up" ? "text-emerald-600 bg-emerald-50 scale-110" : "text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
                            }`}
                            title="Thumbs up - useful recommendation"
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleFeedback(idx, "down")}
                            className={`p-0.5 rounded transition-all cursor-pointer ${
                              msg.feedback === "down" ? "text-rose-600 bg-rose-50 scale-110" : "text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
                            }`}
                            title="Thumbs down - not useful"
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                          {msg.feedback && (
                            <span className="text-[9px] text-[#34a242] font-semibold px-1 animate-pulse">Thanks!</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 max-w-[80%] mr-auto">
                  <div className="w-8 h-8 rounded-full bg-[#121c24] flex items-center justify-center shrink-0 shadow-sm text-white font-semibold text-xs animate-pulse">
                    AI
                  </div>
                  <div className="bg-white text-slate-500 rounded-2xl rounded-tl-none p-4 shadow-sm border border-slate-200 text-sm flex items-center gap-2">
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </span>
                    <span>SHL Recommender is analyzing and checking catalog...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Area */}
            <div className="p-3 border-t border-slate-200 bg-white">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputText);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Describe your role, responsibilities, skills, or ask to compare tests..."
                  className="flex-1 text-sm bg-slate-100 hover:bg-slate-150/50 focus:bg-white border-none focus:ring-2 focus:ring-[#3ab54a] rounded-xl px-4 py-3 outline-none transition-all placeholder:text-slate-400"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !inputText.trim()}
                  className="p-3 rounded-xl bg-[#3ab54a] hover:bg-[#34a242] text-white font-medium transition-colors disabled:opacity-50 disabled:hover:bg-[#3ab54a] cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Quick Scenario Picker Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
            <h3 className="font-display font-semibold text-slate-700 text-sm mb-2.5 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#3ab54a]" /> Test Scenarios (Trace Personas)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {QUICK_SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    setInputText(sc.prompt);
                    handleSendMessage(sc.prompt);
                  }}
                  disabled={loading}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-[#3ab54a] hover:bg-[#eef9ef] text-left transition-all duration-200 group cursor-pointer"
                >
                  <div className="font-semibold text-xs text-slate-700 group-hover:text-[#3ab54a] truncate">
                    {sc.title}
                  </div>
                  <div className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                    {sc.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Grounded Insights and Catalog Viewer (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6 h-[calc(100vh-140px)] min-h-[550px]">
          
          {/* Main Visual Panels Box */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            {/* Viewport tabs */}
            <div className="bg-slate-50 p-1.5 border-b border-slate-200 grid grid-cols-3 gap-1">
              <button
                onClick={() => setActiveTab("catalog")}
                className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "catalog"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-700"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> Full Catalog ({SHL_CATALOG.length})
              </button>
              <button
                onClick={() => setActiveTab("shortlist")}
                className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all relative cursor-pointer ${
                  activeTab === "shortlist"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-700"
                }`}
              >
                <Award className="w-3.5 h-3.5" /> Active Shortlist
                {currentRecommendations.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#3ab54a] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {currentRecommendations.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("compare")}
                className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "compare"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-700"
                }`}
              >
                <Grid className="w-3.5 h-3.5" /> Compare Matrix
              </button>
            </div>

            {/* Dynamic Panel Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-white">
              
              {/* TAB 1: FULL CATALOG BROWSER */}
              {activeTab === "catalog" && (
                <div className="space-y-4">
                  {/* Catalog search and filters */}
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by assessment, description, or competency..."
                        className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-100 hover:bg-slate-150/40 focus:bg-white border-none rounded-lg focus:ring-1.5 focus:ring-[#3ab54a] outline-none transition-all"
                      />
                    </div>
                    {/* Filter pills */}
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => setTypeFilter("ALL")}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                          typeFilter === "ALL"
                            ? "bg-[#121c24] text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        All ({SHL_CATALOG.length})
                      </button>
                      <button
                        onClick={() => setTypeFilter("C")}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                          typeFilter === "C"
                            ? "bg-sky-600 text-white"
                            : "bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200/60"
                        }`}
                      >
                        Cognitive
                      </button>
                      <button
                        onClick={() => setTypeFilter("P")}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                          typeFilter === "P"
                            ? "bg-purple-600 text-white"
                            : "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/60"
                        }`}
                      >
                        Personality
                      </button>
                      <button
                        onClick={() => setTypeFilter("K")}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                          typeFilter === "K"
                            ? "bg-emerald-600 text-white"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60"
                        }`}
                      >
                        Skills/Knowledge
                      </button>
                    </div>
                  </div>

                  {/* List of Catalog assessments */}
                  <div className="space-y-2.5">
                    {filteredCatalog.map((item, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setSelectedCatalogItem(selectedCatalogItem?.name === item.name ? null : item)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                          selectedCatalogItem?.name === item.name
                            ? "border-[#3ab54a] bg-slate-50/50 shadow-sm"
                            : "border-slate-200 hover:border-slate-350 hover:bg-slate-50/20"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h4 className="font-semibold text-sm text-slate-800">{item.name}</h4>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {getTestTypeBadge(item.test_type)}
                              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-500 rounded border border-slate-200/60 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" /> {item.typical_duration}
                              </span>
                            </div>
                          </div>
                          <span className="text-[#3ab54a] font-semibold text-xs hover:underline flex items-center gap-1 shrink-0">
                            <Eye className="w-3.5 h-3.5" /> Details
                          </span>
                        </div>

                        {selectedCatalogItem?.name === item.name && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-3.5 pt-3 border-t border-slate-100 space-y-3 text-xs text-slate-600 leading-relaxed"
                          >
                            <p>{item.description}</p>
                            <div>
                              <strong className="text-slate-700 block">Target Audience:</strong>
                              <p className="text-slate-500">{item.target_audience}</p>
                            </div>
                            <div>
                              <strong className="text-slate-700 block mb-1">Key Competencies Measured:</strong>
                              <div className="flex flex-wrap gap-1">
                                {item.competencies.map((comp, cIdx) => (
                                  <CompetencyTag key={cIdx} comp={comp} />
                                ))}
                              </div>
                            </div>
                            <div className="pt-2">
                              <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[#3ab54a] font-semibold hover:underline"
                              >
                                View Official Catalog Page <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ))}
                    {filteredCatalog.length === 0 && (
                      <div className="text-center py-8 text-slate-400 text-xs">
                        No assessments found matching the search terms.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: ACTIVE RECOMMENDATION SHORTLIST */}
              {activeTab === "shortlist" && (
                <div className="space-y-4 text-left">
                  {currentRecommendations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-sm text-slate-700">No active recommendations</h4>
                        <p className="text-xs text-slate-400 max-w-[280px]">Begin chatting with the assistant or load a Quick Scenario to receive custom-tailored recommendations.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-xs text-slate-700 uppercase tracking-wider">Status of Recommendations</h4>
                          <p className="text-xs text-[#3ab54a] font-medium mt-0.5">● Shortlist grounded on official catalog</p>
                        </div>
                        <span className="font-mono bg-slate-200 px-2.5 py-1 rounded text-xs font-bold text-slate-700">
                          {currentRecommendations.length} Assessments
                        </span>
                      </div>

                      <div className="space-y-3">
                        {currentRecommendations.map((item, idx) => (
                          <motion.div 
                            key={`${item.name}-${idx}`}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: idx * 0.08, ease: "easeOut" }}
                            className="p-4 rounded-xl border border-[#3ab54a] bg-slate-50/30 space-y-3 text-xs relative"
                          >
                            <span className="absolute top-4 right-4 bg-emerald-100 text-[#3ab54a] p-1 rounded-full">
                              <Check className="w-3.5 h-3.5" />
                            </span>
                            
                            <div>
                              <h4 className="font-semibold text-sm text-slate-800 pr-6">{item.name}</h4>
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {getTestTypeBadge(item.test_type)}
                                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-white text-slate-500 rounded border border-slate-200 flex items-center gap-1">
                                  <Clock className="w-2.5 h-2.5" /> {item.typical_duration}
                                </span>
                              </div>
                            </div>

                            <p className="text-slate-600 leading-relaxed">{item.description}</p>

                            {/* Match Confidence progress indicator */}
                            <div className="bg-white border border-slate-200/60 rounded-xl p-3 flex flex-col gap-1.5 shadow-sm">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-[11px] text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                  <Sparkles className="w-3.5 h-3.5 text-[#3ab54a]" /> Match Confidence
                                </span>
                                <span className="font-mono font-bold text-xs text-[#3ab54a]">
                                  {calculateMatchConfidence(item, messages)}%
                                </span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${calculateMatchConfidence(item, messages)}%` }}
                                  transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
                                  className="bg-[#3ab54a] h-full rounded-full"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <strong className="text-slate-700 block">Target Audience:</strong>
                              <p className="text-slate-500">{item.target_audience}</p>
                            </div>

                            {item.competencies && item.competencies.length > 0 && (
                              <div>
                                <strong className="text-slate-700 block mb-1">Measured Competencies:</strong>
                                <div className="flex flex-wrap gap-1">
                                  {item.competencies.map((comp, cIdx) => (
                                    <CompetencyTag 
                                      key={cIdx} 
                                      comp={comp} 
                                      className="bg-white text-slate-600 border border-slate-200" 
                                    />
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="pt-1.5 border-t border-slate-200/60 flex justify-between items-center">
                              <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[#3ab54a] font-semibold hover:underline"
                              >
                                View Official Catalog <ExternalLink className="w-3 h-3" />
                              </a>
                              <span className="text-[10px] font-mono text-slate-400">Match Grounded</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: COMPARE MATRIX GRID */}
              {activeTab === "compare" && (
                <div className="space-y-4 text-left">
                  {currentRecommendations.length < 2 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <Grid className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-sm text-slate-700">Add more items to compare</h4>
                        <p className="text-xs text-slate-400 max-w-[280px]">Need at least 2 recommended items in your shortlist to visualize the side-by-side comparison matrix.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-500 leading-snug">The grid below offers a structured comparison of factors between recommended assessments in the active shortlist:</p>
                      
                      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="grid grid-cols-12 bg-slate-50 border-b border-slate-200 p-2.5 text-xs font-semibold text-slate-700">
                          <div className="col-span-3">Assessment</div>
                          <div className="col-span-2 text-center">Type</div>
                          <div className="col-span-3 text-center">Match Confidence</div>
                          <div className="col-span-2 text-center">Duration</div>
                          <div className="col-span-2 text-right">Audience</div>
                        </div>

                        {currentRecommendations.map((item, idx) => {
                          const confidence = calculateMatchConfidence(item, messages);
                          return (
                            <div key={idx} className="grid grid-cols-12 p-2.5 text-xs border-b border-slate-100/80 items-center hover:bg-slate-50/40">
                              <div className="col-span-3 font-semibold text-slate-800">{item.name}</div>
                              <div className="col-span-2 text-center">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                  item.test_type === "C" ? "bg-sky-50 text-sky-700" : item.test_type === "P" ? "bg-purple-50 text-purple-700" : "bg-emerald-50 text-emerald-700"
                                }`}>
                                  {item.test_type === "C" ? "Cognitive" : item.test_type === "P" ? "Personality" : "Knowledge"}
                                </span>
                              </div>
                              <div className="col-span-3 px-2 flex items-center gap-2">
                                <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    style={{ width: `${confidence}%` }} 
                                    className="bg-[#3ab54a] h-full rounded-full"
                                  />
                                </div>
                                <span className="font-mono font-bold text-[#34a242] text-[10px] shrink-0">{confidence}%</span>
                              </div>
                              <div className="col-span-2 text-center text-slate-500">{item.typical_duration.split(" ")[0]}</div>
                              <div className="col-span-2 text-right text-slate-500 truncate" title={item.target_audience}>
                                {item.target_audience}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Detailed comparison list */}
                      <div className="space-y-3 mt-4">
                        <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-600">Side-by-Side Competencies Mapping</h4>
                        {currentRecommendations.map((item, idx) => (
                          <div key={idx} className="bg-slate-50 border border-slate-100 p-3 rounded-lg text-xs space-y-1.5">
                            <div className="font-semibold text-slate-800 flex items-center justify-between">
                              <span>{item.name}</span>
                              <span className="text-[10px] bg-slate-200 px-1.5 py-0.2 rounded font-mono uppercase text-slate-600 font-bold">{item.test_type}</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {item.competencies.map((comp, cIdx) => (
                                <CompetencyTag 
                                  key={cIdx} 
                                  comp={comp} 
                                  className="bg-white text-slate-600 border border-slate-200" 
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* Core Evaluation Checklist Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
            <h3 className="font-display font-semibold text-slate-700 text-sm mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#3ab54a]" /> Behavioral Guard Checklist
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex gap-2.5 items-start">
                <div className="bg-emerald-100 text-[#3ab54a] rounded-full p-0.5 shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <strong className="text-slate-700 block">Clarification (Vague intents)</strong>
                  <span className="text-slate-500 leading-normal">Ask for job roles/responsibilities rather than returning early blind options.</span>
                </div>
              </div>
              
              <div className="flex gap-2.5 items-start">
                <div className="bg-emerald-100 text-[#3ab54a] rounded-full p-0.5 shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <strong className="text-slate-700 block">Shortlisting (Names & catalog URLs)</strong>
                  <span className="text-slate-500 leading-normal">Return 1 to 10 matching assessments with strict matches from our scraped database.</span>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <div className="bg-emerald-100 text-[#3ab54a] rounded-full p-0.5 shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <strong className="text-slate-700 block">Constraint Refinement</strong>
                  <span className="text-slate-500 leading-normal">Update and refine recommendations based on conversation changes without starting over.</span>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <div className="bg-emerald-100 text-[#3ab54a] rounded-full p-0.5 shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <strong className="text-slate-700 block">Grounded Comparisons</strong>
                  <span className="text-slate-500 leading-normal">Discuss and contrast parameters (OPQ vs GSA) pulling straight from the catalog content.</span>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <div className="bg-emerald-100 text-[#3ab54a] rounded-full p-0.5 shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <strong className="text-slate-700 block">Out-of-Scope Protection</strong>
                  <span className="text-slate-500 leading-normal">Politely refuse general advice, legal inquiries, or prompt injection.</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 py-4 px-6 mt-auto text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            &copy; {new Date().getFullYear()} SHL Labs. All rights reserved. Built for Conversational Assessment Recommender validation.
          </div>
          <div className="flex gap-4">
            <span className="font-semibold text-slate-600">Aistudio AI Agent integration</span>
            <span>|</span>
            <span className="text-[#3ab54a] font-semibold">Grounded in Individual Test Solutions only</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
