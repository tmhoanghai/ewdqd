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

interface PersonOrEventItem {
  id: string;
  category: 'FAMOUS PEOPLE' | 'HISTORICAL EVENT' | 'SACRED CEREMONY';
  title: string;
  subtitle: string;
  address: string;
  fullNarrative: string;
  accentColor: string;
  stats: string[];
  images: { src: string; caption: string }[];
}

const ITEMS: PersonOrEventItem[] = [
  {
    id: 'people-1',
    category: 'FAMOUS PEOPLE',
    title: 'Prime Minister Pham Van Dong',
    subtitle: 'Revered Statesman & Prime Minister (1906–2000)',
    address: 'Mo Duc District, Quang Ngai',
    fullNarrative:
      'Looking back through Vietnamese history, on this heroic soil of Quang Ngai, extraordinary leaders rose who dedicated their entire lives to the independence, unity, and intellectual dignity of the nation. Foremost among them was Prime Minister Pham Van Dong, born in Mo Duc District. Serving as Prime Minister for 32 consecutive years (1955–1987), he guided Vietnam through major historic turning points with unwavering statesman integrity, deep diplomatic brilliance, and profound cultural scholarship, inspiring generations of Vietnamese patriots.',
    accentColor: '#fbbf24',
    stats: ['Mo Duc Homeland', '32-Year Prime Minister', 'Statesman & Scholar'],
    images: [
      {
        src: '/assets/images/phamvandong.jfif',
        caption: 'Pham Van Dong (1906 - 2000)'
      }
    ]
  },
  {
    id: 'people-2',
    category: 'FAMOUS PEOPLE',
    title: 'General Truong Dinh',
    subtitle: 'Anti-Colonial Commander & National Hero (1820–1864)',
    address: 'Binh Son District, Quang Ngai',
    fullNarrative:
      'Standing proudly alongside him in Quang Ngai\'s hall of national heroes is General Truong Dinh, born in Binh Son District. When colonial forces invaded Southern Vietnam in the mid-19th century, General Truong Dinh defied the imperial court\'s surrender orders, heeding the unanimous plea of the local people to accept the title "Binh Tay Dai Nguyen So" (Great Commander Fighting the Western Invaders) and leading relentless guerilla resistance from the royal outpost until his heroic final breath in battle.',
    accentColor: '#f59e0b',
    stats: ['Binh Son Homeland', 'Anti-Colonial Commander', 'Hero of the People'],
    images: [
      {
        src: '/assets/images/truongdinh.jfif',
        caption: 'General Truong Dinh (1820 - 1864)'
      }
    ]
  },
  {
    id: 'ceremony-3',
    category: 'SACRED CEREMONY',
    title: 'Le Khao Le The Linh Hoang Sa',
    subtitle: 'Hoang Sa Flotilla Commemoration Festival on Ly Son',
    address: 'Ly Son Island, Quang Ngai',
    fullNarrative:
      'Finally, the sacred maritime spirit of Quang Ngai shines through Le Khao Le The Linh Hoang Sa—a 400-year-old traditional festival preserved with reverence on Ly Son Island. Every spring, island clans gather to conduct solemn rituals with paper boats and human effigies, commemorating the brave sailors of the historical Hoang Sa Flotilla who ventured into treacherous ocean storms under Nguyen Dynasty royal decrees to measure sea routes, erect sovereignty markers, and defend Vietnam\'s sacred island territories.',
    accentColor: '#34d399',
    stats: ['400+ Years Sacred Heritage', 'Hoang Sa Flotilla Sailors', 'Maritime Sovereignty'],
    images: [
      {
        src: '/assets/images/lekhao.jpg',
        caption: 'Le Khao Le The Linh Hoang Sa'
      }
    ]
  }
];

export const IntangibleHeritageSlide: React.FC<Props> = ({
  slide,
  stepIndex = 0,
  onSetStepIndex,
  onRegisterSteps,
  onNextAction,
}) => {
  const totalSteps = 3; // 3 items
  const currentItemIdx = Math.min(stepIndex, 2);
  const showPhotos = true; // Always show photos so text is compact on left

  const currentItem = ITEMS[currentItemIdx];

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
  }, [stepIndex, currentItemIdx]);

  useEffect(() => {
    if (!currentItem) {
      setTypedText('');
      setIsTypingActive(false);
      return;
    }

    const fullText = currentItem.fullNarrative;
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
  }, [currentItemIdx]);

  const bgImage = slide.backgroundImage || '/assets/images/bg4.jpg';

  return (
    <div className="relative w-full h-full text-white overflow-hidden flex flex-col justify-between p-6 sm:p-8 md:p-12">
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Famous People Background"
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
              {currentItemIdx === 2 ? '4.  Historical Events' : '3.  Famous People'}
            </h2>
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500/20 shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
          </div>
        </div>
      </div>

      {/* Main Content Area - Rendered Directly Without Box Containers */}
      <div className="relative z-10 flex-1 my-2 flex flex-col justify-center">
        {currentItem && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center h-full"
            >
              <div className={`${showPhotos ? 'lg:col-span-7' : 'lg:col-span-12'} flex flex-col justify-center space-y-4 transition-all duration-500`}>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-md">
                  {currentItem.title}
                </h3>

                <div className="flex items-center gap-2 text-stone-300 font-medium text-base sm:text-lg md:text-xl font-mono drop-shadow">
                  <span>{currentItem.address}</span>
                </div>

                {/* Clean Typewriter Text without dark box container */}
                <div className="py-2">
                  <p className="font-sans text-lg sm:text-xl md:text-2xl text-stone-100 font-normal leading-relaxed tracking-wide min-h-[140px] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                    {typedText}
                    {isTypingActive && <span className="inline-block w-2.5 h-6 bg-amber-400 ml-1 animate-pulse" />}
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
                  {currentItem.images.map((img, idx) => (
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
