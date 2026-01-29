"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [orangeScore, setOrangeScore] = useState(0);
  const [purpleScore, setPurpleScore] = useState(0);

  // Load scores from localStorage
  useEffect(() => {
    const scores = JSON.parse(localStorage.getItem("teamScores") || '{"orange": 0, "purple": 0}');
    setOrangeScore(scores.orange || 0);
    setPurpleScore(scores.purple || 0);
  }, []);

  const handleResetScores = () => {
    localStorage.setItem("teamScores", '{"orange": 0, "purple": 0}');
    setOrangeScore(0);
    setPurpleScore(0);
  };

  return (
    <main className="relative flex h-dvh flex-col items-center justify-center gap-6 bg-purple-400 p-4">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/kevin.webp"
          alt="Background of Kevin from the office"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-purple-800/80" />
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center gap-4">
        <h1 className="text-center font-bold text-4xl text-purple-200 md:text-6xl">
          Bonk Big Word
        </h1>
        <p className="text-balance text-center font-bold text-3xl text-purple-200 md:text-4xl">
          Why say lot word when few word do trick?
        </p>
        <div className="flex w-full items-center justify-center gap-4 text-center">
          <div className="max-size-64 flex aspect-square w-full items-center justify-center rounded-lg bg-orange-500 p-4 text-orange-100">
            <p className="font-bold text-7xl lg:text-8xl">{orangeScore}</p>
          </div>
          <div className="max-size-64 flex aspect-square w-full items-center justify-center rounded-lg bg-purple-500 p-4 text-purple-100">
            <p className="font-bold text-7xl lg:text-8xl">{purpleScore}</p>
          </div>
        </div>
        {/* Bottom Buttons */}
        <div className="flex w-full flex-col gap-4 md:flex-row">
          <button
            type="button"
            className="flex h-20 w-full items-center justify-center gap-2 rounded-lg bg-purple-500 px-8 font-semibold text-purple-100 text-xl transition-colors hover:bg-purple-600"
            onClick={handleResetScores}
          >
            Reset Scores
          </button>
          <Link
            href="/play"
            className="flex h-20 w-full items-center justify-center gap-2 rounded-lg bg-purple-500 px-8 font-semibold text-purple-100 text-xl transition-colors hover:bg-purple-600"
            onClick={() => {
              localStorage.setItem("currentTeam", "orange");
            }}
          >
            Play Now <ArrowRight />
          </Link>
        </div>
      </div>
    </main>
  );
}
