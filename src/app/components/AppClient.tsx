"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Confetti from "canvas-confetti";
import QuizComponent from "./QuizComponent";
import Footer from "./Footer";
import AdminCMSModal from "./AdminCMSModal";
import { cmsStorage } from "@/app/services/cmsStorage";
import { Question as CMSQuestion, Dataset, QuizCMSConfig } from "@/app/types/cms";
import { categories, roundDescriptions } from "@/data/questions";
import { soundManager } from "@/app/utils/soundEffects";
import {
  ShieldCheck,
  Play,
  RotateCcw,
  Award,
  Sparkles,
  CheckCircle2,
  Flame,
  Timer,
  LogOut,
  Info,
  Brain,
  Zap,
  Globe,
  HelpCircle,
  Trophy,
  ArrowRight,
  Lock,
  AlertTriangle,
  Database,
  Sliders,
  FolderDown,
  Shuffle,
  Layers,
} from "lucide-react";

const CORRECT_PIN = process.env.NEXT_PUBLIC_QUIZ_PIN || "";
const LEADERBOARD_KEY = "quiz_leaderboard";

type Category = (typeof categories)[number];
type Mode = "presentation" | "quiz";

interface LobbyConfig {
  category: Category;
  mode: Mode;
  timerEnabled: boolean;
  playerName: string;
}

interface LeaderboardEntry {
  id: number;
  name: string;
  score: number;
  createdAt: string;
  category?: string;
}

const CATEGORY_BADGE_STYLE: Record<string, string> = {
  All: "badge-all",
  "General Trivia": "badge-trivia",
  "Rapid Fire": "badge-rapid",
  "Buzzer Round": "badge-buzzer",
  "Connect the Dots": "badge-connect",
  "Audience Round": "badge-audience",
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  All: <Brain className="w-5 h-5" />,
  "General Trivia": <Globe className="w-5 h-5" />,
  "Rapid Fire": <Zap className="w-5 h-5" />,
  "Buzzer Round": <Trophy className="w-5 h-5" />,
  "Connect the Dots": <Sparkles className="w-5 h-5" />,
  "Audience Round": <HelpCircle className="w-5 h-5" />,
};

export default function AppClient() {
  const [phase, setPhase] = useState<"pin" | "lobby" | "quiz" | "results">("pin");
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  // Admin CMS Modal
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // CMS State
  const [activeDataset, setActiveDataset] = useState<Dataset | null>(null);
  const [cmsConfig, setCmsConfig] = useState<QuizCMSConfig | null>(null);
  const [preparedQuizQuestions, setPreparedQuizQuestions] = useState<CMSQuestion[]>([]);
  const [totalDatasetQuestions, setTotalDatasetQuestions] = useState(0);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [lobbyConfig, setLobbyConfig] = useState<LobbyConfig>({
    category: "All",
    mode: "presentation",
    timerEnabled: false,
    playerName: "",
  });

  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizResults, setQuizResults] = useState<{
    score: number;
    correctCount: number;
    maxStreak: number;
    avgTime: number;
    category: string;
  } | null>(null);

  // Load CMS Data
  const reloadCMSData = useCallback(async () => {
    try {
      await cmsStorage.initDB();
      const active = await cmsStorage.getActiveDataset();
      setActiveDataset(active);

      const cfg = await cmsStorage.getQuizConfig();
      setCmsConfig(cfg);

      const prepared = await cmsStorage.getPreparedQuizQuestions();
      setPreparedQuizQuestions(prepared.questions);
      setTotalDatasetQuestions(prepared.totalDatasetQuestions);
    } catch (err) {
      console.error("Error loading CMS data into AppClient:", err);
    }
  }, []);

  useEffect(() => {
    reloadCMSData();

    try {
      const stored = localStorage.getItem(LEADERBOARD_KEY);
      if (stored) setLeaderboard(JSON.parse(stored));
    } catch {
      setLeaderboard([]);
    }
  }, [reloadCMSData]);

  const saveLeaderboard = useCallback((entries: LeaderboardEntry[]) => {
    try {
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
      setLeaderboard(entries);
    } catch (e) {
      console.error("Failed to save leaderboard:", e);
    }
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === CORRECT_PIN) {
      soundManager.playClick();
      setPhase("lobby");
      setPinError(false);
    } else {
      soundManager.playWrong();
      setPinError(true);
      setTimeout(() => setPinError(false), 600);
    }
  };

  const handleQuickDemoPin = () => {
    setPinInput(CORRECT_PIN);
    soundManager.playClick();
    setPhase("lobby");
    setPinError(false);
  };

  const handleLogout = () => {
    soundManager.playClick();
    setPhase("pin");
    setPinInput("");
    setQuizResults(null);
    setQuizQuestions([]);
  };

  const handleStartQuiz = async () => {
    soundManager.playClick();
    // Load dynamically prepared questions from CMS Local DB
    const prepared = await cmsStorage.getPreparedQuizQuestions();
    
    // Filter by lobby selected category if specific category chosen in lobby
    let finalQuestions = prepared.questions;
    if (lobbyConfig.category !== "All") {
      finalQuestions = finalQuestions.filter(
        (q) => q.category === lobbyConfig.category || q.level === lobbyConfig.category
      );
    }

    setQuizQuestions(finalQuestions);
    setPhase("quiz");
  };

  const handleQuizComplete = useCallback(
    (results: { score: number; correctCount: number; maxStreak: number; avgTime: number }) => {
      setQuizResults({ ...results, category: lobbyConfig.category });
      setPhase("results");
      soundManager.playVictory();
      Confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#d4b23c", "#10b981", "#3b82f6", "#f59e0b"],
      });
    },
    [lobbyConfig.category]
  );

  const handlePlayAgain = () => {
    soundManager.playClick();
    setPhase("lobby");
    setQuizResults(null);
    setQuizQuestions([]);
    reloadCMSData();
  };

  /* ───────────── LANDING / PIN SCREEN ───────────── */
  if (phase === "pin") {
    return (
      <div className="min-h-screen w-full flex flex-col justify-between relative">
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 py-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="landing-split"
          >
            {/* Left Column — Atmospheric Hero Banner Card */}
            <div className="landing-hero-box">
              <div className="space-y-4">
                <div className="flex items-center">
                  <Image
                    src="/eozka-full-logo.svg"
                    alt="eOzka Logo"
                    width={280}
                    height={80}
                    className="h-16 sm:h-20 w-auto object-contain"
                    priority
                  />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Deeksharambh Orientation & CMS
                </div>
              </div>

              <div className="my-10 space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                  Elevate Your Quiz Experience
                </h1>
                <p className="text-white/80 text-sm sm:text-base font-medium max-w-md leading-relaxed">
                  Presenter control, high-performance CMS dataset management, local DB persistence, and audience engagement.
                </p>
              </div>

              {/* Admin CMS Launcher Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setIsAdminOpen(true);
                  }}
                  className="px-5 py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-2 transition-all shadow-lg backdrop-blur-md cursor-pointer"
                >
                  <Database className="w-4 h-4 text-amber-400" />
                  Launch Admin CMS Panel & Datasets
                </button>
              </div>
            </div>

            {/* Right Column — Presenter Sign In Form */}
            <div className="p-8 sm:p-12 flex flex-col justify-center space-y-8 bg-[#121120]">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight">Welcome Back</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1 font-semibold">
                  Enter your Presenter PIN to access the orientation dashboard
                </p>
              </div>

              <form onSubmit={handlePinSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" /> Security PIN
                  </label>
                  <div className={`${pinError ? "animate-shake" : ""}`}>
                    <input
                      type="password"
                      value={pinInput}
                      onChange={(e) => {
                        setPinInput(e.target.value);
                        if (pinError) setPinError(false);
                      }}
                      placeholder="••••"
                      className="input text-center text-3xl tracking-[0.4em] font-black py-4"
                      maxLength={6}
                      autoFocus
                      autoComplete="off"
                    />
                    {pinError && (
                      <p className="mt-2 text-[#ff4d4d] text-xs font-extrabold text-center flex items-center justify-center gap-1.5 bg-red-500/10 border border-red-500/20 py-2 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-rose-400" /> Incorrect PIN. Please try again.
                      </p>
                    )}
                  </div>
                </div>

                <button type="submit" className="btn btn-gold btn-lg w-full flex items-center justify-center gap-2">
                  <span>Sign In as Presenter</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={handleQuickDemoPin}
                  className="text-xs font-bold text-[var(--text-secondary)] hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Quick Sign-In
                </button>

                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5" /> CMS Admin
                </button>
              </div>
            </div>
          </motion.div>
        </div>
        <Footer />

        <AdminCMSModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          onConfigChange={reloadCMSData}
        />
      </div>
    );
  }

  /* ───────────── LOBBY SCREEN ───────────── */
  if (phase === "lobby") {
    const selectedRoundInfo = roundDescriptions[lobbyConfig.category];

    return (
      <div className="min-h-screen w-full flex flex-col justify-between relative">
        <div className="flex-1 flex flex-col">
          <header className="w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/eozka-full-logo.svg"
                alt="eOzka Logo"
                width={200}
                height={60}
                className="h-10 sm:h-12 w-auto object-contain"
                priority
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsAdminOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Database className="w-4 h-4 text-amber-400" />
                CMS Admin Panel
              </button>

              <button onClick={handleLogout} className="btn btn-ghost btn-sm flex items-center gap-1.5">
                <LogOut className="w-4 h-4" /> Exit
              </button>
            </div>
          </header>

          <div className="flex-1 flex items-start justify-center px-4 pb-16 pt-2">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-5xl space-y-6"
            >
              {/* CMS Active Banner */}
              <div className="surface p-8 sm:p-10 bg-gradient-to-r from-[#17152e] via-[#1a1836] to-[#25224e] text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden border border-amber-500/20">
                <div className="space-y-2 max-w-lg z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider">
                    <Database className="w-3.5 h-3.5" /> CMS Active Dataset: {activeDataset?.name || "Default Quiz"}
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-2">
                    Ready for a Quiz? <Sparkles className="w-7 h-7 text-amber-400" />
                  </h1>
                  <p className="text-white/70 text-sm sm:text-base font-medium">
                    Dataset configured with {preparedQuizQuestions.length} questions ready out of {totalDatasetQuestions} total.
                  </p>
                </div>

                <div className="flex items-center gap-3 z-10">
                  <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center">
                    <div className="text-2xl font-black text-amber-300">{preparedQuizQuestions.length}</div>
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-white/70">Selected Qs</div>
                  </div>
                  <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center">
                    <div className="text-2xl font-black text-emerald-400">
                      {cmsConfig?.enableQuestionRandomizer ? "ON" : "OFF"}
                    </div>
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-white/70">Randomizer</div>
                  </div>
                </div>
              </div>

              {/* Categories & Rounds Grid */}
              <section className="surface p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-white">Categories & Divisions</h2>
                    <p className="text-xs text-[var(--text-secondary)] font-bold">Select a round or play all CMS selected questions</p>
                  </div>
                  <span className="badge badge-all">{preparedQuizQuestions.length} Questions Ready</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        soundManager.playClick();
                        setLobbyConfig((p) => ({ ...p, category: cat }));
                      }}
                      className={`
                      flex flex-col items-center justify-center p-4 rounded-2xl font-black text-xs
                      border-2 transition-all duration-200 cursor-pointer text-center gap-2
                      ${
                        lobbyConfig.category === cat
                          ? "border-[var(--eozka-gold)] bg-amber-500/10 text-white shadow-md scale-[1.03]"
                          : "border-white/10 bg-white/2 text-[var(--text-secondary)] hover:border-white/20 hover:text-white"
                      }
                    `}
                    >
                      <div className={`p-2.5 rounded-xl ${lobbyConfig.category === cat ? "bg-amber-400 text-slate-950" : "bg-white/10 text-white"}`}>
                        {CATEGORY_ICONS[cat]}
                      </div>
                      <span className="truncate w-full">{cat}</span>
                    </button>
                  ))}
                </div>

                {selectedRoundInfo && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1 text-white">
                    <div className="font-black text-sm text-amber-300">{selectedRoundInfo.title}</div>
                    <div className="text-[var(--text-secondary)] font-bold">{selectedRoundInfo.subtitle}</div>
                    <div className="text-amber-400 font-extrabold">Scoring: {selectedRoundInfo.scoreRule}</div>
                  </div>
                )}
              </section>

              {/* Launch Bar */}
              <div className="surface p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Play className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <div className="text-white font-black text-lg">Launch CMS Session</div>
                    <div className="text-xs text-[var(--text-secondary)] font-bold flex items-center gap-2">
                      <span>{preparedQuizQuestions.length} Active Questions</span>
                      <span>•</span>
                      <span className={`badge ${CATEGORY_BADGE_STYLE[lobbyConfig.category] || "badge-all"}`}>
                        {lobbyConfig.category}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleStartQuiz}
                  disabled={preparedQuizQuestions.length === 0}
                  className="btn btn-gold btn-lg w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Launch Quiz</span>
                  <Play className="w-5 h-5 fill-current" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
        <Footer />

        <AdminCMSModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          onConfigChange={reloadCMSData}
        />
      </div>
    );
  }

  /* ───────────── QUIZ SCREEN ───────────── */
  if (phase === "quiz") {
    return (
      <div className="flex flex-col">
        <header className="w-full max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/eozka-full-logo.svg"
              alt="eOzka Logo"
              width={180}
              height={50}
              className="h-10 sm:h-12 w-auto object-contain"
              priority
            />
            <span className={`badge ${CATEGORY_BADGE_STYLE[lobbyConfig.category] || "badge-all"}`}>
              {lobbyConfig.category}
            </span>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost btn-sm">
            Exit
          </button>
        </header>

        <div className="flex items-start justify-center px-4 pb-16 pt-2">
          <QuizComponent
            questions={quizQuestions}
            mode={lobbyConfig.mode}
            timerEnabled={lobbyConfig.timerEnabled}
            onComplete={handleQuizComplete}
          />
        </div>
      </div>
    );
  }

  /* ───────────── RESULTS SCREEN ───────────── */
  if (phase === "results") {
    const accuracy = quizResults ? Math.round((quizResults.correctCount / quizQuestions.length) * 100) : 0;

    return (
      <div className="min-h-screen w-full flex flex-col justify-between relative">
        <div className="flex-1 flex flex-col">
          <header className="w-full max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
            <Image
              src="/eozka-full-logo.svg"
              alt="eOzka Logo"
              width={180}
              height={50}
              className="h-10 sm:h-12 w-auto object-contain"
              priority
            />
            <button onClick={handleLogout} className="btn btn-ghost btn-sm">
              Exit
            </button>
          </header>

          <div className="flex-1 flex items-start justify-center px-4 pb-16 pt-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-4xl space-y-6"
            >
              <div className="surface p-8 sm:p-12 text-center space-y-6">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
                  <Award className="w-8 h-8" />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[var(--text-secondary)] mb-1">
                    Session Complete
                  </p>
                  <h2 className="text-3xl font-black text-white flex items-center justify-center gap-2">
                    Great Job! <Sparkles className="w-7 h-7 text-amber-400 animate-pulse" />
                  </h2>
                </div>

                {lobbyConfig.mode === "quiz" && quizResults && (
                  <div className="space-y-1">
                    <div className="text-6xl sm:text-7xl font-black text-gradient-gold tracking-tight">
                      {quizResults.score.toLocaleString()}
                    </div>
                    <p className="text-xs uppercase tracking-widest font-black text-[var(--text-muted)]">Points Earned</p>
                  </div>
                )}

                {lobbyConfig.mode === "quiz" && quizResults && (
                  <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto pt-2">
                    <div className="surface p-4 text-center">
                      <div className="text-2xl font-black text-emerald-400">
                        {quizResults.correctCount} / {quizQuestions.length}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider font-black text-[var(--text-muted)] mt-1">
                        Correct Answers
                      </div>
                    </div>

                    <div className="surface p-4 text-center">
                      <div className="text-2xl font-black text-amber-400">{accuracy}%</div>
                      <div className="text-[10px] uppercase tracking-wider font-black text-[var(--text-muted)] mt-1">
                        Accuracy Score
                      </div>
                    </div>

                    <div className="surface p-4 text-center">
                      <div className="text-2xl font-black text-orange-500 flex items-center justify-center gap-1">
                        <Flame className="w-5 h-5 fill-current" /> {quizResults.maxStreak}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider font-black text-[var(--text-muted)] mt-1">
                        Best Streak
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                  <button onClick={handlePlayAgain} className="btn btn-secondary btn-lg w-full sm:w-auto flex items-center justify-center gap-2">
                    <RotateCcw className="w-5 h-5" /> Start New Session
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <Footer />

        <AdminCMSModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          onConfigChange={reloadCMSData}
        />
      </div>
    );
  }

  return null;
}