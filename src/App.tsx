/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ORGAN_DATA,
  QUIZ_DATA,
  Organ,
} from './data/respiratoryData';
import { AnatomicalDiagram } from './components/AnatomicalDiagram';
import { NoticeModal } from './components/NoticeModal';
import { sound } from './utils/sound';
import { fireCelebrationConfetti } from './utils/confetti';
import {
  Home,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Volume2,
  VolumeX,
  Trophy,
  ExternalLink,
  Target,
  Sparkles,
  Play,
  Volume1,
} from 'lucide-react';

export default function App() {
  // Screen state (1 to 7)
  const [currentScreen, setCurrentScreen] = useState<number>(1);

  // Sound enabled
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Modal alert
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  // Screen 4: Matching game state
  const [shuffledPalette, setShuffledPalette] = useState<Organ[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [matchingAnswers, setMatchingAnswers] = useState<Record<number, number>>({});
  const [matchingChecked, setMatchingChecked] = useState<boolean>(false);
  const [matchingScore, setMatchingScore] = useState<number>(0);

  // Screen 6: Quiz state
  const [quizIdx, setQuizIdx] = useState<number>(1); // 1, 2, 3
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizChecked, setQuizChecked] = useState<Record<number, boolean>>({});

  // Initialize shuffled cards on load
  useEffect(() => {
    shuffleCards();
  }, []);

  const shuffleCards = () => {
    const list = [...ORGAN_DATA].sort(() => Math.random() - 0.5);
    setShuffledPalette(list);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    if (next) sound.playPop();
  };

  const goToScreen = (screenNum: number) => {
    sound.playPop();
    setCurrentScreen(screenNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Matching game interactions
  const handleCardTap = (organId: number) => {
    sound.playPop();
    if (selectedCardId === organId) {
      setSelectedCardId(null);
    } else {
      setSelectedCardId(organId);
    }
  };

  const handleZoneClick = (zoneId: number) => {
    if (selectedCardId !== null) {
      assignCardToZone(selectedCardId, zoneId);
      setSelectedCardId(null);
    } else if (matchingAnswers[zoneId]) {
      returnCardToPalette(matchingAnswers[zoneId]);
    }
  };

  const assignCardToZone = (organId: number, zoneId: number) => {
    sound.playPop();
    const nextAnswers = { ...matchingAnswers };

    // If this organ was already in another zone, clear it
    Object.keys(nextAnswers).forEach((zKey) => {
      const z = parseInt(zKey, 10);
      if (nextAnswers[z] === organId) {
        delete nextAnswers[z];
      }
    });

    nextAnswers[zoneId] = organId;
    setMatchingAnswers(nextAnswers);

    if (matchingChecked) {
      setMatchingChecked(false);
    }
  };

  const returnCardToPalette = (organId: number) => {
    sound.playPop();
    const nextAnswers = { ...matchingAnswers };
    Object.keys(nextAnswers).forEach((zKey) => {
      const z = parseInt(zKey, 10);
      if (nextAnswers[z] === organId) {
        delete nextAnswers[z];
      }
    });
    setMatchingAnswers(nextAnswers);
    setSelectedCardId(null);

    if (matchingChecked) {
      setMatchingChecked(false);
    }
  };

  const checkMatching = () => {
    let correctCount = 0;
    ORGAN_DATA.forEach((organ) => {
      if (matchingAnswers[organ.id] === organ.id) {
        correctCount++;
      }
    });

    setMatchingScore(correctCount);
    setMatchingChecked(true);

    if (correctCount === 7) {
      sound.playVictory();
      fireCelebrationConfetti();
    } else if (correctCount >= 4) {
      sound.playCorrect();
    } else {
      sound.playWrong();
    }
  };

  const showCorrectAnswers = () => {
    sound.playPop();
    const fullAnswers: Record<number, number> = {};
    ORGAN_DATA.forEach((organ) => {
      fullAnswers[organ.id] = organ.id;
    });
    setMatchingAnswers(fullAnswers);
    setMatchingScore(7);
    setMatchingChecked(true);
    setSelectedCardId(null);
    sound.playCorrect();
  };

  const resetMatchingGame = () => {
    sound.playPop();
    setMatchingAnswers({});
    setMatchingScore(0);
    setMatchingChecked(false);
    setSelectedCardId(null);
    shuffleCards();
  };

  // Quiz interactions
  const handleSelectQuizOption = (qId: number, optionLabel: string) => {
    if (quizChecked[qId]) return;
    sound.playPop();
    setQuizAnswers((prev) => ({ ...prev, [qId]: optionLabel }));
  };

  const checkQuizCurrent = () => {
    const qData = QUIZ_DATA.find((q) => q.id === quizIdx);
    if (!qData) return;

    const chosen = quizAnswers[quizIdx];
    if (!chosen) {
      sound.playWrong();
      setModalState({
        isOpen: true,
        title: 'Perhatian',
        message: 'Sila pilih satu jawapan sebelum menyemak!',
      });
      return;
    }

    setQuizChecked((prev) => ({ ...prev, [quizIdx]: true }));

    if (chosen === qData.correct) {
      sound.playCorrect();
    } else {
      sound.playWrong();
    }
  };

  const nextQuiz = () => {
    sound.playPop();
    if (quizIdx < 3) {
      setQuizIdx((prev) => prev + 1);
    }
  };

  const resetQuizGame = () => {
    sound.playPop();
    setQuizIdx(1);
    setQuizAnswers({});
    setQuizChecked({});
  };

  const resetAll = () => {
    resetMatchingGame();
    resetQuizGame();
    goToScreen(1);
  };

  // Text to Speech helper for Screen 5
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ms-MY';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Calculations for summary screen
  const quizScore = QUIZ_DATA.reduce((acc, q) => {
    return acc + (quizAnswers[q.id] === q.correct ? 1 : 0);
  }, 0);
  const totalScore = matchingScore + quizScore;

  // Unplaced cards in palette
  const placedOrganIds = new Set(Object.values(matchingAnswers));
  const unplacedCards = shuffledPalette.filter((c) => !placedOrganIds.has(c.id));

  return (
    <div className="relative min-h-screen text-slate-800 pb-12 overflow-x-hidden">
      {/* Top Floating Controls */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-white/60 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🫁</span>
            <span className="font-fredoka font-bold text-sm sm:text-base text-slate-800">
              Sains Tahun 4: Sistem Pernafasan
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Steps indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-fredoka mr-2 bg-slate-100/80 px-3 py-1 rounded-full text-slate-600">
              <span>Misi {currentScreen}/7</span>
            </div>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className="p-2 rounded-full bg-white hover:bg-slate-100 text-slate-700 shadow-xs border border-slate-200 transition"
              title={soundEnabled ? 'Matikan Bunyi' : 'Hidupkan Bunyi'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-teal-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Decorative animated bubbles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-12 left-6 w-16 h-16 bg-blue-300/30 rounded-full blur-xl animate-float" />
        <div className="absolute top-1/3 right-10 w-28 h-28 bg-pink-300/30 rounded-full blur-xl animate-float-delayed" />
        <div className="absolute bottom-16 left-1/4 w-24 h-24 bg-yellow-300/30 rounded-full blur-xl animate-float" />
        <div className="absolute top-14 left-16 text-3xl opacity-25 animate-float select-none">☁️</div>
        <div className="absolute top-1/4 right-20 text-3xl opacity-25 animate-float-delayed select-none">✨</div>
        <div className="absolute bottom-24 right-16 text-3xl opacity-25 animate-float select-none">🎈</div>
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-6">
        {/* =========================================================
            SKRIN 1: HALAMAN UTAMA (COVER PAGE)
            ========================================================= */}
        {currentScreen === 1 && (
          <section className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-xl border border-white/60 text-center relative overflow-hidden transition-all duration-300">
            <div className="inline-block px-4 py-1.5 bg-sky-100 text-sky-800 font-bold rounded-full text-xs sm:text-sm mb-4 tracking-wide font-fredoka uppercase shadow-xs">
              Sains Tahun 4 (KSSR Semakan)
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0A2540] font-fredoka leading-tight mb-4">
              AKTIVITI 1: PADANKAN ORGAN PERNAFASAN 🫁
            </h1>

            <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Selamat datang, detektif cilik sains! 🔎 Mari kita terokai sistem pernafasan manusia
              dan kenali organ yang membantu kita bernafas. Padankan setiap organ pada kedudukan
              yang betul dan kumpulkan markah untuk membuktikan kemahiran sains anda!
            </p>

            {/* Central Animated Breathing Logo */}
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 mx-auto mb-8 animate-breathing">
              {/* Outer Soft Glow Rings */}
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-300/40 via-teal-200/40 to-pink-300/40 rounded-full blur-lg transform scale-105" />

              {/* Inner Badge Container */}
              <div className="relative w-full h-full bg-gradient-to-br from-white via-sky-50 to-pink-50 rounded-full p-4 shadow-xl border-4 border-white flex flex-col items-center justify-center text-center">
                {/* Anatomical Vector Graphic */}
                <svg
                  className="w-36 h-36 sm:w-44 sm:h-44 drop-shadow-md"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="logoLungGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF7B9C" />
                      <stop offset="100%" stopColor="#FF4D6D" />
                    </linearGradient>
                    <linearGradient id="logoTracheaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="100%" stopColor="#0284C7" />
                    </linearGradient>
                  </defs>

                  <circle cx="28" cy="40" r="4" fill="#FBBF24" />
                  <circle cx="175" cy="50" r="3" fill="#38BDF8" />
                  <circle cx="165" cy="150" r="4" fill="#F472B6" />

                  {/* Trachea tube */}
                  <path
                    d="M100 22 C125 22 135 38 128 50 C122 60 108 62 100 64 L100 95"
                    stroke="url(#logoTracheaGrad)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <path
                    d="M100 25 L100 95"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    strokeDasharray="3 4"
                    strokeLinecap="round"
                  />

                  <rect x="94" y="65" width="12" height="35" rx="6" fill="url(#logoTracheaGrad)" />
                  <line x1="94" y1="72" x2="106" y2="72" stroke="#E0F2FE" strokeWidth="2" />
                  <line x1="94" y1="80" x2="106" y2="80" stroke="#E0F2FE" strokeWidth="2" />
                  <line x1="94" y1="88" x2="106" y2="88" stroke="#E0F2FE" strokeWidth="2" />

                  {/* Bronchi branches */}
                  <path
                    d="M100 95 Q82 105 70 120"
                    stroke="#0284C7"
                    strokeWidth="7"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M100 95 Q118 105 130 120"
                    stroke="#0284C7"
                    strokeWidth="7"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Lungs */}
                  <path
                    d="M96 100 C60 100 48 125 50 155 C52 175 75 180 92 172 C98 162 98 125 96 100 Z"
                    fill="url(#logoLungGrad)"
                    stroke="#E11D48"
                    strokeWidth="3"
                  />
                  <path
                    d="M104 100 C140 100 152 125 150 155 C148 175 125 180 108 172 C102 162 102 125 104 100 Z"
                    fill="url(#logoLungGrad)"
                    stroke="#E11D48"
                    strokeWidth="3"
                  />

                  {/* Friendly face details */}
                  <circle cx="72" cy="138" r="2.5" fill="#4C0519" />
                  <circle cx="84" cy="138" r="2.5" fill="#4C0519" />
                  <path
                    d="M75 145 Q78 149 81 145"
                    stroke="#4C0519"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />

                  <circle cx="116" cy="138" r="2.5" fill="#4C0519" />
                  <circle cx="128" cy="138" r="2.5" fill="#4C0519" />
                  <path
                    d="M119 145 Q122 149 125 145"
                    stroke="#4C0519"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Diaphragm base */}
                  <path
                    d="M45 178 Q100 162 155 178 Q100 188 45 178 Z"
                    fill="#10B981"
                    stroke="#047857"
                    strokeWidth="2"
                  />
                </svg>

                <div className="mt-1 bg-gradient-to-r from-teal-600 to-sky-600 text-white font-fredoka font-semibold text-xs sm:text-sm px-4 py-1 rounded-full shadow-md tracking-wide">
                  Sistem Pernafasan Manusia
                </div>
              </div>

              <div className="absolute -top-2 -right-2 bg-yellow-300 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-md rotate-12 flex items-center gap-1">
                <span>Interaktif!</span>
                <Sparkles className="w-3 h-3 text-amber-600" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => goToScreen(2)}
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-fredoka text-xl px-10 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-200 cursor-pointer active:scale-95"
            >
              <span>Mula Sekarang</span>
              <span className="text-2xl">🚀</span>
            </button>
          </section>
        )}

        {/* =========================================================
            SKRIN 2: VIDEO PEMBELAJARAN
            ========================================================= */}
        {currentScreen === 2 && (
          <section className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-white/60">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-4xl font-bold text-[#0A2540] font-fredoka mb-2">
                Jom Tonton dan Terokai! 🎬
              </h2>
              <p className="text-slate-600 max-w-xl mx-auto">
                Sebelum memulakan misi, tonton video ini untuk mengetahui lebih lanjut tentang
                sistem pernafasan manusia.
              </p>
            </div>

            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-md bg-slate-900 mb-6 border-4 border-white">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/9FN_APQmTRk"
                title="Video Pembelajaran Sistem Pernafasan Manusia"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <div className="text-center mb-8">
              <p className="text-xs text-slate-500 mb-2">Video tidak muncul atau bermasalah?</p>
              <a
                href="https://youtu.be/9FN_APQmTRk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2.5 rounded-full shadow-sm transition text-sm cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Tonton Video di YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200/80">
              <button
                type="button"
                onClick={() => goToScreen(1)}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full transition flex items-center gap-2 text-sm cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Halaman Utama</span>
              </button>
              <button
                type="button"
                onClick={() => goToScreen(3)}
                className="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white font-fredoka text-lg rounded-full shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <span>Seterusnya</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </section>
        )}

        {/* =========================================================
            SKRIN 3: PERNYATAAN HASIL AKTIVITI
            ========================================================= */}
        {currentScreen === 3 && (
          <section className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-xl border border-white/60">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] font-fredoka text-center mb-6 tracking-tight">
              Pada akhir aktiviti, murid-murid akan dapat
            </h2>

            <div className="max-w-2xl mx-auto bg-gradient-to-br from-sky-50 to-teal-50 border-2 border-teal-200 rounded-2xl p-6 sm:p-8 shadow-xs text-center mb-8 relative">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-md mx-auto mb-4 border border-teal-100">
                <Target className="w-8 h-8 text-teal-600" />
              </div>
              <p className="text-lg sm:text-xl font-semibold text-[#005F73] leading-relaxed">
                Mengenal pasti sekurang-kurangnya 4 daripada 7 organ yang terlibat dalam sistem
                pernafasan dengan betul.
              </p>
            </div>

            <div className="max-w-xl mx-auto bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 mb-8">
              <span className="text-2xl">💡</span>
              <p className="text-sm text-amber-800 leading-normal">
                Sediakan ingatan anda! Di skrin seterusnya, anda perlu meletakkan label organ pada
                kedudukan yang betul pada rajah manusia.
              </p>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-3 pt-4 border-t border-slate-200/80">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => goToScreen(1)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full transition text-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Home className="w-4 h-4" />
                  <span>Halaman Utama</span>
                </button>
                <button
                  type="button"
                  onClick={() => goToScreen(2)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full transition text-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => goToScreen(4)}
                className="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white font-fredoka text-lg rounded-full shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <span>Seterusnya (Mula Misi)</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </section>
        )}

        {/* =========================================================
            SKRIN 4: PERMAINAN INTERAKTIF (PADANKAN ORGAN)
            ========================================================= */}
        {currentScreen === 4 && (
          <section className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-8 shadow-xl border border-white/60">
            <div className="text-center mb-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0A2540] font-fredoka">
                🔎 Misi 1: Padankan Organ Pernafasan
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto mt-1">
                Seret kad nama organ ke kedudukan yang betul pada rajah sistem pernafasan. Anda juga
                boleh mengetik kad nama, kemudian mengetik lokasi yang sepadan. Cuba kenal pasti
                sekurang-kurangnya 4 daripada 7 organ dengan betul untuk membuka misi seterusnya!
              </p>
            </div>

            {/* Upper Feedback Panel (When checked) */}
            {matchingChecked && (
              <div
                className={`mb-5 p-4 rounded-2xl text-center shadow-md transition border ${
                  matchingScore === 7
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                    : matchingScore >= 4
                    ? 'bg-sky-100 border-sky-300 text-sky-900'
                    : 'bg-amber-100 border-amber-300 text-amber-900'
                }`}
              >
                {matchingScore === 7 ? (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                    <span className="text-3xl">🎉</span>
                    <div>
                      <p className="font-extrabold text-base sm:text-lg">
                        🎉 TAHNIAH! ANDA BERJAYA MEMADANKAN SEMUA 7 ORGAN DENGAN BETUL! 🏆
                      </p>
                      <p className="text-xs sm:text-sm font-semibold">
                        Markah: <b>7/7</b> (7 Padanan Betul) • Status: <b>SEMPURNA!</b>
                      </p>
                    </div>
                  </div>
                ) : matchingScore >= 4 ? (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                    <span className="text-2xl">👍</span>
                    <div>
                      <p className="font-bold text-base">
                        Syabas! Markah anda: <b>{matchingScore}/7</b> ({matchingScore} Padanan Betul)
                      </p>
                      <p className="text-xs sm:text-sm">
                        Anda telah mencapai sasaran minimum (≥4/7)! Boleh tekan 'Seterusnya' atau
                        baiki jawapan untuk markah penuh (7/7).
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                    <span className="text-2xl">💪</span>
                    <div>
                      <p className="font-bold text-base">
                        Cuba Lagi! Markah anda: <b>{matchingScore}/7</b> ({matchingScore} Padanan
                        Betul)
                      </p>
                      <p className="text-xs sm:text-sm">
                        Padankan sekurang-kurangnya 4 organ dengan betul untuk membuka misi
                        seterusnya.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Column 1: Organ Cards Palette */}
              <div className="lg:col-span-4 bg-sky-50/80 rounded-2xl p-4 border border-sky-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-sky-900 font-fredoka flex items-center gap-1.5">
                    <span>🏷️ Pilihan Kad Nama Organ:</span>
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">Ketik/Seret kad</span>
                </div>

                <div className="flex flex-wrap lg:flex-col gap-2.5 min-h-[160px]">
                  {unplacedCards.length === 0 ? (
                    <div className="w-full text-center py-6 text-slate-500 text-xs italic bg-white/60 rounded-xl border border-dashed border-slate-300">
                      Semua kad telah diletakkan pada rajah! Tekan "Semak Jawapan" di bawah.
                    </div>
                  ) : (
                    unplacedCards.map((organ) => {
                      const isSelected = selectedCardId === organ.id;
                      return (
                        <div
                          key={organ.id}
                          draggable
                          onDragStart={(e) => {
                            sound.playPop();
                            e.dataTransfer.setData('text/plain', organ.id.toString());
                            setSelectedCardId(organ.id);
                          }}
                          onClick={() => handleCardTap(organ.id)}
                          className={`draggable-card bg-white border-2 text-sky-900 font-bold px-3 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs flex items-center justify-between select-none cursor-grab active:cursor-grabbing transition duration-150 ${
                            isSelected
                              ? 'border-blue-600 bg-blue-100 ring-2 ring-blue-500 scale-102 shadow-md'
                              : 'border-sky-300 hover:border-sky-500 hover:bg-sky-50/50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{organ.emoji}</span>
                            <span>{organ.name}</span>
                          </div>
                          <span className="text-sky-400 text-xs tracking-tighter">⠿</span>
                        </div>
                      );
                    })
                  )}
                </div>

                {selectedCardId !== null && (
                  <p className="mt-3 text-center text-xs text-blue-700 font-semibold animate-pulse">
                    👉 Sekarang, ketik petak pada rajah untuk meletakkan kad ini.
                  </p>
                )}
              </div>

              {/* Column 2: Anatomical Diagram */}
              <div className="lg:col-span-8 bg-white rounded-2xl p-3 sm:p-5 border border-slate-300 shadow-inner flex flex-col items-center">
                <AnatomicalDiagram
                  answers={matchingAnswers}
                  selectedCardId={selectedCardId}
                  checked={matchingChecked}
                  onZoneClick={handleZoneClick}
                  onRemoveCard={returnCardToPalette}
                  onDropCard={assignCardToZone}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-between items-center gap-3 mt-6 pt-4 border-t border-slate-200">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => goToScreen(1)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full text-xs sm:text-sm flex items-center gap-1 cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Halaman Utama</span>
                </button>
                <button
                  type="button"
                  onClick={resetMatchingGame}
                  className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold rounded-full text-xs sm:text-sm transition flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Cuba Lagi</span>
                </button>
                <button
                  type="button"
                  onClick={showCorrectAnswers}
                  className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold rounded-full text-xs sm:text-sm transition flex items-center gap-1 cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Lihat Jawapan Betul</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={checkMatching}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-fredoka text-base rounded-full shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Semak Jawapan</span>
                </button>

                {matchingChecked && matchingScore >= 4 && (
                  <button
                    type="button"
                    onClick={() => goToScreen(5)}
                    className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-fredoka text-base rounded-full shadow-md transition inline-flex items-center gap-1.5 animate-bounce cursor-pointer"
                  >
                    <span>Seterusnya</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Lower Feedback Panel */}
            {matchingChecked && (
              <div
                className={`mt-6 p-4 rounded-2xl text-center shadow-md transition border ${
                  matchingScore === 7
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                    : matchingScore >= 4
                    ? 'bg-sky-100 border-sky-300 text-sky-900'
                    : 'bg-amber-100 border-amber-300 text-amber-900'
                }`}
              >
                <p className="font-bold text-sm">
                  {matchingScore === 7
                    ? '🎉 Hebat sekali! Semua organ berada di kedudukan yang tepat.'
                    : matchingScore >= 4
                    ? `👍 Anda berjaya memadankan ${matchingScore} daripada 7 organ. Layak ke misi seterusnya!`
                    : 'Belum cukup 4 padanan betul. Cuba semak semula kedudukan setiap organ.'}
                </p>
              </div>
            )}
          </section>
        )}

        {/* =========================================================
            SKRIN 5: FUNGSI ORGAN PERNAFASAN
            ========================================================= */}
        {currentScreen === 5 && (
          <section className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-white/60">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-4xl font-bold text-[#0A2540] font-fredoka mb-2">
                🫁 Kenali Fungsi Organ Pernafasan
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Setiap organ dalam sistem pernafasan mempunyai fungsi yang penting. Mari kenali
                bagaimana organ-organ ini bekerjasama untuk membantu kita bernafas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {ORGAN_DATA.map((organ) => (
                <div
                  key={organ.id}
                  className={`bg-gradient-to-br ${organ.badgeColor} p-5 rounded-2xl border shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">{organ.emoji}</span>
                      <button
                        type="button"
                        onClick={() => speakText(`${organ.name}. ${organ.description}`)}
                        className="text-slate-400 hover:text-slate-700 p-1 rounded-full transition"
                        title="Dengar penerangan audio"
                      >
                        <Volume1 className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="text-lg font-bold font-fredoka mb-2">{organ.functionTitle}</h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {organ.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-between items-center gap-3 pt-4 border-t border-slate-200">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => goToScreen(1)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full transition text-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Home className="w-4 h-4" />
                  <span>Halaman Utama</span>
                </button>
                <button
                  type="button"
                  onClick={() => goToScreen(4)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full transition text-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => goToScreen(6)}
                className="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white font-fredoka text-lg rounded-full shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <span>Seterusnya (Kuiz)</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </section>
        )}

        {/* =========================================================
            SKRIN 6: KUIZ INTERAKTIF FUNGSI ORGAN
            ========================================================= */}
        {currentScreen === 6 && (
          <section className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-white/60 max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0A2540] font-fredoka">
                  📝 Kuiz Fungsi Organ
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Pilih satu jawapan yang betul bagi setiap soalan.
                </p>
              </div>
              <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-fredoka font-bold text-sm">
                <span>Soalan {quizIdx} daripada 3</span>
              </div>
            </div>

            {/* Current Question */}
            {(() => {
              const qData = QUIZ_DATA.find((q) => q.id === quizIdx)!;
              const isChecked = !!quizChecked[quizIdx];
              const selectedOpt = quizAnswers[quizIdx];

              return (
                <div className="quiz-question-block mb-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 font-fredoka">
                    {qData.question}
                  </h3>

                  <div className="space-y-3 mb-6">
                    {qData.options.map((opt) => {
                      const isSelected = selectedOpt === opt.label;
                      const isCorrect = opt.label === qData.correct;

                      let optClasses =
                        'border-slate-200 hover:border-sky-400 bg-white text-slate-700';

                      if (isChecked) {
                        if (isCorrect) {
                          optClasses =
                            'border-emerald-500 bg-emerald-100 text-emerald-950 font-bold';
                        } else if (isSelected) {
                          optClasses = 'border-rose-500 bg-rose-100 text-rose-950 font-bold';
                        }
                      } else if (isSelected) {
                        optClasses = 'border-sky-500 bg-sky-50 text-sky-900 font-bold shadow-xs';
                      }

                      return (
                        <div
                          key={opt.label}
                          onClick={() => handleSelectQuizOption(quizIdx, opt.label)}
                          className={`quiz-opt-btn block p-4 rounded-xl border-2 transition font-medium text-sm select-none cursor-pointer ${optClasses}`}
                        >
                          <div className="flex items-center justify-between">
                            <span>
                              <b>{opt.label}.</b> {opt.text}
                            </span>
                            {isChecked && isCorrect && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Feedback explanation box */}
                  {isChecked && (
                    <div
                      className={`mb-6 p-4 rounded-xl text-sm leading-relaxed font-medium shadow-inner ${
                        selectedOpt === qData.correct
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-rose-100 text-rose-900 border border-rose-300'
                      }`}
                    >
                      {selectedOpt === qData.correct ? (
                        <>
                          <div className="font-bold text-emerald-900 mb-1">
                            ✅ Tahniah, jawapan betul!
                          </div>
                          <div>{qData.explain}</div>
                        </>
                      ) : (
                        <>
                          <div className="font-bold text-rose-900 mb-1">
                            ❌ Jawapan kurang tepat.
                          </div>
                          <div>{qData.explain}</div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Bottom Actions */}
            <div className="flex flex-wrap justify-between items-center gap-3 pt-4 border-t border-slate-200">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => goToScreen(1)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full text-xs sm:text-sm flex items-center gap-1 cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Utama</span>
                </button>
                <button
                  type="button"
                  onClick={() => goToScreen(5)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full text-xs sm:text-sm flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali</span>
                </button>
              </div>

              <div className="flex gap-2">
                {!quizChecked[quizIdx] ? (
                  <button
                    type="button"
                    onClick={checkQuizCurrent}
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-fredoka rounded-full shadow-sm transition text-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Semak Jawapan</span>
                  </button>
                ) : quizIdx < 3 ? (
                  <button
                    type="button"
                    onClick={nextQuiz}
                    className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-fredoka rounded-full shadow-sm transition text-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Soalan Seterusnya</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => goToScreen(7)}
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-fredoka rounded-full shadow-sm transition text-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Lihat Keputusan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            SKRIN 7: KEPUTUSAN DAN RUMUSAN
            ========================================================= */}
        {currentScreen === 7 && (
          <section className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-xl border border-white/60 text-center max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-4xl shadow-md mx-auto mb-4 border-2 border-yellow-300 animate-bounce">
              <Trophy className="w-10 h-10 text-amber-500" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A2540] font-fredoka mb-2">
              Tahniah, Detektif Cilik!
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mb-8">
              Anda telah melepasi semua misi pembelajaran Sistem Pernafasan Manusia.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {/* Matching Score */}
              <div className="bg-sky-50 border border-sky-200 p-4 rounded-2xl shadow-xs">
                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-1">
                  Padankan Organ
                </span>
                <span className="text-3xl font-extrabold text-sky-900 font-fredoka">
                  {matchingScore}/7
                </span>
                <span
                  className={`text-xs font-semibold block mt-1 ${
                    matchingScore >= 4 ? 'text-emerald-600' : 'text-rose-500'
                  }`}
                >
                  {matchingScore >= 4 ? '✓ Mencapai Sasaran' : '✗ Belum Mencapai'}
                </span>
              </div>

              {/* Quiz Score */}
              <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl shadow-xs">
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-1">
                  Kuiz Fungsi
                </span>
                <span className="text-3xl font-extrabold text-purple-900 font-fredoka">
                  {quizScore}/3
                </span>
                <span className="text-xs text-purple-600 block mt-1">3 Soalan</span>
              </div>

              {/* Total Score */}
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl shadow-xs">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                  Jumlah Markah
                </span>
                <span className="text-3xl font-extrabold text-emerald-900 font-fredoka">
                  {totalScore}/10
                </span>
                <span className="text-xs text-emerald-600 block mt-1">Keseluruhan</span>
              </div>
            </div>

            {/* Performance message */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-base mb-8 shadow-xs">
              {totalScore >= 9
                ? '🌟 Cemerlang! Anda sangat mahir mengenal organ pernafasan dan memahami fungsinya!'
                : totalScore >= 7
                ? '👏 Bagus sekali! Anda menunjukkan pemahaman yang baik tentang sistem pernafasan.'
                : totalScore >= 5
                ? '👍 Usaha yang baik! Teruskan mengulang kaji fungsi organ pernafasan.'
                : '💪 Jangan putus asa! Cuba semula dan pelajari fungsi setiap organ dengan lebih teliti.'}
            </div>

            {/* Learning Takeaways */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left mb-8">
              <h3 className="font-bold text-slate-800 font-fredoka mb-3 text-base flex items-center gap-2">
                <span>📌 Rumusan Pembelajaran Anda:</span>
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Mengenal pasti 7 organ utama sistem pernafasan manusia.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Memadankan organ pada kedudukan tepat mengikut anatomi manusia.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>
                    Memahami peranan khas alveolus (pertukaran gas) dan diafragma (otot pernafasan).
                  </span>
                </li>
              </ul>
            </div>

            {/* Reset / Home buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={resetAll}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-fredoka text-lg rounded-full shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Cuba Lagi</span>
              </button>

              <button
                type="button"
                onClick={() => goToScreen(1)}
                className="px-8 py-3.5 bg-slate-700 hover:bg-slate-800 text-white font-fredoka text-lg rounded-full shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Home className="w-5 h-5" />
                <span>Halaman Utama</span>
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Warning Notice Modal */}
      <NoticeModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        onClose={() => setModalState({ isOpen: false, title: '', message: '' })}
      />
    </div>
  );
}
