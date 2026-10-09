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

const UNIFIED_FACT_NARRATIVE =
  "In summary, Quang Ngai is a breathtaking coastal destination in South-Central Vietnam, home to over 1.23 million residents. Centered on the scenic Tra Khuc River and powered by Dung Quat—Vietnam's very first oil refinery—this land effortlessly blends natural tranquility with modern vitality.";

const FACT_IMAGES = [
  {
    src: '/assets/images/quangngai.jpg',
    caption: 'Quang Ngai Coastline & Tra Khuc River Basin',
  },
  {
    src: '/assets/images/quangngai.jpg',
    caption: 'Dung Quat Economic Hub & Coastal Territory',
  },
];

export const SolutionArchitectureSlide: React.FC<Props> = ({
  slide,
  stepIndex = 0,
  onSetStepIndex,
  onRegisterSteps,
  onNextAction,
}) => {
  // Facts about Quang Ngai has no photos
  const totalSteps = 1;

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
  }, [stepIndex]);

  useEffect(() => {
    setTypedText('');
    setIsTypingActive(true);

    let idx = 0;
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    typingTimerRef.current = setInterval(() => {
      idx++;
      if (idx <= UNIFIED_FACT_NARRATIVE.length) {
        setTypedText(UNIFIED_FACT_NARRATIVE.slice(0, idx));
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
  }, []);

  const bgImage = slide.backgroundImage || '/assets/images/bg2.jpg';

  return (
    <div className="relative w-full h-full text-white overflow-hidden flex flex-col justify-between p-6 sm:p-8 md:p-12">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Facts Background"
          className="w-full h-full object-cover filter brightness-50 contrast-110"
          onError={(e) => {
            e.currentTarget.src = '/assets/images/quangngai.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/75 to-stone-950/90" />
      </div>

      {/* Header - Matching User Screenshot */}
      <div className="relative z-10 flex items-start justify-between pb-2">
        <div className="flex flex-col">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-none mb-1 drop-shadow-lg">
            II.  Body
          </h1>
          <div className="relative inline-block pb-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-400 tracking-wide drop-shadow">
              1.  Facts
            </h2>
            {/* Glowing yellow line under the sub-kicker */}
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500/20 shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
          </div>
        </div>
      </div>

      {/* Unified Facts Content Area - No photos for Facts about Quang Ngai */}
      <div className="relative z-10 flex-1 my-2 flex flex-col justify-center">
        <div className="flex flex-col justify-center items-start max-w-4xl space-y-6">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-md">
            Facts about Quang Ngai
          </h3>

          {/* Subtitle location indicator */}
          <div className="text-stone-300 font-semibold text-lg sm:text-xl font-mono drop-shadow">
            <span>South-Central Coast, Vietnam</span>
          </div>

          {/* Clean Typewriter Text */}
          <div className="py-1">
            <p className="font-sans text-xl sm:text-2xl md:text-3xl text-stone-100 font-normal leading-relaxed tracking-wide min-h-[140px] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              {typedText}
              {isTypingActive && <span className="inline-block w-2.5 h-6 bg-amber-400 ml-1 animate-pulse" />}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
