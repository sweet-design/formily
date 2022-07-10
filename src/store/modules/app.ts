import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
  MutationAction,
} from 'vuex-module-decorators';
import store from '@/store';
import Vue from 'vue';
import types from '../types';
import { loadLanguageAsync } from '@/locales';

@Module({ namespaced: true, name: 'app', dynamic: true, store })
export default class App extends VuexModule {
  private lang = 'zh-CN';
  private home = 'Analysis';
  private homeType = '0';
  private theme = {
    layout: 'side',
    navTheme: 'light',
    primaryColor: '#1890FF',
    accordion: false,
    fixedHeader: true,
    fixSiderbar: true,
    headerHeight: 48,
    weak: false,
  };
  private multiTab = false;

  get getLang() {
    return this.lang;
  }

  get getHome() {
    return this.home;
  }

  get getHomeType() {
    return this.homeType;
  }

  get getTheme() {
    return this.theme;
  }

  get getMultiTab() {
    return this.multiTab;
  }

  @Mutation
  public SET_LANG(lang: string): void {
    Vue.ls.set(types.config.LANG, lang);
    this.lang = lang;
  }

  @Mutation
  public SET_HOME(home: string): void {
    Vue.ls.set(types.config.HOME, home);
    this.home = home;
  }

  @Mutation
  public SET_HOMETYPE(homeType: string): void {
    Vue.ls.set(types.config.HOMETYPE, homeType);
    this.homeType = homeType;
  }

  @Mutation
  public SET_LAYOUT(layout: string): void {
    Vue.ls.set(types.config.LAYOUT, layout);
    this.theme.layout = layout;
  }

  @Mutation
  public SET_NAVTHEME(navTheme: string): void {
    Vue.ls.set(types.config.NAVTHEME, navTheme);
    this.theme.navTheme = navTheme;
  }

  @Mutation
  public SET_PRIMARYCOLOR(primaryColor: string): void {
    Vue.ls.set(types.config.PRIMARYCOLOR, primaryColor);
    this.theme.primaryColor = primaryColor;
  }

  @Mutation
  public SET_ACCORDION(accordion: boolean): void {
    Vue.ls.set(types.config.ACCORDION, accordion);
    this.theme.accordion = accordion;
  }

  @Mutation
  public SET_FIXEDHEADER(fixedHeader: boolean): void {
    Vue.ls.set(types.config.FIXEDHEADER, fixedHeader);
    this.theme.fixedHeader = fixedHeader;
  }

  @Mutation
  public SET_FIXSIDERBAR(fixSiderbar: boolean): void {
    Vue.ls.set(types.config.FIXSIDERBAR, fixSiderbar);
    this.theme.fixSiderbar = fixSiderbar;
  }

  @Mutation
  public SET_HEADERHEIGHT(headerHeight: number): void {
    Vue.ls.set(types.config.HEADERHEIGHT, headerHeight);
    this.theme.headerHeight = headerHeight;
  }

  @Mutation
  public SET_WEAK(weak: boolean): void {
    Vue.ls.set(types.config.WEAK, weak);
    this.theme.weak = weak;
  }

  @Mutation
  public SET_MULTITAB(multiTab: boolean): void {
    Vue.ls.set(types.config.MULTITAB, multiTab);
    this.multiTab = multiTab;
  }

  @Action({ commit: 'SET_LANG' })
  public async set_lang(lang: string) {
    return await loadLanguageAsync(lang);
  }
}

export const AppModule = getModule(App);
