import React, { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  UserCheck, 
  Lock, 
  Mail, 
  User as UserIcon, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck,
  CheckCircle2,
  LogIn
} from 'lucide-react';
import { 
  authenticateStudent, 
  getStoredStudents, 
  authenticateTeacher, 
  TEACHER_CREDENTIALS 
} from '../services/studentManager';

export type UserRole = 'student' | 'teacher';

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  selectedTrack?: 'literacy' | 'design' | null;
  photoURL?: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AppUser) => void;
  onGoogleLogin?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onGoogleLogin,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanInput = email.trim();
    const cleanPass = password.trim();

    if (!cleanInput || !cleanPass) {
      setError('Iltimos, barcha maydonlarni to\'ldiring');
      return;
    }

    // 1. Teacher Authentication (Only single teacher account)
    if (selectedRole === 'teacher') {
      if (!authenticateTeacher(cleanInput, cleanPass)) {
        setError('O\'qituvchi logini yoki paroli noto\'g\'ri! Faqat ruxsat etilgan o\'qituvchi akkaunti orqali kirish mumkin.');
        return;
      }

      const teacherUser: AppUser = {
        uid: 'teacher_assadxoja',
        name: TEACHER_CREDENTIALS.name,
        email: TEACHER_CREDENTIALS.login,
        role: 'teacher',
        selectedTrack: null,
      };

      localStorage.setItem('it_portal_user', JSON.stringify(teacherUser));
      onLoginSuccess(teacherUser);
      onClose();
      return;
    }

    // 2. Student Authentication
    if (selectedRole === 'student') {
      const student = authenticateStudent(cleanInput, cleanPass);
      if (student) {
        const user: AppUser = {
          uid: student.id,
          name: student.fullName,
          email: student.login,
          role: 'student',
          selectedTrack: student.enrolledTrack === 'both' ? null : student.enrolledTrack,
        };
        localStorage.setItem('it_portal_user', JSON.stringify(user));
        onLoginSuccess(user);
        onClose();
        return;
      }

      // Check if student login exists
      const allStudents = getStoredStudents();
      const existingLogin = allStudents.find(
        (s) => s.login.toLowerCase() === cleanInput.toLowerCase()
      );
      if (existingLogin) {
        setError('Parol noto\'g\'ri! O\'qituvchingiz bergan parolni tekshirib qayta kiriting.');
        return;
      }

      if (isRegistering) {
        const userName = name.trim() || cleanInput.split('@')[0] || "O'quvchi";
        const user: AppUser = {
          uid: `local_student_${Date.now()}`,
          name: userName,
          email: cleanInput,
          role: 'student',
          selectedTrack: null,
        };
        localStorage.setItem('it_portal_user', JSON.stringify(user));
        onLoginSuccess(user);
        onClose();
        return;
      }

      setError('Bunday o\'quvchi logini topilmadi! Iltimos, o\'qituvchingiz bergan login va parolni kiriting.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-[#121B14] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-[#EBE7DF] dark:border-[#2D3E30] relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white hover:bg-[#F5F5F0] dark:hover:bg-[#1C281F] rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-[#2C3E2D] dark:bg-[#1C2C1E] text-white p-6 pt-7 text-center relative border-b border-[#243326]">
          <div className="w-12 h-12 rounded-2xl bg-[#8BA88E]/20 border border-[#8BA88E]/40 mx-auto flex items-center justify-center mb-3 text-[#8BA88E]">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-serif italic font-bold">IT Savodxonlik Portaliga Kirish</h2>
          <p className="text-xs text-[#8BA88E] mt-1 font-sans">
            Ta'lim platformasidan to'liq foydalanish uchun hisobingizga kiring
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="p-6 pb-2">
          <label className="text-[11px] font-bold text-[#828282] dark:text-[#9FB1A2] uppercase tracking-wider block mb-2 text-center">
            Kim sifatida kirmoqchisiz?
          </label>
          <div className="grid grid-cols-2 gap-2 bg-[#F5F5F0] dark:bg-[#18241B] p-1 rounded-2xl border border-[#EBE7DF] dark:border-[#283A2C]">
            <button
              type="button"
              onClick={() => { setSelectedRole('student'); setError(''); }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                selectedRole === 'student'
                  ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white shadow-md'
                  : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              👨‍🎓 O'quvchi
            </button>
            <button
              type="button"
              onClick={() => { setSelectedRole('teacher'); setIsRegistering(false); setError(''); }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                selectedRole === 'teacher'
                  ? 'bg-[#2C3E2D] dark:bg-[#2F4632] text-white shadow-md'
                  : 'text-[#828282] dark:text-[#9FB1A2] hover:text-[#2D2D2D] dark:hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              👨‍🏫 O'qituvchi
            </button>
          </div>

          {/* Role Description Notice */}
          <div className="mt-3 p-3 bg-[#FAF8F5] dark:bg-[#162218] rounded-xl border border-[#EBE7DF] dark:border-[#283A2C] text-[11px] text-[#2C3E2D] dark:text-[#C5D0C7] flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#8BA88E] shrink-0 mt-0.5" />
            {selectedRole === 'student' ? (
              <p>
                <strong>O'quvchi:</strong> O'qituvchingiz taqdim etgan login va parolni kiriting.
              </p>
            ) : (
              <p>
                <strong>O'qituvchi:</strong> Assadxoja o'qituvchi akkaunti orqali tizimga kiring.
              </p>
            )}
          </div>
        </div>

        {/* Login / Register Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-3 flex flex-col gap-3.5">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs rounded-xl text-center font-medium">
              {error}
            </div>
          )}

          {isRegistering && selectedRole === 'student' && (
            <div>
              <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#E6EAE7] block mb-1">To'liq ismingiz</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#828282] dark:text-[#9FB1A2] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masalan: Sardor Aliyev"
                  className="w-full pl-10 pr-3 py-2.5 bg-[#FDFBF7] dark:bg-[#162218] border border-[#EBE7DF] dark:border-[#283A2C] text-[#2D2D2D] dark:text-[#E6EAE7] rounded-xl text-xs focus:outline-none focus:border-[#8BA88E] focus:ring-2 focus:ring-[#8BA88E]/20"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#E6EAE7] block mb-1">
              {selectedRole === 'teacher' ? "O'qituvchi Logini" : "O'quvchi Logini"}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#828282] dark:text-[#9FB1A2] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={selectedRole === 'teacher' ? 'Assadxoja' : 'Loginni kiriting'}
                className="w-full pl-10 pr-3 py-2.5 bg-[#FDFBF7] dark:bg-[#162218] border border-[#EBE7DF] dark:border-[#283A2C] text-[#2D2D2D] dark:text-[#E6EAE7] rounded-xl text-xs focus:outline-none focus:border-[#8BA88E] focus:ring-2 focus:ring-[#8BA88E]/20 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#2C3E2D] dark:text-[#E6EAE7] block mb-1">Parol</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#828282] dark:text-[#9FB1A2] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 bg-[#FDFBF7] dark:bg-[#162218] border border-[#EBE7DF] dark:border-[#283A2C] text-[#2D2D2D] dark:text-[#E6EAE7] rounded-xl text-xs focus:outline-none focus:border-[#8BA88E] focus:ring-2 focus:ring-[#8BA88E]/20 font-mono"
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="w-full mt-2 py-3 bg-[#2C3E2D] dark:bg-[#2F4632] hover:bg-[#1C2C1D] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            {isRegistering ? 'Ro\'yxatdan O\'tish' : 'Tizimga Kirish'}
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Switch Login/Register (Only for student) */}
          {selectedRole === 'student' && (
            <div className="text-center mt-1">
              <button
                type="button"
                onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                className="text-xs text-[#8BA88E] hover:underline font-bold"
              >
                {isRegistering
                  ? 'Akkauntingiz bormi? Kirish'
                  : 'Yangi hisob yaratish (O\'quvchi ro\'yxatdan o\'tish)'}
              </button>
            </div>
          )}

          {/* Google Auth fallback if available */}
          {onGoogleLogin && (
            <button
              type="button"
              onClick={() => {
                onGoogleLogin();
                onClose();
              }}
              className="w-full py-2.5 mt-2 bg-white dark:bg-[#162218] hover:bg-slate-50 dark:hover:bg-[#1E2D20] border border-slate-200 dark:border-[#283A2C] text-slate-700 dark:text-[#E6EAE7] rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
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
              Google orqali kirish
            </button>
          )}

        </form>

      </div>
    </div>
  );
};
