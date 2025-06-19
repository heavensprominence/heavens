import type { AvailableLocale } from "./i18n-context"

export const availableLocales: AvailableLocale[] = [
  // Major World Languages
  { code: "en", name: "English", nativeName: "English", region: "Global" },
  { code: "zh", name: "Chinese (Simplified)", nativeName: "中文 (简体)", region: "China" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", region: "India" },
  { code: "es", name: "Spanish", nativeName: "Español", region: "Spain & Latin America" },
  { code: "fr", name: "French", nativeName: "Français", region: "France & Francophone" },
  { code: "ar", name: "Arabic", nativeName: "العربية", region: "Middle East & North Africa", rtl: true },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", region: "Bangladesh & India" },
  { code: "pt", name: "Portuguese", nativeName: "Português", region: "Brazil & Portugal" },
  { code: "ru", name: "Russian", nativeName: "Русский", region: "Russia & CIS" },
  { code: "ja", name: "Japanese", nativeName: "日本語", region: "Japan" },

  // European Languages
  { code: "de", name: "German", nativeName: "Deutsch", region: "Germany & Austria" },
  { code: "ko", name: "Korean", nativeName: "한국어", region: "South Korea" },
  { code: "it", name: "Italian", nativeName: "Italiano", region: "Italy" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", region: "Turkey" },
  { code: "pl", name: "Polish", nativeName: "Polski", region: "Poland" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", region: "Netherlands" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", region: "Sweden" },
  { code: "da", name: "Danish", nativeName: "Dansk", region: "Denmark" },
  { code: "no", name: "Norwegian", nativeName: "Norsk", region: "Norway" },
  { code: "fi", name: "Finnish", nativeName: "Suomi", region: "Finland" },

  // Middle Eastern & Central Asian
  { code: "he", name: "Hebrew", nativeName: "עברית", region: "Israel", rtl: true },
  { code: "fa", name: "Persian", nativeName: "فارسی", region: "Iran", rtl: true },
  { code: "ur", name: "Urdu", nativeName: "اردو", region: "Pakistan", rtl: true },
  { code: "ps", name: "Pashto", nativeName: "پښتو", region: "Afghanistan", rtl: true },
  { code: "ku", name: "Kurdish", nativeName: "کوردی", region: "Kurdistan", rtl: true },
  { code: "az", name: "Azerbaijani", nativeName: "Azərbaycan", region: "Azerbaijan" },
  { code: "ka", name: "Georgian", nativeName: "ქართული", region: "Georgia" },
  { code: "hy", name: "Armenian", nativeName: "Հայերեն", region: "Armenia" },

  // Southeast Asian
  { code: "th", name: "Thai", nativeName: "ไทย", region: "Thailand" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", region: "Vietnam" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", region: "Indonesia" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", region: "Malaysia" },
  { code: "tl", name: "Filipino", nativeName: "Filipino", region: "Philippines" },
  { code: "my", name: "Burmese", nativeName: "မြန်မာ", region: "Myanmar" },
  { code: "km", name: "Khmer", nativeName: "ខ្មែរ", region: "Cambodia" },
  { code: "lo", name: "Lao", nativeName: "ລາວ", region: "Laos" },

  // South Asian
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", region: "Tamil Nadu & Sri Lanka" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", region: "Andhra Pradesh" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", region: "Karnataka" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", region: "Kerala" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", region: "Gujarat" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", region: "Punjab" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", region: "Odisha" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া", region: "Assam" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली", region: "Nepal" },
  { code: "si", name: "Sinhala", nativeName: "සිංහල", region: "Sri Lanka" },

  // African Languages
  { code: "sw", name: "Swahili", nativeName: "Kiswahili", region: "East Africa" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ", region: "Ethiopia" },
  { code: "yo", name: "Yoruba", nativeName: "Yorùbá", region: "Nigeria" },
  { code: "ig", name: "Igbo", nativeName: "Igbo", region: "Nigeria" },
  { code: "ha", name: "Hausa", nativeName: "Hausa", region: "West Africa" },
  { code: "zu", name: "Zulu", nativeName: "isiZulu", region: "South Africa" },
  { code: "xh", name: "Xhosa", nativeName: "isiXhosa", region: "South Africa" },
  { code: "af", name: "Afrikaans", nativeName: "Afrikaans", region: "South Africa" },

  // Eastern European
  { code: "el", name: "Greek", nativeName: "Ελληνικά", region: "Greece" },
  { code: "bg", name: "Bulgarian", nativeName: "Български", region: "Bulgaria" },
  { code: "ro", name: "Romanian", nativeName: "Română", region: "Romania" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar", region: "Hungary" },
  { code: "cs", name: "Czech", nativeName: "Čeština", region: "Czech Republic" },
  { code: "sk", name: "Slovak", nativeName: "Slovenčina", region: "Slovakia" },
  { code: "sl", name: "Slovenian", nativeName: "Slovenščina", region: "Slovenia" },
  { code: "hr", name: "Croatian", nativeName: "Hrvatski", region: "Croatia" },
  { code: "sr", name: "Serbian", nativeName: "Српски", region: "Serbia" },
  { code: "bs", name: "Bosnian", nativeName: "Bosanski", region: "Bosnia" },
  { code: "mk", name: "Macedonian", nativeName: "Македонски", region: "North Macedonia" },
  { code: "sq", name: "Albanian", nativeName: "Shqip", region: "Albania" },
  { code: "mt", name: "Maltese", nativeName: "Malti", region: "Malta" },

  // Nordic & Baltic
  { code: "is", name: "Icelandic", nativeName: "Íslenska", region: "Iceland" },
  { code: "fo", name: "Faroese", nativeName: "Føroyskt", region: "Faroe Islands" },
  { code: "et", name: "Estonian", nativeName: "Eesti", region: "Estonia" },
  { code: "lv", name: "Latvian", nativeName: "Latviešu", region: "Latvia" },
  { code: "lt", name: "Lithuanian", nativeName: "Lietuvių", region: "Lithuania" },

  // Celtic Languages
  { code: "ga", name: "Irish", nativeName: "Gaeilge", region: "Ireland" },
  { code: "gd", name: "Scottish Gaelic", nativeName: "Gàidhlig", region: "Scotland" },
  { code: "cy", name: "Welsh", nativeName: "Cymraeg", region: "Wales" },
  { code: "br", name: "Breton", nativeName: "Brezhoneg", region: "Brittany" },
  { code: "kw", name: "Cornish", nativeName: "Kernewek", region: "Cornwall" },

  // Regional European
  { code: "eu", name: "Basque", nativeName: "Euskera", region: "Basque Country" },
  { code: "ca", name: "Catalan", nativeName: "Català", region: "Catalonia" },
  { code: "gl", name: "Galician", nativeName: "Galego", region: "Galicia" },
  { code: "oc", name: "Occitan", nativeName: "Occitan", region: "Southern France" },
  { code: "co", name: "Corsican", nativeName: "Corsu", region: "Corsica" },
  { code: "sc", name: "Sardinian", nativeName: "Sardu", region: "Sardinia" },

  // Central Asian & Caucasian
  { code: "kk", name: "Kazakh", nativeName: "Қазақша", region: "Kazakhstan" },
  { code: "ky", name: "Kyrgyz", nativeName: "Кыргызча", region: "Kyrgyzstan" },
  { code: "uz", name: "Uzbek", nativeName: "O'zbek", region: "Uzbekistan" },
  { code: "tk", name: "Turkmen", nativeName: "Türkmen", region: "Turkmenistan" },
  { code: "tg", name: "Tajik", nativeName: "Тоҷикӣ", region: "Tajikistan" },
  { code: "mn", name: "Mongolian", nativeName: "Монгол", region: "Mongolia" },

  // East Asian
  { code: "bo", name: "Tibetan", nativeName: "བོད་ཡིག", region: "Tibet" },

  // Eastern European (Slavic)
  { code: "be", name: "Belarusian", nativeName: "Беларуская", region: "Belarus" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", region: "Ukraine" },
]
