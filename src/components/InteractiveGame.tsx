import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Play, RotateCcw, CheckCircle, AlertTriangle, ArrowRight, Star, Target, ShieldCheck } from 'lucide-react';

interface GameProps {
  key?: string;
  gameConfig: {
    type: 'typing' | 'mouse' | 'sorting' | 'quiz' | 'grid';
    title: string;
    description: string;
    data: any;
  };
  section: string;
  lessonId: number;
  userToken: string | null;
  onGameComplete: (score: number, maxScore: number) => void;
}

export default function InteractiveGame({ gameConfig, section, lessonId, userToken, onGameComplete }: GameProps) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'completed'>('idle');
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(10);
  const [timer, setTimer] = useState(30);
  const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);

  // Mode-specific states
  const [typingInput, setTypingInput] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [mouseTargets, setMouseTargets] = useState<Array<{ id: number; text: string; x: number; y: number; clicked: boolean; doubleClicked?: boolean }>>([]);
  const [sortingItems, setSortingItems] = useState<Array<{ id: string; text: string; category: string }>>([]);
  const [sortingCategories, setSortingCategories] = useState<string[]>([]);
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, string>>({}); // itemId -> category
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [gridTargets, setGridTargets] = useState<string[]>([]);
  const [clickedGridCells, setClickedGridCells] = useState<string[]>([]);
  const [gridArtPoints, setGridArtPoints] = useState<string[]>([]);
  const [gridNumberTargets, setGridNumberTargets] = useState<string[]>([]);
  const [gridNumberValues, setGridNumberValues] = useState<Record<string, number>>({});

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Game Config
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimer(30);
    setFeedback(null);

    const { type, data } = gameConfig;

    if (type === 'typing') {
      setCurrentWordIndex(0);
      setTypingInput('');
      setMaxScore(data.words.length * 10);
    } else if (type === 'mouse') {
      const targets = (data.targets || data.items || []).map((t: any, idx: number) => {
        const text = typeof t === 'string' ? t : t.name;
        const isCorrect = typeof t === 'string' ? true : t.isCorrect;
        return {
          id: idx,
          text,
          isCorrect,
          x: 10 + Math.random() * 70, // percentage
          y: 10 + Math.random() * 70, // percentage
          clicked: false,
          doubleClicked: false,
        };
      });
      setMouseTargets(targets);
      setMaxScore(targets.filter((t: any) => t.isCorrect !== false).length * 10 || 10);
    } else if (type === 'sorting') {
      const cats = Object.keys(data.categories);
      setSortingCategories(cats);
      const items: any[] = [];
      cats.forEach((cat) => {
        data.categories[cat].forEach((itemText: string, idx: number) => {
          items.push({
            id: `${cat}-${idx}`,
            text: itemText,
            category: cat,
          });
        });
      });
      // Shuffle items
      setSortingItems(items.sort(() => Math.random() - 0.5));
      setCurrentAnswers({});
      setMaxScore(items.length * 10);
    } else if (type === 'quiz') {
      setQuizIndex(0);
      setSelectedQuizOption(null);
      setMaxScore(data.questions.length * 10);
    } else if (type === 'grid') {
      setClickedGridCells([]);
      if (data.artMode) {
        setGridArtPoints(data.targets);
        setMaxScore(data.targets.length * 10);
      } else if (data.numberGrid) {
        // Create numbers grid
        const numVals: Record<string, number> = {};
        const correctCells: string[] = [];
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 4; c++) {
            const cellId = `${String.fromCharCode(65 + c)}${r + 1}`;
            const val = Math.floor(Math.random() * 100);
            numVals[cellId] = val;
            if (val > 50) correctCells.push(cellId);
          }
        }
        setGridNumberValues(numVals);
        setGridNumberTargets(correctCells);
        setMaxScore(correctCells.length * 10 || 10);
      } else {
        setGridTargets(data.targets);
        setMaxScore(data.targets.length * 10);
      }
    }
  };

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            finishGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  const finishGame = (forcedScore?: number) => {
    setGameState('completed');
    if (timerRef.current) clearInterval(timerRef.current);
    
    const finalScore = typeof forcedScore === 'number' ? forcedScore : score;
    onGameComplete(finalScore, maxScore);

    // Save to Cloud SQL if userToken is present
    if (userToken) {
      fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          section,
          lessonId,
          score: finalScore,
          maxScore,
        }),
      }).catch((e) => console.error('Failed to submit score automatically:', e));
    }
  };

  // TYPING MODE LOGIC
  const handleTypingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTypingInput(val);
    const targetWord = gameConfig.data.words[currentWordIndex];

    if (val.trim().toLowerCase() === targetWord.toLowerCase()) {
      // Correct!
      setScore((prev) => prev + 10);
      setFeedback({ text: "A'lo! 🌟", success: true });
      setTimeout(() => setFeedback(null), 800);

      if (currentWordIndex + 1 < gameConfig.data.words.length) {
        setCurrentWordIndex((prev) => prev + 1);
        setTypingInput('');
      } else {
        // Completed all words
        finishGame(score + 10);
      }
    }
  };

  // MOUSE MODE LOGIC
  const handleMouseClick = (id: number, doubleClickEvent: boolean) => {
    const { doubleClickRequired } = gameConfig.data;
    if (doubleClickRequired && !doubleClickEvent) return; // Ignore single clicks if double click is required

    setMouseTargets((prev) =>
      prev.map((t) => {
        if (t.id === id && !t.clicked) {
          if (t.isCorrect !== false) {
            setScore((s) => s + 10);
            setFeedback({ text: "Zo'r! 🎯", success: true });
          } else {
            setScore((s) => Math.max(0, s - 5));
            setFeedback({ text: "Ups! 🛑", success: false });
          }
          setTimeout(() => setFeedback(null), 800);
          return { ...t, clicked: true };
        }
        return t;
      })
    );

    // Check if all correct targets are clicked
    setTimeout(() => {
      setMouseTargets((curr) => {
        const correctRemaining = curr.filter((t) => t.isCorrect !== false && !t.clicked);
        if (correctRemaining.length === 0) {
          // Finish game early if all correct targets popped
          let final = 0;
          curr.forEach(t => { if (t.isCorrect !== false && t.clicked) final += 10; });
          finishGame(final);
        }
        return curr;
      });
    }, 100);
  };

  // SORTING MODE LOGIC
  const selectCategoryForItem = (itemId: string, category: string) => {
    setCurrentAnswers((prev) => {
      const updated = { ...prev, [itemId]: category };
      // Check if all items are sorted
      if (Object.keys(updated).length === sortingItems.length) {
        // Evaluate score
        let finalScore = 0;
        sortingItems.forEach((item) => {
          if (updated[item.id] === item.category) {
            finalScore += 10;
          }
        });
        setScore(finalScore);
        finishGame(finalScore);
      }
      return updated;
    });
  };

  // QUIZ MODE LOGIC
  const handleQuizAnswer = (optionIdx: number) => {
    if (selectedQuizOption !== null) return;
    setSelectedQuizOption(optionIdx);

    const isCorrect = optionIdx === gameConfig.data.questions[quizIndex].c;
    if (isCorrect) {
      setScore((s) => s + 10);
      setFeedback({ text: "To'g'ri javob! 🎉", success: true });
    } else {
      setFeedback({ text: "Noto'g'ri! Qayta o'ylang. 🤔", success: false });
    }

    setTimeout(() => {
      setFeedback(null);
      setSelectedQuizOption(null);
      if (quizIndex + 1 < gameConfig.data.questions.length) {
        setQuizIndex((prev) => prev + 1);
      } else {
        finishGame(score + (isCorrect ? 10 : 0));
      }
    }, 1500);
  };

  // GRID MODE LOGIC
  const handleGridClick = (cellId: string) => {
    if (clickedGridCells.includes(cellId)) return;

    const newClicked = [...clickedGridCells, cellId];
    setClickedGridCells(newClicked);

    if (gameConfig.data.artMode) {
      if (gridArtPoints.includes(cellId)) {
        setScore((s) => s + 10);
        setFeedback({ text: "Katak bo'yaldi! 🎨", success: true });
        // Check if art is complete
        const remaining = gridArtPoints.filter((p) => !newClicked.includes(p));
        if (remaining.length === 0) {
          finishGame(gridArtPoints.length * 10);
        }
      } else {
        setScore((s) => Math.max(0, s - 2));
        setFeedback({ text: "Bu katak bo'sh", success: false });
      }
    } else if (gameConfig.data.numberGrid) {
      if (gridNumberTargets.includes(cellId)) {
        setScore((s) => s + 10);
        setFeedback({ text: "To'g'ri! (>50) 👍", success: true });
        const remaining = gridNumberTargets.filter((p) => !newClicked.includes(p));
        if (remaining.length === 0) {
          finishGame(gridNumberTargets.length * 10);
        }
      } else {
        setScore((s) => Math.max(0, s - 5));
        setFeedback({ text: "Noto'g'ri! (<50)", success: false });
      }
    } else {
      // Coordinate Target Mode
      const nextTarget = gridTargets[clickedGridCells.filter(c => gridTargets.includes(c)).length];
      if (cellId === nextTarget) {
        setScore((s) => s + 10);
        setFeedback({ text: "Topildi! 🧭", success: true });
        if (newClicked.filter(c => gridTargets.includes(c)).length === gridTargets.length) {
          finishGame(gridTargets.length * 10);
        }
      } else {
        setFeedback({ text: `Noto'g'ri! ${nextTarget} ni qidiring.`, success: false });
      }
    }

    setTimeout(() => setFeedback(null), 800);
  };

  return (
    <div id="interactive-game" className="bg-white dark:bg-[#152017] rounded-3xl shadow-sm border border-[#EBE7DF] dark:border-[#243326] p-6 md:p-8 overflow-hidden relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-[#EBE7DF] dark:border-[#243326]">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-[#F5F5F0] dark:bg-[#1A261D] text-[#2C3E2D] dark:text-[#8BA88E] border border-[#EBE7DF] dark:border-[#2D3E30] uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5 text-[#8BA88E]" />
            Mavzuga oid interaktiv o'yin
          </span>
          <h3 className="text-xl md:text-2xl font-serif italic text-[#1A2E1C] dark:text-[#E6EAE7] font-normal leading-tight">{gameConfig.title}</h3>
          <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-1 leading-relaxed">{gameConfig.description}</p>
        </div>
 
        {gameState === 'playing' && (
          <div className="flex items-center gap-4 bg-[#FDFBF7] dark:bg-[#101712] px-4 py-2 rounded-2xl border border-[#EBE7DF] dark:border-[#243326] self-end md:self-auto shadow-inner">
            <div className="text-right">
              <p className="text-[10px] text-[#828282] dark:text-[#9FB1A2] font-semibold uppercase">Vaqt</p>
              <p className={`font-serif italic font-bold text-lg ${timer <= 5 ? 'text-rose-500 animate-pulse' : 'text-[#2D2D2D] dark:text-[#E6EAE7]'}`}>{timer}s</p>
            </div>
            <div className="h-8 w-px bg-[#EBE7DF] dark:bg-[#243326]" />
            <div className="text-right">
              <p className="text-[10px] text-[#828282] dark:text-[#9FB1A2] font-semibold uppercase">Ball</p>
              <p className="font-serif italic font-bold text-lg text-[#8BA88E]">{score} / {maxScore}</p>
            </div>
          </div>
        )}
      </div>
 
      {/* GAME VIEWPORT */}
      <div className="min-h-[320px] max-h-[500px] bg-[#FDFBF7] dark:bg-[#101712] rounded-3xl flex flex-col justify-center items-center p-6 border border-dashed border-[#EBE7DF] dark:border-[#243326] relative overflow-hidden shadow-inner">
        
        {/* Floating feedback alert */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className={`absolute top-4 z-50 px-4 py-2 rounded-full text-xs font-bold shadow-md flex items-center gap-2 ${
                feedback.success ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white' : 'bg-rose-600 text-white'
              }`}
            >
              {feedback.success ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              {feedback.text}
            </motion.div>
          )}
        </AnimatePresence>
 
        {/* 1. IDLE STATE */}
        {gameState === 'idle' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md px-4"
          >
            <div className="w-16 h-16 bg-[#F5F5F0] dark:bg-[#1A261D] text-[#2C3E2D] dark:text-[#8BA88E] border border-[#EBE7DF] dark:border-[#2D3E30] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Play className="w-6 h-6 fill-current translate-x-0.5" />
            </div>
            <h4 className="text-lg font-serif italic text-[#1A2E1C] dark:text-[#E6EAE7]">Dars o'yinini boshlaymizmi?</h4>
            <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-2 mb-6 leading-relaxed">
              Mavzuni o'rganib bo'lgan bo'lsangiz, bilimingizni amaliy sinovdan o'tkazing! Har bir to'g'ri qadam profilingizga real vaqtda saqlab boriladi.
            </p>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-[#2C3E2D] dark:bg-[#2F4632] hover:bg-[#1C2C1D] text-white font-bold rounded-full shadow-sm transition-all flex items-center gap-2 mx-auto text-xs"
            >
              O'yinni Boshlash
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
 
        {/* 2. PLAYING STATE */}
        {gameState === 'playing' && (
          <div className="w-full h-full flex flex-col items-center justify-center relative min-h-[280px]">
            
            {/* A. TYPING CHALLENGE */}
            {gameConfig.type === 'typing' && (
              <div className="w-full max-w-sm text-center">
                <p className="text-[10px] text-[#828282] dark:text-[#9FB1A2] font-bold uppercase tracking-wider mb-2">Klaviaturada tezroq yozing:</p>
                <div className="mb-6 flex flex-wrap justify-center gap-2 items-center">
                  {gameConfig.data.words.map((word: string, idx: number) => (
                    <span
                      key={word}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        idx === currentWordIndex
                          ? 'bg-[#F5F5F0] dark:bg-[#1E2D21] text-[#2C3E2D] dark:text-[#8BA88E] border-2 border-[#8BA88E] scale-105 shadow-sm'
                          : idx < currentWordIndex
                          ? 'bg-[#EBE7DF]/40 dark:bg-[#18241B] text-[#828282]/50 line-through'
                          : 'bg-white dark:bg-[#152017] text-[#828282] dark:text-[#9FB1A2] border border-[#EBE7DF] dark:border-[#243326]'
                      }`}
                    >
                      {word}
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  autoFocus
                  placeholder="Yozishni boshlang..."
                  value={typingInput}
                  onChange={handleTypingChange}
                  className="w-full px-4 py-3 rounded-2xl border border-[#EBE7DF] dark:border-[#283A2C] text-center text-base font-bold focus:outline-none focus:border-[#8BA88E] focus:ring-2 focus:ring-[#8BA88E]/20 bg-white dark:bg-[#152017] text-[#2D2D2D] dark:text-[#E6EAE7] shadow-inner"
                />
              </div>
            )}
 
            {/* B. MOUSE BUBBLE POPPING */}
            {gameConfig.type === 'mouse' && (
              <div className="w-full h-[280px] relative bg-white/50 dark:bg-[#152017]/50 rounded-2xl overflow-hidden border border-[#EBE7DF] dark:border-[#243326]">
                <p className="absolute bottom-2 left-2 text-[10px] text-[#828282] dark:text-[#9FB1A2] font-semibold uppercase">
                  {gameConfig.data.doubleClickRequired ? "Ikki marta bosing! (Double Click)" : "Tugma ustiga bosing!"}
                </p>
                {mouseTargets.map((t) => (
                  <AnimatePresence key={t.id}>
                    {!t.clicked && (
                      <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        onClick={() => handleMouseClick(t.id, false)}
                        onDoubleClick={() => handleMouseClick(t.id, true)}
                        style={{ left: `${t.x}%`, top: `${t.y}%` }}
                        className={`absolute px-4 py-2 rounded-full font-bold shadow-md cursor-pointer transition transform hover:scale-105 flex items-center gap-1.5 text-xs ${
                          t.isCorrect === false
                            ? 'bg-rose-50 text-rose-800 border-2 border-rose-300'
                            : 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white border-2 border-[#8BA88E]'
                        }`}
                      >
                        <Target className="w-3.5 h-3.5 shrink-0" />
                        {t.text}
                      </motion.button>
                    )}
                  </AnimatePresence>
                ))}
                {/* No targets left check */}
                {mouseTargets.every(t => t.clicked) && (
                  <div className="text-center p-6 text-[#828282] dark:text-[#9FB1A2] italic text-xs">Barcha pufaklar yorildi!</div>
                )}
              </div>
            )}
 
            {/* C. DRAG AND DROP SORTING */}
            {gameConfig.type === 'sorting' && (
              <div className="w-full flex flex-col items-center gap-4">
                <p className="text-[10px] text-[#828282] dark:text-[#9FB1A2] font-bold uppercase tracking-wider">Elementlarni tegishli toifalarga saralang:</p>
                <div className="flex flex-wrap justify-center gap-3 mb-4">
                  {sortingItems.map((item) => {
                    const ans = currentAnswers[item.id];
                    if (ans) return null; // already sorted
 
                    return (
                      <div
                        key={item.id}
                        className="bg-white dark:bg-[#152017] border border-[#EBE7DF] dark:border-[#243326] px-4 py-3 rounded-2xl shadow-sm font-semibold text-xs flex flex-col items-center gap-2.5 max-w-[200px]"
                      >
                        <span className="text-[#2D2D2D] dark:text-[#E6EAE7] text-center font-bold">{item.text}</span>
                        <div className="flex gap-1.5 mt-1">
                          {sortingCategories.map((cat) => (
                            <button
                              key={cat}
                              onClick={() => selectCategoryForItem(item.id, cat)}
                              className="px-2.5 py-1 bg-[#F5F5F0] dark:bg-[#1A261D] hover:bg-[#EBE7DF] dark:hover:bg-[#243326] text-[#2C3E2D] dark:text-[#C5D0C7] border border-[#EBE7DF] dark:border-[#2D3E30] rounded-full text-[10px] font-bold transition-all"
                            >
                              {cat.split(' ')[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
 
                {/* Categories container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
                  {sortingCategories.map((cat) => {
                    const itemsInCat = sortingItems.filter(i => currentAnswers[i.id] === cat);
                    return (
                      <div key={cat} className="bg-white dark:bg-[#152017] rounded-2xl p-4 border border-[#EBE7DF] dark:border-[#243326] shadow-inner flex flex-col min-h-[110px]">
                        <h5 className="text-[10px] font-bold text-[#8BA88E] uppercase tracking-wider mb-2 pb-1.5 border-b border-[#EBE7DF] dark:border-[#243326]">
                          {cat}
                        </h5>
                        <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[110px]">
                          {itemsInCat.map(i => (
                            <div key={i.id} className="text-xs py-1.5 px-2.5 rounded-xl bg-[#FDFBF7] dark:bg-[#101712] text-[#2D2D2D] dark:text-[#E6EAE7] flex items-center justify-between border border-[#EBE7DF] dark:border-[#243326]">
                              <span className="font-medium">{i.text}</span>
                              {i.category === cat ? (
                                <span className="text-emerald-500 font-bold text-xs">✓</span>
                              ) : (
                                <span className="text-rose-500 font-bold text-xs">✗</span>
                              )}
                            </div>
                          ))}
                          {itemsInCat.length === 0 && (
                            <p className="text-[10px] text-[#828282] dark:text-[#9FB1A2] text-center py-4 italic">Hali elementlar joylashtirilmadi</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
 
            {/* D. TRIVIA QUIZ */}
            {gameConfig.type === 'quiz' && (
              <div className="w-full max-w-md">
                <div className="mb-4">
                  <div className="flex justify-between text-[10px] text-[#828282] dark:text-[#9FB1A2] mb-1 font-bold uppercase tracking-wider">
                    <span>Savol: {quizIndex + 1} / {gameConfig.data.questions.length}</span>
                    <span>Ball: {score}</span>
                  </div>
                  <div className="w-full bg-[#EBE7DF] dark:bg-[#243326] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#8BA88E] h-full transition-all duration-300"
                      style={{ width: `${((quizIndex + 1) / gameConfig.data.questions.length) * 100}%` }}
                    />
                  </div>
                </div>
 
                <div className="bg-white dark:bg-[#152017] p-5 rounded-2xl border border-[#EBE7DF] dark:border-[#243326] shadow-sm mb-4">
                  <h4 className="font-serif italic text-[#1A2E1C] dark:text-[#E6EAE7] text-sm leading-relaxed">
                    {gameConfig.data.questions[quizIndex].q}
                  </h4>
                </div>
 
                <div className="flex flex-col gap-2.5">
                  {gameConfig.data.questions[quizIndex].a.map((opt: string, idx: number) => {
                    const isSelected = selectedQuizOption === idx;
                    const isCorrect = idx === gameConfig.data.questions[quizIndex].c;
 
                    let btnClass = 'bg-white dark:bg-[#152017] hover:bg-[#FDFBF7] dark:hover:bg-[#1D2B20] border-[#EBE7DF] dark:border-[#283A2C] text-[#2D2D2D] dark:text-[#E6EAE7]';
                    if (selectedQuizOption !== null) {
                      if (isCorrect) btnClass = 'bg-[#2C3E2D] dark:bg-[#2F4632] border-[#2C3E2D] text-white font-bold';
                      else if (isSelected) btnClass = 'bg-rose-600 border-rose-600 text-white font-bold';
                    }
 
                    return (
                      <button
                        key={opt}
                        onClick={() => handleQuizAnswer(idx)}
                        disabled={selectedQuizOption !== null}
                        className={`w-full text-left p-3.5 rounded-xl border-2 text-xs transition-all flex items-center justify-between ${btnClass}`}
                      >
                        <span className="font-medium">{opt}</span>
                        {selectedQuizOption !== null && isCorrect && <CheckCircle className="w-4 h-4 shrink-0 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
 
            {/* E. GRID COORDINATE PUZZLES / ART */}
            {gameConfig.type === 'grid' && (
              <div className="w-full flex flex-col items-center gap-4">
                {gameConfig.data.artMode ? (
                  <p className="text-xs text-[#828282] dark:text-[#9FB1A2] font-semibold">
                    Kataklarni chiroyli bo'yash orqali yashiringan rasmni oling! (Ball: {score} / {maxScore})
                  </p>
                ) : gameConfig.data.numberGrid ? (
                  <p className="text-xs text-[#2C3E2D] dark:text-[#8BA88E] font-bold">
                    Qiymati 50 dan katta bo'lgan barcha kataklarni toping!
                  </p>
                ) : (
                  <p className="text-xs text-[#2C3E2D] dark:text-[#8BA88E] font-bold">
                    Qidirilayotgan koordinatani bosing:{' '}
                    <span className="font-serif italic bg-[#F5F5F0] dark:bg-[#1A261D] border border-[#EBE7DF] dark:border-[#2D3E30] text-[#2C3E2D] dark:text-[#8BA88E] px-3 py-1 rounded-full text-xs font-bold animate-pulse inline-block ml-1">
                      {gridTargets[clickedGridCells.filter(c => gridTargets.includes(c)).length] || 'Tugadi!'}
                    </span>
                  </p>
                )}
 
                {/* 4x4 or 5x5 Grid */}
                <div className="bg-white dark:bg-[#152017] p-3 rounded-2xl border border-[#EBE7DF] dark:border-[#243326] shadow-sm">
                  {/* Grid Headers (A B C D E) */}
                  <div className="grid grid-cols-6 gap-1 text-center font-mono text-[10px] text-[#828282] dark:text-[#9FB1A2] font-bold mb-1">
                    <div />
                    {Array.from({ length: gameConfig.data.cols || 4 }).map((_, c) => (
                      <div key={c}>{String.fromCharCode(65 + c)}</div>
                    ))}
                  </div>
 
                  {Array.from({ length: gameConfig.data.rows || 4 }).map((_, r) => {
                    const rowId = r + 1;
                    return (
                      <div key={r} className="grid grid-cols-6 gap-1 items-center mb-1">
                        {/* Row Header (1 2 3 4) */}
                        <div className="font-mono text-[10px] text-[#828282] dark:text-[#9FB1A2] font-bold text-center">{rowId}</div>
 
                        {Array.from({ length: gameConfig.data.cols || 4 }).map((_, c) => {
                          const colId = String.fromCharCode(65 + c);
                          const cellId = `${colId}${rowId}`;
                          const isClicked = clickedGridCells.includes(cellId);
                          
                          let cellBg = 'bg-[#FDFBF7] dark:bg-[#101712] hover:bg-[#F5F5F0] dark:hover:bg-[#1A261D] border-[#EBE7DF] dark:border-[#283A2C] text-[#2D2D2D] dark:text-[#E6EAE7]';
                          if (isClicked) {
                            if (gameConfig.data.artMode) {
                              cellBg = gridArtPoints.includes(cellId) ? 'bg-[#2C3E2D] dark:bg-[#2F4632] border-[#2C3E2D]' : 'bg-[#EBE7DF]/40 dark:bg-[#243326] border-[#EBE7DF] dark:border-[#243326]';
                            } else if (gameConfig.data.numberGrid) {
                              cellBg = gridNumberTargets.includes(cellId) ? 'bg-[#2C3E2D] dark:bg-[#2F4632] border-[#2C3E2D] text-white' : 'bg-[#EBE7DF]/40 dark:bg-[#243326] border-[#EBE7DF] dark:border-[#243326] text-[#828282] dark:text-[#9FB1A2]';
                            } else {
                              cellBg = gridTargets.includes(cellId) ? 'bg-[#2C3E2D] dark:bg-[#2F4632] border-[#2C3E2D] text-white' : 'bg-[#EBE7DF]/40 dark:bg-[#243326] border-[#EBE7DF] dark:border-[#243326]';
                            }
                          }
 
                          return (
                            <button
                              key={cellId}
                              onClick={() => handleGridClick(cellId)}
                              className={`aspect-square w-9 sm:w-11 font-mono text-xs font-bold border rounded-lg flex items-center justify-center transition-all ${cellBg}`}
                            >
                              {gameConfig.data.numberGrid ? (
                                <span>{gridNumberValues[cellId]}</span>
                              ) : (
                                <span className="text-[9px] text-[#828282]/50 opacity-0 hover:opacity-100">{cellId}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
 
          </div>
        )}
 
        {/* 3. COMPLETED STATE */}
        {gameState === 'completed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md px-4"
          >
            <div className="w-16 h-16 bg-[#F5F5F0] dark:bg-[#1A261D] border border-[#EBE7DF] dark:border-[#2D3E30] text-[#2C3E2D] dark:text-[#8BA88E] rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm animate-bounce">
              <Star className="w-8 h-8 fill-current text-[#8BA88E]" />
            </div>
            <h4 className="text-xl font-serif italic text-[#1A2E1C] dark:text-[#E6EAE7]">Dars o'yinidan a'lo natija! 🎉</h4>
            <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mt-2 mb-4 leading-relaxed">
              Siz ushbu darsga oid interaktiv topshiriqlarni muvaffaqiyatli yakunladingiz!
            </p>
 
            <div className="bg-white dark:bg-[#152017] p-4 rounded-2xl border border-[#EBE7DF] dark:border-[#243326] shadow-inner mb-6 flex justify-around">
              <div>
                <p className="text-[10px] text-[#828282] dark:text-[#9FB1A2] font-semibold uppercase">To'plangan Ball</p>
                <p className="font-serif italic font-bold text-xl text-[#2C3E2D] dark:text-[#8BA88E]">{score} b</p>
              </div>
              <div className="w-px bg-[#EBE7DF] dark:bg-[#243326]" />
              <div>
                <p className="text-[10px] text-[#828282] dark:text-[#9FB1A2] font-semibold uppercase">Maksimal Ball</p>
                <p className="font-serif italic font-bold text-xl text-[#828282] dark:text-[#9FB1A2]">{maxScore} b</p>
              </div>
            </div>
 
            <div className="flex gap-3 justify-center">
              <button
                onClick={startGame}
                className="px-5 py-2.5 bg-[#F5F5F0] dark:bg-[#1A261D] hover:bg-[#EBE7DF] dark:hover:bg-[#243326] text-[#2C3E2D] dark:text-[#C5D0C7] border border-[#EBE7DF] dark:border-[#2D3E30] font-bold rounded-full text-xs transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4 text-[#8BA88E]" />
                Qayta O'ynash
              </button>
              <div className="px-5 py-2.5 bg-[#2C3E2D] dark:bg-[#2F4632] text-white font-bold rounded-full text-xs flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-[#8BA88E]" />
                Natija Saqlandi
              </div>
            </div>
          </motion.div>
        )}
 
      </div>
    </div>
  );
}
