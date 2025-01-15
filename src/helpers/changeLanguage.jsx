import Cookies from "js-cookie";
export const changeLanguage = (i18n, language) => {
    i18n.changeLanguage(language);
    Cookies.set('language', language, { expires: 7 }); // Save for a week
};