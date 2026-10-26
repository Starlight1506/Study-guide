import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  UserCheck, 
  Lock, 
  Mail, 
  User as UserIcon, 
  ArrowRight, 
  Sparkles, 
  Award,
  CheckCircle2,
  Shield,
  Laptop,
  Palette,
  Eye,
  EyeOff,
  KeyRound,
  Check
} from 'lucide-react';
import { AppUser, UserRole } from './LoginModal';
import { ThemeToggle } from './ThemeToggle';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  authenticateStudent, 
  getStoredStudents, 
  authenticateTeacher, 
  authenticateAdmin,
  ADMIN_CREDENTIALS,
  TEACHER_CREDENTIALS 
} from '../services/studentManager';

interface LoginPageProps {
  onLoginSuccess: (user: AppUser) => void;
  onGoogleLogin?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onGoogleLogin,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successInfo, setSuccessInfo] = useState<string>('');

  const [availableStudents, setAvailableStudents] = useState<Array<{ login: string; pass: string; name: string }>>([]);

  useEffect(() => {
    const loaded = getStoredStudents();
    setAvailableStudents(loaded.map(s => ({ login: s.login, pass: s.password, name: s.fullName })));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessInfo('');

    const cleanInput = email.trim();
    const cleanPass = password.trim();

    if (!cleanInput || !cleanPass) {
      setError('Iltimos, barcha maydonlarni to\'ldiring');
      return;
    }

    // Check if Admin login
    if (selectedRole === 'admin') {
      if (!authenticateAdmin(cleanInput, cleanPass)) {
        setError("Admin logini yoki paroli noto'g'ri! (Standart login: admin | parol: Admin@2026#)");
        return;
      }
      const user: AppUser = {
        uid: 'admin_main',
        name: ADMIN_CREDENTIALS.name,
        email: cleanInput,
        role: 'admin',
        selectedTrack: null,
      };
      localStorage.setItem('it_portal_user', JSON.stringify(user));
      onLoginSuccess(user);
      return;
    }

    // Check if Teacher login
    if (selectedRole === 'teacher') {
      const matchedTeacher = authenticateTeacher(cleanInput, cleanPass);
      if (!matchedTeacher) {
        setError('O\'qituvchi logini yoki paroli noto\'g\'ri! Admin bergan o\'qituvchi login va parolini kiriting.');
        return;
      }

      const user: AppUser = {
        uid: matchedTeacher.id,
        name: matchedTeacher.fullName,
        email: matchedTeacher.login,
        role: 'teacher',
        selectedTrack: null,
      };
      localStorage.setItem('it_portal_user', JSON.stringify(user));
      onLoginSuccess(user);
      return;
    }

    // Student Authentication
    if (selectedRole === 'student') {
      const matchedStudent = authenticateStudent(cleanInput, cleanPass);
      if (matchedStudent) {
        const user: AppUser = {
          uid: matchedStudent.id,
          name: matchedStudent.fullName,
          email: matchedStudent.login,
          role: 'student',
          selectedTrack: matchedStudent.enrolledTrack === 'both' ? null : matchedStudent.enrolledTrack,
        };
        localStorage.setItem('it_portal_user', JSON.stringify(user));
        onLoginSuccess(user);
        return;
      }

      // Check if student login exists but password was wrong
      const allStudents = getStoredStudents();
      const existingLogin = allStudents.find(
        (s) => s.login.toLowerCase() === cleanInput.toLowerCase()
      );
      if (existingLogin) {
        setError(`"${cleanInput}" uchun kiritilgan parol noto'g'ri! Iltimos, o'qituvchingiz bergan parolni tekshiring.`);
        return;
      }

      if (isRegistering) {
        const userName = name.trim() || cleanInput.split('@')[0] || "O'quvchi";
        const user: AppUser = {
          uid: `std_custom_${Date.now()}`,
          name: userName,
          email: cleanInput,
          role: 'student',
          selectedTrack: null,
        };
        localStorage.setItem('it_portal_user', JSON.stringify(user));
        onLoginSuccess(user);
        return;
      }

      setError('Bunday o\'quvchi logini topilmadi! O\'qituvchingiz taqdim etgan login va parolni kiriting.');
    }
  };

  const handleFillCredentials = (itemLogin: string, itemPass: string) => {
    setSelectedRole('student');
    setIsRegistering(false);
    setEmail(itemLogin);
    setPassword(itemPass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0F1611] flex flex-col justify-between relative overflow-hidden transition-colors duration-300">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#8BA88E]/10 dark:bg-[#8BA88E]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2C3E2D]/10 dark:bg-[#2C3E2D]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      {/* Top Simple Brand Bar */}
      <header className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto w-full relative z-10">
        <div className="flex items-center gap-3">
          <img
            src="/pwa-192x192.png"
            alt="SMART HIGH SCHOOL Logo"
            className="w-11 h-11 rounded-full object-cover shadow-md border-2 border-[#8BA88E]/40"
          />
          <div>
            <h1 className="text-xl font-serif italic text-[#1A2E1C] dark:text-[#EBF1EC] font-bold tracking-tight">SMART HIGH SCHOOL</h1>
            <p className="text-[10px] text-[#8BA88E] font-bold tracking-wider uppercase">IT Savodxonlik va Dizayn Ta'lim Portali</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <PWAInstallButton />
          <ThemeToggle showLabel={false} />

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#828282] dark:text-[#A3B8A6] bg-white/80 dark:bg-[#19241B] px-3.5 py-1.5 rounded-full border border-[#EBE7DF] dark:border-[#2C3E2D]">
            <Shield className="w-3.5 h-3.5 text-[#8BA88E]" />
            <span>Xavfsiz Ta'lim Muhiti</span>
          </div>
        </div>
      </header>

      {/* Main Center Login Canvas */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10 my-4">
        <div className="bg-white dark:bg-[#172219] rounded-3xl w-full max-w-md shadow-2xl border border-[#EBE7DF] dark:border-[#283A2A] overflow-hidden transition-colors">
          
          {/* Card Header */}
          <div className="bg-[#2C3E2D] dark:bg-[#141F16] text-white p-6 sm:p-7 text-center relative border-b dark:border-[#243326]">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[#8BA88E] text-[11px] font-bold mb-3 border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Avtorizatsiya</span>
            </div>
            
            <h2 className="text-2xl font-serif italic font-bold">
              {isRegistering ? "Yangi Hisob Ochish" : "Tizimga Kirish"}
            </h2>
            <p className="text-xs text-[#8BA88E] mt-1.5 max-w-xs mx-auto">
              Platforma darslari, topshiriqlar va baholaringizni ko'rish uchun kiring
            </p>
          </div>

          {/* Role Switcher */}
          <div className="p-6 pb-2">
            <label className="text-[11px] font-bold text-[#828282] dark:text-[#8FA592] uppercase tracking-wider block mb-2 text-center">
              Kim sifatida kirmoqchisiz?
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-[#F5F5F0] dark:bg-[#111A13] p-1 rounded-2xl border border-[#EBE7DF] dark:border-[#243326]">
              <button
                type="button"
                onClick={() => { setSelectedRole('student'); setError(''); }}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  selectedRole === 'student'
                    ? 'bg-[#2C3E2D] dark:bg-[#2E4231] text-white shadow-md'
                    : 'text-[#828282] dark:text-[#8FA592] hover:text-[#2D2D2D] dark:hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                O'quvchi
              </button>
              <button
                type="button"
                onClick={() => { setSelectedRole('teacher'); setIsRegistering(false); setError(''); }}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  selectedRole === 'teacher'
                    ? 'bg-[#2C3E2D] dark:bg-[#2E4231] text-white shadow-md'
                    : 'text-[#828282] dark:text-[#8FA592] hover:text-[#2D2D2D] dark:hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                O'qituvchi
              </button>
              <button
                type="button"
                onClick={() => { setSelectedRole('admin'); setIsRegistering(false); setError(''); }}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  selectedRole === 'admin'
                    ? 'bg-[#2C3E2D] dark:bg-[#2E4231] text-white shadow-md'
                    : 'text-[#828282] dark:text-[#8FA592] hover:text-[#2D2D2D] dark:hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </button>
            </div>

            {/* Quick explanation of role */}
            <div className="mt-3 p-3 bg-[#FAF8F5] dark:bg-[#121A13] rounded-xl border border-[#EBE7DF] dark:border-[#243326] text-[11px] text-[#2C3E2D] dark:text-[#D4DFD6] flex items-center gap-2.5">
              {selectedRole === 'student' ? (
                <>
                  <KeyRound className="w-4 h-4 text-[#8BA88E] shrink-0" />
                  <span><strong>O'quvchi:</strong> O'qituvchi bergan login va parol orqali kiring va baholaringizni ko'ring.</span>
                </>
              ) : selectedRole === 'teacher' ? (
                <>
                  <Palette className="w-4 h-4 text-[#8BA88E] shrink-0" />
                  <span><strong>O'qituvchi:</strong> Admin bergan login/parol orqali kiring va har dars bo'yicha ball qo'ying.</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>
                    <strong>Admin:</strong> O'qituvchi login/parolini boshqarish va anonim baholarni ko'rish (Login: <code className="font-mono font-bold">admin</code> | Parol: <code className="font-mono font-bold">Admin@2026#</code>).
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 pt-3 flex flex-col gap-3.5">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs rounded-xl text-center font-medium">
                {error}
              </div>
            )}

            {isRegistering && (
              <div>
                <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6] block mb-1">To'liq ism-familiyangiz</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#828282] dark:text-[#8FA592] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masalan: Sardor Aliyev"
                    className="w-full pl-10 pr-3 py-2.5 bg-[#FDFBF7] dark:bg-[#121A14] border border-[#EBE7DF] dark:border-[#2C3E2D] rounded-xl text-xs text-[#2D2D2D] dark:text-[#E6EAE7] placeholder-[#828282] dark:placeholder-[#6C7E70] focus:outline-none focus:border-[#8BA88E] focus:ring-2 focus:ring-[#8BA88E]/20"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6] block mb-1">
                {selectedRole === 'student' ? "O'quvchi Logini (Foydalanuvchi nomi)" : "O'qituvchi Logini yoki Email"}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#828282] dark:text-[#8FA592] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={selectedRole === 'teacher' ? 'ustoz@savod.uz' : 'Masalan: azizbek2026'}
                  className="w-full pl-10 pr-3 py-2.5 bg-[#FDFBF7] dark:bg-[#121A14] border border-[#EBE7DF] dark:border-[#2C3E2D] rounded-xl text-xs text-[#2D2D2D] dark:text-[#E6EAE7] placeholder-[#828282] dark:placeholder-[#6C7E70] focus:outline-none focus:border-[#8BA88E] focus:ring-2 focus:ring-[#8BA88E]/20 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#D4DFD6] block mb-1">
                {selectedRole === 'student' ? "O'qituvchi bergan Parol" : "Parol"}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#828282] dark:text-[#8FA592] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#FDFBF7] dark:bg-[#121A14] border border-[#EBE7DF] dark:border-[#2C3E2D] rounded-xl text-xs text-[#2D2D2D] dark:text-[#E6EAE7] placeholder-[#828282] dark:placeholder-[#6C7E70] focus:outline-none focus:border-[#8BA88E] focus:ring-2 focus:ring-[#8BA88E]/20 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#828282] dark:text-[#8FA592] hover:text-[#2D2D2D] dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-1.5 py-3 bg-[#2C3E2D] dark:bg-[#243627] hover:bg-[#1C2C1D] dark:hover:bg-[#2D4531] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 border dark:border-[#39533E]"
            >
              <span>{isRegistering ? 'Ro\'yxatdan O\'tish' : 'Tizimga Kirish'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Switch Login/Register (Student only) */}
            {selectedRole === 'student' && (
              <div className="text-center mt-0.5">
                <button
                  type="button"
                  onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                  className="text-xs text-[#8BA88E] dark:text-[#A8C5AB] hover:underline font-bold"
                >
                  {isRegistering
                    ? 'Akkauntingiz bormi? Tizimga kirish'
                    : 'Yangi hisob yaratish (O\'quvchi ro\'yxatdan o\'tish)'}
                </button>
              </div>
            )}

            {/* Google Auth option */}
            {onGoogleLogin && (
              <button
                type="button"
                onClick={onGoogleLogin}
                className="w-full py-2.5 bg-white dark:bg-[#121A13] hover:bg-slate-50 dark:hover:bg-[#1B271D] border border-slate-200 dark:border-[#283A2A] text-slate-700 dark:text-[#D4DFD6] rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 mt-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                Google hisobi orqali kirish
              </button>
            )}

          </form>

        </div>
      </main>

      {/* Footer info banner */}
      <footer className="p-4 text-center text-xs text-[#828282] dark:text-[#8FA592] border-t border-[#EBE7DF] dark:border-[#283A2A] bg-white/50 dark:bg-[#121A13]/60 relative z-10">
        <p>🌙 Tungi o'qish uchun qulay ko'z himoyasi (Dark Mode) va O'qituvchi baholash tizimi faol.</p>
      </footer>
    </div>
  );
};
