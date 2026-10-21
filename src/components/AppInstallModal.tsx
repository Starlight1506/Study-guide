import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  Copy,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Zap,
  Globe,
  Share2
} from 'lucide-react';

interface AppInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppInstallModal({ isOpen, onClose }: AppInstallModalProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-zqpasodhwk5ta6hywzwlgi-236210198431.asia-southeast1.run.app';

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        onClose();
      }
    } else {
      alert("Ilovani o'rnatish uchun: brauzeringizning yuqori o'ng burchagidagi 3 nuqta (⋮) menyusini oching va 'Ilovani o'rnatish' yoki 'Bosh ekranga qo'shish' tugmasini bosing.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#121A13] rounded-3xl shadow-2xl border border-[#EBE7DF] dark:border-[#243326] overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-br from-[#1C2C1D] via-[#2A3E2C] to-[#1E3022] text-white p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition z-10"
            title="Yopish"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md p-1.5 border border-white/20 shrink-0 shadow-lg">
              <img src="/icon.svg" alt="App Icon" className="w-full h-full object-contain rounded-xl" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-1">
                <Smartphone className="w-3 h-3" />
                <span>Mobil Ilova & APK Yo'riqnomasi</span>
              </div>
              <h3 className="text-xl font-serif italic font-bold">
                Saytni APK Qilib Chiqarish
              </h3>
              <p className="text-xs text-white/80 mt-0.5">
                O'quvchilar va ota-onalar telefoniga o'rnatishning 2 ta eng qulay usuli
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-5 max-h-[75vh] overflow-y-auto">
          
          {/* USUL 1: TELEFONGA TEZKOR O'RNATISH (PWA) */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  1
                </span>
                <h4 className="font-bold text-sm text-[#1A2E1C] dark:text-[#E6EAE7]">
                  Telefonning o'ziga to'g'ridan-to'g'ri o'rnatish (PWA)
                </h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200">
                APK-siz, 1 soniyada
              </span>
            </div>

            <p className="text-xs text-[#2D2D2D] dark:text-[#C5D0C7] leading-relaxed mb-4">
              Saytimiz to'liq <strong>PWA (Progressive Web App)</strong> formatida tayyorlangan. O'quvchi saytni telefon brauzerida ochganda "Ilovani o'rnatish" tugmasini bossa kifoya — xuddi Play Marketdan o'rnatilgandek telefon menyusiga alohida ilova bo'lib tushadi.
            </p>

            <button
              onClick={handleNativeInstall}
              disabled={isInstalled}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm ${
                isInstalled
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-[#2C3E2D] hover:bg-[#1C2C1D] text-white'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{isInstalled ? "Ilova allaqachon o'rnatilgan ✓" : "Ushbu Qurilmaga Hoziroq O'rnatish"}</span>
            </button>
          </div>

          {/* USUL 2: HAQIQIY .APK FAYL YASASH (PWABUILDER ORQALI) */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#162217] border border-[#EBE7DF] dark:border-[#243326]">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  2
                </span>
                <h4 className="font-bold text-sm text-[#1A2E1C] dark:text-[#E6EAE7]">
                  Haqiqiy .APK faylini yuklab olish (PWABuilder orqali)
                </h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/40">
                Eng ommabop usul
              </span>
            </div>

            <p className="text-xs text-[#828282] dark:text-[#9FB1A2] mb-3">
              Microsoft va Google tomonidan yaratilgan <strong>PWABuilder</strong> tizimi orqali saytingizdan bepul tayyor <code>.apk</code> fayl yuklab olasiz:
            </p>

            <div className="space-y-3 mb-4">
              {/* Step 1 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#283A2C]">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">1-qadam:</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#1A2E1C] dark:text-[#E6EAE7]">
                    Saytingiz havolasini nusxalang:
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <input
                      type="text"
                      readOnly
                      value={appUrl}
                      className="w-full text-[11px] font-mono bg-[#FAF8F5] dark:bg-[#1A261D] px-2.5 py-1.5 rounded-lg border border-[#EBE7DF] dark:border-[#283A2C] text-[#2C3E2D] dark:text-[#C5D0C7] select-all truncate"
                    />
                    <button
                      onClick={handleCopyUrl}
                      className="px-3 py-1.5 bg-[#2C3E2D] hover:bg-[#1C2C1D] text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0"
                    >
                      {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUrl ? "Nusxalandi" : "Nusxalash"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#283A2C]">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">2-qadam:</span>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#1A2E1C] dark:text-[#E6EAE7]">
                    PWABuilder xizmatiga kiring:
                  </p>
                  <p className="text-[11px] text-[#828282] dark:text-[#9FB1A2] mt-0.5">
                    Saytga kirib nusxalangan havolani qo'ying va <strong>"Start"</strong> tugmasini bosing.
                  </p>
                  <a
                    href="https://www.pwabuilder.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline mt-1"
                  >
                    <span>PWABuilder.com saytini ochish</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-[#111A13] border border-[#EBE7DF] dark:border-[#283A2C]">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">3-qadam:</span>
                <div>
                  <p className="text-xs font-semibold text-[#1A2E1C] dark:text-[#E6EAE7]">
                    APK faylini yuklab oling:
                  </p>
                  <p className="text-[11px] text-[#828282] dark:text-[#9FB1A2] mt-0.5">
                    <strong>"Package for Stores"</strong> bo'limidan <strong>Android</strong> ni tanlab, <strong>"Generate Package"</strong> tugmasini bosing. Tayyor <code>.apk</code> fayli yuklanadi!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Telegram / Share Info */}
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 flex items-start gap-3">
            <Share2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs text-[#2D2D2D] dark:text-[#C5D0C7]">
              <p className="font-bold text-blue-900 dark:text-blue-200">
                O'quvchilarga tarqatish:
              </p>
              <p className="mt-0.5 text-[11px] text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
                Yuklab olingan <code>.apk</code> faylini yoki to'g'ridan-to'g'ri sayt havolasini Telegram guruhiga tashlab bersangiz, barcha o'quvchilar o'z telefoniga osongina o'rnatib olishadi.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FAF8F5] dark:bg-[#111A13] border-t border-[#EBE7DF] dark:border-[#243326] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#2C3E2D] hover:bg-[#1C2C1D] text-white rounded-xl text-xs font-bold transition"
          >
            Tushundim
          </button>
        </div>

      </div>
    </div>
  );
}
