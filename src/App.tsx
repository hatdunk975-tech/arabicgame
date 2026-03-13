/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Clock, 
  MapPin, 
  Moon, 
  Sun, 
  Settings, 
  Info,
  Volume2,
  VolumeX,
  Navigation,
  Book,
  Gamepad2,
  Search,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy
} from 'lucide-react';
import { ARABIC_DICTIONARY, Word } from './constants';

// --- Types ---
interface PrayerTime {
  name: string;
  time: string;
  icon: React.ReactNode;
}

type Tab = 'compass' | 'dictionary' | 'game' | 'settings';

// --- Constants ---
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('compass');
  const [heading, setHeading] = useState<number>(0);
  const [qiblaDirection, setQiblaDirection] = useState<number>(0);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Dictionary State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Game State
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [currentQuestion, setCurrentQuestion] = useState<{ word: Word; options: string[] } | null>(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);

  // --- Location & Qibla Calculation ---
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          calculateQibla(latitude, longitude);
        },
        () => {
          calculateQibla(0, 0);
        }
      );
    } else {
      calculateQibla(0, 0);
    }

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Device Orientation ---
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const h = (event as any).webkitCompassHeading || (360 - (event.alpha || 0));
      setHeading(h);
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const calculateQibla = (lat: number, lng: number) => {
    const φ1 = lat * (Math.PI / 180);
    const λ1 = lng * (Math.PI / 180);
    const φ2 = KAABA_LAT * (Math.PI / 180);
    const λ2 = KAABA_LNG * (Math.PI / 180);

    const y = Math.sin(λ2 - λ1);
    const x = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(λ2 - λ1);
    let qibla = Math.atan2(y, x) * (180 / Math.PI);
    qibla = (qibla + 360) % 360;
    setQiblaDirection(qibla);
  };

  const prayerTimes: PrayerTime[] = [
    { name: "Fajr", time: "05:12", icon: <Moon className="w-4 h-4" /> },
    { name: "Sunrise", time: "06:34", icon: <Sun className="w-4 h-4 text-orange-400" /> },
    { name: "Dhuhr", time: "12:28", icon: <Sun className="w-4 h-4 text-yellow-400" /> },
    { name: "Asr", time: "15:45", icon: <Sun className="w-4 h-4 text-amber-500" /> },
    { name: "Maghrib", time: "18:22", icon: <Sun className="w-4 h-4 text-red-400" /> },
    { name: "Isha", time: "19:44", icon: <Moon className="w-4 h-4 text-indigo-400" /> },
  ];

  // --- Dictionary Logic ---
  const filteredWords = useMemo(() => {
    return ARABIC_DICTIONARY.filter(word => {
      const matchesSearch = 
        word.arabic.includes(searchQuery) || 
        word.uzbek.toLowerCase().includes(searchQuery.toLowerCase()) ||
        word.transliteration.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || word.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const categories = useMemo(() => {
    return Array.from(new Set(ARABIC_DICTIONARY.map(w => w.category)));
  }, []);

  // --- Game Logic ---
  const generateQuestion = () => {
    const randomWord = ARABIC_DICTIONARY[Math.floor(Math.random() * ARABIC_DICTIONARY.length)];
    const options = [randomWord.uzbek];
    while (options.length < 4) {
      const option = ARABIC_DICTIONARY[Math.floor(Math.random() * ARABIC_DICTIONARY.length)].uzbek;
      if (!options.includes(option)) options.push(option);
    }
    setCurrentQuestion({
      word: randomWord,
      options: options.sort(() => Math.random() - 0.5)
    });
    setLastAnswerCorrect(null);
  };

  const startGame = () => {
    setScore(0);
    setQuestionCount(0);
    setGameState('playing');
    generateQuestion();
  };

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return;
    const correct = answer === currentQuestion.word.uzbek;
    setLastAnswerCorrect(correct);
    if (correct) setScore(s => s + 1);
    
    setTimeout(() => {
      if (questionCount >= 9) {
        setGameState('result');
      } else {
        setQuestionCount(q => q + 1);
        generateQuestion();
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f2ed] font-serif selection:bg-[#c5a059] selection:text-black overflow-hidden flex flex-col items-center p-4">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#c5a059]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#1a1a1a] blur-[100px] rounded-full border border-[#c5a059]/5" />
      </div>

      <main className="relative z-10 w-full max-w-md flex flex-col gap-6 pb-24">
        {/* Header */}
        <header className="flex justify-between items-center px-2 pt-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-light tracking-widest uppercase text-[#c5a059]">
              {activeTab === 'compass' ? 'Qibla Yo\'nalishi' : activeTab === 'dictionary' ? 'Lug\'at' : 'O\'yin'}
            </h1>
            <div className="flex items-center gap-2 text-[10px] opacity-60 uppercase tracking-tighter">
              <Clock className="w-3 h-3" />
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-full border border-[#c5a059]/20 hover:bg-[#c5a059]/10 transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'compass' && (
            <motion.div 
              key="compass"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-8"
            >
              {/* Compass Section */}
              <section className="relative aspect-square flex items-center justify-center">
                <div className="absolute inset-0 border border-[#c5a059]/20 rounded-full" />
                <div className="absolute inset-4 border border-[#c5a059]/10 rounded-full" />
                
                <motion.div 
                  className="relative w-full h-full flex items-center justify-center"
                  animate={{ rotate: -heading }}
                  transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                >
                  <div className="absolute top-8 font-sans font-bold text-[#c5a059]">SH</div>
                  <div className="absolute bottom-8 font-sans font-bold opacity-40">J</div>
                  <div className="absolute left-8 font-sans font-bold opacity-40">G'</div>
                  <div className="absolute right-8 font-sans font-bold opacity-40">SHQ</div>

                  {[...Array(72)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`absolute h-full w-[1px] ${i % 18 === 0 ? 'bg-[#c5a059]/40' : 'bg-[#c5a059]/10'}`}
                      style={{ transform: `rotate(${i * 5}deg)` }}
                    >
                      <div className={`w-full ${i % 18 === 0 ? 'h-4' : 'h-2'}`} />
                    </div>
                  ))}

                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ rotate: qiblaDirection }}
                  >
                    <div className="relative h-full flex flex-col items-center">
                      <div className="mt-12 flex flex-col items-center">
                        <Navigation className="w-8 h-8 text-[#c5a059] fill-[#c5a059]" />
                        <span className="text-[10px] uppercase tracking-[0.2em] mt-2 font-sans font-bold">Qibla</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                <div className="absolute flex flex-col items-center text-center">
                  <span className="text-4xl font-light tracking-tighter">
                    {Math.round(heading)}°
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.3em] opacity-40 mt-1">
                    Daraja
                  </span>
                </div>
              </section>

              {/* Prayer Times Card */}
              <section className="bg-[#151515] border border-[#c5a059]/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h2 className="text-sm uppercase tracking-widest text-[#c5a059] mb-1">Namoz Vaqtlari</h2>
                    <p className="text-xs opacity-40">Juma, 13 Mart 2026</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-light">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="text-[10px] uppercase tracking-widest opacity-40">Hozirgi Vaqt</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {prayerTimes.map((prayer, idx) => (
                    <div 
                      key={idx}
                      className="flex flex-col items-center p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-[#c5a059]/30 transition-all cursor-pointer group"
                    >
                      <div className="mb-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        {prayer.icon}
                      </div>
                      <span className="text-[10px] uppercase tracking-wider opacity-40 mb-1">{prayer.name}</span>
                      <span className="text-sm font-medium">{prayer.time}</span>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'dictionary' && (
            <motion.div 
              key="dictionary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-4 h-[70vh]"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c5a059]/40" />
                <input 
                  type="text" 
                  placeholder="So'z qidirish..."
                  className="w-full bg-[#151515] border border-[#c5a059]/20 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#c5a059] transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest whitespace-nowrap border transition-all ${!selectedCategory ? 'bg-[#c5a059] text-black border-[#c5a059]' : 'border-[#c5a059]/20 opacity-60'}`}
                >
                  Barchasi
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest whitespace-nowrap border transition-all ${selectedCategory === cat ? 'bg-[#c5a059] text-black border-[#c5a059]' : 'border-[#c5a059]/20 opacity-60'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {filteredWords.map((word, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="bg-[#151515] border border-white/5 p-4 rounded-2xl flex justify-between items-center group hover:border-[#c5a059]/30 transition-all"
                  >
                    <div className="flex flex-col">
                      <span className="text-xl font-medium text-[#c5a059]">{word.arabic}</span>
                      <span className="text-[10px] opacity-40 uppercase tracking-widest">{word.transliteration}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm">{word.uzbek}</span>
                      <div className="text-[8px] uppercase tracking-tighter opacity-20">{word.category}</div>
                    </div>
                  </motion.div>
                ))}
                {filteredWords.length === 0 && (
                  <div className="text-center py-20 opacity-40">
                    <Book className="w-12 h-12 mx-auto mb-4 opacity-10" />
                    <p>So'z topilmadi</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'game' && (
            <motion.div 
              key="game"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col gap-6 items-center justify-center min-h-[60vh]"
            >
              {gameState === 'start' && (
                <div className="text-center flex flex-col items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-[#c5a059]/10 flex items-center justify-center border border-[#c5a059]/20">
                    <Gamepad2 className="w-12 h-12 text-[#c5a059]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-light mb-2">Arab tili testi</h2>
                    <p className="text-sm opacity-40 max-w-[200px] mx-auto">10 ta savol orqali bilimingizni sinab ko'ring</p>
                  </div>
                  <button 
                    onClick={startGame}
                    className="bg-[#c5a059] text-black px-12 py-4 rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                  >
                    Boshlash
                  </button>
                </div>
              )}

              {gameState === 'playing' && currentQuestion && (
                <div className="w-full flex flex-col gap-8">
                  <div className="flex justify-between items-center px-4">
                    <span className="text-[10px] uppercase tracking-widest opacity-40">Savol {questionCount + 1}/10</span>
                    <span className="text-[10px] uppercase tracking-widest text-[#c5a059]">Ball: {score}</span>
                  </div>

                  <div className="bg-[#151515] border border-[#c5a059]/20 rounded-3xl p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                      <motion.div 
                        className="h-full bg-[#c5a059]"
                        initial={{ width: 0 }}
                        animate={{ width: `${(questionCount + 1) * 10}%` }}
                      />
                    </div>
                    <motion.h3 
                      key={currentQuestion.word.arabic}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-5xl font-medium text-[#c5a059] mb-4"
                    >
                      {currentQuestion.word.arabic}
                    </motion.h3>
                    <p className="text-xs opacity-40 uppercase tracking-[0.3em]">{currentQuestion.word.transliteration}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {currentQuestion.options.map((opt, i) => (
                      <button 
                        key={i}
                        onClick={() => handleAnswer(opt)}
                        disabled={lastAnswerCorrect !== null}
                        className={`p-6 rounded-2xl border transition-all text-sm font-medium ${
                          lastAnswerCorrect !== null && opt === currentQuestion.word.uzbek 
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                            : lastAnswerCorrect === false && opt !== currentQuestion.word.uzbek
                            ? 'bg-white/5 border-white/5 opacity-40'
                            : 'bg-white/5 border-white/5 hover:border-[#c5a059]/40'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  <div className="h-12 flex items-center justify-center">
                    {lastAnswerCorrect === true && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-xs uppercase tracking-widest">To'g'ri!</span>
                      </motion.div>
                    )}
                    {lastAnswerCorrect === false && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-rose-400">
                        <XCircle className="w-5 h-5" />
                        <span className="text-xs uppercase tracking-widest">Xato</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {gameState === 'result' && (
                <div className="text-center flex flex-col items-center gap-8">
                  <div className="relative">
                    <Trophy className="w-24 h-24 text-[#c5a059] opacity-20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-light">{score}/10</span>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-light mb-2">Natija</h2>
                    <p className="text-sm opacity-40">
                      {score === 10 ? 'Ajoyib! Mukammal natija!' : score > 7 ? 'Yaxshi natija!' : 'Yana harakat qiling!'}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={startGame}
                      className="bg-[#c5a059] text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" /> Qayta
                    </button>
                    <button 
                      onClick={() => setActiveTab('dictionary')}
                      className="border border-[#c5a059]/40 px-8 py-3 rounded-full font-bold uppercase tracking-widest"
                    >
                      Lug'at
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Quote */}
        <footer className="text-center px-8 opacity-40 mt-8">
          <p className="text-sm italic leading-relaxed">
            "Darhaqiqat, Biz sening yuzingni osmon tomon tez-tez burilayotganini ko'ryapmiz. Endi seni o'zing rozi bo'ladigan qiblaga buramiz."
          </p>
          <p className="text-[10px] uppercase tracking-widest mt-4">Baqara surasi, 144-oyat</p>
        </footer>
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#1a1a1a]/80 backdrop-blur-md border border-[#c5a059]/20 rounded-full px-6 py-3 flex gap-8 shadow-2xl z-50">
        <button 
          onClick={() => setActiveTab('compass')}
          className={`transition-all ${activeTab === 'compass' ? 'text-[#c5a059]' : 'opacity-40 hover:opacity-100'}`}
        >
          <Compass className="w-6 h-6" />
        </button>
        <button 
          onClick={() => setActiveTab('dictionary')}
          className={`transition-all ${activeTab === 'dictionary' ? 'text-[#c5a059]' : 'opacity-40 hover:opacity-100'}`}
        >
          <Book className="w-6 h-6" />
        </button>
        <button 
          onClick={() => setActiveTab('game')}
          className={`transition-all ${activeTab === 'game' ? 'text-[#c5a059]' : 'opacity-40 hover:opacity-100'}`}
        >
          <Gamepad2 className="w-6 h-6" />
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`transition-all ${activeTab === 'settings' ? 'text-[#c5a059]' : 'opacity-40 hover:opacity-100'}`}
        >
          <Settings className="w-6 h-6" />
        </button>
      </nav>
    </div>
  );
}
