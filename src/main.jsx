import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import enTranslations from './translations/en/indexEN';
import vnTranslations from './translations/vi/indexVI';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import Cookies from 'js-cookie';

const defaultLanguage = Cookies.get('language') || 'en';

i18next.init({
  interpolation: { escapeValue: false },
  lng: defaultLanguage,
  resources: {
    en: {
      global: enTranslations
    },
    vi: {
      global: vnTranslations
    },
  },
});
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </StrictMode>,
)
