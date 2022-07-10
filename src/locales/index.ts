import Vue from 'vue';
import VueI18n from 'vue-i18n';
import moment from 'moment';
import zhCN from './lang/zh-CN'; // default lang

Vue.use(VueI18n);

export const defaultLang = 'zh-CN';

const messages = {
  'zh-CN': {
    ...zhCN,
  },
};

const i18n = new VueI18n({
  silentTranslationWarn: true,
  locale: defaultLang,
  fallbackLocale: defaultLang,
  messages,
});

// 缓存已加载过的语言
const loadedLanguages = [defaultLang];

/**
 * 设置html 语言编码
 * @param lang 语言编码
 * @returns 语言编码
 */
function setI18nLanguage(lang: string) {
  i18n.locale = lang;
  document.querySelector('html')?.setAttribute('lang', lang);
  return lang;
}

/**
 * 异步加载语言包
 * @param lang 语言编码
 * @returns Promise
 */
export function loadLanguageAsync(lang = defaultLang) {
  return new Promise(resolve => {
    if (i18n.locale !== lang) {
      if (!loadedLanguages.includes(lang)) {
        return import(/* webpackChunkName: "lang-[request]" */ `./lang/${lang}`).then(msg => {
          const locale = msg.default;
          i18n.setLocaleMessage(lang, locale);
          loadedLanguages.push(lang);
          moment.updateLocale(locale.momentName, locale.momentLocale);
          return resolve(setI18nLanguage(lang));
        });
      }

      return resolve(setI18nLanguage(lang));
    }

    return resolve(lang);
  });
}

/**
 * 获取语言值
 * @param key 多语言key
 * @returns 语言值
 */
export function i18nRender(key: string) {
  return i18n.t(`${key}`);
}

export default i18n;
