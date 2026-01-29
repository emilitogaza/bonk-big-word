"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [orangeScore, setOrangeScore] = useState(0);
  const [purpleScore, setPurpleScore] = useState(0);

  // Load scores from localStorage
  useEffect(() => {
    const scores = JSON.parse(
      localStorage.getItem("teamScores") || '{"orange": 0, "purple": 0}',
    );
    setOrangeScore(scores.orange || 0);
    setPurpleScore(scores.purple || 0);
  }, []);

  const handleResetScores = () => {
    localStorage.setItem("teamScores", '{"orange": 0, "purple": 0}');
    setOrangeScore(0);
    setPurpleScore(0);
  };

  return (
    <main className="flex h-dvh flex-col items-center justify-center gap-6 bg-purple-400 p-8">
      <h1 className="font-bold text-6xl text-purple-900">Big Word Bonk</h1>
      <div className="flex gap-8 text-center">
        <div className="rounded-lg bg-orange-500 p-4 text-orange-100">
          <p className="font-bold text-2xl">Orange Team</p>
          <p className="font-bold text-5xl">{orangeScore}</p>
        </div>
        <div className="rounded-lg bg-purple-500 p-4 text-purple-100">
          <p className="font-bold text-2xl">Purple Team</p>
          <p className="font-bold text-5xl">{purpleScore}</p>
        </div>
      </div>

      <div className="absolute right-4 bottom-4 left-4 flex gap-4">
        <button
          type="button"
          onClick={handleResetScores}
          className="flex h-20 w-full items-center justify-center gap-2 rounded-lg bg-purple-900 px-8 font-semibold text-purple-100 text-xl transition-colors hover:bg-purple-800"
        >
          Reset Scores
        </button>
        <Link
          href="/play"
          className="flex h-20 w-full items-center justify-center gap-2 rounded-lg bg-purple-700 px-8 font-semibold text-purple-100 text-xl transition-colors hover:bg-purple-600"
          onClick={() => {
            localStorage.setItem("currentTeam", "orange");
          }}
        >
          Play Now <ArrowRight />
        </Link>
      </div>
    </main>
  );
}
