"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import orangeWords01 from "@/app/words/orange/words-01.json";
import orangeWords02 from "@/app/words/orange/words-02.json";
import purpleWords01 from "@/app/words/purple/words-01.json";
import purpleWords02 from "@/app/words/purple/words-02.json";
import { cn } from "@/lib/utils";

type Team = "orange" | "purple";

interface Word {
  easy: string;
  hard: string;
}

const GAME_TIME = (Number(process.env.GAME_TIME) || 90) * 1000;

const allWords = {
  orange: [...orangeWords01.words, ...orangeWords02.words],
  purple: [...purpleWords01.words, ...purpleWords02.words],
};

function PlayGame() {
  const searchParams = useSearchParams();

  const [currentTeam, setCurrentTeam] = useState<Team>("orange");
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(GAME_TIME);
  const [isGameActive, setIsGameActive] = useState(true);
  const [seenWords, setSeenWords] = useState<Set<string>>(new Set());

  // Initialize team to start, query params take precedence over localStorage
  useEffect(() => {
    // Check for ?purple or ?orange in url
    const hasPurple = searchParams.has("purple");
    const hasOrange = searchParams.has("orange");

    if (hasPurple || hasOrange) {
      const team: Team = hasPurple ? "purple" : "orange";
      localStorage.setItem("currentTeam", team);
      setCurrentTeam(team);
      // Clean the URL after reading the param, so we get clean /play
      window.history.replaceState(null, "", "/play");
    } else {
      // when no query param, we check and load from localStorage instead
      const savedTeam = localStorage.getItem("currentTeam") as Team | null;
      if (savedTeam) {
        setCurrentTeam(savedTeam);
      }
    }
  }, [searchParams]);

  // Load seen words from localStorage on mount
  useEffect(() => {
    const savedSeenWords = localStorage.getItem("seenWords");
    if (savedSeenWords) {
      setSeenWords(new Set(JSON.parse(savedSeenWords)));
    }
  }, []);

  // Get random not yet seen word for the current team
  const getRandomWord = (): Word => {
    const teamWords = allWords[currentTeam];
    const unseenWords = teamWords.filter(
      (word) => !seenWords.has(`${currentTeam}-${word.easy}-${word.hard}`),
    );

    // If all words have been seen, we reset seen words for this team
    const wordsToUse = unseenWords.length > 0 ? unseenWords : teamWords;
    const randomIndex = Math.floor(Math.random() * wordsToUse.length);
    return wordsToUse[randomIndex];
  };

  // Mark word as seen + save to localStorage
  const markWordAsSeen = (word: Word) => {
    const wordKey = `${currentTeam}-${word.easy}-${word.hard}`;
    const newSeenWords = new Set(seenWords);
    newSeenWords.add(wordKey);
    setSeenWords(newSeenWords);
    localStorage.setItem("seenWords", JSON.stringify([...newSeenWords]));
  };

  // Initialize first word
  useEffect(() => {
    if (!currentWord) {
      const teamWords = allWords[currentTeam];
      const unseenWords = teamWords.filter(
        (word) => !seenWords.has(`${currentTeam}-${word.easy}-${word.hard}`),
      );
      const wordsToUse = unseenWords.length > 0 ? unseenWords : teamWords;
      const randomIndex = Math.floor(Math.random() * wordsToUse.length);
      setCurrentWord(wordsToUse[randomIndex]);
    }
  }, [currentWord, currentTeam, seenWords]);

  // Timer countdown
  useEffect(() => {
    if (!isGameActive || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 100;
        if (newTime <= 0) {
          setIsGameActive(false);
          return 0;
        }
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isGameActive, timeRemaining]);

  // Save score to localStorage when game ends
  useEffect(() => {
    if (!isGameActive && timeRemaining === 0) {
      const scores = JSON.parse(
        localStorage.getItem("teamScores") || '{"orange": 0, "purple": 0}',
      );
      scores[currentTeam] = (scores[currentTeam] || 0) + score;
      localStorage.setItem("teamScores", JSON.stringify(scores));
    }
  }, [isGameActive, timeRemaining, currentTeam, score]);

  const updateScore = (points: number) => {
    if (!isGameActive || !currentWord) return;

    setScore((prev) => prev + points);

    // Mark current word as seen and get new word
    markWordAsSeen(currentWord);
    setCurrentWord(getRandomWord());
  };

  const handleNextRound = () => {
    const nextTeam = currentTeam === "orange" ? "purple" : "orange";
    localStorage.setItem("currentTeam", nextTeam);
    // Reload the page to reset the game state for the next team
    window.location.reload();
  };

  const timerHeight = (timeRemaining / GAME_TIME) * 100;

  const bgColor = currentTeam === "orange" ? "bg-orange-800" : "bg-purple-800";
  const bgColorDark =
    currentTeam === "orange" ? "bg-orange-900" : "bg-purple-900";
  const easyBg = currentTeam === "orange" ? "bg-orange-500" : "bg-purple-500";
  const hardBg = currentTeam === "orange" ? "bg-orange-700" : "bg-purple-700";
  const buttonBg = currentTeam === "orange" ? "bg-orange-700" : "bg-purple-700";
  const textColor =
    currentTeam === "orange" ? "text-orange-100" : "text-purple-100";

  if (!isGameActive) {
    return (
      <main
        className={cn(
          "flex h-dvh flex-col items-center justify-center gap-6 px-4",
          bgColor,
          textColor,
        )}
      >
        <p className="font-bold text-10xl">{score}</p>
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={handleNextRound}
            className={cn(
              "fixed right-4 bottom-4 left-4 h-20 rounded-xl px-8 font-semibold text-lg",
              easyBg,
            )}
          >
            Next Player
          </button>
        </div>
      </main>
    );
  }

  const buttonStyles = cn(
    "group flex aspect-square w-full items-center justify-center px-3 font-bold text-x lg:aspect-video lg:text-3xl",
    buttonBg,
  );
  const roundedCornerStyles = "rounded-lg";
  const buttonActiveStyles =
    "active:scale-90 transition-all duration-200 ease-in-out";

  return (
    <main
      className={cn(
        "relative flex h-dvh flex-col gap-2 p-2",
        bgColor,
        textColor,
      )}
    >
      {/* Background Timer */}
      <div
        className={cn(
          "pointer-events-none absolute right-0 bottom-0 left-0 transition-all duration-100",
          bgColorDark,
        )}
        style={{ height: `${timerHeight}%` }}
      />

      {/* Easy word */}
      <button
        type="button"
        onClick={() => updateScore(1)}
        className={cn(
          "relative flex w-full flex-1 items-center justify-center p-4 font-semibold text-5xl transition-all duration-200 ease-in-out active:scale-96 lg:text-8xl",
          easyBg,
          roundedCornerStyles,
        )}
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={currentWord?.easy}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              opacity: { duration: 0.5, ease: "easeInOut" },
              y: { type: "spring", stiffness: 500, damping: 10 },
            }}
          >
            {currentWord?.easy}
          </motion.span>
        </AnimatePresence>
      </button>

      {/* Hard word */}
      <button
        type="button"
        onClick={() => updateScore(3)}
        className={cn(
          "relative flex w-full flex-1 flex-col items-center justify-center p-4 font-semibold text-5xl transition-all duration-200 ease-in-out active:scale-96 lg:text-8xl",
          hardBg,
          roundedCornerStyles,
        )}
      >
        <AnimatePresence mode="popLayout">
          {currentWord?.hard.split(" ").map((word, index) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                opacity: {
                  duration: 0.4,
                  ease: "easeInOut",
                  delay: index * 0.1,
                },
                y: {
                  type: "spring",
                  stiffness: 600,
                  damping: 20,
                  delay: index * 0.1,
                },
              }}
            >
              {word}
            </motion.span>
          ))}
        </AnimatePresence>
      </button>

      {/* Control buttons */}
      <div className="relative flex gap-2">
        <button
          className={cn(buttonStyles, roundedCornerStyles, buttonActiveStyles)}
          type="button"
          onClick={() => updateScore(-1)}
        >
          <p className="transition-all duration-300 ease-in-out group-active:scale-150">
            Fail
          </p>
        </button>
        <button
          className={cn(buttonStyles, roundedCornerStyles, buttonActiveStyles)}
          type="button"
          onClick={() => updateScore(1)}
        >
          <p className="transition-all duration-300 ease-in-out group-active:scale-150">
            +1
          </p>
        </button>
        <button
          className={cn(buttonStyles, roundedCornerStyles, buttonActiveStyles)}
          type="button"
          onClick={() => updateScore(3)}
        >
          <p className="transition-all duration-300 ease-in-out group-active:scale-150">
            +3
          </p>
        </button>
        <button
          className={cn(buttonStyles, roundedCornerStyles, buttonActiveStyles)}
          type="button"
          onClick={() => updateScore(-1)}
        >
          <p className="transition-all duration-300 ease-in-out group-active:scale-150">
            Skip
          </p>
        </button>
      </div>
    </main>
  );
}

export default function Play() {
  return (
    <Suspense>
      <PlayGame />
    </Suspense>
  );
}
