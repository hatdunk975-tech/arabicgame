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
  Trophy,
  Type,
  Hash,
  BookOpen,
  Mic,
  MicOff
} from 'lucide-react';
import { ARABIC_DICTIONARY, Word, ARABIC_ALPHABET, ARABIC_NUMBERS, QURAN_SURAHS } from './constants';

// --- Types ---
interface PrayerTime {
  name: string;
  time: string;
  icon: React.ReactNode;
}

type Tab = 'compass' | 'dictionary' | 'game' | 'learn' | 'quran' | 'settings';
type GameType = 'vocabulary' | 'letters' | 'numbers';

interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: {
    number: number;
    text: string;
    numberInSurah: number;
    juz: number;
    manzil: number;
    page: number;
    ruku: number;
    hizbQuarter: number;
  }[];
}

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

  // Learn State
  const [learnSubTab, setLearnSubTab] = useState<'letters' | 'numbers'>('letters');

  // Quran State
  const [quranSearch, setQuranSearch] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [surahDetail, setSurahDetail] = useState<SurahDetail | null>(null);
  const [loadingSurah, setLoadingSurah] = useState(false);

  // Game State
  const [gameType, setGameType] = useState<GameType>('vocabulary');
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [currentQuestion, setCurrentQuestion] = useState<{ word: Word; options: string[] } | null>(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);

  // Audio State
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.8;
      
      utterance.onstart = () => setSpeakingText(text);
      utterance.onend = () => setSpeakingText(null);
      utterance.onerror = () => setSpeakingText(null);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const listen = (onResult: (text: string) => void) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA'; // Default to Arabic, but can be changed
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };

      recognition.start();
    } else {
      alert("Sizning brauzeringiz ovozli qidiruvni qo'llab-quvvatlamaydi.");
    }
  };

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

  // --- Quran Logic ---
  const fetchSurahDetail = async (id: number) => {
    setLoadingSurah(true);
    setSelectedSurah(id);
    try {
      const response = await fetch(`https://api.alquran.cloud/v1/surah/${id}`);
      const data = await response.json();
      if (data.code === 200) {
        setSurahDetail(data.data);
      }
    } catch (error) {
      console.error("Error fetching surah:", error);
    } finally {
      setLoadingSurah(false);
    }
  };

  // --- Game Logic ---
  const generateQuestion = () => {
    let question: any = null;
    let options: string[] = [];

    if (gameType === 'vocabulary') {
      const randomWord = ARABIC_DICTIONARY[Math.floor(Math.random() * ARABIC_DICTIONARY.length)];
      options = [randomWord.uzbek];
      while (options.length < 4) {
        const option = ARABIC_DICTIONARY[Math.floor(Math.random() * ARABIC_DICTIONARY.length)].uzbek;
        if (!options.includes(option)) options.push(option);
      }
      question = { word: randomWord, options: options.sort(() => Math.random() - 0.5) };
    } else if (gameType === 'letters') {
      const randomLetter = ARABIC_ALPHABET[Math.floor(Math.random() * ARABIC_ALPHABET.length)];
      options = [randomLetter.name];
      while (options.length < 4) {
        const option = ARABIC_ALPHABET[Math.floor(Math.random() * ARABIC_ALPHABET.length)].name;
        if (!options.includes(option)) options.push(option);
      }
      question = { word: { arabic: randomLetter.char, transliteration: randomLetter.name, uzbek: randomLetter.name, category: 'Harf' }, options: options.sort(() => Math.random() - 0.5) };
    } else if (gameType === 'numbers') {
      const randomNumber = ARABIC_NUMBERS[Math.floor(Math.random() * ARABIC_NUMBERS.length)];
      options = [randomNumber.name];
      while (options.length < 4) {
        const option = ARABIC_NUMBERS[Math.floor(Math.random() * ARABIC_NUMBERS.length)].name;
        if (!options.includes(option)) options.push(option);
      }
      question = { word: { arabic: randomNumber.char, transliteration: randomNumber.name, uzbek: randomNumber.name, category: 'Son' }, options: options.sort(() => Math.random() - 0.5) };
    }

    setCurrentQuestion(question);
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
      {/* Listening Overlay */}
      <AnimatePresence>
        {isListening && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-8"
          >
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-[#c5a059] rounded-full blur-3xl"
              />
              <div className="relative w-32 h-32 rounded-full bg-[#c5a059] flex items-center justify-center shadow-[0_0_50px_rgba(197,160,89,0.5)]">
                <Mic className="w-16 h-16 text-black" />
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#c5a059] mb-2">Eshityapman...</h2>
              <p className="text-white/60 uppercase tracking-widest text-xs">Gapiring</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
              {activeTab === 'compass' ? 'Qibla Yo\'nalishi' : 
               activeTab === 'dictionary' ? 'Lug\'at' : 
               activeTab === 'learn' ? 'O\'rganish' :
               activeTab === 'quran' ? 'Qur\'on' :
               'O\'yin'}
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
                        <Navigation className="w-8 h-8 text-[#c5a059] fill-[#c5a059] drop-shadow-[0_0_15px_rgba(197,160,89,0.8)]" />
                        <span className="text-[10px] uppercase tracking-[0.2em] mt-2 font-sans font-bold text-[#c5a059]">Qibla</span>
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
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c5a059]/40" />
                  <input 
                    type="text" 
                    placeholder="So'z qidirish..."
                    className="w-full bg-[#151515] border border-[#c5a059]/20 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#c5a059] transition-colors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => listen(setSearchQuery)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${isListening ? 'bg-[#c5a059] text-black border-[#c5a059] animate-pulse' : 'bg-[#151515] border-[#c5a059]/20 text-[#c5a059] hover:border-[#c5a059]'}`}
                >
                  <Mic className="w-5 h-5" />
                </button>
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
                    onClick={() => speak(word.arabic)}
                    className={`bg-[#151515] border p-4 rounded-2xl flex justify-between items-center group transition-all cursor-pointer ${speakingText === word.arabic ? 'border-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.2)]' : 'border-white/5 hover:border-[#c5a059]/30'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${speakingText === word.arabic ? 'bg-[#c5a059] text-black' : 'bg-[#c5a059]/10 text-[#c5a059] group-hover:bg-[#c5a059]/20'}`}>
                        <Volume2 className={`w-4 h-4 ${speakingText === word.arabic ? 'animate-pulse' : ''}`} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xl font-medium text-[#c5a059]">{word.arabic}</span>
                        <span className="text-[10px] opacity-40 uppercase tracking-widest">{word.transliteration}</span>
                      </div>
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

          {activeTab === 'learn' && (
            <motion.div 
              key="learn"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col gap-6"
            >
              <div className="flex gap-2 p-1 bg-[#151515] rounded-2xl border border-white/5">
                <button 
                  onClick={() => setLearnSubTab('letters')}
                  className={`flex-1 py-3 rounded-xl text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${learnSubTab === 'letters' ? 'bg-[#c5a059] text-black font-bold' : 'opacity-40'}`}
                >
                  <Type className="w-4 h-4" /> Harflar
                </button>
                <button 
                  onClick={() => setLearnSubTab('numbers')}
                  className={`flex-1 py-3 rounded-xl text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${learnSubTab === 'numbers' ? 'bg-[#c5a059] text-black font-bold' : 'opacity-40'}`}
                >
                  <Hash className="w-4 h-4" /> Sonlar
                </button>
              </div>

              <div className="flex justify-between items-center px-2">
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#c5a059]/60">
                  {learnSubTab === 'letters' ? 'Alifbo' : 'Raqamlar'}
                </h3>
                <button 
                  onClick={() => {
                    setGameType(learnSubTab === 'letters' ? 'letters' : 'numbers');
                    setActiveTab('game');
                    startGame();
                  }}
                  className="flex items-center gap-2 text-[10px] uppercase tracking-widest bg-[#c5a059]/10 text-[#c5a059] px-4 py-2 rounded-full border border-[#c5a059]/20 hover:bg-[#c5a059] hover:text-black transition-all"
                >
                  <Gamepad2 className="w-3 h-3" /> Mashq qilish
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {learnSubTab === 'letters' ? (
                  ARABIC_ALPHABET.map((item, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.01 }}
                        whileHover={{ scale: 1.05, translateY: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => speak(item.char)}
                        className={`aspect-[4/5] bg-gradient-to-b from-[#1a1a1a] to-[#151515] border rounded-[2rem] flex flex-col items-center justify-center gap-3 group transition-all cursor-pointer shadow-xl relative overflow-hidden ${speakingText === item.char ? 'border-[#c5a059] shadow-[0_0_20px_rgba(197,160,89,0.3)]' : 'border-white/5 hover:border-[#c5a059]/40'}`}
                      >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c5a059]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <motion.span 
                          layoutId={`letter-${item.char}`}
                          className={`text-4xl transition-all ${speakingText === item.char ? 'text-[#f5f2ed] scale-110' : 'text-[#c5a059]'} drop-shadow-[0_0_10px_rgba(197,160,89,0.3)]`}
                        >
                          {item.char}
                        </motion.span>
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#f5f2ed]">{item.name}</span>
                          <div className={`mt-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${speakingText === item.char ? 'bg-[#c5a059] text-black' : 'bg-white/5 group-hover:bg-[#c5a059]/20'}`}>
                            <Volume2 className={`w-4 h-4 ${speakingText === item.char ? 'animate-pulse' : 'text-[#c5a059]/40 group-hover:text-[#c5a059]'}`} />
                          </div>
                        </div>
                      </motion.div>
                  ))
                ) : (
                  ARABIC_NUMBERS.map((item, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.01 }}
                      whileHover={{ scale: 1.05, translateY: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => speak(item.char)}
                      className={`aspect-[4/5] bg-gradient-to-b from-[#1a1a1a] to-[#151515] border rounded-[2rem] flex flex-col items-center justify-center gap-3 group transition-all cursor-pointer shadow-xl relative overflow-hidden ${speakingText === item.char ? 'border-[#c5a059] shadow-[0_0_20px_rgba(197,160,89,0.3)]' : 'border-white/5 hover:border-[#c5a059]/40'}`}
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c5a059]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <motion.span 
                        layoutId={`number-${item.char}`}
                        className={`text-4xl transition-all ${speakingText === item.char ? 'text-[#f5f2ed] scale-110' : 'text-[#c5a059]'} drop-shadow-[0_0_10px_rgba(197,160,89,0.3)]`}
                      >
                        {item.char}
                      </motion.span>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#f5f2ed]">{item.name}</span>
                        <span className="text-[8px] opacity-40 mt-1">Qiymati: {item.val}</span>
                        <div className={`mt-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${speakingText === item.char ? 'bg-[#c5a059] text-black' : 'bg-white/5 group-hover:bg-[#c5a059]/20'}`}>
                          <Volume2 className={`w-4 h-4 ${speakingText === item.char ? 'animate-pulse' : 'text-[#c5a059]/40 group-hover:text-[#c5a059]'}`} />
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'quran' && (
            <motion.div 
              key="quran"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-4 h-[70vh]"
            >
              {!selectedSurah ? (
                <>
                  <div className="relative flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c5a059]/40" />
                      <input 
                        type="text" 
                        placeholder="Surani qidirish..."
                        className="w-full bg-[#151515] border border-[#c5a059]/20 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#c5a059] transition-colors"
                        value={quranSearch}
                        onChange={(e) => setQuranSearch(e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={() => listen(setQuranSearch)}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${isListening ? 'bg-[#c5a059] text-black border-[#c5a059] animate-pulse' : 'bg-[#151515] border-[#c5a059]/20 text-[#c5a059] hover:border-[#c5a059]'}`}
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                    {QURAN_SURAHS.filter(s => s.name.toLowerCase().includes(quranSearch.toLowerCase()) || s.arabic.includes(quranSearch)).map((surah) => (
                      <motion.div 
                        key={surah.id}
                        onClick={() => fetchSurahDetail(surah.id)}
                        className="bg-[#151515] border border-white/5 p-4 rounded-2xl flex justify-between items-center group hover:border-[#c5a059]/30 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center text-[10px] font-bold text-[#c5a059]">
                            {surah.id}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{surah.name}</span>
                            <span className="text-[8px] opacity-40 uppercase tracking-widest">{surah.verses} oyat • {surah.type}</span>
                          </div>
                        </div>
                        <span className="text-xl font-medium text-[#c5a059]">{surah.arabic}</span>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col h-full relative">
                  {/* Sticky Header */}
                  <div className="sticky top-0 z-20 bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-[#c5a059]/10 pb-4 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <button 
                        onClick={() => { setSelectedSurah(null); setSurahDetail(null); }}
                        className="flex items-center gap-2 text-[#c5a059] text-[10px] uppercase tracking-[0.2em] font-bold bg-[#c5a059]/10 px-4 py-2 rounded-full border border-[#c5a059]/20 hover:bg-[#c5a059] hover:text-black transition-all"
                      >
                        <RotateCcw className="w-3 h-3" /> Orqaga
                      </button>
                      {surahDetail && (
                        <div className="text-right">
                          <h2 className="text-lg text-[#c5a059] font-serif leading-none">{surahDetail.name}</h2>
                          <p className="text-[8px] opacity-40 uppercase tracking-widest mt-1">{surahDetail.numberOfAyahs} OYAT • {surahDetail.revelationType}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {loadingSurah ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="w-12 h-12 border-4 border-[#c5a059]/20 border-t-[#c5a059] rounded-full animate-spin" />
                    </div>
                  ) : surahDetail ? (
                    <div className="flex-1 overflow-y-auto pr-2 space-y-8 scrollbar-hide">
                      <div className="text-center p-12 bg-gradient-to-br from-[#1a1a1a] to-[#151515] rounded-[3rem] border border-[#c5a059]/20 shadow-2xl relative overflow-hidden mb-8">
                        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-20" />
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a059]/60 mb-4 block">Surah</span>
                        <h2 className="text-5xl text-[#c5a059] mb-4 font-serif">{surahDetail.name}</h2>
                        <p className="text-sm opacity-60 tracking-[0.2em] uppercase">{surahDetail.englishName} • {surahDetail.englishNameTranslation}</p>
                        <div className="mt-8 h-[1px] w-32 mx-auto bg-gradient-to-r from-transparent via-[#c5a059]/40 to-transparent" />
                      </div>

                      {surahDetail.number !== 1 && surahDetail.number !== 9 && (
                        <div className="text-center py-10">
                          <p className="text-4xl text-[#c5a059] font-serif drop-shadow-lg">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                        </div>
                      )}

                      <div 
                        dir="rtl" 
                        className="pb-24 text-right leading-[2.8] font-serif"
                      >
                        {surahDetail.ayahs.map((ayah, index) => (
                          <motion.span
                            key={ayah.number}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.02 }}
                            onClick={() => speak(ayah.text)}
                            className={`inline cursor-pointer transition-all duration-500 text-4xl ${speakingText === ayah.text ? 'text-[#c5a059] bg-[#c5a059]/10 rounded-xl px-2 shadow-[0_0_20px_rgba(197,160,89,0.1)]' : 'text-[#f5f2ed] hover:text-[#c5a059]/60'}`}
                          >
                            {ayah.text}
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#c5a059]/30 text-[10px] mx-3 align-middle text-[#c5a059]/60 font-sans select-none bg-[#c5a059]/5">
                              {ayah.numberInSurah}
                            </span>
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20 opacity-40">Xatolik yuz berdi</div>
                  )}
                </div>
              )}
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
                    <h2 className="text-2xl font-light mb-2">O'yin turini tanlang</h2>
                    <p className="text-sm opacity-40 max-w-[200px] mx-auto">Bilimingizni sinab ko'ring</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 w-full max-w-[240px]">
                    <button 
                      onClick={() => { setGameType('vocabulary'); startGame(); }}
                      className="bg-[#151515] border border-[#c5a059]/20 text-[#c5a059] py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-[#c5a059] hover:text-black transition-all flex items-center justify-center gap-3"
                    >
                      <Book className="w-5 h-5" /> Lug'at
                    </button>
                    <button 
                      onClick={() => { setGameType('letters'); startGame(); }}
                      className="bg-[#151515] border border-[#c5a059]/20 text-[#c5a059] py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-[#c5a059] hover:text-black transition-all flex items-center justify-center gap-3"
                    >
                      <Type className="w-5 h-5" /> Harflar
                    </button>
                    <button 
                      onClick={() => { setGameType('numbers'); startGame(); }}
                      className="bg-[#151515] border border-[#c5a059]/20 text-[#c5a059] py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-[#c5a059] hover:text-black transition-all flex items-center justify-center gap-3"
                    >
                      <Hash className="w-5 h-5" /> Sonlar
                    </button>
                  </div>
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
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#1a1a1a]/80 backdrop-blur-md border border-[#c5a059]/20 rounded-full px-6 py-3 flex gap-6 shadow-2xl z-50">
        <button 
          onClick={() => setActiveTab('compass')}
          className={`transition-all ${activeTab === 'compass' ? 'text-[#c5a059]' : 'opacity-40 hover:opacity-100'}`}
        >
          <Compass className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setActiveTab('dictionary')}
          className={`transition-all ${activeTab === 'dictionary' ? 'text-[#c5a059]' : 'opacity-40 hover:opacity-100'}`}
        >
          <Book className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setActiveTab('learn')}
          className={`transition-all ${activeTab === 'learn' ? 'text-[#c5a059]' : 'opacity-40 hover:opacity-100'}`}
        >
          <Type className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setActiveTab('quran')}
          className={`transition-all ${activeTab === 'quran' ? 'text-[#c5a059]' : 'opacity-40 hover:opacity-100'}`}
        >
          <BookOpen className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setActiveTab('game')}
          className={`transition-all ${activeTab === 'game' ? 'text-[#c5a059]' : 'opacity-40 hover:opacity-100'}`}
        >
          <Gamepad2 className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`transition-all ${activeTab === 'settings' ? 'text-[#c5a059]' : 'opacity-40 hover:opacity-100'}`}
        >
          <Settings className="w-5 h-5" />
        </button>
      </nav>
    </div>
  );
}
