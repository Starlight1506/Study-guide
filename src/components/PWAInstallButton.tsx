import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-xl bg-[#2C3E2D] dark:bg-[#344E37] px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#1E2E20] transition"
        title="Ilovani qurilmaga o'rnatish"
      >
        <Download className="w-3.5 h-3.5 text-[#8BA88E]" />
        <span className="hidden sm:inline">Ilovani o'rnatish</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-xl border border-[#EBE7DF] dark:border-[#2C3E2D] bg-white dark:bg-[#19241B] px-3 py-1.5 text-xs font-bold text-[#2C3E2D] dark:text-[#D4DFD6] hover:bg-[#FAF8F5] transition"
        >
          <Download className="w-3.5 h-3.5 text-[#8BA88E]" />
          <span className="hidden sm:inline">iOS-ga o'rnatish</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#172219] p-6 shadow-xl border border-[#EBE7DF] dark:border-[#283A2A]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <img src="/pwa-192x192.png" alt="Smart High School" className="w-9 h-9 rounded-full object-cover" />
                  <h3 className="text-base font-bold text-[#1A2E1C] dark:text-white">iPhone / iPad-ga o'rnatish</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
                >
                  <X className="w-4 h-4 text-[#828282]" />
                </button>
              </div>
              <p className="text-xs text-[#2D2D2D] dark:text-[#D4DFD6] leading-relaxed">
                1. Safari pastki panelidagi <strong>Ulashish (Share)</strong> tugmasini bosing.<br />
                2. Pastga tushib <strong>"Asosiy ekranga qo'shish" (Add to Home Screen)</strong> bandini tanlang.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-[#2C3E2D] py-2 text-xs font-bold text-white hover:bg-[#1E2E20]"
              >
                Tushunarli
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
