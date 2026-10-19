# Reja: Har Bir O'quvchi Uchun Professional Individual Profil Sahifasi

O'quvchilar va ustozlar uchun zamonaviy IT Akademiyasi talablariga to'liq javob beruvchi, har bir o'quvchining shaxsiy o'sishi, o'zlashtirgan darslari, to'plagan ballari, ustoz tavsiyalari, reyting darajasi va yutuq nishonlarini qamrab oluvchi professional profil tizimini yaratish.

---

## 1. Foydalanuvchi Tajribasi va Ko'rinishi (UX/UI Arxitekturasi)

Profil sahifasi ikkala asosiy bo'limga uzviy integratsiya qilinadi:
1. **O'quvchi Dashboardida (`StudentDashboard.tsx`)**:
   - O'quvchi o'z profiliga alohida **"Mening Individual Profilim"** tugmasi orqali to'liq ekranli / professional panel ko'rinishida kirishi mumkin.
   - O'quvchining ism-sharifi, sinfi (`5-sinf`), yo'nalishi (`IT Savodxonlik & Dizayn`), login identifikatori va o'quvchi darajasi (masalan, *Junior Explorer*, *Tech Novice*, *Code Apprentice*, *Design Junior*, *Master Student*) ko'rsatiladi.
2. **O'qituvchi Dashboardida (`TeacherDashboard.tsx`)**:
   - Ustoz barcha 11 nafar o'quvchi kartochkasidan istalgan o'quvchi ustiga bosib, uning shaxsiy individual profilini to'g'ridan-to'g'ri ochib ko'rishi, monitoring qilishi va profilidan turib unga yangi baho yoki tavsiya yoza olishi ta'minlanadi.

---

## 2. Professional Profil Komponenti Tarkibi (`StudentProfileView.tsx`)

Yangi yaratiladigan alohida `src/components/StudentProfileView.tsx` komponenti quyidagi professional bloklarni o'z ichiga oladi:

### A. Yuqori Hero Banner & Shaxsiy Karta (Student Identity Header)
- IT Akademiyasi uslubidagi to'q ko'k va zumrad gradientli zamonaviy karta.
- O'quvchining avatari (harflar monogrammasi yoki maxsus IT avatarlar), to'liq ismi, unikal ID (`std_nafosat`, `std_dilmurod` va h.k.), sinfi va o'qish yo'nalishi.
- **Tezkor ko'rsatkichlar**:
  - Umumiy to'plangan ballar (masalan, `285 ball`).
  - O'zlashtirilgan darslar soni (masalan, `14 ta dars`).
  - O'rtacha o'zlashtirish ko'rsatkichi (`92%`).
  - Ustozdan qoldirilgan maxsus tavsiyalar soni.
- **Harakat tugmalari**:
  - 🖨️ **"Profilni chop etish / PDF saqlash"** (brauzerning rasmiy print oynasi orqali A4 formatidagi o'quvchi hisoboti ko'rinishida).
  - 🔗 **"Natijalarni ulashish"** (o'quvchi va ota-onalarga yuborish uchun chiroyli matnli clipboard nusxasi).

### B. Gamifikatsiya va Yutuq Nishonlari (Badges & Milestones)
- **O'quvchi darajalari (Level Progression)**:
  - 1-Daraja: "Ilk Qadam" (Kamida 1 ta dars yakunlangan).
  - 2-Daraja: "Klaviatura Ustasi" (Tez yozish va klaviatura asoslari).
  - 3-Daraja: "Grafik Dizayner" (Canva va dizayn darslari).
  - 4-Daraja: "Sun'iy Intellekt Bilimdoni" (AI vositalari o'rganilganda).
  - 5-Daraja: "IT Savodxonlik Bitiruvchisi" (Barcha modullar).
- Har bir nishon holati (erishilgan / jarayonda / qulflangan) interaktiv ko'rsatiladi.

### C. O'zlashtirilgan Darslar va O'sish Ko'rsatkichi (Mastered Lessons & Progress)
- O'quvchi o'zlashtirgan barcha darslar ro'yxati (IT Savodxonlik va Kompyuter Grafikasi yo'nalishlaridan).
- Har bir dars uchun o'zlashtirish sanasi, to'plangan ball va o'quvchining holati (A'lo / Yaxshi / Qoniqarli).
- Oylik va modullar kesimidagi o'zlashtirish foiz chiziqlari (Progress bars).

### D. Ustozdan Maxsus Tavsiyalar va Baholar Bloki (Teacher Recommendations & Feedback)
- Ustoz tomonidan yozilgan har bir dars bo'yicha maxsus izoh, o'quvchining kuchli tomonlari (`Strengths`) va o'sishi kerak bo'lgan sohalari (`Improvements`).
- Ustoz imzosi (`Assadxoja`) va sana ko'rsatilgan rasmiy murabbiy mulohazasi kartochkalari.
- Bo'sh bo'lgan holatda o'quvchini rag'batlantiruvchi motivatsion xabar.

---

## 3. Loyihaga Kiritiladigan O'zgarishlar

1. **`src/components/StudentProfileView.tsx`**:
   - Yangi to'liq xususiyatli, professional darajadagi individual profil modal/sahifasini yaratish.
   - Chop etish uchun moslashtirilgan `@media print` uslublari (ortiqcha menyulardan xoli, rasmiy A4 sertifikat/hisobot ko'rinishida).
2. **`src/components/StudentDashboard.tsx`**:
   - Profilni ochish tugmasini yuqori panelga qo'shish.
   - O'quvchi o'z profilingizni ochib barcha shaxsiy yutuqlarini bir joyda ko'rishi va PDF qilib saqlashi uchun integratsiya qilish.
3. **`src/components/TeacherDashboard.tsx`**:
   - Har bir o'quvchi kartochkasiga **"Profilni ko'rish"** tugmasini joylashtirish, bu orqali o'qituvchi 11 nafar o'quvchidan istalgan birining profilini alohida ochib ko'ra oladi.
4. **`src/services/studentManager.ts`**:
   - O'quvchining to'plagan umumiy ballari, o'zlashtirgan darslar soni, erishgan nishonlari hisob-kitobini osonlashtiruvchi yordamchi funksiyalar.

---

## 4. Tekshirish va Sifat Nazorati (Verification)
- Linter va TypeScript turlarini tekshirish (`npm run lint`).
- Ilova kompilyatsiyasini to'liq tekshirish (`compile_applet`).
- Ham o'quvchi kabinetidan, ham o'qituvchi panelidan profillarning to'g'ri va xatosiz ochilishini tasdiqlash.
