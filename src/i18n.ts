import LanguageDetector from 'i18next-browser-languagedetector';
import i18n from 'i18next';
import en_US from './locales/en_US.json';
import zh_CN from './locales/zh_CN.json';
import ko_KR from './locales/ko_KR.json';
import ja_JP from './locales/ja_JP.json';
import be_BY from './locales/be_BY.json';

import {initReactI18next} from 'react-i18next';

let lang = localStorage.getItem("language");
if (!lang) {
    lang = 'zh_CN';
    localStorage.setItem("language", 'zh_CN');
}
i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en_US: {
                translation: en_US,
            },
            zh_CN: {
                translation: zh_CN,
            },
            ko_KR: {
                translation: ko_KR,
            },
            ja_JP: {
                translation: ja_JP,
            },
            be_BY: {
                translation: be_BY,
            },
        },
        fallbackLng: lang,
        debug: false,
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
