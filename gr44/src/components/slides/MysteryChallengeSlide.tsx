import React, { useState, useEffect, useRef } from 'react';
import { Slide } from '../../types/presentation';
import { ThemeStyles } from '../ThemeManager';
import { motion } from 'motion/react';
import { soundEffects } from '../../utils/soundEffects';
import { RotateCcw, Check, X } from 'lucide-react';

interface Props {
  slide: Slide;
  theme?: ThemeStyles;
  stepIndex?: number;
  onSetStepIndex?: (step: number) => void;
  onRegisterSteps?: (totalSteps: number) => void;
  onNextAction?: () => void;
}

interface QuizOption {
  key: string;
  label: string;
  location: string;
  explanation: string;
  isCorrect: boolean;
}

const INITIAL_OPTIONS: QuizOption[] = [
  {
    key: 'A',
    label: 'Hoa Lu Ancient Capital',
    location: 'Ninh Binh Province',
    explanation: 'Hoa Lu Ancient Capital was the imperial capital of Vietnam in the 10th century under the Dinh and Early Le dynasties, located in Ninh Binh Province in Northern Vietnam, not Quang Ngai!',
    isCorrect: false
  },
  {
    key: 'B',
    label: 'Ho Dynasty Citadel',
    location: 'Thanh Hoa Province',
    explanation: 'Ho Dynasty Citadel is a famous 14th-century stone fortress built by Ho Quy Ly in 1397, located in Thanh Hoa Province, not Quang Ngai!',
    isCorrect: false
  },
  {
    key: 'C',
    label: 'Chau Sa Ancient Citadel',
    location: 'Quang Ngai Province',
    explanation: 'Built in the 9th–10th century during the Champa Kingdom, Chau Sa Ancient Citadel is the largest and only preserved earthen Champa citadel in Central Vietnam — a true hidden historic treasure of Quang Ngai!',
    isCorrect: true
  },
  {
    key: 'D',
    label: 'Vinh Moc Tunnels',
    location: 'Quang Tri Province',
    explanation: 'Vinh Moc Tunnels is a legendary wartime subterranean village and tunnel network constructed during the resistance war, located in Vinh Linh, Quang Tri Province, not Quang Ngai!',
    isCorrect: false
  }
];

export const MysteryChallengeSlide: React.FC<Props> = ({
  onRegisterSteps,
  onNextAction,
}) => {
  const QUESTION_TEXT =
    "Anh Ba has escaped to Quang Ngai and needs to hide from his mother! Help Anh Ba find a genuine, lesser-known historic relic in Quang Ngai so he can safely hide before his mother catches him:";

  const [viewState, setViewState] = useState<'question' | 'rock_confirm' | 'correct' | 'wrong'>('question');
  const [optionsList, setOptionsList] = useState<QuizOption[]>(INITIAL_OPTIONS);
  const [correctClickCount, setCorrectClickCount] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<QuizOption | null>(null);
  const [correctPhaseTwo, setCorrectPhaseTwo] = useState<boolean>(false);
  const correctTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [wrongPhaseTwo, setWrongPhaseTwo] = useState<boolean>(false);
  const wrongTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [typedCorrectMsg, setTypedCorrectMsg] = useState<string>('');
  const typewriterTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [typedPrompt, setTypedPrompt] = useState<string>('');
  const [isPromptTyping, setIsPromptTyping] = useState<boolean>(true);
  const promptTimerRef = useRef<NodeJS.Timeout | null>(null);

  const ROCK_IMAGE = '/assets/images/rock.jfif';
  const SAD_BA_IMAGE = '/assets/images/sadBa.jpg';
  const HAPPY_BA_IMAGE = '/assets/images/happyBa.jpg';
  const DEATH_BA_IMAGE = '/assets/images/deathBa.jpg';

  useEffect(() => {
    onRegisterSteps?.(1);
    soundEffects.playKindredBgm();

    setTypedPrompt('');
    setIsPromptTyping(true);
    let curLen = 0;

    if (promptTimerRef.current) clearInterval(promptTimerRef.current);

    promptTimerRef.current = setInterval(() => {
      if (curLen < QUESTION_TEXT.length) {
        curLen += 1;
        setTypedPrompt(QUESTION_TEXT.slice(0, curLen));
        soundEffects.playKeyClickSound();
      } else {
        setIsPromptTyping(false);
        if (promptTimerRef.current) clearInterval(promptTimerRef.current);
      }
    }, 18);

    return () => {
      soundEffects.stopKindredBgm();
      if (promptTimerRef.current) clearInterval(promptTimerRef.current);
      if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current);
      if (correctTimerRef.current) clearTimeout(correctTimerRef.current);
      if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
    };
  }, [onRegisterSteps]);

  const handleSkipPromptTyping = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPromptTyping) {
      if (promptTimerRef.current) clearInterval(promptTimerRef.current);
      setTypedPrompt(QUESTION_TEXT);
      setIsPromptTyping(false);
      soundEffects.playKeyClickSound();
    }
  };

  const handleOptionClick = (opt: QuizOption) => {
    if (opt.isCorrect) {
      if (correctClickCount < 2) {
        setOptionsList((prevList) => {
          const currentIndex = prevList.findIndex((item) => item.key === opt.key);
          if (currentIndex === -1) return prevList;

          const otherIndexes = prevList
            .map((_, idx) => idx)
            .filter((idx) => idx !== currentIndex);

          if (otherIndexes.length === 0) return prevList;

          const targetIndex = otherIndexes[Math.floor(Math.random() * otherIndexes.length)];

          const newList = [...prevList];
          const temp = newList[currentIndex];
          newList[currentIndex] = newList[targetIndex];
          newList[targetIndex] = temp;

          return newList;
        });

        setCorrectClickCount((prev) => prev + 1);
        soundEffects.playRotateSound();
        return;
      }
    }

    setSelectedOption(opt);
    setViewState('rock_confirm');
    soundEffects.playSlideSound();
  };

  const handleRockNo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewState('question');
    setSelectedOption(null);
    soundEffects.playRotateSound();
  };

  const handleRockYes = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedOption) return;

    if (selectedOption.isCorrect) {
      setViewState('correct');
      setCorrectPhaseTwo(false);

      if (correctTimerRef.current) clearTimeout(correctTimerRef.current);
      correctTimerRef.current = setTimeout(() => {
        soundEffects.stopKindredBgm();
        setCorrectPhaseTwo(true);
        startCorrectTypewriter();
      }, 1500);
    } else {
      setViewState('wrong');
      setWrongPhaseTwo(false);

      if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current);
      wrongTimerRef.current = setTimeout(() => {
        soundEffects.pauseKindredBgm();
        soundEffects.playFailSound();
        setWrongPhaseTwo(true);
      }, 1500);
    }
  };

  const startCorrectTypewriter = () => {
    const fullText = "You did a great job, Anh Ba loves you!\nHe promises to give you a surprise tonight.";
    setTypedCorrectMsg('');
    let curLen = 0;

    if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);

    typewriterTimerRef.current = setInterval(() => {
      if (curLen < fullText.length) {
        curLen += 1;
        setTypedCorrectMsg(fullText.slice(0, curLen));
        soundEffects.playKeyClickSound();
      } else {
        if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
      }
    }, 25);
  };

  const handleTryAgain = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewState('question');
    setSelectedOption(null);
    setWrongPhaseTwo(false);
    soundEffects.playKindredBgm();
  };

  const handleCorrectScreenClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (correctPhaseTwo) {
      soundEffects.playSlideSound();
      onNextAction?.();
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative w-full h-full flex flex-col justify-center items-center overflow-hidden bg-black font-sans select-none text-white cursor-default"
    >
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0.98)_75%)] pointer-events-none" />

      {viewState === 'question' && (
        <div
          onClick={handleSkipPromptTyping}
          className="relative z-10 w-full h-full flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:p-14"
        >
          <div className="w-full flex-1 flex flex-col justify-center max-w-7xl mx-auto py-2 gap-6 md:gap-8">
            <div className="w-full p-6 sm:p-8 md:p-9 rounded-3xl bg-stone-900/90 border border-white/20 shadow-[0_0_35px_rgba(255,255,255,0.06)] backdrop-blur-md text-left">
              <p className="font-mono text-base sm:text-lg md:text-xl lg:text-2xl text-stone-100 leading-relaxed drop-shadow">
                {typedPrompt}
                {isPromptTyping && (
                  <span className="inline-block w-3 sm:w-4 h-6 sm:h-7 ml-1.5 align-middle bg-white animate-pulse shadow-[0_0_8px_#ffffff]" />
                )}
              </p>
            </div>

            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-5 flex flex-col items-center justify-center">
                <div className="relative w-full max-w-[500px] sm:max-w-[580px] lg:max-w-[650px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-black">
                  <img
                    src={SAD_BA_IMAGE}
                    alt="Anh Ba Sad"
                    className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
                    onError={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {optionsList.map((opt) => (
                    <motion.button
                      layout
                      key={opt.key}
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOptionClick(opt);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-6 sm:p-7 rounded-2xl border border-white/20 bg-stone-900/80 hover:bg-stone-800 hover:border-white/50 text-stone-100 flex items-center gap-4 transition-colors duration-200 text-left cursor-pointer shadow-lg"
                    >
                      <span className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center font-mono font-black text-xl shrink-0 border border-white/20 text-white">
                        {opt.key}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-lg sm:text-xl md:text-2xl font-bold leading-snug">
                          {opt.label}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewState === 'rock_confirm' && selectedOption && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-20 w-full h-full flex items-center justify-center p-6 sm:p-12 md:p-16 bg-black"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 max-w-6xl w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, x: -30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 240, damping: 20 }}
              className="w-72 h-72 sm:w-88 sm:h-88 md:w-[460px] md:h-[460px] rounded-3xl overflow-hidden shadow-[0_0_65px_rgba(255,255,255,0.4)] shrink-0 bg-black"
            >
              <img
                src={ROCK_IMAGE}
                alt="The Rock Eyebrow Raise"
                className="w-full h-full object-cover object-center filter contrast-110 brightness-105"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="flex flex-col items-center md:items-start text-center md:text-left space-y-7 max-w-xl"
            >
              <h2 className="font-mono text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-wider drop-shadow-[0_0_45px_rgba(255,255,255,0.95)]">
                Are you sure?
              </h2>

              <p className="font-mono text-xl sm:text-2xl md:text-3xl text-stone-300 font-medium">
                You selected:{' '}
                <span className="font-bold text-white underline decoration-white/50">
                  [{selectedOption.key}] {selectedOption.label}
                </span>
              </p>

              <div className="flex items-center gap-6 pt-2 w-full justify-center md:justify-start">
                <button
                  onClick={handleRockYes}
                  className="px-10 sm:px-14 py-4 sm:py-5 rounded-2xl bg-white hover:bg-stone-200 text-stone-950 font-mono font-black text-2xl sm:text-3xl shadow-[0_0_35px_rgba(255,255,255,0.6)] hover:shadow-[0_0_50px_rgba(255,255,255,0.95)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-3"
                >
                  <Check className="w-7 h-7 stroke-[3]" />
                  <span>YES</span>
                </button>

                <button
                  onClick={handleRockNo}
                  className="px-10 sm:px-14 py-4 sm:py-5 rounded-2xl bg-red-950/70 hover:bg-red-900 text-red-200 font-mono font-black text-2xl sm:text-3xl border border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-3"
                >
                  <X className="w-7 h-7 stroke-[3]" />
                  <span>NO</span>
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {viewState === 'correct' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          onClick={handleCorrectScreenClick}
          className={`relative z-20 w-full h-full flex items-center justify-center p-6 sm:p-10 md:p-14 lg:p-16 bg-black ${
            correctPhaseTwo ? 'cursor-pointer' : ''
          }`}
          title={correctPhaseTwo ? 'Click anywhere to proceed to the next slide' : ''}
        >
          {!correctPhaseTwo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center text-center space-y-4"
            >
              <h1 className="font-mono text-xl sm:text-2xl md:text-3xl font-semibold text-white tracking-wider drop-shadow-[0_0_20px_rgba(255,255,255,0.7)]">
                Congratulations!
              </h1>
            </motion.div>
          )}

          {correctPhaseTwo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center max-w-7xl w-full mx-auto"
            >
              <div className="lg:col-span-7 flex flex-col space-y-6 text-left order-2 lg:order-1">
                <motion.h1
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="font-mono text-3xl sm:text-4xl md:text-5xl font-black text-emerald-400 drop-shadow-[0_0_35px_rgba(52,211,153,0.8)] leading-tight"
                >
                  Great, you're correct!
                </motion.h1>

                <div className="p-4 sm:p-5 rounded-xl bg-stone-900/90 shadow-[0_0_30px_rgba(52,211,153,0.15)] backdrop-blur-md space-y-3">
                  <p className="font-mono text-base sm:text-lg md:text-xl font-bold text-white leading-relaxed whitespace-pre-line drop-shadow">
                    {typedCorrectMsg}
                    <span className="inline-block w-2 sm:w-2 h-4 sm:h-5 ml-1 align-middle bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                  </p>

                  <div className="mt-2 text-[11px] sm:text-xs md:text-sm font-mono text-stone-300 bg-stone-950/80 p-2.5 sm:p-3 rounded-lg leading-relaxed border border-emerald-950/40">
                    Chau Sa Ancient Citadel (Thành cổ Châu Sa) was built in the 9th–10th century during the Champa Kingdom. Located in Quang Ngai, it is the only preserved earthen Champa fortress in Central Vietnam and a National Historic Relic! Anh Ba is completely safe!
                  </div>
                </div>

                <p className="font-mono text-xs sm:text-sm text-stone-400 tracking-wider">
                  (Click anywhere to continue to next slide)
                </p>
              </div>

              <div className="lg:col-span-5 flex flex-col items-center justify-center order-1 lg:order-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.75, x: 40 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                  className="relative w-full max-w-[500px] sm:max-w-[580px] lg:max-w-[650px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-black"
                >
                  <img
                    src={HAPPY_BA_IMAGE}
                    alt="Anh Ba Happy"
                    className="w-full h-full object-cover object-center filter brightness-105 contrast-105"
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {viewState === 'wrong' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-20 w-full h-full flex items-center justify-center p-6 sm:p-10 md:p-14 lg:p-16 bg-black"
        >
          {!wrongPhaseTwo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center text-center space-y-4"
            >
              <h1 className="font-mono text-xl sm:text-2xl md:text-3xl font-semibold text-white tracking-wider drop-shadow-[0_0_20px_rgba(255,255,255,0.7)]">
                Congratulations!
              </h1>
            </motion.div>
          )}

          {wrongPhaseTwo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center max-w-7xl w-full mx-auto"
            >
              <div className="lg:col-span-7 flex flex-col space-y-6 text-left order-2 lg:order-1">
                <motion.h1
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-mono text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-red-500 tracking-wide drop-shadow-[0_0_40px_rgba(239,68,68,0.9)] leading-tight"
                >
                  You're wrong!
                </motion.h1>

                <div className="space-y-4">
                  <p className="font-mono text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-stone-100 drop-shadow">
                    His mom found him. He is cooked.
                  </p>

                  {selectedOption && (
                    <div className="pt-2">
                      <p className="font-mono text-xl sm:text-2xl md:text-3xl lg:text-4xl text-red-400 font-bold drop-shadow leading-relaxed">
                        Son, {selectedOption.label} is located in {selectedOption.location}, not Quang Ngai! 😭
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-3 flex justify-start">
                  <button
                    onClick={handleTryAgain}
                    className="px-4 py-2 rounded-lg bg-stone-900/90 hover:bg-stone-800 text-stone-300 border border-white/20 font-mono text-xs sm:text-sm font-medium flex items-center gap-2 cursor-pointer shadow transition-all hover:scale-105 active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col items-center justify-center order-1 lg:order-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 40 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                  className="relative w-full max-w-[500px] sm:max-w-[580px] lg:max-w-[650px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-black"
                >
                  <img
                    src={DEATH_BA_IMAGE}
                    alt="Anh Ba Caught"
                    className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};
