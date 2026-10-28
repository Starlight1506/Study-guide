import { getStoredStudents, StudentAccount } from './studentManager';

export type SmartCoinCategory =
  | 'faollik'
  | 'natija'
  | 'intizom'
  | 'fikrlash'
  | 'osish'
  | 'bellashuv';

export interface SmartCoinRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentLogin?: string;
  studentGradeClass?: string;
  amount: number; // Strictly positive (> 0). Rule: Koinlarni jazo sifatida qaytarib olmang!
  category: SmartCoinCategory;
  reason: string; // Rule: Har bir koinning aniq sababi bo'lsin!
  track?: 'literacy' | 'design' | 'general';
  lessonId?: number | null;
  teacherName: string;
  awardedAt: string;
}

export interface SmartCoinCategoryInfo {
  id: SmartCoinCategory;
  label: string;
  shortLabel: string;
  emoji: string;
  defaultCoins: number;
  description: string;
  sampleReasons: string[];
}

export const SMART_COIN_CATEGORIES: SmartCoinCategoryInfo[] = [
  {
    id: 'faollik',
    label: 'Darsdagi faollik',
    shortLabel: 'Faollik',
    emoji: '🔥',
    defaultCoins: 10,
    description: "Dars davomida savol-javoblarda va amaliy mashg'ulotlarda faol ishtirok etgani uchun",
    sampleReasons: [
      'Darsda savollarga tezkor va aniq javob berib faollik ko\'rsatdi',
      'Mavzu muhokamasida eng faol ishtirok etdi',
      'Amaliy mashg\'ulotni birinchilardan bo\'lib sifatli bajardi',
    ],
  },
  {
    id: 'natija',
    label: 'Yaxshi natija',
    shortLabel: 'Yaxshi natija',
    emoji: '🏆',
    defaultCoins: 15,
    description: "Amaliy topshiriq, uyga vazifa yoki imtihon loyihasida yuqori natija ko'rsatgani uchun",
    sampleReasons: [
      'Amaliy topshiriqni xatosiz va a\'lo darajada yakunladi',
      'Uyga vazifani o\'z vaqtida va yuqori sifatda topshirdi',
      'Dars yakunidagi amaliy sinovda yuqori natija qayd etdi',
    ],
  },
  {
    id: 'intizom',
    label: 'Namunali intizom',
    shortLabel: 'Intizom',
    emoji: '🤝',
    defaultCoins: 10,
    description: "Darsga o'z vaqtida kelishi, tartib-intizomi va sinfdoshlariga hurmati uchun",
    sampleReasons: [
      'Dars davomida namunali intizom va diqqat-e\'tibor ko\'rsatdi',
      'Sinfdoshlariga amaliy topshiriqda samimiy yordam berdi',
      'Dars qoidalariga va kompyuter xavfsizligiga to\'liq amal qildi',
    ],
  },
  {
    id: 'fikrlash',
    label: 'Mustaqil fikrlash',
    shortLabel: 'Mustaqil fikrlash',
    emoji: '💡',
    defaultCoins: 15,
    description: "Nostandart kreativ yechim, mustaqil g'oya va chuqur tahlil qilgani uchun",
    sampleReasons: [
      'Topshiriqni bajarishda mustaqil va kreativ yechim taklif qildi',
      'Kodni / dizaynni mustaqil tahlil qilib, yangi g\'oya qo\'shdi',
      'Ustoz yordamisiz murakkab muammoning yechimini topdi',
    ],
  },
  {
    id: 'osish',
    label: "Shaxsiy o'sish va harakat",
    shortLabel: "Shaxsiy o'sish",
    emoji: '📈',
    defaultCoins: 15,
    description: "Harakat qilayotgan, intilayotgan va oldingi natijasini yaxshilayotgan o'quvchini rag'batlantirish",
    sampleReasons: [
      'O\'z ustida tinimsiz ishlab, oldingi natijasini sezilarli yaxshiladi',
      'Qiyin mavzuni o\'zlashtirishda katta tirishqoqlik va intilish ko\'rsatdi',
      'Har darsda shaxsiy o\'sish va bilim olishga kuchli ishtiyoq namoyish etmoqda',
    ],
  },
  {
    id: 'bellashuv',
    label: 'Bilim bellashuvi va musobaqa',
    shortLabel: 'Bilim bellashuvi',
    emoji: '⚡',
    defaultCoins: 25,
    description: "Guruh ichidagi bilim bellashuvlari, viktorinalar va jamoaviy musobaqalardagi faolligi uchun",
    sampleReasons: [
      'Haftalik bilim bellashuvida faol qatnashib, yuqori o\'rin oldi',
      'Interaktiv viktorina va savol-javob musobaqasi g\'olibi bo\'ldi',
      'Jamoaviy loyiha himoyasida yetakchilik ko\'rsatdi',
    ],
  },
];

export const SMART_COIN_CHARTER = {
  title: 'ҲУРМАТЛИ SMART HIGH SCHOOL УСТОЗЛАРИ!',
  intro:
    'Марказимизда ўқувчиларнинг билим олишга бўлган қизиқишини ошириш, интизомини мустаҳкамлаш ва соғлом рақобат муҳитини яратиш мақсадида SMART COIN тизими жорий этилмоқда.',
  subtitle: 'Ҳар бир устоздан қуйидаги қоидаларга амал қилиш сўралади:',
  rules: [
    'Дарсдаги фаоллик, яхши натижа, интизом, мустақил фикрлаш ва шахсий ўсиш учун коин беринг.',
    'Ҳар бир коиннинг аниқ сабаби бўлсин.',
    'Барча ўқувчиларга тенг ва адолатли муносабатда бўлинг.',
    'Берилган коинларни журналда қайд қилинг.',
    'Ўқувчиларни коин тўплашга ва билим беллашувларида қатнашишга рағбатлантиринг.',
    'Коинларни жазо сифатида қайтариб олманг.',
    'Ҳафталик натижаларни маъмурият билан келишилган тартибда тақдим этинг.',
    'Ҳар ҳафта фаол ўқувчилар аниқланади, ҳар ой эса SMART COIN чемпионлари тақдирланади.',
  ],
  note: 'Эсда тутинг: биз фақат юқори баҳо олган болани эмас, ҳаракат қилаётган, интилаётган ва ўз натижасини яхшилаётган ҳар бир ўқувчини рағбатлантирамиз.',
  symbolism: 'SMART COIN — бу шунчаки танга эмас, бу билим, интизом ва ютуқлар рамзи!',
  closing: 'Ҳаммамиз биргаликда ушбу тизимни самарали йўлга қўямиз.',
  motto: 'SMART HIGH SCHOOL — ҲАР БИР ҲАРАКАТ ҚАДРЛИ!',
};

const COINS_STORAGE_KEY = 'it_portal_smart_coins_v1';

export function getCategoryInfo(cat: SmartCoinCategory): SmartCoinCategoryInfo {
  return SMART_COIN_CATEGORIES.find((c) => c.id === cat) || SMART_COIN_CATEGORIES[0];
}

export function getStoredSmartCoins(): SmartCoinRecord[] {
  try {
    const raw = localStorage.getItem(COINS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: SmartCoinRecord[] = JSON.parse(raw);
    return parsed
      .filter((c) => c && typeof c.amount === 'number' && c.amount > 0)
      .sort((a, b) => new Date(b.awardedAt).getTime() - new Date(a.awardedAt).getTime());
  } catch (e) {
    console.error('Error reading smart coins from storage:', e);
    return [];
  }
}

const COINS_CLOUD_MIGRATED_FLAG = 'it_portal_coins_cloud_migrated_v2';

export async function syncSmartCoinsFromServer(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const isMigrated = localStorage.getItem(COINS_CLOUD_MIGRATED_FLAG) === 'true';
    const localCoins = getStoredSmartCoins();

    const res = await fetch('/api/smart-coins');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.coins)) {
        const coinMap = new Map<string, SmartCoinRecord>();
        data.coins.forEach((c: SmartCoinRecord) => coinMap.set(c.id, c));

        if (!isMigrated) {
          for (const locC of localCoins) {
            if (!coinMap.has(locC.id)) {
              coinMap.set(locC.id, locC);
              fetch('/api/smart-coins', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(locC),
              }).catch(() => {});
            }
          }
          localStorage.setItem(COINS_CLOUD_MIGRATED_FLAG, 'true');
        }

        const merged = Array.from(coinMap.values());
        localStorage.setItem(COINS_STORAGE_KEY, JSON.stringify(merged));
        window.dispatchEvent(new CustomEvent('smart_coins_updated'));
      }
    }
  } catch (err) {
    console.error('Background sync for smart coins failed:', err);
  }
}

if (typeof window !== 'undefined') {
  syncSmartCoinsFromServer();
  setInterval(syncSmartCoinsFromServer, 8000);
  window.addEventListener('focus', syncSmartCoinsFromServer);
  window.addEventListener('students_updated', syncSmartCoinsFromServer);
}

export function awardSmartCoin(params: {
  studentId: string;
  studentName: string;
  studentLogin?: string;
  studentGradeClass?: string;
  amount: number;
  category: SmartCoinCategory;
  reason: string;
  track?: 'literacy' | 'design' | 'general';
  lessonId?: number | null;
  teacherName?: string;
}): SmartCoinRecord {
  const cleanAmount = Math.round(Number(params.amount));
  if (!cleanAmount || cleanAmount <= 0) {
    throw new Error("Koinlarni jazo sifatida qaytarib olish mumkin emas! Faqat musbat miqdorda SMART COIN bering.");
  }
  const cleanReason = (params.reason || '').trim();
  if (!cleanReason) {
    throw new Error("Har bir koinning aniq sababi bo'lishi shart!");
  }

  const record: SmartCoinRecord = {
    id: `sc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    studentId: params.studentId,
    studentName: params.studentName.trim(),
    studentLogin: params.studentLogin?.trim() || '',
    studentGradeClass: params.studentGradeClass?.trim() || '5-sinf',
    amount: cleanAmount,
    category: params.category,
    reason: cleanReason,
    track: params.track || 'general',
    lessonId: params.lessonId || null,
    teacherName: params.teacherName?.trim() || 'Assadxoja',
    awardedAt: new Date().toISOString(),
  };

  const current = getStoredSmartCoins();
  const updated = [record, ...current];
  localStorage.setItem(COINS_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('smart_coins_updated'));

  fetch('/api/smart-coins', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  }).catch((e) => console.error('Failed to sync smart coin to server:', e));

  return record;
}

export function isWithinCurrentWeek(isoDate: string): boolean {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  return diffMs >= 0 && diffMs <= 7 * 24 * 60 * 60 * 1000;
}

export function isWithinCurrentMonth(isoDate: string): boolean {
  const date = new Date(isoDate);
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

export interface StudentCoinSummary {
  studentId: string;
  studentName: string;
  studentLogin: string;
  gradeClass: string;
  totalCoins: number;
  weeklyCoins: number;
  monthlyCoins: number;
  awardsCount: number;
  categoryBreakdown: Record<SmartCoinCategory, number>;
  recentAwards: SmartCoinRecord[];
  levelBadge: string;
}

export function getCoinLevelBadge(totalCoins: number): string {
  if (totalCoins >= 250) return '👑 SMART COIN Imperatori';
  if (totalCoins >= 150) return '💎 SMART COIN Chempioni';
  if (totalCoins >= 80) return '🥇 Oltin Intiluvchi';
  if (totalCoins >= 35) return '🥈 Faol Ishtirokchi';
  if (totalCoins > 0) return '🥉 Harakatdagi Yulduz';
  return '🌱 Yangi Ishtirokchi';
}

export function getStudentCoinSummary(
  studentIdentifier: string,
  studentName?: string
): StudentCoinSummary {
  const allCoins = getStoredSmartCoins();
  const cleanId = (studentIdentifier || '').toLowerCase().trim();
  const cleanName = (studentName || '').toLowerCase().trim();

  const myCoins = allCoins.filter(
    (c) =>
      c.studentId.toLowerCase() === cleanId ||
      (c.studentLogin && c.studentLogin.toLowerCase() === cleanId) ||
      (cleanName && c.studentName.toLowerCase() === cleanName)
  );

  const categoryBreakdown: Record<SmartCoinCategory, number> = {
    faollik: 0,
    natija: 0,
    intizom: 0,
    fikrlash: 0,
    osish: 0,
    bellashuv: 0,
  };

  let totalCoins = 0;
  let weeklyCoins = 0;
  let monthlyCoins = 0;

  myCoins.forEach((c) => {
    totalCoins += c.amount;
    if (isWithinCurrentWeek(c.awardedAt)) {
      weeklyCoins += c.amount;
    }
    if (isWithinCurrentMonth(c.awardedAt)) {
      monthlyCoins += c.amount;
    }
    if (categoryBreakdown[c.category] !== undefined) {
      categoryBreakdown[c.category] += c.amount;
    }
  });

  return {
    studentId: studentIdentifier,
    studentName: studentName || myCoins[0]?.studentName || "O'quvchi",
    studentLogin: myCoins[0]?.studentLogin || studentIdentifier,
    gradeClass: myCoins[0]?.studentGradeClass || '5-sinf',
    totalCoins,
    weeklyCoins,
    monthlyCoins,
    awardsCount: myCoins.length,
    categoryBreakdown,
    recentAwards: myCoins,
    levelBadge: getCoinLevelBadge(totalCoins),
  };
}

export interface SmartCoinLeaderboardEntry {
  rank: number;
  student: StudentAccount;
  summary: StudentCoinSummary;
  periodCoins: number;
  isWeeklyActive: boolean;
  isMonthlyChampion: boolean;
}

export function getSmartCoinLeaderboard(
  period: 'all' | 'weekly' | 'monthly' = 'all'
): SmartCoinLeaderboardEntry[] {
  const students = getStoredStudents();
  const allCoins = getStoredSmartCoins();

  // Ensure any student referenced in coin records is included even if not in local students list
  const studentMap = new Map<string, StudentAccount>();
  students.forEach((s) => studentMap.set(s.id, s));

  allCoins.forEach((c) => {
    if (!studentMap.has(c.studentId)) {
      const byName = students.find(
        (s) => s.fullName.toLowerCase() === c.studentName.toLowerCase()
      );
      if (!byName) {
        studentMap.set(c.studentId, {
          id: c.studentId,
          fullName: c.studentName,
          login: c.studentLogin || c.studentId,
          password: '',
          gradeClass: c.studentGradeClass || '5-sinf',
          enrolledTrack: 'both',
          createdAt: c.awardedAt,
        });
      }
    }
  });

  const entries = Array.from(studentMap.values()).map((student) => {
    const summary = getStudentCoinSummary(student.id, student.fullName);
    const periodCoins =
      period === 'weekly'
        ? summary.weeklyCoins
        : period === 'monthly'
          ? summary.monthlyCoins
          : summary.totalCoins;
    return {
      rank: 0,
      student,
      summary,
      periodCoins,
      isWeeklyActive: false,
      isMonthlyChampion: false,
    };
  });

  entries.sort((a, b) => {
    if (b.periodCoins !== a.periodCoins) return b.periodCoins - a.periodCoins;
    if (b.summary.totalCoins !== a.summary.totalCoins)
      return b.summary.totalCoins - a.summary.totalCoins;
    return a.student.fullName.localeCompare(b.student.fullName);
  });

  // Determine top weekly active and top monthly champion
  const maxWeekly = Math.max(0, ...entries.map((e) => e.summary.weeklyCoins));
  const maxMonthly = Math.max(0, ...entries.map((e) => e.summary.monthlyCoins));

  return entries.map((entry, idx) => ({
    ...entry,
    rank: idx + 1,
    isWeeklyActive: entry.summary.weeklyCoins > 0 && entry.summary.weeklyCoins >= maxWeekly,
    isMonthlyChampion: entry.summary.monthlyCoins > 0 && entry.summary.monthlyCoins >= maxMonthly,
  }));
}

export function generateAdminReportText(period: 'weekly' | 'monthly' = 'weekly'): string {
  const leaderboard = getSmartCoinLeaderboard(period);
  const activeEntries = leaderboard.filter((e) => e.periodCoins > 0);
  const totalDistributed = activeEntries.reduce((sum, e) => sum + e.periodCoins, 0);
  const dateStr = new Date().toLocaleDateString('uz-UZ');

  const header =
    period === 'weekly'
      ? `📊 SMART HIGH SCHOOL — HAFTALIK SMART COIN HISOBOTI (${dateStr})`
      : `🏆 SMART HIGH SCHOOL — OYLIK SMART COIN CHEMPIONLARI HISOBOTI (${dateStr})`;

  const lines: string[] = [
    header,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Jami berilgan SMART COIN: ${totalDistributed} SC`,
    `Rag'batlantirilgan faol o'quvchilar soni: ${activeEntries.length} nafar`,
    ``,
    period === 'weekly' ? `🔥 HAFTA FAOLLARI REYTINGI:` : `👑 OYNING SMART COIN CHEMPIONLARI:`,
  ];

  if (activeEntries.length === 0) {
    lines.push(`Hozircha ushbu davr uchun SMART COIN qayd etilmagan.`);
  } else {
    activeEntries.slice(0, 15).forEach((item, index) => {
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
      const lastReason = item.summary.recentAwards[0]?.reason || "Faol ishtirok";
      lines.push(
        `${medal} ${item.student.fullName} (${item.student.gradeClass}) — +${item.periodCoins} SC (Jami: ${item.summary.totalCoins} SC) | Oxirgi sabab: "${lastReason}"`
      );
    });
  }

  lines.push(
    ``,
    `💎 SMART COIN — bu shunchaki tanga emas, bu билим, интизом ва ютуқлар рамзи!`,
    `🚀 SMART HIGH SCHOOL — ҲАР БИР ҲАРАКАТ ҚАДРЛИ!`
  );

  return lines.join('\n');
}
