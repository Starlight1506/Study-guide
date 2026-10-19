export interface GradeMethodology {
  ageGroup: '1-4 sinf (Kichiklar)' | '5-9 sinf (Kattalar)';
  badge: string;
  topic: string;
  concept: string;
  analogyOrTechDetails: string;
  practicalSteps: string[];
}

export interface Lesson {
  id: number;
  title: string;
  commonTopic: string;
  videoUrl?: string;
  kichik: GradeMethodology;
  katta: GradeMethodology;
  game: {
    type: 'typing' | 'mouse' | 'sorting' | 'quiz' | 'grid';
    title: string;
    description: string;
    data: any;
  };
}

export interface Week {
  number: number;
  title: string;
  lessons: Lesson[];
}

export interface Month {
  number: number;
  title: string;
  weeks: Week[];
}

export const UNIFIED_CURRICULUM: Month[] = [
  // -------------------------------------------------------------
  // 1-OY: KOMPYUTER VA IT ASOSLARI (12 ta dars)
  // -------------------------------------------------------------
  {
    number: 1,
    title: "KOMPYUTER VA IT ASOSLARI",
    weeks: [
      {
        number: 1,
        title: "Kompyuter bilan tanishuv va arxitektura",
        lessons: [
          {
            id: 1,
            title: "Kompyuter va uning arxitekturasi",
            commonTopic: "Kompyuterning ishlash prinsipi, apparat ta'minoti (Hardware) va uning asosiy qismlari.",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "Kompyuter - bizning eng aqlli do'stimiz. Monitor (uning ko'zi), sichqoncha (qo'li) va klaviatura (muloqot tili) bilan tanishuv.",
              concept: "Kompyuter - bu ma'lumotlar bilan ishlaydigan aqlli yordamchi. Monitor - bizga rasmlarni ko'rsatadi, sichqoncha - u orqali buyruq beramiz, klaviatura - u orqali yozamiz.",
              analogyOrTechDetails: "Kompyuter huddi odamga o'xshaydi: ekrani - uning ko'zi, sichqonchasi - uning qo'li, tizim bloki esa - uning miyasi!",
              practicalSteps: [
                "Kompyuter orqasidagi yoki tizim blokidagi quvvat (Power) tugmasini bosing.",
                "Ekranda Windows tizimi yuklanishini kuting.",
                "Sichqonchani tekis yuzada harakatlantirib, ekrandagi ko'rsatkich (kursor) qanday yurishini kuzating."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Axborot asri. Shaxsiy kompyuterning (PC) tarkibiy qismlari: Hardware & Software, kirish va chiqish qurilmalari.",
              concept: "Kompyuter tizimi ikki ajralmas qismdan iborat: Hardware (apparat ta'minoti) va Software (dasturiy ta'minot). Kirish qurilmalari (klaviatura, sichqoncha, mikrofon) ma'lumot kiritadi, chiqish qurilmalari (monitor, printer, dinamik) ma'lumotni aks ettiradi.",
              analogyOrTechDetails: "Portlar arxitekturasi: USB (universal), HDMI (yuqori sifatli video/audio), LAN (tarmoq), Audio Jack. Protsessor (CPU) mantiqiy hisob-kitoblarni amalga oshiradi.",
              practicalSteps: [
                "Kompyuter korpusining orqa va old panelidagi ulash portlarini (USB, HDMI, VGA, Audio) o'rganing.",
                "Sichqoncha yoki klaviaturani USB portidan uzib, qayta ulab tekshiring.",
                "Tizim xususiyatlaridan (Properties) protsessor va xotira haajmini aniqlang."
              ]
            },
            game: {
              type: 'mouse',
              title: "Kompyuter qismlari va Portlar poygasi",
              description: "Ekranda harakatlanayotgan kompyuter qismlarini to'g'ri sichqoncha yordamida tezkor bosing va oching!",
              data: {
                targets: ["Monitor 🖥️", "Sichqoncha 🖱️", "Klaviatura ⌨️", "Tizim bloki 🔲", "HDMI port 🔌"],
                speed: 1500
              }
            }
          },
          {
            id: 2,
            title: "Sichqoncha va uning sirlari (Mouse Control)",
            commonTopic: "Sichqoncha tugmalari, kursor boshqaruvi, chap va o'ng tugma hamda Double-Click operatsiyalari.",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "Sichqonchaning o'ng va chap tugmalari nima qiladi? \"Double click\" (ikki marta bosish) siri.",
              concept: "Chap tugma - narsalarni tanlash va ochish uchun (bosh tugma). O'ng tugma - yordamchi menyuni ochadi. Ikki marta bosish (double click) - jild va dasturlarni ichiga kirish uchun xizmat qiladi.",
              analogyOrTechDetails: "Sichqoncha huddi sehrli tayoqchaga o'xshaydi: bir marta bossangiz unga ishora qilasiz, ikki marta bossangiz u sehrlanib ochiladi!",
              practicalSteps: [
                "Sichqonchani o'ng qo'lingiz bilan to'g'ri ushlang (ko'rsatkich barmoq chap tugmada, o'rta barmoq o'ng tugmada).",
                "Ekrandagi ixtiyoriy belgi ustiga borib chap tugmani bir marta bosing (tanlash).",
                "Sichqonchani qimirlatmasdan chap tugmani tezda ketma-ket ikki marta bosing (ochish)."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Kursor xususiyatlari, kontekst menyu (Context Menu), Drag-and-Drop amali va sichqoncha sezgirligi (DPI).",
              concept: "Kontekst menyu (o'ng tugma) ob'ekt ustida bajarish mumkin bo'lgan barcha amallar ro'yxatini chiqaradi. Drag-and-Drop esa ob'ektlarni koordinata bo'yicha siljitish imkonini beradi.",
              analogyOrTechDetails: "Optik sensor harakatni aniqlaydi va DPI (Dots Per Inch) piksellar aniqligini belgilaydi. Kontekst menyu - ob'ektning sozlamalar konsoli hisoblanadi.",
              practicalSteps: [
                "Ishchi stolda o'ng tugmani bosib Kontext menyuni oching.",
                "Ob'ektni ushlab (Drag) yangi joyga ko'chiring (Drop).",
                "Boshqaruv panelidan sichqoncha tezligini va g'ildirakcha (scroll) aylanishini sozlang."
              ]
            },
            game: {
              type: 'mouse',
              title: "Sehrli tayoqcha poygasi",
              description: "Ekranda paydo bo'ladigan rang-barang pufakchalarni chap tugmani ikki marta bosib (\"Double click\") yoring!",
              data: {
                targets: ["Pufakcha 🎈", "Pufakcha 🔴", "Pufakcha 🟡", "Pufakcha 🟢"],
                doubleClickRequired: true,
                speed: 1200
              }
            }
          },
          {
            id: 3,
            title: "Klaviatura va Harflar shaharchasi",
            commonTopic: "Klaviaturadan to'g'ri foydalanish, harf va sonlar terish, maxsus tugmalar (Space, Enter, Shift, Backspace).",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "Harflar, sonlar va eng katta tugma - \"Space\" (probel) nima uchun kerak?",
              concept: "Klaviatura yordamida biz kompyuterga xat yozamiz. Harflar matn yozish uchun, sonlar esa hisoblash uchun. Eng uzun va katta tugma - Space bar (probel) so'zlar orasini ochish uchun kerak.",
              analogyOrTechDetails: "Klaviatura bu - harflar yashaydigan kichkina shaharcha. Har bir tugma - bir uycha bo'lib, uning ichida alohida harf yashaydi!",
              practicalSteps: [
                "Bloknot (Notepad) dasturini oching.",
                "Klaviaturadan o'z ismingiz harflarini ketma-ket bosing.",
                "Ismingizni yozib bo'lgach, eng katta pastki tugmani (Space) bir marta bosib, keyin yoshingizni yozing."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Qaynoq tugmalar (Hotkeys: Ctrl+C, Ctrl+V, Ctrl+Z), o'nta barmoq bilan yozish metodikasi va klaviatura sxemalari.",
              concept: "Klaviatura o'quvchining asosiy ish qurolidir. Qaynoq tugmalar topshiriqlarni 5 barobar tezroq bajarish va operatsion tizim unumdorligini oshirish imkonini beradi.",
              analogyOrTechDetails: "Qaynoq tugmalar: Ctrl+C (nusxa olish), Ctrl+V (qo'yish), Ctrl+X (qirqish), Ctrl+Z (bekor qilish), Alt+Shift (tilni o'zgartirish).",
              practicalSteps: [
                "Notepad dasturini oching va 3 qatordan iborat matn terib yozing.",
                "Ctrl+A orqali barchasini belgilang, Ctrl+C bilan nusxa oling va Ctrl+V bilan 5 marta takrorlang.",
                "Ctrl+Z tugmasi orqali oxirgi harakatni bekor qiling."
              ]
            },
            game: {
              type: 'typing',
              title: "Harflar va Qaynoq tugmalar poygasi",
              description: "Ekranda pastga tushayotgan so'zlarni klaviaturadan tezda bosib yo'qoting!",
              data: {
                words: ["SALOM", "IT", "KOMPYUTER", "SICHQONCHA", "KOSMOS", "DARS", "CTRL+C", "CTRL+V"],
                speed: 2500
              }
            }
          }
        ]
      },
      {
        number: 2,
        title: "Fayllar va Paint grafika muharriri",
        lessons: [
          {
            id: 4,
            title: "Jildlar (Folders) va Fayllar arxitekturasi",
            commonTopic: "Fayllar va jildlar yaratish, nomlash, tartiblash va ma'lumotlarni saqlash.",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "Jildlar (Folders) - o'yinchoqlar qutisi. Kompyuter ichidagi ma'lumotlarni tartibga solish.",
              concept: "Jild (papka) - bu kompyuter ichidagi sehrli quticha. Uning ichiga rasmlarni, daftarlarni va o'yinlarni solib qo'yish mumkin.",
              analogyOrTechDetails: "Jild xuddi maktab sumkangizga o mevali qutilarga o'xshaydi. O'yinchoqlarni bitta qutiga, kitoblarni boshqasiga taxlagandek, fayllarni ham papkalarga bo'lamiz!",
              practicalSteps: [
                "Ishchi stolda (Desktop) o'ng tugmani bosing va \"Создать -> Папку\" (Yangi jild) tanlang.",
                "Jildga o'z ismingizni va familiyangizni yozing.",
                "Jild ichiga kirib (Double Click), yana bitta ichki jild yarating."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Fayl tizimi (NTFS/FAT32), kengaytmalar (.docx, .png, .exe, .mp4) va papka ierarxiyasi.",
              concept: "Fayl - xotirada saqlanadigan ma'lumot birligi. Fayl nomi ikki qismdan iborat: Nomi va Kengaytmasi (extension). Kengaytma kompyuterga faylni qaysi dasturda ochishni aytadi.",
              analogyOrTechDetails: "Fayl kengaytmalari: .txt (matn), .png/.jpg (rasm), .mp4 (video), .exe (bajariluvchi dastur), .pdf (hujjat).",
              practicalSteps: [
                "Fayl kengaytmalarini ko'rinadigan qilish sozlamasini (View -> File name extensions) yoqing.",
                "Har xil kengaytmali (.txt, .docx) fayllar yarating va ularning xususiyatlarini (Properties) solishtiring."
              ]
            },
            game: {
              type: 'sorting',
              title: "Fayllarni va Papkalarni Saralash",
              description: "Berilgan fayllarni o'zlariga mos jildlarga sudrab joylashtiring!",
              data: {
                categories: {
                  "Rasmlar 🖼️": ["tabiat.png", "rasm.jpg", "logo.svg"],
                  "Hujjatlar 📄": ["referat.docx", "kitob.pdf", "eslatma.txt"]
                }
              }
            }
          },
          {
            id: 5,
            title: "Paint dasturi va Rasm chizish asoslari",
            commonTopic: "Paint grafik muharriri, instrumentlar (qalam, o'chirish, mo'yqalam, ranglar palitrasi).",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "Paint dasturi - rasm chizishni boshlaymiz. Qalam, mo'yqalam va ranglar palitrasi.",
              concept: "Paint - bu kompyuterdagi haqiqiy mo'jizaviy rasm daftari. Bu yerda siz xohlagan rangdagi qalam va bo'yoqlardan foydalanib rasm chizishingiz mumkin.",
              analogyOrTechDetails: "Paint bu kompyuteringiz ichidagi tugamaydigan rangli bo'yoqlar to'plamidir!",
              practicalSteps: [
                "Paint dasturini ishga tushiring.",
                "Qalam (Pencil) va mo'yqalam (Brush) vositasini tanlang.",
                "Ranglar palitrasidan sevimli rangni tanlab, o'zingizning quvnoq uyingiz va quyoshingizni chizing."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Rastrli grafika (Raster Graphics), piksellar, piksellar ruxsati (Resolution) va rangli modellar (RGB).",
              concept: "Paint - rastrli grafika bilan ishlovchi sodda muharrir. Har bir tasvir kichik rangli nuqtalar - piksellardan tashkil topadi. Piksel qanchalik ko'p bo'lsa, tasvir sifati shuncha yuqori bo me me'yorga ega bo'ladi.",
              analogyOrTechDetails: "RGB (Red, Green, Blue) ranglar modeli kompyuter ekranida millionlab ranglarni hosil qilish uchun ushbu 3 rangni aralashtiradi.",
              practicalSteps: [
                "Paint'da tasvir o'lchamini (Resize) piksellarda o'zgartiring.",
                "Lupa (Magnifier) instrumenti bilan tasvirni kattalashtirib, alohida piksellarni kuzating.",
                "Chizilgan tasvirni PNG va JPEG formatlarida saqlab, hajm farqini tahlil qiling."
              ]
            },
            game: {
              type: 'mouse',
              title: "Paint qurollarini topish",
              description: "Ekranda paydo bo'lgan Paint instrumentlarini tezkor bosing!",
              data: {
                targets: ["Qalam ✏️", "Mo'yqalam 🖌️", "O'chirg'ich 🧹", "Bo'yoq idishi 🪣", "Ranglar 🎨"],
                speed: 1300
              }
            }
          },
          {
            id: 6,
            title: "Paint - Geometrik shakllar va Vizual Dizayn",
            commonTopic: "Geometrik shakllar (to'rtburchak, doira, ko'pburchak) yordamida murakkab loyihalar yaratish.",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "To'g'ri to'rtburchak, doira va uchburchaklar yordamida murakkab narsalarni yasash.",
              concept: "Har qanday murakkab rasm (mashina, bino, robot) oddiy shakllardan tashkil topgan. To'rtburchakdan bino, doiradan g'ildirak yasaymiz!",
              analogyOrTechDetails: "Shakllar bilan ishlash bu Legodan uy qurishga o'xshaydi!",
              practicalSteps: [
                "Paint'da Shakllar (Shapes) bo'limidan To'rtburchak va Doira tanlang.",
                "Kombinatsiya qilib poezd yoki quvnoq robot chizing.",
                "Bo'yoq idishi (Fill bucket) bilan ularni rang-barang bo'yang."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Simmetriya, proporsiya, Shift tugmasi bilan aniq nisbatli shakllar chizish va ob'ektlarni burish (Rotate/Flip).",
              concept: "Dizaynda geometrik aniqlik muhim. Shift tugmasini bosib turganda doira mukammal sharsimon, to'rtburchak esa teng tomonli kvadrat bo'lib chiziladi.",
              analogyOrTechDetails: "Vektor va rastr farqlari, obyekt simmetriyasi hamda vertikal/gorizontal burish (Rotate 90, Flip horizontal).",
              practicalSteps: [
                "Shift tugmasini bosib mukammal doira va kvadrat chizing.",
                "Select (Belgilash) orqali shaklni nusxalang (Ctrl+C, Ctrl+V) va Flip horizontal bilan burib simmetrik arxitektura chizing."
              ]
            },
            game: {
              type: 'sorting',
              title: "Geometrik Dizayn Saralash",
              description: "Shakllarni to'g'ri geometrik guruhlarga ajrating!",
              data: {
                categories: {
                  "Doiraviy ⚪": ["G'ildirak", "Quyosh", "Koptok"],
                  "To'rtburchak 🟦": ["Oyna", "Eshik", "Kompyuter ekrani"]
                }
              }
            }
          }
        ]
      },
      {
        number: 3,
        title: "Internet, Brauzerlar va Bulutli Texnologiyalar",
        lessons: [
          {
            id: 7,
            title: "Internet nima? Brauzerlar va Tarmoqlar",
            commonTopic: "Global tarmoq, brauzerlar (Chrome), veb-saytlar, IP manzillar va URL strukturasi.",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "Internet nima? Global o'rgimchak to'ri. Brauzerlar - bizning sehrli kemamiz.",
              concept: "Internet - butun dunyodagi kompyuterlarni bir-biri bilan bog'laydigan ko'rinmas sehrli ipdir. Brauzer (Chrome) esa shu sehrli ip bo'ylab sayohat qiluvchi kemamiz!",
              analogyOrTechDetails: "Internet butun dunyo bo'ylab joylashgan ulkan raqamli kutubxonaga o'xshaydi!",
              practicalSteps: [
                "Google Chrome brauzerini oching.",
                "Manzil qatoriga (Address bar) xavfsiz sayt manzilini kiriting.",
                "Saytdagi qiziqarli sahifalarga o'tishni mashq qiling."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Internet arxitekturasi, IP manzil (IPv4/IPv6), DNS (Domain Name System), HTTP/HTTPS xavfsizlik protokollari.",
              concept: "Har bir kompyuter va veb-sayt internetda noyob IP manzilga (masalan: 142.250.185.78) ega. DNS serverlar biz kiritgan domen nomini (google.com) IP manzilga o'girib beradi.",
              analogyOrTechDetails: "CMD buyruqlar satrida `ping google.com` buyrug'i tarmoq kechikishi (latency) va paketlar yetib borishini tekshiradi.",
              practicalSteps: [
                "Buyruqlar satrini (cmd) ochib `ping google.com` va `ipconfig` buyruqlarini bajaring.",
                "HTTPS (qulf belgisi) shifrlangan xavfsiz ulanishni bildirishini brauzerda tekshiring."
              ]
            },
            game: {
              type: 'quiz',
              title: "Internet va Tarmoq Viktorinasi",
              description: "Tarmoq va brauzerlar haqidagi savollarga to'g'ri javob bering!",
              data: {
                questions: [
                  { q: "Internetda veb-saytlarni ochadigan dastur nima deyiladi?", a: ["Paint", "Brauzer (Chrome)", "Bloknot"], c: 1 },
                  { q: "Xavfsiz shifrlangan veb-sayt protokoli qaysi?", a: ["HTTP", "HTTPS", "FTP"], c: 1 },
                  { q: "Veb-sayt manzilini qayerga yozamiz?", a: ["Qidiruv tugmasiga", "Manzil satriga (Address bar)", "Jildga"], c: 1 }
                ]
              }
            }
          },
          {
            id: 8,
            title: "Google'da Axborot Topish va Ilg'or Qidiruv",
            commonTopic: "Qidiruv tizimlari, kalit so'zlar (Keywords) va Google Advanced Search operatorlari.",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "Google orqali qanday qilib hayvonlar va multfilm qahramonlarining rasmlarini topish mumkin?",
              concept: "Google - bu dunyodagi eng bilag'on sehrgar. Undan xohlagan narsangizni so'rasangiz, bir soniyada topib beradi!",
              analogyOrTechDetails: "Google ga so'z yozish bu sehrli ertak kitobidan sahifa izlashga o'xshaydi!",
              practicalSteps: [
                "Google.com saytiga kiring.",
                "Qidiruv maydoniga sevimli multfilm qahramoningiz nomini yozing.",
                "\"Картинки\" (Rasmlar) bo'limiga o'tib, chiroyli rasmni tanlang va saqlang."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Google Advanced Search operatorlari: \"\", -, filetype:, site:, intitle: orqali professional ma'lumot izlash.",
              concept: "Qidiruv unumdorligi to'g'ri mantiqiy operatorlarga bog'liq. Qo'shtirnoq \"\" aniq iborani izlaydi, minus (-) keraksiz so'zlarni chiqarib tashlaydi, filetype:pdf faqat PDF hujjatlarni topadi.",
              analogyOrTechDetails: "Misol: `site:edu filetype:pdf \"computer science\"` - ta'lim saytlaridan faqat kompyuter faniga oid PDF fayllarni topib beradi.",
              practicalSteps: [
                "Google'da `filetype:pdf \"IT literacy\"` deb qidirib ilmiy qo'llanma toping.",
                "`site:wikipedia.org` operatori yordamida faqat Vikipediya ichidan ma'lumot izlang."
              ]
            },
            game: {
              type: 'typing',
              title: "Qidiruv Operatorlari Poygasi",
              description: "Qidiruv operatorlarini va kalit so'zlarni klaviaturadan tezkor terib mashq qiling!",
              data: {
                words: ["FILETYPE:PDF", "SITE:EDU", "GOOGLE", "SEARCH", "OPERATOR", "KEYWORD"],
                speed: 2300
              }
            }
          },
          {
            id: 9,
            title: "Yuklangan Fayllar va Bulutli Xotira (Google Drive)",
            commonTopic: "Fayllarni yuklab olish, mahalliy papkalarga joylash va Cloud Storage (Google Drive) imkoniyatlari.",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "Internetdan olingan rasmlarni o'zimiz yaratgan jildlarga (papkalarimizga) tartiblab joylash.",
              concept: "Internetdan yuklab olingan barcha narsalar \"Загрузки\" (Downloads) jildiga tushadi. U yerdan rasmlarni o'zimizning shaxsiy jildimizga ko'chirib o'tkazamiz.",
              analogyOrTechDetails: "Bu internet xazinasidan olingan narsalarni o'z xonangizdagi javonga joylashga o'xshaydi!",
              practicalSteps: [
                "Internetdan 3 ta turli hayvon rasmini yuklab oling.",
                "\"Downloads\" papkasini oching.",
                "Rasmlarni tanlab, o'zingiz yaratgan \"Mening Hayvonlarim\" papkasiga ko'chiring."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Bulutli texnologiyalar (Google Drive, OneDrive), sinxronizatsiya, fayl ulashish (Link sharing & Access permissions).",
              concept: "Bulutli xotira ma'lumotlarni masofaviy serverlarda saqlaydi. Fayllarni do'stlaringizga havola (Link) orqali ulasangiz, ularga \"Viewer\" (Ko'ruvchi) yoki " + "\"Editor\" (Tahrirlovchi) huquqini berishingiz mumkin.",
              analogyOrTechDetails: "Bulutli xotira tufayli kompyuteringiz buzilsa ham, barcha muhim fayllaringiz internetdagi shaxsiy profil da xavfsiz saqlanib qoladi.",
              practicalSteps: [
                "Google Drive (drive.google.com) sahifasiga kiring.",
                "Yangi jild yarating va unga mahalliy kompyuterdan fayl yuklang (Upload).",
                "Faylga link sharing o'rnating va havolasini nusxalab oling."
              ]
            },
            game: {
              type: 'sorting',
              title: "Bulutli va Mahalliy Xotira Saralash",
              description: "Fayllarni to'g'ri saqlash joylariga ajrating!",
              data: {
                categories: {
                  "Bulutli Xotira ☁️": ["Google Drive", "OneDrive", "Dropbox"],
                  "Mahalliy Xotira 💻": ["Tizim diski (C:)", "Fleshka (USB)", "Ishchi stol"]
                }
              }
            }
          }
        ]
      },
      {
        number: 4,
        title: "Kiberxavfsizlik va 1-Oy Yakuniy Amaliyot",
        lessons: [
          {
            id: 10,
            title: "Kiberxavfsizlik va Kiber-gigiyena",
            commonTopic: "Kiberxavfsizlik ertagi, fishing (Phishing) xatarlari, kuchli parollar va ikki bosqichli autentifikatsiya (2FA).",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "Kiberxavfsizlik ertagi. Begonalar bilan gaplashmaslik, shubhali tugmalarni bosmaslik qoidalari.",
              concept: "Internetda chiroyli ko'ringan har bir tugma xavfsiz bo'lavermaydi. Noma'lum kimsalardan kelgan xatlarni ochmang va parollaringizni hech kimga aytmang!",
              analogyOrTechDetails: "Kompyuterdagi parol bu - uyingizning sehrli kalitidir. Kalitni begonalarga bermaganingizdek, parolni ham sir tuting!",
              practicalSteps: [
                "Ekranda shubhali reklama yoki xabar paydo bo'lganda \"X\" tugmasini bosing.",
                "Kamida 8 ta belgidan iborat, harf va sonlar aralashgan parol o'ylab toping."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Sotsial injeneriya, fishing saytlar va klon domenlar, 2FA (Ikki bosqichli tasdiqlash), Parollar boshqaruvi (Password Manager).",
              concept: "Fishing - bu soxta veb-sahifalar orqali foydalanuvchining login va parolini o'g'irlash usulidir. 2FA faollashtirilganda parol bilinsa ham, SMS yoki ilova kodi bo'lmasdan akkauntga kirib bo'lmaydi.",
              analogyOrTechDetails: "Har doim domen manzilini tekshiring: `telegram.org` o'rniga `telegraam-login.ru` bo'lsa, bu fishing saytdir!",
              practicalSteps: [
                "Haqiqiy va soxta domen manzillarini farqlash mashqini bajaring.",
                "Google yoki Telegram akkauntingizda Ikki bosqichli autentifikatsiyani (2FA) faollashtiring."
              ]
            },
            game: {
              type: 'quiz',
              title: "Kiberxavfsizlik Qalqoni",
              description: "Kiberxavfsizlik va parollar bo'yicha testdan o'ting!",
              data: {
                questions: [
                  { q: "Eng kuchli parol qaysi biri?", a: ["12345678", "parol2026", "K@mpyuter#2026!"], c: 2 },
                  { q: "Noma'lum kishidan kelgan shubhali havolani (link) nima qilish kerak?", a: ["Darg'azab bo'lib bosish", "Ochmasdan o'chirish", "Do'stlarga yuborish"], c: 1 },
                  { q: "Akkauntni 2 barobar xavfsiz qiladigan tizim nima?", a: ["2FA (Ikki bosqichli tasdiqlash)", "Paint", "Shift tugmasi"], c: 0 }
                ]
              }
            }
          },
          {
            id: 11,
            title: "Klaviatura Poygasi va Tezkor Yozuv San'ati",
            commonTopic: "Klaviaturada tez va xatosiz yozish, matn trenajyorlari va klaviatura ergonomikasi.",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "Klaviaturada harflarni tez topish sirlari va quvnoq harf o'yinlari.",
              concept: "Barmoqlarimiz klaviaturadagi har bir tugmaga do'st bo'lishi kerak. To'g'ri o'tirib, ikki qo'limiz bilan yozishni o'rganamiz.",
              analogyOrTechDetails: "Barmoqlar klaviaturada huddi pianino chalayotgan musiqachiga o'xshab yengil sakrashi kerak!",
              practicalSteps: [
                "Klaviaturada to'g'ri holatda (gavdani tik tutib) o'tiring.",
                "Klaviatura trenajyorida (RapidTyping) 1 daqiqada eng ko'p harf terish mashqini bajaring."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "O'nta barmoq bilan ko'rmasdan yozish (Blind Touch Typing), F va J tayanch tugmalari, WPM (Words Per Minute) ko'rsatkichini oshirish.",
              concept: "Ko'rmasdan yozish texnikasi F va J tugmalaridagi kichik bo'rtmalarga ko'rsatkich barmoqlarni qo'yishdan boshlanadi. Bu WPM tezligini 40-60 so'z/daqiqa darajasiga yetkazadi.",
              analogyOrTechDetails: "Typingclub va Keybr platformalarida barmoqlar mushak xotirasini (Muscle memory) rivojlantirish.",
              practicalSteps: [
                "Ko'rsatkich barmoqlarni F va J tugmalariga joylashtiring.",
                "1 daqiqalik yozuv testida WPM va xatosizlik (Accuracy %) darajangizni aniqlang."
              ]
            },
            game: {
              type: 'typing',
              title: "Super Tezkor Klaviatura Poygasi",
              description: "Tez va xatosiz terib eng yuqori ballni toplayotgan chempion bo'ling!",
              data: {
                words: ["TEXNOLOGIYA", "ALGORITM", "RAQAMLI", "INNOVATSIYA", "KIBERXAVFSIZLIK", "PROTSESSOR"],
                speed: 2000
              }
            }
          },
          {
            id: 12,
            title: "1-Oy Imtihoni va Amaliy Loyiha",
            commonTopic: "1-oy davomida o'rganilgan barcha IT savodxonlik ko'nikmalarini amalda sinash va taqdim qilish.",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "1-oy imtihoni - \"Mening sehrli sayyoram\" va kompyuter bilimlari taqdimoti.",
              concept: "Yangi jild yaratamiz, Paint'da koinot va sayyoralar rasmini chizamiz, uni jildga saqlaymiz va ustozimizga ko'rsatamiz!",
              analogyOrTechDetails: "Siz endi haqiqiy kompyuter bilimdonisiz!",
              practicalSteps: [
                "Ishchi stolda \"Mening Sehrli Sayyoram\" nomli yangi jild yarating.",
                "Paint dasturida koinot va kemangizni chizib, shu jildga saqlang.",
                "Ismingiz va yoshingizni Bloknotda yozib, o'z loyihangizni taqdim eting."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "1-oy yakuniy laboratoriya ishi: Kompyuter diagnostikasi, fayllar arxivi, bulutga yuklash va tarmoq testi.",
              concept: "Ushbu imtihon tizim xususiyatlarini aniqlash, murakkab fayl tuzilmasini yaratish, WinRAR bilan arxivlash va Google Drive orqali havola ulashishni qamrab oladi.",
              analogyOrTechDetails: "Real tizim administratori kabi kompyuterni vaqtinchalik Temp fayllardan tozalab, bulutli sinxronizatsiyani tugallang.",
              practicalSteps: [
                "Tizim xarakteristikasini matn fayliga saqlang.",
                "Fayllardan iborat papkani WinRAR orqali parollab arxivlang.",
                "Arxivni Google Drive'ga yuklab, linkini ustozga yuboring."
              ]
            },
            game: {
              type: 'sorting',
              title: "1-Oy IT Bilimlar Saralashi",
              description: "1-oyda o'rganilgan barcha tushunchalarni to'g'ri o'z o'rniga joylashtiring!",
              data: {
                categories: {
                  "Qurilmalar 🖥️": ["Monitor", "Sichqoncha", "Klaviatura", "Protsessor"],
                  "Dasturlar 💿": ["Paint", "Google Chrome", "WinRAR", "Notepad"]
                }
              }
            }
          }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // 2-OY: PROFESSIONAL HUJJATLAR VA TAQDIMOTLAR (12 ta dars)
  // -------------------------------------------------------------
  {
    number: 2,
    title: "PROFESSIONAL HUJJATLAR VA TAQDIMOTLAR",
    weeks: [
      {
        number: 5,
        title: "MS Word - Matn Muharriri va Formatlash",
        lessons: [
          {
            id: 13,
            title: "MS Word bilan Tanishuv va Matn Kiritish",
            commonTopic: "Microsoft Word muharririga kirish, sahifa o'lchamlari, matn kiritish qoidalari hamda abzaslar.",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "MS Word - Yozuv mashinasi bilan tanishuv. Katta va kichik harflar (Shift), Enter va Space.",
              concept: "MS Word - bu kompyuter ichidagi mo'jizaviy yozuv mashinasidir. Bu yerda ertak kitoblar, xatlar va chiroyli hikoyalar yozish mumkin.",
              analogyOrTechDetails: "Enter tugmasi - bu yangi varaqqa yoki yangi qatorga o'tuvchi sehrli qadamdir!",
              practicalSteps: [
                "MS Word dasturini oching.",
                "Shift tugmasini bosib turganda ismingizning birinchi harfini katta qilib yozing.",
                "O'zingiz va sevimli o'yinchoqlaringiz haqida 5 ta gapdan iborat matn terib chizing."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "MS Word interfeysi, sahifa maydonlari (Margins), orientatsiya (Portrait/Landscape), abzas va qatorlararo masofa (Line Spacing).",
              concept: "Hujjat tayyorlashda standart talablar (A4 formati, Margins: Normal 2.5cm, Line spacing: 1.15) bajarilishi kerak. Enter yangi abzas ochadi, Shift+Enter esa abzasni buzmasdan keyingi qatorga o'tkazadi.",
              analogyOrTechDetails: "Abzas oralig'i (Paragraph Spacing Before/After) hujjatning strukturaviy o'qilishini yengillashtiradi.",
              practicalSteps: [
                "Layout menyusidan Margins va Orientation (Albom/Kitob) sozlamalarini o'zgartiring.",
                "Matn kiriting va Paragraph menyusidan Line spacing 1.5 hamda Justify (ikkala tomondan tekislash) formatini qo'llang."
              ]
            },
            game: {
              type: 'typing',
              title: "MS Word Matn Yozish Poygasi",
              description: "Word klaviaturasida so'zlarni tez va aniq terib o'rganning!",
              data: {
                words: ["MICROSOFT", "WORD", "HUJJAT", "ABZAS", "FORMATLASH", "SAHIFA"],
                speed: 2200
              }
            }
          },
          {
            id: 14,
            title: "MS Word - Shriftlar, Ranglar va Uslublar (Styles)",
            commonTopic: "Shrift turlari (Serif vs Sans-Serif), shrift o'lchami, matn ranglari hamda Headings (Sarlavhalar) tizimi.",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "Kamalak rangli harflar. Shriftlarni kattalashtirish, ranglarini o'zgartirish va bezash.",
              concept: "Harflarning shaklini va rangini o'zgartirishimiz mumkin. Shrift o'lchamini kattalashtirib sarlavha qilamiz, rangli bo'yoqlar bilan kamalak kabi bezatamiz!",
              analogyOrTechDetails: "Shriftlar bu harflarning kiygan kiyimiga o'xshaydi: ba'zilari bayramona, ba'zilari esa sportcha!",
              practicalSteps: [
                "Yozgan matningizni sichqoncha bilan belgilang (Highlight).",
                "Shrift o'lchamini 20 ga kattalashtiring.",
                "Har bir so'zga turli yorqin ranglar berib, Kamalak matn yaratmiz."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Tipografika asoslari: Times New Roman (Serif) vs Arial/Calibri (Sans-Serif), Headings (Heading 1, Heading 2) uslublari va matn tekislash.",
              concept: "Rasmiy va ilmiy hujjatlarda Serif (kertikli) shriftlar ishlatiladi. Heading 1 va Heading 2 uslublarini to'g'ri biriktirish kelgusida avtomatik mundarija tuzish uchun shartdir.",
              analogyOrTechDetails: "Styles paneli orqali bir tugma bilan butun hujjatdagi sarlavhalar dizaynini bir xillashtirish mumkin.",
              practicalSteps: [
                "Asosiy matnga Times New Roman 14pt shrift bering.",
                "Sarlavhalarga Heading 1 va Heading 2 uslublarini tatbiq eting."
              ]
            },
            game: {
              type: 'sorting',
              title: "Shriftlar va Uslublar Saralash",
              description: "Shrift va uslublarni to me'yoriy guruhlarga ajrating!",
              data: {
                categories: {
                  "Serif (Kertikli) 📜": ["Times New Roman", "Georgia", "Garamond"],
                  "Sans-Serif (Kertiksiz) 🔠": ["Arial", "Calibri", "Verdana"]
                }
              }
            }
          },
          {
            id: 15,
            title: "MS Word - Rasmlar va Avtomatik Mundarija",
            commonTopic: "Hujjatga rasmlar joylashtirish, matn bilan o'rash (Text Wrapping) va ko'p sahifali avtomatik mundarija.",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "Matnga rasmlar va kulgichlar (emoji) qo'shish. Ertak qahramonlari bilan bezash.",
              concept: "Hujjatimizga Google'dan rasmlar qo'shib, uni xuddi rasmli ertak kitobiga aylantirishimiz mumkin!",
              analogyOrTechDetails: "Rasm qo me matn - bu kitobimizning rasmli illyustratsiyasidir!",
              practicalSteps: [
                "Insert -> Pictures bo'limiga kiring.",
                "Google'dan yuklangan sevimli ertak qahramoningiz rasmini Word'ga qo'shing.",
                "Rasm hajmini kichiklashtirib, matn yoniga tekislang."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Text Wrapping (In line with text, Square, Tight), sahifalarni raqamlash (Page Numbers) va Table of Contents (Avtomatik mundarija).",
              concept: "Ko'p sahifali ilmiy ishlar yoki referatlarda Headings uslubida belgilangan sarlavhalar asosida References -> Table of Contents tugmasi bitta bosish bilan mukammal mundarija yaratadi.",
              analogyOrTechDetails: "Sahifa raqamlari (Page Numbers) va mundarija hujjat tarkibini navigatsiya qilishni ta'minlaydi.",
              practicalSteps: [
                "5 sahifali hujjatga sahifa raqamlarini (Page Numbers Bottom-Center) qo'ying.",
                "References -> Table of Contents orqali avtomatik mundarija hosil qiling."
              ]
            },
            game: {
              type: 'quiz',
              title: "MS Word va Mundarija Testi",
              description: "Word imkoniyatlari bo'yicha bilimlaringizni sinang!",
              data: {
                questions: [
                  { q: "Avtomatik mundarija yaratish uchun qaysi menyuga kiriladi?", a: ["Home", "References (Ssilki)", "View"], c: 1 },
                  { q: "Rasm matn bilan o'ralishi uchun qaysi xususiyat ishlatiladi?", a: ["Text Wrapping (Obtekaniye)", "Font Size", "Save As"], c: 0 },
                  { q: "Rasmiy ilmiy ishlar uchun qaysi shrift standart hisoblanadi?", a: ["Comic Sans", "Times New Roman", "Impact"], c: 1 }
                ]
              }
            }
          }
        ]
      },
      {
        number: 6,
        title: "MS Word - Tabriknomalar, Jadvallar va Grafiklar",
        lessons: [
          {
            id: 16,
            title: "MS Word - Tabriknomalar va Jadvallar (Tables)",
            commonTopic: "Ramkalar va sahifa fonlari, tabriknomalar dizayni hamda murakkab jadvallar yaratish.",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "\"Onajonim uchun tabriknoma\" loyihasi va Word'da birinchi sodda jadvalimiz.",
              concept: "Hujjatimizga chiroyli guldor ramkalar o'rnatib, tug'ilgan kun yoki bayram tabriknomasini yasaymiz! Shuningdek, kataklardan iborat dars jadvalini tuzamiz.",
              analogyOrTechDetails: "Jadval bu mevalar va o'yinchoqlarni tartibli joylaydigan javonlarga o'xshaydi!",
              practicalSteps: [
                "Design -> Page Borders bo'limidan guldor yoki yulduzli ramka tanlang.",
                "Tabriknoma matnini yozib, rangli shriftlar bering.",
                "Insert -> Table orqali 3x3 jadval yaratib, sevimli mevalaringizni yozing."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Jadvallar bilan mukammal ishlash: kataklarni birlashtirish (Merge Cells), ajratish (Split), katak hoshiyalari hamda Maktab dars jadvali loyihasi.",
              concept: "Word jadvallari murakkab strukturali ma'lumotlarni tartiblash va hisobotlar tayyorlash uchun xizmat qiladi. Merge cells bir nechta katakni bitta sarlavhaga aylantiradi.",
              analogyOrTechDetails: "Table Design va Layout panellari orqali katak ichidagi matnni vertikal va gorizontal markazlashtirish.",
              practicalSteps: [
                "Insert -> Table orqali 6x7 dars jadvalini tuzing.",
                "Birinchi qatordagi kataklarni Merge Cells bilan birlashtiring va haftalik dars jadvalini shakllantiring."
              ]
            },
            game: {
              type: 'sorting',
              title: "Jadval Elementlarini Saralash",
              description: "Jadval uskunalarini to'g'ri guruhlarga ajrating!",
              data: {
                categories: {
                  "Ustun va Satrlar 📊": ["Ustun (Column)", "Satr (Row)", "Katak (Cell)"],
                  "Amallar ⚙️": ["Merge Cells", "Split Cells", "Table Design"]
                }
              }
            }
          },
          {
            id: 17,
            title: "MS Word - Shakllar, SmartArt va Komikslar",
            commonTopic: "Vektor shakllar (Shapes), SmartArt iyerarxik diagrammalari va komiks loyihalari.",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "Word ichidagi yulduzchalar, yurakchalar va bulutlar yordamida komikslar yaratish.",
              concept: "Word'dagi so'zlovchi bulutchalar (Callouts) va yulduzchalardan foydalanib, ikkita qahramon suhbatlashadigan qiziqarli komiks chizamiz!",
              analogyOrTechDetails: "Bulutcha ichidagi matn - bu multfilm qahramonining gapirayotgan so'zlaridir!",
              practicalSteps: [
                "Insert -> Shapes bo'limidan Callouts (so'zlovchi bulutcha) tanlang.",
                "Ertak qahramonlari rasmini joylashtiring.",
                "Bulutchalar ichiga ularning quvnoq dialoglarini yozing."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "SmartArt vizual elementlari: Process, Hierarchy, Cycle diagrammalari bilan jarayon va tuzilmalarni ko'rsatish.",
              concept: "SmartArt - murakkab axborot, tashkiliy tuzilma va algoritmik jarayonlarni bir necha soniyada professional ko'rinishga keltiruvchi grafik vositadir.",
              analogyOrTechDetails: "Hierarchy diagrammasi maktab yoki kompaniya tuzilmasini daraxtsimon ko'rinishda namoyon etadi.",
              practicalSteps: [
                "Insert -> SmartArt bo'limidan Hierarchy diagrammasini tanlang.",
                "O'z maktabingiz yoki oila shajarasining iyerarxik sxemasini tuzing."
              ]
            },
            game: {
              type: 'mouse',
              title: "SmartArt va Shakllar Poygasi",
              description: "Ekranda ko'ringan SmartArt va Shakllar obyektlarini bosing!",
              data: {
                targets: ["Hierarchy 🌳", "Process ➡️", "Cycle 🔄", "Callout 💬", "Star ⭐"],
                speed: 1200
              }
            }
          },
          {
            id: 18,
            title: "MS Word - Kolontitullar (Headers/Footers) va Giperhavolalar",
            commonTopic: "Hujjatning yuqori va pastki doimiy maydonlari (Headers & Footers) hamda Giperhavolalar (Hyperlinks).",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "Kitobcha sahifalariga doimiy nomimizni va sana yozish. Sehrli havolalar.",
              concept: "Har bir sahifaning tepasida va pastida doimiy ko'rinadigan maxsus sehrli chiziqcha bor. U yerga o'z ismimizni va sahifa raqamini yozib qo'yamiz.",
              analogyOrTechDetails: "Kolontitul - bu kitobning har bir sahifasidagi muallif muhri!",
              practicalSteps: [
                "Insert -> Header tugmasini bosing.",
                "Yuqoriga o'z ism-familiyangizni va bugungi sanani yozing.",
                "Footer bo'limiga sahifa raqamini qo'ying."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Headers & Footers sozlamalari (Different First Page), Giperhavola (Hyperlinks - Ctrl+K) va hujjatlararo bog'lanish.",
              concept: "Giperhavola (Ctrl+K) hujjatdagi matnni veb-saytga yoki boshqa sahifaga ulaydi. Different First Page esa titul sahifasiga kolontitul tushishining oldini oladi.",
              analogyOrTechDetails: "Giperhavola ko'k rangda tagiga chizilgan matn bo'lib, Ctrl bilan bosilganda kerakli resursni ochadi.",
              practicalSteps: [
                "Ctrl+K tugmasi orqali matnga viki-sahifa havolasini (Hyperlink) biriktiring.",
                "Header bo'limida \"Different First Page\" katakchasini belgilab titul sahifasini tozalang."
              ]
            },
            game: {
              type: 'typing',
              title: "Word Qaynoq Tugmalar Poygasi",
              description: "Word qaynoq tugmalarini tezkor terib bilimingizni oshiring!",
              data: {
                words: ["CTRL+K", "CTRL+N", "CTRL+P", "CTRL+S", "HEADER", "FOOTER"],
                speed: 2100
              }
            }
          }
        ]
      },
      {
        number: 7,
        title: "MS PowerPoint - Biznes va Animatsion Taqdimotlar",
        lessons: [
          {
            id: 19,
            title: "MS PowerPoint va Taqdimot Asoslari",
            commonTopic: "Taqdimot (Presentation) tushunchasi, slaydlarni yaratish, dizayn shablonlari va kontrast qoidalari.",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "MS PowerPoint va Rangli sahifalar. Taqdimot nima? Slaydlar bilan ishlash.",
              concept: "PowerPoint - bu bizning sehrli elektron albomimiz! Uning har bir sahifasi \"Slayd\" deyiladi. Slaydlarga rasm, matn va rang beramiz.",
              analogyOrTechDetails: "Slaydlar bu raqamli doskadagi rang-barang slayd-shou tomoshasidir!",
              practicalSteps: [
                "MS PowerPoint dasturini oching.",
                "Design bo'limidan yoqtirgan rangli shabloningizni tanlang.",
                "Birinchi slaydga \"Mening Orzularim\" deb sarlavha yozing."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Taqdimot dizayni prinsiplari: 60-30-10 ranglar qoidasi, kontrast, shriftlar ierarxiyasi va \"Yomon vs Yaxshi taqdimot\" tahlili.",
              concept: "Professional taqdimotda slayd matnga to'ldirilmaydi (\"Kamroq matn - ko'proq ma'no\"). Foni to'q bo'lsa matni och, foni och bo'lsa matni to'q rangda bo'lishi shart.",
              analogyOrTechDetails: "Taqdimot bu nutqingizning vizual illyustratsiyasidir, uni to'liq o me'yorsiz o'qiydigan matnga aylantirmang.",
              practicalSteps: [
                "Blank presentation yaratib 16:9 keng ekran formatini sozlang.",
                "Dizaynda kontrastli shrift va ranglar garmoniyasini tanlang."
              ]
            },
            game: {
              type: 'sorting',
              title: "Yaxshi va Yomon Slayd Saralashi",
              description: "Slayd xususiyatlarini to me'yoriy guruhlarga ajrating!",
              data: {
                categories: {
                  "To'g'ri Slayd ✅": ["Katta sifatli rasm", "Qisqa ma'noli matn", "Yuqori kontrast"],
                  "Xato Slayd ❌": ["Miyani og'rituvchi ko'p matn", "Past sifatli pikselli rasm", "Och kulrang matn"]
                }
              }
            }
          },
          {
            id: 20,
            title: "MS PowerPoint - Slaydlar va Vizual Ierarxiya",
            commonTopic: "Slaydlarga matn, rasmlar, ikonkalar joylashtirish va vizual axborot ierarxiyasini qurish.",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "Slaydlarni rasmlar va foto-albomlar bilan to'ldirish.",
              concept: "Slaydlarimizga sayohat rasmlarini, hayvonlar va multfilm suratlarini chiroyli qilib joylashtiramiz.",
              analogyOrTechDetails: "Foto-albom yaratish bu do'stlaringizga sayohat rasmlaringizni namoyish qilishga o'xshaydi!",
              practicalSteps: [
                "Yangi 3 ta slayd qo'shing (New Slide).",
                "Google'dan o'zingiz borishni orzu qilgan shahar rasmlarini yuklang.",
                "Har bir slaydga bittadan rasm va uning nomini joylang."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Vizual ierarxiya, Vector Icons (Ikonkalar), Slayd maketlari (Layouts: Title, Two Content) va \"Mening IT Startapim\" taqdimot loyihasi.",
              concept: "Inson ko'zi avval katta rasm va sarlavhaga, so'ngra mayda matnga qaraydi. Ikonkalar (Icons) axborotni o'qishni 3 barobar tezlashtiradi.",
              analogyOrTechDetails: "Slayd maketlari (Layouts) kontent turiga qarab matn va mediani avtomatik tekislab beradi.",
              practicalSteps: [
                "Insert -> Icons bo'limidan zamonaviy vektor ikonkalar tanlang.",
                "\"Mening IT Startapim\" loyihasi uchun 3 ta slaydli vizual strukturani shakllantiring."
              ]
            },
            game: {
              type: 'mouse',
              title: "PowerPoint Elementlari Poygasi",
              description: "Ekranda ko'ringan PowerPoint obyektlarini tezkor bosing!",
              data: {
                targets: ["Slayd 📄", "Ikonka 💡", "Dizayn 🎨", "Foto-albom 🖼️", "Sarlavha 🔤"],
                speed: 1300
              }
            }
          },
          {
            id: 21,
            title: "MS PowerPoint - Slaydlar O'tishi (Transitions & Morph)",
            commonTopic: "Slayddan slaydga o'tish effektlari (Transitions) hamda mo'jizaviy Morph (Transformatsiya) effekti.",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "Slaydlarning sehrli o'zgarishi (Transitions). Eshik ochilishi, origami qushi va shamol effektlari.",
              concept: "Slayd almashayotganda ekranda sangatli tomosha yuz beradi: parda ochiladi, qog'oz qushcha uchib ketadi!",
              analogyOrTechDetails: "Transitions bu slaydlaringiz orasidagi sangatli sehrli pardadir!",
              practicalSteps: [
                "Transitions menyusiga kiring.",
                "Slaydlaringizga Push, Wipe yoki Origami effektlarini bering.",
                "F5 tugmasini bosib, taqdimotni to'liq ekranda tomosha qiling."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Morph (Transformatsiya) effekti, slaydlar dinamikasi, obyektlar mosligi va silliq harakatlar yaratish.",
              concept: "Morph - ikki slayd orasidagi bir xil nomli yoki shaklli obyektlarni avtomatik ravishda silliq harakatlantirib, kinematik 3D animation hosil qiladi.",
              analogyOrTechDetails: "Morph effekti uchun obyekt birinchi slaydda bir o'lchamda, ikkinchi slaydda esa boshqa joy va o'lchamda bo'lishi yetarli.",
              practicalSteps: [
                "1-slayddagi ob'ektni nusxalab 2-slaydga o'tkazing va o'lchamini kattalashtiring.",
                "Transitions bo'limidan Morph effektini qo'llang va natijani sinang."
              ]
            },
            game: {
              type: 'quiz',
              title: "Transitions va Morph Testi",
              description: "PowerPoint o'tish effektlari bo'yicha bilimlaringizni sinang!",
              data: {
                questions: [
                  { q: "Taqdimotni to'liq ekranda namoyish etish tugmasi qaysi?", a: ["F1", "F5", "Ctrl+P"], c: 1 },
                  { q: "Obyektlarni silliq harakatlantiruvchi eng zamonaviy effekt qaysi?", a: ["Morph (Transformatsiya)", "Fade", "Cut"], c: 0 },
                  { q: "Transitions effekti qayerga beriladi?", a: ["Matnning ichiga", "Slaydlar orasiga", "Rasmga"], c: 1 }
                ]
              }
            }
          }
        ]
      },
      {
        number: 8,
        title: "Animatsiyalar, Multfilmlar va Startap Festivali",
        lessons: [
          {
            id: 22,
            title: "MS PowerPoint - Animatsiyalar va Triggers",
            commonTopic: "Obyektlar animatsiyasi (Entrance, Emphasis, Exit), vaqt sozlamalari (Delay/Duration) va Triggers.",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "Rasmlarni harakatga keltiramiz (Animations). Uchib kirish va sakrash effektlari.",
              concept: "Slayddagi mashina rasmini, qushlarni va harflarni harakatlantirib, xuddi haqiqiy multfilm kabi yurgizishimiz mumkin!",
              analogyOrTechDetails: "Animatsiya bu rasmlaringizga jon kirgizish sehridir!",
              practicalSteps: [
                "Animations menyusiga o'ting.",
                "Mashina rasmiga Fly In (Uchib kirish) animatsiyasini bering.",
                "Duration vaqtini o'zgartirib, mashinaning sekinroq va chiroyli yurishini sozlang."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Animation Pane, Start options (On Click, With Previous, After Previous), Triggers (Tugma bosilganda animatsiya ishga tushishi).",
              concept: "Triggers orqali ekrandagi ma'lum bir tugma bosilganda kerakli obyekt paydo bo'ladigan interaktiv viktorina va test slaydlarini yaratish mumkin.",
              analogyOrTechDetails: "Animation Pane har bir animatsiyaning ketma-ketligi va vaqt shkalasini mikrosekundlargacha nazorat qiladi.",
              practicalSteps: [
                "Animation Pane darchasini oching.",
                "Obyektga Trigger biriktiring va tugma bosilganda xabar chiqadigan interaktiv slayd yasang."
              ]
            },
            game: {
              type: 'sorting',
              title: "Animatsiya Turlarini Saralash",
              description: "Animatsiya effektlarini to me'yoriy guruhlarga ajrating!",
              data: {
                categories: {
                  "Kirish (Entrance) 🟢": ["Fly In", "Appear", "Zoom"],
                  "Chiqish (Exit) 🔴": ["Fly Out", "Disappear", "Fade Out"]
                }
              }
            }
          },
          {
            id: 23,
            title: "MS PowerPoint - Animatsion Ertak va Startap Loyiha",
            commonTopic: "Ko'p slayddan iborat animatsion loyiha yaratish hamda MP4 video formatiga eksport qilish.",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "\"Mening kichik ertagim\" loyihasi. 3-4 ta slayddan iborat multfilm tayyorlash.",
              concept: "O'zimiz xohlagan qahramonlar ishtirokida harakatlanuvchi va so me'zlashuvchi ertak taqdimotini yaratamiz.",
              analogyOrTechDetails: "Siz endi shaxsiy multfilmingizning rejissyorisiz!",
              practicalSteps: [
                "3 ta slaydli ertak yaratib, qahramonlarga animatsiyalar bering.",
                "Har bir slaydga mos fon musiqasi va rasmlarni tanlang.",
                "Taqdimotni namoyish etib sinfdoshlaringizga ko'rsating."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Presenter View (Taqdimotchi rejimi), ovoz yozib olish (Record Slide Show) hamda MP4 Video eksporti.",
              concept: "Tayyorlangan taqdimotni File -> Export -> Create a Video orqali yuqori sifatli MP4 rolik holatida saqlab, ijtimoiy tarmoqlarga joylash mumkin.",
              analogyOrTechDetails: "Presenter View rejimida ma'ruzachi o'z kompyuterida keyingi slayd va eslatmalarni ko'radi, proyektorda esa faqat slayd namoyish etiladi.",
              practicalSteps: [
                "Slide Show -> Record Slide Show orqali ovozli tushuntirish yozing.",
                "File -> Export -> Create a Video (Full HD) tugmasi bilan MP4 rolikka o'giring."
              ]
            },
            game: {
              type: 'typing',
              title: "PowerPoint Eksport Poygasi",
              description: "Taqdimot va video terminlarini klaviaturadan tezkor terib o'rganing!",
              data: {
                words: ["EXPORTS", "MP4", "PRESENTATION", "PRESENTER", "SLIDESHOW", "TRIGGER"],
                speed: 2100
              }
            }
          },
          {
            id: 24,
            title: "2-Oy Imtihoni - Multfilmlar va Startaplar Festivali",
            commonTopic: "2-oylik bilimlar (Word va PowerPoint) bo'yicha amaliy loyihani sahnada taqdim etish (Soft Skills).",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "2-oy imtihoni - Multfilmlar festivali va ommaviy nutq tajribasi.",
              concept: "O'zimiz yaratgan animatsion ertakni sinf doskasida namoyish etamiz va barchaga so'zlab beramiz!",
              analogyOrTechDetails: "Bu sizning raqamli kinematografiyadagi birinchi katta premyerangizdir!",
              practicalSteps: [
                "PowerPoint ertagingizni katta ekranga o'tkazing.",
                "Sinf doskasida turib multfilmingiz haqida so'zlab bering.",
                "Do'stlaringizning ishlarini qarsaklar bilan rag'batlantiring."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Startap g'oyalar taqdimoti festivali, nutq madaniyati, B2B/B2C slayd stili va javob-savol sessiyasi.",
              concept: "Har bir o'quvchi o'zining \"Mening IT Startapim\" taqdimotini 5 daqiqa davomida hakamlar va sinfdoshlar oldida professional himoya qiladi.",
              analogyOrTechDetails: "Nutq so me'zlashda ko'z kontaktini saqlash, o me'zish tempini va taymerni to'g'ri boshqarish (Elevator Pitch).",
              practicalSteps: [
                "5 daqiqalik taymer bo'yicha startap taqdimotini sahnada himoya qiling.",
                "Berilgan savollarga asosli va xushfeli javob bering."
              ]
            },
            game: {
              type: 'quiz',
              title: "2-Oy Yakuniy Viktorinasi",
              description: "Word va PowerPoint bo me'yicha billingizni sinab ko'ring!",
              data: {
                questions: [
                  { q: "SmartArt va iyerarxik diagrammalar qaysi dasturda bor?", a: ["MS Word va PowerPoint", "Paint", "Notepad"], c: 0 },
                  { q: "Taqdimotchi uchun maxsus ikkita ekranli rejim nima deyiladi?", a: ["Presenter View", "Normal View", "Grid View"], c: 0 },
                  { q: "Taqdimotni video formatida saqlash qaysi formatda bo'ladi?", a: [".mp4", ".docx", ".txt"], c: 0 }
                ]
              }
            }
          }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // 3-OY: MA'LUMOTLAR BILAN ISHLASH VA TAHLIL (MS EXCEL) (12 ta dars)
  // -------------------------------------------------------------
  {
    number: 3,
    title: "MA'LUMOTLAR BILAN ISHLASH VA TAHLIL (MS EXCEL)",
    weeks: [
      {
        number: 9,
        title: "MS Excel Asoslari va Kataklar Anatomiyasi",
        lessons: [
          {
            id: 25,
            title: "MS Excel - Sehrli Kataklar Mamlakati",
            commonTopic: "MS Excel muharriri, Ishchi kitob (Workbook), Varag' (Sheets), Ustun (Column A), Satr (Row 1) va Katak (Cell A1).",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "Sehrli kataklar mamlakatiga xush kelibsiz! Kataklar (A1, B2) - Dengiz jangi o'yini.",
              concept: "MS Excel - bu minglab kichik katakchalardan iborat sehrli mamlakat. Har bir katakchaning uz nomi bor: A1, B2, C3!",
              analogyOrTechDetails: "Excel kataklari bu \"Dengiz jangi\" o'yinidagi xarita koordinatalariga o'xshaydi!",
              practicalSteps: [
                "MS Excel dasturini oching.",
                "Kursor bilan C3, D4, E5 katakchalarini topib ustiga bosing.",
                "A1 katakchaga o'z ismingizni yozib qoldiring."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Excel interfeysi, ma'lumotlar turlari (General, Number, Currency, Short Date, Text) va katak adresatsiyasi.",
              concept: "Excel elektron jadvali ma'lumotlarni strukturaviy tahlil qilish uchun xizmat qiladi. Katak turi noto'g'ri tanlansa (masalan: matn sifatida kiritilgan son), formulalar hisoblamaydi.",
              analogyOrTechDetails: "Katak adresatsiyasi ustun harfi va satr raqami kesishmasidan hosil bo'ladi (A1, B12, Z100).",
              practicalSteps: [
                "Number Format menyusidan Currency ($/So'm), Percentage (%) va Date formatlarini sozlashingizni sinang.",
                "A1:D10 diapazonini belgilash mashqini bajaring."
              ]
            },
            game: {
              type: 'grid',
              title: "Dengiz Jangi va Kataklarni Topish",
              description: "Berilgan A1, C3, E5 koordinatalardagi kataklarni topib bosing!",
              data: {
                targets: ["A1", "B3", "C2", "D4", "E1"]
              }
            }
          },
          {
            id: 26,
            title: "MS Excel - Piksel Art va Kataklarni Formatlash",
            commonTopic: "Kataklarni ranglar bilan to'ldirish (Fill Color), o'lchamlarini o'zgartirish va vizual dizayn.",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "Excelda Piksel Art (Kataklarda rasm chizish). Yurakcha va dinozavr chizish.",
              concept: "Excel katakchalarining hajmini kichiklashtirib, ularni bo'yoqlar bilan to'ldirsak, ajoyib Piksel-Art rasmlar hosil bo'ladi!",
              analogyOrTechDetails: "Kataklarni bo'yash bu mozaika toshlaridan rasm terishga o'xshaydi!",
              practicalSteps: [
                "Ustunlar kengligini kichiklashtirib kvadrat kataklar hosil qiling.",
                "Fill Color (Bo'yoq idishi) vositasini tanlang.",
                "Kataklarni qizil va sariq rangga bo'yab yurakcha va koptok rasmini chizing."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Kataklarni formatlash, matnni sig'dirish (Wrap Text), kataklarni birlashtirish (Merge & Center) va do'kon tovarlar jadvali.",
              concept: "Jadval sarlovhasini yaratishda Merge & Center bir nechta katakni yagona sarlavhaga aylantiradi. Wrap Text esa uzun matnni katak kengligiga mos ravishda ko'p qatorli qiladi.",
              analogyOrTechDetails: "Katak chegaralari (Borders) chop etilganda jadval to'g'ri ko'rinishi uchun shartdir (chunki standart katak to me'rlari chop etilmaydi).",
              practicalSteps: [
                "A1:E1 kataklarini belgilab Merge & Center tugmasini bosing.",
                "Tovarlar ro me'yxati uchun Wrap Text va All Borders xususiyatini qo'llang."
              ]
            },
            game: {
              type: 'grid',
              title: "Excel Piksel Art Mozaikasi",
              description: "Kataklarni to'g'ri ranglar bilan to'ldirib Piksel-Art obyektini hosil qiling!",
              data: {
                artMode: true,
                targets: ["B2", "B3", "C2", "C3", "D2", "D3"]
              }
            }
          },
          {
            id: 27,
            title: "MS Excel - Chegaralar va Avtotoldirish (Auto-Fill)",
            commonTopic: "Katak chegaralari (Borders), avtotoldirish (Auto-Fill) markeri va massivlar bilan ishlash.",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "Rang-barang chegaralar va uychalar. Avtotoldirish sehrli tugmasi.",
              concept: "1 va 2 sonini yozib, katak burchagidan pastga sudrab tushsak, Excel qolgan barcha sonlarni o'zi ketma-ket yozib beradi!",
              analogyOrTechDetails: "Avtotoldirish - bu sizning o'rningizga tezda sonlarni yozib beruvchi aqlli robottir!",
              practicalSteps: [
                "A1 ga 1, A2 ga 2 yozing.",
                "Ikkala katakni belgilab, pastki o'ng burchakdagi sehrli nuqtadan (Auto-fill) pastga torting.",
                "1 dan 50 gacha sonlar bir soniyada paydo bo'lganini kuzating."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Auto-Fill markeri mantiqi (sonlar, haftalari, oylar, sanalar ketma-ketligi), Custom Lists va yillik kalendar jadvali.",
              concept: "Auto-fill tugmasi belgilangan obyektlar orasidagi qadamni (step) tahlil qilib, geometrik va arifmetik progressiya shaklida ketma-ketlikni davom ettiradi.",
              analogyOrTechDetails: "Dushanba deb yozib sudralsa, Excel avtomatik ravishda haftaning barcha kunlarini izchillik bilan to me'ldiradi.",
              practicalSteps: [
                "Yanvar deb yozib 12 oyni Auto-fill orqali bir zumda hosil qiling.",
                "2, 4, 6 juft sonlar ketma-ketligini sudrab 100 gacha yetkazib ko'ring."
              ]
            },
            game: {
              type: 'sorting',
              title: "Auto-Fill Ketma-Ketlik Saralashi",
              description: "Auto-fill ketma-ketliklarini to me'yoriy tartibda taxlang!",
              data: {
                categories: {
                  "Kunlar 📅": ["Dushanba", "Shanba", "Yakshanba"],
                  "Sonlar 🔢": ["1, 2, 3...", "5, 10, 15...", "100, 200, 300..."]
                }
              }
            }
          }
        ]
      },
      {
        number: 10,
        title: "Matematik Formulalar va Funksiyalar",
        lessons: [
          {
            id: 28,
            title: "MS Excel - Formulalar va Arifmetik Amallar",
            commonTopic: "Excelda formulalar yozish, tenglik (=) belgisi, arifmetik amallar (+, -, *, /) hamda Nisbiy va Absolyut havolalar ($).",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "Mening shirinliklar do'konim. Formula boshi - sehrli tenglik (=) belgisi.",
              concept: "Excelda har qanday hisob-kitob qilish uchun katakchaga birinchi bo'lib tenglik (=) belgisini yozishimiz shart!",
              analogyOrTechDetails: "= belgisi bu Excelga: \"Kichik kalkulyatoringni yoq va menga hisoblab ber!\" deyishdir.",
              practicalSteps: [
                "A1 katakka 5, B1 katakka 10 yozing.",
                "C1 katakka `=A1+B1` deb yozib Enter bosing.",
                "C1 katakda avtomatik 15 soni paydo bo'lganini ko'ring."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Nisbiy va Absolyut adresatsiya (F4 tugmasi - $ belgisi yordamida katakni qulflash) hamda Valyuta konvertori jadvali.",
              concept: "Formula boshqa kataklarga nusxalanganda nisbiy adreslar o'zgaradi. Katak adresini o'zgarmas (qulflangan) qilish uchun F4 tugmasi orqali `$A$1` absolyut havola qo'llaniladi.",
              analogyOrTechDetails: "Dollar kuru ($) kabi doimiy ko'rsatkichlar absolyut havola bilan qulflanishi kerak.",
              practicalSteps: [
                "D3 katagida valyuta kursini yozib $D$3 shaklida qulflang.",
                "Tovarlar narxini so'mdan dollarga o me'giruvchi formulani nusxalang."
              ]
            },
            game: {
              type: 'grid',
              title: "Arifmetik Formulalar Kalkulyatori",
              description: "Excel formulalarini to me'g'ri hisoblab mos kataklarni toping!",
              data: {
                numberGrid: true,
                targets: ["A1", "A2", "B1"]
              }
            }
          },
          {
            id: 29,
            title: "MS Excel - Statistik Funksiyalar (SUM, AVERAGE, MIN, MAX)",
            commonTopic: "Tayyor statistik funksiyalar: SUM (yig'indi), AVERAGE (o'rtacha qiymat), MIN va MAX.",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "Sehrli tugma - AutoSum (Avtomatik yig'indi). Bir soniyada hisoblash.",
              concept: "AutoSum (∑) tugmasini bir marta bossak, u barcha sonlarni qo'shib, umumiy yig'indisini chiqarib beradi!",
              analogyOrTechDetails: "SUM bu barcha o'yinchoqlaringizni bittada sanab beruvchi sehrli sanoqchidir!",
              practicalSteps: [
                "Ustunga 5 ta har xil son yozing.",
                "Barcha sonlarni belgilab, AutoSum (∑) tugmasini bosing.",
                "Pastda umumiy yig'indi hosil bo'lganini kuzating."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Matematik va statistik funksiyalar: `=SUM()`, `=AVERAGE()`, `=MIN()`, `=MAX()`, `=COUNT()` va O'quvchilar baholar monitoringi.",
              concept: "Statistik funksiyalar katta diapazondagi ma'lumotlarni tahlil qiladi. AVERAGE o'rtacha ko'rsatkichni, MIN/MAX esa eng past va eng yuqori natijani topadi.",
              analogyOrTechDetails: "Misol: `=AVERAGE(B2:B30)` - 29 nafar o'quvchining o me'rtacha ballini hisoblaydi.",
              practicalSteps: [
                "O'quvchilar baholari jadvalida `=SUM(C2:G2)` orqali umumiy ballni toping.",
                "`=AVERAGE(C2:G2)` funksiyasi bilan o me'rtacha o'zlashtirish ballini aniqlang."
              ]
            },
            game: {
              type: 'quiz',
              title: "Statistik Funksiyalar Testi",
              description: "Excel funksiyalari bo'yicha bilimlaringizni sinang!",
              data: {
                questions: [
                  { q: "Sonlarning o'rtacha qiymatini hisoblaydigan funksiya qaysi?", a: ["SUM", "AVERAGE", "MAX"], c: 1 },
                  { q: "Eng katta sonni topuvchi funksiya qaysi?", a: ["MIN", "MAX", "COUNT"], c: 1 },
                  { q: "Excelda funksiya qaysi belgi bilan boshlanadi?", a: ["#", "=", "@"], c: 1 }
                ]
              }
            }
          },
          {
            id: 30,
            title: "MS Excel - Mantiqiy IF (AGAR) Funksiyasi",
            commonTopic: "Mantiqiy shartlar, IF (Agar) funksiyasi strukturasi hamda avtomatik qaror qabul qilish.",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "Mantiqiy o'yinlar. Agar do'konimizdan 3 ta konfet sotilsa, qancha qoladi?",
              concept: "Excel kompyuteri mantiqiy o'ylay oladi. \"Agar baho 5 bo'lsa - Barakalla, bo'lmasa - Harakat qil!\" deb unga buyruq beramiz.",
              analogyOrTechDetails: "IF bu yo'ldagi svetoforga o'xshaydi: yashil bo'lsa yuradi, qizil bo'lsa to me'xtaydi!",
              practicalSteps: [
                "A1 katakka 80 yozing.",
                "B1 katakka `=IF(A1>=60; \"A'lo\"; \"Yomon\")` deb formula kiritib ko'ring."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Mantiqiy funksiya sintaksisi: `=IF(Logical_test; Value_if_true; Value_if_false)` va Natijalar monitoringi.",
              concept: "IF funksiyasi berilgan shartning rost (TRUE) yoki yolg'on (FALSE) ekanligini tekshirib, shunga mos ikkita turli harakatdan birini bajaradi.",
              analogyOrTechDetails: "Ichma-ich joylashgan IF (Nested IF) orqali ko'p bosqichli baholash shkalasini qurish mumkin.",
              practicalSteps: [
                "Baholar jadvalida `=IF(C2>=60; \"O'tdi\"; \"Yiqildi\")` formulasini qo me'llang.",
                "Formula natijasini avtotoldirish orqali butun sinf o'quvchilariga tarqating."
              ]
            },
            game: {
              type: 'typing',
              title: "IF Funksiyasi Poygasi",
              description: "IF funksiyasi va mantiqiy terminlarni tezkor terib o'rganing!",
              data: {
                words: ["=IF()", "LOGICAL", "TRUE", "FALSE", "CONDITION", "SYNTAX"],
                speed: 2100
              }
            }
          }
        ]
      },
      {
        number: 11,
        title: "Ma'lumotlarni Tahlil Qilish, Filtrlash va Diagrammalar",
        lessons: [
          {
            id: 31,
            title: "MS Excel - Shartli Hisoblagichlar (COUNTIF / SUMIF)",
            commonTopic: "Shartga ko'ra hisoblash va yig'indini topish: COUNTIF va SUMIF funksiyalari.",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "Faqat qizil olmalarni sanash o'yini. Aqlli hisoblagichlar.",
              concept: "Excel do'konimizdagi barcha shokoladlar ichidan faqatgina qizil rangli yoki faqat shokoladli konfetlarni ajratib sanab beradi!",
              analogyOrTechDetails: "COUNTIF bu ma'lum bir xususiyatli o'yinchoqlarni saralab sanovchi sehrli barmoqdir!",
              practicalSteps: [
                "Mevalar va ularning ranglari ro'yxatini tuzing.",
                "Faqat \"Qizil\" mevalarni sanaydigan formulani ko'ring."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Shartli matematik funksiyalar: `=COUNTIF(Range; Criteria)` va `=SUMIF(Range; Criteria; Sum_range)` hamda Omborxona tahlili.",
              concept: "COUNTIF belgilangan diapazonda shartga mos keladigan kataklar sonini sanaydi. SUMIF esa faqat shartni qanoatlantiruvchi kataklar qiymatini qo'shadi.",
              analogyOrTechDetails: "Misol: `=SUMIF(A2:A50; \"Meva\"; C2:C50)` - faqat Meva turidagi tovarlar tushumini hisoblaydi.",
              practicalSteps: [
                "Katta mahsulotlar ro'yxatidan faqat \"Elektronika\" tovarlari sonini COUNTIF bilan aniqlang.",
                "SUMIF funksiyasi orqali ularning umumiy summalarini hisoblang."
              ]
            },
            game: {
              type: 'sorting',
              title: "COUNTIF va SUMIF Saralashi",
              description: "Funksiyalarni to'g'ri vazifalariga ko'ra ajrating!",
              data: {
                categories: {
                  "COUNTIF 🔢": ["Kataklar sonini sanaydi", "Faqat shartga mosini sanaydi"],
                  "SUMIF 💰": ["Summalarni qo'shadi", "Faqat shartli pullarni qo'shadi"]
                }
              }
            }
          },
          {
            id: 32,
            title: "MS Excel - Saralash (Sort) va Filtrlash (Filter)",
            commonTopic: "Ma'lumotlarni saralash (Sort A-Z / Z-A) va Filtrlash (Data Filter) orqali kerakli axborotni ajratish.",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "Ma'lumotlarni saralash (Alifbo tartibi). Tartibsiz ro'yxatlarni bir zumda tartibga keltirish.",
              concept: "Sochilib yotgan ismlarni alifbo tartibida A dan Z gacha bir soniyada chiroyli qilib safga tizib qo'yamiz!",
              analogyOrTechDetails: "Saralash bu sinfdagi bolalarni bo'yiga qarab safga tizishga o'xshaydi!",
              practicalSteps: [
                "Do'stlaringizning ismlarini tartibsiz yozing.",
                "Data -> Sort A-Z tugmasini bosing va ismlar alifbo bo'yicha taxlanganini kuzating."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Ko'p darajali saralash (Custom Sort), Data Filter (Ctrl+Shift+L) va Katta hajmdagi ma'lumotlar bazasi bilan ishlash.",
              concept: "Filter tugmasi (Ctrl+Shift+L) ustunlar tepasida ko me'rinadigan menyu hosil qiladi. U yerdan kerakli qiymatlarni tanlab, qolgan keraksiz qatorlarni vaqtincha yashirish mumkin.",
              analogyOrTechDetails: "Filtrlash ma'lumotlarni o me'chirmaydi, faqatgina shartga mos kelmaydigan qatorlarni yashiradi.",
              practicalSteps: [
                "Jadvalga Ctrl+Shift+L bosib Filtr o'rnating.",
                "Aholisi 10 milliondan ko'p bo'lgan davlatlarni filtrlab oling."
              ]
            },
            game: {
              type: 'mouse',
              title: "Filtr va Saralash Poygasi",
              description: "Ekranda ko'ringan Filter va Sort uskunalarini bosing!",
              data: {
                targets: ["Sort A-Z 🔤", "Sort Z-A 🔠", "Filter 🌪️", "Custom Sort ⚙️"],
                speed: 1200
              }
            }
          },
          {
            id: 33,
            title: "MS Excel - Professional Diagrammalar va Grafiklar",
            commonTopic: "Ma'lumotlarni vizuallashtirish: Ustunli (Column), Chiziqli (Line) va Doiraviy (Pie) diagrammalar.",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "Rang-barang diagrammalar (Chiroyli minoralar). Sonlarni minoralarga aylantirish.",
              concept: "Jadvaldagi sonlarni rang-barang baland minoralar va doiraviy piroglarga aylantirib chiroyli ko'rsatamiz!",
              analogyOrTechDetails: "Diagramma bu sonlarning rangli rasmga aylangan ko'rinishidir!",
              practicalSteps: [
                "Sevimli mevalaringiz va ularning soni jadvalini tuzing.",
                "Insert -> Column Chart tugmasini bosing.",
                "Rangli minoralar ko'rinishidagi diagrammani tomosha qiling."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Diagramma turlari va ularning maqsadi: Column (solishtirish), Line (vaqt bo'yicha dinamika), Pie (ulush/foiz), Chart Elements (Legend, Data Labels).",
              concept: "Diagramma tanlash axborot turiga bog'liq. Vaqt bo me'yicha o'sishni ko'rsatish uchun Line Chart, tarkibiy ulushni ko me'rsatish uchun Pie Chart ishlatiladi.",
              analogyOrTechDetails: "Chart Design paneli orqali Legend (shartli belgilar) va Data Labels (qiymat yozuvlari) joylashtiriladi.",
              practicalSteps: [
                "Yillik kompyuter sotuvi jadvaliga mos Line Chart quring.",
                "Data Labels va Legend elementlarini sozlang."
              ]
            },
            game: {
              type: 'quiz',
              title: "Diagrammalar va Tahlil Testi",
              description: "Excel diagrammalari bo'yicha bilimlaringizni sinang!",
              data: {
                questions: [
                  { q: "Foizli ulushlarni ko'rsatish uchun qaysi diagramma mos keladi?", a: ["Doiraviy (Pie Chart)", "Chiziqli", "Nuqtali"], c: 0 },
                  { q: "Vaqt bo'yicha dinamikani ko'rsatuvchi grafik qaysi?", a: ["Line Chart (Chiziqli)", "Bar Chart", "3D Chart"], c: 0 },
                  { q: "Filtrni faollashtirish qaynoq tugmasi qaysi?", a: ["Ctrl+Shift+L", "Ctrl+P", "Alt+F4"], c: 0 }
                ]
              }
            }
          }
        ]
      },
      {
        number: 12,
        title: "Shartli Formatlash, Katta Loyiha va Sertifikatlar",
        lessons: [
          {
            id: 34,
            title: "MS Excel - Shartli Formatlash (Conditional Formatting)",
            commonTopic: "Conditional Formatting (Shartli formatlash), Data Bars, Color Scales hamda do'kon xarajatlari vizualizatsiyasi.",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "Svetofor katakchalar. Sonlarga qarab avtomatik rang berish.",
              concept: "Excel kataklari avtomatik bo'yaladi: a'lo baholar yashil rangda, past baholar esa qizil rangda porlaydi!",
              analogyOrTechDetails: "Shartli formatlash bu kataklarning sehrli svetoforidir!",
              practicalSteps: [
                "Baholar jadvalini belgilang.",
                "Conditional Formatting -> Highlight Cells Rules bo'limini oching.",
                "5 baholarni yashil, 2 baholarni qizil rangga bo'yang."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Conditional Formatting qoidalari (Greater than, Less than, Top/Bottom Rules), Data Bars va Icon Sets yordamida moliya tahlili.",
              concept: "Shartli formatlash jadval o'zgarganda rang va belgilarni dinamik ravishda moslashtiradi. Masalan: xarajat belgilangan limitdan oshsa, katak avtomatik qizaradi.",
              analogyOrTechDetails: "Data Bars katak ichida mini-gistogramma hosil qilib, sonlar nisbatini darhol ko'rsatadi.",
              practicalSteps: [
                "Oylik xarajatlar jadvalida eng ko'p sarf-xarajat kataklarini Data Bars bilan ajratib ko'rsating.",
                "Top 10% qiymatlarga alohida stil bering."
              ]
            },
            game: {
              type: 'sorting',
              title: "Shartli Formatlash Saralashi",
              description: "Formatlash qoidalarini to me'yoriy guruhlarga ajrating!",
              data: {
                categories: {
                  "Rangli Qoidalar 🎨": ["Highlight Cells", "Color Scales"],
                  "Vizual Indikatorlar 📊": ["Data Bars", "Icon Sets (Svetoforlar)"]
                }
              }
            }
          },
          {
            id: 35,
            title: "MS Excel - Katta Yakuniy Loyiha",
            commonTopic: "3 oylik barcha bilimlarni qamrab olgan mustaqil amaliy loyiha (Moliya budjeti / Hayvonot bog'i hisobi).",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "\"Mening sevimli hayvonot bog'im\" - Katta yakuniy loyiha.",
              concept: "3 oylik barcha bilimlarni birlashtirib, Excelda hayvonlar soni, ularning rasmlari va ovqatlari hisobidan iborat katta loyiha quramiz!",
              analogyOrTechDetails: "Siz endi o'zingizning raqamli hayvonot bog'ingizning bosh hisobchisisiz!",
              practicalSteps: [
                "Hayvonlar nomi, soni va ovqati jadvalini tuzing.",
                "Formulalar bilan umumiy ovqat miqdorini hisoblang.",
                "Diagramma qurib, jadvalni chiroyli bezating."
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "\"Mening oilaviy moliyaviy budjetim\" - Kompleks tahliliy loyiha.",
              concept: "Oila a'zolarining daromad va xarajatlarini hisoblovchi, IF, SUMIF, COUNTIF formulalarini o'zichiga olgan va shartli formatlash hamda diagrammalar bilan jihozlangan murakkab loyiha.",
              analogyOrTechDetails: "Excel loyihangizni PowerPoint va Word bilan integratsiya qilib, umumiy hisobot tayyorlang.",
              practicalSteps: [
                "Oylik daromad va xarajatlar balansi jadvalini nol'dan quring.",
                "Formulalar va diagrammalar bilan yillik moliya modelini tahlil qiling."
              ]
            },
            game: {
              type: 'typing',
              title: "Yakuniy Loyiha Poygasi",
              description: "Excel va IT terminlarini tezkor terib bilimingizni sinang!",
              data: {
                words: ["FINANCE", "BUDGET", "ANALYTICS", "DASHBOARD", "INTEGRATION", "FORMULA"],
                speed: 2000
              }
            }
          },
          {
            id: 36,
            title: "3-Oy Imtihoni - Katta IT-Bayram va Sertifikatlar",
            commonTopic: "3 oylik mukammal IT savodxonlik kursini yakunlash, Kahoot viktorina hamda Sertifikatlar topshirish marosimi.",
            kichik: {
              ageGroup: "1-4 sinf (Kichiklar)",
              badge: "Ertak & Visual",
              topic: "Yakuniy imtihon o'rniga \"Katta IT-Bayram\" va Sertifikatlar topshirilishi.",
              concept: "Siz 3 oy davomida kompyuter, sichqoncha, Paint, Word, PowerPoint va Excelni a'lo darajada o'rgandingiz! Endi bayram va sertifikat vaqti!",
              analogyOrTechDetails: "Tabriklaymiz! Siz endi yosh IT qahramonisiz!",
              practicalSteps: [
                "Kahoot test savollariga tez va to'g'ri javob bering.",
                "O'z loyihangizni ota-onalar va ustozingizga g'urur bilan ko'rsating.",
                "IT Savodxonlik Sertifikatini tantanali ravishda qabul qilib oling!"
              ]
            },
            katta: {
              ageGroup: "5-9 sinf (Kattalar)",
              badge: "Chuqurlashtirilgan Pro",
              topic: "Kurs yakuniy imtihoni (Kahoot!), amaliy loyihalar himoyasi va \"IT Savodxonlik Sertifikati\" marosimi.",
              concept: "3 oylik chuqurlashtirilgan IT dasturining yakuniy sinovi. O'quvchilar o'zlarining shaxsiy loyihalarini himoya qilib, sertifikat egasiga aylanadilar.",
              analogyOrTechDetails: "Raqamli ko'nikmalar (Digital literacy) kelgusidagi dasturlash, dizayn va IT sohalariga asos bo'ladi.",
              practicalSteps: [
                "36 darslik bilimlar bo'yicha yakuniy testni topshiring.",
                "O'z Excel va PowerPoint loyihangizni taqdim eting.",
                "Sertifikatni tantanali ravishda qabul qilib oling!"
              ]
            },
            game: {
              type: 'quiz',
              title: "KATTA IT-VIKTORINA (Kahoots!)",
              description: "3 oylik sayohatimiz davomida o'rgangan eng qiziqarli va muhim narsalar bo'yicha yakuniy sinov!",
              data: {
                questions: [
                  { q: "Kompyuterning miyasi qaysi?", a: ["Sichqoncha", "Tizim bloki / Protsessor", "Monitor"], c: 1 },
                  { q: "Hujjatga chiroyli rasm qaysi menyudan qo'shiladi?", a: ["Fayl", "Vstavka (Insert)", "Dizayn"], c: 1 },
                  { q: "Excelda qaysi belgi bilan formula boshlanadi?", a: ["#", "@", "="], c: 2 }
                ]
              }
            }
          }
        ]
      }
    ]
  }
];

// Helper derived exports for backward compatibility if needed
export const KICHIK_YOSH_CURRICULUM = UNIFIED_CURRICULUM;
export const KATTA_YOSH_CURRICULUM = UNIFIED_CURRICULUM;
