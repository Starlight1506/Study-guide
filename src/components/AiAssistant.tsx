import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, RefreshCw, MessageSquare, ChevronDown, Minimize2 } from 'lucide-react';
import { Lesson } from '../data/curriculum';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

interface AiAssistantProps {
  currentLesson?: Lesson | null;
  studentNotes?: string;
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({
  currentLesson,
  studentNotes,
  isOpenExternal,
  onCloseExternal,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputMsg, setInputMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Salom! Men IT Ustoz AI yordamchisiman. Darslar, kompyuter savodxonligi, kiberxavfsizlik yoki topshiriqlar bo'yicha xohlagan savolingizni bering! 😊",
      time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync external open request
  useEffect(() => {
    if (isOpenExternal !== undefined) {
      setIsOpen(isOpenExternal);
    }
  }, [isOpenExternal]);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputMsg;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMsg('');
    setLoading(true);

    try {
      const lessonContext = currentLesson
        ? `Mavzu: ${currentLesson.title}. Qisqacha: ${currentLesson.commonTopic}. Kichik yoshdagilar uslubi: ${currentLesson.kichik.concept}. Katta yoshdagilar uslubi: ${currentLesson.katta.concept}.`
        : undefined;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          lessonTitle: currentLesson ? `Dars #${currentLesson.id}: ${currentLesson.title}` : undefined,
          lessonContext,
        }),
      });

      const data = await response.json();

      if (response.ok && data.reply) {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: data.reply,
          time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: data.error || "Kechirasiz, javob olishda muammo yuz berdi. Qayta urinib ko'ring.",
          time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "Tarmoq xatoligi yuz berdi. Internet aloqasini tekshiring va qayta urinib ko'ring.",
        time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = currentLesson
    ? [
        `"${currentLesson.title}" mavzusini sodda tushuntirib ber`,
        `Ushbu dars bo'yicha 3 ta qiziqarli savol ber`,
        `Amaliy mashq bajarishga yordam ber`,
      ]
    : [
        "Kompyuter qanday ishlaydi?",
        "Kiberxavfsizlik bo'yicha oltin qoidalar nima?",
        "Dasturlashni o'rganishni nimadan boshlay?",
      ];

  const handleClose = () => {
    setIsOpen(false);
    if (onCloseExternal) onCloseExternal();
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-[#2C3E2D] hover:bg-[#1C2C1D] text-white p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center gap-3 group border-2 border-[#8BA88E]/40"
          title="AI Ustozdan savol so'rang"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-[#8BA88E] group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full" />
          </div>
          <span className="text-xs font-bold font-serif italic pr-1 hidden sm:inline">
            AI Ustoz
          </span>
        </button>
      )}

      {/* Floating AI Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[560px] max-h-[85vh] bg-[#FAF8F5] dark:bg-[#121B14] rounded-3xl shadow-2xl border border-[#2C3E2D]/20 dark:border-[#2D3E30] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-[#2C3E2D] dark:bg-[#1C2C1E] text-white p-4 px-5 flex items-center justify-between shadow-md border-b border-[#243326]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                <Sparkles className="w-5 h-5 text-[#8BA88E]" />
              </div>
              <div>
                <h3 className="font-serif italic text-base font-bold text-white flex items-center gap-1.5 leading-tight">
                  AI Ustoz Yordamchi
                </h3>
                <p className="text-[10px] text-[#8BA88E] font-medium leading-tight">
                  {currentLesson ? `Dars #${currentLesson.id}: ${currentLesson.title}` : "Umumiy IT savollar"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: 'welcome',
                      sender: 'ai',
                      text: "Suhbat tozalandi! Qanday savolingiz bor?",
                      time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
                    },
                  ])
                }
                className="p-1.5 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-colors"
                title="Suhbatni tozalash"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={handleClose}
                className="p-1.5 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-colors"
                title="Yopish"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 bg-[#FAF8F5] dark:bg-[#121B14]">
            
            {/* Lesson Context Banner if inside a lesson */}
            {currentLesson && (
              <div className="bg-[#8BA88E]/15 border border-[#8BA88E]/30 rounded-2xl p-3 text-[11px] text-[#2C3E2D] dark:text-[#C5D0C7] flex items-start gap-2">
                <Bot className="w-4 h-4 text-[#2C3E2D] dark:text-[#8BA88E] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#1A2E1C] dark:text-[#E6EAE7]">Aktiv Dars:</span> #{currentLesson.id} - {currentLesson.title}.
                  <p className="text-[10px] text-[#2C3E2D]/80 dark:text-[#9FB1A2] mt-0.5">Ushbu dars bo'yicha ixtiyoriy tushunmovchilikni so'rashingiz mumkin!</p>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] ${
                  msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
                }`}
              >
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white rounded-br-none shadow-sm'
                      : 'bg-white dark:bg-[#1A261D] text-[#2D2D2D] dark:text-[#E6EAE7] border border-[#EBE7DF] dark:border-[#283A2C] rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                <span className="text-[9px] text-[#828282] dark:text-[#9FB1A2] mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {loading && (
              <div className="self-start flex items-center gap-2 bg-white dark:bg-[#1A261D] border border-[#EBE7DF] dark:border-[#283A2C] p-3 rounded-2xl rounded-bl-none text-xs text-[#2C3E2D] dark:text-[#C5D0C7]">
                <Sparkles className="w-4 h-4 text-[#8BA88E] animate-spin" />
                <span className="font-medium">AI Ustoz javob o'ylamoqda...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-white/60 dark:bg-[#162218] border-t border-[#EBE7DF] dark:border-[#243326] flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                disabled={loading}
                className="whitespace-nowrap px-3 py-1 bg-[#F5F5F0] dark:bg-[#1D2B20] hover:bg-[#8BA88E]/20 text-[#2C3E2D] dark:text-[#C5D0C7] rounded-full text-[10px] font-medium border border-[#EBE7DF] dark:border-[#2D3E30] transition-colors shrink-0 disabled:opacity-50"
              >
                💡 {p}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white dark:bg-[#152017] border-t border-[#EBE7DF] dark:border-[#243326] flex items-center gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Savolingizni yozing..."
              disabled={loading}
              className="flex-1 bg-[#FDFBF7] dark:bg-[#101712] border border-[#EBE7DF] dark:border-[#283A2C] rounded-2xl px-3.5 py-2.5 text-xs text-[#2D2D2D] dark:text-[#E6EAE7] focus:outline-none focus:border-[#8BA88E] focus:ring-1 focus:ring-[#8BA88E] disabled:opacity-50 placeholder:text-[#828282]/60 dark:placeholder:text-[#7A8E7E]"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputMsg.trim() || loading}
              className="p-2.5 bg-[#2C3E2D] dark:bg-[#2F4632] hover:bg-[#1C2C1D] text-white rounded-2xl transition-all disabled:opacity-40 shrink-0 shadow-sm"
              title="Yuborish"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
