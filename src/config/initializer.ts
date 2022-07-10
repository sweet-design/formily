import Vue from 'vue';
import config from './default.config';
import types from '@/store/types';
import { AppModule } from '@/store/modules/app';
import { printANSI } from '@/utils/screenLog';
import { updateTheme, updateColorWeak } from '@/components/container/SettingDrawer/settingConfig';

export default function Initializer() {
  printANSI(); // please remove this line
  AppModule.SET_HOME(Vue.ls.get(types.config.HOME, config.home));
  AppModule.SET_HOMETYPE(Vue.ls.get(types.config.HOMETYPE, config.homeType));
  AppModule.SET_LAYOUT(Vue.ls.get(types.config.LAYOUT, config.theme.layout));
  AppModule.SET_NAVTHEME(Vue.ls.get(types.config.NAVTHEME, config.theme.navTheme));
  AppModule.SET_PRIMARYCOLOR(Vue.ls.get(types.config.PRIMARYCOLOR, config.theme.primaryColor));
  AppModule.SET_ACCORDION(Vue.ls.get(types.config.ACCORDION, config.theme.accordion));
  AppModule.SET_FIXEDHEADER(Vue.ls.get(types.config.FIXEDHEADER, config.theme.fixedHeader));
  AppModule.SET_FIXSIDERBAR(Vue.ls.get(types.config.FIXSIDERBAR, config.theme.fixSiderbar));
  AppModule.SET_HEADERHEIGHT(Vue.ls.get(types.config.HEADERHEIGHT, config.theme.headerHeight));
  AppModule.SET_WEAK(Vue.ls.get(types.config.WEAK, config.theme.weak));
  AppModule.SET_MULTITAB(Vue.ls.get(types.config.MULTITAB, config.multiTab));

  AppModule.set_lang(Vue.ls.get(types.config.LANG, config.lang));

  if (config.theme.primaryColor !== AppModule.getTheme.primaryColor) {
    updateTheme(AppModule.getTheme.primaryColor, false);
  }

  if (config.theme.weak !== AppModule.getTheme.weak) {
    updateColorWeak(AppModule.getTheme.weak);
  }
}
