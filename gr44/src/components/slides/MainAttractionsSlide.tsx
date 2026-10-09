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

interface AttractionItem {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  blogNarrative: string;
  accentColor: string;
  stats: string[];
  images: { src: string; caption: string }[];
}

const ATTRACTIONS_DATA: AttractionItem[] = [
  {
    id: 'attraction-1',
    title: 'Ly Son Island & To Vo Lava Gate',
    subtitle: 'Where to Go & What to Do',
    location: 'Ly Son Island District, Quang Ngai',
    blogNarrative:
      'Board the high-speed morning ferry across the emerald waters of the East Sea to reach Ly Son Island—a breathtaking volcanic archipelago formed from five prehistoric submarine craters millions of years ago! Begin your morning at To Vo Lava Gate, a magnificent natural arch forged from jet-black volcanic basalt jutting gracefully into crystal-clear turquoise waves, creating the ultimate backdrop for capturing unforgettable sunrise photos. Next, hop on a wooden boat to Be Island to dive into vibrant marine life, snorkel through kaleidoscopic coral gardens, ascend the dramatic volcanic crater rim of Thoi Loi Mountain for panoramic coastal vistas, and cycle past lush green garlic fields meticulously cultivated in volcanic sand and sea coral.',
    accentColor: '#38bdf8',
    stats: ['High-Speed Island Ferry', 'Sunrise at To Vo Lava Arch', 'Snorkel Be Island Coral', 'Volcanic Thoi Loi Summit'],
    images: [
      {
        src: '/assets/images/lavagate.jfif',
        caption: 'To Vo Lava Gate (Cong To Vo)'
      },
      {
        src: '/assets/images/daolyson.jfif',
        caption: 'Ly Son Island (Dao Ly Son)'
      }
    ]
  },
  {
    id: 'attraction-2',
    title: 'Thien An Mountain & Ancient Pagoda',
    subtitle: 'Where to Go & What to Do',
    location: 'Quang Ngai City',
    blogNarrative:
      'Ascend the sacred, winding pine-forested slopes of Thien An Mountain, rising majestically 106 meters above the lush Tra Khuc River plains! Wander through the tranquil, centuries-old mossy courtyards of the 1695 Thien An Pagoda, taste cool, crystal-clear sacred spring water from Gieng Tien (the mythical Fairy Well cut deep into volcanic bedrock), and pay solemn respects at the tomb of patriot Huynh Thuc Khang. As dusk falls, gaze out across the vast horizon to witness the golden sunset reflecting across the winding Tra Khuc River while the ancient bronze pagoda bell resonates peacefully over the surrounding countryside.',
    accentColor: '#34d399',
    stats: ['Hike 106m Sacred Summit', 'Explore 1695 Ancient Pagoda', 'Gieng Tien Mythical Fairy Well', 'Sunset Over Tra Khuc River'],
    images: [
      {
        src: '/assets/images/thienan.jfif',
        caption: 'Thien An Pagoda (Chua Thien An)'
      },
      {
        src: '/assets/images/nuithienan.jpg',
        caption: 'Thien An Mountain (Nui Thien An)'
      }
    ]
  }
];

export const MainAttractionsSlide: React.FC<Props> = ({
  slide,
  stepIndex = 0,
  onSetStepIndex,
  onRegisterSteps,
  onNextAction,
}) => {
  const totalSteps = 2; // 2 attractions
  const currentItemIdx = Math.min(stepIndex, 1);
  const showPhotos = true; // Always show photos so text is compact on left

  const currentItem = ATTRACTIONS_DATA[currentItemIdx];

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

    const fullText = currentItem.blogNarrative;
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

  const bgImage = slide.backgroundImage || '/assets/images/bg3.jpg';

  return (
    <div className="relative w-full h-full text-white overflow-hidden flex flex-col justify-between p-6 sm:p-8 md:p-12">
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Main Attractions Background"
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
              2.  Main Attractions
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
                  <span>{currentItem.location}</span>
                </div>

                {/* Clean Typewriter Text without dark box container */}
                <div className="py-2">
                  <p className="font-sans text-lg sm:text-xl md:text-2xl text-stone-100 font-normal leading-relaxed tracking-wide min-h-[140px] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                    {typedText}
                    {isTypingActive && <span className="inline-block w-2.5 h-6 bg-sky-400 ml-1 animate-pulse" />}
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
