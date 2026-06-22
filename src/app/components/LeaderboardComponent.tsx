"use client";

import { motion } from "framer-motion";

type LeaderboardEntry = {
  id: number;
  name: string;
  score: number;
  createdAt: Date;
};

export default function LeaderboardComponent({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div className="w-full max-w-md mx-auto mt-12 bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
          Top Scores
        </h3>
        <div className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-bold border border-yellow-500/30">
          Top 10
        </div>
      </div>

      <div className="space-y-3">
        {entries.length === 0 ? (
          <p className="text-center text-gray-400 py-4">No scores yet. Be the first!</p>
        ) : (
          entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                  ${index === 0 ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 
                    index === 1 ? 'bg-gray-300 text-black' : 
                    index === 2 ? 'bg-amber-700 text-white' : 
                    'bg-white/10 text-gray-400 group-hover:bg-white/20'}`}
                >
                  {index + 1}
                </span>
                <span className="text-white font-medium truncate max-w-[150px]">
                  {entry.name}
                </span>
              </div>
              <span className="text-xl font-bold text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-lg">
                {entry.score}
              </span>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
