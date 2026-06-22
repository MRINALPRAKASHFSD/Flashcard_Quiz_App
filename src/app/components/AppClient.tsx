"use client";

import { useState } from "react";
import QuizComponent from "./QuizComponent";
import LeaderboardComponent from "./LeaderboardComponent";
import { getLeaderboard } from "../actions";

export default function AppClient({ 
  initialQuestions, 
  initialLeaderboard 
}: { 
  initialQuestions: any[], 
  initialLeaderboard: any[] 
}) {
  const [leaderboard, setLeaderboard] = useState(initialLeaderboard);

  const refreshLeaderboard = async () => {
    const newLeaderboard = await getLeaderboard();
    setLeaderboard(newLeaderboard);
  };

  return (
    <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-12 flex flex-col items-center">
      <QuizComponent 
        questions={initialQuestions} 
        onComplete={refreshLeaderboard} 
      />
      <LeaderboardComponent entries={leaderboard} />
    </div>
  );
}
