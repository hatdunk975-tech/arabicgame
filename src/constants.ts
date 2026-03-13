export interface Word {
  arabic: string;
  transliteration: string;
  uzbek: string;
  category: string;
}

export const ARABIC_DICTIONARY: Word[] = [
  // Oilaviy (Family)
  { arabic: "أَب", transliteration: "Ab", uzbek: "Ota", category: "Oila" },
  { arabic: "أُمّ", transliteration: "Umm", uzbek: "Ona", category: "Oila" },
  { arabic: "أَخ", transliteration: "Akh", uzbek: "Aka/Uka", category: "Oila" },
  { arabic: "أُخْت", transliteration: "Ukht", uzbek: "Opa/Singil", category: "Oila" },
  { arabic: "جَدّ", transliteration: "Jadd", uzbek: "Bobo", category: "Oila" },
  { arabic: "جَدَّة", transliteration: "Jaddah", uzbek: "Buvi", category: "Oila" },
  { arabic: "اِبْن", transliteration: "Ibn", uzbek: "O'g'il", category: "Oila" },
  { arabic: "اِبْنَة", transliteration: "Ibnah", uzbek: "Qiz", category: "Oila" },
  { arabic: "زَوْج", transliteration: "Zawj", uzbek: "Er", category: "Oila" },
  { arabic: "زَوْجَة", transliteration: "Zawjah", uzbek: "Xotin", category: "Oila" },

  // Salomlashish (Greetings)
  { arabic: "سَلَام", transliteration: "Salam", uzbek: "Salom", category: "Muloqot" },
  { arabic: "مَرْحَبًا", transliteration: "Marhaban", uzbek: "Xush kelibsiz", category: "Muloqot" },
  { arabic: "شُكْرًا", transliteration: "Shukran", uzbek: "Rahmat", category: "Muloqot" },
  { arabic: "عَفْوًا", transliteration: "Afwan", uzbek: "Arzimaydi", category: "Muloqot" },
  { arabic: "نَعَمْ", transliteration: "Na'am", uzbek: "Ha", category: "Muloqot" },
  { arabic: "لَا", transliteration: "La", uzbek: "Yo'q", category: "Muloqot" },
  { arabic: "كَيْفَ حَالُكَ؟", transliteration: "Kayfa haluka?", uzbek: "Ahvolingiz qanday?", category: "Muloqot" },
  { arabic: "بِخَيْر", transliteration: "Bikhayr", uzbek: "Yaxshi", category: "Muloqot" },
  { arabic: "إِلَى اللِّقَاء", transliteration: "Ila al-liqa", uzbek: "Ko'rishguncha", category: "Muloqot" },
  { arabic: "مَعَ السَّلَامَة", transliteration: "Ma'a as-salamah", uzbek: "Xayr", category: "Muloqot" },

  // Uy (Home)
  { arabic: "بَيْت", transliteration: "Bayt", uzbek: "Uy", category: "Uy" },
  { arabic: "بَاب", transliteration: "Bab", uzbek: "Eshik", category: "Uy" },
  { arabic: "نَافِذَة", transliteration: "Nafidhah", uzbek: "Deraza", category: "Uy" },
  { arabic: "غُرْفَة", transliteration: "Ghurfah", uzbek: "Xona", category: "Uy" },
  { arabic: "مَطْبَخ", transliteration: "Matbakh", uzbek: "Oshxona", category: "Uy" },
  { arabic: "حَمَّام", transliteration: "Hammam", uzbek: "Hammom", category: "Uy" },
  { arabic: "سَرِير", transliteration: "Sarir", uzbek: "Karavot", category: "Uy" },
  { arabic: "طَاوِلَة", transliteration: "Tawilah", uzbek: "Stol", category: "Uy" },
  { arabic: "كُرْسِيّ", transliteration: "Kursiyy", uzbek: "Stul", category: "Uy" },
  { arabic: "مِصْبَاح", transliteration: "Misbah", uzbek: "Chiroq", category: "Uy" },

  // Tabiat (Nature)
  { arabic: "شَمْس", transliteration: "Shams", uzbek: "Quyosh", category: "Tabiat" },
  { arabic: "قَمَر", transliteration: "Qamar", uzbek: "Oy", category: "Tabiat" },
  { arabic: "سَمَاء", transliteration: "Sama'", uzbek: "Osmon", category: "Tabiat" },
  { arabic: "أَرْض", transliteration: "Ard", uzbek: "Yer", category: "Tabiat" },
  { arabic: "مَاء", transliteration: "Ma'", uzbek: "Suv", category: "Tabiat" },
  { arabic: "نَار", transliteration: "Nar", uzbek: "Olov", category: "Tabiat" },
  { arabic: "شَجَرَة", transliteration: "Shajarah", uzbek: "Daraxt", category: "Tabiat" },
  { arabic: "زَهْرَة", transliteration: "Zahrah", uzbek: "Gul", category: "Tabiat" },
  { arabic: "بَحْر", transliteration: "Bahr", uzbek: "Dengiz", category: "Tabiat" },
  { arabic: "جَبَل", transliteration: "Jabal", uzbek: "Tog'", category: "Tabiat" },

  // Ranglar (Colors)
  { arabic: "أَبْيَض", transliteration: "Abyad", uzbek: "Oq", category: "Ranglar" },
  { arabic: "أَسْوَد", transliteration: "Aswad", uzbek: "Qora", category: "Ranglar" },
  { arabic: "أَحْمَر", transliteration: "Ahmar", uzbek: "Qizil", category: "Ranglar" },
  { arabic: "أَزْرَق", transliteration: "Azraq", uzbek: "Ko'k", category: "Ranglar" },
  { arabic: "أَخْضَر", transliteration: "Akhdar", uzbek: "Yashil", category: "Ranglar" },
  { arabic: "أَصْفَر", transliteration: "Asfar", uzbek: "Sariq", category: "Ranglar" },

  // Sonlar (Numbers)
  { arabic: "وَاحِد", transliteration: "Wahid", uzbek: "Bir", category: "Sonlar" },
  { arabic: "اِثْنَان", transliteration: "Ithnan", uzbek: "Ikki", category: "Sonlar" },
  { arabic: "ثَلَاثَة", transliteration: "Thalathah", uzbek: "Uch", category: "Sonlar" },
  { arabic: "أَرْبَعَة", transliteration: "Arba'ah", uzbek: "To'rt", category: "Sonlar" },
  { arabic: "خَمْسَة", transliteration: "Khamsah", uzbek: "Besh", category: "Sonlar" },
  { arabic: "سِتَّة", transliteration: "Sittah", uzbek: "Olti", category: "Sonlar" },
  { arabic: "سَبْعَة", transliteration: "Sab'ah", uzbek: "Yetti", category: "Sonlar" },
  { arabic: "ثَمَانِيَة", transliteration: "Thamaniyah", uzbek: "Sakkiz", category: "Sonlar" },
  { arabic: "تِسْعَة", transliteration: "Tis'ah", uzbek: "To'qqiz", category: "Sonlar" },
  { arabic: "عَشَرَة", transliteration: "Asharah", uzbek: "O'n", category: "Sonlar" },

  // Vaqt (Time)
  { arabic: "يَوْم", transliteration: "Yawm", uzbek: "Kun", category: "Vaqt" },
  { arabic: "أُسْبُوع", transliteration: "Usbu'", uzbek: "Hafta", category: "Vaqt" },
  { arabic: "شَهْر", transliteration: "Shahr", uzbek: "Oy", category: "Vaqt" },
  { arabic: "سَنَة", transliteration: "Sanah", uzbek: "Yil", category: "Vaqt" },
  { arabic: "سَاعَة", transliteration: "Sa'ah", uzbek: "Soat", category: "Vaqt" },
  { arabic: "دَقِيقَة", transliteration: "Daqiqah", uzbek: "Daqiqa", category: "Vaqt" },
  { arabic: "صَبَاح", transliteration: "Sabah", uzbek: "Ertalab", category: "Vaqt" },
  { arabic: "مَسَاء", transliteration: "Masa'", uzbek: "Kechqurun", category: "Vaqt" },
  { arabic: "لَيْل", transliteration: "Layl", uzbek: "Tun", category: "Vaqt" },

  // Ovqat (Food)
  { arabic: "خُبْز", transliteration: "Khubz", uzbek: "Non", category: "Ovqat" },
  { arabic: "لَحْم", transliteration: "Lahm", uzbek: "Go'sht", category: "Ovqat" },
  { arabic: "أَرُزّ", transliteration: "Aruzz", uzbek: "Guruch", category: "Ovqat" },
  { arabic: "حَلِيب", transliteration: "Halib", uzbek: "Sut", category: "Ovqat" },
  { arabic: "شَاي", transliteration: "Shay", uzbek: "Choy", category: "Ovqat" },
  { arabic: "قَهْوَة", transliteration: "Qahwah", uzbek: "Qahva", category: "Ovqat" },
  { arabic: "تُفَّاح", transliteration: "Tuffah", uzbek: "Olma", category: "Ovqat" },
  { arabic: "مَوْز", transliteration: "Mawz", uzbek: "Banan", category: "Ovqat" },
  { arabic: "بُرْتُقَال", transliteration: "Burtuqal", uzbek: "Apelsin", category: "Ovqat" },
  { arabic: "عِنَب", transliteration: "Inab", uzbek: "Uzum", category: "Ovqat" },

  // Tan a'zolari (Body parts)
  { arabic: "رَأْس", transliteration: "Ra's", uzbek: "Bosh", category: "Tana" },
  { arabic: "عَيْن", transliteration: "Ayn", uzbek: "Ko'z", category: "Tana" },
  { arabic: "أُذُن", transliteration: "Udhun", uzbek: "Quloq", category: "Tana" },
  { arabic: "أَنْف", transliteration: "Anf", uzbek: "Burun", category: "Tana" },
  { arabic: "فَم", transliteration: "Fam", uzbek: "Og'iz", category: "Tana" },
  { arabic: "يَد", transliteration: "Yad", uzbek: "Qo'l", category: "Tana" },
  { arabic: "رِجْل", transliteration: "Rijl", uzbek: "Oyoq", category: "Tana" },
  { arabic: "قَلْب", transliteration: "Qalb", uzbek: "Yurak", category: "Tana" },

  // Hayvonlar (Animals)
  { arabic: "كَلْب", transliteration: "Kalb", uzbek: "Kuchuk", category: "Hayvonlar" },
  { arabic: "قِطَّة", transliteration: "Qittah", uzbek: "Mushuk", category: "Hayvonlar" },
  { arabic: "حِصَان", transliteration: "Hisan", uzbek: "Ot", category: "Hayvonlar" },
  { arabic: "جَمَل", transliteration: "Jamal", uzbek: "Tuya", category: "Hayvonlar" },
  { arabic: "أَسَد", transliteration: "Asad", uzbek: "Sher", category: "Hayvonlar" },
  { arabic: "طَائِر", transliteration: "Ta'ir", uzbek: "Qush", category: "Hayvonlar" },
  { arabic: "سَمَكَة", transliteration: "Samakah", uzbek: "Baliq", category: "Hayvonlar" },
  { arabic: "فِيل", transliteration: "Fil", uzbek: "Fil", category: "Hayvonlar" },

  // Maktab (School)
  { arabic: "كِتَاب", transliteration: "Kitab", uzbek: "Kitob", category: "Maktab" },
  { arabic: "قَلَم", transliteration: "Qalam", uzbek: "Qalam", category: "Maktab" },
  { arabic: "دَفْتَر", transliteration: "Daftar", uzbek: "Daftar", category: "Maktab" },
  { arabic: "مَدْرَسَة", transliteration: "Madrasah", uzbek: "Maktab", category: "Maktab" },
  { arabic: "مُعَلِّم", transliteration: "Mu'allim", uzbek: "O'qituvchi", category: "Maktab" },
  { arabic: "طَالِب", transliteration: "Talib", uzbek: "Talaba", category: "Maktab" },
  { arabic: "سَبُّورَة", transliteration: "Sabburah", uzbek: "Doska", category: "Maktab" },
  { arabic: "حَقِيبَة", transliteration: "Haqibah", uzbek: "Sumka", category: "Maktab" },

  // Sifatlar (Adjectives)
  { arabic: "كَبِير", transliteration: "Kabir", uzbek: "Katta", category: "Sifatlar" },
  { arabic: "صَغِير", transliteration: "Saghir", uzbek: "Kichik", category: "Sifatlar" },
  { arabic: "جَمِيل", transliteration: "Jamil", uzbek: "Chiroyli", category: "Sifatlar" },
  { arabic: "قَبِيح", transliteration: "Qabih", uzbek: "Xunuk", category: "Sifatlar" },
  { arabic: "طَوِيل", transliteration: "Tawil", uzbek: "Uzun", category: "Sifatlar" },
  { arabic: "قَصِير", transliteration: "Qasir", uzbek: "Qisqa", category: "Sifatlar" },
  { arabic: "جَدِيد", transliteration: "Jadid", uzbek: "Yangi", category: "Sifatlar" },
  { arabic: "قَدِيم", transliteration: "Qadim", uzbek: "Eski", category: "Sifatlar" },
  { arabic: "سَرِيع", transliteration: "Sari'", uzbek: "Tez", category: "Sifatlar" },
  { arabic: "بَطِيء", transliteration: "Bati'", uzbek: "Sekin", category: "Sifatlar" },
  { arabic: "قَوِيّ", transliteration: "Qawiyy", uzbek: "Kuchli", category: "Sifatlar" },
  { arabic: "ضَعِيف", transliteration: "Da'if", uzbek: "Kuchsiz", category: "Sifatlar" },
  { arabic: "غَنِيّ", transliteration: "Ghaniyy", uzbek: "Boy", category: "Sifatlar" },
  { arabic: "فَقِير", transliteration: "Faqir", uzbek: "Kambag'al", category: "Sifatlar" },
  { arabic: "سَعِيد", transliteration: "Sa'id", uzbek: "Baxtli", category: "Sifatlar" },
  { arabic: "حَزِين", transliteration: "Hazin", uzbek: "G'amgin", category: "Sifatlar" },

  // Fe'llar (Verbs)
  { arabic: "ذَهَبَ", transliteration: "Dhahaba", uzbek: "Bormoq", category: "Fe'llar" },
  { arabic: "جَاءَ", transliteration: "Ja'a", uzbek: "Kelmoq", category: "Fe'llar" },
  { arabic: "أَكَلَ", transliteration: "Akala", uzbek: "Yemoq", category: "Fe'llar" },
  { arabic: "شَرِبَ", transliteration: "Shariba", uzbek: "Ichmoq", category: "Fe'llar" },
  { arabic: "نَامَ", transliteration: "Nama", uzbek: "Uxlamoq", category: "Fe'llar" },
  { arabic: "قَرَأَ", transliteration: "Qara'a", uzbek: "O'qimoq", category: "Fe'llar" },
  { arabic: "كَتَبَ", transliteration: "Kataba", uzbek: "Yozmoq", category: "Fe'llar" },
  { arabic: "فَهِمَ", transliteration: "Fahima", uzbek: "Tushunmoq", category: "Fe'llar" },
  { arabic: "عَلِمَ", transliteration: "Alima", uzbek: "Bilmoq", category: "Fe'llar" },
  { arabic: "عَمِلَ", transliteration: "Amila", uzbek: "Ishlamoq", category: "Fe'llar" },
  { arabic: "جَلَسَ", transliteration: "Jalasa", uzbek: "O'tirmoq", category: "Fe'llar" },
  { arabic: "قَامَ", transliteration: "Qama", uzbek: "Turmoq", category: "Fe'llar" },
  { arabic: "رَأَى", transliteration: "Ra'a", uzbek: "Ko'rmoq", category: "Fe'llar" },
  { arabic: "سَمِعَ", transliteration: "Sami'a", uzbek: "Eshitmoq", category: "Fe'llar" },
  { arabic: "قَالَ", transliteration: "Qala", uzbek: "Aytmoq", category: "Fe'llar" },
  { arabic: "سَأَلَ", transliteration: "Sa'ala", uzbek: "So'ramoq", category: "Fe'llar" },

  // Joylar (Places)
  { arabic: "مَدِينَة", transliteration: "Madinah", uzbek: "Shahar", category: "Joylar" },
  { arabic: "قَرْيَة", transliteration: "Qaryah", uzbek: "Qishloq", category: "Joylar" },
  { arabic: "مَسْجِد", transliteration: "Masjid", uzbek: "Masjid", category: "Joylar" },
  { arabic: "سُوق", transliteration: "Suq", uzbek: "Bozor", category: "Joylar" },
  { arabic: "مُسْتَشْفَى", transliteration: "Mustashfa", uzbek: "Kasalxona", category: "Joylar" },
  { arabic: "مَطَار", transliteration: "Matar", uzbek: "Aeroport", category: "Joylar" },
  { arabic: "حَدِيقَة", transliteration: "Hadiqah", uzbek: "Bog'", category: "Joylar" },
  { arabic: "مَكْتَب", transliteration: "Maktab", uzbek: "Ofis", category: "Joylar" },

  // Kasblar (Professions)
  { arabic: "طَبِيب", transliteration: "Tabib", uzbek: "Shifokor", category: "Kasblar" },
  { arabic: "مُهَنْدِس", transliteration: "Muhandis", uzbek: "Muhandis", category: "Kasblar" },
  { arabic: "طَيَّار", transliteration: "Tayyar", uzbek: "Uchuvchi", category: "Kasblar" },
  { arabic: "شُرْطِيّ", transliteration: "Shurtiyy", uzbek: "Politsiyachi", category: "Kasblar" },
  { arabic: "فَلَّاح", transliteration: "Fallah", uzbek: "Dehqon", category: "Kasblar" },
  { arabic: "تَاجِر", transliteration: "Tajir", uzbek: "Savdogar", category: "Kasblar" },
  { arabic: "طَبَّاخ", transliteration: "Tabbakh", uzbek: "Oshpaz", category: "Kasblar" },
  { arabic: "خَيَّاط", transliteration: "Khayyat", uzbek: "Tikuvchi", category: "Kasblar" },

  // Kiyimlar (Clothes)
  { arabic: "قَمِيص", transliteration: "Qamis", uzbek: "Ko'ylak", category: "Kiyimlar" },
  { arabic: "سِرْوَال", transliteration: "Sirwal", uzbek: "Shim", category: "Kiyimlar" },
  { arabic: "فُسْتَان", transliteration: "Fustan", uzbek: "Ko'ylak (ayollar)", category: "Kiyimlar" },
  { arabic: "حِذَاء", transliteration: "Hidha'", uzbek: "Oyoq kiyim", category: "Kiyimlar" },
  { arabic: "قُبَّعَة", transliteration: "Qubba'ah", uzbek: "Shlyapa", category: "Kiyimlar" },
  { arabic: "نَظَّارَة", transliteration: "Nazzarah", uzbek: "Ko'zoynak", category: "Kiyimlar" },

  // Transport
  { arabic: "سَيَّارَة", transliteration: "Sayyarah", uzbek: "Mashina", category: "Transport" },
  { arabic: "حَافِلَة", transliteration: "Hafilah", uzbek: "Avtobus", category: "Transport" },
  { arabic: "دَرَّاجَة", transliteration: "Darrajah", uzbek: "Velosiped", category: "Transport" },
  { arabic: "قِطَار", transliteration: "Qitar", uzbek: "Poezd", category: "Transport" },
  { arabic: "طَائِرَة", transliteration: "Ta'irah", uzbek: "Samolyot", category: "Transport" },
  { arabic: "سَفِينَة", transliteration: "Safinah", uzbek: "Kema", category: "Transport" },

  // Diniy (Religious)
  { arabic: "اللَّه", transliteration: "Allah", uzbek: "Alloh", category: "Din" },
  { arabic: "رَسُول", transliteration: "Rasul", uzbek: "Payg'ambar", category: "Din" },
  { arabic: "قُرْآن", transliteration: "Qur'an", uzbek: "Qur'on", category: "Din" },
  { arabic: "إِيمَان", transliteration: "Iman", uzbek: "Iymon", category: "Din" },
  { arabic: "صَلَاة", transliteration: "Salah", uzbek: "Namoz", category: "Din" },
  { arabic: "صَوْم", transliteration: "Sawm", uzbek: "Ro'za", category: "Din" },
  { arabic: "زَكَاة", transliteration: "Zakah", uzbek: "Zakot", category: "Din" },
  { arabic: "حَجّ", transliteration: "Hajj", uzbek: "Haj", category: "Din" },
  { arabic: "جَنَّة", transliteration: "Jannah", uzbek: "Jannat", category: "Din" },
  { arabic: "نَار", transliteration: "Nar", uzbek: "Do'zax", category: "Din" },
  { arabic: "مَلَك", transliteration: "Malak", uzbek: "Farishta", category: "Din" },
  { arabic: "دُعَاء", transliteration: "Du'a", uzbek: "Duo", category: "Din" },

  // Qo'shimcha (Extra)
  { arabic: "مُشْكِلَة", transliteration: "Mushkilah", uzbek: "Muammo", category: "Boshqa" },
  { arabic: "حَلّ", transliteration: "Hall", uzbek: "Yechim", category: "Boshqa" },
  { arabic: "فِكْرَة", transliteration: "Fikrah", uzbek: "G'oya", category: "Boshqa" },
  { arabic: "سُؤَال", transliteration: "Su'al", uzbek: "Savol", category: "Boshqa" },
  { arabic: "جَوَاب", transliteration: "Jawab", uzbek: "Javob", category: "Boshqa" },
  { arabic: "مَوْضُوع", transliteration: "Mawdu'", uzbek: "Mavzu", category: "Boshqa" },
  { arabic: "قِصَّة", transliteration: "Qissah", uzbek: "Hikoya", category: "Boshqa" },
  { arabic: "خَبَر", transliteration: "Khabar", uzbek: "Xabar", category: "Boshqa" },
  { arabic: "رِسَالَة", transliteration: "Risalah", uzbek: "Xat", category: "Boshqa" },
  { arabic: "هَاتِف", transliteration: "Hatif", uzbek: "Telefon", category: "Boshqa" },
  { arabic: "حَاسُوب", transliteration: "Hasub", uzbek: "Kompyuter", category: "Boshqa" },
  { arabic: "تِلْفَاز", transliteration: "Tilfaz", uzbek: "Televizor", category: "Boshqa" },
];
