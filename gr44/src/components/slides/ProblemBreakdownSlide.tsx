import React, { useState, useEffect, useRef } from 'react';
import { Slide } from '../../types/presentation';
import { ThemeStyles } from '../ThemeManager';
import { motion, AnimatePresence } from 'motion/react';
import { soundEffects } from '../../utils/soundEffects';

interface Props {
  slide: Slide;
  theme?: ThemeStyles;
  stepIndex?: number;
  onSetStepIndex?: (step: number) => void;
  onRegisterSteps?: (totalSteps: number) => void;
  onNextAction?: () => void;
}

interface SpecialtyDish {
  id: string;
  title: string;
  subtitle: string;
  famousSpot: string;
  fullNarrative: string;
  accentColor: string;
  stats: string[];
  images: { src: string; caption: string }[];
}

const DISHES: SpecialtyDish[] = [
  {
    id: 'dish-1',
    title: 'Don Song Tra (Tra Khuc River Clams)',
    subtitle: 'River Clam Broth & Crispy Rice Paper',
    famousSpot: 'Tra Khuc River Basin',
    fullNarrative:
      'To kick off our culinary adventure into Central Vietnam, nothing captures the soul-soothing gastronomy of Quang Ngai quite like Don Song Tra. Harvested fresh from the silt riverbeds where the Tra Khuc River meets the brackish estuary, these tiny, sweet river clams simmer in a steaming, aromatic broth spiced with chili, garlic, and fresh scallions, best enjoyed by crumbling hot crispy sesame rice paper directly into the bowl for a harmony of savory crunch and rich ocean sweetness.',
    accentColor: '#f59e0b',
    stats: ['Tra Khuc Estuary Clams', 'Crispy Rice Paper', 'Soul-Soothing Broth'],
    images: [
      {
        src: '/assets/images/trakhuc.jpg',
        caption: 'Don Song Tra (Tra Khuc River Clams)'
      }
    ]
  },
  {
    id: 'dish-2',
    title: 'Toi Ly Son (Ly Son Garlic)',
    subtitle: '"Kingdom of Garlic" · Single-Clove Pearl',
    famousSpot: 'Ly Son Island Volcanic Farms',
    fullNarrative:
      'Of course, no journey to Quang Ngai is complete without discovering Toi Ly Son—the world-renowned garlic grown in the "Kingdom of Garlic". Cultivated on nutrient-dense volcanic soil layered with sea coral sand under harsh coastal sunshine, this treasured single-clove "Toi Co Don" garlic is prized nationwide for its mild, sweet aroma, non-pungent crispness, and extraordinary natural medicinal qualities that elevate every local Vietnamese dish.',
    accentColor: '#38bdf8',
    stats: ['Volcanic Coral Sand Soil', 'Single-Clove "Toi Co Don"', 'Medicinal Superfood'],
    images: [
      {
        src: '/assets/images/toilyson.jpg',
        caption: 'Toi Ly Son (Ly Son Garlic)'
      }
    ]
  }
];

export const ProblemBreakdownSlide: React.FC<Props> = ({
  slide,
  stepIndex = 0,
  onSetStepIndex,
  onRegisterSteps,
  onNextAction,
}) => {
  const totalSteps = 2; // 2 dishes
  const currentDishIdx = Math.min(stepIndex, 1);
  const showPhotos = true; // Always show photos so text is compact on left

  const currentDish = DISHES[currentDishIdx];

  const [typedText, setTypedText] = useState('');
  const [isTypingActive, setIsTypingActive] = useState(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (onRegisterSteps) {
      onRegisterSteps(totalSteps);
    }
  }, [onRegisterSteps, totalSteps]);

  useEffect(() => {
    soundEffects.playSlideSound();
  }, [stepIndex, currentDishIdx]);

  useEffect(() => {
    if (!currentDish) {
      setTypedText('');
      setIsTypingActive(false);
      return;
    }

    const fullText = currentDish.fullNarrative;
    setTypedText('');
    setIsTypingActive(true);

    let idx = 0;
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    typingTimerRef.current = setInterval(() => {
      idx++;
      if (idx <= fullText.length) {
        setTypedText(fullText.slice(0, idx));
        if (idx % 3 === 0) {
          soundEffects.playKeyClickSound();
        }
      } else {
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        setIsTypingActive(false);
      }
    }, 14);

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [currentDishIdx]);

  const bgImage = slide.backgroundImage || '/assets/images/bg2.jpg';

  return (
    <div className="relative w-full h-full text-white overflow-hidden flex flex-col justify-between p-6 sm:p-8 md:p-12">
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Local Specialties Background"
          className="w-full h-full object-cover filter brightness-50 contrast-110"
          onError={(e) => {
            e.currentTarget.src = '/assets/images/quangngai.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/75 to-stone-950/90" />
      </div>

      {/* Header - Matching User Screenshot (No frames / boxes) */}
      <div className="relative z-10 flex items-start justify-between pb-2">
        <div className="flex flex-col">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-none mb-1 drop-shadow-lg">
            II.  Body
          </h1>
          <div className="relative inline-block pb-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-400 tracking-wide drop-shadow">
              5.  Local Specialties
            </h2>
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500/20 shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
          </div>
        </div>
      </div>

      {/* Main Content Area - Rendered Directly Without Box Containers */}
      <div className="relative z-10 flex-1 my-2 flex flex-col justify-center">
        {currentDish && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDish.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center h-full"
            >
              <div className={`${showPhotos ? 'lg:col-span-7' : 'lg:col-span-12'} flex flex-col justify-center space-y-4 transition-all duration-500`}>
                <div className="flex items-center gap-3">
                  <span
                    className="text-base sm:text-lg font-mono font-bold tracking-wider uppercase drop-shadow"
                    style={{ color: currentDish.accentColor }}
                  >
                    LOCAL SPECIALTY - QUANG NGAI
                  </span>
                </div>

                <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-md">
                  {currentDish.title}
                </h3>

                <div className="flex items-center gap-2 text-stone-300 font-medium text-base sm:text-lg md:text-xl font-mono drop-shadow">
                  <span>{currentDish.famousSpot}</span>
                </div>

                {/* Clean Typewriter Text without dark box container */}
                <div className="py-2">
                  <p className="font-sans text-lg sm:text-xl md:text-2xl text-stone-100 font-normal leading-relaxed tracking-wide min-h-[140px] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                    {typedText}
                    {isTypingActive && <span className="inline-block w-2.5 h-6 bg-emerald-400 ml-1 animate-pulse" />}
                  </p>
                </div>
              </div>

              {showPhotos && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4"
                >
                  {currentDish.images.map((img, idx) => (
                    <div key={idx} className="group relative rounded-2xl overflow-hidden shadow-2xl bg-stone-900">
                      <img
                        src={img.src}
                        alt={img.caption}
                        className="w-full h-44 sm:h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/images/quangngai.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent flex items-end p-3.5">
                        <p className="text-sm sm:text-base font-semibold text-stone-200 font-sans tracking-wide">
                          {img.caption}
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
