"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "canvas-confetti";
import { Volume2, VolumeX, Eye, ArrowRight, Zap, Trophy, Flame } from "lucide-react";

import { type Question } from "@/data/questions";
import { soundManager } from "@/app/utils/soundEffects";

const SHAPE_MAP: Record<number, string> = { 0: "▲", 1: "◆", 2: "●", 3: "■" };
const COLOR_MAP: Record<number, string> = { 0: "red", 1: "blue", 2: "yellow", 3: "green" };
const OPTION_KEYS = ["A", "B", "C", "D"];
const TIMER_SECONDS = 15;
const STREAK_BONUS = 100;

interface Props {
  questions: Question[];
  mode: "presentation" | "quiz";
  timerEnabled: boolean;
  onComplete?: (results: {
    score: number;
    correctCount: number;
    maxStreak: number;
    avgTime: number;
  }) => void;
}

export default function QuizComponent({ questions, mode, timerEnabled, onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [clueStep, setClueStep] = useState(1);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [times, setTimes] = useState<number[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  const q = questions[current];
  const isLast = current === questions.length - 1;
  const answerKey = OPTION_KEYS[q.correctAnswer] as "A" | "B" | "C" | "D";
  const hasClues = Boolean(q.clues && q.clues.length > 0);

  useEffect(() => {
    setCurrent(0);
    setSelected(null);
    setRevealed(false);
    setClueStep(1);
    setScore(0);
    setCorrectCount(0);
    setStreak(0);
    setMaxStreak(0);
    setTimer(TIMER_SECONDS);
    setTimes([]);
  }, [questions]);

  useEffect(() => {
    if (mode !== "quiz" || !timerEnabled || revealed) return;
    const id = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(id);
          soundManager.playWrong();
          setRevealed(true);
          return 0;
        }
        if (t <= 5) soundManager.playTick();
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [mode, timerEnabled, revealed, current]);

  const handleNextClue = useCallback(() => {
    if (!hasClues || !q.clues) return;
    if (clueStep < q.clues.length) {
      setClueStep((prev) => prev + 1);
      soundManager.playClueReveal();
    }
  }, [hasClues, q.clues, clueStep]);

  const handleSelect = useCallback(
    (key: string) => {
      if (selected || revealed) return;
      setSelected(key);
      setRevealed(true);

      if (mode === "quiz") {
        const timeTaken = TIMER_SECONDS - timer;
        setTimes((p) => [...p, timeTaken]);
      }

      if (key === answerKey) {
        soundManager.playCorrect();
        setCorrectCount((p) => p + 1);
        setStreak((s) => {
          const nextS = s + 1;
          setMaxStreak((m) => Math.max(m, nextS));
          return nextS;
        });

        if (mode === "quiz") {
          const timeMultiplier = timer / TIMER_SECONDS;
          const basePoints = q.points || 10;
          const earnedScore = Math.round(basePoints * 10 * timeMultiplier) + Math.min(streak + 1, 5) * STREAK_BONUS;
          setScore((p) => p + earnedScore);
        }

        Confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.65 },
          colors: ["#10b981", "#3b82f6", "#f59e0b", "#d4b23c"],
        });
      } else {
        soundManager.playWrong();
        setStreak(0);
      }
    },
    [selected, revealed, mode, timer, answerKey, streak, q.points]
  );

  const handleReveal = () => {
    soundManager.playClick();
    setRevealed(true);
  };

  const handleNext = useCallback(() => {
    soundManager.playClick();
    if (isLast) {
      const avg = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
      onComplete?.({ score, correctCount, maxStreak, avgTime: parseFloat(avg.toFixed(1)) });
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setRevealed(false);
      setClueStep(1);
      setTimer(TIMER_SECONDS);
    }
  }, [isLast, times, score, correctCount, maxStreak, onComplete]);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundManager.setMuted(nextMuted);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key.toUpperCase();
      if (!revealed && !selected) {
        if (key === "1" || key === "A") handleSelect("A");
        if (key === "2" || key === "B") handleSelect("B");
        if (key === "3" || key === "C") handleSelect("C");
        if (key === "4" || key === "D") handleSelect("D");
      }

      if (e.code === "Space") {
        e.preventDefault();
        if (revealed) handleNext();
        else if (!selected) handleReveal();
      }

      if (key === "M") toggleMute();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [revealed, selected, handleSelect, handleNext]);

  return (
    <div className="w-full max-w-5xl space-y-6">
      {/* Quiz Top Control Bar */}
      <div className="surface p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-black">Question</span>
            <span className="text-2xl font-black text-white">
              {current + 1} <span className="text-sm font-bold text-[var(--text-muted)]">/ {questions.length}</span>
            </span>
          </div>

          <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />

          <div className="hidden sm:flex items-center gap-2">
            <span className="badge badge-all">{q.level}</span>
            <span className="badge badge-quiz">+{q.points || 10} pts</span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          {mode === "quiz" && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-amber-400 font-black text-xl">
                <Trophy className="w-5 h-5" />
                <span>{score.toLocaleString()}</span>
              </div>
              {streak > 1 && (
                <div className="flex items-center gap-1 text-orange-400 font-black text-sm bg-orange-500/10 px-3 py-1 rounded-xl border border-orange-500/20">
                  <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
                  <span>{streak}x Streak</span>
                </div>
              )}
            </div>
          )}

          <button
            onClick={toggleMute}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Segmented Progress Dots */}
      <div className="progress-bar px-1">
        {questions.map((_, i) => (
          <div key={i} className={`progress-dot ${i < current ? "done" : ""} ${i === current ? "current" : ""}`} />
        ))}
      </div>

      {/* Timer Line Bar */}
      {timerEnabled && mode === "quiz" && (
        <div className="timer-track">
          <div
            className={`timer-fill ${timer > 10 ? "safe" : timer > 5 ? "warn" : "danger"}`}
            style={{ width: `${(timer / TIMER_SECONDS) * 100}%` }}
          />
        </div>
      )}

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.98 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="surface p-6 sm:p-10 space-y-6"
        >
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-black uppercase tracking-wider">
            <span>{q.category}</span>
            <span className="sm:hidden">{q.level}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black leading-snug text-white tracking-tight">
            {q.question}
          </h2>

          {/* Sequential Clues display for Buzzer Round */}
          {hasClues && q.clues && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[var(--eozka-gold)] flex items-center gap-1.5">
                  <Zap className="w-4 h-4" /> Progressive Clues ({clueStep} / {q.clues.length})
                </span>
                {clueStep < q.clues.length && (
                  <button
                    onClick={handleNextClue}
                    className="text-xs font-black text-amber-300 hover:text-amber-200 flex items-center gap-1 underline underline-offset-4 cursor-pointer"
                  >
                    Reveal Next Clue +
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.clues.slice(0, clueStep).map((clue, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="clue-card"
                  >
                    <span className="clue-badge">Clue {idx + 1}</span>
                    <span className="text-sm font-bold text-white/90">{clue}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Answer Options Grid */}
      <div className="answer-grid">
        {q.options.map((text, i) => {
          const key = OPTION_KEYS[i] as "A" | "B" | "C" | "D";
          let stateClass = "";
          if (revealed) {
            if (key === answerKey) stateClass = "correct";
            else if (key === selected) stateClass = "wrong";
            else stateClass = "dimmed";
          } else if (key === selected) {
            stateClass = "selected";
          }

          return (
            <motion.button
              key={`${current}-${key}`}
              whileHover={!revealed ? { scale: 1.01 } : {}}
              whileTap={!revealed ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(key)}
              disabled={revealed}
              className={`answer-btn ${stateClass}`}
              data-color={COLOR_MAP[i]}
            >
              <span className="shape">{SHAPE_MAP[i]}</span>
              <span className="label">{text}</span>
              <span className="key-badge">{key}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Presenter Action Controls */}
      {!selected && !revealed && (
        <div className="flex justify-center pt-2">
          <button onClick={handleReveal} className="btn btn-secondary btn-lg flex items-center gap-2">
            <Eye className="w-5 h-5" /> Reveal Answer (Press Space)
          </button>
        </div>
      )}

      {/* Explanation Box */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`explanation ${selected && selected !== answerKey ? "wrong" : ""}`}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <p className="text-base sm:text-lg leading-relaxed text-white/90 font-medium">
                {selected === answerKey ? (
                  <>
                    <span className="text-[var(--success)] font-black">Correct Answer! 🎉</span>{" "}
                    {q.explanation}
                  </>
                ) : (
                  <>
                    <span className="text-[var(--error)] font-black">Correct Answer: {q.options[q.correctAnswer]}.</span>{" "}
                    {q.explanation}
                  </>
                )}
              </p>
            </div>

            <button onClick={handleNext} className="btn btn-gold btn-lg w-full flex items-center justify-center gap-2">
              <span>{isLast ? "Finish Quiz & View Leaderboard" : "Next Question"}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}