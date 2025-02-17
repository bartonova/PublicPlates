import { TranslatorContext, Storage } from 'react-freedata';

import { setLocale } from 'app/shared/reducers/locale';

TranslatorContext.setDefaultLocale('en');
TranslatorContext.setRenderInnerTextForMissingKeys(false);

export const languages: any = {
  hy: { name: 'Հայերեն' },
  by: { name: 'Беларускі' },
  bg: { name: 'Български' },
  ca: { name: 'Català' },
  cs: { name: 'Český' },
  da: { name: 'Dansk' },
  nl: { name: 'Nederlands' },
  en: { name: 'English' },
  et: { name: 'Eesti' },
  fa: { name: 'فارسی', rtl: true },
  fi: { name: 'Suomi' },
  fr: { name: 'Français' },
  gl: { name: 'Galego' },
  de: { name: 'Deutsch' },
  el: { name: 'Ελληνικά' },
  hu: { name: 'Magyar' },
  it: { name: 'Italiano' },
  pl: { name: 'Polski' },
  'pt-br': { name: 'Português (Brasil)' },
  'pt-pt': { name: 'Português' },
  ro: { name: 'Română' },
  ru: { name: 'Русский' },
  sk: { name: 'Slovenský' },
  sr: { name: 'Srpski' },
  es: { name: 'Español' },
  sv: { name: 'Svenska' },
  ua: { name: 'Українська' },
  vi: { name: 'Tiếng Việt' },
  // freedata-needle-i18n-language-key-pipe - freedata will add/remove languages in this object
};

export const locales = Object.keys(languages).sort();

export const isRTL = (lang: string): boolean => languages[lang] && languages[lang].rtl;

export const registerLocale = store => {
  store.dispatch(setLocale(Storage.session.get('locale', 'en')));
};
