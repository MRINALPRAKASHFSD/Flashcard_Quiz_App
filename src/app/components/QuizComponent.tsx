"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { submitScore } from "../actions";

type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  level: string;
};

export default function QuizComponent({ questions, onComplete }: { questions: Question[], onComplete: () => void }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (isQuizActive && !showExplanation && timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && !showExplanation) {
      handleAnswerTimeout();
    }
  }, [timeLeft, isQuizActive, showExplanation]);

  const handleStart = () => {
    setIsQuizActive(true);
    setTimeLeft(15);
    setScore(0);
    setCurrentQuestionIndex(0);
    setIsFinished(false);
  };

  const handleAnswerTimeout = () => {
    setShowExplanation(true);
    setTimeout(() => {
      nextQuestion();
    }, 4000);
  };

  const handleAnswerClick = (option: string) => {
    if (showExplanation) return;
    
    setSelectedAnswer(option);
    setShowExplanation(true);
    
    if (option === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 10);
    }

    setTimeout(() => {
      nextQuestion();
    }, 4000);
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(15);
    } else {
      setIsQuizActive(false);
      setIsFinished(true);
      triggerConfetti();
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981']
    });
  };

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    await submitScore(playerName, score);
    setIsSubmitting(false);
    onComplete(); // Notify parent to refresh leaderboard
  };

  if (!isQuizActive && !isFinished) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white/10 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20 w-full max-w-2xl text-center">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6 drop-shadow-sm">
          Frontend Quiz
        </h2>
        <p className="text-gray-300 text-lg mb-8 max-w-md">
          50 questions. 15 seconds each. Don't blink.
        </p>
        <button 
          onClick={handleStart}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-lg transform transition-all hover:scale-105 active:scale-95"
        >
          Start
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-8 bg-white/10 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20 w-full max-w-2xl text-center"
      >
        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-4 drop-shadow-sm">
          Done.
        </h2>
        <p className="text-2xl text-white mb-2">
          Score: <span className="font-bold text-yellow-400">{score}</span>
        </p>
        <p className="text-gray-400 mb-8">
          Out of {questions.length * 10} possible points.
        </p>
        
        <form onSubmit={handleSubmitScore} className="w-full max-w-sm flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Enter your name" 
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            required
            maxLength={20}
            className="px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
          <button 
            type="submit"
            disabled={isSubmitting || !playerName.trim()}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg transform transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? "Saving..." : "Save score"}
          </button>
        </form>
        
        <button 
          onClick={handleStart}
          className="mt-6 text-sm text-gray-400 hover:text-white underline decoration-gray-500 transition-colors"
        >
          Try again
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="flex justify-between items-center mb-6 px-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Question</span>
          <span className="text-xl font-bold text-white bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
            {currentQuestionIndex + 1} / {questions.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Score</span>
          <span className="text-xl font-bold text-yellow-400 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
            {score}
          </span>
        </div>
      </div>

      <div className="relative w-full h-2 bg-gray-800 rounded-full mb-8 overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500"
          initial={{ width: "100%" }}
          animate={{ width: `${(timeLeft / 15) * 100}%` }}
          transition={{ duration: 1, ease: "linear" }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20"
        >
          <div className="flex justify-between items-start mb-6 gap-4">
            <h3 className="text-2xl font-bold text-white leading-relaxed">
              {currentQuestion.question}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border
              ${currentQuestion.level === 'Hard' ? 'bg-red-500/20 text-red-300 border-red-500/30' : 
                currentQuestion.level === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 
                'bg-green-500/20 text-green-300 border-green-500/30'}`}
            >
              {currentQuestion.level}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentQuestion.correctAnswer;
              
              let buttonStyle = "bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 hover:border-white/30";
              
              if (showExplanation) {
                if (isCorrect) {
                  buttonStyle = "bg-green-500/30 border-green-500/50 text-green-100 shadow-[0_0_15px_rgba(34,197,94,0.3)]";
                } else if (isSelected && !isCorrect) {
                  buttonStyle = "bg-red-500/30 border-red-500/50 text-red-100";
                } else {
                  buttonStyle = "bg-black/20 border-white/5 text-gray-500 opacity-50";
                }
              } else if (isSelected) {
                buttonStyle = "bg-blue-500/30 border-blue-500/50 text-white";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerClick(option)}
                  disabled={showExplanation}
                  className={`relative p-5 rounded-2xl border transition-all duration-300 text-left font-medium text-lg overflow-hidden group ${buttonStyle}`}
                >
                  <span className="relative z-10">{option}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className={`p-5 rounded-2xl border ${selectedAnswer === currentQuestion.correctAnswer ? 'bg-green-500/10 border-green-500/20' : 'bg-blue-500/10 border-blue-500/20'}`}>
                  <p className="text-sm font-semibold uppercase tracking-wider mb-2 text-gray-400">
                    {selectedAnswer === currentQuestion.correctAnswer ? 
                      <span className="text-green-400">Correct!</span> : 
                      <span className="text-blue-400">Explanation</span>
                    }
                  </p>
                  <p className="text-gray-200 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
