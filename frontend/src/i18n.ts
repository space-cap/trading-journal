import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ko from './locales/ko.json';
import en from './locales/en.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            ko: { translation: ko },
            en: { translation: en },
        },
        lng: localStorage.getItem('language') || 'ko', // 로컬 스토리지에서 언어 설정 불러오기
        fallbackLng: 'ko', // 기본 언어
        interpolation: {
            escapeValue: false, // React는 XSS 보호를 자동으로 처리
        },
    });

// 언어 변경 시 로컬 스토리지에 저장
i18n.on('languageChanged', (lng) => {
    localStorage.setItem('language', lng);
});

export default i18n;
