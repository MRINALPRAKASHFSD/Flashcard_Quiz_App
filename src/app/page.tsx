import AppClient from "./components/AppClient";
import { getQuestions, getLeaderboard } from "./actions";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const questions = await getQuestions();
  const leaderboard = await getLeaderboard();

  return (
    <main className="min-h-screen bg-black flex flex-col items-center relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/30 rounded-full blur-[120px] mix-blend-screen animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/30 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-emerald-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-4000" />
      </div>

      {/* Content */}
      <div className="z-10 w-full flex flex-col items-center">
        <header className="w-full max-w-6xl mx-auto px-6 py-8 flex justify-between items-center border-b border-white/10">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Frontend Quiz
          </h1>
        </header>

        <AppClient initialQuestions={questions} initialLeaderboard={leaderboard} />
      </div>
    </main>
  );
}
