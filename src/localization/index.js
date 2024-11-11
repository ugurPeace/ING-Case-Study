import en from "./en.js";
import tr from "./tr.js";

const translations = {
  en,
  tr,
};

let currentLanguage = "en"; // Varsayılan dil

// Dil değişimini ayarlayan fonksiyon
export const setLanguage = (lang) => {
  if (translations[lang]) {
    currentLanguage = lang;
    localStorage.setItem("language", lang); // Kullanıcının dil seçimini sakla

    // Dil değişimi olduğunda event tetikle
    document.dispatchEvent(
      new CustomEvent("language-changed", { detail: { language: lang } })
    );
  } else {
    console.warn(`Language ${lang} not supported.`);
  }
};

// Çeviri fonksiyonu
export const t = (key) => {
  return translations[currentLanguage][key] || key;
};

// Uygulama yüklendiğinde, saklanan dil tercihini kontrol et
const savedLanguage = localStorage.getItem("language");
if (savedLanguage && translations[savedLanguage]) {
  currentLanguage = savedLanguage;
  // Eğer saklanan dil varsa, dil değişikliğini hemen uygula
  document.dispatchEvent(
    new CustomEvent("language-changed", {
      detail: { language: currentLanguage },
    })
  );
}
