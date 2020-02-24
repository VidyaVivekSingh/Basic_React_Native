import ReactNative from 'react-native';
import I18n from 'react-native-i18n';
import moment from 'moment';

// Import all locales
import en from '../../../assets/locales/en.json';
import hi from '../../../assets/locales/hi.json';

// Should the app fallback to English if user locale doesn't exists
I18n.fallbacks = true;

// Define the supported translations
I18n.translations = {
  en,
  hi
};

const currentLocale = I18n.currentLocale();
// Is it a RTL language?
export const isRTL = currentLocale.indexOf('he') === 0 || currentLocale.indexOf('ar') === 0;

// Allow RTL alignment in RTL languages
ReactNative.I18nManager.allowRTL(isRTL);
if (currentLocale.indexOf('hi') === 0) {
  /* eslint-disable global-require */
  require('moment/locale/hi.js');
  /* eslint-enable global-require */
  moment.locale('hi');
} else {
  moment.locale('en');
}

// The method we'll use instead of a regular string
export function moments() {
  return moment().format('LL');
}
// The method we'll use instead of a regular string
export function getLabel(name, params = {}) {
  return I18n.t(name, params);
}

export default I18n;
