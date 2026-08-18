"use client";

import { Trophy, Crown, Medal, Trash2, UserCheck, Sparkles } from "lucide-react";

interface LeaderboardEntry {
  id: number;
  name: string;
  score: number;
  createdAt: string;
  category?: string;
}

interface Props {
  entries: LeaderboardEntry[];
  onClear?: () => void;
}

const AVATAR_COLORS = [
  "bg-indigo-600 text-white border-indigo-400",
  "bg-amber-600 text-white border-amber-400",
  "bg-emerald-600 text-white border-emerald-400",
  "bg-rose-600 text-white border-rose-400",
  "bg-purple-600 text-white border-purple-400",
];

export default function LeaderboardComponent({ entries, onClear }: Props) {
  const top1 = entries[0];
  const top2 = entries[1];
  const top3 = entries[2];
  const restEntries = entries.slice(3);

  return (
    <div className="surface p-6 sm:p-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Leaderboard</h2>
            <p className="text-xs text-[var(--text-secondary)] font-bold">Top Orientation High Scores</p>
          </div>
        </div>

        {entries.length > 0 && onClear && (
          <button
            onClick={onClear}
            className="btn btn-ghost btn-sm text-rose-400 hover:bg-rose-500/10 flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" /> Reset
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <UserCheck className="w-12 h-12 text-[var(--text-muted)] mx-auto opacity-40" />
          <p className="text-[var(--text-secondary)] font-bold text-base">No high scores registered yet.</p>
          <p className="text-xs text-[var(--text-muted)]">Complete a session in Quiz Mode to claim your podium spot!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-3 items-end pt-6 pb-2 max-w-lg mx-auto text-center">
            {/* 2nd Place */}
            {top2 ? (
              <div className="flex flex-col items-center space-y-1.5 sm:space-y-2">
                <div className="relative">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-slate-800 border-2 sm:border-4 border-slate-400 flex items-center justify-center text-slate-200 text-lg sm:text-xl font-black shadow-lg">
                    {top2.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-400 text-slate-950 font-black text-[10px] sm:text-xs flex items-center justify-center border-2 border-slate-900">
                    2
                  </span>
                </div>
                <div>
                  <div className="font-extrabold text-white text-xs sm:text-sm truncate max-w-[75px] sm:max-w-[90px]">{top2.name}</div>
                  <div className="text-[11px] sm:text-xs font-black text-indigo-400">{top2.score} pts</div>
                </div>
              </div>
            ) : (
              <div className="opacity-30 flex flex-col items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/5 border-2 border-dashed border-white/20" />
                <span className="text-[10px] sm:text-xs font-bold mt-1 text-[var(--text-muted)]">2nd Place</span>
              </div>
            )}

            {/* 1st Place (Crown Winner) */}
            {top1 ? (
              <div className="flex flex-col items-center space-y-1.5 sm:space-y-2 -translate-y-2 sm:-translate-y-3">
                <div className="relative">
                  <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 absolute -top-5 sm:-top-7 left-1/2 -translate-x-1/2 animate-bounce" />
                  <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-600 border-2 sm:border-4 border-amber-200 flex items-center justify-center text-amber-950 text-xl sm:text-2xl font-black shadow-xl shadow-amber-500/20">
                    {top1.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-400 text-amber-950 font-black text-xs sm:text-sm flex items-center justify-center border-2 border-slate-900 shadow-md">
                    1
                  </span>
                </div>
                <div>
                  <div className="font-black text-white text-xs sm:text-base truncate max-w-[85px] sm:max-w-[110px]">{top1.name}</div>
                  <div className="text-xs sm:text-sm font-black text-amber-400 flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {top1.score} pts
                  </div>
                </div>
              </div>
            ) : (
              <div className="opacity-30 flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 border-2 border-dashed border-white/20" />
                <span className="text-[10px] sm:text-xs font-bold mt-1 text-[var(--text-muted)]">1st Place</span>
              </div>
            )}

            {/* 3rd Place */}
            {top3 ? (
              <div className="flex flex-col items-center space-y-1.5 sm:space-y-2">
                <div className="relative">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-amber-950 border-2 sm:border-4 border-amber-700 flex items-center justify-center text-amber-200 text-lg sm:text-xl font-black shadow-lg">
                    {top3.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-700 text-white font-black text-[10px] sm:text-xs flex items-center justify-center border-2 border-slate-900">
                    3
                  </span>
                </div>
                <div>
                  <div className="font-extrabold text-white text-xs sm:text-sm truncate max-w-[75px] sm:max-w-[90px]">{top3.name}</div>
                  <div className="text-[11px] sm:text-xs font-black text-amber-500">{top3.score} pts</div>
                </div>
              </div>
            ) : (
              <div className="opacity-30 flex flex-col items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/5 border-2 border-dashed border-white/20" />
                <span className="text-[10px] sm:text-xs font-bold mt-1 text-[var(--text-muted)]">3rd Place</span>
              </div>
            )}
          </div>

          {/* Ranked List */}
          {restEntries.length > 0 && (
            <div className="space-y-3 pt-2">
              {restEntries.map((entry, idx) => {
                const rank = idx + 4;
                const badgeColorClass = AVATAR_COLORS[idx % AVATAR_COLORS.length];

                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/3 border border-white/8 hover:border-white/15 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-6 text-center font-black text-sm text-[var(--text-muted)]">{rank}</span>

                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-black flex items-center justify-center text-sm shadow-sm">
                        {entry.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <div className="font-extrabold text-white text-sm flex items-center gap-2">
                          <span>{entry.name}</span>
                          {entry.category && (
                            <span className="badge badge-all text-[10px] py-0.5 px-2">{entry.category}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={`px-3 py-1.5 rounded-full font-black text-xs border shadow-sm ${badgeColorClass}`}>
                      {entry.score} pts
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}