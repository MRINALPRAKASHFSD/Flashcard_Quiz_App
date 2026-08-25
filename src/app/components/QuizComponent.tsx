"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "canvas-confetti";
import { Volume2, VolumeX, Eye, ArrowRight, ArrowLeft, Zap, Trophy, Flame, Sparkles, AlertTriangle } from "lucide-react";

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

  // History tracking to allow seamless Previous / Next navigation
  const [answersState, setAnswersState] = useState<
    Record<number, { selected: string | null; revealed: boolean; clueStep: number }>
  >({});

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
    setAnswersState({});
  }, [questions]);

  useEffect(() => {
    if (mode !== "quiz" || !timerEnabled || revealed) return;
    const id = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(id);
          soundManager.playWrong();
          setRevealed(true);
          setAnswersState((prev) => ({
            ...prev,
            [current]: { selected: null, revealed: true, clueStep }
          }));
          return 0;
        }
        if (t <= 5) soundManager.playTick();
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [mode, timerEnabled, revealed, current, clueStep]);

  const handleNextClue = useCallback(() => {
    if (!hasClues || !q.clues) return;
    if (clueStep < q.clues.length) {
      const nextStep = clueStep + 1;
      setClueStep(nextStep);
      soundManager.playClueReveal();
      setAnswersState((prev) => ({
        ...prev,
        [current]: { selected, revealed, clueStep: nextStep }
      }));
    }
  }, [hasClues, q.clues, clueStep, current, selected, revealed]);

  const handleSelect = useCallback(
    (key: string) => {
      if (selected || revealed) return;
      setSelected(key);
      setRevealed(true);

      const isCorrect = key === answerKey || Boolean(q.isOpinion);

      if (mode === "quiz") {
        const timeTaken = TIMER_SECONDS - timer;
        setTimes((p) => [...p, timeTaken]);
      }

      if (isCorrect) {
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

      setAnswersState((prev) => ({
        ...prev,
        [current]: { selected: key, revealed: true, clueStep }
      }));
    },
    [selected, revealed, mode, timer, answerKey, streak, q.points, q.isOpinion, current, clueStep]
  );

  const handleReveal = () => {
    soundManager.playClick();
    setRevealed(true);
    setAnswersState((prev) => ({
      ...prev,
      [current]: { selected, revealed: true, clueStep }
    }));
  };

  const handlePrev = useCallback(() => {
    if (current === 0) return;
    soundManager.playClick();
    const prevIdx = current - 1;
    setCurrent(prevIdx);
    const saved = answersState[prevIdx] || { selected: null, revealed: false, clueStep: 1 };
    setSelected(saved.selected);
    setRevealed(saved.revealed);
    setClueStep(saved.clueStep);
  }, [current, answersState]);

  const handleNext = useCallback(() => {
    soundManager.playClick();
    if (isLast) {
      const avg = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
      onComplete?.({ score, correctCount, maxStreak, avgTime: parseFloat(avg.toFixed(1)) });
    } else {
      const nextIdx = current + 1;
      setCurrent(nextIdx);
      const saved = answersState[nextIdx] || { selected: null, revealed: false, clueStep: 1 };
      setSelected(saved.selected);
      setRevealed(saved.revealed);
      setClueStep(saved.clueStep);
      setTimer(TIMER_SECONDS);
    }
  }, [isLast, times, score, correctCount, maxStreak, onComplete, current, answersState]);

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

      if (e.code === "ArrowLeft") {
        if (current > 0) handlePrev();
      }

      if (e.code === "Space" || e.code === "ArrowRight") {
        e.preventDefault();
        if (revealed) handleNext();
        else if (!selected) handleReveal();
      }

      if (key === "M") toggleMute();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [revealed, selected, current, handleSelect, handleNext, handlePrev]);

  return (
    <div className="w-full max-w-5xl space-y-6">
      {/* Quiz Top Control Bar */}
      <div className="surface p-3.5 sm:p-5 flex items-center justify-between gap-3 flex-wrap w-full">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[var(--text-muted)] font-black">Question</span>
            <span className="text-xl sm:text-2xl font-black text-white">
              {current + 1} <span className="text-xs sm:text-sm font-bold text-[var(--text-muted)]">/ {questions.length}</span>
            </span>
          </div>

          <div className="h-7 sm:h-8 w-[1px] bg-white/10" />

          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="badge badge-all text-[10px] sm:text-xs">{q.level}</span>
            <span className="badge badge-quiz text-[10px] sm:text-xs">+{q.points || 10} pts</span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {current > 0 && (
            <button
              onClick={handlePrev}
              className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
              title="Previous Question"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">Prev</span>
            </button>
          )}

          {mode === "quiz" && (
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1 text-amber-400 font-black text-base sm:text-xl">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{score.toLocaleString()}</span>
              </div>
              {streak > 1 && (
                <div className="flex items-center gap-1 text-orange-400 font-black text-xs sm:text-sm bg-orange-500/10 px-2.5 py-1 rounded-xl border border-orange-500/20">
                  <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 animate-bounce" />
                  <span>{streak}x</span>
                </div>
              )}
            </div>
          )}

          <button
            onClick={toggleMute}
            className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Segmented Progress Dots */}
      <div className="progress-bar px-1 w-full">
        {questions.map((_, i) => (
          <div key={i} className={`progress-dot ${i < current ? "done" : ""} ${i === current ? "current" : ""}`} />
        ))}
      </div>

      {/* Timer Line Bar */}
      {timerEnabled && mode === "quiz" && (
        <div className="timer-track w-full">
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
          className="surface p-5 sm:p-10 space-y-4 sm:space-y-6 w-full"
        >
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-[var(--text-secondary)] font-black uppercase tracking-wider">
            <span>{q.category}</span>
            <span>{q.level}</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black leading-snug text-white tracking-tight">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {q.clues.slice(0, clueStep).map((clue, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="clue-card w-full"
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

      {/* Answer Options Grid — Direct Tailwind Grid Utility for Rock-Solid 2-Column Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
        {q.options.map((text, i) => {
          const key = OPTION_KEYS[i] as "A" | "B" | "C" | "D";
          let stateClass = "";
          if (revealed) {
            if (q.isOpinion) {
              if (key === selected) stateClass = "correct";
              else stateClass = "dimmed";
            } else {
              if (key === answerKey) stateClass = "correct";
              else if (key === selected) stateClass = "wrong";
              else stateClass = "dimmed";
            }
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
              className={`answer-btn w-full ${stateClass}`}
              data-color={COLOR_MAP[i]}
            >
              <span className="shape">{SHAPE_MAP[i]}</span>
              <span className="label text-left">{text}</span>
              <span className="key-badge">{key}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Presenter Action Controls */}
      {!selected && !revealed && (
        <div className="flex items-center justify-center gap-3 pt-2 w-full">
          {current > 0 && (
            <button onClick={handlePrev} className="btn btn-secondary btn-lg flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" /> Previous
            </button>
          )}
          <button onClick={handleReveal} className="btn btn-secondary btn-lg flex items-center gap-2">
            <Eye className="w-5 h-5" /> Reveal Answer (Space)
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
            className={`explanation w-full ${!q.isOpinion && selected && selected !== answerKey ? "wrong" : ""}`}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <p className="text-base sm:text-lg leading-relaxed text-white/90 font-medium">
                {q.isOpinion ? (
                  <>
                    <span className="text-[var(--eozka-gold)] font-black flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-5 h-5 text-amber-400" /> Audience Choice!
                    </span>{" "}
                    {q.explanation}
                  </>
                ) : selected === answerKey ? (
                  <>
                    <span className="text-[var(--success)] font-black flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-5 h-5 text-emerald-400" /> Correct Answer!
                    </span>{" "}
                    {q.explanation}
                  </>
                ) : (
                  <>
                    <span className="text-[var(--error)] font-black flex items-center gap-1.5 mb-1">
                      <AlertTriangle className="w-5 h-5 text-rose-400" /> Correct Answer: {q.options[q.correctAnswer]}.
                    </span>{" "}
                    {q.explanation}
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full">
              {current > 0 && (
                <button onClick={handlePrev} className="btn btn-secondary btn-lg flex-1 flex items-center justify-center gap-2">
                  <ArrowLeft className="w-5 h-5" />
                  <span>Previous Question</span>
                </button>
              )}
              <button onClick={handleNext} className="btn btn-gold btn-lg flex-1 flex items-center justify-center gap-2">
                <span>{isLast ? "Finish Quiz & View Results" : "Next Question"}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}