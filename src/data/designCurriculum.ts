export interface DesignLesson {
  id: number;
  title: string;
  module: string;
  level: 'Boshlang\'ich' | 'O\'rta' | 'Amaliy Loyiha';
  duration: string;
  tools: string[];
  description: string;
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
  title: string;
  description: string;
  badge: string;
  lessons: DesignLesson[];
}

export const DESIGN_CURRICULUM: DesignModule[] = [
  {
    id: 1,
    title: "1-MODUL: VIZUAL DIZAYN ASOSLARI VA CANVA",
    description: "Ranglar nazariyasi, tipografika, kompozitsiya va Canva dasturida professional posterlar yaratish",
    badge: "Asoslar",
    lessons: [
      {
        id: 101,
        title: "Grafik Dizaynga Kirish va Dizayner Fikrlashi",
        module: "1-Modul",
        level: "Boshlang'ich",
        duration: "45 daqiqa",
        tools: ["Canva", "Daftar & Qalam"],
        description: "Grafik dizayn nima va u insonlarga qanday ta'sir qiladi? Dizayn va rasm chizish o'rtasidagi farq.",
        theory: {
          mainConcept: "Grafik dizayn — bu ma'lumotni vizual shaklda (shakllar, ranglar, shriftlar) odamlar ongiga tez va chiroyli yetkazish san'atidir.",
          rules: [
            "Dizayn nafaqat chiroyli, balki birinchi navbatda tushunarli bo'lishi shart.",
            "Har bir dizayn ma'lum bir maqsadga ega (diqqatni tortish, xaridga undash, ogohlantirish).",
            "Oddiylik — mukammallik cho'qqisi (Less is more qoidasi)."
          ],
          analogy: "Dizayn yo'l harakati belgilariga o'xshaydi: agar belgi chalkash bo'lsa, avariya bo'ladi. Dizayn ham aniq va lo'nda bo'lishi kerak."
        },
        practice: {
          taskTitle: "Mening ilk vizual moodboardim",
          taskSteps: [
            "Canva platformasida bepul ro'yxatdan o'ting.",
            "O'zingiz yoqtirgan mavzu (IT, tabiat, sport) bo'yicha 5 ta rasm va 3 ta rang tanlang.",
            "Bitta umumiy kollaj (Moodboard) hosil qiling."
          ],
          expectedOutput: "Canvada 1920x1080 o'lchamdagi qiziqishlaringiz aks etgan 1 ta moodboard."
        },
        proTips: [
          "Boshlanishida hech qachon 3 tadan ko'p shrift ishlatmang.",
          "Dizaynda bo'sh joy (White Space) — elementlar erkin nafas olishi uchun zarur."
        ],
        videoUrl: "https://www.youtube.com/embed/YqQx75OPRa0"
      },
      {
        id: 102,
        title: "Ranglar Nazariyasi va Rang Psixologiyasi",
        module: "1-Modul",
        level: "Boshlang'ich",
        duration: "50 daqiqa",
        tools: ["Coolors.co", "Canva"],
        description: "Rang g'ildiragi (Color Wheel), kontrast, issiq va sovuq ranglar hamda brendingda ranglarning ruhiy kuchi.",
        theory: {
          mainConcept: "Ranglar inson hissiyotiga bevosita ta'sir qiladi: Qizil (hayajon, energiya, ochlik), Ko'k (ishonch, xotirjamlik, texnologiya), Yashil (tabiat, boylik, salomatlik).",
          rules: [
            "60-30-10 qoidasi: 60% asosiy neytral rang, 30% ikkilamchi rang, 10% diqqat tortuvchi urg'u (aktsent) rang.",
            "Monoxrom, analog va komplementar ranglar uyg'unligidan to'g'ri foydalanish.",
            "Matn va fon o'rtasida yuqori kontrast bo'lishi shart (oq fonda och kulrang matn qilmang)."
          ],
          analogy: "Ranglar kiyim tanlashga o'xshaydi: qora kostyum (60%), oq ko'ylak (30%) va qizil galstuk (10%) — ideal muvozanat!"
        },
        practice: {
          taskTitle: "Brend uchun ranglar palitrasi",
          taskSteps: [
            "Coolors.co saytiga kiring va 'Space' tugmasini bosib palitralarni ko'ring.",
            "O'zingiz xohlagan IT maktab yoki qahvaxona uchun 4 ta uyg'un rang tanlang.",
            "HEX kodlarini (masalan, #2C3E2D) nusxalab oling."
          ],
          expectedOutput: "4 ta uyg'un rangdan iborat ranglar palitrasi kartochkasi."
        },
        proTips: [
          "Dizayningiz qorong'uda yoki quyosh tushganda ham aniq o'qilishi kerak.",
          "Ranglar kontrastini tekshirish uchun kontrast tekshiruvchilardan foydalaning."
        ],
        videoUrl: "https://www.youtube.com/embed/_2LLXnUdUIc"
      },
      {
        id: 103,
        title: "Tipografika: Shriftlar San'ati va Ierarxiya",
        module: "1-Modul",
        level: "Boshlang'ich",
        duration: "55 daqiqa",
        tools: ["Google Fonts", "Canva"],
        description: "Serif va Sans-serif shriftlar, sarlavha va matn ierarxiyasi, satrlar orasi masofasi (leading) va harflar orasi (tracking).",
        theory: {
          mainConcept: "Tipografika — bu so'zlarning tashqi ko'rinishi orqali xarakter yaratish. Noto'g'ri tanlangan shrift jiddiy xabarni kulgili qilib qo'yishi mumkin.",
          rules: [
            "Har doim aniq ierarxiya tuzing: Sarlavha (H1) eng katta, kichik sarlavha (H2) o'rtacha, asosiy matn (Body) qulay o'qiladigan hajmda.",
            "Serif shriftlar (masalan, Times New Roman, Playfair) — klassik va kitobiy.",
            "Sans-serif shriftlar (masalan, Inter, Roboto, Montserrat) — zamonaviy va ekranda qulay."
          ],
          analogy: "Shriftlar insonning ovoz ohangiga o'xshaydi: ba'zilari shivirlaydi, ba'zilari jiddiy rasmiy gapiradi, ba'zilari esa baqiradi."
        },
        practice: {
          taskTitle: "Iqtibos (Quote) Posteri Dizayni",
          taskSteps: [
            "Canva-da 1080x1080 o'lchamdagi Instagram kvadrat oching.",
            "Stiv Jobs yoki Al-Xorazmiyning mashhur hikmatli so'zini tanlang.",
            "Sarlavhani katta qilib, muallif nomini kichikroq Sans-serif shriftida yozing."
          ],
          expectedOutput: "Tipografik qoidalarga mos bitta estetik iqtibos posteri."
        },
        proTips: [
          "Bitta dizaynda hech qachon 2 tadan ortiq shrift oilasini aralashtirmang.",
          "Matn qator uzunligi 60-75 belgidan oshmasligi ko'z toliqishining oldini oladi."
        ],
        videoUrl: "https://www.youtube.com/embed/sByzHoiYFX0"
      },
      {
        id: 104,
        title: "Kompozitsiya va Vizual Qoidalar (Rule of Thirds)",
        module: "1-Modul",
        level: "O'rta",
        duration: "60 daqiqa",
        tools: ["Canva", "Unsplash"],
        description: "Uchlik qoidasi, simmetriya va asimmetriya, yo'naltiruvchi chiziqlar va ob'ektlar muvozanati.",
        theory: {
          mainConcept: "Kompozitsiya — bu dizayndagi barcha elementlarni (rasm, matn, tugma, belgi) bir-biri bilan uyg'un joylashtirish tartibidir.",
          rules: [
            "Uchlik qoidasi (Rule of Thirds): ekranni 9 teng katakka bo'lib, asosiy obyektni chiziqlar kesishgan nuqtalarga qo'yish.",
            "Fokus nuqtasi (Focal Point): odam qaraganda birinchi bo'lib nimaga ko'zi tushishi kerak?",
            "Muvozanat (Balance): chap tomon og'ir bo'lib, o'ng tomon bo'sh qolib ketmasligi kerak."
          ],
          analogy: "Kompozitsiya xonani mebel bilan jihozlashga o'xshaydi: hamma mebellarni bitta burchakka tiqib qo'ysangiz xona xunuk ko'rinadi."
        },
        practice: {
          taskTitle: "Reklama Banneri Kompozitsiyasi",
          taskSteps: [
            "Canvada mahsulot (masalan, quloqchin yoki noutbuk) rasmini chap tomonga qo'ying.",
            "O'ng tomonga sarlavha, narx va 'Sotib Olish' tugmasini joylashtiring.",
            "Elementlar orasida teng masofa (Padding) saqlang."
          ],
          expectedOutput: "Muvozanatli va professional mahsulot reklama banneri."
        },
        proTips: [
          "Chekkalardan (Margin) kamida 40-50px masofa qoldiring, matn chetga yopishib qolmasin.",
          "Harakatlanuvchi obyekt oldida bo'sh joy qoldirish tabiiy ko'rinish beradi."
        ],
        videoUrl: "https://www.youtube.com/embed/a5KYlHNKQB8"
      }
    ]
  },
  {
    id: 2,
    title: "2-MODUL: ADOBE PHOTOSHOP VA RASTER GRAFIKA",
    description: "Qatlamlar (Layers), niqoblar (Masking), fonni o'chirish, rang korreksiyasi va kollaj yasash",
    badge: "Professional",
    lessons: [
      {
        id: 201,
        title: "Photoshop Interfeysi va Qatlamlar (Layers) Konsepsiyasi",
        module: "2-Modul",
        level: "Boshlang'ich",
        duration: "55 daqiqa",
        tools: ["Adobe Photoshop", "Photopea.com (Brauzer)"],
        description: "Raster grafika nima? Photoshop muhiti, asboblar paneli va qatlamlar bilan ishlash asoslari.",
        theory: {
          mainConcept: "Raster grafika piksellardan tashkil topadi. Qatlamlar (Layers) esa bir-birining ustiga qo'yilgan shaffof shishalarga o'xshaydi.",
          rules: [
            "Har doim har bir yangi obyekt uchun alohida qatlam oching va unga aniq nom bering.",
            "Ctrl+J (Dublikat olish), Ctrl+T (Transformatsiya - o'lchamni o'zgartirish).",
            "Ko'z belgisi orqali qatlamni yashirish yoki ko'rsatish mumkin."
          ],
          analogy: "Qatlamlar sendvichga o'xshaydi: pastda non (fon), o'rtada go'sht va pishloq (tasvirlar), tepada sous (matn) turadi."
        },
        practice: {
          taskTitle: "Photopea / Photoshop-da ko'p qatlamli kompozitsiya",
          taskSteps: [
            "Photopea.com yoki Photoshop-da 1920x1080 o'lchamli fayl oching.",
            "Fon rangini bo'yang va uning ustiga 3 ta har xil qatlam qo'shing.",
            "Qatlamlarning ketma-ketlik o'rnini almashtirib ko'ring."
          ],
          expectedOutput: "3 ta alohida qatlamdan iborat tartiblangan PSD fayl."
        },
        proTips: [
          "Qatlamlarni papkalarga (Ctrl+G) guruhlash loyihangizni toza saqlaydi.",
          "Asl rasmni buzmaslik uchun doim nusxasi bilan ishlang."
        ],
        videoUrl: "https://www.youtube.com/embed/IyR_uYsRdPs"
      },
      {
        id: 202,
        title: "Fonni Qirqish, Qatlam Niqobi (Layer Mask) va Lasso",
        module: "2-Modul",
        level: "O'rta",
        duration: "65 daqiqa",
        tools: ["Photoshop / Photopea", "Pen Tool", "Quick Selection"],
        description: "Obyektlarni foni bilan ajratish, soch va murakkab detallarni qirqish, buzilmas (non-destructive) tahrirlash.",
        theory: {
          mainConcept: "Layer Mask (Niqob) orqali biz tasvirning istalgan qismini o'chirmasdan yashiramiz: Qora rang yashiradi, Oq rang ko'rsatadi.",
          rules: [
            "Hech qachon o'chirg'ich (Eraser tool) bilan rasmni butunlay o'chirib tashlamang, Layer Mask ishlating!",
            "Pen Tool (Pero) — eng aniq va silliq qirqish asbobi hisoblanadi.",
            "Refine Edge (Select and Mask) orqali odam sochlarini foni bilan ajratish mumkin."
          ],
          analogy: "Layer Mask — bu stikerga o'xshaydi: qora bo'yoq bilan yopilgan qism ko'rinmaydi, lekin kerak bo'lsa uni oq bo'yoq bilan qaytarish mumkin."
        },
        practice: {
          taskTitle: "Odamni boshqa fonga ko'chirish",
          taskSteps: [
            "Biror kishining rasmini oching va Quick Selection yoki Pen Tool yordamida ajrating.",
            "Layer Mask qo'shing va qora cho'tka bilan chetlarini tozalang.",
            "Orqasiga yangi shahar yoki tabiat fonini qo'ying."
          ],
          expectedOutput: "Chekkasi silliq va foni almashtirilgan fotomontaj."
        },
        proTips: [
          "Cho'tka qattiqligini (Hardness) 50-70% qilsangiz, qirqilgan chekkalar tabiiyroq tushadi.",
          "Obyekt chetiga tushgan yorug'likni fon yorug'ligi bilan tenglashtiring."
        ],
        videoUrl: "https://www.youtube.com/embed/yP_a_yR3r5s"
      },
      {
        id: 203,
        title: "Ranglarni Tuzatish (Color Grading & Retush)",
        module: "2-Modul",
        level: "O'rta",
        duration: "60 daqiqa",
        tools: ["Photoshop / Photopea", "Curves", "Hue/Saturation", "Camera Raw"],
        description: "Yorug'lik (Curves, Levels), rang to'yinganligi (Vibrance), portretlarni retush qilish (Spot Healing Brush).",
        theory: {
          mainConcept: "Rang korreksiyasi orqali oddiy zerikarli fotosuratni kinolardagidek chuqur va jozibador ko'rinishga keltirish mumkin.",
          rules: [
            "Adjustment Layers (Tuzatuvchi qatlamlar) orqali rangni o'zgartiring.",
            "Curves (Egri chiziqlar) orqali S-shaklidagi kontrast hosil qilish — klassik usul.",
            "Teridagi dog'larni tozalashda yuzning tabiiy teksturasini yo'qotib qo'ymaslik kerak."
          ],
          analogy: "Rang korreksiyasi ovqatga ziravor qo'shishga o'xshaydi: me'yori yaxshi, lekin ortiqchasi ta'mni buzadi."
        },
        practice: {
          taskTitle: "Kino effektidagi fototahrir",
          taskSteps: [
            "Xira olingan suratni oching.",
            "Adjustment layer ochib Curves yordamida yorug'likni ko'taring.",
            "Hue/Saturation bilan ranglarni jonlantiring va Spot Healing bilan nuqsonlarni tozalang."
          ],
          expectedOutput: "Oldingi va keyingi (Before/After) taqqoslangan professional fotosurat."
        },
        proTips: [
          "Gistogrammaga qarab oq va qora nuqtalar chegarasini aniqlang.",
          "Dizaynga atmosfera berish uchun Color Lookup jadvallaridan foydalaning."
        ],
        videoUrl: "https://www.youtube.com/embed/kZ6qf7i7D1M"
      }
    ]
  },
  {
    id: 3,
    title: "3-MODUL: VEKTOR GRAFIKA, FIGMA VA BRENDING",
    description: "Vektor grafika afzalliklari, Figma dasturida UI elementlar, logotip yasash va portfolio yaratish",
    badge: "Kelajak Kasbi",
    lessons: [
      {
        id: 301,
        title: "Vektor Grafika va Figma Asoslari",
        module: "3-Modul",
        level: "Boshlang'ich",
        duration: "50 daqiqa",
        tools: ["Figma.com", "Browser"],
        description: "Raster va Vektor farqi (Cheksiz kattalashtirish imkoniyati). Figma interfeysi, Frame, Shapes va Pen Tool.",
        theory: {
          mainConcept: "Vektor grafika matematik formulalarga (nuqtalar va chiziqlar) asoslanadi, shuning uchun uni qanchalik kattalashtirmang, sifati aslo buzilmaydi.",
          rules: [
            "Figma — bu brauzerda ishlovchi zamonaviy dizayn vositasi bo'lib, jamoaviy real vaqtda ishlash imkonini beradi.",
            "Frame (Freym) — dizayn joylashadigan asosiy sahifa (masalan, iPhone 14 yoki Desktop).",
            "Auto Layout — elementlarni avtomatik tartibga solishning eng qudratli vositasi."
          ],
          analogy: "Raster rasm mozaikaga o'xshaydi (yaqinlashsa toshlari ko'rinadi), vektor esa rezinkaga o'xshaydi (qancha cho'zsangiz ham shakli silliq qoladi)."
        },
        practice: {
          taskTitle: "Figma-da zamonaviy profil kartochkasi",
          taskSteps: [
            "Figma.com saytiga kiring va yangi fayl oching.",
            "360x200 o'lchamli Frame yasab, unga yumaloq burchaklar (Corner radius: 16) bering.",
            "Avatar rasmi, ismingiz va 'Bog'lanish' tugmasini joylashtiring."
          ],
          expectedOutput: "Figma freymida yasalgan silliq UI komponenti."
        },
        proTips: [
          "Burchaklarni yumaloqlatishda (Border radius) 8px yoki 16px kabi 8-karrali o'lchamlardan foydalaning.",
          "Figma plaginlaridan (Unsplash, Iconsax) foydalanish ishni 3 barobar tezlashtiradi."
        ],
        videoUrl: "https://www.youtube.com/embed/jwCmIBJ8Jtc"
      },
      {
        id: 302,
        title: "Logotip Dizayni va Brend Identikasi (Branding)",
        module: "3-Modul",
        level: "Amaliy Loyiha",
        duration: "70 daqiqa",
        tools: ["Figma", "Pen Tool", "Daftar"],
        description: "Logotip turlari (Monogramma, Emblema, Belgili), oddiylik va esda qolarlilik qoidalari, brendbook asoslari.",
        theory: {
          mainConcept: "Logotip kompaniyaning yuzidir. Yaxshi logotip 3 soniyada esda qolishi, kichik vizitkada ham, ulkan binoda ham aniq ko'rinishi lozim.",
          rules: [
            "KISS qoidasi: Keep It Simple, Stupid (Iloji boricha sodda saqlang). Masalan: Apple, Nike, McDonald's.",
            "Logotip qora-oq rangda ham o'z kuchini yo'qotmasligi shart.",
            "Ko'p detallar, mayda soya va gradientlardan tiyiling."
          ],
          analogy: "Logotip bayroqqa o'xshaydi: uzoqdan ham qaysi davlatniki ekanligi darhol tanib olinishi kerak."
        },
        practice: {
          taskTitle: "O'z shaxsiy yoki IT loyiha logotipingiz",
          taskSteps: [
            "Qog'ozda 10 xil oddiy eskiz chizing.",
            "Eng ma'qul bitta variantni Figmaga Pen Tool orqali vektor shaklida chizing.",
            "Oq fonda, qora fonda va vizitkada qanday ko'rinishini tekshiring."
          ],
          expectedOutput: "Vektor formatdagi o'ziga xos minimalistik logotip."
        },
        proTips: [
          "Avval qog'ozda qalam bilan o'ylab oling, keyin kompyuterga o'ting.",
          "Logotipni juda kichik (16x16 piksel favicon) qilib ko'ring — agar tushunilsa, demak u zo'r!"
        ],
        videoUrl: "https://www.youtube.com/embed/u_K_7h8E_9k"
      },
      {
        id: 303,
        title: "Dizayner Portfoliosi va Loyihalarni Taqdimot Qilish",
        module: "3-Modul",
        level: "Amaliy Loyiha",
        duration: "60 daqiqa",
        tools: ["Behance", "Figma Mockup", "Dribbble"],
        description: "Dizaynlarni Behance va Dribbble uchun chiroyli Mockup-larga joylash, mijozlar va ish beruvchilarni jalb qilish sirlari.",
        theory: {
          mainConcept: "Dizaynerning eng katta quroli — bu uning portfoliosi. Hech kim diplomingizni so'ramaydi, ko'rsatgan ishlaringiz sifatiga qarab baholashadi.",
          rules: [
            "Faqatgina eng zo'r 4-6 ta ishingizni portfolioga qo'ying (Sifat miqdordan ustun).",
            "Mockup-lardan foydalaning (telefon, futbolka, afisha ustiga dizaynni joylashtirish).",
            "Har bir loyihada muammo nima bo'lgani va siz uni qanday yechganingizni yozing (Case Study)."
          ],
          analogy: "Portfolio do'kon vitrinasiga o'xshaydi: eng jozibali mahsulotlar birinchi qatorda turishi kerak."
        },
        practice: {
          taskTitle: "Birinchi Behance Keysi (Case Study)",
          taskSteps: [
            "Oldingi darslarda tayyorlagan poster, iqtibos va logotipni yig'ing.",
            "Figmada 'Free Mockup' orqali ularni telefon va kompyuter ekraniga joylang.",
            "1920px uzunlikdagi Behance taqdimot lentasini hosil qiling."
          ],
          expectedOutput: "O'quvchining ilk to'liq dizayn taqdimoti (Portfolio Case)."
        },
        proTips: [
          "Muntazam ravishda Behance va Dribbble-dagi eng mashhur ishlarni tahlil qilib, 'vizual did' (taste)ni rivojlantiring.",
          "Tanqidni to'g'ri qabul qiling — har bir xato dizaynni yanada kuchaytiradi."
        ],
        videoUrl: "https://www.youtube.com/embed/xLw92NlJ_u0"
      }
    ]
  }
];
