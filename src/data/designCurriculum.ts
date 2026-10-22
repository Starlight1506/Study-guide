export interface DesignLesson {
  id: number;
  lessonNumber: number;
  week: string;
  title: string;
  module: string;
  level: "Boshlang'ich" | "O'rta" | 'Amaliy Loyiha';
  duration: string;
  tools: string[];
  description: string;
  codeExample?: string;
  theory: {
    mainConcept: string;
    rules: string[];
    analogy: string;
  };
  practice: {
    taskTitle: string;
    taskSteps: string[];
    expectedOutput: string;
  };
  proTips: string[];
  videoUrl?: string;
}

export interface DesignModule {
  id: number;
  category: 'design' | 'frontend';
  title: string;
  goal: string;
  description: string;
  badge: string;
  durationBadge: string;
  lessons: DesignLesson[];
}

export const DESIGN_AND_FRONTEND_MODULES: DesignModule[] = [
  // ============================================================================
  // 1-MODUL: CANVA — TEZKOR GRAFIK DIZAYN VA BRENDING (1 OY / 12 TA DARS)
  // ============================================================================
  {
    id: 1,
    category: 'design',
    title: '1-MODUL: CANVA — TEZKOR GRAFIK DIZAYN VA BRENDING',
    goal: "Ranglar uyg'unligi, kompozitsiya va tipografika qoidalarini o'zlashtirish, ijtimoiy tarmoqlar, biznes va reklama uchun professional vizuallar yaratish.",
    description: "Canva asoslari, ranglar psixologiyasi, tipografika, SMM dizayn, bosma mahsulotlar va Canva AI (1 oy / 12 ta dars).",
    badge: '1-Oy · Canva & Brending',
    durationBadge: '1 OY / 12 TA DARS',
    lessons: [
      {
        id: 101,
        lessonNumber: 1,
        week: '1-hafta: Canva asoslari va vizual savodxonlik',
        title: "Canva platformasi imkoniyatlari. Ro'yxatdan o'tish, ish paneli, o'lchamlar (piksel, sm) va shablonlar (Templates) bilan ishlash",
        module: '1-Modul: Canva',
        level: "Boshlang'ich",
        duration: '60 daqiqa',
        tools: ['Canva.com', 'Web Browser'],
        description: "Canva platformasida hisob ochish, ishchi muhit (Workspace), o'lcham birliklari (px, sm, mm) va tayyor shablonlarni tahrirlash.",
        theory: {
          mainConcept: "Canva — bu murakkab grafik dasturlarsiz ham professional dizaynlar (postlar, taqdimotlar, bannerlar, videolar) yaratish imkonini beruvchi bulutli dizayn platformasidir.",
          rules: [
            "Ekran (SMM, veb) uchun doimo Piksel (px) o'lcham birligidan foydalaniladi (masalan: 1080x1080 px).",
            "Bosma mahsulotlar (vizitka, flayer, kitob) uchun Santimetr (sm) yoki Millimetr (mm) tanlanadi.",
            "Shablon (Template) — bu tayyor dizayn qolipi bo'lib, uning ranglari, matni va rasmlarini o'z brendingizga moslab o'zgartirish lozim."
          ],
          analogy: "Canva Lego konstruktoriga o'xshaydi: barcha detallar tayyor, siz esa ularni o'z didingiz va qoidalar asosida yig'asiz."
        },
        practice: {
          taskTitle: "Canva ish muhitida ilk 3 xil o'lchamli loyiha yaratish",
          taskSteps: [
            "Canva.com saytida Google akkaunt orqali ro'yxatdan o'ting.",
            "'Create a design' -> 'Custom size' bo'limidan 1080x1080 px o'lchamli yangi sahifa oching.",
            "Templates bo'limidan o'quv markazi yoki IT mavzusidagi shablonni tanlab, uning sarlavhasini o'z ismingizga o'zgartiring va PNG formatda yuklab oling."
          ],
          expectedOutput: "1080x1080 px o'lchamdagi tahrirlangan ilk shaxsiy dizayn (PNG)."
        },
        proTips: [
          "Klaviaturada 'T' harfini bossangiz darhol yangi matn, 'R' harfini bossangiz to'rtburchak shakl qo'shiladi.",
          "Loyihalarni doimo nomlab boring — keyinchalik qidirib topish oson bo'ladi."
        ]
      },
      {
        id: 102,
        lessonNumber: 2,
        week: '1-hafta: Canva asoslari va vizual savodxonlik',
        title: "Ranglar nazariyasi va psixologiyasi: ranglar doirasi, kontrast, palitralar tuzish (Coolors vositasi bilan integratsiya)",
        module: '1-Modul: Canva',
        level: "Boshlang'ich",
        duration: '60 daqiqa',
        tools: ['Canva', 'Coolors.co'],
        description: "Ranglar doirasi, issiq va sovuq ranglar, kontrast qoidasi hamda Coolors.co yordamida professional palitralar yig'ish.",
        theory: {
          mainConcept: "Ranglar inson kayfiyati va qarorlariga bevosita ta'sir qiladi. To'g'ri tanlangan ranglar palitrasi dizaynni 80% professional ko'rsatadi.",
          rules: [
            "60-30-10 qoidasi: 60% asosiy fon rangi, 30% ikkilamchi rang, 10% urg'u (aktsent - tugma va muhim yozuv) rangi.",
            "Kontrast: To'q fonda och rangli matn, och fonda esa to'q rangli matn ishlatilishi shart.",
            "Coolors.co saytidan olingan 6 xonali HEX kodlarni (masalan: #2C3E2D) Canva rang paneliga nusxalab qo'yish mumkin."
          ],
          analogy: "Ranglar palitrasi orkestrga o'xshaydi: hamma cholg'ular bir vaqtda baland chalinsa shovqin bo'ladi, uyg'un chalinsa musiqa tug'iladi."
        },
        practice: {
          taskTitle: "Coolors.co va Canva yordamida brend ranglar kartochkasini yaratish",
          taskSteps: [
            "Coolors.co saytiga kirib, 'Probel' (Space) tugmasi orqali uyg'un ranglar kombinatsiyasini toping.",
            "4 ta rangning HEX kodini nusxalab oling.",
            "Canva'da 4 ta ustunli kartochka yasab, har birini shu ranglarga bo'yang va ustiga HEX kodlarini yozib chiqing."
          ],
          expectedOutput: "4 ta uyg'un rang va ularning HEX kodlari ko'rsatilgan Brand Color Palette posteri."
        },
        proTips: [
          "Sof qora (#000000) o'rniga to'q ko'kimtir yoki to'q kulrang (#1A1A1A) ishlatsangiz dizayn ancha zamonaviy ko'rinadi.",
          "Canva ichida rasmga o'ng tugmani bosib 'Apply colors to page' qilsangiz, sahifa rasm ranglariga moslashadi."
        ]
      },
      {
        id: 103,
        lessonNumber: 3,
        week: '1-hafta: Canva asoslari va vizual savodxonlik',
        title: "Tipografika asoslari: shrift turlari (Serif, Sans-serif), shriftlar ierarxiyasi va matnlarni to'g'ri joylashtirish",
        module: '1-Modul: Canva',
        level: "Boshlang'ich",
        duration: '60 daqiqa',
        tools: ['Canva', 'Google Fonts'],
        description: "Serif va Sans-serif shriftlar farqi, sarlavha va asosiy matn o'lchamlari ierarxiyasi hamda matn tekislash qoidalari.",
        theory: {
          mainConcept: "Tipografika — bu matnni o'qishga qulay, chiroyli va tartibli ko'rsatish san'ati. Kuzatuvchi avval eng katta sarlavhani, keyin kichik sarlavhani va oxirida asosiy matnni o'qiydi.",
          rules: [
            "Serif (dumchali shriftlar: Playfair Display, Times) — klassik, obro'li va rasmiy mavzular uchun.",
            "Sans-serif (silliq shriftlar: Montserrat, Inter, Poppins) — zamonaviy, IT va ijtimoiy tarmoqlar uchun eng qulay.",
            "Bitta dizaynda ko'pi bilan 2 xil shrift oilasidan foydalaning: biri Sarlavha (Heading), ikkinchisi Asosiy matn (Body)."
          ],
          analogy: "Ierarxiya gazeta sahifasiga o'xshaydi: eng muhim yangilik katta harflar bilan, tafsilotlar esa kichikroq shriftda yoziladi."
        },
        practice: {
          taskTitle: "Shriftlar ierarxiyasiga asoslangan IT Konferensiya anonsi",
          taskSteps: [
            "Canva'da 1080x1350 px (Instagram portret) o'lchamli sahifa oching.",
            "Katta qalin Sans-serif shriftda 'KELAJAK KASBLARI 2026' sarlavhasini yozing.",
            "Pastki qismiga sana, manzil va ro'yxatdan o'tish ma'lumotlarini kichikroq va o'qishga qulay shriftda joylashtiring."
          ],
          expectedOutput: "Tipografika va ierarxiya qoidalariga to'liq javob beruvchi anons posteri."
        },
        proTips: [
          "Katta sarlavhalarda qatorlar orasidagi masofani (Line Spacing) biroz kamaytiring (1.0 - 1.15).",
          "Uzun matnlarni hech qachon dekorativ yoki qo'lyozma (Script) shriftda yozmang."
        ]
      },
      {
        id: 104,
        lessonNumber: 4,
        week: '2-hafta: Ijtimoiy tarmoqlar uchun kreativ dizayn',
        title: "SMM dizayn: Instagram post va stories o'lchamlari, ko'p sahifali karusel (Carousel) postlar tayyorlash",
        module: '1-Modul: Canva',
        level: "O'rta",
        duration: '65 daqiqa',
        tools: ['Canva', 'Instagram Grid'],
        description: "Instagram Post (1080x1080, 1080x1350) va Stories (1080x1920) standartlari hamda uzluksiz Karusel postlar yasash.",
        theory: {
          mainConcept: "SMM dizayn foydalanuvchining lentani varaqlashini to'xtatib, ma'lumotni oxirigacha o'qishga (yoki saqlab qo'yishga) undashi kerak.",
          rules: [
            "Kvadrat post: 1080x1080 px; Vertikal (eng samarali) post: 1080x1350 px; Stories/Reels: 1080x1920 px.",
            "Karusel (Carousel) — bu 3 tadan 10 tagacha sahifadan iborat bo'lgan, bir-biriga mantiqan va vizual ulangan slaydlar ketma-ketligidir.",
            "1-slayd (Muqova) qiziqtiruvchi savol yoki kuchli sarlavha bilan boshlanishi, oxirgi slayd esa 'Harakatga chaqiruv' (CTA: Obuna bo'ling, Saqlab oling) bilan tugashi kerak."
          ],
          analogy: "Karusel post mini-kitobga o'xshaydi: muqovasi qiziq bo'lsa, odam keyingi betlarini ham varaqlab o'qiydi."
        },
        practice: {
          taskTitle: "5 sahifali 'Kompyuter tezligini oshirishning 5 siri' karusel posti",
          taskSteps: [
            "Canva'da 1080x1350 px o'lchamda 5 ta sahifa (Page) yarating.",
            "1-sahifaga jozibali muqova va 'Chapga suring ->' ko'rsatkichini qo'ying.",
            "2, 3, 4-sahifalarga maslahatlarni, 5-sahifaga esa 'Post foydali bo'ldimi? Do'stlaringizga ulashing!' blokini joylang."
          ],
          expectedOutput: "5 ta slayddan iborat tayyor Instagram karusel to'plami."
        },
        proTips: [
          "Ikki sahifa chegarasiga bitta rasm yoki shaklni yarmidan bo'lib qo'ysangiz, varaqlaganda uzluksiz o'tish effekti hosil bo'ladi.",
          "Har bir slaydda sahifa raqamini (masalan: 1/5, 2/5) burchakda ko'rsatib keting."
        ]
      },
      {
        id: 105,
        lessonNumber: 5,
        week: '2-hafta: Ijtimoiy tarmoqlar uchun kreativ dizayn',
        title: "Rasmlar tahriri: rasmlarning orqa fonini tozalash (Background Remover), yorug'lik va rang filtrlarini sozlash",
        module: '1-Modul: Canva',
        level: "O'rta",
        duration: '60 daqiqa',
        tools: ['Canva Photo Editor', 'BG Remover', 'Remove.bg'],
        description: "Rasmlarni orqa fondan toza ajratish, soyalar (Shadows) berish, yorug'lik, kontrast va rang to'yinganligini sozlash.",
        theory: {
          mainConcept: "Sifatli kesilgan va yorug'ligi to'g'ri sozlangan rasm dizaynning markaziy qahramoniga aylanadi.",
          rules: [
            "Background Remover (yoki remove.bg) yordamida inson yoki mahsulot rasmining orqa fonini 1 soniyada olib tashlash mumkin.",
            "Fonidan ajratilgan obyekt havoda muallaq qolmasligi uchun unga 'Shadows -> Drop yoki Glow' effekti beriladi.",
            "Adjust bo'limidan Brightness (yorug'lik), Contrast (kontrast) va Saturation (to'yinganlik) me'yorida sozlanadi."
          ],
          analogy: "Rasmni tahrirlash olmosga sayqal berishdek gap — xom toshga ishlov berilgach, u haqiqiy jilosini ko'rsatadi."
        },
        practice: {
          taskTitle: "Mahsulot yoki Spiker posteri uchun fotomontaj",
          taskSteps: [
            "Spiker yoki zamonaviy gadjet rasmini yuklab, orqa fonini tozalang.",
            "Obyekt atrofiga ingichka oq kontur (Outline) yoki yumshoq soya (Drop Shadow) bering.",
            "Orqa fonga gradient va yorug'lik nuri (Glow) qo'shib, professional reklama postini yakunlang."
          ],
          expectedOutput: "Orqa foni tozalangan va soyalar bilan boyitilgan professional reklama posteri."
        },
        proTips: [
          "Katta sarlavhani inson boshining orqa qismiga (Layer -> Send backward) biroz yashirib qo'ysangiz, 3D chuqurlik effekti chiqadi.",
          "Xira va past sifatli (pikselga bo'linib ketgan) rasmlarni hech qachon dizaynda ishlatmang."
        ]
      },
      {
        id: 106,
        lessonNumber: 6,
        week: '2-hafta: Ijtimoiy tarmoqlar uchun kreativ dizayn',
        title: "YouTube muqovasi (Thumbnail/Preview) va bannerlar yaratish. Diqqatni tortuvchi sarlavha va emotsional elementlar",
        module: '1-Modul: Canva',
        level: "O'rta",
        duration: '60 daqiqa',
        tools: ['Canva', 'YouTube Studio'],
        description: "YouTube video muqovasi (1280x720 px) va kanal banneri yaratish, CTR (bosilish foizi)ni oshiruvchi vizual usullar.",
        theory: {
          mainConcept: "YouTube'da videoning ko'rilishi 70% uning muqovasiga (Thumbnail) bog'liq. Muqova 1 soniya ichida tomoshabin e'tiborini tortishi shart.",
          rules: [
            "YouTube Thumbnail standart o'lchami: 1280x720 px (16:9 nisbat).",
            "Muqovada 3–4 tadan ko'p so'z yozmang — yozuv katta, qalin va uzoqdan ham o'qiladigan bo'lishi kerak.",
            "Inson yuzidagi kuchli emotsiya (hayrat, quvonch) va yorqin kontrast ranglar bosilish (CTR) ko'rsatkichini keskin oshiradi."
          ],
          analogy: "YouTube muqovasi kino afishasiga o'xshaydi: afisha qanchalik qiziqarli bo'lsa, zalga shuncha ko'p tomoshabin kiradi."
        },
        practice: {
          taskTitle: "IT-bloger uchun YouTube video muqovasi (Thumbnail)",
          taskSteps: [
            "Canva'da 1280x720 px o'lchamli sahifa oching.",
            "Hayratlanib turgan inson rasmini o'ng tomonga, 'DASTURLASHNI 0 DAN O'RGANISH!' yozuvini chap tomonga katta qilib joylang.",
            "3D belgilar (VS Code, Python yoki pul/grafik ikonkasi) va yorug'lik effektlarini qo'shing."
          ],
          expectedOutput: "1280x720 px o'lchamdagi yuqori kontrastli YouTube Thumbnail."
        },
        proTips: [
          "Muqovaning o'ng pastki burchagiga muhim yozuv qo'ymang — u yerda YouTube video vaqti (masalan, 12:45) turadi va yozuvni yopib qo'yadi!",
          "Tayyor muqovani 10% gacha kichraytirib ko'ring: agar yozuv va rasm hali ham aniq ko'rinsa, demak u telefonda ham zo'r ko'rinadi."
        ]
      },
      {
        id: 107,
        lessonNumber: 7,
        week: '3-hafta: Korporativ va bosma mahsulotlar dizayni',
        title: "Shaxsiy brend va vizitkalar: korporativ stilistika, ikki tomonlama vizitka maketini tayyorlash",
        module: '1-Modul: Canva',
        level: "O'rta",
        duration: '60 daqiqa',
        tools: ['Canva', 'QR Code Generator'],
        description: "Korporativ aydentika asoslari va standart (90x50 mm / 85x55 mm) ikki tomonlama vizitka dizaynini yaratish.",
        theory: {
          mainConcept: "Vizitka (Business Card) — mutaxassis yoki kompaniyaning ixcham tashrif qog'ozi bo'lib, unda faqat eng muhim aloqa ma'lumotlari va brend ruhi aks etadi.",
          rules: [
            "Standart vizitka o'lchami: 90x50 mm (yoki Yevropa standarti 85x55 mm).",
            "1-tomon (Old qism): Logotip, kompaniya nomi va shior (minimalistik uslubda).",
            "2-tomon (Orqa qism): Ism-sharif, lavozim, telefon raqam, veb-sayt/Telegram va QR-kod."
          ],
          analogy: "Vizitka rasmiy uchrashuvdagi qo'l siqishga o'xshaydi — u siz haqingizda ilk professional taassurotni qoldiradi."
        },
        practice: {
          taskTitle: "Shaxsiy IT mutaxassis / Dizayner ikki tomonlama vizitkasi",
          taskSteps: [
            "Canva'da 90x50 mm o'lchamda 2 sahifali hujjat yarating.",
            "1-sahifaga to'q fonda shaxsiy logotip va yo'nalishingizni joylashtiring.",
            "2-sahifaga ism-sharifingiz, telefon raqamingiz va portfoliongizga eltuvchi QR-kodni (Canva QR Code ilovasi orqali) joylang."
          ],
          expectedOutput: "Old va orqa tomoni uyg'un ishlangan 2 sahifali vizitka maketi."
        },
        proTips: [
          "Bosmada kesilib ketmasligi uchun barcha yozuvlarni chekkadan kamida 5 mm ichkarida (Safe zone) joylashtiring.",
          "Vizitkada shrift o'lchami kamida 7-8 pt bo'lishi kerak, aks holda qog'ozda o'qib bo'lmaydi."
        ]
      },
      {
        id: 108,
        lessonNumber: 8,
        week: '3-hafta: Korporativ va bosma mahsulotlar dizayni',
        title: "Reklama flayerlari, bukletlar va afishalar (Poster) yasash. Bosmaga to'g'ri tayyorlash (CMYK, PDF Print)",
        module: '1-Modul: Canva',
        level: "O'rta",
        duration: '65 daqiqa',
        tools: ['Canva', 'PDF Print', 'Crop Marks & Bleed'],
        description: "A4 va A5 formatdagi flayer va afishalar dizayni, RGB va CMYK rang rejimlari farqi hamda bosmaxona uchun PDF Print eksporti.",
        theory: {
          mainConcept: "Ekranda ko'rinadigan dizayn bilan qog'ozda chop etiladigan dizayn o'rtasida texnik farqlar bor. Bosmaxona talablarini bilish dizaynerni qimmat xatolardan asraydi.",
          rules: [
            "RGB (Red, Green, Blue) — faqat ekranlar uchun; CMYK (Cyan, Magenta, Yellow, Key/Black) — bosmaxona bo'yoqlari uchun.",
            "Print Bleed (Kesish zahirasi): Qog'oz kesilganda oq chekka qolib ketmasligi uchun fonni 3 mm tashqariga chiqarish ('Crop marks and bleed' funksiyasi).",
            "Bosmaga topshirishda fayl har doim 'PDF Print' formatida yuklab olinadi."
          ],
          analogy: "Print Bleed — bu kiyim tikishda chok haqi qoldirishga o'xshaydi: zahira bo'lmasa, kiyim tor kelib qoladi."
        },
        practice: {
          taskTitle: "O'quv markazi uchun A5 reklama flayeri va PDF Print eksporti",
          taskSteps: [
            "Canva'da A5 (148x210 mm) o'lchamli flayer sahifasini oching.",
            "File -> Settings -> 'Show print bleed' va 'Show margins' funksiyalarini yoqing.",
            "Kurslar ro'yxati, chegirma aksiyasi va manzilni joylab, Share -> Download -> 'PDF Print' ('Crop marks and bleed' belgilangan holda) yuklab oling."
          ],
          expectedOutput: "Bosmaxonaga topshirishga 100% tayyor, kesish belgilari (Crop marks) bor PDF flayer."
        },
        proTips: [
          "Flayerda eng katta e'tiborni 'Muammo va Yechim' yoki 'Katta Foyda'ga (masalan: '1-dars BEPUL!') qarating.",
          "Bosma dizaynlarda juda neon (yaltiroq yashil/pushti) ranglardan qoching, chunki qog'ozda ular xira chiqadi."
        ]
      },
      {
        id: 109,
        lessonNumber: 9,
        week: '3-hafta: Korporativ va bosma mahsulotlar dizayni',
        title: "Zamonaviy rezyume (CV) va infografika ko'rinishidagi portfolio yaratish",
        module: '1-Modul: Canva',
        level: "O'rta",
        duration: '60 daqiqa',
        tools: ['Canva CV Builder', 'Charts & Infographics'],
        description: "Ishga kirish uchun zamonaviy CV (Rezyume) tuzish va ma'lumotlarni infografika hamda diagrammalar yordamida vizual ko'rsatish.",
        theory: {
          mainConcept: "Zamonaviy Rezyume (CV) va infografika quruq matnlarni emas, balki mutaxassisning ko'nikmalari va natijalarini bir qarashda tushunarli vizual tilda ko'rsatib beradi.",
          rules: [
            "CV 1 ta A4 sahifaga aniq va tartibli joylashishi maqsadga muvofiq.",
            "Tarkibi: Surat, Qisqa ma'lumot (About me), Ko'nikmalar (Skills), Ta'lim (Education), Tajriba/Loyihalar va Aloqa.",
            "Infografika — murakkab raqam va bosqichlarni ikonkalar, foiz chiziqlari (Progress bars) va sxemalar bilan ifodalashdir."
          ],
          analogy: "Yaxshi CV — bu sizning professional pasportingiz va reklama treyleringizdir."
        },
        practice: {
          taskTitle: "Shaxsiy zamonaviy CV (Rezyume) dizayni",
          taskSteps: [
            "Canva'da A4 formatida 2 ustunli CV maketini tuzing.",
            "Chap ustunga suratingiz, aloqa ma'lumotlaringiz va dasturlarni bilish darajangizni (Canva 95%, Figma 85%, HTML/CSS 80%) progress-bar ko'rinishida qo'ying.",
            "O'ng ustunga ta'lim, sertifikatlar va bajargan loyihalaringizni joylab, PDF Standard shaklida saqlang."
          ],
          expectedOutput: "Professional ko'rinishdagi shaxsiy CV (PDF va PNG)."
        },
        proTips: [
          "Rezyumedagi email va Telegram/Portfolio yozuvlariga bosiladigan haqiqiy havola (Link) biriktirib qo'ying.",
          "CV uchun tushgan suratingiz yorug', neytral fonda va jilmayib turgan rasmiy-zamonaviy uslubda bo'lsin."
        ]
      },
      {
        id: 110,
        lessonNumber: 10,
        week: '4-hafta: Canva AI va yakuniy loyiha',
        title: "Canva'dagi sun'iy intellekt vositalari (Magic Studio, matndan rasm generatsiya qilish, Magic Expand)",
        module: '1-Modul: Canva',
        level: "O'rta",
        duration: '60 daqiqa',
        tools: ['Canva Magic Studio', 'Magic Media', 'Magic Grab', 'Magic Expand'],
        description: "Canva sun'iy intellekt (AI) qurollari yordamida matndan rasm yaratish, rasmni kengaytirish va obyektlarni ko'chirish.",
        theory: {
          mainConcept: "Sun'iy intellekt (AI) dizaynerning o'rnini bosmaydi, balki AI'dan foydalana oladigan dizayner ish tezligini 5 barobarga oshiradi.",
          rules: [
            "Magic Media (Text to Image): Matnli buyruq (Prompt) yozish orqali noyob rasm va 3D grafikalar generatsiya qilish.",
            "Magic Expand: Kichik yoki kesilgan rasmning atrofini AI yordamida tabiiy davom ettirib kengaytirish.",
            "Magic Grab va Magic Eraser: Rasmdagi istalgan obyektni ajratib joyini o'zgartirish yoki keraksiz detalni izsiz o'chirish."
          ],
          analogy: "Canva Magic Studio — bu yoningizda o'tirgan tezkor yordamchi rassomga o'xshaydi: siz g'oyani aytasiz, u esa soniyalar ichida chizib beradi."
        },
        practice: {
          taskTitle: "AI generatsiya qilingan kelajak texnologiyalari posteri",
          taskSteps: [
            "Canva Magic Media bo'limiga kirib, ingliz yoki o'zbek tilida: 'Futuristic smart school in Uzbekistan, 3d render, cinematic lighting' deb yozing.",
            "Generatsiya qilingan eng chiroyli rasmni tanlab, Magic Expand orqali uni to'liq poster o'lchamiga kengaytiring.",
            "Ustiga tipografik sarlavha va grafik elementlar qo'shib, kreativ poster tayyorlang."
          ],
          expectedOutput: "AI yordamida yaratilgan va tahrirlangan futuristik poster."
        },
        proTips: [
          "AI'ga prompt yozishda uslubni aniq ko'rsating: '3D icon, isometric, minimalist, soft lighting'.",
          "Magic Write vositasi orqali reklama postlari uchun tayyor matn va g'oyalar ham olishingiz mumkin."
        ]
      },
      {
        id: 111,
        lessonNumber: 11,
        week: '4-hafta: Canva AI va yakuniy loyiha',
        title: "Dinamik vizuallar: elementlar animatsiyasi va qisqa reklama roliklari (Reels/Shorts) montaji",
        module: '1-Modul: Canva',
        level: "O'rta",
        duration: '65 daqiqa',
        tools: ['Canva Video', 'Animate', 'Audio Sync'],
        description: "Elementlar va matnlarga harakat (Animate) berish, video taymlayn bilan ishlash hamda Instagram Reels / YouTube Shorts uchun dinamik rolik tayyorlash.",
        theory: {
          mainConcept: "Harakatlanuvchi (dinamik) vizuallar oddiy statik rasmga qaraganda ijtimoiy tarmoqlarda 3 barobar ko'proq e'tibor tortadi.",
          rules: [
            "Animate paneli orqali har bir qatlamga kirish (Enter), chiqish (Exit) yoki doimiy harakat (Loop/Motion) berish mumkin.",
            "Taymlayn (Timeline) — pastki qismdagi vaqt shkalasi bo'lib, unda har bir sahifa va audio davomiyligi (sekundlarda) boshqariladi.",
            "Tezkor va zamonaviy ko'rinish uchun barcha sahifalarga bir xil uslubdagi silliq o'tish (Transitions: Match & Move, Dissolve) qo'llaniladi."
          ],
          analogy: "Animatsiya — bu rasmdagi qahramonlarga jon bag'ishlashdir: matnlar silliq suzib chiqadi, belgilar esa musiqa ritmiga mos harakatlanadi."
        },
        practice: {
          taskTitle: "10–15 soniyali dinamik reklama Reels / Shorts videosi",
          taskSteps: [
            "Canva'da 1080x1920 px (Mobile Video) loyihasini oching va 3 ta sahifa (har biri 3.5 soniyadan) yarating.",
            "Matn va rasmlarga 'Rise' yoki 'Pop' animatsiyasini, sahifalar orasiga esa 'Match & Move' o'tishini qo'ying.",
            "Fon musiqasi qo'shib, videoni MP4 (1080p) formatida eksport qiling."
          ],
          expectedOutput: "Tayyor 10-15 soniyali MP4 reklama roligi."
        },
        proTips: [
          "'Match & Move' o'tishidan foydalanganda elementni 1-sahifada kichik, 2-sahifada katta qilsangiz, u silliq kattalashib o'tadi!",
          "Bitta sahifada juda ko'p turli-tuman sakrovchi animatsiyalarni aralashtirmang — silliqlik (Smoothness) professional ko'rinadi."
        ]
      },
      {
        id: 112,
        lessonNumber: 12,
        week: '4-hafta: Canva AI va yakuniy loyiha',
        title: "12-dars (1-oy imtihon loyihasi): Muayyan brend yoki o'quv markazi uchun to'liq vizual to'plam (Logo, Instagram karusel, flayer va banner) yaratish va himoya qilish",
        module: '1-Modul: Canva',
        level: 'Amaliy Loyiha',
        duration: '90 daqiqa',
        tools: ['Canva', 'Coolors.co', 'PDF Print', 'PNG/MP4 Export'],
        description: "1-oy davomida o'zlashtirilgan barcha bilimlar asosida yagona brend uchun to'liq Brand Pack (Logo, SMM Karusel, Bosma Flayer va YouTube/Web Banner) tayyorlash.",
        theory: {
          mainConcept: "Yakuniy brending loyihasi — bu dizaynerning rang, shrift, kompozitsiya va turli formatlarni yagona korporativ uslubda birlashtira olish mahoratining imtihonidir.",
          rules: [
            "Barcha 4 ta mahsulotda (Logo, Karusel, Flayer, Banner) aynan bir xil ranglar palitrasi va bir xil shriftlar oilasi ishlatilishi shart.",
            "Har bir mahsulot o'z texnik standartiga mos o'lchamda tayyorlanadi.",
            "Taqdimotda brend g'oyasi va nima uchun aynan shu rang hamda shriftlar tanlangani himoya qilinadi."
          ],
          analogy: "Brend to'plami — bu sport jamoasining yagona formasiga o'xshaydi: futbolka, kepka va bayroq bitta uslubda bo'lsa, jamoa darhol taniladi."
        },
        practice: {
          taskTitle: "1-oy Imtihon Loyihasi: To'liq Brend Vizual To'plami (Brand Pack)",
          taskSteps: [
            "O'quv markazi, IT akademiya yoki zamonaviy brend tanlab, uning logotipi va 4 ta asosiy rangini belgilang.",
            "Shu brend uchun: 1) Logotip, 2) 4 sahifali Instagram karusel, 3) A5 reklama flayeri, 4) Katta veb/YouTube banner tayyorlang.",
            "Barcha ishlarni yagona taqdimotga jamlab, Uyga vazifalar bo'limiga yuklang va himoya qiling."
          ],
          expectedOutput: "4 ta dizayn mahsulotidan iborat to'liq brending paketi (100 ballik yakuniy imtihon)."
        },
        proTips: [
          "Ishlaringizni taqdim etishda Canva ichidagi 'Smartmockups' orqali telefon, noutbuk va qog'oz maketlarida ko'rsating.",
          "Ushbu imtihon loyihangiz sizning shaxsiy portfoliongizdagi 1-chi katta ish bo'lib qoladi!"
        ]
      }
    ]
  },

  // ============================================================================
  // 2-MODUL: FIGMA — PROFESSIONAL UI/UX VEB-DIZAYN (1 OY / 12 TA DARS)
  // ============================================================================
  {
    id: 2,
    category: 'design',
    title: '2-MODUL: FIGMA — PROFESSIONAL UI/UX VEB-DIZAYN',
    goal: "Veb-saytlar va mobil ilovalar interfeysini chizish, dizayn-tizimlar, Auto Layout mexanizmi va interaktiv prototiplarni yaratish.",
    description: "Figma interfeysi, vektor asboblari, Grid tizimi, Auto Layout, Components & Variants hamda Landing Page prototipi (1 oy / 12 ta dars).",
    badge: '2-Oy · Figma UI/UX',
    durationBadge: '1 OY / 12 TA DARS',
    lessons: [
      {
        id: 201,
        lessonNumber: 1,
        week: '1-hafta: Figma interfeysi va vektor asboblari',
        title: "UI/UX dizayn nima? Figma afzalliklari, brauzer va desktop versiyalari. Freymlar (Frames) va moslashuvchan ekran o'lchamlari",
        module: '2-Modul: Figma UI/UX',
        level: "Boshlang'ich",
        duration: '60 daqiqa',
        tools: ['Figma.com', 'Figma Desktop'],
        description: "UI (User Interface) va UX (User Experience) tushunchalari, Figma ish muhiti hamda Desktop, Planshet va Mobil ekran Freymlari (Frames).",
        theory: {
          mainConcept: "UX (Foydalanuvchi tajribasi) — sayt qanday ishlashi va qulayligini, UI (Foydalanuvchi interfeysi) esa uning tashqi go'zalligi, tugmalari va ranglarini belgilaydi.",
          rules: [
            "Figma'da barcha ekran dizaynlari oddiy Rectangle emas, balki maxsus Frame ('F' tugmasi) ichida chiziladi.",
            "Standart ekran o'lchamlari: Desktop (1440px kenglik), Planshet (768px), Mobil telefon (375px yoki 390px).",
            "Figma bulutda ishlaydi va jamoa bo'lib bir vaqtda bitta faylda ishlash imkonini beradi."
          ],
          analogy: "UX — bu uyning arxitekturasi va xonalarining qulay joylashuvi bo'lsa, UI — bu devorlar rangi, qandillar va mebellar dizaynidir."
        },
        practice: {
          taskTitle: "Figma'da Desktop va Mobil ekran freymlarini sozlash",
          taskSteps: [
            "Figma.com saytida ro'yxatdan o'tib, 'New design file' yarating.",
            "'F' tugmasini bosib, Desktop (1440x900) va iPhone 14/15 (390x844) freymlarini yonma-yon oching.",
            "Har ikkala freymga sarlavha va fon rangi berib, ularni PNG formatda eksport qilib ko'ring."
          ],
          expectedOutput: "Figma'da to'g'ri o'lchamlarda ochilgan Desktop va Mobil ekran freymlari."
        },
        proTips: [
          "Figma'da yaqinlashtirish uchun 'Ctrl + Mouse Wheel' (g'ildirak), sahifani surish uchun esa 'Space' (Probel) tugmasini bosib turing.",
          "Freymlarga doim mantiqiy nom bering: '01_Home_Desktop', '02_Home_Mobile'."
        ]
      },
      {
        id: 202,
        lessonNumber: 2,
        week: '1-hafta: Figma interfeysi va vektor asboblari',
        title: "Geometrik shakllar (Shapes), Pen tool (vektor qalam) va qatlamlar (Layers) ierarxiyasi",
        module: '2-Modul: Figma UI/UX',
        level: "Boshlang'ich",
        duration: '60 daqiqa',
        tools: ['Figma', 'Pen Tool (P)', 'Boolean Groups'],
        description: "To'rtburchak, doira, ko'pburchak shakllar, burchaklarni yumaloqlash (Corner Radius), Pen Tool bilan vektor chizish va qatlamlar tartibi.",
        theory: {
          mainConcept: "Har qanday murakkab veb-sayt yoki mobil ilova interfeysi oddiy geometrik shakllar va vektor chiziqlar yig'indisidan tashkil topadi.",
          rules: [
            "Rectangle (R), Ellipse (O), Line (L) va Pen Tool (P) — Figma'ning asosiy chizish qurollaridir.",
            "Boolean amallar (Union, Subtract, Intersect, Exclude) yordamida ikki va undan ortiq shakldan yangi murakkab ikonkalar yasaladi.",
            "Chap panelda joylashgan Qatlamlar (Layers) ro'yxatida yuqorida turgan obyekt ekranda eng oldinda ko'rinadi."
          ],
          analogy: "Pen Tool egiluvchan simga o'xshaydi — nuqtalarni qo'yib va tortib istalgan silliq egri chiziq yoki logotipni yasash mumkin."
        },
        practice: {
          taskTitle: "Pen Tool va Shapes yordamida 5 ta zamonaviy UI ikonka chizish",
          taskSteps: [
            "Figma'da 5 ta 64x64 px o'lchamli kichik freym oching.",
            "Shapes va Pen Tool yordamida Uy (Home), Qidiruv (Search), Yurak (Like), Xabar (Chat) va Foydalanuvchi (User) ikonkalarini chizing.",
            "Qatlamlarni guruhlab (Ctrl+G), ularga aniq nom bering."
          ],
          expectedOutput: "Vektor formatida toza chizilgan 5 ta UI ikonka to'plami."
        },
        proTips: [
          "Chiziq yoki shakl chizayotganda 'Shift' tugmasini bosib tursangiz, shakl proporsiyasi buzilmaydi va chiziq tekis chiqadi.",
          "Burchak yumaloqligini (Border radius) 8px, 12px, 16px, 24px kabi juft sonlarda bering."
        ]
      },
      {
        id: 203,
        lessonNumber: 3,
        week: '1-hafta: Figma interfeysi va vektor asboblari',
        title: "Ranglar va stillar: Solid, Gradient, ranglarni saqlash (Color Styles). Effektlar: Drop Shadow, Inner Shadow va Layer Blur",
        module: '2-Modul: Figma UI/UX',
        level: "Boshlang'ich",
        duration: '60 daqiqa',
        tools: ['Figma Color Styles', 'Gradients', 'Effects Panel'],
        description: "Tekis ranglar (Solid) va Gradient o'tishlar, loyiha ranglarini Color Styles sifatida saqlash hamda zamonaviy soya va shaffof oyna (Glassmorphism) effektlari.",
        theory: {
          mainConcept: "Color Styles va yumshoq soyalar interfeysga hajm, tozalik va keyinchalik 1 tugma bilan butun sayt rangini o'zgartirish qulayligini beradi.",
          rules: [
            "Color Styles: Asosiy ranglarni (Primary, Secondary, Text, Background) saqlab qo'ysangiz, 50 ta sahifadagi rangni bittada yangilash mumkin.",
            "Drop Shadow: Yumshoq va tabiiy soya olish uchun Blur qiymatini 20–40px, Opacity (shaffoflik)ni esa 8%–15% oralig'ida saqlang.",
            "Background Blur: Shaffof oq qatlamga Background Blur (16px) bersangiz, zamonaviy iOS 'xira oyna' (Glassmorphism) effekti hosil bo'ladi."
          ],
          analogy: "Color Styles — bu uydagi markaziy chiroq pultiga o'xshaydi: bitta tugmani bossangiz barcha xonalardagi chiroq rangi birdek o'zgaradi."
        },
        practice: {
          taskTitle: "Glassmorphism uslubidagi bank kartasi va UI tugmalar",
          taskSteps: [
            "Figma'da loyiha uchun 5 ta Color Style (Primary, Dark, Light, Accent, Success) yarating.",
            "Yorqin gradient fon ustida yarim shaffof (Fill: White 15%, Background Blur: 20) plastik karta dizaynini chizing.",
            "Yoniga yumshoq Drop Shadow berilgan 3 xil zamonaviy tugma joylashtiring."
          ],
          expectedOutput: "Color Styles va Glassmorphism effektida ishlangan zamonaviy UI karta."
        },
        proTips: [
          "Hech qachon qop-qora va o'tkir soya (Blur: 4, Opacity: 50%) ishlatmang — u dizaynni eski va kir ko'rsatadi.",
          "Soyaning rangiga asosiy tugma rangidan ozgina qo'shsangiz, tugma jonliroq ko'rinadi."
        ]
      },
      {
        id: 204,
        lessonNumber: 4,
        week: "2-hafta: Tipografika, to'rlar (Grid) va plaginlar",
        title: "Veb-tipografika: Google Fonts, shrift stillarini yaratish (Text Styles), matnlar balansi",
        module: '2-Modul: Figma UI/UX',
        level: "Boshlang'ich",
        duration: '60 daqiqa',
        tools: ['Figma Text Styles', 'Google Fonts'],
        description: "Veb-interfeyslar uchun tipografik shkala (H1, H2, H3, Body, Caption) yaratish va ularni Figma Text Styles sifatida saqlash.",
        theory: {
          mainConcept: "Veb-saytning 85% qismi matndan iborat. Tizimli Text Styles (shrift stillari) barcha sahifalarda bir xil tartib va o'qish qulayligini ta'minlaydi.",
          rules: [
            "Standart veb-shkala: H1 (48-56px, Bold), H2 (36px, Bold), H3 (24px, SemiBold), Body (16px, Regular), Caption (12-14px).",
            "Asosiy matn (Body) uchun qatorlar oralig'i (Line-height) 140%–160% bo'lishi o'qishni osonlashtiradi.",
            "Har bir shrift o'lchamini Figma'da 'Text Styles' ro'yxatiga saqlab qo'yish professional standart hisoblanadi."
          ],
          analogy: "Text Styles — bu kitob nashriyotining qat'iy shablonidir: har bir bob sarlavhasi va har bir sahifa matni doim bir xil o'lchamda chiqadi."
        },
        practice: {
          taskTitle: "Veb-sayt uchun UI Typography Styleguide yaratish",
          taskSteps: [
            "Figma'da 'Typography System' nomli freym oching va Inter yoki Plus Jakarta Sans shriftini tanlang.",
            "H1, H2, H3, Body Large, Body Regular va Button Text o'lchamlarini yozib, har birini Text Style sifatida saqlang.",
            "Shu stillardan foydalanib maqola kartochkasi (Blog Card) matnlarini joylashtiring."
          ],
          expectedOutput: "6 pog'onali Text Styles tizimi va maqola kartochkasi."
        },
        proTips: [
          "Veb-saytda asosiy matn o'lchamini 16px dan kichik qilmang — ko'z tez charchaydi.",
          "Katta sarlavhalarda Letter-spacing (harflar orasi)ni -1% yoki -2% qilsangiz, sarlavha ixcham va zamonaviy ko'rinadi."
        ]
      },
      {
        id: 205,
        lessonNumber: 5,
        week: "2-hafta: Tipografika, to'rlar (Grid) va plaginlar",
        title: "Tartib to'rlari (Layout Grids): 12 ustunli Bootstrap to'ri bilan ishlash, konteynerlar va chekka masofalar",
        module: '2-Modul: Figma UI/UX',
        level: "O'rta",
        duration: '65 daqiqa',
        tools: ['Figma Layout Grid', '12-Column Grid'],
        description: "Veb-saytlarni tekis va dasturchilar uchun tushunarli chizishda 12 ustunli Layout Grid, Margin va Gutter tushunchalari.",
        theory: {
          mainConcept: "Layout Grid (Tartib to'ri) — bu sahifadagi barcha bloklar, kartochkalar va matnlarni millimetr аниqligida tekis joylashtiruvchi ko'rinmas skeletdir.",
          rules: [
            "Desktop (1440px) uchun oltin standart: 12 ta ustun (Columns: 12), chekka masofa (Margin: 120px yoki 80px), ustunlar orasi (Gutter: 24px).",
            "3 ta kartochka yonma-yon tursa — har biri 4 tadan ustunni (4x3=12) egallaydi; 4 ta kartochka bo'lsa — 3 tadan ustunni (3x4=12) egallaydi.",
            "Mobil ekran (375/390px) uchun: 4 ta ustun, Margin: 16px yoki 20px, Gutter: 16px."
          ],
          analogy: "Layout Grid daftar chiziqlariga o'xshaydi — kataksiz oq qog'ozda yozuv qiyshiq ketsa, katakli daftarda har bir qator va ustun tekis tushadi."
        },
        practice: {
          taskTitle: "12 ustunli Grid asosida 3 va 4 ustunli xizmatlar blokini terish",
          taskSteps: [
            "1440px freym ochib, o'ng paneldan 'Layout Grid -> Columns (12), Margin (120), Gutter (24)' sozlamasini kiriting.",
            "Yuqori qatorga 6 ustun chapda (matn) va 6 ustun o'ngda (rasm) bo'lgan Hero blok joylashtiring.",
            "Pastki qatorga har biri 4 ta ustunni egallaydigan 3 ta xizmat kartochkasini tekis joylashtiring."
          ],
          expectedOutput: "12 ustunli Bootstrap to'riga aniq tushirilgan Desktop veb-sahifa maketi."
        },
        proTips: [
          "'Shift + G' tugmalari orqali Layout Grid to'rini bir lahzada yoqib-o'chirib tekshirish mumkin.",
          "Dasturchilar Grid asosida chizilgan dizaynni HTML/CSS ga o'tkazishni juda yaxshi ko'rishadi!"
        ]
      },
      {
        id: 206,
        lessonNumber: 6,
        week: "2-hafta: Tipografika, to'rlar (Grid) va plaginlar",
        title: "Plaginlar (Plugins) olami: Unsplash, Iconify, Content Reel, Feather Icons plaginlaridan unumli foydalanish",
        module: '2-Modul: Figma UI/UX',
        level: "O'rta",
        duration: '60 daqiqa',
        tools: ['Figma Plugins', 'Unsplash', 'Iconify', 'Feather Icons'],
        description: "Dizayn jarayonini 5 barobar tezlashtiruvchi eng muhim Figma plaginlari bilan ishlash.",
        theory: {
          mainConcept: "Figma plaginlari — bu dastur ichidan chiqmasdan turib minglab bepul HD rasmlar, vektor ikonkalar va tayyor ma'lumotlarni 1 soniyada qo'shish vositasidir.",
          rules: [
            "Unsplash / Freepik: Yuqori sifatli bepul fotosuratlarni to'g'ridan-to'g'ri shakllar ichiga joylash.",
            "Iconify / Feather Icons / Lucide: Minglab SVG vektor ikonkalarni (savat, telefon, qidiruv) qidirib topish.",
            "Content Reel: Dizaynga haqiqiyga o'xshash ismlar, telefon raqamlar, avatarlar va manzillarni avtomatik to'ldirish."
          ],
          analogy: "Plaginlar — bu oshpazning oshxona kombayniga o'xshaydi: qo'lda yarim soat to'g'raladigan mahsulotni 10 soniyada tayyor qiladi."
        },
        practice: {
          taskTitle: "Plaginlar yordamida Onlayn Kurslar katalogini 15 daqiqada yig'ish",
          taskSteps: [
            "Figma'da 'Resources (Shift+I) -> Plugins' bo'limidan Unsplash va Iconify plaginlarini ishga tushiring.",
            "6 ta kurs kartochkasini yaratib, Unsplash orqali har biriga mos IT va Dizayn rasmlarini joylang.",
            "Iconify orqali dars soati, reyting yulduzchasi va o'quvchilar soni ikonkalarini qo'shing."
          ],
          expectedOutput: "Unsplash va Iconify yordamida boyitilgan 6 ta zamonaviy kurs kartochkasi."
        },
        proTips: [
          "Bir nechta shaklni baravar belgilab, Unsplash'da rasm tanlasangiz, barcha shakllarga har xil rasm avtomatik tushadi!",
          "Ikonkalarni dizaynga qo'shganda ularning chiziq qalinligi (Stroke width: masalan, 2px) barcha joyda bir xil bo'lishiga e'tibor bering."
        ]
      },
      {
        id: 207,
        lessonNumber: 7,
        week: "3-hafta: Ilg'or vositalar — Auto Layout va komponentlar",
        title: "Auto Layout texnologiyasi: tugmalar, inputlar va bloklarning matn hajmiga qarab avtomatik kengayishi",
        module: '2-Modul: Figma UI/UX',
        level: "O'rta",
        duration: '70 daqiqa',
        tools: ['Figma Auto Layout (Shift + A)'],
        description: "Figma'ning eng qudratli mexanizmi — Auto Layout: Padding, Gap, Direction (Horizontal/Vertical) va Resizing (Hug, Fill, Fixed).",
        theory: {
          mainConcept: "Auto Layout (Shift + A) — bu elementlarni xuddi haqiqiy CSS Flexbox kabi ichki masofa (Padding) va oraliq masofa (Gap) bilan avtomatik moslashuvchan qilish texnologiyasidir.",
          rules: [
            "Shift + A: Tanlangan elementlarni Auto Layout freymiga aylantiradi.",
            "Hug contents: Tugma yoki blok o'lchami ichidagi matn uzunligiga qarab avtomatik kengayadi yoki qisqaradi.",
            "Fill container: Ichki element tashqi asosiy blok kengligini to'liq (100%) egallaydi."
          ],
          analogy: "Auto Layout rezina qutiga o'xshaydi: ichiga ko'proq narsa solsangiz o'zi kengayadi, bittasini olsangiz qolganlari avtomatik surilib joylashadi."
        },
        practice: {
          taskTitle: "Auto Layout yordamida moslashuvchan Navbar va narxlar kartochkasi (Pricing Card)",
          taskSteps: [
            "Matn va ikonkadan iborat tugma yasab, Shift+A bosing (Horizontal Padding: 24px, Vertical Padding: 12px, Gap: 8px).",
            "Tugma ichidagi yozuvni o'zgartirib, tugmaning o'zi qanday kengayishini sinab ko'ring.",
            "Ichma-ich Auto Layout orqali to'liq moslashuvchan 'Ta'riflar (Pricing)' kartochkasini yig'ing."
          ],
          expectedOutput: "Matn va ekran o'lchamiga avtomatik moslashuvchi Auto Layout tugmalar va kartochkalar."
        },
        proTips: [
          "Auto Layout'ni mukammal o'rgangan o'quvchi keyingi oyda CSS Flexbox'ni 1 darsdayoq tushunib oladi!",
          "Ro'yxatdagi elementlar o'rnini klaviaturadagi 'Yuqori/Pastki strelka' tugmalari bilan bir zumda almashtirish mumkin."
        ]
      },
      {
        id: 208,
        lessonNumber: 8,
        week: "3-hafta: Ilg'or vositalar — Auto Layout va komponentlar",
        title: "Komponentlar (Components) va nusxalar (Instances). Asosiy komponentdan o'zgarishlarni boshqarish",
        module: '2-Modul: Figma UI/UX',
        level: "O'rta",
        duration: '65 daqiqa',
        tools: ['Figma Components (Ctrl + Alt + K)', 'Assets Panel'],
        description: "Qayta ishlatiluvchi UI Komponentlar (Main Component) va ularning nusxalari (Instance) orqali dizayn-tizim qurish.",
        theory: {
          mainConcept: "Komponent (Main Component) — bu 'ona qolip' bo'lib, undan olingan barcha nusxalar (Instances) asosiy komponent o'zgarganda bir vaqtning o'zida avtomatik yangilanadi.",
          rules: [
            "Ctrl + Alt + K: Tanlangan Auto Layout blokni Main Component'ga (binafsha rangli 4 ta romb belgisi) aylantiradi.",
            "Main Component'dan 'Alt' tugmasini bosib tortilsa, uning nusxasi (Instance) hosil bo'ladi.",
            "Nusxada matn va rasmni o'zgartirish mumkin, lekin asosiy dizayn o'zgarishi Main Component'da amalga oshiriladi."
          ],
          analogy: "Main Component — bu muhr (pechat) qolipi, Instances esa qog'ozga bosilgan izlardir. Muhr qolipini o'zgartirsangiz, barcha izlar yangilanadi."
        },
        practice: {
          taskTitle: "Navbar, Footer va Mahsulot kartochkasidan Component kutubxonasini yaratish",
          taskSteps: [
            "Saytning yuqori menyusi (Header/Navbar) va Mahsulot kartochkasini chizing.",
            "Har ikkalasini Main Component'ga (Ctrl+Alt+K) aylantiring.",
            "Assets panelidan 6 ta mahsulot kartochkasi nusxasini tortib chiqarib, faqat nom va narxlarini o'zgartiring, so'ng Main Component'ning tugma rangini o'zgartirib mo'jizani kuzating!"
          ],
          expectedOutput: "Main Component va 6 ta Instance'dan iborat dinamik katalog."
        },
        proTips: [
          "Barcha Main Component'larni alohida 'UI Kit / Components' sahifasida saqlang — ish maydoningiz toza turadi.",
          "Agar bitta nusxani umumiy qolipdan uzmoqchi bo'lsangiz, 'Detach instance' (Ctrl+Alt+B) buyrug'idan foydalaning."
        ]
      },
      {
        id: 209,
        lessonNumber: 9,
        week: "3-hafta: Ilg'or vositalar — Auto Layout va komponentlar",
        title: "Variantlar (Variants) va Boolean xossalari: tugmalarning holatlari (Default, Hover, Active, Disabled)",
        module: '2-Modul: Figma UI/UX',
        level: "O'rta",
        duration: '65 daqiqa',
        tools: ['Figma Variants', 'Component Properties'],
        description: "Bitta komponentning turli holatlarini (Default, Hover, Pressed, Disabled) va turlarini (Primary, Secondary) Variants orqali birlashtirish.",
        theory: {
          mainConcept: "Variants — bu bitta UI elementning turli holatlari (sichqoncha borganda Hover, bosilganda Active, o'chiq holatda Disabled) va o'lchamlarini (Small, Medium, Large) bitta aqlli konteynerda jamlashdir.",
          rules: [
            "Tugma holatlari: Default (oddiy), Hover (ustiga sichqoncha kelganda yorqinlashishi), Active/Pressed (bosilganda), Disabled (noaktiv kulrang).",
            "Boolean Property: Komponent ichidagi ikonka yoki belgini o'ng paneldagi Switch (On/Off) tugmasi orqali yoqib-o'chirish.",
            "Bu usul haqiqiy React/Frontend komponentlar mantiqiga 100% mos keladi."
          ],
          analogy: "Variants — bu svetoforga o'xshaydi: korpusi bitta, lekin vaziyatga qarab qizil, sariq yoki yashil chirog'i yonadi."
        },
        practice: {
          taskTitle: "4 xil holatga ega (Default, Hover, Active, Disabled) interaktiv Button Variants tizimi",
          taskSteps: [
            "Asosiy tugma komponentini yaratib, yuqori paneldan 'Add Variant' tugmasini bosing.",
            "State xossasiga Default, Hover, Active va Disabled variantlarini qo'shib, ranglarini moslang.",
            "Ikonka uchun Boolean Property ('Show Icon: True/False') biriktiring."
          ],
          expectedOutput: "To'liq sozlangan professional Button Design System komponenti."
        },
        proTips: [
          "Hover holatida tugma rangini 10% to'qroq yoki yorqinroq qiling va biroz soya qo'shing.",
          "Input (kiritish maydoni) uchun ham Default, Focused (ko'k chegara) va Error (qizil chegara) variantlarini yarating."
        ]
      },
      {
        id: 210,
        lessonNumber: 10,
        week: '4-hafta: Bir sahifali sayt (Landing Page) dizayni va prototip',
        title: "Landing Page qismlari: Header (navigatsiya), Hero Section, xizmatlar kartochkalari va aloqa formasi",
        module: '2-Modul: Figma UI/UX',
        level: 'Amaliy Loyiha',
        duration: '75 daqiqa',
        tools: ['Figma', 'Auto Layout', '12-Column Grid'],
        description: "Zamonaviy bir sahifali veb-sayt (Landing Page) arxitekturasi: Header, Hero, Features, Testimonials, FAQ va Footer bloklarini chizish.",
        theory: {
          mainConcept: "Landing Page — foydalanuvchini aniq bir maqsadga (kursga yozilish, ilovani yuklab olish yoki buyurtma berishga) bosqichma-bosqich olib boruvchi bir sahifali veb-saytdir.",
          rules: [
            "1. Header (Navbar): Logotip, menyu havolalari va 'Kirish / Bog'lanish' tugmasi.",
            "2. Hero Section (Ilk ekran): Kuchli sarlavha (H1), qisqa tavsif, asosiy CTA tugma va jozibali illyustratsiya/mockup.",
            "3. Features / Xizmatlar, Mijozlar fikri (Reviews), Aloqa formasi (Contact Form) va Footer."
          ],
          analogy: "Landing Page tajribali sotuvchi suhbatiga o'xshaydi: avval salomlashib qiziqtiradi (Hero), keyin afzalliklarni ko'rsatadi (Features), ishonch uyg'otadi (Reviews) va taklif beradi (Form)."
        },
        practice: {
          taskTitle: "IT Akademiya yoki Startap uchun to'liq Landing Page dizaynini yig'ish",
          taskSteps: [
            "1440px kenglikdagi Desktop freymda 12 ustunli Grid va Auto Layout'ni yoqing.",
            "Ketma-ketlikda Header, Hero, 'Bizning kurslar' (3 ta kartochka), 'Nega biz?' (4 ta ustunlik) va 'Ro'yxatdan o'tish formasi' hamda Footer qismlarini chizing.",
            "Barcha rang va matnlarda avval yaratilgan Color Styles hamda Text Styles'dan foydalaning."
          ],
          expectedOutput: "5–6 ta blokdan iborat to'liq va zamonaviy Landing Page UI dizayni."
        },
        proTips: [
          "Har bir katta bo'lim (Section) orasida vertikal 80px–120px bo'sh masofa (Padding) qoldiring — sahifa nafas oladi.",
          "Hero qismidagi asosiy tugma (CTA) sahifadagi eng ko'zga tashlanadigan rangda bo'lishi shart."
        ]
      },
      {
        id: 211,
        lessonNumber: 11,
        week: '4-hafta: Bir sahifali sayt (Landing Page) dizayni va prototip',
        title: "Interaktiv prototiplash (Prototyping): sahifalararo o'tishlar, Smart Animate orqali tugmalarning silliq harakatlanishi",
        module: '2-Modul: Figma UI/UX',
        level: 'Amaliy Loyiha',
        duration: '65 daqiqa',
        tools: ['Figma Prototype Mode', 'Smart Animate'],
        description: "Chizilgan statik dizaynni bosiladigan jonli saytga aylantirish: sahifalararo bog'lanishlar, Scroll to section, Modal oynalar va Smart Animate.",
        theory: {
          mainConcept: "Prototiplash (Prototyping) — hali bitta ham kod yozilmasdan turib, dizaynni xuddi haqiqiy ishlayotgan sayt yoki ilova kabi bosib ko'rish va sinash imkoniyatidir.",
          rules: [
            "Prototype panelida tugmadan kerakli sahifa yoki bo'limga ko'k strelka (Node) tortiladi.",
            "While hovering -> Change to: Tugma ustiga sichqoncha kelganda Hover variantiga silliq o'zgaradi.",
            "Smart Animate: Ikki freymda bir xil nomlangan qatlamlarning o'lchami va joylashuvini avtomatik silliq animatsiya qiladi."
          ],
          analogy: "Prototip — bu yangi avtomobilning sinov haydoviga (Test drive) o'xshaydi: zavodda ommaviy ishlab chiqarishdan oldin rul va tugmalarni bosib ko'rasiz."
        },
        practice: {
          taskTitle: "Landing Page'ni jonlantirish: Hover tugmalar, Smooth Scroll va Modal oyna",
          taskSteps: [
            "Figma'da o'ng yuqori burchakdagi 'Prototype' bo'limiga o'ting.",
            "Navbar menyularini tegishli bo'limlarga 'Scroll to' (Animate: Smooth) bilan ulang.",
            "'Kursga yozilish' tugmasini bosganda 'Open overlay' orqali Ro'yxatdan o'tish modal oynasi ochiladigan qiling va Play (Present) tugmasi orqali tekshiring."
          ],
          expectedOutput: "Tugmalari bosiladigan, silliq aylanadigan va modal oynasi ochiladigan jonli interaktiv prototip."
        },
        proTips: [
          "Navbar (Header) joyida qotib turishi uchun unga 'Position: Sticky (rasmiy Fixed)' xossasini bering.",
          "Smart Animate to'g'ri ishlashi uchun 1-freym va 2-freymdagi qatlam nomlari 100% bir xil bo'lishi kerak!"
        ]
      },
      {
        id: 212,
        lessonNumber: 12,
        week: '4-hafta: Bir sahifali sayt (Landing Page) dizayni va prototip',
        title: "12-dars (2-oy imtihon loyihasi): Tayyorlangan zamonaviy Landing Page maketini taqdim etish va uni dasturchiga topshirish (Dev Mode) ko'nikmasini namoyish qilish",
        module: '2-Modul: Figma UI/UX',
        level: 'Amaliy Loyiha',
        duration: '90 daqiqa',
        tools: ['Figma', 'Dev Mode / Inspect', 'Export SVG/PNG'],
        description: "Landing Page loyihasining Desktop va Mobil versiyalarini yakunlash, UI Kit tayyorlash va Dev Mode orqali Frontend dasturchiga topshirish (3 va 4-oyda o'zingiz kodga o'tkazasiz!).",
        theory: {
          mainConcept: "UI/UX dizaynerning ishi chiroyli rasm chizish bilan tugamaydi — u dizaynni dasturchi (yoki o'zi) HTML va CSS'da osongina kodga o'tkaza oladigan darajada tartibli topshirishi shart.",
          rules: [
            "Dizayn Desktop (1440px) va Mobil (375px) ekranlarda to'liq moslashtirilgan bo'lishi kerak.",
            "Dev Mode (Inspect) orqali har bir elementning CSS xossalari (width, padding, font-size, color, border-radius) tekshiriladi.",
            "Ikonkalar SVG formatida, rasmlar esa siqilgan PNG/WEBP formatida eksportga tayyorlanadi."
          ],
          analogy: "Dev Mode — bu me'morning quruvchiga beradigan aniq chizma va o'lchamlar pasportidir."
        },
        practice: {
          taskTitle: "2-oy Imtihon Loyihasi: Desktop + Mobile Landing Page va UI Kit himoyasi",
          taskSteps: [
            "Landing Page maketining Desktop (1440px) va Mobil (375px) versiyalarini to'liq yakunlang.",
            "Alohida sahifada ishlatilgan barcha Color Styles, Text Styles va Button Variants'ni jamlang.",
            "Interaktiv prototip havolasini va maket skrinshotini Uyga vazifalar bo'limiga yuklang (4-oyda aynan shu dizaynni HTML5 va CSS3 da kodga o'tkazamiz!)."
          ],
          expectedOutput: "To'liq yakunlangan Desktop + Mobile Landing Page maketi va interaktiv prototipi (100 ballik 2-oy imtihoni)."
        },
        proTips: [
          "Loyihangizni topshirishdan oldin hech qayerda 'Frame 124' yoki 'Rectangle 55' degan nomsiz qatlam qolmaganiga ishonch hosil qiling.",
          "Shu dizaynni saqlab qo'ying — 3 va 4-modullarda uni haqiqiy ishlaydigan veb-saytga aylantirasiz!"
        ]
      }
    ]
  },

  // ============================================================================
  // 3-MODUL: HTML5 — VEB-SAHIFANING TUZILISHI VA SEMANTIKASI (1 OY / 12 TA DARS)
  // ============================================================================
  {
    id: 3,
    category: 'frontend',
    title: '3-MODUL: HTML5 — VEB-SAHIFANING TUZILISHI VA SEMANTIKASI',
    goal: "Internet ishlash tamoyillarini anglash, VS Code muhitida kod yozish va veb-sahifaning semantik to'g'ri poydevorini qurish.",
    description: "VS Code va Live Server, matn va ro'yxat teglari, havolalar, multimedia, jadvallar, formalar va Semantik HTML5 arxitekturasi (1 oy / 12 ta dars).",
    badge: '3-Oy · HTML5 Asoslari',
    durationBadge: '1 OY / 12 TA DARS',
    lessons: [
      {
        id: 301,
        lessonNumber: 1,
        week: '1-hafta: Internetga kirish va dastlabki teglar',
        title: "Veb qanday ishlaydi (Frontend va Backend tushunchasi). VS Code o'rnatish, qulay plaginlar (Live Server). HTML hujjati tuzilishi (<!DOCTYPE html>, <html>, <head>, <body>)",
        module: '3-Modul: HTML5',
        level: "Boshlang'ich",
        duration: '60 daqiqa',
        tools: ['VS Code', 'Live Server', 'Chrome DevTools'],
        description: "Frontend va Backend farqi, VS Code dasturlash muhitini sozlash hamda HTML5 hujjatining asosiy skeleti.",
        codeExample: `<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <title>Mening Ilk Veb-Sahifam</title>
</head>
<body>
  <h1>Salom, Frontend Olami!</h1>
  <p>Men SMART HIGH SCHOOL o'quvchisiman.</p>
</body>
</html>`,
        theory: {
          mainConcept: "Frontend — foydalanuvchi brauzerda ko'radigan va bosadigan qism (HTML, CSS, JS), Backend esa server va ma'lumotlar bazasida ishlaydigan ko'rinmas mantiqdir.",
          rules: [
            "<!DOCTYPE html> — brauzerga hujjat zamonaviy HTML5 standartida ekanligini bildiradi.",
            "<head> — sahifa haqidagi texnik ma'lumotlar va sarlavha (<title>) joylashadigan qism.",
            "<body> — foydalanuvchi ekranida ko'rinadigan barcha matn, rasm va tugmalar yoziladigan tana qismi."
          ],
          analogy: "Veb-sayt inson tanasiga o'xshaydi: HTML — bu suyak skeleti, CSS — kiyim va tashqi chiroy, JavaScript esa harakatlantiruvchi muskullardir."
        },
        practice: {
          taskTitle: "VS Code'da ilk index.html faylini yaratish va Live Server'da ishga tushirish",
          taskSteps: [
            "VS Code dasturini ochib, 'Live Server' va 'Prettier' plaginlarini o'rnating.",
            "`index.html` faylini yaratib, `!` va `Tab` tugmasini bosish orqali tayyor HTML5 skeletini chiqaring.",
            "Body ichiga o'z ismingiz va maqsadingizni yozib, 'Go Live' tugmasi orqali brauzerda oching."
          ],
          expectedOutput: "Brauzerda Live Server orqali ochilgan ilk shaxsiy HTML5 veb-sahifa."
        },
        proTips: [
          "VS Code'da `!` belgisini yozib `Enter` yoki `Tab` bossangiz, Emmet avtomatik ravishda to'liq HTML5 shablonini yozib beradi!",
          "Fayl nomlarini doim kichik harflarda va bo'sh joysiz yozing (`index.html`, `about-us.html`)."
        ]
      },
      {
        id: 302,
        lessonNumber: 2,
        week: '1-hafta: Internetga kirish va dastlabki teglar',
        title: "Matn teglari: Sarlavhalar (<h1>–<h6>), xatboshilar (<p>), matnni ajratish (<b>, <strong>, <i>, <em>, <mark>)",
        module: '3-Modul: HTML5',
        level: "Boshlang'ich",
        duration: '60 daqiqa',
        tools: ['VS Code', 'HTML5'],
        description: "6 darajali sarlavhalar (h1–h6), paragraflar (p) va matnga semantik urg'u beruvchi formatlash teglari.",
        codeExample: `<h1>SMART HIGH SCHOOL IT Akademiyasi</h1>
<h2>Frontend Dasturlash Kursi</h2>
<p>Ushbu kursda siz <strong>HTML5 va CSS3</strong> texnologiyalarini <em>amaliy loyihalar</em> orqali o'rganasiz.</p>
<p>Darslar <mark>haftada 3 kun</mark> bo'lib o'tadi.</p>
<hr>`,
        theory: {
          mainConcept: "HTML matn teglari shunchaki harfni kattalashtirish uchun emas, balki qidiruv tizimlariga (Google SEO) qaysi matn asosiy sarlavha va qaysi biri muhim ekanini tushuntirish uchun xizmat qiladi.",
          rules: [
            "<h1> — sahifadagi eng katta va eng asosiy sarlavha (har bir sahifada faqat 1 marta ishlatiladi!).",
            "<strong> — matnning juda muhimligini bildirib qalinlashtiradi; <em> — urg'u berib qiyshaytiradi (kursiv).",
            "<mark> — matnni sariq marker bilan belgilagandek ajratib ko'rsatadi; <br> — yangi qatorga tushiradi; <hr> — gorizontal chiziq tortadi."
          ],
          analogy: "<strong> va <mark> teglari kitob o'qiyotganda eng muhim jumlalarning tagiga chizib yoki sariq marker surtib qo'yishga o'xshaydi."
        },
        practice: {
          taskTitle: "O'zingiz haqingizda maqola va IT yangiliklar sahifasini yozish",
          taskSteps: [
            "`news.html` faylini ochib, <h1> da asosiy yangilik sarlavhasini, <h2> da kichik bo'limlarni yozing.",
            "3 ta <p> xatboshi ichida <strong>, <em> va <mark> teglaridan foydalanib muhim atamalarni ajrating.",
            "Bo'limlar orasini <hr> chizig'i bilan ajratib chiqing."
          ],
          expectedOutput: "To'g'ri sarlavha ierarxiyasiga ega formatlangan HTML maqola."
        },
        proTips: [
          "VS Code'da `p*3` deb yozib Tab bossangiz, birdaniga 3 ta `<p></p>` tegi ochiladi.",
          "`lorem20` deb yozib Tab bossangiz, 20 ta so'zdan iborat sinov matni hosil bo'ladi."
        ]
      },
      {
        id: 303,
        lessonNumber: 3,
        week: '1-hafta: Internetga kirish va dastlabki teglar',
        title: "Ro'yxatlar: tartiblangan (<ol>), tartiblanmagan (<ul>) va ichma-ich ro'yxatlar yaratish (<li>)",
        module: '3-Modul: HTML5',
        level: "Boshlang'ich",
        duration: '60 daqiqa',
        tools: ['VS Code', 'HTML5 Lists'],
        description: "Raqamlangan (<ol>), nuqtali (<ul>) va ko'p pog'onali ichma-ich ro'yxatlarni (<li>) yaratish.",
        codeExample: `<h3>Frontend Kursi Dasturi:</h3>
<ol>
  <li>Canva Grafik Dizayn</li>
  <li>Figma UI/UX Dizayn</li>
  <li>HTML5 va CSS3:
    <ul>
      <li>Semantik teglar</li>
      <li>Flexbox va Responsive</li>
    </ul>
  </li>
</ol>`,
        theory: {
          mainConcept: "Ro'yxatlar ma'lumotlarni tartibga solish bilan birga, veb-saytlarning navigatsiya menyularini (Navbar) qurishda eng asosiy element hisoblanadi.",
          rules: [
            "<ul> (Unordered List) — ketma-ketligi muhim bo'lmagan nuqtali ro'yxat.",
            "<ol> (Ordered List) — qadam-baqadam bajariladigan raqamlangan ro'yxat (1, 2, 3... yoki A, B, C).",
            "<li> (List Item) — ro'yxatning har bir bandi; ichma-ich ro'yxat ochish uchun yangi <ul> aynan <li> ning ichiga yoziladi."
          ],
          analogy: "<ul> — bu bozorlik ro'yxati (qaysi birini oldin olish farqsiz), <ol> esa ovqat pishirish retseptidir (qadamlarni almashtirib bo'lmaydi)."
        },
        practice: {
          taskTitle: "O'quv markazi kurslari va haftalik kun tartibi ro'yxatini tuzish",
          taskSteps: [
            "Haftalik darslar ketma-ketligini <ol> yordamida raqamlangan ro'yxat qiling.",
            "Har bir kurs ichidagi o'rganiladigan dasturlarni ichma-ich <ul> va <li> yordamida shakllantiring.",
            "`ol>li*5` Emmet qisqartmasidan foydalanib ko'ring."
          ],
          expectedOutput: "Tartiblangan va ichma-ich joylashgan ko'p pog'onali HTML ro'yxat."
        },
        proTips: [
          "<ul> va <ol> teglarining bevosita bolasi faqatgina <li> bo'lishi mumkin!",
          "`<ol type=\"A\" start=\"1\">` atributi orqali raqamlashni harflarga o'zgartirish mumkin."
        ]
      },
      {
        id: 304,
        lessonNumber: 4,
        week: "2-hafta: Bog'lanishlar va multimedia",
        title: "Giperhavolalar (<a> tegi, href, target=\"_blank\" atributlari). Sahifa ichida navigatsiya (Anchor links)",
        module: '3-Modul: HTML5',
        level: "Boshlang'ich",
        duration: '60 daqiqa',
        tools: ['VS Code', 'HTML5 Anchor Tags'],
        description: "Tashqi saytlarga, ichki sahifalarga, telefon/emailga va sahifaning ma'lum bir bo'limiga (#id) o'tuvchi havolalar.",
        codeExample: `<nav>
  <a href="index.html">Bosh sahifa</a> |
  <a href="#kurslar">Kurslarimiz</a> |
  <a href="https://google.com" target="_blank">Google (Yangi oynada)</a> |
  <a href="tel:+998901234567">Qo'ng'iroq qilish</a>
</nav>

<section id="kurslar">
  <h2>Bizning Kurslar</h2>
</section>`,
        theory: {
          mainConcept: "Internetning eng katta kuchi — bu Giperhavola (Hyperlink): `<a>` tegi sahifalarni bir-biriga bog'lab, yagona veb-tarmoq hosil qiladi.",
          rules: [
            "`href` atributi havola qayerga olib borishini ko'rsatadi.",
            "`target=\"_blank\"` — tashqi saytni yangi brauzer oynasida ochadi (foydalanuvchi sizning saytingizdan chiqib ketmaydi).",
            "`href=\"#aloqa\"` — shu sahifaning o'zidagi `id=\"aloqa\"` berilgan bo'limga silliq tushiradi (Anchor link)."
          ],
          analogy: "`<a>` tegi xonalar orasidagi eshikka yoki lift tugmasiga o'xshaydi: bossangiz, sizni kerakli qavatga yoki boshqa binoga olib o'tadi."
        },
        practice: {
          taskTitle: "3 sahifali mini-sayt (`index.html`, `courses.html`, `contact.html`) navigatsiyasini bog'lash",
          taskSteps: [
            "3 ta HTML fayl yarating va har birining yuqori qismiga bir-biriga o'tuvchi `<a href=\"...\">` menyu qo'ying.",
            "Bosh sahifada pastki bo'limlarga tez tushuvchi `#haqimizda` va `#aloqa` ichki anchor havolalarni sozlang.",
            "Telegram va telefon raqamingizga bosiladigan havola biriktiring."
          ],
          expectedOutput: "Sahifalararo va sahifa ichida erkin o'tuvchi to'liq navigatsiya tizimi."
        },
        proTips: [
          "`target=\"_blank\"` ishlatganda xavfsizlik uchun `rel=\"noopener noreferrer\"` qo'shish professional odat hisoblanadi.",
          "Foydalanuvchi sahifa pastidan bir zumda tepaga chiqishi uchun `<a href=\"#top\">Yuqoriga ↑</a>` tugmasini qo'ying."
        ]
      },
      {
        id: 305,
        lessonNumber: 5,
        week: "2-hafta: Bog'lanishlar va multimedia",
        title: "Rasmlar bilan ishlash (<img> tegi, src, alt, width, height atributlari). Vektorli va rastrli formatlar farqi",
        module: '3-Modul: HTML5',
        level: "Boshlang'ich",
        duration: '60 daqiqa',
        tools: ['VS Code', 'HTML5 Images', 'SVG/PNG/JPG/WEBP'],
        description: "Veb-sahifaga mahalliy va internetdagi rasmlarni joylash, alt atributining ahamiyati hamda JPG, PNG, WEBP va SVG formatlari.",
        codeExample: `<figure>
  <img 
    src="images/smart-school-logo.png" 
    alt="SMART HIGH SCHOOL rasmiy logotipi" 
    width="200" 
    height="200"
  >
  <figcaption>1-rasm: Akademiya logotipi</figcaption>
</figure>`,
        theory: {
          mainConcept: "Rasmlar sahifani jonlantiradi. To'g'ri format (SVG, WEBP, PNG) tanlash saytning tez yuklanishini va sifatli ko'rinishini ta'minlaydi.",
          rules: [
            "`src` (Source) — rasm manzili; `alt` (Alternative text) — rasm yuklanmay qolganda chiqadigan va Google qidiruvi o'qiydigan tavsif matni.",
            "Rastrli formatlar: JPG (fotosuratlar), PNG (shaffof fonli rasmlar), WEBP (veb uchun eng yengil va zamonaviy format).",
            "Vektorli format: SVG — logotip va ikonkalar uchun ideal, qancha kattalashtirilsa ham xiralashmaydi."
          ],
          analogy: "`alt` atributi — bu ko'zi ojiz insonlar uchun rasmni ovozli o'qib beruvchi suxandon va internet uzilganda rasm o'rnida turuvchi izohdir."
        },
        practice: {
          taskTitle: "Foto-galereya va bosiladigan rasm-havolalar sahifasi",
          taskSteps: [
            "Loyiha papkasida `images` papkasini ochib, unga 4 ta rasm joylang.",
            "`<img>` tegi va `<figure>`, `<figcaption>` yordamida izohli rasmlar galereyasini yarating.",
            "Rasmlardan birini `<a href=\"...\">` tegi ichiga olib, rasm ustiga bosganda boshqa sahifaga o'tadigan qiling."
          ],
          expectedOutput: "To'g'ri `alt` va o'lchamlarga ega semantik foto-galereya sahifasi."
        },
        proTips: [
          "Rasmning ham `width`, ham `height` o'lchamini noto'g'ri bersangiz rasm cho'zilib qoladi — faqat `width` ni bersangiz bo'yi avtomatik proporsional moslashadi.",
          "Sahifa pastidagi rasmlarga `loading=\"lazy\"` atributini qo'shsangiz, sayt 2 barobar tezroq ochiladi!"
        ]
      },
      {
        id: 306,
        lessonNumber: 6,
        week: "2-hafta: Bog'lanishlar va multimedia",
        title: "Audio, video va tashqi resurslar: <video>, <audio> teglari hamda YouTube videolarini <iframe> orqali saytga integratsiya qilish",
        module: '3-Modul: HTML5',
        level: "Boshlang'ich",
        duration: '60 daqiqa',
        tools: ['VS Code', 'HTML5 Media', 'YouTube Embed & Google Maps Iframe'],
        description: "Sahifaga video va audio pleerlar joylash (controls, autoplay, muted, loop, poster) hamda YouTube video va Google Xaritani <iframe> orqali ulash.",
        codeExample: `<video src="media/promo.mp4" controls width="600" poster="images/cover.jpg"></video>

<audio src="media/podcast.mp3" controls></audio>

<iframe 
  width="560" 
  height="315" 
  src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
  title="Video dars" 
  allowfullscreen>
</iframe>`,
        theory: {
          mainConcept: "HTML5 hech qanday qo'shimcha plaginlarsiz to'g'ridan-to'g'ri brauzerda video, audio hamda interaktiv xarita va YouTube darsliklarni ko'rsata oladi.",
          rules: [
            "`controls` atributi yozilmasa, video yoki audioning Play/Pause tugmalari ko'rinmaydi.",
            "`poster` — video boshlanishidan oldin uning ustida turadigan muqova (Thumbnail) rasmi.",
            "`<iframe>` — sizning veb-sahifangiz ichida boshqa sayt qismini (YouTube video, Google Maps manzilini) ko'rsatuvchi 'oyna'dir."
          ],
          analogy: "`<iframe>` uyingiz devoridagi televizor ekraniga o'xshaydi — uyingizda o'tirib YouTube yoki dunyo xaritasini jonli tomosha qilasiz."
        },
        practice: {
          taskTitle: "Onlayn Video-darslik va Google Maps manzil sahifasini yaratish",
          taskSteps: [
            "Sahifaga `<video controls poster=\"...\">` va `<audio controls>` pleerlarini joylashtiring.",
            "YouTube'dagi biror IT darslikda 'Ulashish (Share) -> Joylash (Embed)' tugmasini bosib, `<iframe>` kodini saytingizga qo'ying.",
            "Google Maps'dan o'quv markazi joylashuvini `<iframe>` orqali saytning 'Manzilimiz' qismiga ulang."
          ],
          expectedOutput: "Video pleer, YouTube darslik va interaktiv Google Xarita ulangan multimedia sahifasi."
        },
        proTips: [
          "Brauzerlarda video avtomatik o'ynashi (`autoplay`) uchun uning yonida albatta `muted` (ovozsiz) atributi ham bo'lishi shart!",
          "YouTube videoni oddiy havola bilan emas, aynan `/embed/` manzili orqali `<iframe>` ga qo'ying."
        ]
      },
      {
        id: 307,
        lessonNumber: 7,
        week: "3-hafta: Jadvallar va ma'lumotlar formasi",
        title: "Jadvallar: <table>, <tr>, <th>, <td>. Kataklarni birlashtirish (colspan, rowspan)",
        module: '3-Modul: HTML5',
        level: "O'rta",
        duration: '65 daqiqa',
        tools: ['VS Code', 'HTML5 Tables'],
        description: "Dars jadvallari, narxnomalar va reyting ro'yxatlarini <table>, <thead>, <tbody>, <tr>, <th>, <td> hamda colspan/rowspan yordamida qurish.",
        codeExample: `<table border="1" cellpadding="10">
  <thead>
    <tr>
      <th>Guruh</th>
      <th>Kunlar</th>
      <th>Vaqti</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1-Guruh</td>
      <td>Dushanba / Chorshanba</td>
      <td>10:00 - 11:30</td>
    </tr>
  </tbody>
</table>`,
        theory: {
          mainConcept: "Jadvallar (`<table>`) dars vaqtlari, o'quvchilar baholari va moliyaviy hisobotlarni qator va ustunlarda aniq ko'rsatish uchun ishlatiladi.",
          rules: [
            "`<tr>` (Table Row) — jadval qatori; `<th>` (Table Header) — ustun sarlavhasi (qalin va o'rtada chiqadi); `<td>` (Table Data) — oddiy ma'lumot katagi.",
            "`colspan=\"2\"` — katakni gorizontaliga (yonma-yon 2 ta ustunni) birlashtiradi.",
            "`rowspan=\"2\"` — katakni vertikaliga (ustma-ust 2 ta qatorni) birlashtiradi."
          ],
          analogy: "`colspan` — ikki xona orasidagi devorni buzib bitta keng zal qilish, `rowspan` esa ikki qavatli dupleks xona qilishga o'xshaydi."
        },
        practice: {
          taskTitle: "Maktab dars jadvali va o'quvchilar reyting jadvalini HTML'da tuzish",
          taskSteps: [
            "`<thead>`, `<tbody>` va `<tfoot>` qismlaridan iborat 5 ustunli Dars jadvalini yarating.",
            "Tushlik tanaffusi qatorida `colspan=\"5\"` ishlatib barcha ustunlarni birlashtiring.",
            "`rowspan` yordamida ketma-ket 2 soat bo'ladigan laboratoriya darsini bitta katakka birlashtiring."
          ],
          expectedOutput: "`colspan` va `rowspan` amallari to'g'ri qo'llangan mukammal HTML jadval."
        },
        proTips: [
          "Katak birlashtirilganda (`colspan=\"2\"`), o'sha qatordagi ortiqcha `<td>` tegini o'chirishni unutmang, aks holda jadval chetga chiqib ketadi!",
          "Jadvallarni faqat jadval ma'lumotlari uchun ishlating, sahifa maketini terish uchun esa Flexbox/Grid ishlatiladi."
        ]
      },
      {
        id: 308,
        lessonNumber: 8,
        week: "3-hafta: Jadvallar va ma'lumotlar formasi",
        title: "Foydalanuvchi bilan aloqa: <form> tegi, asosiy kiritish maydonlari (<input type=\"text | email | password | number | date\">)",
        module: '3-Modul: HTML5',
        level: "O'rta",
        duration: '65 daqiqa',
        tools: ['VS Code', 'HTML5 Forms'],
        description: "Ro'yxatdan o'tish va tizimga kirish formalari, <label> va <input> turlari hamda placeholder va required atributlari.",
        codeExample: `<form action="/register" method="POST">
  <label for="ism">Ismingiz:</label>
  <input type="text" id="ism" name="fullName" placeholder="Ismingizni kiriting" required>

  <label for="pochta">Email:</label>
  <input type="email" id="pochta" name="email" required>

  <label for="parol">Parol:</label>
  <input type="password" id="parol" name="password" minlength="6" required>

  <button type="submit">Ro'yxatdan o'tish</button>
</form>`,
        theory: {
          mainConcept: "Formalar (`<form>`) — veb-saytning foydalanuvchidan ma'lumot qabul qilib oluvchi (login, parol, buyurtma, qidiruv) yagona interaktiv ko'prigidir.",
          rules: [
            "Har bir `<input>` maydoni uchun `<label for=\"...\">` yozilishi va `for` qiymati inputning `id` siga teng bo'lishi shart.",
            "`placeholder` — maydon ichida xira ko'rinib turuvchi yordamchi yozuv; `required` — maydonni to'ldirmasdan yuborishga ruxsat bermaydi.",
            "`type=\"email\"` (@ belgisini tekshiradi), `type=\"password\"` (yozuvni yulduzcha qiladi), `type=\"date\"` (kalendar chiqaradi)."
          ],
          analogy: "`<form>` — bu bank yoki o'quv markazida to'ldiriladigan rasmiy anketa varaqasidir."
        },
        practice: {
          taskTitle: "O'quv markaziga onlayn ro'yxatdan o'tish anketasini yaratish",
          taskSteps: [
            "Ism-sharif (`text`), Telefon (`tel`), Email (`email`), Parol (`password`), Tug'ilgan sana (`date`) va Yosh (`number`) maydonlaridan iborat `<form>` yarating.",
            "Har bir inputga `<label>`, `placeholder` va `required` atributlarini qo'shing.",
            "Bo'sh holatda 'Yuborish' tugmasini bosib, brauzerning avtomatik tekshiruvi (Validation) qanday ishlashini sinab ko'ring."
          ],
          expectedOutput: "Validatsiyaga ega bo'lgan 6 maydonli HTML ro'yxatdan o'tish formasi."
        },
        proTips: [
          "`<label for=\"ism\">` to'g'ri ulangan bo'lsa, foydalanuvchi 'Ismingiz' degan yozuv ustiga bossa ham kursor avtomatik input ichiga tushadi!",
          "Telefon raqami uchun `type=\"tel\"` ishlatsangiz, smartfonda kirgan odamga darhol raqamli klaviatura chiqadi."
        ]
      },
      {
        id: 309,
        lessonNumber: 9,
        week: "3-hafta: Jadvallar va ma'lumotlar formasi",
        title: "Kengaytirilgan forma elementlari: <textarea>, <select>, <option>, radio tugmalar, checkboxlar va <button>",
        module: '3-Modul: HTML5',
        level: "O'rta",
        duration: '65 daqiqa',
        tools: ['VS Code', 'HTML5 Form Controls'],
        description: "Ochiluvchi ro'yxat (<select>), ko'p qatorli izoh (<textarea>), bitta tanlovli (radio), ko'p tanlovli (checkbox) va fayl yuklash (<input type=\"file\">) elementlari.",
        codeExample: `<label for="kurs">Yo'nalishni tanlang:</label>
<select id="kurs" name="track">
  <option value="canva">Canva Grafik Dizayn</option>
  <option value="figma">Figma UI/UX</option>
  <option value="frontend">Frontend (HTML/CSS)</option>
</select>

<p>Dars vaqtini tanlang:</p>
<label><input type="radio" name="shift" value="10:00"> 10:00 guruhi</label>
<label><input type="radio" name="shift" value="14:30"> 14:30 guruhi</label>

<textarea rows="4" placeholder="Qo'shimcha izohingiz..."></textarea>`,
        theory: {
          mainConcept: "Kengaytirilgan forma elementlari foydalanuvchiga tayyor variantlardan tanlash, fayl biriktirish va uzun xabarlar yozish qulayligini yaratadi.",
          rules: [
            "`type=\"radio\"` — bir nechta variantdan FAQAT BITTASINI tanlash uchun (barcha radio inputlarning `name` atributi bir xil bo'lishi shart!).",
            "`type=\"checkbox\"` — bir vaqtda bir nechta variantni belgilash yoki 'Shartlarga roziman' katakchasi uchun.",
            "`<select>` va `<option>` — ochiladigan (Dropdown) tanlov menyusi; `<textarea>` — ko'p qatorli xabar maydoni."
          ],
          analogy: "`Radio` — bu testdagi A, B, C, D javoblaridan faqat bittasini belgilash, `Checkbox` esa pitssaga ham pishloq, ham qo'ziqorin, ham zaytun qo'shishni tanlashdir."
        },
        practice: {
          taskTitle: "IT Kursga yozilish va Uyga vazifa topshirishning to'liq interaktiv formasi",
          taskSteps: [
            "`<fieldset>` va `<legend>` yordamida formani 2 qismga ('Shaxsiy ma'lumotlar' va 'Kurs tanlovi') ajrating.",
            "Kursni `<select>` orqali, dars vaqtini `radio` tugmalar orqali, qo'shimcha tillarni `checkbox` orqali tanlanadigan qiling.",
            "`<input type=\"file\">`, `<textarea>` va `<button type=\"submit\">` hamda `<button type=\"reset\">` tugmalarini qo'shing."
          ],
          expectedOutput: "Barcha turdagi forma elementlarini qamrab olgan mukammal so'rovnoma formasi."
        },
        proTips: [
          "Agar `radio` tugmalarning `name` atributini bir xil qilmasangiz, ularning barchasi baravar belgilanib qoladi!",
          "`<button>` tegining `type` atributini doim aniq ko'rsating: formani yuborish uchun `type=\"submit\"`, oddiy tugma uchun `type=\"button\"`."
        ]
      },
      {
        id: 310,
        lessonNumber: 10,
        week: '4-hafta: Semantik HTML5 va sahifa arxitekturasi',
        title: "Semantik teglarning ahamiyati (SEO va qulaylik): <header>, <nav>, <main>, <section>, <article>, <aside>, <footer>",
        module: '3-Modul: HTML5',
        level: "O'rta",
        duration: '65 daqiqa',
        tools: ['VS Code', 'HTML5 Semantics', 'Lighthouse SEO'],
        description: "Zamonaviy veb-sahifa arxitekturasini ma'noli (semantik) HTML5 teglar yordamida qurish va Google qidiruv tizimi (SEO) talablari.",
        codeExample: `<body>
  <header>
    <nav><!-- Menyu havolalari --></nav>
  </header>

  <main>
    <section id="hero"><!-- Asosiy banner --></section>
    <section id="courses">
      <article><!-- Kurs kartochkasi --></article>
    </section>
    <aside><!-- Yon panel yangiliklari --></aside>
  </main>

  <footer>
    <p>&copy; 2026 SMART HIGH SCHOOL</p>
  </footer>
</body>`,
        theory: {
          mainConcept: "Semantik HTML — bu har bir sahifa qismini o'z nomi va vazifasiga mos teg bilan o'rashdir. Bu kodni toza qiladi va saytni Google qidiruvida 1-o'rinlarga chiqaradi (SEO).",
          rules: [
            "`<header>` — sayt yoki bo'limning tepa qismi; `<nav>` — asosiy navigatsiya menyusi.",
            "`<main>` — sahifaning eng asosiy noyob mazmuni; `<section>` — mantiqiy bo'lim; `<article>` — mustaqil maqola yoki mahsulot kartochkasi.",
            "`<aside>` — yon panel (Sidebar); `<footer>` — saytning eng pastki qismi (mualliflik huquqi, manzillar)."
          ],
          analogy: "Semantik teglar supermarketdagi bo'lim yozuvlariga ('Sut mahsulotlari', 'Mevalar', 'Kassa') o'xshaydi — xaridor ham, qidiruv roboti ham kerakli joyni darhol topadi."
        },
        practice: {
          taskTitle: "Figma'da chizilgan Landing Page strukturasini Semantik HTML5 da qurish",
          taskSteps: [
            "Yangi `semantic-page.html` faylida `<header>`, `<nav>`, `<main>`, 3 ta `<section>`, `<article>` va `<footer>` teglaridan iborat karkas tuzing.",
            "Har bir `<section>` ichiga tegishli `<h2>` sarlavha va ma'lumotlarni joylashtiring.",
            "Kodda birorta ham ma'nosiz ortiqcha `<div>` ishlatmasdan toza struktura hosil qiling."
          ],
          expectedOutput: "100% Semantik HTML5 standartiga mos veb-sahifa arxitekturasi."
        },
        proTips: [
          "Har bir `<section>` odatda o'zining `<h2>` sarlavhasiga ega bo'lishi kerak.",
          "`<main>` tegi bitta HTML sahifada faqat 1 marta ishlatiladi."
        ]
      },
      {
        id: 311,
        lessonNumber: 11,
        week: '4-hafta: Semantik HTML5 va sahifa arxitekturasi',
        title: "Blokli (<div>) va qatorli (<span>) elementlar farqi. Meta teglar (Viewport, Charset, Title, Favicon)",
        module: '3-Modul: HTML5',
        level: "O'rta",
        duration: '60 daqiqa',
        tools: ['VS Code', 'HTML5 Head & Meta'],
        description: "Block-level va Inline elementlar xulq-atvori, <div> va <span> konteynerlari hamda <head> ichidagi muhim Meta teglar va Favicon.",
        codeExample: `<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="SMART HIGH SCHOOL - IT va Dizayn Akademiyasi">
  <link rel="icon" type="image/png" href="favicon.png">
  <title>SMART HIGH SCHOOL</title>
</head>
<body>
  <div class="card">
    <h2>Chegirma: <span class="badge">50% OFF</span></h2>
  </div>
</body>`,
        theory: {
          mainConcept: "HTML'dagi barcha teglar ekranda joy egallashiga ko'ra ikki guruhga bo'linadi: Blokli (butun qatorni egallovchi) va Qatorli (faqat o'z yozuvi joyini egallovchi).",
          rules: [
            "Blokli (Block) elementlar (`<div>`, `<h1>`–`<h6>`, `<p>`, `<section>`, `<ul>`): har doim yangi qatordan boshlanadi va 100% kenglikni oladi.",
            "Qatorli (Inline) elementlar (`<span>`, `<a>`, `<strong>`, `<img>`, `<button>`): matn ichida yonma-yon joylashadi.",
            "`<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">` — sayt mobil telefonda kichrayib ketmasdan to'g'ri ochilishi uchun eng muhim meta-tegdir!"
          ],
          analogy: "`<div>` — bu alohida katta quti (ustma-ust taxlanadi), `<span>` esa quti ichidagi bitta so'zga yopishtirilgan rangli stikerdir."
        },
        practice: {
          taskTitle: "SEO Meta teglar, Favicon va Blokli/Qatorli elementlar laboratoriyasi",
          taskSteps: [
            "Sahifaning `<head>` qismiga `charset`, `viewport`, `description`, `keywords` va `<link rel=\"icon\">` (Favicon) teglarini to'liq yozing.",
            "Body qismida 3 ta `<div>` kartochka va ularning sarlavhasi ichida `<span>` orqali ajratilgan aksent so'zlar yarating.",
            "Brauzer tabida siz qo'ygan Favicon ikonkasi va Title chiqqanini tekshiring."
          ],
          expectedOutput: "Favicon, SEO meta teglar va to'g'ri guruhlangan `div`/`span` strukturali sahifa."
        },
        proTips: [
          "Qatorli (`<span>`, `<a>`) elementlarning ichiga hech qachon blokli (`<div>`, `<p>`) elementlarni solmang!",
          "`charset=\"UTF-8\"` yozilmasa, o'zbekcha `o'`, `g'` harflari va smayliklar buzilib chiqadi."
        ]
      },
      {
        id: 312,
        lessonNumber: 12,
        week: '4-hafta: Semantik HTML5 va sahifa arxitekturasi',
        title: "12-dars (3-oy imtihon loyihasi): Barcha o'rganilgan teglarni o'z ichiga olgan mukammal, xatosiz semantik tuzilgan ko'p sahifali veb-sayt skeletini yaratish",
        module: '3-Modul: HTML5',
        level: 'Amaliy Loyiha',
        duration: '90 daqiqa',
        tools: ['VS Code', 'HTML5', 'W3C Validator'],
        description: "3-oy yakuniy imtihoni: Bosh sahifa, Kurslar jadvali, Media galereya va Ro'yxatdan o'tish formasidan iborat ko'p sahifali Semantik HTML5 veb-sayt qurish.",
        theory: {
          mainConcept: "Mukammal HTML poydevor — har qanday kuchli veb-saytning yuragidir. Agar HTML semantik va toza yozilgan bo'lsa, keyingi oyda CSS bilan uni bezatish juda oson kechadi.",
          rules: [
            "Loyiha kamida 3 ta o'zaro bog'langan HTML sahifadan (`index.html`, `courses.html`, `contact.html`) iborat bo'lishi kerak.",
            "Unda Semantik teglar (`header`, `nav`, `main`, `section`, `footer`), rasmlar, video/iframe, `table` jadvali va `form` bo'lishi shart.",
            "Barcha teglar to'g'ri ochilib-yopilgan va tartibli indentatsiya (Format Document) qilingan bo'lishi lozim."
          ],
          analogy: "Ushbu imtihon loyihasi — yangi zamonaviy binoning barcha g'ishtlari, eshiklari va derazalari o'rnatilgan mustahkam qurilish bosqichidir."
        },
        practice: {
          taskTitle: "3-oy Imtihon Loyihasi: Ko'p sahifali IT Akademiya HTML5 Veb-sayti",
          taskSteps: [
            "`index.html` (Asosiy sahifa, Hero, Kurslar kartochkalari va Video), `schedule.html` (Dars jadvali `<table>`) va `register.html` (To'liq `<form>`) fayllarini yarating.",
            "Barcha sahifalarda yagona `<header>` menyusi va `<footer>` qismini bog'lang.",
            "Loyiha fayllarini ZIP arxiv yoki skrinshot shaklida Uyga vazifalar bo'limiga yuklang."
          ],
          expectedOutput: "3 sahifali, semantik toza va barcha HTML5 elementlarini o'z ichiga olgan veb-sayt (100 ballik 3-oy imtihoni)."
        },
        proTips: [
          "VS Code'da `Shift + Alt + F` tugmalarini bossangiz, Prettier barcha HTML kodingizni bir zumda chiroyli tekislab beradi.",
          "Har bir class nomini ma'noli yozib keting (`class=\"hero-section\"`, `class=\"course-card\"`) — 4-modulda CSS yozishga tayyor turadi!"
        ]
      }
    ]
  },

  // ============================================================================
  // 4-MODUL: CSS3 — VEB-SAHIFANI BEZATISH VA MOSLASHUVCHANLIK (1 OY / 12 TA DARS)
  // ============================================================================
  {
    id: 4,
    category: 'frontend',
    title: '4-MODUL: CSS3 — VEB-SAHIFANI BEZATISH VA MOSLASHUVCHANLIK',
    goal: "Saytga rang-barang ko'rinish berish, zamonaviy joylashuv (Flexbox), animatsiyalar va mobil qurilmalarga moslashuvchan (Responsive) sahifalar yasash.",
    description: "CSS selektorlar, Box Model, Flexbox, Position, Hover effektlar, Keyframes animatsiyalar, Responsive (@media) va Figma-to-Code yakuniy loyihasi (1 oy / 12 ta dars).",
    badge: '4-Oy · CSS3 & Responsive',
    durationBadge: '1 OY / 12 TA DARS',
    lessons: [
      {
        id: 401,
        lessonNumber: 13,
        week: '1-hafta: CSS sintaksisi va matn dizayni',
        title: "13-dars: CSS nima va u HTML ga qanday ulanadi (External CSS). Selektorlar turlari (Tag, Class, ID). Ranglar (HEX, RGB, HSL) va fonlar (background-color, background-image)",
        module: '4-Modul: CSS3',
        level: "Boshlang'ich",
        duration: '60 daqiqa',
        tools: ['VS Code', 'CSS3', 'Chrome DevTools'],
        description: "External CSS (`style.css`) faylini `<link>` orqali ulash, Tag, `.class` va `#id` selektorlari hamda rang va orqa fon xossalari.",
        codeExample: `/* style.css */
body {
  background-color: #FDFBF7;
  color: #2D2D2D;
}

.hero-banner {
  background: linear-gradient(135deg, #2C3E2D, #1E2E20);
  color: #FFFFFF;
}

#main-title {
  color: #8BA88E;
}`,
        theory: {
          mainConcept: "CSS (Cascading Style Sheets) — quruq HTML skeletiga rang, shrift, fon va zamonaviy dizayn bag'ishlovchi bezash tilidir.",
          rules: [
            "Eng to'g'ri usul — alohida `style.css` fayl ochib, uni HTML `<head>` ichida `<link rel=\"stylesheet\" href=\"style.css\">` orqali ulashdir.",
            "Selektorlar: Teg nomi (`p { ... }`), Klass (`.card { ... }` — eng ko'p ishlatiladi!), ID (`#header { ... }` — noyob element uchun).",
            "Fon xossalari: `background-color`, `background-image: url(...)`, `background-size: cover`, `background-position: center`."
          ],
          analogy: "HTML — bu suvoqdan chiqqan uy devori bo'lsa, CSS — unga surtilgan bo'yoq, gulqog'oz (oboy) va dekorativ bezaklardir."
        },
        practice: {
          taskTitle: "`style.css` faylini ulash va rangli Hero banner yaratish",
          taskSteps: [
            "`index.html` yonida `style.css` faylini yarating va `<link>` tegi bilan bog'lang.",
            "`.hero`, `.card`, `.btn-primary` klasslarini yaratib, ularga HEX va `linear-gradient` fon ranglarini bering.",
            "Orqa fonga rasm qo'yib, `background-size: cover` xossasini sinab ko'ring."
          ],
          expectedOutput: "Tashqi `style.css` orqali ranglangan va gradient fonga ega veb-sahifa."
        },
        proTips: [
          "Amaliyotda 95% holatda `#id` o'rniga `.class` selektoridan foydalaning — u qayta ishlatish uchun ancha qulay.",
          "Canva va Figma'da o'rgangan HEX rang kodlaringizni (`#2C3E2D`) aynan shu yerda ishlatasiz!"
        ]
      },
      {
        id: 402,
        lessonNumber: 14,
        week: '1-hafta: CSS sintaksisi va matn dizayni',
        title: "14-dars: Tipografika: font-size, font-family, font-weight, line-height, text-align. Saytga Google Fonts shriftlarini ulash",
        module: '4-Modul: CSS3',
        level: "Boshlang'ich",
        duration: '60 daqiqa',
        tools: ['VS Code', 'CSS3 Typography', 'Google Fonts'],
        description: "Google Fonts'dan zamonaviy shriftlarni (Inter, Poppins, Montserrat) saytga ulash va matn o'lchami, qalinligi hamda tekislanishini boshqarish.",
        codeExample: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  letter-spacing: -0.5px;
}`,
        theory: {
          mainConcept: "Standart Times New Roman shriftini Google Fonts'ning zamonaviy shriftiga almashtirish sayt qiyofasini bir zumda professional darajaga olib chiqadi.",
          rules: [
            "`font-family` — shrift turi; `font-size` — harf o'lchami (px yoki rem); `font-weight` — qalinlik (400 normal, 600 semibold, 700 bold).",
            "`line-height` — qatorlar orasidagi masofa (1.5 yoki 1.6 eng qulay); `text-align` — matnni chapga, o'rtaga (`center`) yoki o'ngga tekislash.",
            "`text-decoration: none` — `<a>` havolalarining tagidagi ko'k chiziqni olib tashlaydi."
          ],
          analogy: "Google Fonts — bu bepul kiyimlar garderobi: saytingiz mavzusiga qarab sport uslubidagi yoki klassik kostyumdagi shriftni kiydirasiz."
        },
        practice: {
          taskTitle: "Google Fonts ulash va maqola sahifasini tipografik bezash",
          taskSteps: [
            "fonts.google.com saytidan 'Plus Jakarta Sans' yoki 'Poppins' shriftining 400, 600, 700 qalinliklarini tanlab, `<link>` kodini HTML'ga joylang.",
            "Sarlavhalar, paragraflar va menyu havolalari uchun aniq CSS tipografika qoidalarini yozing.",
            "Havolalarning tag chizig'ini `text-decoration: none` bilan olib tashlang."
          ],
          expectedOutput: "Google Fonts ulangan va mukammal tipografik ierarxiyaga ega veb-sahifa."
        },
        proTips: [
          "Shrift nomidan keyin doimo zaxira oilasini yozing: `font-family: 'Poppins', sans-serif;`.",
          "`text-transform: uppercase;` xossasi yordamida kichik badge va tugma yozuvlarini avtomatik bosh harflarga o'tkazish mumkin."
        ]
      },
      {
        id: 403,
        lessonNumber: 15,
        week: '1-hafta: CSS sintaksisi va matn dizayni',
        title: "15-dars: Box Model yuragi: content, padding (ichki masofa), border (chegara), margin (tashqi masofa) va box-sizing: border-box",
        module: '4-Modul: CSS3',
        level: "Boshlang'ich",
        duration: '65 daqiqa',
        tools: ['VS Code', 'CSS Box Model', 'Chrome DevTools Box Inspector'],
        description: "CSS'ning eng muhim poydevori — Box Model: width, height, padding, border, border-radius, margin va universal `box-sizing: border-box` qoidasi.",
        codeExample: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.course-card {
  width: 340px;
  padding: 24px;
  margin: 16px;
  border: 1px solid #EBE7DF;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
}`,
        theory: {
          mainConcept: "CSS'da har bir HTML element to'rtburchak quti (Box) hisoblanadi. Box Model shu qutining ichki nafasi (padding), devori (border) va qo'shni qutilardan uzoqligi (margin)ni boshqaradi.",
          rules: [
            "`padding` — quti chegarasi bilan ichidagi matn orasidagi ICHKI masofa.",
            "`border` — qutining atrofidagi chegara chizig'i (`border-radius` esa burchaklarini yumaloqlaydi).",
            "`margin` — quti bilan tashqaridagi boshqa elementlar orasidagi TASHQI masofa.",
            "`box-sizing: border-box` — padding va border berilganda quti kengligi shishib ketmasligini ta'minlaydi!"
          ],
          analogy: "Box Model devorga osilgan rasm ramkasiga o'xshaydi: Rasmning o'zi — `content`, rasm va ramka orasidagi oq karton — `padding`, yog'och ramka — `border`, ikki rasm orasidagi devor masofasi esa — `margin`!"
        },
        practice: {
          taskTitle: "Box Model asosida zamonaviy Kurs Kartochkasi va Tugmalar yasash",
          taskSteps: [
            "CSS faylning eng boshiga universal reset (`* { margin: 0; padding: 0; box-sizing: border-box; }`) yozing.",
            "`.card` klassiga `padding: 24px`, `border-radius: 20px`, `border` va yumshoq `box-shadow` bering.",
            "Ichidagi tugmaga `padding: 12px 24px` va `margin-top: 16px` berib, Chrome DevTools (F12) da Box Model sxemasini tekshiring."
          ],
          expectedOutput: "To'g'ri padding, margin va yumaloq burchaklarga ega zamonaviy UI kartochkalar."
        },
        proTips: [
          "Blokni ekranning qoq o'rtasiga keltirish uchun unga `max-width: 1200px; margin: 0 auto;` xossasini bering!",
          "`padding: 12px 24px;` degani: tepa-pastdan 12px, chap-o'ngdan 24px masofa deganidir."
        ]
      },
      {
        id: 404,
        lessonNumber: 16,
        week: '2-hafta: Bloklar joylashuvi va Flexbox texnologiyasi',
        title: "16-dars: Elementlar ko'rinishi: display: block, inline, inline-block, none",
        module: '4-Modul: CSS3',
        level: "O'rta",
        duration: '60 daqiqa',
        tools: ['VS Code', 'CSS Display Property'],
        description: "Elementlarning ekrandagi xulq-atvorini `display` xossasi orqali boshqarish: `block`, `inline`, `inline-block` va `none`.",
        codeExample: `.nav-link {
  display: inline-block;
  padding: 10px 18px;
  background-color: #2C3E2D;
  color: white;
  border-radius: 10px;
}

.hidden-banner {
  display: none;
}`,
        theory: {
          mainConcept: "`display` xossasi har qanday elementning tabiatini o'zgartira oladi: qatorli `<a>` havolasini haqiqiy tugmaga aylantiradi yoki elementni ekrandan yashiradi.",
          rules: [
            "`display: block` — element butun qatorni egallaydi, unga width/height/padding to'liq ishlaydi.",
            "`display: inline` — element matn qatorida turadi, lekin unga width, height va vertikal margin ishlamaydi.",
            "`display: inline-block` — elementlar yonma-yon turadi VA ularga width, height, padding to'liq ishlaydi (tugmalar va badge'lar uchun!).",
            "`display: none` — elementni sahifadan butunlay yashiradi."
          ],
          analogy: "`inline-block` — bu safda yonma-yon turgan, lekin har birining o'z shaxsiy o'lchami va masofasi bor askarlarga o'xshaydi."
        },
        practice: {
          taskTitle: "`inline-block` yordamida tugmalar guruhi va kategoriya teglarini terish",
          taskSteps: [
            "`<a>` teglaridan iborat 5 ta kategoriya filtrini yarating.",
            "Ularga `display: inline-block`, `padding: 10px 20px`, `margin-right: 8px` va `border-radius: 50px` bering.",
            "Maxsus aksiya blokini `display: none` bilan yashirib va qayta yoqib ko'ring."
          ],
          expectedOutput: "Chiroyli tugma shakliga keltirilgan havolalar va teglar paneli."
        },
        proTips: [
          "`<a>` tegi sukut bo'yicha `inline` bo'lgani uchun unga `display: inline-block` (yoki `flex`) bermasangiz, tepa-pastki padding boshqa yozuvlar ustiga chiqib ketadi.",
          "`visibility: hidden` elementni ko'rinmas qiladi, lekin joyi bo'sh qoladi; `display: none` esa joyini ham bo'shatadi."
        ]
      },
      {
        id: 405,
        lessonNumber: 17,
        week: '2-hafta: Bloklar joylashuvi va Flexbox texnologiyasi',
        title: "17-dars: Flexbox asoslari: display: flex, asosiy o'qlar (justify-content, align-items, flex-direction)",
        module: '4-Modul: CSS3',
        level: "O'rta",
        duration: '70 daqiqa',
        tools: ['VS Code', 'CSS Flexbox', 'Flexbox Froggy'],
        description: "Zamonaviy veb-sahifa maketini terishning eng asosiy quroli — Flexbox: `display: flex`, `justify-content`, `align-items` va `flex-direction`.",
        codeExample: `.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 60px;
}

.center-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}`,
        theory: {
          mainConcept: "Flexbox (Flexible Box) — ota konteynerga `display: flex` berish orqali uning ichidagi barcha bolalarni 1 qator kod bilan yonma-yon qo'yish va tekislash texnologiyasidir (Figma'dagi Auto Layout'ning aynan o'zi!).",
          rules: [
            "`justify-content` — asosiy gorizontal o'q bo'yicha joylashtirish: `flex-start`, `center` (o'rtada), `space-between` (ikki chetga va teng oraliqda), `space-around`.",
            "`align-items` — kesishuvchi vertikal o'q bo'yicha tekislash: `center` (vertikal qoq o'rtada), `stretch`, `flex-start`.",
            "`flex-direction` — yo'nalish: `row` (gorizontal qator — sukut bo'yicha) yoki `column` (vertikal ustun)."
          ],
          analogy: "Flexbox — bu magnitli relsga o'xshaydi: qutilarni relsga qo'yib, bitta buyruq bilan ularni o'rtaga to'playsiz yoki ikki chekkaga teng tarqatasiz."
        },
        practice: {
          taskTitle: "Flexbox yordamida Header va 2 ustunli Hero Section'ni yonma-yon terish",
          taskSteps: [
            "Header ichidagi Logotip va Menyu ro'yxatini `display: flex; justify-content: space-between; align-items: center;` yordamida ikki chetga tekislang.",
            "Hero bo'limida chap tomonga matn bloki, o'ng tomonga rasm blokini yonma-yon joylashtiring.",
            "Statistika blokidagi 4 ta raqamni `justify-content: space-around` bilan teng masofada taqsimlang."
          ],
          expectedOutput: "Flexbox orqali ideal tekislangan Header va Hero bo'limi."
        },
        proTips: [
          "Eslab qoling: `display: flex` har doim elementlarning o'ziga emas, balki ularni o'rab turgan OTA konteynerga beriladi!",
          "`flex-direction: column` bo'lganda `justify-content` va `align-items` o'z vazifalarini o'rin almashadi."
        ]
      },
      {
        id: 406,
        lessonNumber: 18,
        week: '2-hafta: Bloklar joylashuvi va Flexbox texnologiyasi',
        title: "18-dars: Kengaytirilgan Flexbox: flex-wrap, gap, elementlar o'rnini moslash. Sayt menyusi (Navbar) va xizmatlar kartochkalarini Flexbox'da terish",
        module: '4-Modul: CSS3',
        level: "O'rta",
        duration: '70 daqiqa',
        tools: ['VS Code', 'CSS Flexbox Wrap & Gap'],
        description: "Ko'p qatorli Flexbox (`flex-wrap: wrap`), elementlar orasidagi `gap` masofasi, `flex: 1` proporsiyasi hamda 3 va 4 ustunli kartochkalar setkasini qurish.",
        codeExample: `.cards-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.card-item {
  flex: 1 1 300px;
  padding: 24px;
  border-radius: 16px;
  background: #ffffff;
}`,
        theory: {
          mainConcept: "`gap` va `flex-wrap: wrap` juftligi — kartochkalar ekranga sig'may qolganda ularni avtomatik ravishda keyingi qatorga chiroyli tushiruvchi zamonaviy usuldir.",
          rules: [
            "`gap: 24px` — Flexbox ichidagi elementlar orasiga (ham yonma-yon, ham tepa-past) aniq masofa beradi (margin hisoblashga hojat qolmaydi!).",
            "`flex-wrap: wrap` — elementlar bitta qatorga sig'masa, qisilib qolmasdan yangi qatorga o'tishiga ruxsat beradi.",
            "`flex: 1` — bo'sh joyni barcha bolalar o'rtasida teng taqsimlaydi."
          ],
          analogy: "`flex-wrap: wrap` — bu matn yozayotganda qator oxiriga yetgach, so'zning avtomatik ravishda yangi qatorga tushishiga o'xshaydi."
        },
        practice: {
          taskTitle: "To'liq Navbar va 6 ta xizmat kartochkasidan iborat Flexbox katalog",
          taskSteps: [
            "Logotip, 4 ta menyu bandi va 'Kirish' tugmasidan iborat zamonaviy Navbar'ni `display: flex` va `gap` yordamida tering.",
            "6 ta kurs kartochkasini `.cards-grid` ichiga joylab, `display: flex; flex-wrap: wrap; gap: 24px;` bering.",
            "Har bir kartochka ichini ham `display: flex; flex-direction: column; justify-content: space-between;` qilib tugmalarini pastki chiziqqa tekislang."
          ],
          expectedOutput: "Professional Navbar va 2 qatorga tekis tushgan 6 ta xizmat kartochkasi."
        },
        proTips: [
          "Kartochka ichiga `flex-direction: column; justify-content: space-between;` bersangiz, matn uzun-qisqa bo'lishidan qat'i nazar barcha kartochkalarning pastki tugmasi bitta chiziqda tekis turadi!",
          "`gap` xossasi Figma'dagi Auto Layout 'Gap' bilan 100% bir xil ishlaydi."
        ]
      },
      {
        id: 407,
        lessonNumber: 19,
        week: '3-hafta: Pozitsiyalash, effektlar va animatsiya',
        title: "19-dars: Elementlarni joylashtirish: position: static, relative, absolute, fixed, sticky va z-index",
        module: '4-Modul: CSS3',
        level: "O'rta",
        duration: '65 daqiqa',
        tools: ['VS Code', 'CSS Positioning'],
        description: "Qotib turuvchi menyu (`sticky`/`fixed`), kartochka burchagidagi yorliq (`relative` + `absolute`) va qatlamlar ustunligi (`z-index`).",
        codeExample: `.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.course-card {
  position: relative;
}

.discount-badge {
  position: absolute;
  top: 16px;
  right: 16px;
}`,
        theory: {
          mainConcept: "CSS `position` xossasi elementni oddiy oqimdan chiqarib, kartochkaning burchagiga yopishtirish (`absolute`) yoki sahifa aylanganda ekran tepasida qotirib qo'yish (`sticky`/`fixed`) imkonini beradi.",
          rules: [
            "`position: relative` — ota konteynerga beriladi (koordinata markaziga aylanadi).",
            "`position: absolute` — o'zining `relative` otasiga nisbatan `top`, `right`, `bottom`, `left` bo'yicha aniq burchakka joylashadi.",
            "`position: sticky; top: 0;` — sahifa pastga aylantirilganda menyuni ekranning tepasiga yopishtirib qo'yadi.",
            "`z-index` — qatlamlar ustma-ust tushganda qaysi biri ustida turishini belgilaydi (katta son ustida turadi)."
          ],
          analogy: "`relative` — bu e'lonlar taxtasi, `absolute` esa shu taxtaning istalgan burchagiga knopka bilan qadab qo'yilgan stikerdir."
        },
        practice: {
          taskTitle: "Sticky Navbar, kartochka ustidagi 'TOP' yorlig'i va suzib yuruvchi Telegram tugmasi",
          taskSteps: [
            "Sayt menyusiga `position: sticky; top: 0; z-index: 50;` bering.",
            "Kurs kartochkasiga `position: relative`, ichidagi 'Yangi' yorlig'iga esa `position: absolute; top: 12px; right: 12px;` bering.",
            "Ekranning o'ng pastki burchagida doim qimirlamay turadigan (`position: fixed; bottom: 24px; right: 24px;`) aloqa tugmasini yarating."
          ],
          expectedOutput: "Sticky menyu, absolute badge va fixed aloqa tugmasiga ega sahifa."
        },
        proTips: [
          "Ota elementga `position: relative` berishni unutsangiz, `absolute` element kartochkadan chiqib ketib, butun ekranning burchagiga borib yopishib qoladi!",
          "`backdrop-filter: blur(10px)` bilan shaffof Sticky Navbar qilsangiz, Apple saytidek chiroyli xira oyna effekti chiqadi."
        ]
      },
      {
        id: 408,
        lessonNumber: 20,
        week: '3-hafta: Pozitsiyalash, effektlar va animatsiya',
        title: "20-dars: Soxta sinflar (Pseudo-classes): :hover, :active, :focus, :nth-child. Tugmalarga chiroyli soya va hover effektlari berish",
        module: '4-Modul: CSS3',
        level: "O'rta",
        duration: '60 daqiqa',
        tools: ['VS Code', 'CSS Pseudo-classes'],
        description: "Foydalanuvchi harakatlariga javob qaytaruvchi `:hover`, `:active`, `:focus` va jadval qatorlarini avtomatik ranglovchi `:nth-child` soxta sinflari.",
        codeExample: `.btn-primary {
  background-color: #2C3E2D;
  color: white;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #1E2E20;
  box-shadow: 0 8px 20px rgba(44, 62, 45, 0.3);
}

.input-field:focus {
  outline: none;
  border-color: #8BA88E;
}`,
        theory: {
          mainConcept: "Pseudo-classes (`:hover`, `:focus`, `:active`) — saytni jonli va sezgir qiladi: foydalanuvchi tugma ustiga sichqonchani olib borganda tugma rangini o'zgartirib, 'meni bosish mumkin' degan ishora beradi.",
          rules: [
            "`:hover` — sichqoncha ko'rsatkichi element ustiga kelgandagi holat.",
            "`:active` — tugma bosilib turgan lahzadagi holat.",
            "`:focus` — foydalanuvchi `<input>` maydonining ichiga bosib yozayotgan paytdagi holat.",
            "`:nth-child(even)` — ro'yxat yoki jadvaldagi har bir juft qatorni avtomatik tanlaydi (Zebra-jadval uchun)."
          ],
          analogy: "`:hover` — bu do'konga yaqinlashganingizda avtomatik eshikning chirog'i yonib, sizni kutib olishiga o'xshaydi."
        },
        practice: {
          taskTitle: "Interaktiv tugmalar, Hover-kartochkalar va Focus-inputlar to'plami",
          taskSteps: [
            "Tugma ustiga sichqoncha borganda (`:hover`) rangi o'zgarishi va soyasi kattalashishini yozing.",
            "Forma inputlariga bosilganda (`:focus`) chegarasi yashil rangda porlaydigan qiling.",
            "Jadvalning juft qatorlarini `tr:nth-child(even)` orqali och rangga bo'yang."
          ],
          expectedOutput: "Hover, active va focus holatlariga ega interaktiv UI elementlar."
        },
        proTips: [
          "Barcha bosiladigan tugmalarga `cursor: pointer;` xossasini bering — sichqoncha qo'lcha shakliga kiradi.",
          "2-modulda Figma Variants'da chizgan Default, Hover, Active holatlaringiz aynan shu CSS pseudo-class'lar orqali kodlanadi!"
        ]
      },
      {
        id: 409,
        lessonNumber: 21,
        week: '3-hafta: Pozitsiyalash, effektlar va animatsiya',
        title: "21-dars: CSS animatsiyalari: transition (silliq o'tishlar), transform (aylantirish, kattalashtirish) va @keyframes orqali harakatlar yaratish",
        module: '4-Modul: CSS3',
        level: "O'rta",
        duration: '65 daqiqa',
        tools: ['VS Code', 'CSS Transitions & Keyframes'],
        description: "`transition` bilan silliq o'zgarishlar, `transform: scale / translateY / rotate` hamda `@keyframes` orqali uzluksiz animatsiyalar.",
        codeExample: `.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-8px) scale(1.02);
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

.hero-img {
  animation: float 3s ease-in-out infinite;
}`,
        theory: {
          mainConcept: "`transition` keskin o'zgarishlarni silliq qiladi, `transform` elementni joyidan siljitadi yoki kattalashtiradi, `@keyframes` esa mustaqil ravishda to'xtovsiz harakatlanuvchi animatsiya ssenariysini yaratadi.",
          rules: [
            "`transition: all 0.3s ease;` — `:hover` ga emas, balki elementning ASOSIY klassiga yoziladi (shunda sichqoncha ketganda ham silliq qaytadi!).",
            "`transform: translateY(-8px)` — kartochkani 8px yuqoriga suzdiradi; `scale(1.05)` — 5% kattalashtiradi; `rotate(15deg)` — aylantiradi.",
            "`@keyframes` — 0% dan 100% gacha qadamma-qadam harakat qoidasini belgilaydi."
          ],
          analogy: "`transition`siz hover — chiroqni shartta yoqib-o'chirish bo'lsa, `transition`li hover — chiroq yorug'ligini ravon va yoqimli ko'tarishdir."
        },
        practice: {
          taskTitle: "Silliq ko'tariluvchi kartochkalar va suzib turuvchi 3D Hero illyustratsiya",
          taskSteps: [
            "Barcha tugma va kurs kartochkalariga `transition: all 0.3s ease;` va `:hover` da `transform: translateY(-6px)` bering.",
            "Rasm bloklari ichidagi suratlarga hover bo'lganda `transform: scale(1.08)` (rasm quti ichidan chiqmasligi uchun ota divga `overflow: hidden`) bering.",
            "`@keyframes` yordamida Hero rasmi sekin tepa-pastga suzib turadigan (`infinite`) animatsiya yozing."
          ],
          expectedOutput: "Silliq hover-animatsiyalar va jonli `@keyframes` effektlariga ega veb-sahifa."
        },
        proTips: [
          "Rasm zoom bo'lganda kartochka chegarasidan chiqib ketmasligi uchun rasmni o'rab turgan qutiga `overflow: hidden; border-radius: 16px;` bering!",
          "Animatsiya vaqtini 0.2s–0.4s oralig'ida saqlang — 1 soniyadan uzun hover foydalanuvchiga sekin tuyuladi."
        ]
      },
      {
        id: 410,
        lessonNumber: 22,
        week: '4-hafta: Mobil moslashuvchanlik (Responsive) va bitiruv loyihasi',
        title: "22-dars: Responsive Web Design (RWD) nima? O'lchov birliklari: px, %, rem, em, vh, vw",
        module: '4-Modul: CSS3',
        level: "O'rta",
        duration: '65 daqiqa',
        tools: ['VS Code', 'CSS Relative Units'],
        description: "Nima uchun qattiq `px` o'lchamlari mobil ekranlarda muammo chiqaradi? Moslashuvchan `%`, `rem`, `em`, `vw`, `vh` hamda `max-width` va `min-height`.",
        codeExample: `.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-section {
  min-height: 100vh;
}

.responsive-img {
  max-width: 100%;
  height: auto;
}`,
        theory: {
          mainConcept: "Internet foydalanuvchilarining 75% dan ortig'i saytlarga smartfondan kiradi. Nisbiy o'lchov birliklari (`%`, `rem`, `vh`, `max-width`) saytning har qanday ekranda egiluvchan bo'lishini ta'minlaydi.",
          rules: [
            "`%` — ota konteynerga nisbatan foiz (masalan: `width: 50%` — yarim ekran).",
            "`rem` — asosiy `<html>` shrift o'lchamiga (1rem = 16px) nisbatan; `2rem` = 32px.",
            "`vh` (Viewport Height) va `vw` (Viewport Width) — ekran balandligi va kengligining foizi (`100vh` = to'liq 1 ekran balandligi).",
            "`width: 1200px` o'rniga doim `width: 100%; max-width: 1200px;` ishlating — shunda kichik ekranda gorizontal scroll chiqib qolmaydi!"
          ],
          analogy: "`width: 1200px` — bu temir truba (kichik eshikka sig'maydi), `max-width: 1200px` esa rezina shlangdir (keng joyda 1200px bo'ladi, tor joyda esa qisqarib moslashadi)."
        },
        practice: {
          taskTitle: "Qattiq `px` da yozilgan maketni moslashuvchan (`max-width`, `%`, `rem`, `vh`) birliklarga o'tkazish",
          taskSteps: [
            "Asosiy `.container` blokini `width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 20px;` qilib sozlang.",
            "Barcha rasmlarga `max-width: 100%; height: auto;` global qoidasini bering.",
            "Shrift o'lchamlarini `rem` ga, Hero balandligini `min-height: 90vh` ga o'tkazing."
          ],
          expectedOutput: "Brauzer oynasini kichraytirganda gorizontal scroll chiqmaydigan egiluvchan maket."
        },
        proTips: [
          "`img { max-width: 100%; display: block; }` — har bir Frontend dasturchi CSS faylning boshida yozadigan oltin qoidadir!",
          "Balandlik uchun `height: 600px` o'rniga `min-height: 600px` ishlatsangiz, ichidagi matn ko'payganda yozuv qutidan toshib chiqib ketmaydi."
        ]
      },
      {
        id: 411,
        lessonNumber: 23,
        week: '4-hafta: Mobil moslashuvchanlik (Responsive) va bitiruv loyihasi',
        title: "23-dars: Media so'rovlar (@media queries): Saytni smartfon, planshet va noutbuk ekranlariga to'liq moslashtirish",
        module: '4-Modul: CSS3',
        level: "O'rta",
        duration: '70 daqiqa',
        tools: ['VS Code', 'CSS @media Queries', 'Chrome Device Toolbar'],
        description: "`@media (max-width: 992px)` va `@media (max-width: 768px)` breakpoint'lari yordamida Desktop, Planshet va Mobil ekranlar uchun moslashuvchan dizayn.",
        codeExample: `/* Desktopda yonma-yon */
.hero-wrapper {
  display: flex;
  align-items: center;
  gap: 48px;
}

/* Planshet va Telefonda (768px va undan kichik) ustma-ust */
@media (max-width: 768px) {
  .hero-wrapper {
    flex-direction: column;
    text-align: center;
  }

  .hero-title {
    font-size: 28px;
  }
}`,
        theory: {
          mainConcept: "`@media` so'rovlari ekran kengligini tekshiradi: ekran planshet (`992px`) yoki telefon (`768px`, `480px`) o'lchamiga kichrayganda, yonma-yon turgan bloklarni ustma-ust (`flex-direction: column`) qilib qayta teradi.",
          rules: [
            "Asosiy Breakpoint'lar: `1024px` (Kichik noutbuk), `768px` (Planshet), `480px` (Smartfon).",
            "Telefonda 3 yoki 4 ustunli kartochkalar 1 ustunga (`width: 100%`) o'tkaziladi.",
            "Katta sarlavhalar (masalan, Desktopda `48px`) telefonda ekranga chiroyli sig'ishi uchun `28px–32px` ga kichraytiriladi."
          ],
          analogy: "`@media` so'rovi — bu transformer robotga o'xshaydi: keng trassada katta yuk mashinasi bo'lib yuradi, tor ko'chaga kirganda esa ixcham shaklga kiradi."
        },
        practice: {
          taskTitle: "Landing Page'ni iPhone, iPad va Desktop ekranlariga 100% moslashtirish",
          taskSteps: [
            "Chrome brauzerida `F12` va `Ctrl + Shift + M` (Toggle Device Toolbar) tugmasini bosib, iPhone 14 va iPad ko'rinishini yoqing.",
            "`@media (max-width: 992px)` va `@media (max-width: 768px)` bloklarini yozib, Hero va Xizmatlar qismini `flex-direction: column` ga o'tkazing.",
            "Mobil ekranda padding va shrift o'lchamlarini qulay holatga keltiring."
          ],
          expectedOutput: "320px dan 1920px gacha barcha ekranlarda ideal ko'rinadigan Responsive veb-sahifa."
        },
        proTips: [
          "`@media` qoidalarini har doim CSS faylning eng pastki qismiga yozing — shunda ular yuqoridagi asosiy Desktop qoidalarini ustidan yozib (override qilib) ishlaydi!",
          "Chrome DevTools'dagi Responsive slayderni chapga-o'ngga tortib, barcha o'lchamlarda dizayn buzilmayotganini tekshiring."
        ]
      },
      {
        id: 412,
        lessonNumber: 24,
        week: '4-hafta: Mobil moslashuvchanlik (Responsive) va bitiruv loyihasi',
        title: "24-dars (4-oy yakuniy loyihasi): 2-oyda Figma'da chizilgan dizaynni HTML5 va CSS3 yordamida to'liq noldan kodga o'tkazish (Figma-to-Code: to'liq moslashuvchan Landing Page)",
        module: '4-Modul: CSS3',
        level: 'Amaliy Loyiha',
        duration: '90 daqiqa',
        tools: ['Figma', 'VS Code', 'HTML5', 'CSS3 Flexbox & Media Queries'],
        description: "Bitiruv loyihasi (Figma-to-Code): 2-oyda Figma'da chizilgan Landing Page dizaynini semantik HTML5 va moslashuvchan CSS3 yordamida to'liq jonli veb-saytga aylantirish.",
        theory: {
          mainConcept: "Figma-to-Code — zamonaviy veb-dizayner va Frontend dasturchining eng yuqori mahorat cho'qqisidir: siz g'oyani Canva va Figma'da chizishdan boshlab, uni haqiqiy brauzerda ishlaydigan responsive veb-saytga aylantirdingiz!",
          rules: [
            "1-qadam: Figma maketidan barcha rasm va SVG ikonkalarni `assets/` papkasiga eksport qilish.",
            "2-qadam: CSS `:root` o'zgaruvchilarida Figma'dagi Color Styles va Google Fonts shriftlarini e'lon qilish.",
            "3-qadam: Semantik HTML5 karkasni yozib, Flexbox, Hover animatsiyalar va `@media` so'rovlari bilan Desktop hamda Mobil versiyani 100% moslashtirish."
          ],
          analogy: "Siz avval me'mor bo'lib binoning chizmasini (Figma) chizdingiz, endi esa muhandis bo'lib o'sha chizma asosida haqiqiy ko'rkam binoni (HTML5 + CSS3) qurib bitkazdingiz!"
        },
        practice: {
          taskTitle: "Bitiruv Imtihon Loyihasi: Figma-to-Code Responsive Landing Page",
          taskSteps: [
            "2-oyda Figma'da tayyorlagan Landing Page maketingizni oching va VS Code'da yangi loyiha papkasini yarating.",
            "Header, Hero, Xizmatlar, Portfolio/Afzalliklar, Aloqa formasi va Footer qismlarini HTML5 va CSS3 da to'liq kodga o'tkazing.",
            "Tayyor saytning Desktop va Mobil skrinshotlarini yoki loyiha ZIP faylini Uyga vazifalar bo'limiga yuklang va ustozdan 100 ballik yakuniy bahoni oling!"
          ],
          expectedOutput: "Figma maketi asosida 0 dan kodlangan, animatsiyali va mobilga moslashuvchan to'liq Landing Page (Bitiruv loyihasi)."
        },
        proTips: [
          "CSS boshida `:root { --primary: #2C3E2D; --accent: #8BA88E; }` o'zgaruvchilarini ishlatsangiz, kodingiz juda toza va professional bo'ladi.",
          "Tabriklaymiz! Canva, Figma, HTML5 va CSS3 dan iborat 4 oylik kursni muvaffaqiyatli tamomlab, tayyor Portfolio loyihalariga ega bo'ldingiz!"
        ]
      }
    ]
  }
];

// Export DESIGN_CURRICULUM containing all 4 modules so existing imports work seamlessly
export const DESIGN_CURRICULUM: DesignModule[] = DESIGN_AND_FRONTEND_MODULES;
